import { Dialog as PuppeteerDialog, DialogType } from '../../puppeteer_wrapper/puppeteer_types';
export default class Dialog {
    private _dialog;
    constructor(dialog: PuppeteerDialog);
    get text(): string;
    get type(): DialogType;
    get handled(): boolean;
    dismiss(): Promise<void>;
    accept(text: string): Promise<void>;
}
