import create from './create';
import findOrCreate from './findOrCreate';

const DBCategory = {
    create,
    findOrCreate,
} as const;

export default DBCategory;
