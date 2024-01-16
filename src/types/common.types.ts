/**
 * Common optional parameters for retrieving a flag.
 */
/**
 * Common optional parameters for retrieving a flag.
 */
export type CommonValueParams<Flags, K extends keyof Flags> = {
  /**
   * The default value to use if the flag is not found.
   */
  defaultValue?: Flags[K]
  /**
   * The context to use when retrieving the flag.
   */
  context?: any
}
