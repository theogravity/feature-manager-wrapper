
import { LDClient } from '@launchdarkly/node-server-sdk';
import { LaunchDarklyServerDriver } from '../../src';

class MockClient {
  variation = jest.fn().mockResolvedValue(true);
  allFlagsState = jest.fn().mockResolvedValue({
    allValues: jest.fn().mockReturnValue({ testFlag: true })
  });
  close = jest.fn().mockResolvedValue(undefined);
}

describe('LaunchDarklyServerDriver', () => {
  let ldClient: MockClient;
  let driver: LaunchDarklyServerDriver;
  let defaultContext = { key: "", kind: "multi" }

  beforeEach(() => {
    ldClient = new MockClient();
    driver = new LaunchDarklyServerDriver(ldClient as unknown as LDClient, { key: "", kind: "multi" });
  });

  test('getRawValue returns the correct value', async () => {
    const value = await driver.getRawValue('testFlag');
    expect(value).toBe(true);
    expect(ldClient.variation).toHaveBeenCalledWith('testFlag', defaultContext, undefined);
  });

  test('getAllValues returns all flag values', async () => {
    const values = await driver.getAllValues();
    expect(values).toEqual({ testFlag: true });
    expect(ldClient.allFlagsState).toHaveBeenCalled();
  });

  test('close method calls LDClient close', async () => {
    await driver.close();
    expect(ldClient.close).toHaveBeenCalled();
  });

  test('getClient returns the LDClient instance', () => {
    expect(driver.getClient()).toBe(ldClient);
  });
});
