import { NetworkNewRecord } from '../../../API/client/record/types';
import { Category } from '@prisma/client';
import { APISuccessResponse, NetworkRecord } from '../../../API/server/types';
import { DBRecord, DBCategory } from '../../../API/server/db';
import withAuthentication, { AuthRequiredNextAPIRouteHandler } from '../../../API/server/routes/withAuthentication';
import { NetworkMappers } from '../../../API/mappers/record';
import withWrappers from '../../../API/server/routes/withWrappers';
import withErrorHandling from '../../../API/server/routes/withErrorHandling';
import withMethodRestriction from '../../../API/server/routes/withMethodRestriction';

export type RecordCreationResult = {
    record: NetworkRecord;
    category: Category;
    categoryCreated: boolean;
};

const handler: AuthRequiredNextAPIRouteHandler = async (req, res, session) => {
    const networkNewRecord = req.body as NetworkNewRecord;
    const newRecord = NetworkMappers.NewRecord.fromNetwork(networkNewRecord);
    const { category: title, ...data } = newRecord;
    const { category, created } = await DBCategory.findOrCreate(title, session.id);
    const record = await DBRecord.create(data, session.id, category.id);
    const response: APISuccessResponse<RecordCreationResult> = {
        success: true,
        data: {
            record: NetworkMappers.Record.toNetwork(record),
            category,
            categoryCreated: created,
        },
    };
    return res.json(response);
};

const onlySupportPOST = withMethodRestriction(['POST']);

const wrappedHandler = withWrappers(handler, [withAuthentication, withErrorHandling, onlySupportPOST]);

export default wrappedHandler;
