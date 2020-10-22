import BrowserInterface from './browser_interface';
import AssertionsCore from './assertions/assertions_core';
import BrowserNotAssertions from './assertions/browser_not_assertions';
import BrowserLocalStorageAssertions from '../modules/local_storage/local_storage_assertions';
import RequestAssertionsFilter from '../modules/requests/request_assertions_filter';
import { ConsoleFilter } from '../modules/console/types';
export default class BrowserAssertions extends AssertionsCore {
    readonly not: NotAssertions;
    readonly localStorage: BrowserLocalStorageAssertions;
    constructor(browser: BrowserInterface);
    get requests(): RequestAssertionsFilter;
    console(filterOptions: ConsoleFilter, count?: number, msg?: string): Promise<void>;
    cookies(name: string, expected?: string, msg?: string): Promise<void>;
    webworkers(options: {
        url?: string;
        count?: number;
    }, msg?: string): Promise<void>;
}
declare class NotAssertions extends BrowserNotAssertions {
    cookies(name: string, expected?: string, msg?: string): Promise<void>;
}
export {};
