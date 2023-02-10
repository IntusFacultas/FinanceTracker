import { FunctionComponent } from 'react';
import Router from 'next/router';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NewRecord } from '../API/client/record/types';
import Typography from '@mui/material/Typography';
import { nonEmptyString } from '../API/form/utils';
import API from '../API/client';
import InputFactory from '../components/Primitives/Form/Input';
import DatePickerFactory from '../components/Primitives/Form/DatePicker';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

// bless you laddie https://github.com/colinhacks/zod/issues/1495
// const FormSchema = z.object({
//     date: z.date(),
//     value: z.number(),
//     category: nonEmptyString(),
// }) satisfies z.ZodType<NewRecord>;
const FormSchema = z.object({
    date: z.date(),
    value: z.number(),
    category: nonEmptyString(),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const Input = InputFactory<FormSchemaType>();
const DatePicker = DatePickerFactory<FormSchemaType>();

const Draft: FunctionComponent = () => {
    const { register, handleSubmit, formState, reset, control } = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
    });

    const { isSubmitting, isValid } = formState;

    const onSubmit: SubmitHandler<FormSchemaType> = async data => {
        try {
            const formData = data;
            const response = await API.Record.create(formData);
            if (!response.success) {
                console.error(response.error);
            } else {
                reset();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h5" component="h1">
                    New Draft
                </Typography>
                {/* TODO make this a type or select */}
                {/* <Input
                    label="Category"
                    autoFocus
                    placeholder="Category"
                    type="text"
                    {...register('category')}
                    disabled={isSubmitting}
                /> */}
                <Input
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    control={control}
                    label="Value"
                    placeholder="value"
                    type="number"
                    {...register('value')}
                    disabled={isSubmitting}
                />
                <DatePicker control={control} label="date" {...register('date')} disabled={isSubmitting} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="contained" disabled={!isValid || isSubmitting}>
                        Create
                    </Button>
                    <Button variant="text" role="link" onClick={() => Router.push('/')} type="button">
                        Cancel
                    </Button>
                </Box>
            </form>
        </>
    );
};

export default Draft;
