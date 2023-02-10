import constructHTTPMocks from '../../../../API/server/routes/tests/utils';
import wrappedHandler from '../';
import { RequestMethod } from 'node-mocks-http';

jest.mock('../../../../API/server/db', () => ({
    __esModule: true,
    DBRecord: {
        create: jest.fn(),
        delete: jest.fn(),
    },
    DBCategory: {
        create: jest.fn(),
        findOrCreate: jest.fn(),
    },
}));

jest.mock('next-auth/react');
import { getSession } from 'next-auth/react';
const mockedGetSession = jest.mocked(getSession);

import { DBRecord, DBCategory } from '../../../../API/server/db';
import { Category, Record, User } from '@prisma/client';
import { v4 } from 'uuid';
import { NetworkNewRecord, NewRecord } from '../../../../API/client/record/types';
import { DATE_FORMAT, NetworkMappers } from '../../../../API/mappers/record';
import { format } from 'date-fns';
import { IdentifiedSession } from '../../../../API/server/session';
const mockedDBRecord = jest.mocked(DBRecord);
const mockedDBCategory = jest.mocked(DBCategory);

const date = new Date(2022, 2, 10, 0, 0, 0, 0);
const record: Record = {
    id: 1,
    uuid: `${v4()}`,
    value: 1,
    categoryID: 1,
    reporterID: 1,
    date,
};

const category: Category = {
    id: 1,
    uuid: `${v4()}`,
    title: 'Something',
    reporterID: record.reporterID,
};

const newRecord: NewRecord = {
    value: 1,
    category: 'title',
    date,
};

const networkNewRecord: NetworkNewRecord = {
    ...newRecord,
    date: format(newRecord.date, DATE_FORMAT),
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
    { method: 'GET' },
    { method: 'HEAD' },
    { method: 'OPTIONS' },
    { method: 'DELETE' },
    { method: 'PUT' },
    { method: 'TRACE' },
];

describe('api/record/ handler', () => {
    it.each(supportedMethods)('supports $method', async ({ method }) => {
        mockedGetSession.mockResolvedValueOnce(session);
        mockedDBRecord.create.mockResolvedValueOnce(record);
        mockedDBCategory.findOrCreate.mockResolvedValueOnce({
            categoryCreated: false,
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
    it('performs a create request for the record with the data passed to it', async () => {
        mockedGetSession.mockResolvedValueOnce(session);
        mockedDBRecord.create.mockResolvedValueOnce(record);
        mockedDBCategory.findOrCreate.mockResolvedValueOnce({
            categoryCreated: false,
            category,
        });
        const { req, res } = constructHTTPMocks('POST');
        req.body = networkNewRecord;
        await wrappedHandler(req, res);
        expect(mockedDBRecord.create).toHaveBeenCalledWith(
            { date: newRecord.date, value: newRecord.value },
            session.id,
            category.id
        );
    });
    it('performs a find or create request for the category with the data passed to it', async () => {
        mockedGetSession.mockResolvedValueOnce(session);
        mockedDBRecord.create.mockResolvedValueOnce(record);
        mockedDBCategory.findOrCreate.mockResolvedValueOnce({
            categoryCreated: false,
            category,
        });
        const { req, res } = constructHTTPMocks('POST');
        req.body = networkNewRecord;
        await wrappedHandler(req, res);
        expect(mockedDBCategory.findOrCreate).toHaveBeenCalledWith(newRecord.category, session.id);
    });
    it('returns the created record', async () => {
        mockedGetSession.mockResolvedValueOnce(session);
        mockedDBRecord.delete.mockResolvedValueOnce(record);
        mockedDBRecord.create.mockResolvedValueOnce(record);
        mockedDBCategory.findOrCreate.mockResolvedValueOnce({
            categoryCreated: false,
            category,
        });
        const { req, res } = constructHTTPMocks('POST');
        req.query.id = '1';
        await wrappedHandler(req, res);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: {
                record: NetworkMappers.Record.toNetwork(record),
                category,
                categoryCreated: false,
            },
        });
    });
});
