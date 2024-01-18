import { ISyncFeatureManager } from '../types/ISyncFeatureManager'

import { SyncFeatureManagerDriver } from '../base-drivers/SyncFeatureManagerDriver'
import { CommonValueParams, ValueReturnType } from '../types/common.types'
import { IAsyncFeatureManager } from '../types/IAsyncFeatureManager'
import { deriveValue } from '../utils'

/**
 * Feature manager that only supports sync drivers. Exposes both sync and async operations since async operations are just sync operations wrapped in a promise.
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

  async getValue<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): Promise<ValueReturnType<Flags, K, Params>> {
    return this.driver.getValue(key, params)
  }

  async getAllValues(params?: { context?: Context }): Promise<Flags> {
    return this.driver.getAllValues(params)
  }

  async getRawValue<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): Promise<ValueReturnType<Flags, K, Params>> {
    return deriveValue<Flags, K, Params>(
      this.driver.getRawValue(key, params),
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
    return this.driver.assertGetValue(key, params)
  }

  async assertGetRawValue<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): Promise<ValueReturnType<Flags, K, Params>> {
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

  getRawValueSync<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): ValueReturnType<Flags, K, Params> {
    return deriveValue<Flags, K, Params>(
      // The driver implementor may have forgotten to include the default value
      this.driver.getRawValueSync(key, params),
      params?.defaultValue
    )
  }

  getAllRawValuesSync(params?: { context?: Context }): Flags {
    return this.driver.getAllRawValuesSync(params)
  }

  getValueSync<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): ValueReturnType<Flags, K, Params> {
    return this.driver.getValueSync(key, params)
  }

  getAllValuesSync(params?: { context?: Context }): Flags {
    return this.driver.getAllValuesSync(params)
  }

  assertGetValueSync<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): ValueReturnType<Flags, K, Params> {
    return this.driver.assertGetValueSync(key, params)
  }

  assertGetRawValueSync<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): ValueReturnType<Flags, K, Params> {
    return this.driver.assertGetRawValueSync(key, params)
  }
}
