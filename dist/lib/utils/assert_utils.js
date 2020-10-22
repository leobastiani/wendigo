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
exports.sameMembers = exports.invertify = void 0;
const errors_1 = require("../models/errors");
// Inverts the result of an asyncronous assertion. Throws if error is not an assertion
function invertify(cb, fnName, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield cb();
        }
        catch (err) {
            if (err instanceof errors_1.AssertionError)
                return Promise.resolve();
            else if (err instanceof errors_1.WendigoError) {
                const newError = errors_1.WendigoError.overrideFnName(err, fnName);
                return Promise.reject(newError);
            }
            else
                return Promise.reject(err);
        }
        throw new errors_1.AssertionError(fnName, msg);
    });
}
exports.invertify = invertify;
function sameMembers(arr1, arr2) {
    const arr1Length = arr1.length;
    if (arr1Length !== arr2.length)
        return false;
    for (let i = 0; i < arr1Length; i++) {
        if (arr1[i] !== arr2[i])
            return false;
    }
    return true;
}
exports.sameMembers = sameMembers;
