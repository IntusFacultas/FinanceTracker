import { Category, Record } from '@prisma/client';
import { format } from 'date-fns';
import { enableFetchMocks, FetchMock } from 'jest-fetch-mock';
import { v4 } from 'uuid';
enableFetchMocks();

const fetchMock = fetch as FetchMock;
import API from '..';
import { CategoryCreationResult } from '../../../pages/api/category';
import { RecordCreationResult } from '../../../pages/api/record';
import CONFIG from '../../config';
import { DATE_FORMAT, NetworkMappers } from '../../mappers/record';
import { APIErrorResponse, APISuccessResponse, NetworkRecord } from '../../server/types';
import { NewCategory } from '../category/types';
import { NewRecord } from '../record/types';

const reporterID = 1;

const category: Category = {
    id: 1,
    uuid: `${v4()}`,
    title: 'title',
    reporterID,
};

const date = new Date(2022, 2, 10, 0, 0, 0, 0);
const record: Record = {
    id: 1,
    uuid: `${v4()}`,
    value: 1,
    categoryID: category.id,
    reporterID,
    date,
};

const networkRecord: NetworkRecord = {
    ...record,
    date: format(record.date, DATE_FORMAT),
};

const newRecord: NewRecord = {
    value: 1,
    category: category.title,
    date,
};

const newCategory: NewCategory = {
    title: category.title,
};

describe('API', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });
    describe('API.Category', () => {
        describe('create', () => {
            it('sends the category data over the network', async () => {
                await API.Category.create(newCategory);
                const { ENDPOINT, METHOD } = CONFIG.ROUTES.CATEGORY.CREATE;
                expect(fetchMock).toHaveBeenCalledWith(ENDPOINT, {
                    ...CONFIG.FETCH_CONFIG,
                    method: METHOD,
                    body: JSON.stringify(newCategory),
                });
            });
            it('returns an APIErrorResponse if received from the backend', async () => {
                const response: APIErrorResponse = {
                    success: false,
                    error: 'Bang!',
                };
                fetchMock.mockResponseOnce(JSON.stringify(response));
                const result = await API.Category.create(newCategory);
                expect(result).toStrictEqual(response);
            });
            it('returns an APIErrorResponse if a network error occurs', async () => {
                const response: APIErrorResponse = {
                    success: false,
                    error: 'Bang!',
                };
                fetchMock.mockRejectedValueOnce(new Error('Bang!'));
                const result = await API.Category.create(newCategory);
                expect(result).toStrictEqual(response);
            });
            it('returns a parsed APISuccessResponse if received from the backend', async () => {
                const response: APISuccessResponse<CategoryCreationResult> = {
                    success: true,
                    data: {
                        category: category,
                        created: false,
                    },
                };
                fetchMock.mockResponseOnce(JSON.stringify(response));
                const result = await API.Category.create(newCategory);
                expect(result).toStrictEqual({
                    success: true,
                    data: {
                        category,
                        created: false,
                    },
                });
            });
        });
    });
    describe('API.Record', () => {
        describe('create', () => {
            it('sends the record data over the network', async () => {
                await API.Record.create(newRecord);
                const { ENDPOINT, METHOD } = CONFIG.ROUTES.RECORD.CREATE;
                expect(fetchMock).toHaveBeenCalledWith(ENDPOINT, {
                    ...CONFIG.FETCH_CONFIG,
                    method: METHOD,
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
                const response: APISuccessResponse<RecordCreationResult> = {
                    success: true,
                    data: {
                        record: networkRecord,
                        category: category,
                        categoryCreated: false,
                    },
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
