import { FunctionComponent } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import { Flexbox } from './Primitives/Flexbox';

const StyledMain = styled.main`
    padding: 0 2rem;
    margin: 0 auto;
    max-width: 1280px;
    flex: 1;
    width: 100%;
`;

const FullViewport = styled(Flexbox)`
    min-height: 100vh;
`;
const PageLayout: FunctionComponent = ({ children }) => (
    <FullViewport direction="column" fullHeight>
        <Navbar />
        <StyledMain>{children}</StyledMain>
    </FullViewport>
);

export default PageLayout;
