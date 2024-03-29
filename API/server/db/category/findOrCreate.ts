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
            created: true,
            category,
        };
    }
    return {
        created: false,
        category,
    };
};

export default findOrCreateCategory;
