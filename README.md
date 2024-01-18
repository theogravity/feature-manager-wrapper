# feature-manager-wrapper

[![NPM version](https://img.shields.io/npm/v/feature-manager-wrapper.svg?style=flat-square)](https://www.npmjs.com/package/feature-manager-wrapper) [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A wrapper / abstraction around configuration / feature manager libraries.

Use cases:

- Shift to using [`LaunchDarkly`](https://launchdarkly.com/) from `process.env` (or vice versa)
  * Also support for other feature managers such as [`Configurity`](https://github.com/theogravity/configurity)
- Have a common interface for interacting with feature managers so if you need to swap out the underlying implementation, minimal changes would be required(*).
  * (*) *Feature managers use `context` data differently (or not at all) for custom features and may require adjustments.*

```typescript
// See examples in documentation for working examples
// This example is for illustrative purposes only
import { AsyncFeatureManager, LaunchDarklyServerDriver } from 'feature-manager-wrapper';

// By default, use process.env to maintain our feature flags
let driver = new EnvironmentDriver();

if (process.env.USE_LAUNCH_DARKLY) {
  // Use LaunchDarkly to maintain our feature flags
  driver = new LaunchDarklyServerDriver(...);
}

// Note: EnvironmentDriver supports both sync and async operations, but LaunchDarklyServerDriver only supports async operations, so you'll want to only use non-async methods.
const featureManager = new AsyncFeatureManager(driver);

// Get a feature flag
const myFeatureValue = await featureManager.getValue('featureFlag', {
  // optional context to pass to LaunchDarkly
  context: {},
  // optional default value to return if the feature flag is not found
  defaultValue: true,
})
```

# Table of contents

- [Installation](#installation)
- [Getting started](#getting-started)
  - [(For Typescript users) Map out your feature flags](#for-typescript-users-map-out-your-feature-flags)
  - [Select the feature manager service driver to use](#select-the-feature-manager-service-driver-to-use)
  - [Create a feature manager](#create-a-feature-manager)
    - [Select the feature manager driver to use](#select-the-feature-manager-driver-to-use)
    - [Create an instance of the feature manager](#create-an-instance-of-the-feature-manager)
      - [Example: LaunchDarkly (server-side node SDK)](#example-launchdarkly-server-side-node-sdk)
      - [Example: LaunchDarkly (client-side JS SDK)](#example-launchdarkly-client-side-js-sdk)
      - [Example: process.env](#example-processenv)
      - [Example: Key / Value](#example-key--value)
      - [Example: Configurity](#example-configurity)
- [API](#api)
  - [Interface: 'CommonValueParams'](#interface-commonvalueparams)
  - [Class: `AsyncFeatureManager`](#class-asyncfeaturemanager)
    - [`constructor()`](#constructor)
    - [`assertGetValue()`](#assertgetvalue)
    - [`getValue()`](#getvalue)
    - [`assertGetRawValue()`](#assertgetrawvalue)
    - [`getRawValue()`](#getrawvalue)
    - [`getAllValues()`](#getallvalues)
    - [`getAllRawValues()`](#getallrawvalues)
    - [`close()`](#close)
  - [Class: `SyncFeatureManager`](#class-syncfeaturemanager)
    - [`constructor()`](#constructor)
    - [`assertGetValueSync()`](#assertgetvaluesync)
    - [`getValueSync()`](#getvaluesync)
    - [`assertGetRawValueSync()`](#assertgetrawvaluesync)
    - [`getRawValueSync()`](#getrawvaluesync)
    - [`getAllValuesSync()`](#getallvaluessync)
    - [`getAllRawValuesSync()`](#getallrawvaluessync)
    - [`closeSync()`](#closesync)

# Installation

```bash
$ npm install feature-manager-wrapper
```

# Getting started

## (For Typescript users) Map out your feature flags

Create an interface that maps out the available feature flags. They will
be used for IDE autocompletion when working with the feature manager.

```typescript
interface FeatureFlags {
  featureFlag: boolean;
  anotherFeatureFlag: string;
  featureFlaggedObject: {
    featureFlaggedProperty: number;
  };
}
```

## Select the feature manager service driver to use

`feature-management-wrapper` currently supports the following feature managers:

- `LaunchDarkly` (server): `LaunchDarklyServerDriver`
- `LaunchDarkly` (client): `LaunchDarklyClientDriver`
- `process.env`: `EnvironmentDriver`
- `configurity`: `ConfigurityDriver`
- key / value (where you have a KV mapping from an external source): `SimpleKeyValueDriver`

## Create a feature manager

### Select the feature manager driver to use

Determine if the feature manager you use is async or sync-based:

- If the APIs you call require `await` to get your feature flags, then it would be async-based.
- If not, then sync-based.

Drivers and their (a)sync type:

- `LaunchDarklyServerDriver`: async
- `LaunchDarklyClientDriver`: sync (+ async supported)
- `EnvironmentDriver`: sync (+ async supported)
- `ConfigurityDriver`: sync (+ async supported)
- `SimpleKeyValueDriver`: sync (+ async supported)

### Create an instance of the feature manager

A feature manager uses one of the above drivers to interact with the specific feature manager service.

- async (+ sync) drivers: `AsyncFeatureManager`
  * Only exposes async operations to fetch feature flags from remote endpoints
  * Can use both sync and async drivers (since sync drivers wrap sync operations in a promise for async operations), but operations are limited to async
- sync drivers: `SyncFeatureManager`
  * Exposes both sync and async operations to fetch feature flags locally

*You can switch from `SyncFeatureManager` to `AsyncFeatureManager` if you need to use an async driver, but
not the other way around as conversion to async methods would be necessary.*

#### Example: LaunchDarkly (server-side node SDK)

The [LaunchDarkly Server SDK](https://docs.launchdarkly.com/sdk/server-side/node-js) is async-based since we call remote endpoints to fetch feature flags.

Because it's async-based, we use the `AsyncFeatureManager` to create our own feature manager.

```typescript
import { AsyncFeatureManager, LaunchDarklyServerDriver } from 'feature-manager-wrapper';
import { LDClient, LDContext } from "@launchdarkly/node-server-sdk";

interface FeatureFlags {
  featureFlag: boolean;
  anotherFeatureFlag: string;
  featureFlaggedObject: {
    featureFlaggedProperty: number;
  };
}

// Create your LaunchDarkly client
const launchDarklyClient = LDClient.initialize('sdk-key')

const driver = new LaunchDarklyServerDriver<FeatureFlags, LDContext>(launchDarklyClient, defaultContext)

const featureManager = new AsyncFeatureManager<FeatureFlags, LDContext>(driver);

// Get a feature flag
const myFeatureValue = await featureManager.getValue('featureFlag')

// Get a feature flag with context
const myFeatureValueFromContext = await featureManager.getValue('featureFlag', {
  context: {
    'kind': 'user',
    'key': 'user-key-123abc',
    'name': 'Sandy'
  },
  // optional default value
  defaultValue: true,
})

// Close the connection to the LaunchDarkly service
await featureManager.close()
```

#### Example: LaunchDarkly (client-side JS SDK)

The [client javascript SDK for LaunchDarkly](https://docs.launchdarkly.com/sdk/client-side/javascript) is sync-based since the flags are all fetched on client initialization.

It does not have the ability to use context data for fetching flags.

```typescript
// Can also use AsyncFeatureManager
import { SyncFeatureManager, LaunchDarklyClientDriver } from 'feature-manager-wrapper';
import * as LDClient from 'launchdarkly-js-client-sdk';

interface FeatureFlags {
  featureFlag: boolean;
  anotherFeatureFlag: string;
  featureFlaggedObject: {
    featureFlaggedProperty: number;
  };
}

const context = {
  kind: 'user',
  key: 'context-key-123abc'
};

// Create your LaunchDarkly client
const launchDarklyClient = LDClient.initialize('client-side-id-123abc', context);

const driver = new LaunchDarklyClientDriver<FeatureFlags>(launchDarklyClient)

const featureManager = new SyncFeatureManager<FeatureFlags>(driver);

// Get a feature flag
const myFeatureValue = featureManager.getValueSync('featureFlag')

// Close the connection to the LaunchDarkly service
await featureManager.close()
```

#### Example: process.env

`process.env` is sync-based since we access the environment variables synchronously.

Because it's sync-based, we use the `SyncFeatureManager` to create our own feature manager.

It does not have the ability to use context data for fetching flags.

```typescript
// Can also use AsyncFeatureManager
import { SyncFeatureManager, EnvironmentDriver } from 'feature-manager-wrapper';

// maps to process.env variables
interface FeatureFlags {
  FEATURE_FLAG: boolean;
  ANOTHER_FEATURE_FLAG: string;
  FEATURE_FLAGGED_OBJECT: {
    featureFlaggedProperty: number;
  };
}

const driver = new EnvironmentDriver<FeatureFlags>()

const featureManager = new SyncFeatureManager<FeatureFlags>(driver);

// Get a feature flag
const myFeatureValue = await featureManager.getValue('FEATURE_FLAG')

// sync version
const myFeatureValueSync = featureManager.getValueSync('FEATURE_FLAG', {
  // optional default value
  defaultValue: true
})
```

#### Example: Key / Value

Key / Value is sync-based since we access the key / value mapping synchronously.

Because it's sync-based, we use the `SyncFeatureManager` to create our own feature manager.

It does not have the ability to use context data for fetching flags.

```typescript
// Can also use AsyncFeatureManager
import { SyncFeatureManager, SimpleKeyValueDriver } from 'feature-manager-wrapper';

interface FeatureFlags {
  featureFlag: boolean;
  anotherFeatureFlag: string;
  featureFlaggedObject: {
    featureFlaggedProperty: number;
  };
}

const featureFlags: FeatureFlags = {
  featureFlag: true,
  anotherFeatureFlag: 'hello',
  featureFlaggedObject: {
    featureFlaggedProperty: 123
  }
}

const driver = new SimpleKeyValueDriver<FeatureFlags>(featureFlags)

const featureManager = new SyncFeatureManager<FeatureFlags>(driver);

// Get a feature flag
const myFeatureValue = await featureManager.getValue('featureFlag')
const myFeatureValueSync = featureManager.getValueSync('featureFlag')
```

#### Example: Configurity

[`Configurity`](https://github.com/theogravity/configurity) is sync-based since we access the config synchronously.

Because it's sync-based, we use the `SyncFeatureManager` to create our own feature manager.

```typescript
// Can also use AsyncFeatureManager
import { SyncFeatureManager, ConfigurityDriver } from 'feature-manager-wrapper';
import { loadConfigParser } from 'configurity'

interface FeatureFlags {
  featureFlag: boolean;
  anotherFeatureFlag: string;
  featureFlaggedObject: {
    featureFlaggedProperty: number;
  };
}

// Your custom context definition to access custom feature flags
interface ConfigurityContext {
  environment?: string
}

// Load the config file
const YML_PATH = path.join(__dirname, '..', '__fixtures__', 'configurity.yml')

// Get the configurity config parser
const configParser = loadConfigParser<FeatureFlags>(YML_PATH)

const driver = new ConfigurityDriver<FeatureFlags, ConfigurityContext>(configParser)

const featureManager = new SyncFeatureManager<FeatureFlags, ConfigurityContext>();

// Get a feature flag
const myFeatureValue = await featureManager.getValue('featureFlag')
const myFeatureValueSync = featureManager.getValueSync('featureFlag', {
  // optional context (see Configurity documentation)
  context: {
    environment: 'production'
  },
  // optional default value
  defaultValue: true
})
```

# API

## Interface: 'CommonValueParams'

Most of the API methods in the feature manager has an optional `params` parameter that can be passed to the method.

```typescript
/**
 * Common optional parameters for retrieving a flag.
 */
type CommonValueParams<Flags, K extends keyof Flags> = {
  /**
   * The default value to use if the flag is not found.
   */
  defaultValue?: Flags[K]
  /**
   * The context to use when retrieving the flag.
   */
  context?: any
}
```

## Class: `AsyncFeatureManager`

Use this class to ensure that your feature API calls are only async-based. This is useful if you want to ensure that your codebase is consistent with async operations.

If you are switching to a driver that uses sync operations, you will need to update your feature manager to use the `SyncFeatureManager` class instead.

```typescript
/**
 * Feature manager that supports async and sync drivers.
 * Acts as a facade for the underlying driver, and only exposes async operations.
 */
class AsyncFeatureManager<
Flags extends Record<string, any>,
Context extends Record<string, any> = Record<string, any>
```

Generic types:
  - `Flags` (optional): the interface that maps out the available feature flags
  - `Context` (optional): the interface that maps out the context data that can be passed when fetching feature flags. Must be supported by the underlying driver.

### `constructor()`

```typescript
/**
 * @param driver The driver to use for interacting with the feature manager service.
 */
constructor(driver: AsyncFeatureManagerDriver<Flags, Context>)
```

### `assertGetValue()`

```typescript
/**
 * Asynchronously asserts and retrieves the value of a feature flag based on its key.
 *
 * - Throws an error if the value is null, undefined, or empty string.
 * - Attempts to convert the value based on its probable type (number, boolean, string, object).
 *
 * Examples:
 *
 *  - "true" => true
 *  - "123" => 123
 *  - "{ "foo": "bar" }" => { foo: "bar" }
 *
 * @param key The key of the feature flag.
 * @param params Optional parameters including default value and context.
 * @throws FeatureManagerAssertionError if the value is null, undefined, or empty string.
 * @returns A Promise resolving to the value of the flag.
 */
  assertGetValue<K extends string & keyof Flags>(
  key: K,
  params?: CommonValueParams<Flags, K>
): Promise<Flags[K]>
```

### `getValue()`

```typescript
  /**
 * Asynchronously retrieves the value of a feature flag based on its key.
 *
 * - Returns null if the value is null or undefined.
 * - Attempts to convert the value based on its probable type (number, boolean, string, object).
 *
 * Examples:
 *
 *  - null / undefined => null
 *  - "true" => true
 *  - "123" => 123
 *  - "{ "foo": "bar" }" => { foo: "bar" }
 *
 * @param key The key of the feature flag.
 * @param params Optional parameters including default value and context.
 * @returns A Promise resolving to the value of the flag, or null if not found.
 */
  getValue<K extends string & keyof Flags>(
  key: K,
  params?: CommonValueParams<Flags, K>
): Promise<Flags[K]>
```

### `assertGetRawValue()`

```typescript
/**
 * Asynchronously asserts and retrieves the raw value of a feature flag (no conversions applied) based on its key.
 * Throws an error if the value is null, undefined, or empty string.
 *
 * @param key The key of the feature flag.
 * @param params Optional parameters including default value and context.
 * @throws FeatureManagerAssertionError if the value is null, undefined, or empty string.
 * @returns A Promise resolving to the raw value of the flag.
 */
  assertGetRawValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K]>
```

### `getRawValue()`

```typescript
  /**
   * Asynchronously retrieves the raw value of a feature flag (no conversions applied) based on its key.
   * 
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @returns A Promise resolving to the raw value of the flag, or null if not found.
   */
  getRawValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K] | null>
```

### `getAllValues()`

```typescript
  /**
   * Asynchronously retrieves all feature flag values.
   *
   * - Returns null if the value is null or undefined.
   * - Attempts to convert the value based on its probable type (number, boolean, string, object).
   *
   * Examples:
   *
   *  - null / undefined => null
   *  - "true" => true
   *  - "123" => 123
   *  - "{ "foo": "bar" }" => { foo: "bar" }
   *
   * @param params Optional parameters including context.
   * @returns A Promise resolving to an object with all flag values.
   */
  getAllValues(params?: { context?: Context }): Promise<Flags>
```

### `getAllRawValues()`

```typescript
  /**
   * Asynchronously retrieves all feature flag raw values (no conversions applied).
   *
   * @param params Optional parameters including context.
   * @returns A Promise resolving to an object with all flag raw values.
   */
  getAllRawValues(params?: { context?: Context }): Promise<Flags>
```

### `close()`

```typescript
  /**
 * Asynchronously closes the connection to the feature manager service.
 *
 * @returns A Promise that resolves when the connection is closed.
 */
  close(): Promise<void>
```

## Class: `SyncFeatureManager`

Also includes the methods in `AsyncFeatureManager`.

```typescript
/**
 * Feature manager that only supports sync drivers. Exposes both sync and async operations since async operations are just sync operations wrapped in a promise.
 * Acts as a facade for the underlying driver.
 */
class SyncFeatureManager<
    Flags extends Record<string, any>,
    Context,
  >
```

Generic types:
  - `Flags` (optional): the interface that maps out the available feature flags
  - `Context` (optional): the interface that maps out the context data that can be passed when fetching feature flags. Must be supported by the underlying driver.

### `constructor()`

```typescript
/**
 * @param driver The driver to use for interacting with the feature manager service.
 */
constructor(driver: SyncFeatureManagerDriver<Flags, Context>)
```

### `assertGetValueSync()`

```typescript
  /**
 * Synchronously asserts and retrieves the value of a feature flag based on its key.
 *
 * - Throws an error if the value is null, undefined, or empty string.
 * - Attempts to convert the value based on its probable type (number, boolean, string, object).
 *
 * Examples:
 *
 *  - "true" => true
 *  - "123" => 123
 *  - "{ "foo": "bar" }" => { foo: "bar" }
 *
 * @param key The key of the feature flag.
 * @param params Optional parameters including default value and context.
 * @throws FeatureManagerAssertionError if the value is null, undefined, or empty string.
 * @returns The value of the flag.
 */
assertGetValueSync<K extends string & keyof Flags>(
  key: K,
  params?: CommonValueParams<Flags, K>
): Flags[K]
```

### `getValueSync()`

```typescript
/**
 * Synchronously retrieves the value of a feature flag based on its key.
 *
 * - Returns null if the value is null or undefined.
 * - Attempts to convert the value based on its probable type (number, boolean, string, object).
 *
 * Examples:
 *
 *  - null / undefined => null
 *  - "true" => true
 *  - "123" => 123
 *  - "{ "foo": "bar" }" => { foo: "bar" }
 *
 * @param key The key of the feature flag.
 * @param params Optional parameters including default value and context.
 * @returns The value of the flag, or null if not found.
 */
  getValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] | null
```

### `assertGetRawValueSync()`

```typescript
  /**
 * Synchronously asserts and retrieves the raw value of a feature flag (no conversions applied) based on its key.
 *
 * Throws an error if the value is null, undefined, or empty string.
 *
 * @param key The key of the feature flag.
 * @param params Optional parameters including default value and context.
 * @throws FeatureManagerAssertionError if the value is null, undefined, or empty string.
 * @returns The raw value of the flag.
 */
assertGetRawValueSync<K extends string & keyof Flags>(
  key: K,
  params?: CommonValueParams<Flags, K>
): Flags[K]
```

### `getRawValueSync()`

```typescript
/**
 * Synchronously retrieves the raw value of a feature flag (no conversions applied) based on its key.
 *
 * @param key The key of the feature flag.
 * @param params Optional parameters including default value and context.
 * @returns The raw value of the flag, or null if not found.
 */
  getRawValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] | null
```

### `getAllValuesSync()`

```typescript
/**
 * Synchronously retrieves all feature flag values.
 *
 * - Returns null if the value is null or undefined.
 * - Attempts to convert the value based on its probable type (number, boolean, string, object).
 *
 * Examples:
 *
 *  - null / undefined => null
 *  - "true" => true
 *  - "123" => 123
 *  - "{ "foo": "bar" }" => { foo: "bar" }
 *
 * @param params Optional parameters including context.
 * @returns An object with all flag values.
 */
  getAllValuesSync(params?: { context?: Context }): Flags
```

### `getAllRawValuesSync()`

```typescript
/**
 * Synchronously retrieves all feature flag raw values (no conversions applied).
 *
 * @param params Optional parameters including context.
 * @returns An object with all flag raw values.
 */
  getAllRawValuesSync(params?: { context?: Context }): Flags
```

### `closeSync()`

```typescript
  /**
   * Closes the connection to the config manager.
   * @returns A Promise that resolves when the connection is closed.
   */
  closeSync(): void
```
