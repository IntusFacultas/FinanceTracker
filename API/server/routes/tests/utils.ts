import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, RequestMethod } from 'node-mocks-http';

const constructHTTPMocks = (method: RequestMethod = 'GET') => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({ method });
    res.status = jest.fn((_: number) => res);
    res.json = jest.fn((_: object) => res);
    return { req, res };
};

export default constructHTTPMocks;
