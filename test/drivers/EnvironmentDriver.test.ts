import { EnvironmentDriver } from "../../src";

// Mock process.env for testing
const mockEnv = {
  FEATURE_A: 'true',
  FEATURE_B: '123',
  FEATURE_C: 'hello',
};

describe('EnvironmentDriver', () => {
  let driver: EnvironmentDriver;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...mockEnv };
    driver = new EnvironmentDriver();
  });

  it('should return the correct value for a boolean flag', async () => {
    expect(await driver.getBoolValue('FEATURE_A')).toBe(true);
    expect(driver.getBoolValueSync('FEATURE_A')).toBe(true);
  });

  it('should return the correct value for a numeric flag', async () => {
    expect(await driver.getNumValue('FEATURE_B')).toBe(123);
    expect(driver.getNumValueSync('FEATURE_B')).toBe(123);
  });

  it('should return the correct value for a string flag', async () => {
    expect(await driver.getStrValue('FEATURE_C')).toBe('hello');
    expect(driver.getStrValueSync('FEATURE_C')).toBe('hello');
  });

  it('should return null for an undefined flag', async () => {
    expect(await driver.getStrValue('UNDEFINED_FEATURE')).toBeNull();
    expect(driver.getStrValueSync('UNDEFINED_FEATURE')).toBeNull();
  });

  it('should return all environment variables', async () => {
    expect(await driver.getAllRawValues()).toEqual(mockEnv);
    expect(driver.getAllRawValuesSync()).toEqual(mockEnv);
  });

  it('should handle default values correctly', async () => {
    expect(await driver.getStrValue('UNDEFINED_FEATURE', { defaultValue: 'default' })).toBe('default');
    expect(driver.getStrValueSync('UNDEFINED_FEATURE', { defaultValue: 'default' })).toBe('default');
  });
});
