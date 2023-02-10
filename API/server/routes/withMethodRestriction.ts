import { APIErrorResponse, HTTPMethod, NextAPIRouteHandler } from '../types';
import curry from 'lodash.curry';

const _withMethodRestriction = (supportedMethods: HTTPMethod[], handler: NextAPIRouteHandler) => {
    const protectedHandler: NextAPIRouteHandler = async (req, res, ...rest) => {
        if (!supportedMethods.includes(req.method as HTTPMethod)) {
            const response: APIErrorResponse = {
                success: false,
                error: 'Method not supported',
            };
            return res.status(405).json(response);
        }
        return await handler(req, res, ...rest);
    };
    return protectedHandler;
};
export const withMethodRestriction = curry(_withMethodRestriction);
export { _withMethodRestriction as uncurriedWithMethodRestriction };
export default withMethodRestriction;
