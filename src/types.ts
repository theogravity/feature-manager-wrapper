export type CommonValueParams<Flags, K extends keyof Flags> = {
  defaultValue?: Flags[K]
  context?: any // Replace 'any' with the actual type for context if known
}

export interface ISyncFeatureManager<
  Flags extends Record<string, any>,
  Context,
> {
  /**
   * Returns the value assigned to the key with a conversation attempt. Returns null if the value does not exist.
   * Recommended that you use a specific getter instead of this one.
   */
  getValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] | null
  /**
   * Returns the value assigned to the key without any conversion. Returns null if the value does not exist.
   **/
  getRawValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] | null

  /**
   * Returns the value assigned to the key as a boolean. If the value is not natively a boolean:
   * - If the value is a string, it will return true if the string is "true" or "1", false otherwise
   * - If the value is a number, it will return true if the number is 1, false otherwise
   * - Returns false in all other cases
   */
  getBoolValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): boolean

  /**
   * Returns the value assigned to the key as a string. Returns null if the value does not exist.
   */
  getStrValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): string | null

  /**
   * Returns the value assigned to the key as an object. Returns null if the value does not exist or cannot be converted to an object.
   */
  getObjValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] | null

  /**
   * Returns the value assigned to the key as a number. Returns null if the value does not exist or cannot be converted to a number.
   */
  getNumValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): number | null

  /**
   * Returns all data in their original stored format. Values may need to be converted to an expected type depending on the driver used.
   */
  getAllRawValuesSync(params?: { context?: Context }): Flags

  /**
   * Closes the connection to the config manager
   */
  close(): Promise<void>
}

export interface IAsyncFeatureManager<
  Flags extends Record<string, any>,
  Context,
> {
  /**
   * Returns the value assigned to the key with a conversation attempt. Returns null if the value does not exist.
   * Recommended that you use a specific getter instead of this one.
   */
  getValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K] | null>
  /**
   * Returns the value assigned to the key without any conversion. Returns null if the value does not exist.
   **/
  getRawValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K] | null>

  /**
   * Returns the value assigned to the key as a boolean. If the value is not natively a boolean:
   * - If the value is a string, it will return true if the string is "true" or "1", false otherwise
   * - If the value is a number, it will return true if the number is 1, false otherwise
   * - Returns false in all other cases
   */
  getBoolValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<boolean>

  /**
   * Returns the value assigned to the key as a string. Returns null if the value does not exist.
   */
  getStrValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<string | null>

  /**
   * Returns the value assigned to the key as an object. Returns null if the value does not exist or cannot be converted to an object.
   */
  getObjValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K] | null>

  /**
   * Returns the value assigned to the key as a number. Returns null if the value does not exist or cannot be converted to a number.
   */
  getNumValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<number | null>

  /**
   * Returns all data in their original stored format. Values may need to be converted to an expected type depending on the driver used.
   */
  getAllRawValues(params?: { context?: Context }): Promise<Flags>

  /**
   * Closes the connection to the config manager
   */
  close(): Promise<void>
}
