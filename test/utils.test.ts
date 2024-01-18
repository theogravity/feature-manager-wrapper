import { deriveValue } from '../src'

describe('deriveValue', () => {
  it('should return undefined when both value and defaultValue are undefined', () => {
    expect(deriveValue(undefined, undefined)).toBeUndefined()
  })

  it('should return null when value is null and defaultValue is undefined', () => {
    expect(deriveValue(null, undefined)).toBeNull()
  })

  it('should return the defaultValue when value is undefined', () => {
    const defaultValue = 'default'
    expect(deriveValue(undefined, defaultValue)).toBe(defaultValue)
  })

  it('should return the value as-is when it is not undefined, null, or an empty string', () => {
    const value = 'non-empty'
    expect(deriveValue(value)).toBe(value)
  })

  it('should return empty string when value is empty string and defaultValue is undefined', () => {
    expect(deriveValue('', undefined)).toBe('')
  })

  it('should return the defaultValue when value is null', () => {
    const defaultValue = 'default'
    expect(deriveValue(null, defaultValue)).toBe(defaultValue)
  })

  it('should return the defaultValue when value is an empty string', () => {
    const defaultValue = 'default'
    expect(deriveValue('', defaultValue)).toBe(defaultValue)
  })

  it('should return null as defaultValue when value is undefined and defaultValue is explicitly null', () => {
    expect(deriveValue(undefined, null)).toBeNull()
  })

  it('should return an empty string as defaultValue when value is undefined and defaultValue is an empty string', () => {
    expect(deriveValue(undefined, '')).toBe('')
  })
})
