import { CommonValueParams, ValueReturnType } from './common.types'

/**
 * Interface for sync-based feature flag accessors.
 */
export interface ISyncFeatureManager<
  Flags extends Record<string, any>,
  Context,
> {
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
   * @returns The value of the flag.
   */
  assertGetValueSync<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(
    key: K,
    params?: Params
  ): ValueReturnType<Flags, K, Params>

  /**
   * Synchronously retrieves the value of a feature flag based on its key.
   *
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
  getValueSync<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(
    key: K,
    params?: Params
  ): ValueReturnType<Flags, K, Params>

  /**
   * Synchronously asserts and retrieves the raw value of a feature flag (no conversions applied) based on its key.
   *
   * Throws an error if the value is null, undefined, or empty string.
   *
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @returns The raw value of the flag.
   */
  assertGetRawValueSync<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(
    key: K,
    params?: Params
  ): ValueReturnType<Flags, K, Params>

  /**
   * Synchronously retrieves the raw value of a feature flag (no conversions applied) based on its key.
   *
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @returns The raw value of the flag, or null if not found.
   */
  getRawValueSync<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(
    key: K,
    params?: Params
  ): ValueReturnType<Flags, K, Params>
  /**

   Synchronously retrieves all feature flag values.
   @param params Optional parameters including context.
   @returns An object with all flag values.
   */
  getAllValuesSync(params?: { context?: Context }): Flags
  /**

   Synchronously retrieves all raw feature flag values.
   @param params Optional parameters including context.
   @returns An object with all raw flag values.
   */
  getAllRawValuesSync(params?: { context?: Context }): Flags

  /**
   * Closes the connection to the config manager.
   * @returns A Promise that resolves when the connection is closed.
   */
  closeSync(): void
}
