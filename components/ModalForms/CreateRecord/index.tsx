import { FunctionComponent } from 'react';

import Router from 'next/router';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { nonEmptyString } from '../../../API/form/utils';
import API from '../../../API/client';

import InputFactory from '../../Primitives/Form/Input';
import DatePickerFactory from '../../Primitives/Form/DatePicker';
import AutocompleteFactory from '../../Primitives/Form/Autocomplete';

// NextJS doesn't currently support satisfies keyword: https://github.com/vercel/next.js/discussions/40895
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
const Autocomplete = AutocompleteFactory<FormSchemaType>();

type CreateRecordFormProps = {
    categories: string[];
};

const CreateRecordForm: FunctionComponent<CreateRecordFormProps> = ({ categories }) => {
    const { register, handleSubmit, formState, watch, reset, control } = useForm<FormSchemaType>({
        mode: 'onChange',
        resolver: zodResolver(FormSchema),
    });
    console.log(watch());

    const { isSubmitting, isValid } = formState;

    const onSubmit: SubmitHandler<FormSchemaType> = async data => {
        try {
            const formData = data;
            const response = await API.Record.create(formData);
            if (!response.success) {
                console.error(response.error);
            } else {
                // TODO add new category to categories
                // TODO toast success
                reset({
                    date: undefined,
                    category: undefined,
                    value: undefined,
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h5" component="h1">
                New Draft
            </Typography>

            <Autocomplete label="Category" control={control} options={categories} {...register('category')} />
            <Input
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                control={control}
                label="Value"
                placeholder="0"
                type="number"
                {...register('value')}
                disabled={isSubmitting}
            />
            <DatePicker control={control} label="Date" {...register('date')} disabled={isSubmitting} />
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button type="submit" variant="contained" disabled={!isValid || isSubmitting}>
                    Create
                    {/** TODO make a spinner while submitting */}
                </Button>
                <Button variant="text" role="link" onClick={() => Router.push('/')} type="button">
                    Cancel
                </Button>
                <Button variant="text" type="button" onClick={() => reset()}>
                    Reset
                </Button>
            </Box>
        </form>
    );
};

export default CreateRecordForm;
