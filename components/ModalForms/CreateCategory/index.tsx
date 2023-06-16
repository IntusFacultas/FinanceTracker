import InputFactory from '../../Primitives/Form/Input';
import API from '../../../API/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FunctionComponent } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import { ModalFormProps } from '../types';
import { LookupValues } from '../../../type-utils';

const FormSchema = z.object({
    title: z.string(),
});
type FormSchemaType = z.infer<typeof FormSchema>;

const Input = InputFactory<FormSchemaType>();

const ELEMENT_ID_LOOKUP = {
    FORM: 'CategoryCreationForm',
    MODAL_TITLE: 'CategoryCreationFormTitle',
};

const CLOSE_REASON = {
    BUTTON: 'closeButtonClick',
    BACKDROP: 'backdropClick',
    ESCAPE: 'escapeKeyDown',
} as const;

type CloseReason = LookupValues<typeof CLOSE_REASON>;

type CloseHandler = (event: object, reason: CloseReason) => void;

const IGNORED_REASONS: CloseReason[] = [CLOSE_REASON.BACKDROP, CLOSE_REASON.ESCAPE];

const CreateCategoryForm: FunctionComponent<ModalFormProps> = ({ isOpen, onClose }) => {
    const { register, handleSubmit, formState, reset, control } = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
    });
    const { isSubmitting, isValid } = formState;
    const onSubmit: SubmitHandler<FormSchemaType> = async data => {
        try {
            const formData = data;
            const response = await API.Category.create(formData);
            if (!response.success) {
                console.error(response.error);
            } else {
                reset();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleClose: CloseHandler = (_, reason) => {
        if (IGNORED_REASONS.includes(reason)) {
            return;
        }
        reset({ title: '' });
        onClose();
    };
    return (
        <Dialog aria-labelledby={ELEMENT_ID_LOOKUP.MODAL_TITLE} open={isOpen} onClose={handleClose}>
            <DialogTitle id={ELEMENT_ID_LOOKUP.MODAL_TITLE}>New Category</DialogTitle>
            <DialogContent>
                <form id={ELEMENT_ID_LOOKUP.FORM} onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        control={control}
                        label="Title"
                        placeholder="Category title"
                        type="text"
                        {...register('title')}
                        disabled={isSubmitting}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={e => handleClose(e, CLOSE_REASON.BUTTON)} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" form={ELEMENT_ID_LOOKUP.FORM} disabled={!isValid || isSubmitting}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateCategoryForm;
