import { Record } from '@prisma/client';
import { format, parse } from 'date-fns';
import { NewRecord, NetworkNewRecord } from '../client/record/types';
import { NetworkRecord } from '../server/types';
export const DATE_FORMAT = 'yyyy-MM-dd';
export const NetworkMappers = {
    NewRecord: {
        toNetwork: (record: NewRecord) => {
            const { date, ...rest } = record;
            const networkRecord: NetworkNewRecord = {
                date: format(date, DATE_FORMAT),
                ...rest,
            };
            return networkRecord;
        },
        fromNetwork: (record: NetworkNewRecord) => {
            const { date, ...rest } = record;
            const newRecord: NewRecord = {
                date: parse(date, DATE_FORMAT, new Date()),
                ...rest,
            };
            return newRecord;
        },
    },
    Record: {
        toNetwork: (record: Record) => {
            const { date, ...rest } = record;
            const networkRecord: NetworkRecord = {
                date: format(date, DATE_FORMAT),
                ...rest,
            };
            return networkRecord;
        },
        fromNetwork: (record: NetworkRecord) => {
            const { date, ...rest } = record;
            const newRecord: Record = {
                date: parse(date, DATE_FORMAT, new Date()),
                ...rest,
            };
            return newRecord;
        },
    },
};
