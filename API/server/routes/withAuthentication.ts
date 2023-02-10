import { NextApiRequest, NextApiResponse } from 'next';
import { APIErrorResponse, NextAPIRouteHandler } from '../types';
import { getSession } from 'next-auth/react';
import { IdentifiedSession, isIdentifiedSession } from '../session';

export type AuthRequiredNextAPIRouteHandler = (
    req: NextApiRequest,
    res: NextApiResponse,
    session: IdentifiedSession
) => Promise<void>;

const withAuthentication = (handler: AuthRequiredNextAPIRouteHandler) => {
    const protectedHandler: NextAPIRouteHandler = async (req, res) => {
        const session = await getSession({ req });
        if (!isIdentifiedSession(session)) {
            const response: APIErrorResponse = {
                success: false,
                error: 'Unauthenticated',
            };
            return res.status(403).json(response);
        }
        return handler(req, res, session);
    };
    return protectedHandler;
};

export default withAuthentication;
