/* istanbul ignore file */

import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import ORM from '../../../API/server/db/ORM';
import { IdentifiedSession, isUser } from '../../../API/server/session';

if (!process.env.GITHUB_ID) {
    throw new Error('GITHUB_ID is not defined in the environment');
}
if (!process.env.GITHUB_SECRET) {
    throw new Error('GITHUB_SECRET is not defined in th environment');
}

const options: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    callbacks: {
        session: async ({ session, user }) => {
            if (!isUser(user)) {
                return session;
            }
            const identifiedSession: IdentifiedSession = {
                ...session,
                user,
                id: user.id,
            };
            return identifiedSession;
        },
    },
    adapter: PrismaAdapter(ORM),
    secret: process.env.SECRET,
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
