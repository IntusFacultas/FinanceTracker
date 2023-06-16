import CreateRecordForm from '../components/ModalForms/CreateRecord';
import type { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { isIdentifiedSession } from '../API/server/session';
import { DBCategory } from '../API/server/db';
import { Category } from '@prisma/client';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req });
    if (!isIdentifiedSession(session)) {
        return {
            props: {
                records: [],
            },
        };
    }
    const categories = await DBCategory.findAll(session.user.id);
    return {
        props: { categories },
    };
};

type CreateRecordProps = {
    categories: Category[];
};

const CreateRecord: FunctionComponent<CreateRecordProps> = ({ categories }) => {
    return <CreateRecordForm categories={categories.map(category => category.title)} />;
};

export default CreateRecord;
