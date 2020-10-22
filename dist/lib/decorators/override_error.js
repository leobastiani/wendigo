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
const errors_1 = require("../models/errors");
function OverrideError(errorPrefix) {
    return function (_target, propertyKey, propertyDescriptor) {
        const originalMethod = propertyDescriptor.value;
        propertyDescriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                const originalThis = this;
                try {
                    return yield originalMethod.bind(originalThis)(...args);
                }
                catch (err) {
                    const fullMethodName = `${errorPrefix ? errorPrefix + "." : ""}${propertyKey}`;
                    throw errors_1.WendigoError.overrideFnName(err, fullMethodName);
                }
            });
        };
    };
}
exports.default = OverrideError;
