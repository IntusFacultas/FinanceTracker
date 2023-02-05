import { ComponentPropsWithRef, forwardRef, PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';
import { LookupValues } from '../../../type-utils';

const SPACING_SIZES = {
    SM: 'sm',
} as const;

type SpacingSize = LookupValues<typeof SPACING_SIZES>;

type StyledFlexboxProps = {
    gap?: SpacingSize;
    flexShrink?: number;
    flexGrow?: number;
    flex?: number;
    fullHeight?: boolean;
    direction?: 'column' | 'row';
    alignItems?: 'flex-start' | 'center' | 'flex-end';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
};

const SPACING_SIZE_STYLING: Record<SpacingSize, string> = {
    [SPACING_SIZES.SM]: '1rem',
};

const StyledFlexbox = styled.div<StyledFlexboxProps>`
    ${({ gap, direction, alignItems, justifyContent, fullHeight }) => css`
        display: flex;
        ${fullHeight &&
        css`
            height: 100%;
        `}
        ${justifyContent &&
        css`
            justify-content: ${justifyContent};
        `};
        ${alignItems &&
        css`
            align-items: ${alignItems};
        `};
        ${direction &&
        css`
            flex-direction: ${direction};
        `};
        ${gap &&
        css`
            gap: ${SPACING_SIZE_STYLING[gap]};
        `}
    `}
`;

export type FlexboxProps = StyledFlexboxProps & PropsWithChildren<ComponentPropsWithRef<typeof StyledFlexbox>>;

export const Flexbox = forwardRef<typeof StyledFlexbox, FlexboxProps>(({ direction = 'row', ...props }, ref) => {
    return <StyledFlexbox direction={direction} ref={ref} {...props} />;
}) as unknown as typeof StyledFlexbox;
