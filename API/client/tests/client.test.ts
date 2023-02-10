import { Record } from '@prisma/client';
import { format } from 'date-fns';
import { enableFetchMocks, FetchMock } from 'jest-fetch-mock';
import { v4 } from 'uuid';
enableFetchMocks();

const fetchMock = fetch as FetchMock;
import API from '..';
import CONFIG from '../../config';
import { DATE_FORMAT, NetworkMappers } from '../../mappers/record';
import { APIErrorResponse, APISuccessResponse, NetworkRecord } from '../../server/types';
import { NewRecord } from '../record/types';

const date = new Date(2022, 2, 10, 0, 0, 0, 0);
const record: Record = {
    id: 1,
    uuid: `${v4()}`,
    value: 1,
    categoryID: 1,
    reporterID: 1,
    date,
};

const networkRecord: NetworkRecord = {
    ...record,
    date: format(record.date, DATE_FORMAT),
};

const newRecord: NewRecord = {
    value: 1,
    category: 'title',
    date,
};

describe('API', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });
    describe('API.Record', () => {
        describe('create', () => {
            it('sends the record data over the network', async () => {
                await API.Record.create(newRecord);
                expect(fetchMock).toHaveBeenCalledWith(CONFIG.ROUTES.RECORD.CREATE.ENDPOINT, {
                    ...CONFIG.FETCH_CONFIG,
                    method: CONFIG.ROUTES.RECORD.CREATE.METHOD,
                    body: JSON.stringify(NetworkMappers.NewRecord.toNetwork(newRecord)),
                });
            });
            it('returns an APIErrorResponse if received from the backend', async () => {
                const response: APIErrorResponse = {
                    success: false,
                    error: 'Bang!',
                };
                fetchMock.mockResponseOnce(JSON.stringify(response));
                const result = await API.Record.create(newRecord);
                expect(result).toStrictEqual(response);
            });
            it('returns a parsed APISuccessResponse if received from the backend', async () => {
                const response: APISuccessResponse<NetworkRecord> = {
                    success: true,
                    data: networkRecord,
                };
                fetchMock.mockResponseOnce(JSON.stringify(response));
                const result = await API.Record.create(newRecord);
                expect(result).toStrictEqual({
                    success: true,
                    data: record,
                });
            });
            it('returns an APIErrorResponse if a network error occurs', async () => {
                const response: APIErrorResponse = {
                    success: false,
                    error: 'Bang!',
                };
                fetchMock.mockRejectedValueOnce(new Error('Bang!'));
                const result = await API.Record.create(newRecord);
                expect(result).toStrictEqual(response);
            });
        });
    });
});
