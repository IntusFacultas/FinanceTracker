import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Link from 'next/link';
import { Anchor } from '../Primitives/Typography';
type NavbarLinkProps = {
    href: string;
};

const StyledAnchor = styled(Anchor)`
    &[data-active='true'] {
        font-weight: bold;
    }
`;

const NavbarLink: FunctionComponent<NavbarLinkProps> = ({ children, href }) => {
    const router = useRouter();
    const isActive = (pathname: string): boolean => router.pathname === pathname;
    return (
        <Link href={href}>
            <StyledAnchor data-active={isActive(href)}>{children}</StyledAnchor>
        </Link>
    );
};

export default NavbarLink;
