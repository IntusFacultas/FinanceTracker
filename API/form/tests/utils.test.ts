import { nonEmptyString } from '../utils';
import { z } from 'zod';
import 'jest-extended';

describe(nonEmptyString, () => {
    it('returns a Zod string validator', () => {
        expect(nonEmptyString()).toBeInstanceOf(z.ZodString);
    });
    it('returns a Zod validator which rejects an empty string', () => {
        expect(nonEmptyString().safeParse('').success).toBeFalse();
    });
});
