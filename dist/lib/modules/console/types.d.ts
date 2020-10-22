import { ConsoleMessageType } from '../../puppeteer_wrapper/puppeteer_types';
export interface ConsoleFilter {
    type?: ConsoleMessageType;
    text?: string | RegExp;
}
export declare enum LogType {
    log = "log",
    debug = "debug",
    info = "info",
    error = "error",
    warning = "warning",
    trace = "trace"
}
