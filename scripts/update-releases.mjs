import fs from "node:fs";

const API_URL =
  "https://api.github.com/repos/jolterjs/jolter/releases?per_page=100";
const ASSET_PATTERN =
  /^jolter-v(?<version>\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)-(?<target>.+)\.(?<extension>tar\.gz|zip)$/;

const response = await fetch(API_URL, {
  headers: {
    Accept: "application/vnd.github+json",
    "User-Agent": "jolter-plugin-jolter-release-updater",
    ...authHeaders(),
  },
});

if (!response.ok) {
  throw new Error(
    `GitHub releases request failed: ${response.status} ${response.statusText}`,
  );
}

const githubReleases = await response.json();
const releases = (
  await Promise.all(
    githubReleases
      .filter((release) => !release.draft)
      .map((release) => releaseFromGithub(release)),
  )
)
  .filter((release) => release.assets.length > 0)
  .sort((left, right) => compareVersions(right.version, left.version));

if (releases.length === 0) {
  throw new Error("No Jolter release artifacts were found.");
}

const contents = `export interface JolterAsset {
  target: string;
  fileName: string;
  sha256: string;
  archiveFormat: "tar.gz" | "zip";
}

export interface JolterRelease {
  version: string;
  prerelease: boolean;
  assets: JolterAsset[];
}

// Generated from https://github.com/jolterjs/jolter releases.
// Refresh with \`bun run update:releases\`.
export const releases: JolterRelease[] = ${JSON.stringify(releases, null, 2)};
`;

fs.writeFileSync(new URL("../src/releases.ts", import.meta.url), contents);

async function releaseFromGithub(release) {
  const version = String(release.tag_name ?? "").replace(/^v/, "");
  const checksumAssets = new Map(
    release.assets
      .filter((asset) => String(asset.name ?? "").endsWith(".sha256"))
      .map((asset) => [String(asset.name), String(asset.browser_download_url)]),
  );
  return {
    version,
    prerelease: Boolean(release.prerelease),
    assets: (
      await Promise.all(
        release.assets.map((asset) =>
          assetFromGithubAsset(asset, version, checksumAssets),
        ),
      )
    )
      .filter(Boolean)
      .sort((left, right) => left.target.localeCompare(right.target)),
  };
}

async function assetFromGithubAsset(asset, version, checksumAssets) {
  const fileName = String(asset.name ?? "");
  if (fileName.endsWith(".sha256")) {
    return null;
  }
  const match = fileName.match(ASSET_PATTERN);
  if (!match || match.groups.version !== version) {
    return null;
  }
  const sha256 =
    sha256FromDigest(asset.digest) ??
    (await sha256FromChecksumAsset(
      checksumAssets.get(`${fileName}.sha256`),
      fileName,
    ));
  if (!sha256) {
    throw new Error(
      `Release asset ${fileName} does not expose a sha256 digest.`,
    );
  }
  return {
    target: match.groups.target,
    fileName,
    sha256,
    archiveFormat: match.groups.extension,
  };
}

function sha256FromDigest(digest) {
  const value = String(digest ?? "");
  const match = value.match(/^sha256:([a-fA-F0-9]{64})$/);
  return match?.[1].toLowerCase() ?? null;
}

async function sha256FromChecksumAsset(url, fileName) {
  if (!url) {
    return null;
  }
  const response = await fetch(url, {
    headers: {
      "User-Agent": "jolter-plugin-jolter-release-updater",
      ...authHeaders(),
    },
  });
  if (!response.ok) {
    throw new Error(
      `Checksum request failed for ${fileName}: ${response.status}`,
    );
  }
  const text = await response.text();
  const match = text.match(/^([a-fA-F0-9]{64})(?:\s+\*?.*)?$/m);
  return match?.[1].toLowerCase() ?? null;
}

function authHeaders() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function compareVersions(left, right) {
  const leftParsed = parseVersion(left);
  const rightParsed = parseVersion(right);
  for (const key of ["major", "minor", "patch"]) {
    const difference = leftParsed[key] - rightParsed[key];
    if (difference !== 0) return difference;
  }
  if (!leftParsed.pre.length && rightParsed.pre.length) return 1;
  if (leftParsed.pre.length && !rightParsed.pre.length) return -1;
  return comparePrerelease(leftParsed.pre, rightParsed.pre);
}

function parseVersion(value) {
  const match = value.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/);
  if (!match) throw new Error("invalid Jolter release version " + value);
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    pre: match[4]?.split(".") ?? [],
  };
}

function comparePrerelease(left, right) {
  const count = Math.max(left.length, right.length);
  for (let index = 0; index < count; index += 1) {
    const leftPart = left[index];
    const rightPart = right[index];
    if (leftPart === undefined) return -1;
    if (rightPart === undefined) return 1;
    if (leftPart === rightPart) continue;
    const leftNumber = /^\d+$/.test(leftPart) ? Number(leftPart) : null;
    const rightNumber = /^\d+$/.test(rightPart) ? Number(rightPart) : null;
    if (leftNumber !== null && rightNumber !== null)
      return leftNumber - rightNumber;
    if (leftNumber !== null) return -1;
    if (rightNumber !== null) return 1;
    return leftPart < rightPart ? -1 : 1;
  }
  return 0;
}
