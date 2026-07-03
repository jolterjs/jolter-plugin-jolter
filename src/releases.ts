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
    version: "0.3.0-rc.3",
    prerelease: true,
    assets: [
      {
        target: "x86_64-apple-darwin",
        fileName: "jolter-v0.3.0-rc.3-x86_64-apple-darwin.tar.gz",
        sha256:
          "9d85ce802ff99a800718079a05c571e100991557a106d0dace57b63af5e0a892",
        archiveFormat: "tar.gz",
      },
      {
        target: "x86_64-pc-windows-msvc",
        fileName: "jolter-v0.3.0-rc.3-x86_64-pc-windows-msvc.zip",
        sha256:
          "a7940fdf5d89b43ca4a0a0827a34f1635a318b5b5972b139cfe98fe07c25cd8b",
        archiveFormat: "zip",
      },
      {
        target: "x86_64-unknown-linux-gnu",
        fileName: "jolter-v0.3.0-rc.3-x86_64-unknown-linux-gnu.tar.gz",
        sha256:
          "8926726cd03ad81d190dd4d1d1adec7967cd8961ee2d346c2cef1f1f88e45311",
        archiveFormat: "tar.gz",
      },
    ],
  },
  {
    version: "0.3.0-rc.2",
    prerelease: true,
    assets: [
      {
        target: "x86_64-apple-darwin",
        fileName: "jolter-v0.3.0-rc.2-x86_64-apple-darwin.tar.gz",
        sha256:
          "a8b0cd8c87e6c026d73e0a98212bb8fda7554d8fa90befe26e5e985c5939f226",
        archiveFormat: "tar.gz",
      },
      {
        target: "x86_64-pc-windows-msvc",
        fileName: "jolter-v0.3.0-rc.2-x86_64-pc-windows-msvc.zip",
        sha256:
          "db6c0f36758b191829ed427f9748bb4743c5c0ecafc739ed274a012367b48422",
        archiveFormat: "zip",
      },
      {
        target: "x86_64-unknown-linux-gnu",
        fileName: "jolter-v0.3.0-rc.2-x86_64-unknown-linux-gnu.tar.gz",
        sha256:
          "3fd4d73b77bfed731d0da2b16270765537d91c4a6d3bfdcf44ea9d221faaddd4",
        archiveFormat: "tar.gz",
      },
    ],
  },
  {
    version: "0.3.0-rc.1",
    prerelease: true,
    assets: [
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
