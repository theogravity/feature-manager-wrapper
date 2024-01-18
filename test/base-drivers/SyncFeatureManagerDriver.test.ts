import { CommonValueParams, SyncFeatureManagerDriver } from '../../src'
import { ValueReturnType } from '../../src/types/common.types'

// Simple in-memory key/value store implementation of BaseFeatureDriver
class SimpleFeatureDriver<
  Flags extends Record<string, any> = Record<string, any>,
  Context = never,
> extends SyncFeatureManagerDriver<Flags, Context> {
  store: Flags

  constructor(store: Flags) {
    super()

    this.store = store
  }

  async getClient() {
    return this.store
  }

  async close() {
    return
  }

  closeSync() {
    return
  }

  getAllRawValuesSync(): Flags {
    return this.store
  }

  getRawValueSync<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): ValueReturnType<Flags, K, Params> {
    return this.store[key] ?? (null as ValueReturnType<Flags, K, Params>)
  }
}

describe('SyncFeatureManagerDriver', () => {
  let driver: SimpleFeatureDriver<{ testFlag: string; anotherFlag: boolean }>

  beforeEach(() => {
    driver = new SimpleFeatureDriver({ testFlag: 'value', anotherFlag: true })
  })

  describe('getAllRawValuesSync', () => {
    it('should return all flags', () => {
      expect(driver.getAllRawValuesSync()).toEqual({
        testFlag: 'value',
        anotherFlag: true,
      })
    })
  })

  describe('getRawValueSync', () => {
    it('should return the value for a given flag', () => {
      expect(driver.getRawValueSync('testFlag')).toBe('value')
    })

    it('should return null for a non-existent flag', () => {
      // @ts-expect-error
      expect(driver.getRawValueSync('nonExistentFlag')).toBeNull()
    })
  })

  describe('getAllValuesSync', () => {
    it('should return all converted flags', () => {
      expect(driver.getAllValuesSync()).toEqual({
        testFlag: 'value',
        anotherFlag: true,
      })
    })
  })

  describe('assertGetRawValueSync', () => {
    it('should return the raw value for a given flag', () => {
      expect(driver.assertGetRawValueSync('testFlag')).toBe('value')
    })

    it('should throw an error for a non-existent flag', () => {
      // @ts-expect-error
      expect(() => driver.assertGetRawValueSync('nonExistentFlag')).toThrow()
    })
  })

  describe('getValueSync', () => {
    it('should return the converted value for a given flag', () => {
      expect(driver.getValueSync('testFlag')).toBe('value')
    })

    it('should return null for a non-existent flag', () => {
      // @ts-expect-error
      expect(driver.getValueSync('nonExistentFlag')).toBeNull()
    })
  })

  describe('assertGetValueSync', () => {
    it('should return the converted value for a given flag', () => {
      expect(driver.assertGetValueSync('testFlag')).toBe('value')
    })

    it('should throw an error for a non-existent flag', () => {
      // @ts-expect-error
      expect(() => driver.assertGetValueSync('nonExistentFlag')).toThrow()
    })
  })

  describe('close', () => {
    it('should close without errors', async () => {
      await expect(driver.close()).resolves.toBeUndefined()
      expect(driver.closeSync()).toBeUndefined()
    })
  })
})
