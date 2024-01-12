import * as SJSON from 'secure-json-parse'
import { CommonValueParams, AsyncConfigLayerImpl } from '../types'

/**
 * A driver that only supports async operations
 */
export abstract class AsyncBaseConfigDriver<
  Flags extends Record<string, any> = Record<string, any>,
  Context = never,
> implements AsyncConfigLayerImpl<Flags, Context>
{
  abstract getAllValues(
    params?: { context?: Context | undefined } | undefined
  ): Promise<Flags>
  abstract close(): Promise<void>

  abstract getRawValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K] | null>

  async getBoolValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<boolean> {
    const value = await this.getRawValue(key, params)

    return this.toBoolean(value)
  }

  protected toBoolean(value: any): boolean {
    if (typeof value === 'boolean') {
      return value
    }

    if (typeof value === 'string') {
      return value === 'true' || value === '1'
    }

    if (typeof value === 'number') {
      return value === 1
    }

    return false
  }

  async getStrValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<string | null> {
    const value = await this.getRawValue(key, params)
    return this.toStr(value)
  }

  protected toStr(value: any): string | null {
    if (value === null) {
      return null
    }

    if (value === undefined) {
      return null
    }

    if (typeof value === 'string') {
      return value
    }

    if (typeof value === 'number') {
      return value.toString()
    }

    if (typeof value === 'boolean') {
      return value ? 'true' : 'false'
    }

    if (typeof value === 'object') {
      return JSON.stringify(value)
    }

    return ''
  }

  /**
   * Returns the value assigned to the key as an object. Returns null if the value does not exist or cannot be converted to an object using secure-json-parse.
   */
  async getObjValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K] | null> {
    const value = await this.getRawValue(key, params)

    return this.toObj<K>(value)
  }

  protected toObj<K extends string & keyof Flags>(value: any): Flags[K] | null {
    if (value === undefined) {
      return null
    }

    if (typeof value === 'object') {
      return value
    }

    if (typeof value === 'string') {
      try {
        return SJSON.parse(value, null, {
          protoAction: 'remove',
          constructorAction: 'remove',
        })
      } catch (e) {
        return null
      }
    }

    return null
  }

  async getNumValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<number | null> {
    const value = await this.getRawValue(key, params)

    return this.toNum(value)
  }

  protected toNum(value: any): number | null {
    if (value === undefined) {
      return null
    }

    if (typeof value === 'number') {
      return value
    }

    if (typeof value === 'string') {
      const val = Number(value)
      if (isNaN(val)) {
        return null
      }

      return val
    }

    if (typeof value === 'boolean') {
      return value ? 1 : 0
    }

    return null
  }
}
