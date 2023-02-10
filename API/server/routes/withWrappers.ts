import { CurriedAPIRouteHandlerWrapper, NextAPIRouteHandler, NextAPIRouteHandlerWrapper } from '../types';
import { AuthRequiredNextAPIRouteHandler } from './withAuthentication';

const withWrappers = (
    handler: NextAPIRouteHandler | AuthRequiredNextAPIRouteHandler,
    wrappers: NextAPIRouteHandlerWrapper[]
): NextAPIRouteHandler => {
    return wrappers.reverse().reduce((wrappedHandler, nextWrapper: NextAPIRouteHandlerWrapper) => {
        // cast as the curried because it's the more complicated of the two, but should be equal in function
        // should the curried handler type drift, it will cause a compile error
        const castNextWrapper = nextWrapper as CurriedAPIRouteHandlerWrapper;
        const castWrappedHandler = wrappedHandler as NextAPIRouteHandler;
        const wrapped = castNextWrapper(castWrappedHandler);
        return wrapped;
    }, handler as NextAPIRouteHandler);
};

export default withWrappers;
