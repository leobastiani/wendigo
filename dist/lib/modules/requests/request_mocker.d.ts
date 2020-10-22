import RequestMock from './request_mock';
import { Request } from '../../puppeteer_wrapper/puppeteer_types';
import { RequestMockOptions } from './types';
export default class RequestMocker {
    private _mockedRequests;
    constructor();
    getAllMocks(): Array<RequestMock>;
    getMockedResponse(request: Request): RequestMock | null;
    mockRequest(url: string | RegExp, options?: RequestMockOptions): RequestMock;
    removeMock(url: string, options?: RequestMockOptions): void;
    clear(): void;
    private _removeExactMocks;
    private _sameQs;
    private _getMock;
    private _matchMock;
    private _matchOptions;
    private _matchUrl;
    private _hasHigherPriority;
    private _checkElementPriority;
}
