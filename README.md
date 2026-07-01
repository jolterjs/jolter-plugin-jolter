# jolter-plugin-jolter

The official Jolter plugin for installing Jolter itself from
https://github.com/jolterjs/jolter release artifacts.

## Development

```sh
git clone https://github.com/jolterjs/jdt.git .deps/jdt
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

## Automation

The daily `Auto-update Jolter releases` workflow runs at midnight UTC. It uses
`jolterbot <292917661+jolterbot@users.noreply.github.com>` with
`secrets.JOLTERBOT_TOKEN` to refresh `src/releases.ts`, bump the plugin patch
version, commit the catalog update, build `dist` with `jdt pack`, and publish a
matching GitHub release.
