import type { Record, Category } from '@prisma/client';

export type NewRecord = Omit<Record, 'id' | 'uuid' | 'reporterID' | 'categoryID'> & { category: Category['title'] };
export type NetworkNewRecord = Omit<NewRecord, 'date'> & { date: string };
