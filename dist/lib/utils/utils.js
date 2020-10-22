"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64 = exports.filterTruthy = exports.createFindTextXPath = exports.arrayfy = exports.parseQueryString = exports.compareObjects = exports.delay = exports.matchTextContainingList = exports.matchTextList = exports.matchText = exports.promiseOr = exports.stringify = exports.isXPathQuery = exports.isNumber = void 0;
const querystring_1 = __importDefault(require("querystring"));
const url_1 = require("url");
function isNumber(n) {
    return !Number.isNaN(Number(n));
}
exports.isNumber = isNumber;
function isXPathQuery(s) {
    if (s[0] === '/')
        return true;
    if (/^.\./.test(s))
        return true;
    const axisSplit = s.split("::");
    if (axisSplit.length > 1) {
        const validAxis = ["ancestor", "ancestor-or-self", "attribute", "child", "descendant", "descendant-or-self",
            "following", "following-sibling", "namespace", "parent", "preceding", "preceding-sibling", "self"];
        const axe = axisSplit[0];
        if (validAxis.indexOf(axe) !== -1)
            return true;
    }
    return false;
}
exports.isXPathQuery = isXPathQuery;
function stringify(element) {
    if (typeof element === 'object' && !(element instanceof RegExp)) {
        element = JSON.stringify(element);
    }
    return String(element);
}
exports.stringify = stringify;
// Returns promise resolve if any promise is resolved, reject otherwise
function promiseOr(promises) {
    let resolved = false;
    let rejected = 0;
    return new Promise((resolve, reject) => {
        for (const promise of promises) {
            promise.then((res) => {
                if (!resolved) {
                    resolved = true;
                    resolve(res);
                }
            }).catch(() => {
                rejected++;
                if (!resolved && rejected >= promises.length)
                    reject();
            });
        }
    });
}
exports.promiseOr = promiseOr;
function matchText(text, expected) {
    if (text === undefined || text === null)
        return false;
    if (expected instanceof RegExp) {
        return expected.test(text);
    }
    else {
        return text === expected;
    }
}
exports.matchText = matchText;
function matchTextList(list, expected) {
    for (const text of list) {
        if (matchText(text, expected))
            return true;
    }
    return false;
}
exports.matchTextList = matchTextList;
function matchTextContainingList(list, expected) {
    for (const text of list) {
        if (text.includes(expected))
            return true;
    }
    return false;
}
exports.matchTextContainingList = matchTextContainingList;
function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
exports.delay = delay;
function compareObjects(obj1, obj2) {
    if (!obj1 || !obj2)
        return false;
    const k1 = Object.keys(obj1);
    const k2 = Object.keys(obj2);
    if (k1.length !== k2.length)
        return false;
    for (const k of k1) {
        if (obj1[k] !== obj2[k])
            return false;
    }
    return true;
}
exports.compareObjects = compareObjects;
function parseQueryString(qs) {
    if (typeof qs === 'string') {
        if (qs[0] === '?')
            qs = qs.slice(1);
        return Object.assign({}, querystring_1.default.parse(qs));
    }
    else if (qs instanceof url_1.URL) {
        qs = qs.searchParams.toString();
        return Object.assign({}, querystring_1.default.parse(qs));
    }
    else
        return qs;
}
exports.parseQueryString = parseQueryString;
function arrayfy(raw) {
    if (Array.isArray(raw))
        return raw;
    else
        return [raw];
}
exports.arrayfy = arrayfy;
function createFindTextXPath(text, contains = false, element = "*") {
    const cleanedString = cleanStringForXpath(text);
    if (contains)
        return `//${element}[contains(text(),${cleanedString})]`;
    else
        return `//${element}[text()=${cleanedString}]`;
}
exports.createFindTextXPath = createFindTextXPath;
function filterTruthy(arr) {
    return arr.filter(Boolean);
}
exports.filterTruthy = filterTruthy;
function base64(orig) {
    return Buffer.from(orig).toString('base64');
}
exports.base64 = base64;
function cleanStringForXpath(str) {
    const parts = str.split('\'');
    if (parts.length === 1)
        return `'${parts[0]}'`;
    const formattedParts = parts.map((part) => {
        if (part === "") {
            return '"\'"';
        }
        return "'" + part + "'";
    });
    return "concat(" + formattedParts.join(",") + ")";
}
