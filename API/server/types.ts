import type { Record, Category } from '@prisma/client';
import { CurriedFunction1 } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

export interface BaseAPIResponse {
    success: boolean;
}
export interface APIErrorResponse extends BaseAPIResponse {
    success: false;
    error: string;
}
export interface APISuccessResponse<TData = unknown> extends BaseAPIResponse {
    success: true;
    data: TData;
}
export type RecordWithCategory = Record & { category: { title: Category['title'] } };
export type NextAPIRouteHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'CONNECT' | 'HEAD' | 'TRACE';
export type SimpleAPIRouteHandlerWrapper = (handler: NextAPIRouteHandler) => NextAPIRouteHandler;
export type CurriedAPIRouteHandlerWrapper = CurriedFunction1<NextAPIRouteHandler, NextAPIRouteHandler>;
export type NextAPIRouteHandlerWrapper = SimpleAPIRouteHandlerWrapper | CurriedAPIRouteHandlerWrapper;
export type NetworkRecord = Omit<Record, 'date'> & { date: string };
