import * as SJSON from 'secure-json-parse'
import { CommonValueParams, IAsyncFeatureManager } from '../types'

export abstract class AsyncFeatureManagerDriver<
  Flags extends Record<string, any> = Record<string, any>,
  Context = never,
> implements IAsyncFeatureManager<Flags, Context>
{
  abstract getAllRawValues(params?: {
    context?: Context | undefined
  }): Promise<Flags>
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

  /**
   * Returns the value assigned to the key as a boolean. If the value is not natively a boolean:
   * - If the value is a string, it will return true if the string is "true" or "1", false otherwise
   * - If the value is a number, it will return true if the number is 1, false otherwise
   * - Returns false in all other cases
   */
  protected toBoolean(value: any): boolean {
    if (typeof value === 'boolean') {
      return value
    }

    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1'
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

  /**
   * Converts a value to a string.
   * - Returns null if the value is null or undefined.
   * - Returns the string directly if the value is a string.
   * - Converts and returns the value as a string if it's a number or boolean.
   * - Converts and returns the JSON stringified value if it's an object.
   */
  protected toStr(value: any): string | null {
    if (value === null || value === undefined) {
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

    return null
  }

  async getObjValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K] | null> {
    const value = await this.getRawValue(key, params)

    return this.toObj<K>(value)
  }

  /**
   * Converts a value to an object.
   * - Returns null if the value is null or undefined.
   * - Returns the value directly if it's an object.
   * - Attempts to parse and return the value if it's a string (using secure-json-parse).
   */
  protected toObj<K extends keyof Flags>(value: any): Flags[K] | null {
    if (value === null || value === undefined) {
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

  /**
   * Converts a value to a number.
   * - Returns null if the value is null, undefined, or a non-numeric string.
   * - Returns the value directly if it's a number.
   * - Converts and returns 1 or 0 if the value is a boolean.
   */
  protected toNum(value: any): number | null {
    if (value === null || value === undefined) {
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

  async getValue<K extends string & keyof Flags>(
    key: K,
    params?: CommonValueParams<Flags, K>
  ): Promise<Flags[K] | null> {
    const value: any = await this.getRawValue(key, params)
    return this.toValue<K>(value)
  }

  /**
   * Converts a value to its corresponding type based on the flag key.
   * - Returns null if the value is null or undefined.
   * - Converts and returns the value based on its type (number, boolean, string, object).
   * - Uses the appropriate conversion method (toNum, toBoolean, toStr, toObj) based on the type of the value.
   * - Handles string values that can be converted to numbers, booleans, or objects.
   */
  protected toValue<K extends keyof Flags>(value: any): Flags[K] | null {
    if (value === null || value === undefined) {
      return null
    }

    if (typeof value === 'number') {
      return this.toNum(value) as Flags[K] | null
    }

    if (typeof value === 'boolean') {
      return this.toBoolean(value) as Flags[K] | null
    }

    if (typeof value === 'string') {
      if (!isNaN(Number(value))) {
        return this.toNum(value) as Flags[K] | null
      }

      if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
        return this.toBoolean(value) as Flags[K] | null
      }

      try {
        JSON.parse(value)
        return this.toObj<K>(value)
      } catch (e) {
        return this.toStr(value) as Flags[K] | null
      }
    }

    if (typeof value === 'object') {
      return this.toObj<K>(value)
    }

    return null
  }
}
