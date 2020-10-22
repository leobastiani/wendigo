"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../models/errors");
function FailIfNotLoaded(_target, propertyKey, propertyDescriptor) {
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = function (...args) {
        const originalThis = this;
        if (!originalThis.loaded)
            return Promise.reject(new errors_1.FatalError(propertyKey, `Cannot perform action before opening a page.`));
        return originalMethod.bind(originalThis)(...args);
    };
}
exports.default = FailIfNotLoaded;
