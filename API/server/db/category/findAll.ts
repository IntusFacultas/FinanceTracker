import ORM from '../ORM';

const findAll = async (userID: number) => {
    const categories = await ORM.category.findMany({
        where: {
            reporter: {
                id: userID,
            },
        },
        orderBy: {
            id: 'asc',
        },
    });
    return categories;
};

export default findAll;
