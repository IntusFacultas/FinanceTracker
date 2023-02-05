import { css } from 'styled-components';
import { LookupValues } from '../../../type-utils';

export const SANS_SERIF_FONT = css`
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
`;

export const TEXT_TYPES = {
    BODY: 'body',
    FINE_PRINT: 'finePrint',
} as const;

export type TextType = LookupValues<typeof TEXT_TYPES>;

export const TEXT_TYPE_STYLING: Record<TextType, ReturnType<typeof css>> = {
    [TEXT_TYPES.BODY]: css`
        font-size: 16px;
    `,
    [TEXT_TYPES.FINE_PRINT]: css`
        font-size: 12px;
    `,
};
