import PuppeteerPage from "../../puppeteer_wrapper/puppeteer_page";
export default class HeaderHelper {
    private _page;
    private authorizationHeader;
    private extraHeaders;
    constructor(page: PuppeteerPage);
    setAuthHeader(value: string | undefined): Promise<void>;
    setExtraHeaders(extraHeaders: Record<string, string> | undefined): Promise<void>;
    protected setPageHeaders(): Promise<void>;
}
