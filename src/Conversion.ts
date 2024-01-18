import SJSON from 'secure-json-parse'
import { CommonValueParams, ValueReturnType } from './types/common.types'

export class Conversion {
  /**
   * Converts a value to a boolean.
   * - Directly returns the value if it's already a boolean.
   * - For strings, returns true for "true" or "1", false otherwise.
   * - For numbers, returns true for 1, false otherwise.
   * - For all other cases, returns false.
   */
  static toBoolean(value: any): boolean {
    if (value === null || value === undefined) return false

    switch (typeof value) {
      case 'boolean':
        return value
      case 'string':
        return value.toLowerCase() === 'true' || value === '1'
      case 'number':
        return value === 1
      default:
        return false
    }
  }

  /**
   * Converts a value to a string.
   * - Returns null if the value is null or undefined.
   * - Returns the string as-is if it's already a string.
   * - Converts and returns the value as a string if it's a number or boolean.
   * - Converts and returns the JSON stringified value if it's an object.
   */
  static toStr(value: any): string | null {
    if (value === null || value === undefined) return null
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean')
      return value.toString()
    if (typeof value === 'object') return JSON.stringify(value)
    return null
  }

  /**
   * Converts a value to an object.
   * - Returns null if the value is null or undefined.
   * - Returns the value directly if it's already an object.
   * - Attempts to parse and return the value as an object if it's a string (using secure-json-parse).
   * - Returns null for all other types.
   */
  static toObj<
    Flags extends Record<string, any>,
    K extends keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(value: any): ValueReturnType<Flags, K, Params> {
    if (value === null || value === undefined) return value
    if (typeof value === 'object') return value
    if (typeof value === 'string') {
      try {
        return SJSON.parse(value, null, {
          protoAction: 'remove',
          constructorAction: 'remove',
        })
      } catch (e) {
        return null as ValueReturnType<Flags, K, Params>
      }
    }
    return null as ValueReturnType<Flags, K, Params>
  }

  /**
   * Converts a value to a number.
   * - Returns null if the value is null, undefined, or a non-numeric string.
   * - Returns the value directly if it's a number.
   * - Converts and returns the number representation if the value is a boolean.
   * - Attempts to parse and return the value as a number if it's a string.
   */
  static toNum(value: any): number | null {
    if (value === null || value === undefined) return null
    if (typeof value === 'number') return value
    if (typeof value === 'boolean') return value ? 1 : 0
    if (typeof value === 'string') {
      const parsed = Number(value)
      return isNaN(parsed) ? null : parsed
    }
    return null
  }

  /**
   * Converts a value to its corresponding type based on the flag key.
   * - Returns null if the value is null or undefined.
   * - Converts and returns the value based on its type (number, boolean, string, object).
   * - Uses the appropriate conversion method (toNum, toBoolean, toStr, toObj) based on the type of the value.
   * - Handles string values that can be converted to numbers, booleans, or objects.
   */
  static toValue<
    Flags extends Record<string, any>,
    K extends keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(value: any): ValueReturnType<Flags, K, Params> {
    if (value === null || value === undefined) return value

    switch (typeof value) {
      case 'number':
        return value as Flags[K]
      case 'boolean':
        return value as Flags[K]
      case 'string':
        const numValue = Number(value)
        if (!isNaN(numValue)) {
          return Conversion.toNum(value) as Flags[K]
        }
        if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
          return Conversion.toBoolean(value) as Flags[K]
        }
        try {
          const v = Conversion.toObj<Flags, K, Params>(value)

          // Converted to an object; return
          if (v) {
            return v
          }

          // Return string as-is
          return value as Flags[K]
        } catch (e) {
          return value as Flags[K]
        }
      case 'object':
        return value
      default:
        return null as ValueReturnType<Flags, K, Params>
    }
  }
}
