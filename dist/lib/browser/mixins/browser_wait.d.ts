import BrowserNavigation from './browser_navigation';
import { WendigoSelector } from '../../types';
import { EvaluateFn } from '../../puppeteer_wrapper/puppeteer_types';
export default abstract class BrowserWait extends BrowserNavigation {
    wait(ms?: number): Promise<void>;
    waitFor(selector: EvaluateFn, timeout?: number, ...args: Array<any>): Promise<void>;
    waitUntilNotVisible(selector: WendigoSelector, timeout?: number): Promise<void>;
    waitForUrl(url: string | RegExp, timeout?: number): Promise<void>;
    waitForNavigation(timeout?: number): Promise<void>;
    clickAndWaitForNavigation(selector: WendigoSelector, timeout?: number): Promise<number>;
    waitForText(text: string, timeout?: number): Promise<void>;
    waitAndClick(selector: string, timeout?: number): Promise<number>;
    waitAndType(selector: string, text: string, timeout?: number): Promise<void>;
    waitAndCheck(selector: string, timeout?: number): Promise<void>;
    waitUntilEnabled(selector: WendigoSelector, timeout?: number): Promise<void>;
    private _getTimeout;
    private _overrideWaitError;
}
