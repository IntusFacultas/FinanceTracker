import { NextAPIRouteHandler } from '../../types';
import constructHTTPMocks from './utils';
import withMethodRestriction, { uncurriedWithMethodRestriction } from '../withMethodRestriction';

describe(uncurriedWithMethodRestriction, () => {
    const mockedHandler = jest.fn();
    it('returns a next api router handler', () => {
        const handler = mockedHandler as NextAPIRouteHandler;
        const protectedHandler = uncurriedWithMethodRestriction([], handler);
        expect(protectedHandler).toBeInstanceOf(Function);
    });
    it('returns a 405 if an unsupported method is used', async () => {
        const handler = mockedHandler as NextAPIRouteHandler;
        const protectedHandler = uncurriedWithMethodRestriction(['GET'], handler);
        const { req, res } = constructHTTPMocks('POST');
        await protectedHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(405);
    });
    it('returns an APIErrorResponse indicating the method is not supported if an unsupported method is used', async () => {
        const handler = mockedHandler as NextAPIRouteHandler;
        const protectedHandler = uncurriedWithMethodRestriction(['GET'], handler);
        const { req, res } = constructHTTPMocks('POST');
        await protectedHandler(req, res);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: 'Method not supported',
        });
    });
    it('calls the wrapped handler if the method is supported', async () => {
        const handler = mockedHandler as NextAPIRouteHandler;
        const protectedHandler = uncurriedWithMethodRestriction(['GET'], handler);
        const { req, res } = constructHTTPMocks('GET');
        await protectedHandler(req, res);
        expect(handler).toHaveBeenCalledWith(req, res);
    });
});

describe(withMethodRestriction, () => {
    const mockedHandler = jest.fn();
    it('returns a curried function when passed only the request methods', () => {
        const curriedFn = withMethodRestriction(['GET']);
        expect(curriedFn).toBeInstanceOf(Function);
    });
    const requestMethodCurriedWrapper = withMethodRestriction(['GET']);
    it('returns a next api router handler', () => {
        const handler = mockedHandler as NextAPIRouteHandler;
        const protectedHandler = requestMethodCurriedWrapper(handler);
        expect(protectedHandler).toBeInstanceOf(Function);
    });
    it('returns a 405 if an unsupported method is used', async () => {
        const handler = mockedHandler as NextAPIRouteHandler;
        const protectedHandler = requestMethodCurriedWrapper(handler);
        const { req, res } = constructHTTPMocks('POST');
        await protectedHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(405);
    });
    it('returns an APIErrorResponse indicating the method is not supported if an unsupported method is used', async () => {
        const handler = mockedHandler as NextAPIRouteHandler;
        const protectedHandler = requestMethodCurriedWrapper(handler);
        const { req, res } = constructHTTPMocks('POST');
        await protectedHandler(req, res);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: 'Method not supported',
        });
    });
    it('calls the wrapped handler if the method is supported', async () => {
        const handler = mockedHandler as NextAPIRouteHandler;
        const protectedHandler = requestMethodCurriedWrapper(handler);
        const { req, res } = constructHTTPMocks('GET');
        await protectedHandler(req, res);
        expect(handler).toHaveBeenCalledWith(req, res);
    });
});
