/// <reference types="node" />
import BrowserQueries from './browser_queries';
import { WendigoSelector } from '../../types';
import { Base64ScreenShotOptions } from '../../puppeteer_wrapper/puppeteer_types';
export default abstract class BrowserActions extends BrowserQueries {
    type(selector: WendigoSelector, text: string, options?: {
        delay: number;
    }): Promise<void>;
    keyPress(key: Array<string> | string, count?: number): Promise<void>;
    uploadFile(selector: WendigoSelector, path: string): Promise<void>;
    select(selector: WendigoSelector, values: Array<string> | string): Promise<Array<string>>;
    clearValue(selector: WendigoSelector): Promise<void>;
    setValue(selector: WendigoSelector, value: any): Promise<number>;
    check(selector: WendigoSelector): Promise<void>;
    uncheck(selector: WendigoSelector): Promise<void>;
    focus(selector: WendigoSelector): Promise<void>;
    hover(selector: WendigoSelector): Promise<void>;
    scroll(value: number, xvalue?: number): Promise<void>;
    screenshot(args?: Base64ScreenShotOptions): Promise<string | Buffer>;
    screenshotOfElement(selector: WendigoSelector, options?: Base64ScreenShotOptions): Promise<string | Buffer>;
    blur(selector: WendigoSelector): Promise<void>;
    dragAndDrop(from: WendigoSelector, to: WendigoSelector): Promise<void>;
}
