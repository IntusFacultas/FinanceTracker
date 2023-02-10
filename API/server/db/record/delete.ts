import ORM from '../ORM';

const deleteRecord = async (id: number) => {
    return await ORM.record.delete({
        where: { id },
    });
};

export default deleteRecord;
