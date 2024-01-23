import { SyncFeatureManagerDriver } from '../base-drivers/SyncFeatureManagerDriver'
import { CommonValueParams, ValueReturnType } from '../types/common.types'
import { deriveValue } from '../utils'

/**
 * Takes in a key / value mapping as the configuration. Supports sync and async operations.
 * Also ideal for testing as it provides setters for feature values.
 */
export class SimpleKeyValueDriver<
  Flags extends Record<string, any> = Record<string, any>,
  Context = never,
> extends SyncFeatureManagerDriver<Flags, Context> {
  conf: Flags

  constructor(conf: Flags) {
    super()
    this.conf = conf
  }

  async getRawValue<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): Promise<ValueReturnType<Flags, K, Params>> {
    return this.getRawValueSync(key, params)
  }

  getRawValueSync<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): ValueReturnType<Flags, K, Params> {
    return deriveValue<Flags, K, Params>(
      this.conf[key] as Flags[K],
      params?.defaultValue
    )
  }

  getAllRawValuesSync(): Flags {
    return this.conf as Flags
  }

  async getAllRawValues(): Promise<Flags> {
    return this.getAllRawValuesSync()
  }

  /**
   * Sets the value of a feature flag.
   */
  setValueSync<K extends string & keyof Flags>(key: K, value: Flags[K]) {
    this.conf[key] = value
  }

  /**
   * Sets the values of multiple feature flags.
   */
  setValuesSync(values: Partial<Flags>) {
    this.conf = { ...this.conf, ...values }
  }

  /**
   * Does nothing in this driver
   */
  async close() {
    // Nothing to do here
    return
  }

  /**
   * Does nothing in this driver
   */
  closeSync() {
    // Nothing to do here
    return
  }
}
