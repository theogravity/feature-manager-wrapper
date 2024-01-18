import type { LDClient } from '@launchdarkly/node-server-sdk'
import type { LDContext } from '@launchdarkly/js-sdk-common'
import { AsyncFeatureManagerDriver } from '../base-drivers/AsyncFeatureManagerDriver'

import { CommonValueParams, ValueReturnType } from '../types/common.types'

/**
 * Driver for the LaunchDarkly server SDK (@launchdarkly/node-server-sdk).
 * Only supports async operations.
 */
export class LaunchDarklyServerDriver<
  Flags extends Record<string, any> = Record<string, any>,
  Context extends LDContext = LDContext,
> extends AsyncFeatureManagerDriver<Flags, Context> {
  client: LDClient
  defaultContext: LDContext

  /**
   * Creates a new LaunchDarkly driver instance.
   * @param client The LaunchDarkly server client
   * @param defaultContext The default LaunchDarkly context to use when fetching feature flags.
   */
  constructor(client: LDClient, defaultContext: LDContext) {
    super()
    this.client = client
    this.defaultContext = defaultContext
  }

  /**
   * Sets the default LaunchDarkly context to use for getValue() and getAllValues()
   */
  setDefaultContext(context: LDContext) {
    this.defaultContext = context
  }

  async getRawValue<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): Promise<ValueReturnType<Flags, K, Params>> {
    if (params?.context) {
      return this.client.variation(key, params.context, params?.defaultValue)
    }

    return this.client.variation(key, this.defaultContext, params?.defaultValue)
  }

  async getAllRawValues(params?: { context?: Context }): Promise<Flags> {
    const context = params?.context ?? this.defaultContext
    const flagsState = await this.client.allFlagsState(context)

    return flagsState.allValues() as Flags
  }

  /**
   * Closes the LaunchDarkly client
   */
  async close(): Promise<void> {
    return this.client.close()
  }

  /**
   * Returns the LaunchDarkly client
   */
  getClient(): LDClient {
    return this.client
  }
}
