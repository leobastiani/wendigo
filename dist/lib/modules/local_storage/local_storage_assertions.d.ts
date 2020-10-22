import BrowserLocalStorageNotAssertions from './local_storage_not_assertions';
import BrowserLocalStorage from './browser_local_storage';
export default class BrowserLocalStorageAssertions {
    private _localStorage;
    readonly not: BrowserLocalStorageNotAssertions;
    constructor(localStorage: BrowserLocalStorage);
    exist(key: string | Array<string>, msg?: string): Promise<void>;
    value(key: string | {
        [s: string]: string;
    }, expected?: string, msg?: string): Promise<void>;
    length(expected: number, msg?: string): Promise<void>;
    empty(msg?: string): Promise<void>;
}
