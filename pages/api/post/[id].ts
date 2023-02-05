import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    if (req.method === 'DELETE' && typeof id === 'string') {
        const post = await prisma.post.delete({
            where: { id },
        });
        res.json(post);
    } else {
        throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
    }
}
