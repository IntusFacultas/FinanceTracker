import create from './create';
import destroy from './delete';
import findAll from './findAll';

const DBRecord = {
    create,
    delete: destroy,
    findAllWithCategory: findAll,
} as const;

export default DBRecord;
