import { ISyncFeatureManager } from '../types/ISyncFeatureManager'

import { SyncFeatureManagerDriver } from '../base-drivers/SyncFeatureManagerDriver'
import { CommonValueParams } from '../types/common.types'
import { IAsyncFeatureManager } from '../types/IAsyncFeatureManager'

/**
 * Feature manager that supports sync and async drivers.
 * Acts as a facade for the underlying driver.
 */
export class SyncFeatureManager<Flags extends Record<string, any>, Context>
  implements
    IAsyncFeatureManager<Flags, Context>,
    ISyncFeatureManager<Flags, Context>
{
  private driver: SyncFeatureManagerDriver<Flags, Context>

  /**
   * @param driver The driver to use for interacting with the feature manager service.
   */
  constructor(driver: SyncFeatureManagerDriver<Flags, Context>) {
    this.driver = driver
  }

  async getValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K] | null> {
    return this.driver.getValue(key, params)
  }

  async getAllValues(params?: { context?: Context }): Promise<Flags> {
    return this.driver.getAllValues(params)
  }

  async getRawValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K] | null> {
    return this.driver.getRawValue(key, params)
  }

  async getAllRawValues(params?: { context?: Context }): Promise<Flags> {
    return this.driver.getAllRawValues(params)
  }

  async assertGetValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K]> {
    return this.driver.assertGetValue(key, params)
  }

  async assertGetRawValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K]> {
    return this.driver.assertGetRawValue(key, params)
  }

  async close(): Promise<void> {
    return this.driver.close()
  }

  closeSync() {
    return this.driver.closeSync()
  }

  getDriver(): SyncFeatureManagerDriver<Flags, Context> {
    return this.driver
  }

  getRawValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] | null {
    return this.driver.getRawValueSync(key, params)
  }

  getAllRawValuesSync(params?: { context?: Context }): Flags {
    return this.driver.getAllRawValuesSync(params)
  }

  getValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] | null {
    return this.driver.getValueSync(key, params)
  }

  getAllValuesSync(params?: { context?: Context }): Flags {
    return this.driver.getAllValuesSync(params)
  }

  assertGetValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] {
    return this.driver.assertGetValueSync(key, params)
  }

  assertGetRawValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] {
    return this.driver.assertGetRawValueSync(key, params)
  }
}
