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

/**
 * The return type of a flag value.
 */
export type ValueReturnType<
  Flags,
  K extends keyof Flags,
  Params extends CommonValueParams<Flags, K> | undefined = undefined,
> = Params extends {
  defaultValue: infer DefaultValue
}
  ? Flags[K] | DefaultValue
  : Flags[K] | null | undefined
