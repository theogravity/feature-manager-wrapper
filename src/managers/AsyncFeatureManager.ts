import { AsyncFeatureManagerDriver } from '../base-drivers/AsyncFeatureManagerDriver'
import { CommonValueParams } from '../types/common.types'
import { IAsyncFeatureManager } from '../types/IAsyncFeatureManager'

/**
 * Feature manager that supports async and sync drivers.
 * Acts as a facade for the underlying driver, and only exposes async operations.
 */
export class AsyncFeatureManager<Flags extends Record<string, any>, Context>
  implements IAsyncFeatureManager<Flags, Context>
{
  private driver: AsyncFeatureManagerDriver<Flags, Context>

  /**
   * @param driver The driver to use for interacting with the feature manager service.
   */
  constructor(driver: AsyncFeatureManagerDriver<Flags, Context>) {
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

  getDriver(): AsyncFeatureManagerDriver<Flags, Context> {
    return this.driver
  }
}
