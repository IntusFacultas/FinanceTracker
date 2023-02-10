import 'jest-extended';
import { TextDecoder, TextEncoder } from 'util';
// eslint-disable-next-line
// @ts-ignore
global.TextEncoder = TextEncoder;
// eslint-disable-next-line
// @ts-ignore
global.TextDecoder = TextDecoder;
