import withAuthentication, { AuthRequiredNextAPIRouteHandler } from '../withAuthentication';
jest.mock('next-auth/react');
import { getSession } from 'next-auth/react';
import constructHTTPMocks from './utils';
import { User } from '@prisma/client';
import { IdentifiedSession } from '../../session';
import { v4 } from 'uuid';

const mockedGetSession = jest.mocked(getSession);
describe(withAuthentication, () => {
    it('returns a function handler for API routes', () => {
        const handler = jest.fn() as AuthRequiredNextAPIRouteHandler;
        expect(withAuthentication(handler)).toBeInstanceOf(Function);
    });
    it('returns a handler that will send back a 403 status if the session is not an IdentifiedSession', async () => {
        const handler = jest.fn() as AuthRequiredNextAPIRouteHandler;
        mockedGetSession.mockResolvedValueOnce(null);
        const { req, res } = constructHTTPMocks();
        const wrappedHandler = withAuthentication(handler);
        await wrappedHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
    });
    it('returns a handler that will send back an APIErrorResponse if the session is not an IdentifiedSession', async () => {
        const handler = jest.fn() as AuthRequiredNextAPIRouteHandler;
        mockedGetSession.mockResolvedValueOnce(null);
        const { req, res } = constructHTTPMocks();
        const wrappedHandler = withAuthentication(handler);
        await wrappedHandler(req, res);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: 'Unauthenticated',
        });
    });
    it('returns a handler that will call the wrapped protected handler with the session if the session is identified', async () => {
        const handler = jest.fn() as AuthRequiredNextAPIRouteHandler;
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
        mockedGetSession.mockResolvedValueOnce(session);
        const { req, res } = constructHTTPMocks();
        const wrappedHandler = withAuthentication(handler);
        await wrappedHandler(req, res);
        expect(handler).toHaveBeenCalledWith(req, res, session);
    });
});
