import {
  SyncFeatureManager,
  AsyncFeatureManager,
  EnvironmentDriver,
  LaunchDarklyServerDriver,
  DummyDriver,
  SimpleKeyValueDriver,
} from '../src'
import { LDClient } from '@launchdarkly/node-server-sdk'
import { LDContext } from '@launchdarkly/js-sdk-common'

class MockLdServerClient {
  variation = jest.fn().mockResolvedValue(true)
  allFlagsState = jest.fn().mockResolvedValue({
    allValues: jest.fn().mockReturnValue({ testFlag: true }),
  })
  close = jest.fn().mockResolvedValue(undefined)
}

describe('FeatureManager', () => {
  it('AsyncFeatureManager should work with async drivers', async () => {
    const ldDriver = new LaunchDarklyServerDriver(
      new MockLdServerClient() as unknown as LDClient,
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
      new MockLdServerClient() as unknown as LDClient,
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

  it('SyncFeatureManager should get a driver', async () => {
    interface Flags {
      'test-flag': string
    }

    const envDriver = new SimpleKeyValueDriver<Flags>({
      'test-flag': 'test-value',
    })

    const manager = new SyncFeatureManager(envDriver)

    const driver = manager.getDriver() as SimpleKeyValueDriver<Flags>

    expect(driver.setValueSync).toBeDefined()

    expect(
      (manager.getDriver() as SimpleKeyValueDriver<Flags>).setValueSync
    ).toBeDefined()
  })

  it('SyncFeatureManager should not work with sync drivers', async () => {
    const ldDriver = new LaunchDarklyServerDriver(
      new MockLdServerClient() as unknown as LDClient,
      {} as unknown as LDContext
    )

    // @ts-expect-error
    const manager = new SyncFeatureManager(ldDriver)

    expect(manager.getDriver().assertGetRawValueSync).not.toBeDefined()
  })

  it('can swap managers for the same variable', async () => {
    const ldServerDriver = new LaunchDarklyServerDriver(
      new MockLdServerClient() as unknown as LDClient,
      {} as unknown as LDContext
    )

    let manager

    const envDriver = new EnvironmentDriver()

    manager = new AsyncFeatureManager(ldServerDriver)
    manager = new SyncFeatureManager(envDriver)

    expect(
      manager.getRawValue('lkajsfsdf', {
        context: {
          kind: 'multi',
          key: 'lkajsfsdf',
        },
      })
    ).toBeDefined()
  })

  it('should use a dummy driver', async () => {
    class SampleFeatureManager extends SyncFeatureManager<
      Record<string, any>,
      any
    > {
      constructor() {
        super(new DummyDriver())
      }

      async init() {
        this.setDriver(new EnvironmentDriver())
      }
    }

    const manager = new SampleFeatureManager()
    await manager.init()

    expect(manager).toBeDefined()
  })
})
