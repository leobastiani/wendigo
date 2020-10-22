import BrowserLocalStorageAssertions from './local_storage_assertions';
export default class BrowserLocalStorageNotAssertions {
    private _localStorageAssertions;
    constructor(localStorageAssertions: BrowserLocalStorageAssertions);
    exist(key: string | Array<string>, msg?: string): Promise<void>;
    value(key: string | {
        [s: string]: string;
    }, expected?: string, msg?: string): Promise<void>;
    length(expected: number, msg?: string): Promise<void>;
    empty(msg?: string): Promise<void>;
}
