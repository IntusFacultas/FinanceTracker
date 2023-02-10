import { LookupValues } from '../../type-utils';

export const SESSION_STATUSES = {
    LOADING: 'loading',
    AUTHENTICATED: 'authenticated',
    UNAUTHENTICATED: 'unauthenticated',
} as const;

export type SessionStatus = LookupValues<typeof SESSION_STATUSES>;
