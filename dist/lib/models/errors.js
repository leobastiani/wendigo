"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectScriptError = exports.TimeoutError = exports.FatalError = exports.QueryError = exports.WendigoError = exports.AssertionError = void 0;
const assert_1 = require("assert");
class AssertionError extends assert_1.AssertionError {
    constructor(fn, message, actual, expected) {
        if (actual !== undefined)
            actual = String(actual);
        if (expected !== undefined)
            expected = String(expected);
        const msg = `[${fn}] ${message}`;
        super({
            message: msg,
            actual: actual,
            expected: expected
        });
        this.extraMessage = message;
    }
}
exports.AssertionError = AssertionError;
class WendigoError extends Error {
    constructor(fn, message) {
        super(`[${fn}] ${message}`);
        // this._fnName = fn;
        this.extraMessage = message;
    }
    static overrideFnName(error, fnName) {
        if (error instanceof TimeoutError) {
            const c = error.constructor;
            const newError = new c(fnName, error.extraMessage, error.timeout);
            return newError;
        }
        else if (error instanceof AssertionError) {
            const c = error.constructor;
            const newError = new c(fnName, error.extraMessage, error.actual, error.expected); // keeps same error, changes origin function
            return newError;
        }
        else if (error instanceof WendigoError) {
            const c = error.constructor;
            const newError = new c(fnName, error.extraMessage);
            return newError;
        }
        else
            return error;
    }
}
exports.WendigoError = WendigoError;
class QueryError extends WendigoError {
    constructor(fn, message) {
        super(fn, message);
        this.name = this.constructor.name;
    }
}
exports.QueryError = QueryError;
class FatalError extends WendigoError {
    constructor(fn, message) {
        super(fn, message);
        this.name = this.constructor.name;
    }
}
exports.FatalError = FatalError;
class TimeoutError extends WendigoError {
    constructor(fn, message, timeout) {
        let msg = message ? `${message}, timeout` : "Timeout";
        if (timeout !== undefined)
            msg = `${msg} of ${timeout}ms exceeded.`;
        super(fn, msg);
        this.name = this.constructor.name;
        this.timeout = timeout;
        this.extraMessage = message;
    }
}
exports.TimeoutError = TimeoutError;
class InjectScriptError extends FatalError {
    constructor(fn, message) {
        super(fn, message);
        this.name = this.constructor.name;
    }
}
exports.InjectScriptError = InjectScriptError;
// export function handleError(error: Error, method: string, options: { timeout?: number, selector?: string } = {}): WendigoError {
//     if (error instanceof WendigoError) return error;
//     if (error instanceof PuppeteerErrors.TimeoutError) {
//         return new TimeoutError(method, error.message, options.timeout);
//     }
//     if (error instanceof Error && error.message.match(/DOMException\:/)) {
//         const selectorMessage = options.selector ? ` "${options.selector}"` : "";
//         return new QueryError(method, `Invalid selector${selectorMessage}.`);
//     } else {
//         return new WendigoError(method, error.message);
//     }
// }
