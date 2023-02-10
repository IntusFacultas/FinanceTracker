import { Record } from '@prisma/client';
import { NetworkNewRecord, NewRecord } from '../../client/record/types';
import { NetworkRecord } from '../../server/types';
import { NetworkMappers, DATE_FORMAT } from '../record';
import { v4 } from 'uuid';
import { format } from 'date-fns';

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

const networkNewRecord: NetworkNewRecord = {
    ...newRecord,
    date: format(newRecord.date, DATE_FORMAT),
};

describe('NetworkMappers', () => {
    describe('NetworkMappers.NewRecord', () => {
        describe('toNetwork', () => {
            it('converts a NewRecord to a NetworkNewRecord with matching data', () => {
                expect(NetworkMappers.NewRecord.toNetwork(newRecord)).toStrictEqual(networkNewRecord);
            });
        });
        describe('fromNetwork', () => {
            it('converts a NetworkNewRecord to a NewRecord with matching data', () => {
                expect(NetworkMappers.NewRecord.fromNetwork(networkNewRecord)).toStrictEqual(newRecord);
            });
        });
    });
    describe('NetworkMappers.Record', () => {
        describe('toNetwork', () => {
            it('converts a Record to a NetworkRecord with matching data', () => {
                expect(NetworkMappers.Record.toNetwork(record)).toStrictEqual(networkRecord);
            });
        });
        describe('fromNetwork', () => {
            it('converts a NetworkRecord to a Record with matching data', () => {
                expect(NetworkMappers.Record.fromNetwork(networkRecord)).toStrictEqual(record);
            });
        });
    });
});
