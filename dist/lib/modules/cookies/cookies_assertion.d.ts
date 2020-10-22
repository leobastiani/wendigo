import BrowserCookies from './browser_cookies';
import BrowserInterface from '../../browser/browser_interface';
declare const _default: {
    assert(_browser: BrowserInterface, cookiesModule: BrowserCookies, name: string, expected?: string | undefined, msg?: string | undefined): Promise<void>;
    not(browser: BrowserInterface, _cookiesModule: BrowserCookies, name: string, expected?: string | undefined, msg?: string | undefined): Promise<void>;
};
export default _default;
