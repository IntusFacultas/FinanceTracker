import withErrorHandling from '../withErrorHandling';
import constructHTTPMocks from './utils';
import { NextAPIRouteHandler } from '../../types';

describe(withErrorHandling, () => {
    const mockedHandler = jest.fn();
    it('returns a function handler for API routes', async () => {
        const handler = mockedHandler as NextAPIRouteHandler;
        expect(withErrorHandling(handler)).toBeInstanceOf(Function);
    });
    it('returns a 500 status code if an error occurs', async () => {
        mockedHandler.mockImplementationOnce(() => {
            throw new Error('bang!');
        });
        const handler = mockedHandler as NextAPIRouteHandler;
        const wrapped = withErrorHandling(handler);
        const { req, res } = constructHTTPMocks();
        await wrapped(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
    it('returns a APIErrorResponse with the error message if an error occurs', async () => {
        mockedHandler.mockImplementationOnce(() => {
            throw new Error('bang!');
        });
        const handler = mockedHandler as NextAPIRouteHandler;
        const wrapped = withErrorHandling(handler);
        const { req, res } = constructHTTPMocks();
        await wrapped(req, res);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: 'bang!',
        });
    });
    it('calls the handler with req and res', async () => {
        const handler = mockedHandler as NextAPIRouteHandler;
        const wrapped = withErrorHandling(handler);
        const { req, res } = constructHTTPMocks();
        await wrapped(req, res);
        expect(handler).toHaveBeenCalledWith(req, res);
    });
});
