import type { LDClient } from 'launchdarkly-js-client-sdk'
import { CommonValueParams, ValueReturnType } from '../types/common.types'
import { SyncFeatureManagerDriver } from '../base-drivers/SyncFeatureManagerDriver'

/**
 * Driver for the LaunchDarkly client SDK (launchdarkly-js-client-sdk).
 * Supports both sync and async operations.
 */
export class LaunchDarklyClientDriver<
  Flags extends Record<string, any> = Record<string, any>,
  Context = never,
> extends SyncFeatureManagerDriver<Flags, Context> {
  client: LDClient

  /**
   * Creates a new LaunchDarkly driver instance.
   * @param client An instance of the LaunchDarkly client
   */
  constructor(client: LDClient) {
    super()
    this.client = client
  }

  getRawValueSync<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): ValueReturnType<Flags, K, Params> {
    return this.client.variation(key, params?.defaultValue)
  }

  getAllRawValuesSync(): Flags {
    return this.client.allFlags() as Flags
  }

  /**
   * Closes the LaunchDarkly client
   */
  async close(): Promise<void> {
    return this.client.close()
  }

  closeSync() {
    throw new Error(
      'closeSync() is not supported for LaunchDarklyClientDriver. Use async close() instead.'
    )
  }

  /**
   * Returns the LaunchDarkly client
   */
  getClient(): LDClient {
    return this.client
  }
}
