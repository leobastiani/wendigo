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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const local_storage_not_assertions_1 = __importDefault(require("./local_storage_not_assertions"));
const utils_1 = require("../../utils/utils");
const errors_1 = require("../../models/errors");
class BrowserLocalStorageAssertions {
    constructor(localStorage) {
        this._localStorage = localStorage;
        this.not = new local_storage_not_assertions_1.default(this);
    }
    exist(key, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyList = utils_1.arrayfy(key);
            const itemWord = keyList.length === 1 ? "item" : "items";
            const res = yield Promise.all(keyList.map((k) => {
                return this._localStorage.getItem(k);
            }));
            const nullValues = res.filter((r) => {
                return r === null;
            });
            if (nullValues.length !== 0) {
                if (!msg)
                    msg = `Expected ${itemWord} "${keyList.join(" ")}" to exist in localStorage.`;
                throw new errors_1.AssertionError("assert.localStorage.exist", msg);
            }
        });
    }
    value(key, expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let keyVals = {};
            if (typeof key === "string") {
                keyVals[key] = expected;
            }
            else {
                if (typeof expected === "string")
                    msg = expected;
                keyVals = key;
            }
            const keys = Object.keys(keyVals);
            const values = yield Promise.all(keys.map((k) => __awaiter(this, void 0, void 0, function* () {
                const val = yield this._localStorage.getItem(k);
                return [k, val];
            })));
            for (const v of values) {
                if (v[1] !== keyVals[v[0]]) {
                    const expectedVals = Object.values(keyVals).join(" ");
                    if (!msg) {
                        const itemText = keys.length === 1 ? "item" : "items";
                        const valuesText = keys.length === 1 ? "value" : "values";
                        const realVals = values.map(val => String(val[1])).join(" ");
                        msg = `Expected ${itemText} "${keys.join(" ")}" to have ${valuesText} "${expectedVals}" in localStorage, "${realVals}" found.`; // eslint-disable-line max-len
                    }
                    throw new errors_1.AssertionError("assert.localStorage.value", msg);
                }
            }
        });
    }
    length(expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._localStorage.length();
            if (res !== expected) {
                if (!msg)
                    msg = `Expected localStorage to have ${expected} items, ${res} found.`;
                throw new errors_1.AssertionError("assert.localStorage.length", msg, res, expected);
            }
        });
    }
    empty(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._localStorage.length();
            if (res !== 0) {
                if (!msg) {
                    const itemText = res === 1 ? "item" : "items";
                    msg = `Expected localStorage to be empty, ${res} ${itemText} found.`;
                }
                throw new errors_1.AssertionError("assert.localStorage.empty", msg);
            }
        });
    }
}
exports.default = BrowserLocalStorageAssertions;
