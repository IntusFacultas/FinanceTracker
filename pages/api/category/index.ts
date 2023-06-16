import { NewCategory } from '../../../API/client/category/types';
import { Category } from '@prisma/client';
import { DBCategory } from '../../../API/server/db';
import withAuthentication, { AuthRequiredNextAPIRouteHandler } from '../../../API/server/routes/withAuthentication';
import withMethodRestriction from '../../../API/server/routes/withMethodRestriction';
import withWrappers from '../../../API/server/routes/withWrappers';
import withErrorHandling from '../../../API/server/routes/withErrorHandling';
import { APISuccessResponse } from '../../../API/server/types';

export type CategoryCreationResult = {
    category: Category;
    created: boolean;
};

const handler: AuthRequiredNextAPIRouteHandler = async (req, res, session) => {
    const newCategory = req.body as NewCategory;
    const { title } = newCategory;
    const { category, created } = await DBCategory.findOrCreate(title, session.id);
    const response: APISuccessResponse<CategoryCreationResult> = {
        success: true,
        data: {
            category,
            created: created,
        },
    };
    return res.json(response);
};

const onlySupportPOSTAndDelete = withMethodRestriction(['POST']);
const wrappedHandler = withWrappers(handler, [withAuthentication, withErrorHandling, onlySupportPOSTAndDelete]);

export default wrappedHandler;
