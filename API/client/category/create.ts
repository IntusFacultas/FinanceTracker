import CONFIG from '../../config';
import { APIErrorResponse, APISuccessResponse } from '../../server/types';
import { Category } from '@prisma/client';
import { NewCategory } from './types';
import { CategoryCreationResult } from '../../../pages/api/category';

type CreationData = {
    category: Category;
    created: boolean;
};

const createCategory = async (data: NewCategory) => {
    try {
        const { ENDPOINT, METHOD } = CONFIG.ROUTES.CATEGORY.CREATE;
        const response = await fetch(ENDPOINT, {
            ...CONFIG.FETCH_CONFIG,
            method: METHOD,
            body: JSON.stringify(data),
        });
        const responseData = (await response.json()) as APIErrorResponse | APISuccessResponse<CategoryCreationResult>;
        if (!responseData.success) {
            return responseData;
        }
        const { category, created } = responseData.data;
        const successfulResponse: APISuccessResponse<CreationData> = {
            success: responseData.success,
            data: {
                category,
                created,
            },
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

export default createCategory;
