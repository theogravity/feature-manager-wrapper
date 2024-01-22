import type { LDElectronMainClient } from 'launchdarkly-electron-client-sdk'
import { CommonValueParams, ValueReturnType } from '../types/common.types'
import { SyncFeatureManagerDriver } from '../base-drivers/SyncFeatureManagerDriver'

/**
 * Driver for the LaunchDarkly electron client SDK (launchdarkly-electron-client-sdk).
 * Supports both sync and async operations.
 */
export class LaunchDarklyElectronClientDriver<
  Flags extends Record<string, any> = Record<string, any>,
  Context = never,
> extends SyncFeatureManagerDriver<Flags, Context> {
  client: LDElectronMainClient

  /**
   * Creates a new LaunchDarkly driver instance.
   * @param client An instance of the LaunchDarkly client
   */
  constructor(client: LDElectronMainClient) {
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
  getClient(): LDElectronMainClient {
    return this.client
  }
}
