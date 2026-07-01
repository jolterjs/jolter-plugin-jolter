export interface JolterAsset {
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
// Refresh with `bun run update:releases`.
export const releases: JolterRelease[] = [
  {
    version: "0.3.0-rc.1",
    prerelease: true,
    assets: [
      {
        target: "aarch64-apple-darwin",
        fileName: "jolter-v0.3.0-rc.1-aarch64-apple-darwin.tar.gz",
        sha256:
          "bc1f41addae9952313213a9f658fb1b3e98f5997237a0f73f96c571577f57bc3",
        archiveFormat: "tar.gz",
      },
      {
        target: "aarch64-pc-windows-msvc",
        fileName: "jolter-v0.3.0-rc.1-aarch64-pc-windows-msvc.zip",
        sha256:
          "24bdab0900949dad4cdeec709dce0f85621b6a126be6949cad2511ec3e3484fd",
        archiveFormat: "zip",
      },
      {
        target: "aarch64-unknown-linux-gnu",
        fileName: "jolter-v0.3.0-rc.1-aarch64-unknown-linux-gnu.tar.gz",
        sha256:
          "3445d14ae1e7cc6e34de22ec4ab379523b5031aeb66c44afac7d84eafb8b9100",
        archiveFormat: "tar.gz",
      },
      {
        target: "x86_64-apple-darwin",
        fileName: "jolter-v0.3.0-rc.1-x86_64-apple-darwin.tar.gz",
        sha256:
          "362be338883a669399e06eeadc0d583608268e4931a50ac517594e8dca812cd3",
        archiveFormat: "tar.gz",
      },
      {
        target: "x86_64-pc-windows-msvc",
        fileName: "jolter-v0.3.0-rc.1-x86_64-pc-windows-msvc.zip",
        sha256:
          "e8a6ca55a509bb8bf5edb0052f128dd117971560e4c93838195651aa08d97159",
        archiveFormat: "zip",
      },
      {
        target: "x86_64-unknown-linux-gnu",
        fileName: "jolter-v0.3.0-rc.1-x86_64-unknown-linux-gnu.tar.gz",
        sha256:
          "045cc2e3f26dbff1c50cfee3645e6062c11d5c7da8ac8f92e2e49eb7117a4826",
        archiveFormat: "tar.gz",
      },
    ],
  },
];
