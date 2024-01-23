# 3.3.0

- Add `setValueSync` and `setValuesSync` methods to `SimpleKeyValueDriver`

# 3.2.0

- Added `DummyDriver`

# 3.1.0

- Add support for the launch darkly electron client SDK via `LaunchDarklyElectronDriver`

# 3.0.1

- Fix around default value typing on the return type
- Fixes around how the default value is handled when the feature is not found

# 3.0.0

- Improved return type when a default value is provided.
- internal: `toValue()` optimizations

**Breaking Changes**:

- `getValue()` methods will distinguish between a `null` value and an `undefined` value
- Altered behavior of `assert` methods to throw `FeatureManagerAssertionError` instead of `Error`.
- `assert` methods will throw on the following conditions:
  - `null`
  - `undefined`
  - empty string

# 2.1.3

Fix type issue in `SyncFeatureManagerDriver.ts`

# 2.1.2

Fix types path in `package.json`

# 2.1.1

- Add support for the LaunchDarkly Javascript Client SDK
  * Driver is called `LaunchDarklyClientDriver`

# 2.0.2

Readme and usage updates.

# 2.0.1

Readme updates.

# 2.0.0

Improved developer experience.

- No longer required to extend `AsyncBaseFeatureManager` or `SyncBaseFeatureManager` classes.
- Removed `abstract` from `AsyncFeatureManager` and `SyncFeatureManager` classes.

## Breaking changes

- Renamed `AsyncBaseFeatureManager` -> `AsyncFeatureManager`
- Renamed `SyncBaseFeatureManager` -> `SyncFeatureManager`
