# HyperAPI Tasq Driver

[![npm version](https://img.shields.io/npm/v/@hyperapi/driver-tasq.svg)](https://www.npmjs.com/package/@hyperapi/driver-tasq)
[![Open on npmx.dev](https://npmx.dev/api/registry/badge/version/@hyperapi/driver-tasq?style=shieldsio&label=npmx.dev)](https://npmx.dev/package/@hyperapi/driver-tasq)
[![license](https://img.shields.io/npm/l/@hyperapi/driver-tasq.svg?color=blue)](https://github.com/hyperapi/driver-tasq/blob/main/LICENSE)

A HyperAPI driver that enables microservice communication through [Tasq](https://github.com/kirick-ts/tasq), a Redis-backed task scheduler. This driver bridges HyperAPI's file-based routing and type-safe API development with Tasq's reliable request-response pattern for distributed systems.

## Features

- 🔄 **Microservice Communication** - Use HyperAPI endpoints as Tasq-powered microservices
- 🔒 **Type Safety** - Full TypeScript support with HyperAPI's type inference
- 🧩 **File-based Routing** - Automatic endpoint generation from your file structure
- ⏱️ **Reliable Delivery** - Redis-backed persistence ensures tasks survive service restarts
- 🛡️ **Error Handling** - Structured error responses compatible with HyperAPI's error system

## Installation

```bash
bun i @hyperapi/driver-tasq @hyperapi/core @kirick/tasq redis
# or with pnpm
pnpm add @hyperapi/driver-tasq @hyperapi/core @kirick/tasq redis
# or with npm
npm install @hyperapi/driver-tasq @hyperapi/core @kirick/tasq redis
```

## Quick Start

If you are new to HyperAPI, start with the [HyperAPI Core documentation](https://github.com/hyperapi/core) to understand the basics of creating APIs with file-based routing and type-safe handlers.

Here is how to set up a HyperAPI server using Tasq:

```typescript
import { createClient } from 'redis';
import { createTasq } from '@kirick/tasq';
import { HyperAPI } from '@hyperapi/core';
import { HyperAPITasqDriver } from '@hyperapi/driver-tasq';

// Connect to Redis
const redisClient = createClient();
await redisClient.connect();

// Create Tasq instance
const tasq = await createTasq(redisClient);

// Create the Tasq driver
const driver = new HyperAPITasqDriver(tasq, {
  topic: 'user-service', // Service name other services will call
  threads: 4,            // Process up to 4 requests concurrently
});

// Initialize HyperAPI with the driver
export const hyperApi = new HyperAPI(
  driver,
  // Optional: custom path to API methods
  // new URL('my-api', import.meta.url).pathname
);

console.log('User service is ready to handle Tasq requests');
```

> [!IMPORTANT]
> Unlike HTTP, the Tasq protocol has no verbs such as `GET` or `POST`. HyperAPI core still needs one, so this driver sends every request as `UNDEF`, the pseudo-method core reserves for transports without verbs.
>
> That makes the `+verb` suffix unreachable here. `users+get.ts` registers a `GET` route, so a request for `users` comes back as `[false, { code: 14, description: 'HTTP method not allowed' }]`. Name the file `users.ts` instead.
>
> A dot is not special, though: `users.get.ts` simply defines a method called `users.get`.

### Request Format

When calling a service via Tasq:

```typescript
const [success, result] = await tasq.request(
  'service-name',     // topic
  'method/path',      // API method (maps to file path)
  { key: 'value' },   // arguments (optional)
  { timeout: 10000 }, // how long to wait for a response, ms (optional)
);
```

### Response Format

A plain Tasq server can return any data type, but this driver returns a tuple, to comply with the HyperAPI response type. The first element indicates success or failure — think of it as a 200/non-200 HTTP status code — and the second contains either the result data or the error details, the equivalent of the HTTP body.

```typescript
// Success response type
[true, Record<string, unknown> | unknown[] | undefined];
// Error response type
[false, { code: number, description: string, data?: Record<string, unknown> }];
```

## Error Handling

This driver automatically translates HyperAPI errors into appropriate responses. For example:

```typescript
import { HyperAPIBusyError } from '@hyperapi/core';
// import your HyperAPI instance
import { hyperApi } from '../main.js';

export default hyperApi.module().action((request) => {
  // Check some condition
  if (isLocked()) {
    throw new HyperAPIBusyError();
    // client will receive [ false, { "code": 10, "description": "Endpoint is busy" }]
  }

  // Normal processing
  return { message: "Success" };
  // client will receive [ true, { "message": "Success" }]
});
```

## Stopping the Server

`destroy()` stops the Tasq server and resolves once it has shut down:

```typescript
await hyperApi.destroy();
```

## Contributing

Issues and pull requests are welcome at [our GitHub repository](https://github.com/hyperapi/driver-tasq).
