import { Category, Record } from '@prisma/client';
import { DBCategory, DBRecord } from '../index';
import { v4 } from 'uuid';

jest.mock('../ORM', () => ({
    __esModule: true,
    default: {
        record: {
            create: jest.fn(),
            findMany: jest.fn(),
            delete: jest.fn(),
        },
        category: {
            create: jest.fn(),
            delete: jest.fn(),
            findMany: jest.fn(),
            findFirst: jest.fn(),
        },
    },
}));

import ORM from '../ORM';
import { RecordWithCategory } from '../../types';
const mockedORM = jest.mocked(ORM);

const _Date = Date;
const DATE_TO_USE = new Date(2022, 1, 10);
const MockedDate = jest.fn(() => DATE_TO_USE) as unknown as typeof _Date;
const uuid = `${v4()}`;

beforeEach(() => {
    global.Date = MockedDate;
    global.Date.UTC = _Date.UTC;
    global.Date.parse = _Date.parse;
    global.Date.now = _Date.now;
});
afterEach(() => {
    global.Date = _Date;
});

describe('DBRecord', () => {
    describe('DBRecord.create', () => {
        it('performs a create request to the ORM', async () => {
            const record = {
                date: new Date(),
                value: 1,
            };
            const reporterID = 1;
            const categoryID = 2;
            await DBRecord.create(record, reporterID, categoryID);
            expect(mockedORM.record.create).toHaveBeenCalledWith({
                data: {
                    ...record,
                    category: {
                        connect: {
                            id: categoryID,
                        },
                    },
                    reporter: {
                        connect: {
                            id: reporterID,
                        },
                    },
                },
            });
        });
        it('returns the created database record', async () => {
            const record = {
                date: new Date(),
                value: 1,
            };
            const reporterID = 1;
            const categoryID = 2;
            const databaseRecord: Record = {
                id: 1,
                uuid,
                date: record.date,
                value: record.value,
                reporterID,
                categoryID,
            };
            mockedORM.record.create.mockResolvedValueOnce(databaseRecord);
            const returnValue = await DBRecord.create(record, 1, 2);
            expect(returnValue).toStrictEqual(databaseRecord);
        });
    });
    describe('DBRecord.findAll', () => {
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

        it('performs a findMany request to the ORM', async () => {
            const reporterID = 1;
            await DBRecord.findAllWithCategory(reporterID);
            expect(mockedORM.record.findMany).toHaveBeenCalledWith({
                where: {
                    reporter: {
                        id: reporterID,
                    },
                },
                orderBy: {
                    date: 'asc',
                },
                include: {
                    category: {
                        select: {
                            title: true,
                        },
                    },
                },
            });
        });
        it('returns the list of records with category', async () => {
            const recordWithCategory: RecordWithCategory = {
                ...record,
                category: {
                    title: category.title,
                },
            };
            mockedORM.record.findMany.mockResolvedValueOnce([recordWithCategory]);
            const returnValue = await DBRecord.findAllWithCategory(1);
            expect(returnValue).toStrictEqual([recordWithCategory]);
        });
    });
    describe('DBRecord.delete', () => {
        it('performs a delete request to the ORM', async () => {
            const record = {
                date: new Date(),
                value: 1,
            };
            const reporterID = 1;
            const categoryID = 2;
            const databaseRecord: Record = {
                id: 1,
                uuid,
                date: record.date,
                value: record.value,
                reporterID,
                categoryID,
            };
            await DBRecord.delete(1);
            mockedORM.record.delete.mockResolvedValueOnce(databaseRecord);
            expect(mockedORM.record.delete).toHaveBeenCalledWith({
                where: {
                    id: 1,
                },
            });
        });
        it('returns the result of the delete operation', async () => {
            const record = {
                date: new Date(),
                value: 1,
            };
            const reporterID = 1;
            const categoryID = 2;
            const databaseRecord: Record = {
                id: 1,
                uuid,
                date: record.date,
                value: record.value,
                reporterID,
                categoryID,
            };
            mockedORM.record.delete.mockResolvedValueOnce(databaseRecord);
            const result = await DBRecord.delete(1);
            expect(result).toStrictEqual(databaseRecord);
        });
    });
});

describe('DBCategory', () => {
    describe('DBCategory.create', () => {
        it('performs a create request to the ORM', async () => {
            const title = 'category title';
            const reporterID = 1;
            await DBCategory.create(title, reporterID);
            expect(mockedORM.category.create).toHaveBeenCalledWith({
                data: {
                    title,
                    reporter: {
                        connect: {
                            id: reporterID,
                        },
                    },
                },
            });
        });
        it('returns the created database Category', async () => {
            const title = 'category title';
            const reporterID = 1;
            const databaseCategory: Category = {
                id: 1,
                uuid,
                title,
                reporterID,
            };
            mockedORM.category.create.mockResolvedValueOnce(databaseCategory);
            const result = await DBCategory.create(title, reporterID);
            expect(result).toStrictEqual(databaseCategory);
        });
    });
    describe('DBCategory.findAll', () => {
        const category: Category = {
            id: 1,
            uuid: `${v4()}`,
            title: 'Something',
            reporterID: 1,
        };

        it('performs a findMany request to the ORM', async () => {
            const reporterID = 1;
            await DBCategory.findAll(reporterID);
            expect(mockedORM.category.findMany).toHaveBeenCalledWith({
                where: {
                    reporter: {
                        id: reporterID,
                    },
                },
                orderBy: {
                    id: 'asc',
                },
            });
        });
        it('returns the list of records with category', async () => {
            mockedORM.category.findMany.mockResolvedValueOnce([category]);
            const returnValue = await DBCategory.findAll(1);
            expect(returnValue).toStrictEqual([category]);
        });
    });
    describe('DBCategory.findOrCreate', () => {
        it('returns the first category found matching the parameters', async () => {
            const title = 'category title';
            const reporterID = 1;
            const databaseCategory: Category = {
                id: 1,
                uuid,
                title,
                reporterID,
            };
            mockedORM.category.findFirst.mockResolvedValueOnce(databaseCategory);
            const result = await DBCategory.findOrCreate(title, reporterID);
            expect(result).toStrictEqual({
                created: false,
                category: databaseCategory,
            });
        });
        it('does not perform a create request if it finds the category pre-existing', async () => {
            const title = 'category title';
            const reporterID = 1;
            const databaseCategory: Category = {
                id: 1,
                uuid,
                title,
                reporterID,
            };
            mockedORM.category.findFirst.mockResolvedValueOnce(databaseCategory);
            await DBCategory.findOrCreate(title, reporterID);
            expect(mockedORM.category.create).not.toHaveBeenCalled();
        });
        it('creates the category if it cannot find the category', async () => {
            const title = 'category title';
            const reporterID = 1;
            const databaseCategory: Category = {
                id: 1,
                uuid,
                title,
                reporterID,
            };
            mockedORM.category.findFirst.mockResolvedValueOnce(null);
            mockedORM.category.create.mockResolvedValueOnce(databaseCategory);
            await DBCategory.findOrCreate(title, reporterID);
            expect(mockedORM.category.create).toHaveBeenCalled();
        });
        it('returns the created category', async () => {
            const title = 'category title';
            const reporterID = 1;
            const databaseCategory: Category = {
                id: 1,
                uuid,
                title,
                reporterID,
            };
            mockedORM.category.findFirst.mockResolvedValueOnce(null);
            mockedORM.category.create.mockResolvedValueOnce(databaseCategory);
            const result = await DBCategory.findOrCreate(title, reporterID);
            expect(result).toStrictEqual({
                created: true,
                category: databaseCategory,
            });
        });
    });
    describe('DBCategory.delete', () => {
        it('performs a delete request to the ORM', async () => {
            const databaseCategory: Category = {
                id: 1,
                uuid: `${v4()}`,
                title: 'Something',
                reporterID: 1,
            };
            await DBCategory.delete(1);
            mockedORM.category.delete.mockResolvedValueOnce(databaseCategory);
            expect(mockedORM.category.delete).toHaveBeenCalledWith({
                where: {
                    id: 1,
                },
            });
        });
        it('returns the result of the delete operation', async () => {
            const databaseCategory: Category = {
                id: 1,
                uuid: `${v4()}`,
                title: 'Something',
                reporterID: 1,
            };
            await DBCategory.delete(1);
            mockedORM.category.delete.mockResolvedValueOnce(databaseCategory);
            const result = await DBCategory.delete(1);
            expect(result).toStrictEqual(databaseCategory);
        });
    });
});
