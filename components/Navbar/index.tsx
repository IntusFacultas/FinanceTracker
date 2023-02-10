import { useState } from 'react';
import type { FunctionComponent, MouseEvent } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import AuthenticationGatedContent from '../AuthenticationGatedContent';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SavingsIcon from '@mui/icons-material/Savings';
import PendingIcon from '@mui/icons-material/Pending';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

type HeaderProps = {
    xs: string;
    md: string;
};

const NavbarHeader: FunctionComponent<HeaderProps> = ({ xs, md }) => (
    <Box
        sx={{
            flexGrow: 1,
            display: { xs, md },
            alignItems: 'center',
            justifyContent: {
                xs: 'center',
                md: 'flex-start',
            },
            gap: 0.5,
            paddingX: 1,
        }}>
        <SavingsIcon sx={{ mr: 0.5 }} />
        <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
            }}>
            Net Worth Tracker
        </Typography>
    </Box>
);

const Navbar: FunctionComponent = () => {
    const { data: session } = useSession();
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="Navigation options"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit">
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}>
                            <MenuItem disabled>Net Worth Tracker</MenuItem>
                            <AuthenticationGatedContent
                                unauthenticated={
                                    <Link href="/api/auth/signin">
                                        <MenuItem onClick={handleCloseNavMenu}>Log in</MenuItem>
                                    </Link>
                                }
                                authenticated={
                                    (session && (
                                        <>
                                            <MenuItem disabled>
                                                <Typography variant="body1">
                                                    {session.user?.name} ({session.user?.email})
                                                </Typography>
                                            </MenuItem>
                                            {/* TODO Move this out */}
                                            <Link href="/create">
                                                <MenuItem onClick={handleCloseNavMenu}>New Record</MenuItem>
                                            </Link>
                                            <MenuItem
                                                onClick={() => {
                                                    handleCloseNavMenu();
                                                    signOut();
                                                }}>
                                                Log out
                                            </MenuItem>
                                        </>
                                    )) || <></>
                                }
                            />
                        </Menu>
                    </Box>
                    <NavbarHeader xs="none" md="flex" />
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
                        <AuthenticationGatedContent
                            loading={<PendingIcon />}
                            unauthenticated={
                                <Link href="/api/auth/signin">
                                    <Button role="link" color="inherit">
                                        Log in
                                    </Button>
                                </Link>
                            }
                            authenticated={
                                (session && (
                                    <Button color="inherit" role="link" onClick={() => signOut()}>
                                        Log out
                                    </Button>
                                )) || <></>
                            }
                        />
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
                        <AuthenticationGatedContent
                            loading={<PendingIcon />}
                            unauthenticated={
                                <Link href="/api/auth/signin">
                                    <Button role="link" color="inherit">
                                        Log in
                                    </Button>
                                </Link>
                            }
                            authenticated={
                                (session && (
                                    <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        <Typography variant="body1">
                                            {session.user?.name} ({session.user?.email})
                                        </Typography>
                                        <Link href="/create">
                                            <Button color="inherit" role="link">
                                                New Record
                                            </Button>
                                        </Link>
                                        <Button color="inherit" role="link" onClick={() => signOut()}>
                                            Log out
                                        </Button>
                                    </Box>
                                )) || <></>
                            }
                        />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
