import ORM from '../ORM';
import createCategory from './create';

const findOrCreateCategory = async (title: string, reporterID: number) => {
    let category = await ORM.category.findFirst({
        where: {
            title,
            reporter: {
                id: reporterID,
            },
        },
    });
    if (!category) {
        category = await createCategory(title, reporterID);
        return {
            categoryCreated: true,
            category,
        };
    }
    return {
        categoryCreated: false,
        category,
    };
};

export default findOrCreateCategory;
