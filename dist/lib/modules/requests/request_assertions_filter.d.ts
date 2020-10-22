import RequestFilter from './request_filter';
import { ExpectedHeaders } from './types';
import { ResourceType } from '../../puppeteer_wrapper/puppeteer_types';
declare type PromiseExecutor<T> = (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void;
export default class RequestAssertionsFilter extends Promise<RequestAssertionsFilter> {
    private _requestFilter;
    constructor(executor: PromiseExecutor<RequestAssertionsFilter>, requestFilter: RequestFilter);
    url(expected: string | RegExp, msg?: string): RequestAssertionsFilter;
    method(expected: string | RegExp, msg?: string): RequestAssertionsFilter;
    status(expected: number, msg?: string): RequestAssertionsFilter;
    responseHeaders(expected: ExpectedHeaders, msg?: string): RequestAssertionsFilter;
    ok(expected?: boolean, msg?: string): RequestAssertionsFilter;
    postBody(expected: string | object | RegExp, msg?: string): RequestAssertionsFilter;
    responseBody(expected: string | object | RegExp, msg?: string): RequestAssertionsFilter;
    pending(msg?: string): RequestAssertionsFilter;
    resourceType(expected: ResourceType, msg?: string): RequestAssertionsFilter;
    contentType(expected: string | RegExp, msg?: string): RequestAssertionsFilter;
    exactly(expected: number, msg?: string): RequestAssertionsFilter;
    private _assertFilter;
    private _assertNumber;
}
export {};
