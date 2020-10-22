import PuppeteerContext from '../puppeteer_wrapper/puppeteer_context';
import BrowserTap from './mixins/browser_tap';
import { FinalBrowserSettings } from '../types';
import BrowserCookies from '../modules/cookies/browser_cookies';
import BrowserLocalStorage from '../modules/local_storage/browser_local_storage';
import BrowserRequests from '../modules/requests/browser_requests';
import BrowserConsole from '../modules/console/browser_console';
import BrowserWebworker from '../modules/webworkers/browser_webworker';
import BrowserDialog from '../modules/dialog/browser_dialog';
import BrowserAuth from '../modules/auth/browser_auth';
import PuppeteerPage from '../puppeteer_wrapper/puppeteer_page';
export default class Browser extends BrowserTap {
    readonly cookies: BrowserCookies;
    readonly localStorage: BrowserLocalStorage;
    readonly requests: BrowserRequests;
    readonly console: BrowserConsole;
    readonly webworkers: BrowserWebworker;
    readonly dialog: BrowserDialog;
    readonly auth: BrowserAuth;
    constructor(context: PuppeteerContext, page: PuppeteerPage, settings: FinalBrowserSettings, components?: Array<string>);
}
