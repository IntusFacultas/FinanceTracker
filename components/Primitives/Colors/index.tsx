export const COLORS = {
    textBlack: 'black',
    textRed: 'red',
} as const;

export type Color = keyof typeof COLORS;
