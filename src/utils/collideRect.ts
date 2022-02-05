import { SimulationNodeDatum } from "d3";
import { quadtree } from "d3-quadtree";

type Dim = {
  width: number;
  height: number;
};

// d3-force/src/constant.js
function constant(x: any) {
  return function () {
    return x;
  };
}

// d3-force/src/jiggle.js
function jiggle(random: Function) {
  return (random() - 0.5) * 1e-6;
}

function x(d: any) {
  return d.x + d.vx;
}

function y(d: any) {
  return d.y + d.vy;
}

export default function (dim?: any) {
  var nodes: SimulationNodeDatum[],
    dims: Dim[],
    random: Function,
    strength = 1,
    iterations = 1;

  if (typeof dim !== "function")
    dim = constant(dim == null ? { width: 1, height: 1 } : { ...dim });

  function force() {
    var i,
      n = nodes.length,
      tree,
      node: any,
      xi: number,
      yi: number,
      dimi: Dim,
      ri: number,
      ri2: number;

    for (var k = 0; k < iterations; ++k) {
      tree = quadtree(nodes, x, y).visitAfter(prepare);
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        (dimi = { ...dims[node.index] }),
          (ri = Math.hypot(dimi.width / 2, dimi.height / 2)),
          (ri2 = ri * ri);
        xi = node.x + node.vx;
        yi = node.y + node.vy;
        tree.visit(apply);
      }
    }

    function apply(quad: any, x0: number, y0: number, x1: number, y1: number) {
      var data = quad.data,
        rj = Math.hypot(quad.dim.width / 2, quad.dim.height / 2),
        dimj = { ...quad.dim },
        dim = {
          width: dimi.width + dimj.width,
          height: dimi.height + dimj.height,
        };
      var r = Math.hypot(dim.width / 2, dim.height / 2);
      if (data) {
        if (data.index > node.index) {
          var x = xi - data.x - data.vx,
            y = yi - data.y - data.vy,
            l = x * x + y * y;
          if (Math.abs(x) < dim.width / 2 && Math.abs(y) < dim.height / 2) {
            if (x === 0) (x = jiggle(random)), (l += x * x);
            if (y === 0) (y = jiggle(random)), (l += y * y);
            l = ((r - (l = Math.sqrt(l))) / l) * strength;
            node.vx += (x *= l) * (r = (ri *= rj) / (ri2 + rj));
            node.vy += (y *= l) * r;
            data.vx -= x * (r = 1 - r);
            data.vy -= y * r;
          }
        }
        return;
      }
      return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
    }
  }

  function prepare(quad: any) {
    if (quad.data) return (quad.dim = { ...dims[quad.data.index] });
    quad.dim = { width: 0, height: 0 };
    for (var i = 0; i < 4; ++i) {
      if (
        quad[i] &&
        Math.hypot(quad[i].dim.width, quad[i].dim.height) >
          Math.hypot(quad.dim.width, quad.dim.height)
      ) {
        quad.dim = { ...quad[i].dim };
      }
    }
  }

  function initialize() {
    if (!nodes) return;
    var i,
      n = nodes.length,
      node: any;
    dims = new Array(n);
    for (i = 0; i < n; ++i)
      (node = nodes[i]), (dims[node.index] = { ...dim(node, i, nodes) });
  }

  force.initialize = function (
    _nodes: SimulationNodeDatum[],
    _random: Function
  ) {
    nodes = _nodes;
    random = _random;
    initialize();
  };

  force.iterations = function (_: any) {
    return arguments.length ? ((iterations = +_), force) : iterations;
  };

  force.strength = function (_: any) {
    return arguments.length ? ((strength = +_), force) : strength;
  };

  force.dim = function (_: any) {
    return arguments.length
      ? ((dim = typeof _ === "function" ? _ : constant({ ..._ })),
        initialize(),
        force)
      : { ...dim };
  };

  return force;
}
