import { NextAPIRouteHandler, SimpleAPIRouteHandlerWrapper } from '../../types';
import withWrappers from '../withWrappers';
import createHttpMocks from './utils';

describe(withWrappers, () => {
    it('takes a handler and a set of wrappers, and returns a function', () => {
        const wrapperCallOrder = [];
        const wrapper1: SimpleAPIRouteHandlerWrapper = handler => {
            const wrapper: NextAPIRouteHandler = async (req, res) => {
                wrapperCallOrder.push(1);
                return await handler(req, res);
            };
            return wrapper;
        };
        const wrapper2: SimpleAPIRouteHandlerWrapper = handler => {
            const wrapper: NextAPIRouteHandler = async (req, res) => {
                wrapperCallOrder.push(2);
                return await handler(req, res);
            };
            return wrapper;
        };
        const wrapper3: SimpleAPIRouteHandlerWrapper = handler => {
            const wrapper: NextAPIRouteHandler = async (req, res) => {
                wrapperCallOrder.push(3);
                return await handler(req, res);
            };
            return wrapper;
        };
        const handler = jest.fn() as NextAPIRouteHandler;
        const result = withWrappers(handler, [wrapper1, wrapper2, wrapper3]);
        expect(result).toBeFunction();
    });
    it('wraps the handlers so that they are called in the order they are defined in the array', async () => {
        const wrapperCallOrder: number[] = [];
        const wrapper1: SimpleAPIRouteHandlerWrapper = handler => {
            const wrapper: NextAPIRouteHandler = async (req, res) => {
                wrapperCallOrder.push(1);
                return await handler(req, res);
            };
            return wrapper;
        };
        const wrapper2: SimpleAPIRouteHandlerWrapper = handler => {
            const wrapper: NextAPIRouteHandler = async (req, res) => {
                wrapperCallOrder.push(2);
                return await handler(req, res);
            };
            return wrapper;
        };
        const wrapper3: SimpleAPIRouteHandlerWrapper = handler => {
            const wrapper: NextAPIRouteHandler = async (req, res) => {
                wrapperCallOrder.push(3);
                return await handler(req, res);
            };
            return wrapper;
        };
        const handler: NextAPIRouteHandler = async (_, __) => {
            wrapperCallOrder.push(0);
            return;
        };
        const result = withWrappers(handler, [wrapper1, wrapper2, wrapper3]);
        const { req, res } = createHttpMocks();
        await result(req, res);
        expect(wrapperCallOrder).toStrictEqual([1, 2, 3, 0]);
    });
});
