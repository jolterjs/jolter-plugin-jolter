import fs from "node:fs";

const releaseType = process.argv[2] ?? "patch";
const packageUrl = new URL("../package.json", import.meta.url);
const packageJson = JSON.parse(fs.readFileSync(packageUrl, "utf8"));

packageJson.version = bump(packageJson.version, releaseType);
fs.writeFileSync(packageUrl, JSON.stringify(packageJson, null, 2) + "\n");
console.log(packageJson.version);

function bump(version, releaseType) {
  const match = String(version).match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Cannot bump non-stable package version: ${version}`);
  }

  const parts = match.slice(1).map(Number);
  if (releaseType === "major") {
    return `${parts[0] + 1}.0.0`;
  }
  if (releaseType === "minor") {
    return `${parts[0]}.${parts[1] + 1}.0`;
  }
  if (releaseType === "patch") {
    return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
  }
  throw new Error(`Unsupported release type: ${releaseType}`);
}
