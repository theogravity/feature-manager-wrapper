import { AsyncFeatureManagerDriver } from '../base-drivers/AsyncFeatureManagerDriver'
import { CommonValueParams, ValueReturnType } from '../types/common.types'
import { IAsyncFeatureManager } from '../types/IAsyncFeatureManager'
import { deriveValue } from '../utils'

/**
 * Feature manager that supports async and sync drivers.
 * Acts as a facade for the underlying driver, and only exposes async operations.
 */
export class AsyncFeatureManager<Flags extends Record<string, any>, Context>
  implements IAsyncFeatureManager<Flags, Context>
{
  protected driver: AsyncFeatureManagerDriver<Flags, Context>

  /**
   * @param driver The driver to use for interacting with the feature manager service.
   */
  constructor(driver: IAsyncFeatureManager<Flags, Context>) {
    this.driver = driver
  }

  protected setDriver(driver: IAsyncFeatureManager<Flags, Context>) {
    this.driver = driver
  }

  async getValue<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): Promise<ValueReturnType<Flags, K, Params>> {
    return this.driver.getValue<K, Params>(key, params)
  }

  async getAllValues(params?: { context?: Context }): Promise<Flags> {
    return this.driver.getAllValues(params)
  }

  async getRawValue<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): Promise<ValueReturnType<Flags, K, Params>> {
    return deriveValue<Flags, K, Params>(
      this.driver.getRawValue<K, Params>(key, params),
      // The driver implementor may have forgotten to include the default value
      params?.defaultValue
    )
  }

  async getAllRawValues(params?: { context?: Context }): Promise<Flags> {
    return this.driver.getAllRawValues(params)
  }

  async assertGetValue<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): Promise<ValueReturnType<Flags, K, Params>> {
    return this.driver.assertGetValue<K, Params>(key, params)
  }

  async assertGetRawValue<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): Promise<ValueReturnType<Flags, K, Params>> {
    return this.driver.assertGetRawValue<K, Params>(key, params)
  }

  async close(): Promise<void> {
    return this.driver.close()
  }

  getDriver(): AsyncFeatureManagerDriver<Flags, Context> {
    return this.driver
  }
}
