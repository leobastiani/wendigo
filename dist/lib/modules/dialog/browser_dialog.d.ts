import Dialog from './dialog';
import WendigoModule from '../wendigo_module';
import { OpenSettings } from '../../types';
import Browser from '../../browser/browser';
export default class BrowserDialog extends WendigoModule {
    private _dialogs;
    private _options;
    private _onDialogCB?;
    private _lastDialog?;
    constructor(browser: Browser);
    all(): Array<Dialog>;
    clear(): void;
    waitForDialog(timeout?: number): Promise<Dialog>;
    dismissLast(): Promise<void>;
    protected _beforeOpen(options: OpenSettings): Promise<void>;
}
