import { FinalBrowserSettings } from '../types';
import PuppeteerContext from './puppeteer_context';
export declare class PuppeteerLauncher {
    launch(settings: FinalBrowserSettings): Promise<PuppeteerContext>;
}
