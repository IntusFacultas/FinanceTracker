import { SESSION_STATUSES } from './constants';
import { FunctionComponent, ReactElement } from 'react';
import { useSession } from 'next-auth/react';

type AuthenticationGatedContentProps = {
    unauthenticated: ReactElement;
    loading?: ReactElement;
    authenticated: ReactElement;
};

const AuthenticationGatedContent: FunctionComponent<AuthenticationGatedContentProps> = ({
    unauthenticated,
    authenticated,
    loading,
}) => {
    const { data: session, status } = useSession();
    if (status === SESSION_STATUSES.LOADING) {
        return loading ?? unauthenticated;
    }
    if (!session) {
        return unauthenticated;
    }
    return authenticated;
};

export default AuthenticationGatedContent;
