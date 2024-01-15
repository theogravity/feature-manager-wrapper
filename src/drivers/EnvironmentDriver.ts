import { SyncFeatureManagerDriver } from '../base-drivers/SyncFeatureManagerDriver'
import { CommonValueParams } from '../types/common.types'

/**
 * Uses process.env to get the values. Supports sync and async operations.
 */
export class EnvironmentDriver<
  Flags extends Record<string, any> = Record<string, any>,
  Context = never,
> extends SyncFeatureManagerDriver<Flags, Context> {
  async getRawValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K] | null> {
    return this.getRawValueSync(key, params)
  }

  getRawValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] | null {
    return (process.env[key] as Flags[K]) ?? params?.defaultValue ?? null
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
