import { CommonValueParams, SyncConfigLayerImpl } from '../types'
import { AsyncBaseConfigDriver } from './AsyncBaseConfigDriver'

/**
 * A driver that supports both sync and async operations
 */
export abstract class SyncBaseConfigDriver<
    Flags extends Record<string, any> = Record<string, any>,
    Context = never,
  >
  extends AsyncBaseConfigDriver<Flags, Context>
  implements SyncConfigLayerImpl<Flags, Context>
{
  abstract getAllValues(
    params?: { context?: Context | undefined } | undefined
  ): Promise<Flags>
  abstract close(): Promise<void>

  abstract getRawValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] | null

  abstract getAllValuesSync(params?: { context?: Context }): Flags

  getBoolValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): boolean {
    const value = this.getRawValueSync(key, params)

    return this.toBoolean(value)
  }

  getStrValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): string | null {
    const value = this.getRawValueSync(key, params)

    return this.toStr(value)
  }

  /**
   * Returns the value assigned to the key as an object. Returns null if the value does not exist or cannot be converted to an object using secure-json-parse.
   */
  getObjValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Flags[K] | null {
    const value = this.getRawValueSync(key, params)

    return this.toObj<K>(value)
  }

  getNumValueSync<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): number | null {
    const value = this.getRawValueSync(key, params)

    return this.toNum(value)
  }
}
