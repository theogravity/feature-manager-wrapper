import { LDClient } from 'launchdarkly-js-client-sdk'
import { LaunchDarklyClientDriver } from '../../src'

class MockClient {
  variation = jest.fn().mockResolvedValue(true)
  allFlags = jest.fn().mockResolvedValue({ testFlag: true })
  close = jest.fn().mockResolvedValue(undefined)
}

describe('LaunchDarklyClientDriver', () => {
  let ldClient = new MockClient()
  let driver = new LaunchDarklyClientDriver(ldClient as unknown as LDClient)

  test('getRawValue returns the correct value', async () => {
    const value = await driver.getRawValue('testFlag')
    expect(value).toBe(true)
    expect(ldClient.variation).toHaveBeenCalledWith('testFlag', undefined)
  })

  test('getAllValues returns all flag values', async () => {
    const values = await driver.getAllRawValues()
    expect(values).toEqual({ testFlag: true })
    expect(ldClient.allFlags).toHaveBeenCalled()
  })

  test('close method calls LDClient close', async () => {
    await driver.close()
    expect(ldClient.close).toHaveBeenCalled()
  })

  test('getClient returns the LDClient instance', () => {
    expect(driver.getClient()).toBe(ldClient)
  })
})
