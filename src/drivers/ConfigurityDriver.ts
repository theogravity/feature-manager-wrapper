import { Cerebro, ICerebroConfig } from 'configurity'
import { SyncFeatureManagerDriver } from '../base-drivers/SyncFeatureManagerDriver'

import { CommonValueParams, ValueReturnType } from '../types/common.types'
import { deriveValue } from '../utils'

/**
 * Driver for the configurity configuration library. Supports both
 * sync and async operations.
 */
export class ConfigurityDriver<
  Flags extends Record<string, any> = Record<string, any>,
  Context extends Record<string, any> = Record<string, any>,
> extends SyncFeatureManagerDriver<Flags, Context> {
  /**
   * Instance of the Cerebro parser
   */
  private cerebro: Cerebro<Flags>
  /**
   * Static config used for getting values without a context
   */
  private staticConfig: ICerebroConfig<Flags>
  /**
   * Config used for getting values with a context. Context results are cached here.
   */
  private contextConfig: WeakMap<Context, ICerebroConfig<Flags>>

  /**
   * Takes in a Cerebro instance and uses it to generate configuration.
   * Use loadConfigParser() to create a Cerebro instance.
   */
  constructor(cerebro: Cerebro<Flags>) {
    super()
    this.cerebro = cerebro
    this.staticConfig = cerebro.resolveConfig({})
    this.contextConfig = new WeakMap()
  }

  getRawValueSync<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): ValueReturnType<Flags, K, Params> {
    if (params?.context) {
      const config = this.getAndCacheContext(params.context)

      return deriveValue<Flags, K, Params>(
        config.getRawValue(key),
        params?.defaultValue
      )
    }

    return deriveValue<Flags, K, Params>(
      this.staticConfig.getRawValue(key),
      params?.defaultValue
    )
  }

  getAllRawValuesSync(params?: { context?: Context } | undefined): Flags {
    if (params?.context) {
      const config = this.getAndCacheContext(params.context)
      return config.getRawConfig() as Flags
    }

    return this.staticConfig.getRawConfig() as Flags
  }

  /**
   * Caches the config for a given context
   */
  private getAndCacheContext(context: Context) {
    let config = this.contextConfig.get(context)

    if (!config) {
      config = this.cerebro.resolveConfig(context)

      this.contextConfig.set(context, config)
    }

    return config
  }

  async close() {
    this.cerebro = null as any
  }

  closeSync() {
    this.cerebro = null as any
  }
}
