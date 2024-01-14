export type CommonValueParams<Flags, K extends keyof Flags> = {
  defaultValue?: Flags[K]
  context?: any
}
export interface ISyncFeatureManager<
  Flags extends Record<string, any>,
  Context,
> {
  /**
   * Synchronously asserts and retrieves the value of a feature flag based on its key.
   * Throws an error if the value doesn't exist.
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @returns The value of the flag.
   */
  assertGetValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K]

  /**
   * Synchronously retrieves the value of a feature flag based on its key.
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @returns The value of the flag, or null if not found.
   */
  getValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] | null

  /**
   * Synchronously asserts and retrieves the raw value of a feature flag based on its key.
   * Throws an error if the value doesn't exist.
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @returns The raw value of the flag.
   */
  assertGetRawValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K]

  /**

   Synchronously retrieves the raw value of a feature flag based on its key.
   @param key The key of the feature flag.
   @param params Optional parameters including default value and context.
   @returns The raw value of the flag, or null if not found.
   */
  getRawValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] | null
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

   Closes the connection to the config manager.
   @returns A Promise that resolves when the connection is closed.
   */
  closeSync(): void
}

export interface IAsyncFeatureManager<
  Flags extends Record<string, any>,
  Context,
> {
  /**
   * Asynchronously asserts and retrieves the value of a feature flag based on its key.
   * Throws an error if the value doesn't exist.
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @returns A Promise resolving to the value of the flag.
   */
  assertGetValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K]>

  /**
   * Asynchronously retrieves the value of a feature flag based on its key.
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @returns A Promise resolving to the value of the flag, or null if not found.
   */
  getValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K] | null>

  /**
   * Asynchronously asserts and retrieves the raw value of a feature flag based on its key.
   * Throws an error if the value doesn't exist.
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @returns A Promise resolving to the raw value of the flag.
   */
  assertGetRawValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K]>

  /**
   * Asynchronously retrieves the raw value of a feature flag based on its key.
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @returns A Promise resolving to the raw value of the flag, or null if not found.
   */
  getRawValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K] | null>

  /**
   * Asynchronously retrieves all feature flag values.
   * @param params Optional parameters including context.
   * @returns A Promise resolving to an object with all flag values.
   */
  getAllValues(params?: { context?: Context }): Promise<Flags>

  /**
   * Asynchronously retrieves all raw feature flag values.
   * @param params Optional parameters including context.
   * @returns A Promise resolving to an object with all raw flag values.
   */
  getAllRawValues(params?: { context?: Context }): Promise<Flags>

  /**
   * Closes the connection to the config manager.
   * @returns A Promise that resolves when the connection is closed.
   */
  close(): Promise<void>
}
