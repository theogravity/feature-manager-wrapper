# feature-manager-wrapper

A wrapper / abstraction around configuration / feature manager libraries.

Use cases:

- Shift to using [`LaunchDarkly`](https://launchdarkly.com/) from `process.env` (or vice versa)
  * Also support for other feature managers such as [`Configurity`](https://github.com/theogravity/configurity)
- Have a common interface for interacting with feature managers so if you need to swap out the underlying implementation, minimal changes would be required(*).
  * (*) **Feature managers use `context` data differently (or not at all) for custom features and may require adjustments.**

```typescript
import { AsyncBaseFeatureManager, LaunchDarklyServerDriver } from 'feature-manager-wrapper';

class MyFeatureManager extends AsyncBaseFeatureManager {
  constructor(useLaunchDarkly: boolean) {
    // By default, use process.env to maintain our feature flags
    let driver = new EnvironmentDriver();
    
    if (useLaunchDarkly) {
      // Use LaunchDarkly to maintain our feature flags
      driver = new LaunchDarklyServerDriver();
    }

    super(driver);
  }
}

// MyFeatureManager is a facade for the underlying driver
const featureManager = new MyFeatureManager();

// Get a feature flag
const myFeatureValue = await featureManager.getValue('featureFlag', {
  // optional context to pass to LaunchDarkly
  context: {},
  // optional default value to return if the feature flag is not found
  defaultValue: true,
})
```

## Installation

```bash
$ npm install feature-manager-wrapper
```

## Getting started

### (For Typescript users) Map out your feature flags

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

### Select the feature manager service driver to use

`feature-management-wrapper` currently supports the following feature managers:

- `LaunchDarkly` (server): `LaunchDarklyServerDriver`
- `process.env`: `EnvironmentDriver`
- `configurity`: `ConfigurityDriver`
- key / value (where you have a KV mapping from an external source): `SimpleKeyValueDriver`

### Create a feature manager

#### Select the feature manager driver to use

Determine if the feature manager you use is async or sync-based:

- If the APIs you call require `await` to get your feature flags, then it would be async-based.
- If not, then sync-based.

- `LaunchDarklyServerDriver`: async
- `EnvironmentDriver`: sync (+ async)
- `ConfigurityDriver`: sync (+ async)
- `SimpleKeyValueDriver`: sync (+ async)

#### Create a feature manager class

A feature manager class provides the abstraction to work with feature flags and uses one of the above drivers to interact with the specific feature manager service.
 
You will extend one of the managers below to create your own feature manager.

- async: `AsyncBaseFeatureManager`
  * Exposes async operations to fetch feature flags from remote endpoints
  * You can only use async-based drivers with this feature manager (since your codebase would use async operations to access feature flags)
- sync (+ async): `SyncBaseFeatureManager`
  * Exposes sync and async operations to fetch feature flags locally
  * You can use both sync and async-based drivers with this feature manager

##### Example: LaunchDarkly (server-side SDK)

[`LaunchDarkly`](https://launchdarkly.com/) is async-based since we call remote endpoints in the `LaunchDarkly` SDK to fetch feature flags.

Because it's async-based, we use the `AsyncBaseFeatureManager` to create our own feature manager.

```typescript
import { AsyncBaseFeatureManager, LaunchDarklyServerDriver } from 'feature-manager-wrapper';
import { LDClient, LDContext } from "@launchdarkly/node-server-sdk";

interface FeatureFlags {
  featureFlag: boolean;
  anotherFeatureFlag: string;
  featureFlaggedObject: {
    featureFlaggedProperty: number;
  };
}

// The generics are <Flags, Context Format>
// Flags: the interface that maps out the available feature flags
// Context: the interface that maps out the context data to pass to LaunchDarkly
class MyFeatureManager extends AsyncBaseFeatureManager<FeatureFlags, LDContext> {
  constructor(launchDarklyClient: LDClient, defaultContext: LDContext) {
    // Set the LaunchDarkly server driver to the feature manager
    super(new LaunchDarklyServerDriver<FeatureFlags, LDContext>(launchDarklyClient, defaultContext));
  }
}

const featureManager = new MyFeatureManager();

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
```

##### Example: process.env

`process.env` is sync-based since we access the environment variables synchronously.

Because it's sync-based, we use the `SyncBaseFeatureManager` to create our own feature manager.

```typescript
import { AsyncBaseFeatureManager, EnvironmentDriver } from 'feature-manager-wrapper';

// maps to process.env variables
interface FeatureFlags {
  FEATURE_FLAG: boolean;
  ANOTHER_FEATURE_FLAG: string;
  FEATURE_FLAGGED_OBJECT: {
    featureFlaggedProperty: number;
  };
}

class MyFeatureManager extends SyncBaseFeatureManager<FeatureFlags> {
  constructor() {
    super(new EnvironmentDriver<FeatureFlags>());
  }
}

const featureManager = new MyFeatureManager();

// Get a feature flag
const myFeatureValue = await featureManager.getValue('FEATURE_FLAG')

// sync version
const myFeatureValueSync = featureManager.getValueSync('FEATURE_FLAG', {
  // optional default value
  defaultValue: true
})
```

##### Example: Key / Value

Key / Value is sync-based since we access the key / value mapping synchronously.

Because it's sync-based, we use the `SyncBaseFeatureManager` to create our own feature manager.

```typescript
import { SyncBaseFeatureManager, SimpleKeyValueDriver } from 'feature-manager-wrapper';

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

class MyFeatureManager extends SyncBaseFeatureManager<FeatureFlags> {
  constructor() {
    super(new SimpleKeyValueDriver<FeatureFlags>(featureFlags));
  }
}

const featureManager = new MyFeatureManager();

// Get a feature flag
const myFeatureValue = await featureManager.getValue('featureFlag')
const myFeatureValueSync = featureManager.getValueSync('featureFlag')
```

##### Example: Configurity

[`Configurity`](https://github.com/theogravity/configurity) is sync-based since we access the config synchronously.

Because it's sync-based, we use the `SyncBaseFeatureManager` to create our own feature manager.

```typescript
import { SyncBaseFeatureManager, ConfigurityDriver } from 'feature-manager-wrapper';
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

class MyFeatureManager extends SyncBaseFeatureManager<FeatureFlags, ConfigurityContext> {
  constructor() {
    // Load the config file
    const YML_PATH = path.join(__dirname, '..', '__fixtures__', 'configurity.yml')

    // Get the configurity config parser
    const configParser = loadConfigParser<FeatureFlags>(YML_PATH)
  
    super(new ConfigurityDriver<FeatureFlags, ConfigurityContext>(configParser));
  }
}

const featureManager = new MyFeatureManager();

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

## API

### Interface: 'CommonValueParams'

Most of the API methods in the feature manager has an optional `params` parameter that can be passed to the method.

```typescript
/**
 * Common optional parameters for retrieving a flag.
 */
export type CommonValueParams<Flags, K extends keyof Flags> = {
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

### Class: `AsyncBaseFeatureManager`

Must be extended via another class to be used.

```typescript
/**
 * Extend this class to create a feature manager that supports a driver supports only async operations.
 * Acts as a facade for the underlying driver.
 */
abstract class AsyncBaseFeatureManager<
Flags extends Record<string, any>,
Context extends Record<string, any> = Record<string, any>
```

Generic types:
  - `Flags` (optional): the interface that maps out the available feature flags
  - `Context` (optional): the interface that maps out the context data that can be passed when fetching feature flags. Must be supported by the underlying driver.

#### `constructor()`

```typescript
/**
 * @param driver The driver to use for interacting with the feature manager service.
 */
constructor(driver: AsyncFeatureManagerDriver<Flags, Context>)
```

#### `assertGetValue()`

```typescript
/**
 * Asynchronously asserts and retrieves the value of a feature flag based on its key.
 *
 * - Throws an error if the value doesn't exist.
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
 * @returns A Promise resolving to the value of the flag.
 */
  assertGetValue<K extends string & keyof Flags>(
  key: K,
  params?: CommonValueParams<Flags, K>
): Promise<Flags[K]>
```

#### `getValue()`

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

#### `assertGetRawValue()`

```typescript
/**
 * Asynchronously asserts and retrieves the raw value of a feature flag (no conversions applied) based on its key.
 * Throws an error if the value doesn't exist.
 *
 * @param key The key of the feature flag.
 * @param params Optional parameters including default value and context.
 * @returns A Promise resolving to the raw value of the flag.
 */
  assertGetRawValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K]>
```

#### `getRawValue()`

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

#### `getAllValues()`

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

#### `getAllRawValues()`

```typescript
  /**
   * Asynchronously retrieves all feature flag raw values (no conversions applied).
   *
   * @param params Optional parameters including context.
   * @returns A Promise resolving to an object with all flag raw values.
   */
  getAllRawValues(params?: { context?: Context }): Promise<Flags>
```

#### `close()`

```typescript
  /**
 * Asynchronously closes the connection to the feature manager service.
 *
 * @returns A Promise that resolves when the connection is closed.
 */
  close(): Promise<void>
```

### Class: `SyncBaseFeatureManager`

Must be extended via another class to be used.

Also includes the methods in `AsyncBaseFeatureManager`.

```typescript
/**
 * Extend this class to create a feature manager that supports a driver supports both sync and async operations.
 * Acts as a facade for the underlying driver.
 */
export abstract class SyncBaseFeatureManager<
    Flags extends Record<string, any>,
    Context,
  >
```

Generic types:
  - `Flags` (optional): the interface that maps out the available feature flags
  - `Context` (optional): the interface that maps out the context data that can be passed when fetching feature flags. Must be supported by the underlying driver.

#### `constructor()`

```typescript
/**
 * @param driver The driver to use for interacting with the feature manager service.
 */
constructor(driver: SyncFeatureManagerDriver<Flags, Context>)
```

#### `assertGetValueSync()`

```typescript
  /**
 * Synchronously asserts and retrieves the value of a feature flag based on its key.
 *
 * - Throws an error if the value doesn't exist.
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
 * @returns The value of the flag.
 */
assertGetValueSync<K extends string & keyof Flags>(
  key: K,
  params?: CommonValueParams<Flags, K>
): Flags[K]
```

#### `getValueSync()`

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

#### `assertGetRawValueSync()`

```typescript
  /**
 * Synchronously asserts and retrieves the raw value of a feature flag (no conversions applied) based on its key.
 *
 * Throws an error if the value doesn't exist.
 *
 * @param key The key of the feature flag.
 * @param params Optional parameters including default value and context.
 * @returns The raw value of the flag.
 */
assertGetRawValueSync<K extends string & keyof Flags>(
  key: K,
  params?: CommonValueParams<Flags, K>
): Flags[K]
```

#### `getRawValueSync()`

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

#### `getAllValuesSync()`

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

#### `getAllRawValuesSync()`

```typescript
/**
 * Synchronously retrieves all feature flag raw values (no conversions applied).
 *
 * @param params Optional parameters including context.
 * @returns An object with all flag raw values.
 */
  getAllRawValuesSync(params?: { context?: Context }): Flags
```

#### `closeSync()`

```typescript
  /**
   * Closes the connection to the config manager.
   * @returns A Promise that resolves when the connection is closed.
   */
  closeSync(): void
```
