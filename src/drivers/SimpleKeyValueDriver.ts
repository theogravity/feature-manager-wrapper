import { SyncFeatureManagerDriver } from '../base-drivers/SyncFeatureManagerDriver'
import { CommonValueParams } from '../types/common.types'

/**
 * Takes in a key / value mapping as the configuration. Supports sync and async operations.
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
    return (this.conf[key] as Flags[K]) ?? params?.defaultValue ?? null
  }

  getAllRawValuesSync(): Flags {
    return this.conf as Flags
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
