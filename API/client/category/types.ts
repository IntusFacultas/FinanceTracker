import { Category } from '@prisma/client';

export type NewCategory = Pick<Category, 'title'>;
