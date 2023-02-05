import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

declare global {
    // eslint-disable-next-line no-var, no-shadow
    var prisma: PrismaClient;
}

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

export default prisma;
