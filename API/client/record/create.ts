import { NetworkMappers } from '../../mappers/record';
import CONFIG from '../../config';
import { NewRecord, NetworkNewRecord } from './types';
import { APIErrorResponse, APISuccessResponse, NetworkRecord } from '../../server/types';
import { Record } from '@prisma/client';

const createRecord = async (data: NewRecord) => {
    const payload: NetworkNewRecord = NetworkMappers.NewRecord.toNetwork(data);
    try {
        const response = await fetch(CONFIG.ROUTES.RECORD.CREATE.ENDPOINT, {
            ...CONFIG.FETCH_CONFIG,
            method: CONFIG.ROUTES.RECORD.CREATE.METHOD,
            body: JSON.stringify(payload),
        });
        const responseData = (await response.json()) as APIErrorResponse | APISuccessResponse<NetworkRecord>;
        if (!responseData.success) {
            return responseData;
        }
        const successfulResponse: APISuccessResponse<Record> = {
            success: responseData.success,
            data: NetworkMappers.Record.fromNetwork(responseData.data),
        };
        return successfulResponse;
    } catch (error) {
        const networkError: APIErrorResponse = {
            success: false,
            error: (error as Error).message,
        };
        return networkError;
    }
};

export default createRecord;
