"use strict";
exports.__esModule = true;
exports.ClassDiagram = void 0;
function ClassDiagram(d3, _a, options) {
    var _b, _c, _d, _e, _f;
    var classes = _a.classes, associations = _a.associations;
    if (options === void 0) { options = {}; }
    var classList = classes.map(Object.create);
    var associationList = associations.map(Object.create);
    var associationNameList = associationList.map(function (a) { return a.name; });
    var colorSchema = d3.schemeCategory10;
    var color = d3.scaleOrdinal(associationNameList, colorSchema);
    var force = (_b = options.force) !== null && _b !== void 0 ? _b : -400;
    var simulation = d3
        .forceSimulation(classList)
        .force("link", d3.forceLink(associationList).id(function (d) { return d.name; }))
        .force("charge", d3.forceManyBody().strength(force))
        .force("x", d3.forceX())
        .force("y", d3.forceY());
    var drag = function (simulation) {
        function dragstarted(event, d) {
            if (!event.active)
                simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        function dragended(event, d) {
            if (!event.active)
                simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        return d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    };
    var vw = (_c = options.vw) !== null && _c !== void 0 ? _c : 600;
    var vh = (_d = options.vh) !== null && _d !== void 0 ? _d : 600;
    var width = (_e = options.width) !== null && _e !== void 0 ? _e : 600;
    var height = (_f = options.height) !== null && _f !== void 0 ? _f : 600;
    var svg = d3
        .create("svg")
        .attr("viewBox", [-vw / 2, -vh / 2, vw, vh])
        .attr("width", width)
        .attr("height", height);
    svg
        .append("defs")
        .selectAll("marker")
        .data(associationNameList)
        .join("marker")
        .attr("id", function (d) { return "arrow-" + d; })
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -0.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", color)
        .attr("d", "M0,-5L10,0L0,5");
    var link = svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(associationList)
        .join("path")
        .attr("stroke", function (d) { return color(d.name); })
        .attr("marker-end", function (d) { return "url(#arrow-" + d.name + ")"; });
    function linkArc(d) {
        var _a, _b, _c, _d;
        var target = d.target;
        var tx = (_a = target.x) !== null && _a !== void 0 ? _a : 0;
        var ty = (_b = target.y) !== null && _b !== void 0 ? _b : 0;
        var source = d.source;
        var sx = (_c = source.x) !== null && _c !== void 0 ? _c : 0;
        var sy = (_d = source.y) !== null && _d !== void 0 ? _d : 0;
        var r = Math.hypot(tx - sx, ty - sy);
        return "\n      M" + sx + "," + sy + "\n      A" + r + "," + r + " 0 0,1 " + tx + "," + ty + "\n    ";
    }
    var node = svg
        .append("g")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(classList)
        .join("g")
        .call(drag(simulation));
    node
        .append("circle")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("r", 4);
    node
        .append("text")
        .attr("x", 8)
        .attr("y", "0.31em")
        .text(function (d) { return d.name; })
        .clone(true)
        .lower()
        .attr("fill", "none")
        .attr("storke", "white")
        .attr("stroke-width", 3);
    simulation.on("tick", function () {
        link.attr("d", linkArc);
        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    });
    return svg.node();
}
exports.ClassDiagram = ClassDiagram;
