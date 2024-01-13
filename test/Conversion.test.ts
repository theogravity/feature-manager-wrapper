import { Conversion } from '../src/Conversion'

describe('Conversion', () => {
  describe('toBoolean', () => {
    it('should return true for boolean true', () => {
      expect(Conversion.toBoolean(true)).toBe(true)
    })

    it('should return false for boolean false', () => {
      expect(Conversion.toBoolean(false)).toBe(false)
    })

    it('should return true for string "true"', () => {
      expect(Conversion.toBoolean('true')).toBe(true)
    })

    it('should return true for string "1"', () => {
      expect(Conversion.toBoolean('1')).toBe(true)
    })

    it('should return false for other strings', () => {
      expect(Conversion.toBoolean('false')).toBe(false)
      expect(Conversion.toBoolean('anyString')).toBe(false)
    })

    it('should return true for number 1', () => {
      expect(Conversion.toBoolean(1)).toBe(true)
    })

    it('should return false for other numbers', () => {
      expect(Conversion.toBoolean(0)).toBe(false)
      expect(Conversion.toBoolean(2)).toBe(false)
    })

    it('should return false for null, undefined and other types', () => {
      expect(Conversion.toBoolean(null)).toBe(false)
      expect(Conversion.toBoolean(undefined)).toBe(false)
      expect(Conversion.toBoolean({})).toBe(false)
    })
  })

  describe('toStr', () => {
    it('should handle null and undefined', () => {
      expect(Conversion.toStr(null)).toBeNull()
      expect(Conversion.toStr(undefined)).toBeNull()
    })

    it('should return string as-is', () => {
      expect(Conversion.toStr('test')).toBe('test')
    })

    it('should convert numbers to string', () => {
      expect(Conversion.toStr(123)).toBe('123')
    })

    it('should convert booleans to string', () => {
      expect(Conversion.toStr(true)).toBe('true')
      expect(Conversion.toStr(false)).toBe('false')
    })

    it('should convert objects to JSON string', () => {
      expect(Conversion.toStr({ a: 1 })).toBe('{"a":1}')
    })

    it('should return null for other types', () => {
      expect(Conversion.toStr(function () {})).toBeNull()
    })
  })

  describe('toObj', () => {
    it('should handle null and undefined', () => {
      expect(Conversion.toObj(null)).toBeNull()
      expect(Conversion.toObj(undefined)).toBeNull()
    })

    it('should return object as-is', () => {
      const obj = { a: 1 }
      expect(Conversion.toObj(obj)).toBe(obj)
    })

    it('should parse valid JSON string', () => {
      expect(Conversion.toObj('{"a":1}')).toEqual({ a: 1 })
    })

    it('should return null for invalid JSON string', () => {
      expect(Conversion.toObj('invalid')).toBeNull()
    })

    it('should return null for other types', () => {
      expect(Conversion.toObj(123)).toBeNull()
      expect(Conversion.toObj(true)).toBeNull()
    })
  })

  describe('toNum', () => {
    it('should handle null and undefined', () => {
      expect(Conversion.toNum(null)).toBeNull()
      expect(Conversion.toNum(undefined)).toBeNull()
    })

    it('should return number as-is', () => {
      expect(Conversion.toNum(123)).toBe(123)
    })

    it('should convert string to number if numeric', () => {
      expect(Conversion.toNum('123')).toBe(123)
    })

    it('should return null for non-numeric strings', () => {
      expect(Conversion.toNum('abc')).toBeNull()
    })

    it('should convert booleans to numbers', () => {
      expect(Conversion.toNum(true)).toBe(1)
      expect(Conversion.toNum(false)).toBe(0)
    })

    it('should return null for other types', () => {
      expect(Conversion.toNum({})).toBeNull()
    })
  })

  describe('toValue', () => {
    // Test cases for toValue should be a combination of above since it delegates to other methods
    it('should return null for null and undefined', () => {
      expect(Conversion.toValue(null)).toBeNull()
      expect(Conversion.toValue(undefined)).toBeNull()
    })

    it('should handle number values', () => {
      expect(Conversion.toValue<any, 'number'>(123)).toBe(123)
      expect(Conversion.toValue<any, 'number'>('123')).toBe(123)
    })

    it('should handle boolean values', () => {
      expect(Conversion.toValue<any, 'boolean'>(true)).toBe(true)
      expect(Conversion.toValue<any, 'boolean'>('true')).toBe(true)
      expect(Conversion.toValue<any, 'boolean'>(1)).toBe(1)
    })

    it('should handle string values', () => {
      expect(Conversion.toValue<any, 'string'>('test')).toBe('test')
    })

    it('should handle object values', () => {
      const obj = { a: 1 }
      expect(Conversion.toValue<any, 'object'>(obj)).toBe(obj)
      expect(Conversion.toValue<any, 'object'>('{"a":1}')).toEqual({ a: 1 })
    })
  })
})
