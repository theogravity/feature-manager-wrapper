import { CommonValueParams, ValueReturnType } from './common.types'

/**
 * Interface for async-based feature flag accessors.
 */
export interface IAsyncFeatureManager<
  Flags extends Record<string, any>,
  Context,
> {
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
   * @returns A Promise resolving to the value of the flag.
   */
  assertGetValue<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(
    key: K,
    params?: Params
  ): Promise<ValueReturnType<Flags, K, Params>>

  /**
   * Asynchronously retrieves the value of a feature flag based on its key.
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
   * @returns A Promise resolving to the value of the flag, or null if not found.
   */
  getValue<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(
    key: K,
    params?: Params
  ): Promise<ValueReturnType<Flags, K, Params>>

  /**
   * Asynchronously asserts and retrieves the raw value of a feature flag (no conversions applied) based on its key.
   *
   * Throws an error if the value is null, undefined, or empty string.
   *
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @returns A Promise resolving to the raw value of the flag.
   */
  assertGetRawValue<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(
    key: K,
    params?: Params
  ): Promise<ValueReturnType<Flags, K, Params>>

  /**
   * Asynchronously retrieves the raw value of a feature flag (no conversions applied) based on its key.
   *
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @returns A Promise resolving to the raw value of the flag, or null if not found.
   */
  getRawValue<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(
    key: K,
    params?: Params
  ): Promise<ValueReturnType<Flags, K, Params>>

  /**
   * Asynchronously retrieves all feature flag values.
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
   * @param params Optional parameters including context.
   * @returns A Promise resolving to an object with all flag values.
   */
  getAllValues(params?: { context?: Context }): Promise<Flags>

  /**
   * Asynchronously retrieves all raw feature flag (no conversions applied) values.
   *
   * @param params Optional parameters including context.
   * @returns A Promise resolving to an object with all raw flag values.
   */
  getAllRawValues(params?: { context?: Context }): Promise<Flags>

  /**
   * Asynchronously closes the connection to the feature manager service.
   *
   * @returns A Promise that resolves when the connection is closed.
   */
  close(): Promise<void>
}
