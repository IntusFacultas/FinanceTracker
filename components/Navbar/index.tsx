import { FunctionComponent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import NavbarLink from './NavbarLink';
import AuthenticationGatedContent from '../AuthenticationGatedContent';
import { Flexbox, FlexboxProps } from '../Primitives/Flexbox';
import styled from 'styled-components';
import { Anchor, Paragraph } from '../Primitives/Typography';
import Button from '../Primitives/Button';

const StyledNavbar: FunctionComponent<FlexboxProps> = styled(Flexbox)`
    padding: 1rem;
`;

const Navbar: FunctionComponent = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const isActive = (pathname: string): boolean => router.pathname === pathname;
    return (
        <StyledNavbar justifyContent="space-between">
            <AuthenticationGatedContent
                unauthenticated={<NavbarLink href="/">Feed</NavbarLink>}
                authenticated={
                    <Flexbox gap="sm" alignItems="center">
                        <NavbarLink href="/">Feed</NavbarLink>
                        <NavbarLink href="/drafts">My drafts</NavbarLink>
                    </Flexbox>
                }
            />
            <AuthenticationGatedContent
                loading={<Paragraph>Validating session...</Paragraph>}
                unauthenticated={
                    <Link href="/api/auth/signin">
                        <Anchor data-active={isActive('/signup')}>Log in</Anchor>
                    </Link>
                }
                authenticated={
                    (session && (
                        <Flexbox gap="sm" alignItems="center">
                            <Paragraph>
                                {session.user?.name} ({session.user?.email})
                            </Paragraph>
                            <Link href="/create">
                                <Button role="link" variant="default">
                                    New post
                                </Button>
                            </Link>
                            <Button variant="default" role="link" onClick={() => signOut()}>
                                Log out
                            </Button>
                        </Flexbox>
                    )) || <></>
                }
            />
        </StyledNavbar>
    );
};

export default Navbar;
