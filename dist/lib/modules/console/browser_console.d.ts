import Log from './log';
import WendigoModule from '../wendigo_module';
import { LogType, ConsoleFilter } from './types';
import Browser from '../../browser/browser';
import { OpenSettings } from '../../types';
export default class BrowserConsole extends WendigoModule {
    private _logs;
    constructor(browser: Browser);
    get LogType(): typeof LogType;
    all(): Array<Log>;
    filter(filters?: ConsoleFilter): Array<Log>;
    clear(): void;
    protected _beforeOpen(options: OpenSettings): Promise<void>;
}
