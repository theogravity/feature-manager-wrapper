import { SyncFeatureManagerDriver } from '../base-drivers/SyncFeatureManagerDriver'
import { CommonValueParams, ValueReturnType } from '../types/common.types'
import { deriveValue } from '../utils'

/**
 * Uses process.env to get the values. Supports sync and async operations.
 */
export class EnvironmentDriver<
  Flags extends Record<string, any> = Record<string, any>,
  Context = never,
> extends SyncFeatureManagerDriver<Flags, Context> {
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
      process.env[key] as Flags[K],
      params?.defaultValue
    )
  }

  getAllRawValuesSync(): Flags {
    return process.env as Flags
  }

  async getAllRawValues(): Promise<Flags> {
    return this.getAllRawValuesSync()
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
