import { SimpleKeyValueDriver } from "../../src";

describe('SimpleKeyValueDriver', () => {
  let driver: SimpleKeyValueDriver;
  const config = {
    key1: 'value1',
    key2: 'value2',
    key3: true,
    key4: 123,
    key5: { nestedKey: 'nestedValue' }
  };

  beforeEach(() => {
    driver = new SimpleKeyValueDriver(config);
  });

  it('should return the correct value for a given key (sync)', () => {
    expect(driver.getRawValueSync('key1')).toEqual('value1');
    expect(driver.getRawValueSync('key2')).toEqual('value2');
  });

  it('should return the correct value for a given key (async)', async () => {
    await expect(driver.getRawValue('key3')).resolves.toEqual(true);
    await expect(driver.getRawValue('key4')).resolves.toEqual(123);
  });

  it('should return null for an unknown key', () => {
    expect(driver.getRawValueSync('unknownKey')).toBeNull();
  });

  it('should return the default value when provided for an unknown key', () => {
    expect(driver.getRawValueSync('unknownKey', { defaultValue: 'default' })).toEqual('default');
  });

  it('should return all key-value pairs', () => {
    expect(driver.getAllValuesSync()).toEqual(config);
  });

  it('should return all key-value pairs (async)', async () => {
    await expect(driver.getAllValues()).resolves.toEqual(config);
  });
});
