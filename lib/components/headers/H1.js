"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.H1 = H1;
const jsx_runtime_1 = require("react/jsx-runtime");
function H1({ notUnderlineColor, children }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: "block mb-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative inline-block", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-3xl font-extrabold", children: children }), !notUnderlineColor && ((0, jsx_runtime_1.jsx)("span", { className: "absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-600 rounded-full" }))] }) }));
}
