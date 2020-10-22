import { Cookie as CookieData, SetCookie, DeleteCookie } from '../../puppeteer_wrapper/puppeteer_types';
import WendigoModule from '../wendigo_module';
export default class BrowserCookies extends WendigoModule {
    all(): Promise<{
        [s: string]: string;
    }>;
    get(name: string, url?: string): Promise<CookieData | void>;
    set(name: string, value: string | SetCookie): Promise<void>;
    delete(name: string | Array<string> | DeleteCookie): Promise<void>;
    clear(): Promise<void>;
    private _isDeleteCookieInterface;
}
