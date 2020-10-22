import { JSHandle, ElementHandle } from '../puppeteer_wrapper/puppeteer_types';
export default class DomElement {
    readonly element: ElementHandle;
    readonly name?: string;
    constructor(elementHandle: ElementHandle, name?: string);
    query(selector: string): Promise<DomElement | null>;
    queryAll(selector: string): Promise<Array<DomElement>>;
    click(): Promise<void>;
    tap(): Promise<void>;
    focus(): Promise<void>;
    hover(): Promise<void>;
    type(text: string, options?: {
        delay: number;
    }): Promise<void>;
    getAttribute(attr: string): Promise<string | null>;
    toString(): string;
    static processQueryResult(element?: JSHandle | null, name?: string): DomElement | null;
    private _processXPath;
}
