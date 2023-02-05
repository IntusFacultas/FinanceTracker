import { ComponentPropsWithRef, forwardRef, FunctionComponent, PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';
import { BUTTON_VARIANT_STYLING, ButtonVariant } from './enums';

type StyledButtonProps = {
    variant: ButtonVariant;
};

const StyledButton = styled.button<StyledButtonProps>`
    ${({ variant }) => css`
        ${BUTTON_VARIANT_STYLING[variant]}
    `}
    border: 0;
    cursor: pointer;
    padding: 1rem 2rem;
`;

type ButtonProps = StyledButtonProps & PropsWithChildren<ComponentPropsWithRef<typeof StyledButton>>;

const Button: FunctionComponent<ButtonProps> = forwardRef<typeof StyledButton, ButtonProps>(({ ...props }, ref) => {
    return <StyledButton {...props} ref={ref} />;
}) as unknown as typeof StyledButton;

export default Button;
