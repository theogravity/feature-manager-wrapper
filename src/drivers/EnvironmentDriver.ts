import { CommonValueParams } from '../types'
import { SyncFeatureManagerDriver } from '../base-drivers/SyncFeatureManagerDriver'

/**
 * Uses process.env to get the values. Supports sync and async operations.
 */
export class EnvironmentDriver<
  Flags extends Record<string, any> = Record<string, any>,
  Context = never,
> extends SyncFeatureManagerDriver<Flags, Context> {
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
    return (process.env[key] as Flags[K]) ?? params?.defaultValue ?? null
  }

  /**
   * Returns all the environment variables
   */
  getAllRawValuesSync(): Flags {
    return process.env as Flags
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
