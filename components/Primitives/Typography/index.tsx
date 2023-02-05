import { ComponentPropsWithRef, forwardRef, PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';
import { SANS_SERIF_FONT, TEXT_TYPE_STYLING, TEXT_TYPES } from './enums';
import type { TextType } from './enums';
import { Color, COLORS } from '../Colors';

type TextProps = {
    type?: TextType;
    color?: Color;
};

export const Text = styled.span<TextProps>`
    ${SANS_SERIF_FONT};
    margin: 0;
    padding: 0;
    ${({ type, color = 'textBlack' }) => css`
        ${type ? TEXT_TYPE_STYLING[type] : TEXT_TYPE_STYLING[TEXT_TYPES.BODY]};
        color: ${COLORS[color]};
    `}
`;

export const Paragraph = Text.withComponent('p');
export const Anchor = styled.a`
    ${SANS_SERIF_FONT};
    margin: 0;
    padding: 0;
    ${TEXT_TYPE_STYLING[TEXT_TYPES.BODY]};
    cursor: pointer;
    text-decoration: none;
`;

export const StyledHeading = styled.h1`
    ${SANS_SERIF_FONT};
    margin: 0;
    padding: 0;
`;

type HeadingProps = {
    level: 1 | 2 | 3 | 4 | 5 | 6;
} & PropsWithChildren<ComponentPropsWithRef<typeof StyledHeading>>;

export const Heading = forwardRef<typeof StyledHeading, HeadingProps>(({ level, ...otherProps }, ref) => (
    <StyledHeading ref={ref} as={`h${level}`} {...otherProps} />
));
