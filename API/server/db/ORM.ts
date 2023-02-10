/* istanbul ignore file */

import { PrismaClient } from '@prisma/client';

const ORM = new PrismaClient();

declare global {
    // eslint-disable-next-line no-var, no-shadow
    var prisma: PrismaClient;
}

if (process.env.NODE_ENV !== 'production') {
    global.prisma = ORM;
}

export default ORM;
