import create from './create';
import findAll from './findAll';
import findOrCreate from './findOrCreate';
import destroy from './delete';

const DBCategory = {
    create,
    findAll,
    findOrCreate,
    delete: destroy,
} as const;

export default DBCategory;
