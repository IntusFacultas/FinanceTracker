import React, { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import { Heading } from '../components/Primitives/Typography';
import { getSession } from 'next-auth/react';
import { isIdentifiedSession } from '../API/server/session';
import { RecordWithCategory } from '../API/server/types';
import { DBRecord } from '../API/server/db';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { Category } from '@prisma/client';

const columns: GridColDef<RecordWithCategory>[] = [
    {
        field: 'date',
        headerName: 'Date',
        valueGetter: ({ row }: GridValueGetterParams<string, RecordWithCategory>) => {
            const { date } = row;
            return format(date, 'yyyy-MM-dd');
        },
    },
    {
        field: 'value',
        headerName: 'Value',
        type: 'number',
    },

    {
        field: 'category',
        headerName: 'Category',
        valueGetter: ({ row }: GridValueGetterParams<Category['title'], RecordWithCategory>) => row.category.title,
    },
];

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req });
    if (!isIdentifiedSession(session)) {
        return {
            props: {
                records: [],
            },
        };
    }
    const records = await DBRecord.findAllWithCategory(session.user.id);
    return {
        props: { records },
    };
};

type GraphViewProps = {
    records: RecordWithCategory[];
};

const GraphView: FunctionComponent<GraphViewProps> = ({ records }) => {
    console.log(records);
    return (
        <>
            <Heading level={1}>TODO</Heading>
            <DataGrid rows={records} columns={columns} pageSize={25} rowsPerPageOptions={[5]} />
        </>
    );
};

export default GraphView;
