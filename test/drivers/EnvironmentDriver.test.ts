import { EnvironmentDriver } from '../../src'

describe('EnvironmentDriver', () => {
  interface Flags {
    FEATURE_FLAG: boolean
    ANOTHER_FLAG: number
    OBJECT_FLAG: Record<string, any>
    ARRAY_FLAG: Array<any>
    BOOLEAN_FLAG: boolean
    SAMPLE_TEXT: string
  }

  const environmentDriver = new EnvironmentDriver<Flags>()

  const mockEnv = {
    FEATURE_FLAG: 'true',
    ANOTHER_FLAG: '123',
    OBJECT_FLAG: '{"key":"value"}',
    ARRAY_FLAG: '[1,2,3]',
    BOOLEAN_FLAG: 'false',
    SAMPLE_TEXT: 'Hello World',
  }

  process.env = mockEnv

  describe('getRawValue', () => {
    it('should return the correct raw value from environment variables', async () => {
      const result = await environmentDriver.getRawValue('FEATURE_FLAG', {
        defaultValue: true,
      })
      expect(result).toBe('true')
    })

    it('should return the default value if key is not found', async () => {
      // @ts-ignore
      const result = await environmentDriver.getRawValue('UNKNOWN_FLAG', {
        defaultValue: 'default',
      })
      expect(result).toBe('default')
    })

    it('should return undefined for a key that does not exist without a default value', async () => {
      // @ts-ignore
      const result = await environmentDriver.getRawValue('MISSING_FLAG')
      expect(result).toBeUndefined()
    })

    it('should retrieve an object from environment variables', async () => {
      const result = await environmentDriver.getRawValue('OBJECT_FLAG')
      expect(result).toBe(mockEnv.OBJECT_FLAG)
    })

    it('should retrieve an array from environment variables', async () => {
      const result = await environmentDriver.getRawValue('ARRAY_FLAG')
      expect(result).toBe(mockEnv.ARRAY_FLAG)
    })

    it('should retrieve a boolean from environment variables', async () => {
      const result = await environmentDriver.getRawValue('BOOLEAN_FLAG')
      expect(result).toBe('false')
    })

    it('should retrieve sample text from environment variables', async () => {
      const result = await environmentDriver.getRawValue('SAMPLE_TEXT')
      expect(result).toBe('Hello World')
    })
  })

  describe('getAllRawValues', () => {
    it('should return all environment variables', async () => {
      const result = await environmentDriver.getAllRawValues()
      expect(result).toEqual(mockEnv)
    })
  })

  describe('close', () => {
    it('should not throw any error', async () => {
      await expect(environmentDriver.close()).resolves.toBeUndefined()
    })
  })
})
