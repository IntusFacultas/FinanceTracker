import constructHTTPMocks from '../../../../API/server/routes/tests/utils';
import wrappedHandler from '../';
import { RequestMethod } from 'node-mocks-http';

jest.mock('../../../../API/server/db', () => ({
    __esModule: true,
    DBCategory: {
        create: jest.fn(),
        findOrCreate: jest.fn(),
    },
}));

jest.mock('next-auth/react');
import { getSession } from 'next-auth/react';
const mockedGetSession = jest.mocked(getSession);

import { DBCategory } from '../../../../API/server/db';
import { Category, User } from '@prisma/client';
import { v4 } from 'uuid';
import { NewCategory } from '../../../../API/client/category/types';
import { IdentifiedSession } from '../../../../API/server/session';
const mockedDBCategory = jest.mocked(DBCategory);

const reporterID = 1;
const category: Category = {
    id: 1,
    uuid: `${v4()}`,
    title: 'Something',
    reporterID: reporterID,
};

const newCategory: NewCategory = {
    title: 'Some New Category',
};

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

type MethodTestCase = { method: RequestMethod };

const supportedMethods: MethodTestCase[] = [{ method: 'POST' }];
const unsupportedMethods: MethodTestCase[] = [
    { method: 'CONNECT' },
    { method: 'DELETE' },
    { method: 'GET' },
    { method: 'HEAD' },
    { method: 'OPTIONS' },
    { method: 'PUT' },
    { method: 'TRACE' },
];

describe('api/category/ handler', () => {
    it.each(supportedMethods)('supports $method', async ({ method }) => {
        mockedGetSession.mockResolvedValueOnce(session);
        mockedDBCategory.findOrCreate.mockResolvedValueOnce({
            created: false,
            category,
        });
        const { req, res } = constructHTTPMocks(method);
        req.query.id = '1';
        await wrappedHandler(req, res);
        expect(res.status).not.toHaveBeenCalledWith(405);
    });
    it.each(unsupportedMethods)('does not support $method', async ({ method }) => {
        mockedGetSession.mockResolvedValueOnce(session);
        const { req, res } = constructHTTPMocks(method);
        req.query.id = '1';
        await wrappedHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(405);
    });
    it('rejects unauthenticated requests', async () => {
        mockedGetSession.mockResolvedValueOnce(null);
        const { req, res } = constructHTTPMocks('POST');
        await wrappedHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
    });
    it('performs a find or create request for the category with the data passed to it', async () => {
        mockedGetSession.mockResolvedValueOnce(session);
        mockedDBCategory.findOrCreate.mockResolvedValueOnce({
            created: false,
            category,
        });
        const { req, res } = constructHTTPMocks('POST');
        req.body = newCategory;
        await wrappedHandler(req, res);
        expect(mockedDBCategory.findOrCreate).toHaveBeenCalledWith(newCategory.title, session.id);
    });
    it('returns the created category', async () => {
        mockedGetSession.mockResolvedValueOnce(session);
        mockedDBCategory.findOrCreate.mockResolvedValueOnce({
            created: false,
            category,
        });
        const { req, res } = constructHTTPMocks('POST');
        req.query.id = '1';
        await wrappedHandler(req, res);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: {
                category,
                created: false,
            },
        });
    });
});
