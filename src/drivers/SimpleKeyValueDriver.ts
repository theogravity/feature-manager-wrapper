import { CommonValueParams } from '../types'
import { SyncFeatureManagerDriver } from '../base-drivers/SyncFeatureManagerDriver'

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

  /**
   * Returns the value of the given environment variable name. Returns null if not found. All values are returned as strings if found.
   * @alias getRawValueSync
   */
  async getRawValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K] | null> {
    return this.getRawValueSync(key, params)
  }

  /**
   * Returns the value of the given environment variable name. Returns null if not found. All values are returned as strings if found.
   */
  getRawValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] | null {
    return (this.conf[key] as Flags[K]) ?? params?.defaultValue ?? null
  }

  /**
   * Returns all the environment variables
   */
  getAllRawValuesSync(): Flags {
    return this.conf as Flags
  }

  /**
   * Returns all the environment variables
   * @alias getAllRawValuesSync
   */
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
}
