import Browser from '../browser/browser';
import { OpenSettings } from '../types';
import PuppeteerPage from '../puppeteer_wrapper/puppeteer_page';
export default abstract class WendigoModule {
    protected _browser: Browser;
    protected _page: PuppeteerPage;
    constructor(browser: Browser);
    protected _beforeOpen(_options: OpenSettings): Promise<void>;
    protected _beforeClose(): Promise<void>;
    protected _afterOpen(_options: OpenSettings): Promise<void>;
}
