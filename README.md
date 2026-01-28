# NextSweeper

A modern reimplementation of Minesweeper with a few extras.

## Features

- The classic game in its full glory
- Mark multiple cells at once: as flags or as zones
- Seeded field generation - share the boards you played with others!
- Local playtime stats and high scores
- Dark mode
- More coming soon!

## Development & deployment

This project is deployed with Cloudflare Workers. Apart from the OpenNext adapter and Wrangler dependencies, the project doesn't depend on Cloudflare infrastructure so it can be deployed anywhere.

Preview the project in a Workers environment:

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
# or
bun preview
```

## License

This project is distributed under the [MIT](LICENSE) license.
