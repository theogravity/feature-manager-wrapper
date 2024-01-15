import {
  SyncFeatureManager,
  AsyncFeatureManager,
  EnvironmentDriver,
  LaunchDarklyServerDriver,
} from '../src'
import { LDClient } from '@launchdarkly/node-server-sdk'
import { LDContext } from '@launchdarkly/js-sdk-common'

class MockClient {
  variation = jest.fn().mockResolvedValue(true)
  allFlagsState = jest.fn().mockResolvedValue({
    allValues: jest.fn().mockReturnValue({ testFlag: true }),
  })
  close = jest.fn().mockResolvedValue(undefined)
}

describe('FeatureManager', () => {
  it('AsyncFeatureManager should work with async drivers', async () => {
    const ldDriver = new LaunchDarklyServerDriver(
      new MockClient() as unknown as LDClient,
      {} as unknown as LDContext
    )

    const manager = new AsyncFeatureManager(ldDriver)

    expect(manager).toBeDefined()
  })

  it('AsyncFeatureManager should work with sync drivers', async () => {
    const envDriver = new EnvironmentDriver()

    const manager = new AsyncFeatureManager(envDriver)

    expect(manager).toBeDefined()
  })

  it('AsyncAndSyncFeatureManager should work with async drivers', async () => {
    const ldDriver = new LaunchDarklyServerDriver(
      new MockClient() as unknown as LDClient,
      {} as unknown as LDContext
    )

    const manager = new AsyncFeatureManager(ldDriver)

    expect(manager).toBeDefined()
  })

  it('SyncFeatureManager should work with sync drivers', async () => {
    const envDriver = new EnvironmentDriver()

    const manager = new SyncFeatureManager(envDriver)

    expect(manager).toBeDefined()
  })

  it('SyncFeatureManager should not work with sync drivers', async () => {
    const ldDriver = new LaunchDarklyServerDriver(
      new MockClient() as unknown as LDClient,
      {} as unknown as LDContext
    )

    // @ts-expect-error
    const manager = new SyncFeatureManager(ldDriver)

    expect(manager.getDriver().assertGetRawValueSync).not.toBeDefined()
  })
})
