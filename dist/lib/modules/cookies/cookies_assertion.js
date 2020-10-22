"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_utils_1 = require("../../utils/assert_utils");
const errors_1 = require("../../models/errors");
exports.default = {
    assert(_browser, cookiesModule, name, expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookie = yield cookiesModule.get(name);
            if (expected === undefined) {
                if (cookie === undefined) {
                    if (!msg) {
                        msg = `Expected cookie "${name}" to exist.`;
                    }
                    throw new errors_1.AssertionError("assert.cookies", msg);
                }
            }
            else {
                const value = cookie ? cookie.value : undefined;
                if (value !== expected) {
                    if (!msg) {
                        msg = `Expected cookie "${name}" to have value "${expected}", "${value}" found.`;
                    }
                    throw new errors_1.AssertionError("assert.cookies", msg, value, expected);
                }
            }
        });
    },
    not(browser, _cookiesModule, name, expected, msg) {
        if (!msg) {
            msg = expected === undefined ?
                `Expected cookie "${name}" to not exist.` :
                `Expected cookie "${name}" to not have value "${expected}".`;
        }
        return assert_utils_1.invertify(() => {
            return browser.assert.cookies(name, expected, "x");
        }, "assert.not.cookies", msg);
    }
};
