import { loadConfigParser } from "configurity";
import { ConfigurityDriver } from "../../src"
import * as path from "node:path";

interface Settings {
  enable_database: boolean
  max_power: number
  database_name: string
}

const YML_PATH = path.join(__dirname, '..', '__fixtures__', 'configurity.yml')

describe("Configurity driver", () => {
  const config = loadConfigParser<Settings>(YML_PATH)
  const driver = new ConfigurityDriver<Settings>(config)

  it('returns a non-contextual value', async () => {
    expect(await driver.getRawValue('enable_database')).toBeTruthy()
    expect(await driver.getRawValue('max_power')).toBe(1)
    expect(await driver.getRawValue('database_name')).toBe('test-database')
    expect(driver.getRawValueSync('enable_database')).toBeTruthy()
    expect(driver.getRawValueSync('max_power')).toBe(1)
    expect(driver.getRawValueSync('database_name')).toBe('test-database')

  })

  it('returns a default value', async () => {
    // @ts-ignore
    expect(await driver.getRawValue('no_value', {
      defaultValue: 'default'
    })).toBe('default')
  })

  it('returns a contextual value', async () => {
    expect(await driver.getRawValue('max_power', {
      context: {
        environment: 'production',
        power: 'low'
      }
    })).toBe(0)
  })

  it('returns a contextual default value', async () => {
    expect(await driver.getRawValue('max_power', {
      context: {
        environment: 'production',
        power: 'high'
      },
      defaultValue: 1
    })).toBe(1)
  })

  it('returns all values', async () => {
    expect(await driver.getAllRawValues()).toEqual({
      enable_database: true,
      max_power: 1,
      database_name: 'test-database'
    })

    expect(driver.getAllRawValuesSync()).toEqual({
      enable_database: true,
      max_power: 1,
      database_name: 'test-database'
    })
  })

  it('returns all values using a context', async () => {
    expect(await driver.getAllRawValues({
      context: {
        environment: 'production',
        power: 'low'
      }
    })).toEqual({
      enable_database: true,
      database_name: 'prd-database',
      max_power: 0,
    })
  })
})
