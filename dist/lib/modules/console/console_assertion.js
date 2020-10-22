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
const utils_1 = require("../../utils/utils");
const errors_1 = require("../../models/errors");
function processMessage(filterOptions, count, actualCount) {
    const filterMessage = processFilterMessage(filterOptions);
    return `Expected ${count} console events${filterMessage}, ${actualCount} found.`;
}
function processMessageWithoutExpectedCount(filterOptions) {
    const filterMessage = processFilterMessage(filterOptions);
    return `Expected at least one console event${filterMessage}, none found.`;
}
function processFilterMessage(filterOptions) {
    const typeMsg = filterOptions.type ? ` of type "${filterOptions.type}"` : "";
    const textMsg = filterOptions.text ? ` with text "${filterOptions.text}"` : "";
    return `${typeMsg}${textMsg}`;
}
function default_1(consoleModule, filterOptions, count, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        const logs = consoleModule.filter(filterOptions);
        if (!utils_1.isNumber(count)) {
            if (logs.length <= 0) {
                if (!msg)
                    msg = processMessageWithoutExpectedCount(filterOptions);
                throw new errors_1.AssertionError("assert.console", msg);
            }
        }
        else {
            if (logs.length !== count) {
                if (!msg)
                    msg = processMessage(filterOptions, count, logs.length);
                throw new errors_1.AssertionError("assert.console", msg);
            }
        }
    });
}
exports.default = default_1;
