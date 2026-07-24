# jolter-plugin-jolter

The official Jolter plugin for installing Jolter itself from
https://github.com/jolterjs/jolter release artifacts.

## Installation

This plugin can be installed from the [Jolter registry](https://plugins.jolter.dev/) using the following command:

```sh
jolter plugin add jolter
```

Alternatively you can install the plugin via the canonical plugin name:

```sh
jolter plugin add @jolterjs/jolter
```

## Development

```sh
bun install
bun run update:releases
bun run run:list
bun run run:resolve
bun run validate
bun run pack
```

`src/releases.ts` is generated from GitHub release metadata. The plugin resolves
the `jolter` tool to the matching archive for the requested operating system and
architecture, then returns the archive URL, SHA-256, format, and command list to
Jolter.
