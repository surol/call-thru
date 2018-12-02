import { nextCall, NextCall } from '../next-call';
import { PassedThru } from '../passed-thru';

declare module '../call-outcome' {
  export namespace CallOutcome {
    export interface Map<Return, Out> {

      /**
       * Skipped call outcome type. Always `undefined`.
       */
      skip(): PassedThru<undefined, never>;

    }
  }
}

export type SkippedThru = PassedThru<undefined, never>;

export interface NextSkip<NextArgs extends any[], NextReturn>
    extends NextCall<'skip', NextArgs, NextReturn, SkippedThru> {

  (): NextSkip<NextArgs, NextReturn>;

  [NextCall.next](callee: (this: void, ...args: NextArgs) => NextReturn): SkippedThru;

  [NextCall.last](): SkippedThru;

}

const SKIP: SkippedThru = {
  [PassedThru.as]: undefined,
  * [Symbol.iterator](): Iterator<never> {},
};

function _skip(): SkippedThru {
  return SKIP;
}

const _nextSkip: NextCall<'skip', any[], any, SkippedThru> = nextCall(_skip, _skip);

/**
 * Constructs a next call that skips the rest of the chain.
 *
 * This has the same effect as `nextReturn(undefined)`.
 */
export function nextSkip<NextArgs extends any[], NextReturn>(): NextSkip<NextArgs, NextReturn> {
  return _nextSkip as NextCall<'skip', NextArgs, NextReturn, SkippedThru>;
}
