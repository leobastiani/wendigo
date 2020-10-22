/// <reference types="node" />
import { AssertionError as NativeAssertionError } from 'assert';
export declare class AssertionError extends NativeAssertionError {
    readonly extraMessage: string;
    constructor(fn: string, message: string, actual?: any, expected?: any);
}
export declare class WendigoError extends Error {
    extraMessage: string;
    constructor(fn: string, message: string);
    static overrideFnName(error: Error, fnName: string): Error;
}
export declare class QueryError extends WendigoError {
    constructor(fn: string, message: string);
}
export declare class FatalError extends WendigoError {
    constructor(fn: string, message: string);
}
export declare class TimeoutError extends WendigoError {
    readonly timeout?: number;
    constructor(fn: string, message: string, timeout?: number);
}
export declare class InjectScriptError extends FatalError {
    constructor(fn: string, message: string);
}
