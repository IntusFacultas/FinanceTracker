import ORM from '../ORM';

const deleteCategory = async (id: number) => {
    return await ORM.category.delete({
        where: { id },
    });
};

export default deleteCategory;
