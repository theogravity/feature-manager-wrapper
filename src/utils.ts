export function isNotDefined(value: any) {
  return value === null || value === undefined || value === ''
}

export class FeatureManagerAssertionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FeatureManagerAssertError'
  }
}
