import { FinalBrowserSettings, PluginModule } from './types';
import BrowserInterface from './browser/browser_interface';
import PuppeteerContext from './puppeteer_wrapper/puppeteer_context';
export default class BrowserFactory {
    private static _browserClass?;
    static createBrowser(context: PuppeteerContext, settings: FinalBrowserSettings, plugins: Array<PluginModule>): Promise<BrowserInterface>;
    static clearCache(): void;
    private static _setupBrowserClass;
    private static _setupAssertionModule;
    private static _setupAssertionFunction;
    private static _setupAssertionClass;
}
