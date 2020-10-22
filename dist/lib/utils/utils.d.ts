/// <reference types="node" />
import { URL } from 'url';
export declare function isNumber(n: any): n is number;
export declare function isXPathQuery(s: string): boolean;
export declare function stringify(element: any): string;
export declare function promiseOr(promises: Array<Promise<any>>): Promise<any>;
export declare function matchText(text: string | null | undefined, expected: string | RegExp): boolean;
export declare function matchTextList(list: Array<string>, expected: string | RegExp): boolean;
export declare function matchTextContainingList(list: Array<string>, expected: string): boolean;
export declare function delay(ms: number): Promise<void>;
export declare function compareObjects(obj1: any, obj2: any): boolean;
export declare function parseQueryString(qs: string | URL | {
    [s: string]: string;
}): {
    [s: string]: string;
};
export declare function arrayfy<T>(raw: T | Array<T>): Array<T>;
export declare function createFindTextXPath(text: string, contains?: boolean, element?: string): string;
export declare function filterTruthy<T>(arr: Array<T | null | undefined>): Array<T>;
export declare function base64(orig: string): string;
