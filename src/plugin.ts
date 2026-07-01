import type { Platform, Tool, ToolRelease } from "@jolter/jdt/types/plugin-api";
import { releases, type JolterRelease } from "./releases";

const TOOL_NAME = "jolter";
const REPOSITORY = "https://github.com/jolterjs/jolter";

export function listTools(): Tool[] {
  return [
    {
      name: TOOL_NAME,
      displayName: "Jolter",
      description: "The Jolter runtime and tooling manager.",
      commands: ["jolter"],
    },
  ];
}

export function resolveTool(
  tool: string,
  selector: string,
  platform: Platform,
): ToolRelease {
  if (tool !== TOOL_NAME) {
    throw new Error("unsupported tool " + tool);
  }

  const release = selectRelease(selector);
  const target = rustTarget(platform);
  const asset = release.assets.find((candidate) => candidate.target === target);
  if (!asset) {
    throw new Error(
      `no Jolter ${release.version} artifact for ${platform.os}/${platform.arch}`,
    );
  }

  return {
    version: release.version,
    url: `${REPOSITORY}/releases/download/v${release.version}/${asset.fileName}`,
    sha256: asset.sha256,
    archiveFormat: asset.archiveFormat,
    stripComponents: 0,
    commands: ["jolter"],
  };
}

export function validateInstalled(
  tool: string,
  version: string,
  root: string,
): boolean {
  return (
    tool === TOOL_NAME &&
    Boolean(root) &&
    releases.some((release) => release.version === version)
  );
}

function selectRelease(selector: string): JolterRelease {
  const normalized = selector.trim().toLowerCase();
  if (!normalized) {
    throw new Error("empty Jolter version selector");
  }

  const sorted = [...releases].sort((left, right) =>
    compareVersions(right.version, left.version),
  );
  if (normalized === "latest" || normalized === "*" || normalized === "x") {
    return sorted.find((release) => !release.prerelease) ?? sorted[0];
  }

  const exact = sorted.find(
    (release) => release.version.toLowerCase() === normalized,
  );
  if (exact) {
    return exact;
  }

  const numericParts = normalized
    .replace(/\.x$/i, "")
    .split(".")
    .filter((part) => part.length > 0 && part !== "x" && part !== "*");
  if (!numericParts.every((part) => /^\d+$/.test(part))) {
    throw new Error("invalid Jolter version selector " + selector);
  }

  const matches = sorted.filter((release) =>
    versionMatchesPrefix(release.version, numericParts),
  );
  const stable = matches.find((release) => !release.prerelease);
  const selected = stable ?? matches[0];
  if (!selected) {
    throw new Error("no Jolter version matches " + selector);
  }
  return selected;
}

function versionMatchesPrefix(version: string, parts: string[]): boolean {
  const core = version.split("-")[0].split(".");
  return parts.every((part, index) => core[index] === part);
}

function rustTarget(platform: Platform): string {
  const os = platform.os.toLowerCase();
  const arch = platform.arch.toLowerCase();

  const rustArch =
    arch === "x64" || arch === "x86_64" || arch === "amd64"
      ? "x86_64"
      : arch === "arm64" || arch === "aarch64"
        ? "aarch64"
        : null;
  if (!rustArch) {
    throw new Error("unsupported architecture " + platform.arch);
  }

  if (os === "darwin" || os === "macos" || os === "mac") {
    return `${rustArch}-apple-darwin`;
  }
  if (os === "linux") {
    return `${rustArch}-unknown-linux-gnu`;
  }
  if (os === "win32" || os === "windows") {
    return `${rustArch}-pc-windows-msvc`;
  }
  throw new Error("unsupported operating system " + platform.os);
}

function compareVersions(left: string, right: string): number {
  const leftParsed = parseVersion(left);
  const rightParsed = parseVersion(right);
  for (const key of ["major", "minor", "patch"] as const) {
    const difference = leftParsed[key] - rightParsed[key];
    if (difference !== 0) {
      return difference;
    }
  }
  if (!leftParsed.pre.length && rightParsed.pre.length) return 1;
  if (leftParsed.pre.length && !rightParsed.pre.length) return -1;
  return comparePrerelease(leftParsed.pre, rightParsed.pre);
}

function parseVersion(value: string): {
  major: number;
  minor: number;
  patch: number;
  pre: string[];
} {
  const match = value.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/);
  if (!match) {
    throw new Error("invalid Jolter release version " + value);
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    pre: match[4]?.split(".") ?? [],
  };
}

function comparePrerelease(left: string[], right: string[]): number {
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
