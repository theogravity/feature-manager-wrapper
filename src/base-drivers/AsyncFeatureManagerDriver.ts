import { Conversion } from '../Conversion'
import { CommonValueParams, ValueReturnType } from '../types/common.types'
import { IAsyncFeatureManager } from '../types/IAsyncFeatureManager'
import {
  deriveValue,
  FeatureManagerAssertionError,
  valueIsEmpty,
} from '../utils'

/**
 * A driver that supports only async operations.
 */
export abstract class AsyncFeatureManagerDriver<
  Flags extends Record<string, any> = Record<string, any>,
  Context = never,
> implements IAsyncFeatureManager<Flags, Context>
{
  /**
   * Closes the connection to the configuration manager.
   * @returns A Promise that resolves when the connection is successfully closed.
   */
  abstract close(): Promise<void>

  /**
   * Asynchronously retrieves all feature flags in their original format.
   * @param params Optional parameters including context.
   * @returns A Promise resolving to an object containing all raw feature flag values.
   */
  abstract getAllRawValues(params?: {
    context?: Context | undefined
  }): Promise<Flags>

  /**
   * Asynchronously retrieves all feature flags, converting them to their appropriate types.
   * @param params Optional parameters including context.
   * @returns A Promise resolving to an object containing all feature flag values in their appropriate types.
   */
  async getAllValues(params?: { context?: Context }): Promise<Flags> {
    const rawValues = await this.getAllRawValues(params)

    const values: any = {}

    for (const key in rawValues) {
      values[key] = Conversion.toValue(rawValues[key])
    }

    return values
  }

  /**
   * Asynchronously retrieves the raw value of a specific feature flag based on its key.
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @returns A Promise resolving to the raw value of the flag, or null if not found.
   */
  abstract getRawValue<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): Promise<ValueReturnType<Flags, K, Params>>

  /**
   * Asynchronously asserts and retrieves the raw value of a specific feature flag based on its key.
   * - Throws an error if the value is null, undefined, or empty string.
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @throws FeatureManagerAssertionError if the value is null, undefined, or empty string.
   * @returns A Promise resolving to the raw value of the flag.
   */
  async assertGetRawValue<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): Promise<ValueReturnType<Flags, K, Params>> {
    const value = deriveValue<Flags, K, Params>(
      await this.getRawValue(key, params),
      params?.defaultValue
    )

    if (valueIsEmpty(value)) {
      throw new FeatureManagerAssertionError(
        `Key does not have a value: ${key}`
      )
    }

    return value
  }

  /**
   * Asynchronously retrieves the value of a specific feature flag based on its key, converting it to its appropriate type.
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @returns A Promise resolving to the value of the flag in its appropriate type, or null if not found.
   */
  async getValue<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): Promise<ValueReturnType<Flags, K, Params>> {
    const value: any = await this.getRawValue<K, Params>(key, params)
    return deriveValue<Flags, K, Params>(
      Conversion.toValue<Flags, K, Params>(value),
      params?.defaultValue
    )
  }

  /**
   * Asynchronously asserts and retrieves the value of a specific feature flag based on its key, converting it to its appropriate type.
   * - Throws an error if the value is null, undefined, or empty string.
   * @param key The key of the feature flag.
   * @param params Optional parameters including default value and context.
   * @throws FeatureManagerAssertionError if the value is null, undefined, or empty string.
   * @returns A Promise resolving to the value of the flag in its appropriate type.
   */
  async assertGetValue<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): Promise<ValueReturnType<Flags, K, Params>> {
    const value = await this.getValue(key, params)

    if (valueIsEmpty(value)) {
      throw new FeatureManagerAssertionError(
        `Key does not have a value: ${key}`
      )
    }

    return value
  }
}
