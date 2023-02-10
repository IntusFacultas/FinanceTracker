import { LookupValues } from '../../../type-utils';
import { css } from 'styled-components';

export const BUTTON_VARIANTS = {
    DEFAULT: 'default',
} as const;

export type ButtonVariant = LookupValues<typeof BUTTON_VARIANTS>;

export const BUTTON_VARIANT_STYLING: Record<ButtonVariant, ReturnType<typeof css>> = {
    [BUTTON_VARIANTS.DEFAULT]: css`
        background: #ececec;
    `,
};
