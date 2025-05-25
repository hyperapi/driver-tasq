# HyperAPI Tasq Driver

[![npm version](https://img.shields.io/npm/v/@hyperapi/driver-tasq.svg)](https://www.npmjs.com/package/@hyperapi/driver-tasq)
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

So, here is how to set up a HyperAPI server using Tasq:

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
  topic: 'user-service',  // Service name other services will call
  threads: 4,             // Process up to 4 requests concurrently
});

// Initialize HyperAPI with the driver
const hyperApiCore = new HyperAPI({
  driver,
  // Optional: custom path to API methods
  // root: path.join(import.meta.dir, 'my-api')
});

console.log('User service is ready to handle Tasq requests');
```

> [!NOTE]
> Unlike HTTP, Tasq protocol does not have verbs like `GET`, `POST`, etc. However, HyperAPI core expects it, so Tasq driver uses speacial `UNKNOWN` pseudo-method reserved for non-HTTP API servers.
>
> This means that you **can not** specify HTTP methods in your file names like `[get]`, `[post]`, etc. Just omit them entirely when creating your API modules.

### Request Format

When calling a service via Tasq:

```typescript
const [success, result] = await tasq.request(
  'service-name',   // topic
  'method/path',    // API method (maps to file path)
  { key: 'value' }, // arguments
);
```

### Response Format

Plain Tasq server can return any data type, but HyperAPI Tasq driver returns a tuple to complain with HyperAPI response type. First element indicates success or failure (think about it as of 200/non-200 HTTP status code), and the second element contains either the result data or error details (HTTP body).

```typescript
// Success response type
[true, Record<string, unknown> | unknown[] | undefined];
// Error response type
[false, { code: number, description: string, data?: Record<string, unknown> }];
```

## Error Handling

This driver automatically translates HyperAPI errors into appropriate responses. For example:

```typescript
import { HyperAPIRateLimitError } from '@hyperapi/core';

export default function(request: HyperAPIRequest): HyperAPIResponse {
  // Check some condition
  if (isRateLimited(request.ip)) {
    throw new HyperAPIRateLimitError();
    // will return [false,{"code":7,"description":"Rate limit exceeded"}]
  }

  // Normal processing
  return { message: "Success" };
  // will return [true,{"message":"Success"}]
}
```

## TypeScript Support

Tasq driver does not have extended request type, it uses plain `HyperAPIRequest` type from `@hyperapi/core`. You can still specify your argument types for type safety:

```typescript
export default function(
  request: HyperAPIRequest<{
    id: number;
    name: string;
  }>
): HyperAPIResponse {
  // request.args.id and request.args.name are now properly typed
  return {
    message: `Hello, ${request.args.name} (ID: ${request.args.id})!`
  };
}
```

## Contributing

Issues and pull requests are welcome at [our GitHub repository](https://github.com/hyperapi/driver-tasq).
