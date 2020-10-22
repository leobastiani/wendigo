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
exports.makeAssertion = exports.getCountCase = exports.parseCountInput = void 0;
const errors_1 = require("../../models/errors");
const utils_1 = require("../../utils/utils");
var CountCase;
(function (CountCase) {
    CountCase["equal"] = "equal";
    CountCase["atLeast"] = "atLeast";
    CountCase["atMost"] = "atMost";
    CountCase["both"] = "both";
})(CountCase || (CountCase = {}));
function parseCountInput(count) {
    let result;
    if (utils_1.isNumber(count)) {
        result = {
            equal: Number(count)
        };
    }
    else
        result = count;
    return result;
}
exports.parseCountInput = parseCountInput;
function getCountCase(count) {
    let countCase = null;
    if (utils_1.isNumber(count.equal)) {
        countCase = CountCase.equal;
    }
    else {
        if (utils_1.isNumber(count.atLeast)) {
            countCase = CountCase.atLeast;
        }
        if (utils_1.isNumber(count.atMost)) {
            countCase = countCase ? CountCase.both : CountCase.atMost;
        }
    }
    return countCase;
}
exports.getCountCase = getCountCase;
function makeAssertion(selector, countData, countCase, elementsFound, msg) {
    switch (countCase) {
        case CountCase.equal:
            return equalAssertion(countData, elementsFound, msg, selector);
        case CountCase.atLeast:
            return atLeastAssertion(countData, elementsFound, msg, selector);
        case CountCase.atMost:
            return atMostAssertion(countData, elementsFound, msg, selector);
        case CountCase.both:
            return bothAssertion(countData, elementsFound, msg, selector);
    }
}
exports.makeAssertion = makeAssertion;
function equalAssertion(countData, elementsFound, msg, selector) {
    return __awaiter(this, void 0, void 0, function* () {
        const expected = Number(countData.equal);
        if (elementsFound !== expected) {
            if (!msg)
                msg = `Expected selector "${selector}" to find exactly ${countData.equal} elements, ${elementsFound} found`;
            throw new errors_1.AssertionError("assert.elements", msg, elementsFound, expected);
        }
    });
}
function atLeastAssertion(countData, elementsFound, msg, selector) {
    return __awaiter(this, void 0, void 0, function* () {
        const expected = Number(countData.atLeast);
        if (elementsFound < expected) {
            if (!msg)
                msg = `Expected selector "${selector}" to find at least ${countData.atLeast} elements, ${elementsFound} found`;
            throw new errors_1.AssertionError("assert.elements", msg);
        }
    });
}
function atMostAssertion(countData, elementsFound, msg, selector) {
    return __awaiter(this, void 0, void 0, function* () {
        const expected = Number(countData.atMost);
        if (elementsFound > expected) {
            if (!msg)
                msg = `Expected selector "${selector}" to find up to ${countData.atMost} elements, ${elementsFound} found`;
            throw new errors_1.AssertionError("assert.elements", msg);
        }
    });
}
function bothAssertion(countData, elementsFound, msg, selector) {
    return __awaiter(this, void 0, void 0, function* () {
        const most = Number(countData.atMost);
        const least = Number(countData.atLeast);
        if (elementsFound < least || elementsFound > most) {
            if (!msg)
                msg = `Expected selector "${selector}" to find between ${countData.atLeast} and ${countData.atMost} elements, ${elementsFound} found`; // eslint-disable-line max-len
            throw new errors_1.AssertionError("assert.elements", msg);
        }
    });
}
