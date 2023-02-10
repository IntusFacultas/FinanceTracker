import { z } from 'zod';

export const nonEmptyString = (message = 'This question is required.') => {
    return z.string().min(1, { message });
};
