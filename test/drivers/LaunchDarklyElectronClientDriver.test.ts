import { LDElectronMainClient } from 'launchdarkly-electron-client-sdk'
import { LaunchDarklyElectronClientDriver } from '../../src'

class MockClient {
  variation = jest.fn().mockResolvedValue(true)
  allFlags = jest.fn().mockResolvedValue({ testFlag: true })
  close = jest.fn().mockResolvedValue(undefined)
}

describe('LaunchDarklyElectronClientDriver', () => {
  let ldClient = new MockClient()
  let driver = new LaunchDarklyElectronClientDriver(
    ldClient as unknown as LDElectronMainClient
  )

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

  test('close method calls LDElectronMainClient close', async () => {
    await driver.close()
    expect(ldClient.close).toHaveBeenCalled()
  })

  test('getClient returns the LDElectronMainClient instance', () => {
    expect(driver.getClient()).toBe(ldClient)
  })
})
