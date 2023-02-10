import { RecordWithCategory } from '../../types';
import ORM from '../ORM';

const findAll = async (userID: number) => {
    const records: RecordWithCategory[] = await ORM.record.findMany({
        where: {
            reporter: {
                id: userID,
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
    return records;
};

export default findAll;
