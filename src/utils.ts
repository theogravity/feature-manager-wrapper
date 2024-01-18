import { CommonValueParams, ValueReturnType } from './types/common.types'

/**
 * Returns true if the value is null, undefined, or an empty string
 */
export function valueIsEmpty(value: any) {
  return value === null || value === undefined || value === ''
}

/**
 * Given a value and a default value, ensure that a null / undefined / empty string value is properly
 * returned as its original value
 */
export function deriveValue<
  Flags extends Record<string, any>,
  K extends keyof Flags,
  Params extends CommonValueParams<Flags, K> | undefined = undefined,
>(value?: any, defaultValue?: any): ValueReturnType<Flags, K, Params> {
  if (value === undefined || value === null || value === '') {
    if (defaultValue) {
      return defaultValue
    }

    // If the user explicitly sets null or empty string as the default value, return it
    if (defaultValue === null || defaultValue === '') {
      return defaultValue
    }

    // Return as-is if no default value is provided
    return value
  }

  return value
}

export class FeatureManagerAssertionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FeatureManagerAssertError'
  }
}
