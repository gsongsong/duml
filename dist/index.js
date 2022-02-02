/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var duml;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/classDiagram.ts":
/*!*****************************!*\
  !*** ./src/classDiagram.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ClassDiagram\": () => (/* binding */ ClassDiagram)\n/* harmony export */ });\nfunction ClassDiagram(d3, _a, options) {\r\n    var _b, _c, _d, _e, _f;\r\n    var classes = _a.classes, associations = _a.associations;\r\n    if (options === void 0) { options = {}; }\r\n    var classList = classes.map(Object.create);\r\n    var associationList = associations.map(function (association) {\r\n        var name = association.name, source = association.from, target = association.to;\r\n        return Object.create({ name: name, source: source, target: target });\r\n    });\r\n    var associationNameList = associationList.map(function (a) { return a.name; });\r\n    var colorSchema = d3.schemeCategory10;\r\n    var color = d3.scaleOrdinal(associationNameList, colorSchema);\r\n    var force = (_b = options.force) !== null && _b !== void 0 ? _b : -400;\r\n    var simulation = d3\r\n        .forceSimulation(classList)\r\n        .force(\"link\", d3.forceLink(associationList).id(function (d) { return d.name; }))\r\n        .force(\"charge\", d3.forceManyBody().strength(force))\r\n        .force(\"x\", d3.forceX())\r\n        .force(\"y\", d3.forceY());\r\n    var drag = function (simulation) {\r\n        function dragstarted(event, d) {\r\n            if (!event.active)\r\n                simulation.alphaTarget(0.3).restart();\r\n            d.fx = d.x;\r\n            d.fy = d.y;\r\n        }\r\n        function dragged(event, d) {\r\n            d.fx = event.x;\r\n            d.fy = event.y;\r\n        }\r\n        function dragended(event, d) {\r\n            if (!event.active)\r\n                simulation.alphaTarget(0);\r\n            d.fx = null;\r\n            d.fy = null;\r\n        }\r\n        return d3\r\n            .drag()\r\n            .on(\"start\", dragstarted)\r\n            .on(\"drag\", dragged)\r\n            .on(\"end\", dragended);\r\n    };\r\n    var vw = (_c = options.vw) !== null && _c !== void 0 ? _c : 600;\r\n    var vh = (_d = options.vh) !== null && _d !== void 0 ? _d : 600;\r\n    var width = (_e = options.width) !== null && _e !== void 0 ? _e : 600;\r\n    var height = (_f = options.height) !== null && _f !== void 0 ? _f : 600;\r\n    var svg = d3\r\n        .create(\"svg\")\r\n        .attr(\"viewBox\", [-vw / 2, -vh / 2, vw, vh])\r\n        .attr(\"width\", width)\r\n        .attr(\"height\", height);\r\n    svg\r\n        .append(\"defs\")\r\n        .selectAll(\"marker\")\r\n        .data(associationNameList)\r\n        .join(\"marker\")\r\n        .attr(\"id\", function (d) { return \"arrow-\".concat(d); })\r\n        .attr(\"viewBox\", \"0 -5 10 10\")\r\n        .attr(\"refX\", 15)\r\n        .attr(\"refY\", -0.5)\r\n        .attr(\"markerWidth\", 6)\r\n        .attr(\"markerHeight\", 6)\r\n        .attr(\"orient\", \"auto\")\r\n        .append(\"path\")\r\n        .attr(\"fill\", color)\r\n        .attr(\"d\", \"M0,-5L10,0L0,5\");\r\n    var link = svg\r\n        .append(\"g\")\r\n        .attr(\"fill\", \"none\")\r\n        .attr(\"stroke-width\", 1.5)\r\n        .selectAll(\"path\")\r\n        .data(associationList)\r\n        .join(\"path\")\r\n        .attr(\"stroke\", function (d) { return color(d.name); })\r\n        .attr(\"marker-end\", function (d) { return \"url(#arrow-\".concat(d.name, \")\"); });\r\n    function linkArc(d) {\r\n        var _a, _b, _c, _d;\r\n        var target = d.target;\r\n        var tx = (_a = target.x) !== null && _a !== void 0 ? _a : 0;\r\n        var ty = (_b = target.y) !== null && _b !== void 0 ? _b : 0;\r\n        var source = d.source;\r\n        var sx = (_c = source.x) !== null && _c !== void 0 ? _c : 0;\r\n        var sy = (_d = source.y) !== null && _d !== void 0 ? _d : 0;\r\n        var r = Math.hypot(tx - sx, ty - sy);\r\n        return \"\\n      M\".concat(sx, \",\").concat(sy, \"\\n      A\").concat(r, \",\").concat(r, \" 0 0,1 \").concat(tx, \",\").concat(ty, \"\\n    \");\r\n    }\r\n    var node = svg\r\n        .append(\"g\")\r\n        .attr(\"fill\", \"currentColor\")\r\n        .attr(\"stroke-linecap\", \"round\")\r\n        .attr(\"stroke-linejoin\", \"round\")\r\n        .selectAll(\"g\")\r\n        .data(classList)\r\n        .join(\"g\")\r\n        .call(drag(simulation));\r\n    node\r\n        .append(\"circle\")\r\n        .attr(\"stroke\", \"white\")\r\n        .attr(\"stroke-width\", 1.5)\r\n        .attr(\"r\", 4);\r\n    node\r\n        .append(\"text\")\r\n        .attr(\"x\", 8)\r\n        .attr(\"y\", \"0.31em\")\r\n        .text(function (d) { return d.name; })\r\n        .clone(true)\r\n        .lower()\r\n        .attr(\"fill\", \"none\")\r\n        .attr(\"storke\", \"white\")\r\n        .attr(\"stroke-width\", 3);\r\n    simulation.on(\"tick\", function () {\r\n        link.attr(\"d\", linkArc);\r\n        node.attr(\"transform\", function (d) {\r\n            return \"translate(\".concat(d.x, \",\").concat(d.y, \")\");\r\n        });\r\n    });\r\n    return svg.node();\r\n}\r\n\n\n//# sourceURL=webpack://duml/./src/classDiagram.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ClassDiagram\": () => (/* reexport safe */ _classDiagram__WEBPACK_IMPORTED_MODULE_0__.ClassDiagram)\n/* harmony export */ });\n/* harmony import */ var _classDiagram__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classDiagram */ \"./src/classDiagram.ts\");\n\r\n\n\n//# sourceURL=webpack://duml/./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	duml = __webpack_exports__;
/******/ 	
/******/ })()
;