import { AsyncBaseConfigDriver } from "../../src"

// Simple in-memory key/value store implementation of BaseFeatureDriver
class SimpleFeatureDriver<
  Flags extends Record<string, any> = Record<string, any>,
  Context = never,
> extends AsyncBaseConfigDriver<Flags, Context> {
  store: Flags

  constructor(store: Flags) {
    super()

    this.store = store
  }

  async getClient() {
    return this.store
  }

  async getAllValues(): Promise<Flags> {
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
    expect(await driver.getNumValue('flagBool')).toBe(1)
    expect(await driver.getNumValue('flagNumStr')).toBe(42)
  })

  afterEach(async () => {
    await driver.close()
  })
})
