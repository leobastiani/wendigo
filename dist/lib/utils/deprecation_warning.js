"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function deprecationWarning(deprecatedMethod, alternative) {
    const alternativeMsg = alternative ? `, use ${alternative} instead` : " ";
    console.warn(`Deprecation Warning: ${deprecatedMethod} is deprecated${alternativeMsg}.`);
}
exports.default = deprecationWarning;
