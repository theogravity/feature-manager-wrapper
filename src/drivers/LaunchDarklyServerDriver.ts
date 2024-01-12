import type { LDClient } from '@launchdarkly/node-server-sdk'
import type { LDContext } from '@launchdarkly/js-sdk-common'
import { AsyncBaseConfigDriver } from '../base-drivers/AsyncBaseConfigDriver'
import { CommonValueParams } from '../types'

/**
 * Driver for the LaunchDarkly server SDK. Only supports async operations.
 */
export class LaunchDarklyServerDriver<
  Flags extends Record<string, any> = Record<string, any>,
  Context extends LDContext = LDContext,
> extends AsyncBaseConfigDriver<Flags, Context> {
  client: LDClient
  defaultContext: LDContext

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

  async getRawValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K]> {
    if (params?.context) {
      return this.client.variation(key, params.context, params.defaultValue)
    }

    return this.client.variation(key, this.defaultContext, params?.defaultValue)
  }

  async getAllValues(params?: { context?: Context }): Promise<Flags> {
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
