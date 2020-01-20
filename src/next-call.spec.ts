import { noop } from './misc';
import { nextCall, NextCall, NextCall__symbol } from './next-call';

describe('Next call', () => {
  describe('nextCall', () => {
    it('returns a next call', () => {

      const next = nextCall(noop);

      expect(NextCall.of(next)).toBe(next);
    });
    it('builds a value returning next call', () => {

      const next = NextCall.of('some');
      const calleeSpy = jest.fn(() => 'result');

      expect(next[NextCall__symbol](calleeSpy)).toBe('result');
      expect(calleeSpy).toHaveBeenCalledWith('some');
    });
  });
  describe('NextCall', () => {
    describe('is', () => {
      it('detects next function call', () => {
        expect(NextCall.is(nextCall(noop))).toBe(true);
      });
      it('rejects plain function', () => {
        expect(NextCall.is(noop)).toBe(false);
      });
      it('rejects other values', () => {
        expect(NextCall.is('some')).toBe(false);
      });
    });
  });
});
