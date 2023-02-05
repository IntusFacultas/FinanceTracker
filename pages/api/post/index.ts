import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import { Post } from '../../../components/ArticleView';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { title, content } = req.body as Post;
    const session = await getSession({ req });
    if (!session?.user) {
        throw new Error('403 Unauthenticated');
    }
    if (!session.user.email) {
        throw new Error('400 User must have email');
    }
    const result = await prisma.post.create({
        data: {
            title: title,
            content: content,
            author: { connect: { email: session?.user?.email } },
        },
    });
    res.json(result);
}
