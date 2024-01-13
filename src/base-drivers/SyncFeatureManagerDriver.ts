import { CommonValueParams, ISyncFeatureManager } from '../types'
import { AsyncFeatureManagerDriver } from './AsyncFeatureManagerDriver'
import { Conversion } from '../Conversion'

/**
 * A driver that supports both sync and async operations
 */
export abstract class SyncFeatureManagerDriver<
    Flags extends Record<string, any> = Record<string, any>,
    Context = never,
  >
  extends AsyncFeatureManagerDriver<Flags, Context>
  implements ISyncFeatureManager<Flags, Context>
{
  /**
   * Closes the connection to the configuration manager.
   * @returns A Promise that resolves when the connection is successfully closed.
   */
  abstract close(): Promise<void>

  /**
   * Synchronously retrieves all feature flags in their original format.
   * @param params Optional parameters including context.
   * @returns A Promise resolving to an object containing all raw feature flag values.
   */
  abstract getAllRawValuesSync(params?: { context?: Context }): Flags

  async getRawValue<K extends string & keyof Flags>(
    key: K,
    params?: {
      defaultValue?: Flags[K]
      context?: Context
    }
  ): Promise<Flags[K] | null> {
    return this.getRawValueSync(key, params)
  }

  /**
   * Synchronously retrieves all feature flags, converting them to their appropriate types.
   * @param params Optional parameters including context.
   * @returns A Promise resolving to an object containing all feature flag values in their appropriate types.
   */
  getAllValuesSync(params?: { context?: Context }): Flags {
    const rawValues = this.getAllRawValuesSync(params)

    const values: any = {}

    for (const key in rawValues) {
      values[key] = Conversion.toValue(rawValues[key])
    }

    return values
  }

  async getAllRawValues(params?: { context?: Context }): Promise<Flags> {
    return this.getAllRawValuesSync(params)
  }

  /**
   * Synchronously retrieves the raw value of a specific feature flag based on its key.
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @returns A Promise resolving to the raw value of the flag, or null if not found.
   */
  abstract getRawValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] | null

  /**
   * Synchronously asserts and retrieves the raw value of a specific feature flag based on its key.
   * - Throws an error if the value is null, indicating that the flag does not exist.
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @returns A Promise resolving to the raw value of the flag.
   */
  assertGetRawValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] {
    const value = this.getRawValueSync(key, params)

    if (value === null) {
      throw new Error(`Value for key ${key} does not exist`)
    }

    return value
  }

  /**
   * Synchronously retrieves the value of a specific feature flag based on its key, converting it to its appropriate type.
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @returns A Promise resolving to the value of the flag in its appropriate type, or null if not found.
   */
  getValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] | null {
    const value = this.getRawValueSync(key, params)
    return Conversion.toValue(value)
  }

  /**
   * Synchronously asserts and retrieves the value of a specific feature flag based on its key, converting it to its appropriate type.
   * - Throws an error if the value is null, indicating that the flag does not exist.
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @returns A Promise resolving to the value of the flag in its appropriate type.
   */
  assertGetValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] {
    const value = this.getValueSync(key, params)

    if (value === null) {
      throw new Error(`Value for key ${key} does not exist`)
    }

    return value
  }
}
