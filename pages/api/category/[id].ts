import { APISuccessResponse, NextAPIRouteHandler } from '../../../API/server/types';
import { DBCategory } from '../../../API/server/db';
import withWrappers from '../../../API/server/routes/withWrappers';
import withAuthentication from '../../../API/server/routes/withAuthentication';
import withMethodRestriction from '../../../API/server/routes/withMethodRestriction';
import withErrorHandling from '../../../API/server/routes/withErrorHandling';
import { Category } from '@prisma/client';

const handler: NextAPIRouteHandler = async (req, res) => {
    const { id } = req.query;
    const category = await DBCategory.delete(Number(id));
    const response: APISuccessResponse<Category> = {
        success: true,
        data: category,
    };
    return res.status(200).json(response);
};

const onlySupportDELETE = withMethodRestriction(['DELETE']);

const wrappedHandler = withWrappers(handler, [withAuthentication, withErrorHandling, onlySupportDELETE]);

export default wrappedHandler;
