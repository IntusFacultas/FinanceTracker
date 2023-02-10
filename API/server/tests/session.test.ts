import { User } from '@prisma/client';
import { isUser, isSession, isIdentifiedSession, IdentifiedSession } from '../session';
import { v4 } from 'uuid';
import 'jest-extended';
import { Session } from 'next-auth';

describe(isUser, () => {
    it('returns true if the passed in object is a User', () => {
        const user: User = {
            id: 1,
            uuid: v4(),
            name: 'John Smith',
            email: 'something@gmail.com',
            emailVerified: new Date(),
            image: '/img/url',
        };
        expect(isUser(user)).toBeTrue();
    });
    it('returns true if the passed in object is a minimally defined User', () => {
        const user: User = {
            id: 1,
            uuid: v4(),
            name: null,
            email: null,
            emailVerified: null,
            image: null,
        };
        expect(isUser(user)).toBeTrue();
    });
    it('returns false if passed null', () => {
        expect(isUser(null)).toBeFalse();
    });
    it('returns false if passed an object missing the id', () => {
        const user = {
            uuid: v4(),
            name: 'John Smith',
            email: 'something@gmail.com',
            emailVerified: null,
            image: null,
        };
        expect(isUser(user)).toBeFalse();
    });
    it('returns false if passed an object missing the uuid', () => {
        const user = {
            id: 1,
            name: 'John Smith',
            email: 'something@gmail.com',
            emailVerified: null,
            image: null,
        };
        expect(isUser(user)).toBeFalse();
    });
    it('returns false if passed an object with an invalid id', () => {
        const user = {
            id: '1',
            uuid: v4(),
            name: 'John Smith',
            email: 'something@gmail.com',
            emailVerified: null,
            image: null,
        };
        expect(isUser(user)).toBeFalse();
    });
    it('returns false if passed an object with an invalid uuid', () => {
        const user = {
            id: 1,
            uuid: 1,
            name: 'John Smith',
            email: 'something@gmail.com',
            emailVerified: null,
            image: null,
        };
        expect(isUser(user)).toBeFalse();
    });
    it('returns false if passed an object with an invalid name', () => {
        const user = {
            id: 1,
            uuid: v4(),
            name: 1,
            email: 'something@gmail.com',
            emailVerified: null,
            image: null,
        };
        expect(isUser(user)).toBeFalse();
    });
    it('returns false if passed an object with an invalid email', () => {
        const user = {
            id: 1,
            uuid: v4(),
            name: 'John Smith',
            email: 1,
            emailVerified: null,
            image: null,
        };
        expect(isUser(user)).toBeFalse();
    });
    it('returns false if passed an object with an invalid emailVerified', () => {
        const user = {
            id: 1,
            uuid: v4(),
            name: 'John Smith',
            email: 'something@gmail.com',
            emailVerified: 1,
            image: null,
        };
        expect(isUser(user)).toBeFalse();
    });
    it('returns false if passed an object with an invalid image', () => {
        const user = {
            id: 1,
            uuid: v4(),
            name: 'John Smith',
            email: 'something@gmail.com',
            emailVerified: 1,
            image: 1,
        };
        expect(isUser(user)).toBeFalse();
    });
});

describe(isSession, () => {
    it('returns true if provided a valid session', () => {
        const user: User = {
            id: 1,
            uuid: v4(),
            name: 'John Smith',
            email: 'something@gmail.com',
            emailVerified: new Date(),
            image: '/img/url',
        };
        const session: Session = {
            user,
            expires: 'sometime',
        };
        expect(isSession(session)).toBeTrue();
    });
    it("returns true if it's got a null user", () => {
        const session = {
            expires: 'something',
            user: null,
        };
        expect(isSession(session)).toBeTrue();
    });
    it('returns false if passed a null value', () => {
        expect(isSession(null)).toBeFalse();
    });
    it("returns false if it's got a bad user", () => {
        const session = {
            expires: 'something',
            user: {},
        };
        expect(isSession(session)).toBeFalse();
    });
    it("returns false if it's got a bad expires value", () => {
        const user: User = {
            id: 1,
            uuid: v4(),
            name: 'John Smith',
            email: 'something@gmail.com',
            emailVerified: new Date(),
            image: '/img/url',
        };
        const session = {
            user,
            expires: 1,
        };
        expect(isSession(session)).toBeFalse();
    });
});

describe(isIdentifiedSession, () => {
    it('returns true if the session has an authenticated user and id', () => {
        const user: User = {
            id: 1,
            uuid: v4(),
            name: 'John Smith',
            email: 'something@gmail.com',
            emailVerified: new Date(),
            image: '/img/url',
        };
        const session: IdentifiedSession = {
            user,
            id: user.id,
            expires: 'sometime',
        };
        expect(isIdentifiedSession(session)).toBeTrue();
    });
    it('returns false if the session is missing the id', () => {
        const user: User = {
            id: 1,
            uuid: v4(),
            name: 'John Smith',
            email: 'something@gmail.com',
            emailVerified: new Date(),
            image: '/img/url',
        };
        const session = {
            user,
            expires: 'sometime',
        };
        expect(isIdentifiedSession(session)).toBeFalse();
    });
    it('returns false is passed a null value', () => {
        expect(isIdentifiedSession(null)).toBeFalse();
    });
    it("returns false if it's got a null user", () => {
        const session = {
            expires: 'something',
            user: null,
        };
        expect(isIdentifiedSession(session)).toBeFalse();
    });
});
