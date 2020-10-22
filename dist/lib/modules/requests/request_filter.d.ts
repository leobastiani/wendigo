import { Request, ResourceType } from '../../puppeteer_wrapper/puppeteer_types';
import { ExpectedHeaders } from './types';
export default class RequestFilter {
    private _requestList;
    constructor(requests?: Promise<Array<Request>>);
    get requests(): Promise<Array<Request>>;
    url(url: string | RegExp): RequestFilter;
    method(method: string | RegExp): RequestFilter;
    postBody(body: string | RegExp | object): RequestFilter;
    responseBody(body: string | RegExp | object): RequestFilter;
    status(status: number): RequestFilter;
    fromCache(isFromCache?: boolean): RequestFilter;
    responseHeaders(headers: ExpectedHeaders): RequestFilter;
    ok(isOk?: boolean): RequestFilter;
    pending(): RequestFilter;
    resourceType(type: ResourceType): RequestFilter;
    contentType(type: string | RegExp): RequestFilter;
    private _responseHasHeader;
    private _getResponsesBody;
}
