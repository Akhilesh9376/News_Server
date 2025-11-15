"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenBlocklist = void 0;
// A simple in-memory set to store invalidated tokens.
// For a production environment, consider using a persistent store like Redis.
exports.tokenBlocklist = new Set();
