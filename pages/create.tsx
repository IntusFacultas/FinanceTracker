import { FunctionComponent } from 'react';
import Router from 'next/router';
import { Input, Textarea } from '../components/Primitives/Form';
import Button from '../components/Primitives/Button';
import { Anchor, Heading, Paragraph } from '../components/Primitives/Typography';
import { Flexbox } from '../components/Primitives/Flexbox';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const FormSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    content: z.string().min(1, { message: 'Content is required' }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const Draft: FunctionComponent = () => {
    const { register, handleSubmit, formState } = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
    });

    const { errors, isSubmitting, isValid } = formState;
    console.log(errors);

    const onSubmit: SubmitHandler<FormSchemaType> = async data => {
        try {
            await fetch('/api/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            await Router.push('/drafts');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Heading level={1}>New Draft</Heading>
                <Input autoFocus placeholder="Title" type="text" {...register('title')} disabled={isSubmitting} />
                {errors.title && <Paragraph color="textRed">{errors.title}</Paragraph>}
                <Textarea cols={50} placeholder="Content" rows={8} {...register('content')} disabled={isSubmitting} />
                {errors.content && <Paragraph color="textRed">{errors.content}</Paragraph>}
                <Flexbox gap="sm">
                    <Button variant="default" disabled={!isValid || isSubmitting}>
                        Create
                    </Button>
                    <Anchor href="#" onClick={() => Router.push('/')}>
                        or Cancel
                    </Anchor>
                </Flexbox>
            </form>
        </>
    );
};

export default Draft;
