import { Request } from '../../puppeteer_wrapper/puppeteer_types';
import { RequestBody, RequestMockResponseOptions, RequestMockOptions } from './types';
interface MockResponse {
    status?: number;
    headers?: {
        [s: string]: string;
    };
    contentType?: string;
    body?: string;
}
interface RequestMockInterface {
    called: boolean;
    timesCalled: number;
    response: MockResponse;
    url: string | RegExp;
    immediate: boolean;
    auto: boolean;
    continue: boolean;
    method?: string;
    waitUntilCalled(timeout: number): Promise<void>;
    assert: {
        called(times?: number, msg?: string): Promise<void>;
        postBody(expected: RequestBody | RegExp, msg?: string): Promise<void>;
    };
}
declare class RequestMockAssertions {
    private _mock;
    constructor(mock: RequestMock);
    called(times?: number, msg?: string): Promise<void>;
    postBody(expected: RequestBody | RegExp, msg?: string): Promise<void>;
}
export default class RequestMock implements RequestMockInterface {
    readonly method?: string;
    readonly response: MockResponse;
    readonly auto: boolean;
    readonly continue: boolean;
    readonly url: string | RegExp;
    readonly assert: RequestMockAssertions;
    readonly queryString?: {
        [s: string]: string;
    };
    requestsReceived: Array<Request>;
    private _events;
    private _redirectTo?;
    private _delay;
    constructor(url: string | RegExp, options: RequestMockOptions);
    get called(): boolean;
    get timesCalled(): number;
    get immediate(): boolean;
    trigger(response: RequestMockResponseOptions): void;
    waitUntilCalled(timeout?: number): Promise<void>;
    onRequest(request: Request): Promise<void>;
    private _respondRequest;
    private _onTrigger;
    private _getUrlQuerystring;
    private _processResponse;
    private _parseUrlQueryString;
    private _parseUrl;
}
export {};
