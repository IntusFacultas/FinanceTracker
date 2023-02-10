import ORM from '../ORM';

const createCategory = async (title: string, reporterID: number) => {
    return await ORM.category.create({
        data: {
            title,
            reporter: {
                connect: {
                    id: reporterID,
                },
            },
        },
    });
};

export default createCategory;
