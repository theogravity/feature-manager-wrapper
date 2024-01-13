import { loadConfigParser } from 'configurity'
import { ConfigurityDriver } from '../../src'
import * as path from 'node:path'

interface Settings {
  enable_database: boolean
  max_power: number
  database_name: string
}

const YML_PATH = path.join(__dirname, '..', '__fixtures__', 'configurity.yml')

const cerebro = loadConfigParser<Settings>(YML_PATH)
const driver = new ConfigurityDriver<Settings>(cerebro)

describe('Configurity driver', () => {
  it('returns a default value', async () => {
    expect(
      // @ts-expect-error
      await driver.getRawValue('no_value', { defaultValue: 'default' })
    ).toBe('default')
  })

  it('returns a contextual value', async () => {
    expect(
      await driver.getRawValue('max_power', {
        context: { environment: 'production', power: 'low' },
      })
    ).toBe(0)
  })

  it('returns a contextual default value', async () => {
    expect(
      await driver.getRawValue('max_power', {
        context: { environment: 'production', power: 'high' },
        defaultValue: 1,
      })
    ).toBe(1)
  })

  it('returns all values', async () => {
    expect(await driver.getAllRawValues()).toEqual({
      enable_database: true,
      max_power: 1,
      database_name: 'test-database',
    })

    expect(driver.getAllRawValuesSync()).toEqual({
      enable_database: true,
      max_power: 1,
      database_name: 'test-database',
    })
  })

  it('returns all values using a context', async () => {
    expect(
      await driver.getAllRawValues({
        context: { environment: 'production', power: 'low' },
      })
    ).toEqual({
      enable_database: true,
      database_name: 'prd-database',
      max_power: 0,
    })
  })

  it('converts and returns all values with getAllValues()', async () => {
    const allValues = await driver.getAllValues()
    expect(allValues).toEqual({
      enable_database: true,
      max_power: 1,
      database_name: 'test-database',
    })
  })

  it('converts and returns contextual values with getValue()', async () => {
    const context = { environment: 'production', power: 'low' }
    expect(await driver.getValue('max_power', { context })).toBe(0)
  })

  it('converts and returns all contextual values with getAllValues()', async () => {
    const context = { environment: 'production', power: 'low' }
    const allValues = await driver.getAllValues({ context })
    expect(allValues).toEqual({
      enable_database: true,
      max_power: 0,
      database_name: 'prd-database',
    })
  })

  it('should cache and return the configuration for a given context', () => {
    const context = { environment: 'production', power: 'low' }
    const result = driver['getAndCacheContext'](context)
    // @ts-expect-error
    expect(result['_resolved']).toMatchObject({
      enable_database: true,
      max_power: 0,
      database_name: 'prd-database',
    })
  })

  it('should resolve without errors', async () => {
    await expect(driver.close()).resolves.toBeUndefined()
  })

  it('should return the value for an existing key', () => {
    const result = driver.assertGetRawValueSync('enable_database')
    expect(result).toBe(true)
  })

  it('should throw an error for a non-existing key', () => {
    expect(() => {
      // @ts-expect-error
      driver.assertGetRawValueSync('non_existing_key')
    }).toThrow()
  })

  it('should return the converted value for a given key', () => {
    const result = driver.getValueSync('max_power')
    expect(result).toEqual(expect.any(Number))
  })

  it('should return null for a non-existing key', () => {
    // @ts-expect-error
    const result = driver.getValueSync('non_existing_key')
    expect(result).toBeNull()
  })

  it('should throw an error for a non-existing key', () => {
    expect(() => {
      // @ts-expect-error
      driver.assertGetValueSync('non_existing_key')
    }).toThrow()
  })
})
