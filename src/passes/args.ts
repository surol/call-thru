import { nextCall, NextCall } from '../next-call';

export interface NextArgs<Args extends any[], NextReturn>
    extends NextCall<'default', Args, NextReturn, NextReturn, Args> {

  (): NextArgs<Args, NextReturn>;

  [NextCall.next](callee: (this: void, ...args: Args) => NextReturn): NextReturn;

  [NextCall.last](): Args;

}

/**
 * Constructs arguments for the next function call.
 *
 * When returned from the lass pass, the outcome will contain a tuple containing `args`.
 *
 * @param args Next function call arguments.
 *
 * @return A next function call with the given arguments.
 */
export function nextArgs<Args extends any[], NextReturn>(...args: Args): NextArgs<Args, NextReturn> {
  return nextCall(callee => callee.apply(null, args), () => args);
}
