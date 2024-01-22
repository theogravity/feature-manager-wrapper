import { SyncFeatureManagerDriver } from '../base-drivers/SyncFeatureManagerDriver'
import { CommonValueParams, ValueReturnType } from '../types/common.types'

/**
 * Used to initialize a SyncFeatureManager or AsyncFeatureManager in the event a separate async init step is required
 * to initialize a 3rd party driver.
 *
 * Example:
 *
 * class MyFeatureManager extends SyncFeatureManager {
 *
 *   constructor() {
 *     // We have to pass a driver to the constructor, so we pass a dummy driver
 *     super(new DummySyncDriver())
 *   }
 *
 *   async init() {
 *    // Do some async init stuff
 *   }
 * }
 *
 * Does not do anything other than to satisfy the constructor of SyncFeatureManager / AsyncFeatureManager.
 */
export class DummyDriver<
  Flags extends Record<string, any> = Record<string, any>,
  Context = never,
> extends SyncFeatureManagerDriver<Flags, Context> {
  constructor() {
    super()
  }

  async getRawValue<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
  >(key: K, params?: Params): Promise<ValueReturnType<Flags, K, Params>> {
    return this.getRawValueSync(key, params)
  }

  getRawValueSync<
    K extends string & keyof Flags,
    Params extends CommonValueParams<Flags, K> | undefined = undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  >(key: K, params?: Params): ValueReturnType<Flags, K, Params> {
    return void 0 as any
  }

  getAllRawValuesSync(): Flags {
    return void 0 as any
  }

  async getAllRawValues(): Promise<Flags> {
    return this.getAllRawValuesSync()
  }

  /**
   * Does nothing in this driver
   */
  async close() {
    // Nothing to do here
    return
  }

  /**
   * Does nothing in this driver
   */
  closeSync() {
    // Nothing to do here
    return
  }
}
