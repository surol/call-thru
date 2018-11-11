/**
 * Arguments to function call.
 *
 * This is basically a tuple with a marker property, which is treated specially by call chaining functions.
 * When previous function in chain returns an `Args` instance, the next one will be called with returned arguments.
 * Otherwise the next function will be called with single argument containing a value returned.
 *
 * An `Args.of()` and `Args.withThis()` functions can be used to construct `Args` instance.
 *
 * @param T A type of `this` argument passed to the function.
 * @param P A type of arguments tuple.
 */
export type Args<T, P extends any[]> = P & {

  /**
   * A `this` argument to pass to the function.
   *
   * This is also a marker property to distinguish the arguments from plain tuples. So it is required to present.
   */
  [Args.thisKey]: T;

};

export namespace Args {

  /**
   * Arguments tuple type. Either extracted from `Args`, or consisting of single argument of type `A`.
   */
  export type Tuple<A> = A extends Args<any, infer P> ? P : [A];

  /**
   * `this` argument type. Either extracted from `Args`, or `undefined`.
   */
  export type This<A> = A extends Args<infer T, any[]> ? T : undefined;

  /**
   * A marker symbol to distinguish calls.
   *
   * A tuple should contain a property with this key to be considered a call.
   */
  export const thisKey = Symbol('this');

  /**
   * Constructs a function call arguments.
   *
   * The `this` argument of constructed function is void.
   *
   * @param args Call arguments.
   *
   * @return A new function call arguments instance.
   */
  export function of<P extends any[]>(...args: P): Args<void, P> {

    const result = args as Args<void, P>;

    result[thisKey] = undefined;

    return result;
  }

  /**
   * Constructs a function call arguments with the given `this` argument.
   *
   * @param thisArg `this` argument value.
   * @param args Call arguments.
   *
   * @return A new function call arguments instance.
   */
  export function withThis<T, P extends any[]>(thisArg: T, ...args: P): Args<T, P> {

    const result = args as Args<T, P>;

    result[thisKey] = thisArg;

    return result;
  }

  /**
   * Detects whether the given tuple is a function call arguments.
   *
   * @param args Arguments instance to check.
   *
   * @return `true` if the given `tuple` has a `[Call.symbol]` property, or `false` otherwise.
   */
  export function is<T, P extends any[]>(args: Args<T, P>): args is Args<T, P>;

  /**
   * Detects whether the target values is a call.
   *
   * @param target Target value to check.
   *
   * @return `true` if the `target` value is an array and has a `[Call.symbol]` property, or `false` otherwise.
   */
  export function is<T, P extends any[]>(target: any): target is Args<T, P>;

  export function is<T, P extends any[]>(target: any): target is Args<T, P> {
    return Array.isArray(target) && thisKey in target;
  }

  /**
   * Calls the given function with the given arguments.
   *
   * @param fn A function to call.
   * @param args Arguments to pass to the function.
   *
   * @returns Function call result.
   */
  export function invoke<P extends Args<any, any>, R>(
      fn: (this: This<P>, ...args: Tuple<P>) => R,
      args: Args<This<P>, Tuple<P>>): R;

  /**
   * Calls the given function with the given argument.
   *
   * @param fn A function to call.
   * @param arg Argument to pass to the function.
   *
   * @returns Function call result.
   */
  export function invoke<P, R>(
      fn: (this: void, arg: P) => R,
      arg: P): R;

  export function invoke<P, R>(
      fn: (this: This<P>, ...args: Tuple<P>) => R,
      args: Args<This<P>, Tuple<P>>): R {
    if (is(args)) {
      return fn.apply(args[thisKey], args);
    }
    return fn.call(null, args);
  }

}
