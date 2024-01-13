import { Cerebro, ICerebroConfig } from 'configurity'
import { SyncFeatureManagerDriver } from '../base-drivers/SyncFeatureManagerDriver'
import { CommonValueParams } from '../types'

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

  constructor(cerebro: Cerebro<Flags>) {
    super()
    this.cerebro = cerebro
    this.staticConfig = cerebro.resolveConfig({})
    this.contextConfig = new WeakMap()
  }

  /**
   * Gets the value for the given key. Returns null if the value does not exist.
   */
  getRawValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K> | undefined
  ): Flags[K] | null {
    if (params?.context) {
      const config = this.getAndCacheContext(params.context)

      return config.getRawValue(key) ?? params.defaultValue ?? null
    }

    return this.staticConfig.getRawValue(key) ?? params?.defaultValue ?? null
  }

  /**
   * Gets the value for the given key. Returns null if the value does not exist.
   * @alias getRawValueSync
   */
  async getRawValue<K extends string & keyof Flags>(
    key: K,
    params?: {
      defaultValue?: Flags[K]
      context?: Context
    }
  ): Promise<Flags[K] | null> {
    return this.getRawValueSync(key, params)
  }

  /**
   * Returns all settings, or if specified
   * all settings specific to a given label
   */
  getAllRawValuesSync(params?: { context?: Context } | undefined): Flags {
    if (params?.context) {
      const config = this.getAndCacheContext(params.context)
      return config.getRawConfig() as Flags
    }

    return this.staticConfig.getRawConfig() as Flags
  }

  /**
   * Returns all settings, or if specified
   * all settings specific to a given label
   *
   * @alias getAllRawValuesSync
   */
  async getAllRawValues(params?: { context?: Context }): Promise<Flags> {
    return this.getAllRawValuesSync(params)
  }

  private getAndCacheContext(context: Context) {
    let config = this.contextConfig.get(context)

    if (!config) {
      config = this.cerebro.resolveConfig(context)

      this.contextConfig.set(context, config)
    }

    return config
  }

  /**
   * Does nothing in this driver.
   */
  async close() {
    // Nothing to do here
    return
  }
}
