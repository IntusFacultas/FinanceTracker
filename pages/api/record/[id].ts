import { APISuccessResponse, NetworkRecord, NextAPIRouteHandler } from '../../../API/server/types';
import { DBRecord } from '../../../API/server/db';
import withWrappers from '../../../API/server/routes/withWrappers';
import withAuthentication from '../../../API/server/routes/withAuthentication';
import withMethodRestriction from '../../../API/server/routes/withMethodRestriction';
import withErrorHandling from '../../../API/server/routes/withErrorHandling';
import { NetworkMappers } from '../../../API/mappers/record';

const handler: NextAPIRouteHandler = async (req, res) => {
    const { id } = req.query;
    const record = await DBRecord.delete(Number(id));
    const response: APISuccessResponse<NetworkRecord> = {
        success: true,
        data: NetworkMappers.Record.toNetwork(record),
    };
    return res.status(200).json(response);
};

const onlySupportDELETE = withMethodRestriction(['DELETE']);

const wrappedHandler = withWrappers(handler, [withAuthentication, withErrorHandling, onlySupportDELETE]);

export default wrappedHandler;
