import { BrowserContext, Page, BrowserContextEventObj, Permission } from "./puppeteer_types";
import PuppeteerPage from "./puppeteer_page";
export default class PuppeteerContext {
    context: BrowserContext;
    constructor(context: BrowserContext);
    getDefaultPage(): Promise<PuppeteerPage>;
    pages(): Promise<Array<Page>>;
    getPage(index: number): Promise<PuppeteerPage | void>;
    newPage(): Promise<PuppeteerPage>;
    on<K extends keyof BrowserContextEventObj>(eventName: K, cb: (msg: BrowserContextEventObj[K]) => Promise<void>): void;
    off<K extends keyof BrowserContextEventObj>(eventName: K, cb: (msg: BrowserContextEventObj[K]) => Promise<void>): void;
    overridePermissions(url: string, permissions: Array<Permission>): Promise<void>;
}
