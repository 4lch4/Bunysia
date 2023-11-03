# @4lch4/bunysia

This repo is a demo of how to use [Bun][0], [Elysia][1], and [Doppler][2], to create a simple API with TypeScript.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun start
```

To run with reloading:

```bash
bun dev
```

## Inclusions

This demo also shows how to use the following dependencies:

- [Bun][0]
  - The primary runtime.
- [Elysia][1]
  - The framework for creating the API.
- [Doppler][2]
  - A secrets manager for storing sensitive information.
- [Upstash][3]
  - An amazing host for Upstash, Kafka, and QStash.
- [Redis][4]
  - The best caching DB.
- [Prettier][5]
  - For formatting.
- [p-queue][6]
  - Handles running multiple promises in a queue.
  - Speeds up execution.

## Highlights

The following are some points I felt worth mentioning as for why Bun & Elysia are great:

### Bun

- 1.0.0 released, production ready.
- Resolves ESM/CJS issues without extra work.
- Ridiculously fast.
- Allows me to test TypeScript code without wanting to pull out my hair.
- Automatic imports of `.env` files.
- Features that are faster (and better) than native Node:
  - `Bun.file` Provides stupid simple APIs for interacting with files.
  - `Bun.write` provides a really simple API for writing files.
  - https://bun.sh/docs/runtime/bun-apis
- Bun Builder
  - Built-in transpiler and bundler.
  - Lets you build out rather complex projects.
  - Create executables.
- A built-in driver for SQLite that's ridiculously fast.

### Elysia

- v0.7.0 released, not quite production ready.
- End-to-end type safety.
- Ridiculously fast.
- Extremely useful plugins.
- Body parsing with [TypeBox][0].

[0]: https://bun.sh
[1]: https://elysiajs.com
[2]: https://doppler.com
[3]: https://upstash.com
[4]: https://redis.io/
[5]: https://prettier.io
[6]: https://npmjs.com/package/p-queue
