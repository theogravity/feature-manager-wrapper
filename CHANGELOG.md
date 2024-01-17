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
