import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    if (typeof id !== 'string') {
        throw new Error('ID must be a string');
    }
    const post = await prisma.post.update({
        where: { id },
        data: { published: true },
    });
    res.json(post);
}
