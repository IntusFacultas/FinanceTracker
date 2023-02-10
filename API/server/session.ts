import { User } from '@prisma/client';
import { Session } from 'next-auth';

export interface IdentifiedSession extends Session {
    id: number;
    user: User;
}

export type UnauthenticatedSession = Omit<Session, 'user'> | null;

export const isUser = (value: unknown): value is User => {
    const { id, name, email, image, uuid, emailVerified } = (value ?? {}) as User;
    const uuidIsValid = typeof uuid === 'string';
    const emailVerifiedIsEmail = emailVerified instanceof Date || emailVerified === null;
    const idIsValid = typeof id === 'number';
    const nameIsValid = typeof name === 'string' || !name;
    const emailIsValid = typeof email === 'string' || !email;
    const imageIsValid = typeof image === 'string' || !image;
    return idIsValid && nameIsValid && emailIsValid && imageIsValid && uuidIsValid && emailVerifiedIsEmail;
};

export const isSession = (value: unknown): value is Session => {
    const { user, expires } = (value ?? {}) as Session;
    const userIsValid = isUser(user) || !user;
    const expiresIsValid = typeof expires === 'string';
    return expiresIsValid && userIsValid;
};

export const isIdentifiedSession = (value: unknown): value is IdentifiedSession => {
    const session = (value ?? {}) as IdentifiedSession;
    const sessionIsValid = isSession(session);
    const sessionIDIsValid = typeof session.id === 'number';
    const sessionUserIsValid = isUser(session.user);
    return sessionIsValid && sessionUserIsValid && sessionIDIsValid;
};
