import { ConsoleMessage, ConsoleMessageType } from '../../puppeteer_wrapper/puppeteer_types';
export default class Log {
    message: ConsoleMessage;
    readonly text: string;
    constructor(consoleMessage: ConsoleMessage, text?: string);
    get type(): ConsoleMessageType;
}
