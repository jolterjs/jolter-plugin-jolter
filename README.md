# jolter-plugin-jolter

The official Jolter plugin for installing Jolter itself from
https://github.com/jolterjs/jolter release artifacts.

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
