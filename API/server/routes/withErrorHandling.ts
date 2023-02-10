import { APIErrorResponse, NextAPIRouteHandler } from '../types';

const withErrorHandling = (handler: NextAPIRouteHandler) => {
    const protectedHandler: NextAPIRouteHandler = async (req, res, ...rest) => {
        try {
            return handler(req, res, ...rest);
        } catch (error) {
            const response: APIErrorResponse = {
                success: false,
                error: (error as Error).message,
            };
            return res.status(500).json(response);
        }
    };
    return protectedHandler;
};

export default withErrorHandling;
