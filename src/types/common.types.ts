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

export type ValueReturnType<
  Flags,
  K extends keyof Flags,
  Params extends CommonValueParams<Flags, K> | undefined = undefined,
> = Params extends {
  defaultValue: infer DefaultValue
}
  ? Flags[K] | DefaultValue | null | undefined
  : Flags[K] | null | undefined
