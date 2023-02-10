import { Record } from '@prisma/client';
import ORM from '../ORM';

const createRecord = async (record: Pick<Record, 'value' | 'date'>, reporterID: number, categoryID: number) => {
    return await ORM.record.create({
        data: {
            ...record,
            category: {
                connect: { id: categoryID },
            },
            reporter: { connect: { id: reporterID } },
        },
    });
};

export default createRecord;
