"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_utils_1 = require("../../utils/assert_utils");
const utils_1 = require("../../utils/utils");
class BrowserLocalStorageNotAssertions {
    constructor(localStorageAssertions) {
        this._localStorageAssertions = localStorageAssertions;
    }
    exist(key, msg) {
        const keyList = utils_1.arrayfy(key);
        if (!msg) {
            const itemText = keyList.length === 1 ? "item" : "items";
            msg = `Expected ${itemText} "${keyList.join(" ")}" not to exist in localStorage.`;
        }
        return assert_utils_1.invertify(() => {
            return this._localStorageAssertions.exist(keyList, "");
        }, "assert.localStorage.not.exist", msg);
    }
    value(key, expected, msg) {
        let keyVals = {};
        if (typeof key === "string") {
            keyVals[key] = expected;
        }
        else {
            if (typeof expected === "string")
                msg = expected;
            keyVals = key;
        }
        if (!msg) {
            const keys = Object.keys(keyVals);
            const itemText = keys.length === 1 ? "item" : "items";
            const valuesText = keys.length === 1 ? "value" : "values";
            const expectedVals = Object.values(keyVals).join(" ");
            msg = `Expected ${itemText} "${keys.join(" ")}" not to have ${valuesText} "${expectedVals}" in localStorage.`;
        }
        return assert_utils_1.invertify(() => {
            return this._localStorageAssertions.value(keyVals, "");
        }, "assert.localStorage.not.value", msg);
    }
    length(expected, msg) {
        if (!msg) {
            const itemText = expected === 1 ? "item" : "items";
            msg = `Expected localStorage not to have ${expected} ${itemText}.`;
        }
        return assert_utils_1.invertify(() => {
            return this._localStorageAssertions.length(expected, "");
        }, "assert.localStorage.not.length", msg);
    }
    empty(msg) {
        if (!msg)
            msg = `Expected localStorage not to be empty.`;
        return assert_utils_1.invertify(() => {
            return this._localStorageAssertions.empty("");
        }, "assert.localStorage.not.empty", msg);
    }
}
exports.default = BrowserLocalStorageNotAssertions;
