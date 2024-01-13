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

  async close() {
    return
  }
}

describe('AsyncFeatureManagerDriver', () => {
  let driver: SimpleFeatureDriver
  const initialStore = { feature1: true, feature2: 'value', feature3: null }

  beforeEach(() => {
    driver = new SimpleFeatureDriver(initialStore)
  })

  afterEach(async () => {
    await driver.close()
  })

  test('getClient should return the current store', async () => {
    expect(await driver.getClient()).toEqual(initialStore)
  })

  test('getAllRawValues should return all features', async () => {
    expect(await driver.getAllRawValues()).toEqual(initialStore)
  })

  test('getRawValue should return the correct value for a given key', async () => {
    expect(await driver.getRawValue('feature1')).toEqual(true)
    expect(await driver.getRawValue('feature2')).toEqual('value')
    expect(await driver.getRawValue('feature3')).toEqual(null)
    expect(await driver.getRawValue('nonExistingFeature')).toEqual(null)
  })

  test('close should resolve without errors', async () => {
    await expect(driver.close()).resolves.toBeUndefined()
  })

  describe('getAllValues', () => {
    test('should return all converted values', async () => {
      const values = await driver.getAllValues()
      expect(values.feature1).toBe(true)
      expect(values.feature2).toBe('value')
      expect(values.feature3).toBeNull()
    })
  })

  describe('getValue', () => {
    test('should return converted value for a given key', async () => {
      expect(await driver.getValue('feature1')).toBe(true)
      expect(await driver.getValue('feature2')).toBe('value')
      expect(await driver.getValue('feature3')).toBeNull()
    })
  })

  describe('assertGetValue', () => {
    test('should return converted value for a given key', async () => {
      await expect(driver.assertGetValue('feature1')).resolves.toBe(true)
      await expect(driver.assertGetValue('feature2')).resolves.toBe('value')
    })

    test('should throw an error for non-existing key', async () => {
      await expect(
        driver.assertGetValue('nonExistingFeature')
      ).rejects.toThrow()
    })
  })

  describe('assertGetRawValue', () => {
    test('should return raw value for a given key', async () => {
      await expect(driver.assertGetRawValue('feature1')).resolves.toBe(true)
      await expect(driver.assertGetRawValue('feature2')).resolves.toBe('value')
    })

    test('should throw an error for non-existing key', async () => {
      await expect(
        driver.assertGetRawValue('nonExistingFeature')
      ).rejects.toThrow()
    })
  })
})
