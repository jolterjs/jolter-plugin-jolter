# Contributing

Thanks for helping improve `jolter-plugin-jolter`.

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

`src/releases.ts` is generated. Update it with `bun run update:releases`
instead of editing release entries by hand.

## Pull Requests

- Keep changes focused.
- Run `bun run format:check` and `bun run validate` before opening a PR.
- Include release-catalog changes only when they come from published Jolter
  GitHub release artifacts.
- Do not commit secrets, personal tokens, or local machine paths.

## Releases

Daily automation checks for new Jolter release artifacts. When the generated
catalog changes, the workflow bumps the plugin patch version, commits the
source changes as `jolterbot`, builds the plugin with `jdt pack`, and publishes
a matching GitHub release.
