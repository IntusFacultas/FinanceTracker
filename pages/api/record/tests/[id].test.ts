import constructHTTPMocks from '../../../../API/server/routes/tests/utils';
import wrappedHandler from '../[id]';
import { RequestMethod } from 'node-mocks-http';

jest.mock('../../../../API/server/db', () => ({
    __esModule: true,
    DBRecord: {
        create: jest.fn(),
        delete: jest.fn(),
    },
    DBCategory: {
        create: jest.fn(),
        findFirst: jest.fn(),
    },
}));

jest.mock('next-auth/react');
import { getSession } from 'next-auth/react';
const mockedGetSession = jest.mocked(getSession);

import { DBRecord } from '../../../../API/server/db';
import { Record, User } from '@prisma/client';
import { v4 } from 'uuid';
import { NetworkMappers } from '../../../../API/mappers/record';
import { IdentifiedSession } from '../../../../API/server/session';
const mockedORM = jest.mocked(DBRecord);

const date = new Date(2022, 2, 10, 0, 0, 0, 0);
const record: Record = {
    id: 1,
    uuid: `${v4()}`,
    value: 1,
    categoryID: 1,
    reporterID: 1,
    date,
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

const supportedMethods: MethodTestCase[] = [{ method: 'DELETE' }];
const unsupportedMethods: MethodTestCase[] = [
    { method: 'CONNECT' },
    { method: 'GET' },
    { method: 'HEAD' },
    { method: 'OPTIONS' },
    { method: 'POST' },
    { method: 'PUT' },
    { method: 'TRACE' },
];

describe('api/record/[id] handler', () => {
    it.each(supportedMethods)('supports $method', async ({ method }) => {
        mockedGetSession.mockResolvedValueOnce(session);
        mockedORM.delete.mockResolvedValueOnce(record);
        const { req, res } = constructHTTPMocks(method);
        req.query.id = '1';
        await wrappedHandler(req, res);
        expect(res.status).not.toHaveBeenCalledWith(405);
    });
    it.each(unsupportedMethods)('does supports $method', async ({ method }) => {
        mockedGetSession.mockResolvedValueOnce(session);
        mockedORM.delete.mockResolvedValueOnce(record);
        const { req, res } = constructHTTPMocks(method);
        req.query.id = '1';
        await wrappedHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(405);
    });
    it('rejects unauthenticated requests', async () => {
        mockedGetSession.mockResolvedValueOnce(null);
        const { req, res } = constructHTTPMocks('DELETE');
        await wrappedHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
    });
    it('performs a delete request with the id passed to it', async () => {
        mockedGetSession.mockResolvedValueOnce(session);
        mockedORM.delete.mockResolvedValueOnce(record);
        const { req, res } = constructHTTPMocks('DELETE');
        req.query.id = '1';
        await wrappedHandler(req, res);
        expect(mockedORM.delete).toHaveBeenCalledWith(1);
    });
    it('returns the deleted record', async () => {
        mockedGetSession.mockResolvedValueOnce(session);
        mockedORM.delete.mockResolvedValueOnce(record);
        const { req, res } = constructHTTPMocks('DELETE');
        req.query.id = '1';
        await wrappedHandler(req, res);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: NetworkMappers.Record.toNetwork(record),
        });
    });
});
