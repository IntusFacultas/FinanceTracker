import {
    ChangeEventHandler,
    ComponentPropsWithRef,
    forwardRef,
    FunctionComponent,
    HTMLProps,
    PropsWithChildren,
} from 'react';
import styled from 'styled-components';
import { FORM_ELEMENT_STYLING } from './enums';

const StyledTextarea = styled.textarea<HTMLProps<HTMLTextAreaElement>>`
    ${FORM_ELEMENT_STYLING}
`;

const StyledInput = styled.input`
    ${FORM_ELEMENT_STYLING}
`;

type TextareaProps = { onChange: ChangeEventHandler<HTMLTextAreaElement> } & PropsWithChildren<
    ComponentPropsWithRef<typeof StyledTextarea>
>;

export const Textarea: FunctionComponent<TextareaProps> = forwardRef<typeof StyledTextarea, TextareaProps>(
    ({ ...props }, ref) => {
        return <StyledTextarea {...props} ref={ref} />;
    }
);

type InputProps = { onChange: ChangeEventHandler<HTMLInputElement> } & PropsWithChildren<
    ComponentPropsWithRef<typeof StyledInput>
>;

export const Input: FunctionComponent<InputProps> = forwardRef<typeof StyledInput, InputProps>(({ ...props }, ref) => {
    return <StyledInput {...props} ref={ref} />;
});

export default Textarea;
