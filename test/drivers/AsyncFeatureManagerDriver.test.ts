import { AsyncFeatureManagerDriver } from '../../src'

// Simple in-memory key/value store implementation of BaseFeatureDriver
class SimpleFeatureDriver<
  Flags extends Record<string, any> = Record<string, any>,
  Context = never,
> extends AsyncFeatureManagerDriver<Flags, Context> {
  store: Flags

  constructor(store: Flags) {
    super()

    this.store = store
  }

  async getClient() {
    return this.store
  }

  async getAllRawValues(): Promise<Flags> {
    return this.store
  }

  async getRawValue<K extends string & keyof Flags>(
    key: K
  ): Promise<Flags[K] | null> {
    return this.store[key] ?? null
  }

  toValue<K extends string & keyof Flags>(value: any): any {
    return super.toValue(value)
  }

  async close() {
    return
  }
}

describe('BaseFeatureDriver', () => {
  let driver: SimpleFeatureDriver

  beforeEach(() => {
    driver = new SimpleFeatureDriver({
      flagBool: true,
      flagStr: 'test',
      flagNum: 42,
      flagObj: { key: 'value' },
      flagInvalidJSON: "{invalid: 'json'}",
      flagBoolStr: 'true',
      flagNumStr: '42',
      flagBoolNum: 1,
    })
  })

  test('getBoolValue should return correct boolean values', async () => {
    expect(await driver.getBoolValue('flagBool')).toBe(true)
    expect(await driver.getBoolValue('flagBoolStr')).toBe(true)
    expect(await driver.getBoolValue('flagNum')).toBe(false)
    expect(await driver.getBoolValue('flagNumStr')).toBe(false)
  })

  test('getStrValue should return correct string values', async () => {
    expect(await driver.getStrValue('flagStr')).toBe('test')
    expect(await driver.getStrValue('flagNum')).toBe('42')
    expect(await driver.getStrValue('flagBool')).toBe('true')
    expect(await driver.getStrValue('flagObj')).toBe(
      JSON.stringify({ key: 'value' })
    )
  })

  test('getObjValue should return correct object values or null', async () => {
    expect(await driver.getObjValue('flagObj')).toEqual({ key: 'value' })
    expect(await driver.getObjValue('flagStr')).toBeNull()
    expect(await driver.getObjValue('flagInvalidJSON')).toBeNull()
  })

  test('getNumValue should return correct number values or null', async () => {
    expect(await driver.getNumValue('flagNum')).toBe(42)
    expect(await driver.getNumValue('flagStr')).toBeNull()
    expect(await driver.getNumValue('flagNumStr')).toBe(42)
  })

  describe('toValue method', () => {
    it('should return null for null input', () => {
      expect(driver.toValue(null)).toBeNull()
    })

    it('should return null for undefined input', () => {
      expect(driver.toValue(undefined)).toBeNull()
    })

    it('should handle number input correctly', () => {
      const result = driver.toValue(42)
      // Assuming toNum returns the number as is
      expect(result).toBe(42)
    })

    it('should handle boolean input correctly', () => {
      const result = driver.toValue(true)
      // Assuming toBoolean returns the boolean as is
      expect(result).toBe(true)
    })

    it('should convert string to number if possible', () => {
      const result = driver.toValue('123')
      // Assuming toNum converts string to number
      expect(result).toBe(123)
    })

    it('should convert string to boolean if "true" or "false"', () => {
      const resultTrue = driver.toValue('true')
      const resultFalse = driver.toValue('false')
      // Assuming toBoolean converts string to boolean
      expect(resultTrue).toBe(true)
      expect(resultFalse).toBe(false)
    })

    it('should handle JSON string input', () => {
      const json = '{"key": "value"}'
      const result = driver.toValue(json)
      // Assuming toObj parses JSON correctly
      expect(result).toEqual({ key: 'value' })
    })

    it('should handle string input that is not JSON', () => {
      const result = driver.toValue('normalString')
      // Assuming toStr returns the string as is
      expect(result).toBe('normalString')
    })

    it('should handle object input', () => {
      const obj = { key: 'value' }
      const result = driver.toValue(obj)
      // Assuming toObj returns the object as is
      expect(result).toEqual(obj)
    })

    it('should return null for types not covered', () => {
      expect(driver.toValue(() => {})).toBeNull()
    })
  })

  afterEach(async () => {
    await driver.close()
  })
})
