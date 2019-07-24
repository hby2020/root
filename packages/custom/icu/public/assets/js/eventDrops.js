!(function(t, e) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define([], e)
    : "object" == typeof exports
    ? (exports.eventDrops = e())
    : (t.eventDrops = e());
})(this, function() {
  return (function(t) {
    function e(n) {
      if (r[n]) return r[n].exports;
      var a = (r[n] = { i: n, l: !1, exports: {} });
      return t[n].call(a.exports, a, a.exports, e), (a.l = !0), a.exports;
    }
    var r = {};
    return (
      (e.m = t),
      (e.c = r),
      (e.i = function(t) {
        return t;
      }),
      (e.d = function(t, r, n) {
        e.o(t, r) ||
          Object.defineProperty(t, r, {
            configurable: !1,
            enumerable: !0,
            get: n
          });
      }),
      (e.n = function(t) {
        var r =
          t && t.__esModule
            ? function() {
                return t.default;
              }
            : function() {
                return t;
              };
        return e.d(r, "a", r), r;
      }),
      (e.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      (e.p = ""),
      e((e.s = 11))
    );
  })([
    function(t, e, r) {
      "use strict";
      function n() {
        var t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
          e = arguments[1],
          r = arguments[2],
          n = e.domain(),
          o = a(n, 2),
          i = o[0],
          l = o[1];
        return t.filter(function(t) {
          return r(t) >= i && r(t) <= l;
        });
      }
      Object.defineProperty(e, "__esModule", { value: !0 });
      var a = (function() {
        function t(t, e) {
          var r = [],
            n = !0,
            a = !1,
            o = void 0;
          try {
            for (
              var i, l = t[Symbol.iterator]();
              !(n = (i = l.next()).done) &&
              (r.push(i.value), !e || r.length !== e);
              n = !0
            );
          } catch (t) {
            (a = !0), (o = t);
          } finally {
            try {
              !n && l.return && l.return();
            } finally {
              if (a) throw o;
            }
          }
          return r;
        }
        return function(e, r) {
          if (Array.isArray(e)) return e;
          if (Symbol.iterator in Object(e)) return t(e, r);
          throw new TypeError(
            "Invalid attempt to destructure non-iterable instance"
          );
        };
      })();
      e.default = n;
    },
    function(t, e, r) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var n = r(0),
        a = (function(t) {
          return t && t.__esModule ? t : { default: t };
        })(n);
      e.default = function(t, e, r) {
        return function(n) {
          var o = t.selectAll(".label").data(n),
            i = function(t) {
              var n = (0, a.default)(t.data, e.x, r.date).length;
              return t.name + (n > 0 ? " (" + n + ")" : "");
            };
          o.text(i),
            o
              .enter()
              .append("text")
              .classed("label", !0)
              .attr("x", r.labelsWidth)
              .attr("transform", function(t, r) {
                return "translate(0, " + (40 + e.y(r)) + ")";
              })
              .attr("text-anchor", "end")
              .text(i),
            o.exit().remove();
        };
      };
    },
    function(t, e, r) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.boolOrReturnValue = e.drawBottomAxis = e.drawTopAxis = void 0);
      var n = r(13),
        a = (function(t) {
          return t && t.__esModule ? t : { default: t };
        })(n),
        o = function(t, e, r, n, o) {
          return t
            .append("g")
            .classed("x-axis", !0)
            .classed(n, !0)
            .attr("transform", "translate(0, " + o + ")")
            .call((0, a.default)(e, r, n));
        };
      (e.drawTopAxis = function(t, e, r, n) {
        return o(t, e, r, "top", 0);
      }),
        (e.drawBottomAxis = function(t, e, r, n) {
          return o(t, e, r, "bottom", +n.height - 41);
        }),
        (e.boolOrReturnValue = function(t, e) {
          return "function" == typeof t ? t(e) : t;
        });
    },
    function(t, e, r) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var n = {
        lineHeight: 40,
        start: new Date(0),
        end: new Date(),
        minScale: 0,
        maxScale: 1 / 0,
        margin: { top: 60, left: 200, bottom: 40, right: 50 },
        labelsWidth: 210,
        labelsRightMargin: 10,
        locale: null,
        axisFormat: null,
        tickFormat: function(t) {
          var e = d3.timeFormat(".%L"),
            r = d3.timeFormat(":%S"),
            n = d3.timeFormat("%I:%M"),
            a = d3.timeFormat("%I %p"),
            o = d3.timeFormat("%a %d"),
            i = d3.timeFormat("%b %d"),
            l = d3.timeFormat("%B"),
            u = d3.timeFormat("%Y");
          return (d3.timeSecond(t) < t
            ? e
            : d3.timeMinute(t) < t
            ? r
            : d3.timeHour(t) < t
            ? n
            : d3.timeDay(t) < t
            ? a
            : d3.timeMonth(t) < t
            ? d3.timeWeek(t) < t
              ? o
              : i
            : d3.timeYear(t) < t
            ? l
            : u)(t);
        },
        mouseout: function() {},
        mouseover: function() {},
        zoomend: function() {},
        click: function() {},
        hasDelimiter: !0,
        date: function(t) {
          return t;
        },
        hasTopAxis: !0,
        hasBottomAxis: function(t) {
          return t.length >= 10;
        },
        eventLineColor: "black",
        eventColor: null,
        metaballs: !0,
        zoomable: !0
      };
      (n.dateFormat = n.locale
        ? n.locale.timeFormat("%d %B %Y")
        : d3.timeFormat("%d %B %Y")),
        (e.default = n);
    },
    function(t, e, r) {
      "use strict";
      function n(t) {
        return t && t.__esModule ? t : { default: t };
      }
      Object.defineProperty(e, "__esModule", { value: !0 });
      var a = r(12),
        o = r(8),
        i = r(9),
        l = n(i),
        u = r(1),
        s = n(u),
        c = r(10),
        d = n(c),
        f = r(2);
      e.default = function(t, e, r, n) {
        var i = t.append("defs");
        i.append("clipPath")
          .attr("id", "drops-container-clipper")
          .append("rect")
          .attr("id", "drops-container-rect")
          .attr("width", e.width - (n.labelsWidth + n.labelsRightMargin))
          .attr("height", e.height + n.margin.top + n.margin.bottom);
        var u = t
            .append("g")
            .classed("labels", !0)
            .attr("width", n.labelsWidth)
            .attr("transform", "translate(0, " + n.lineHeight + ")"),
          c = t
            .append("g")
            .attr("class", "chart-wrapper")
            .attr("width", e.width - (n.labelsWidth + n.labelsRightMargin))
            .attr(
              "transform",
              "translate(" + (n.labelsWidth + n.labelsRightMargin) + ", 55)"
            ),
          m = c
            .append("g")
            .classed("drops-container", !0)
            .attr("clip-path", "url(#drops-container-clipper)");
        n.metaballs && m.style("filter", "url(#metaballs)"),
          c
            .append("g")
            .classed("extremum", !0)
            .attr("width", e.width)
            .attr("height", 30)
            .attr("transform", "translate(0, -35)"),
          n.metaballs && (0, a.metaballs)(i);
        var p = c.append("g").classed("axes", !0),
          h = (0, d.default)(r, n, e),
          v = (0, s.default)(u, r, n),
          x = (0, l.default)(m, r, n);
        return function(a) {
          h(p, a),
            (0, o.delimiters)(
              t,
              r,
              n.labelsWidth + n.labelsRightMargin,
              n.dateFormat
            ),
            x(a),
            v(a),
            (0, f.boolOrReturnValue)(n.hasTopAxis, a) &&
              (0, f.drawTopAxis)(p, r.x, n, e),
            (0, f.boolOrReturnValue)(n.hasBottomAxis, a) &&
              (0, f.drawBottomAxis)(p, r.x, n, e);
        };
      };
    },
    function(t, e, r) {
      "use strict";
      (function(t) {
        function n(t) {
          return t && t.__esModule ? t : { default: t };
        }
        Object.defineProperty(e, "__esModule", { value: !0 });
        var a = r(14),
          o = n(a),
          i = r(1),
          l = n(i),
          u = r(2);
        e.default = function(e, r, n, a, i) {
          var s = function(r) {
              var s = d3.event.transform.rescaleX(n.x);
              (0, u.boolOrReturnValue)(a.hasTopAxis, r) &&
                e.selectAll(".x-axis.top").call(d3.axisTop().scale(s)),
                (0, u.boolOrReturnValue)(a.hasBottomAxis, r) &&
                  e.selectAll(".x-axis.bottom").call(d3.axisBottom().scale(s));
              var c = (0, o.default)(
                (0, l.default)(e.select(".labels"), { x: s }, a),
                100
              );
              t.requestAnimationFrame(function() {
                e
                  .selectAll(".drop-line")
                  .selectAll(".drop")
                  .attr("cx", function(t) {
                    return s(new Date(t.date));
                  }),
                  c(r),
                  i && i(r);
              });
            },
            c = d3
              .zoom()
              .scaleExtent([a.minScale, a.maxScale])
              .on("zoom", s)
              .on("end", a.zoomend);
          return e.call(c), c;
        };
      }.call(e, r(16)));
    },
    function(t, e, r) {
      "use strict";
      function n(t, e) {
        for (var r in e)
          t[r] = (function(r) {
            return function(n) {
              return arguments.length ? ((e[r] = n), t) : e[r];
            };
          })(r);
      }
      t.exports = n;
    },
    function(t, e) {},
    function(t, e, r) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      e.delimiters = function(t, e, r, n) {
        var a = t.select(".extremum"),
          o = e.x.domain();
        a.selectAll(".minimum").remove(),
          a.selectAll(".maximum").remove(),
          a
            .append("text")
            .text(n(o[0]))
            .classed("minimum", !0),
          a
            .append("text")
            .text(n(o[1]))
            .classed("maximum", !0)
            .attr("transform", "translate(" + (e.x.range()[1] - r) + ")")
            .attr("text-anchor", "end");
      };
    },
    function(t, e, r) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.default = function(t, e, r) {
          return function(n) {
            var a = t
                .selectAll(".drop-line")
                .data(n)
                .enter()
                .append("g")
                .classed("drop-line", !0)
                .attr("width", e.x.range()[1])
                .attr("transform", function(t, r) {
                  return "translate(0, " + e.y(r) + ")";
                })
                .attr("fill", r.eventLineColor),
              o = a.selectAll(".drop");
            o
              .data(function(t) {
                return t.data;
              })
              .enter()
              .append("circle")
              .classed("drop", !0)
              .attr("r", 5)
              .attr("cx", function(t) {
                return e.x(r.date(t));
              })
              .attr("cy", r.lineHeight / 2)
              .attr("fill", r.eventColor)
              .on("click", r.click)
              .on("mouseover", r.mouseover)
              .on("mouseout", r.mouseout),
              o
                .exit()
                .on("click", null)
                .on("mouseout", null)
                .on("mouseover", null)
                .remove(),
              a.exit().remove();
          };
        });
    },
    function(t, e, r) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.default = function(t, e, r) {
          return function(n, a) {
            var o = n.selectAll(".line-separator").data(a);
            o
              .enter()
              .append("g")
              .classed("line-separator", !0)
              .attr("transform", function(r, n) {
                return "translate(0, " + (t.y(n) + e.lineHeight) + ")";
              })
              .append("line")
              .attr("x1", 0)
              .attr("x2", r.width - (e.labelsWidth + e.labelsRightMargin)),
              o.exit().remove();
          };
        });
    },
    function(t, e, r) {
      "use strict";
      function n(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function a() {
        function t(t, e, r) {
          return {
            x: i(t.width - (e.labelsWidth + e.labelsRightMargin), [
              e.start,
              e.end
            ]),
            y: a(r)
          };
        }
        function e(e) {
          var r = void 0,
            a = e.each(function(e) {
              d3.select(this)
                .select(".event-drops-chart")
                .remove();
              var a = {
                  width: this.clientWidth,
                  height: e.length * n.lineHeight
                },
                o = d3
                  .select(this)
                  .append("svg")
                  .classed("event-drops-chart", !0)
                  .attr("width", a.width)
                  .attr("height", a.height + n.margin.top + n.margin.bottom);
              (r = t(a, n, e)),
                (0, m.default)(o, a, r, n)(e),
                n.zoomable && (0, h.default)(o, a, r, n);
            });
          return (
            (a.scales = r),
            (a.visibleDataInRow = function(t, e) {
              return (0, s.default)(t, e, n.date);
            }),
            a
          );
        }
        var r =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          n = o({}, d.default, r),
          a = function(t) {
            return d3
              .scaleOrdinal()
              .domain(
                t.map(function(t) {
                  return t.name;
                })
              )
              .range(
                t.map(function(t, e) {
                  return e * n.lineHeight;
                })
              );
          },
          i = function(t, e) {
            return d3
              .scaleTime()
              .domain(e)
              .range([0, t]);
          };
        return (0, l.default)(e, n), e;
      }
      Object.defineProperty(e, "__esModule", { value: !0 });
      var o =
          Object.assign ||
          function(t) {
            for (var e = 1; e < arguments.length; e++) {
              var r = arguments[e];
              for (var n in r)
                Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n]);
            }
            return t;
          },
        i = r(6),
        l = n(i),
        u = r(0),
        s = n(u);
      r(7);
      var c = r(3),
        d = n(c),
        f = r(4),
        m = n(f),
        p = r(5),
        h = n(p);
      (d3.chart = d3.chart || {}), (d3.chart.eventDrops = a), (e.default = a);
    },
    function(t, e, r) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      e.metaballs = function(t) {
        var e = t.append("filter");
        return (
          e.attr("id", "metaballs"),
          e
            .append("feGaussianBlur")
            .attr("in", "SourceGraphic")
            .attr("stdDeviation", 10)
            .attr("result", "blur"),
          e
            .append("feColorMatrix")
            .attr("in", "blur")
            .attr("mode", "matrix")
            .attr("values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 50 -10")
            .attr("result", "contrast"),
          e
            .append("feBlend")
            .attr("in", "SourceGraphic")
            .attr("in2", "contrast"),
          e
        );
      };
    },
    function(t, e, r) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.default = function(t, e, r) {
          var n = e.locale ? e.locale.timeFormat : e.tickFormat;
          r = "" + r[0].toUpperCase() + r.slice(1);
          var a = d3["axis" + r]()
            .scale(t)
            .tickFormat(n);
          return "function" == typeof e.axisFormat && e.axisFormat(a), a;
        });
    },
    function(t, e, r) {
      var n = r(15);
      t.exports = function(t, e, r) {
        function a() {
          var c = n() - u;
          c < e && c > 0
            ? (o = setTimeout(a, e - c))
            : ((o = null), r || ((s = t.apply(l, i)), o || (l = i = null)));
        }
        var o, i, l, u, s;
        return (
          null == e && (e = 100),
          function() {
            (l = this), (i = arguments), (u = n());
            var c = r && !o;
            return (
              o || (o = setTimeout(a, e)),
              c && ((s = t.apply(l, i)), (l = i = null)),
              s
            );
          }
        );
      };
    },
    function(t, e) {
      function r() {
        return new Date().getTime();
      }
      t.exports = Date.now || r;
    },
    function(t, e) {
      var r;
      r = (function() {
        return this;
      })();
      try {
        r = r || Function("return this")() || (0, eval)("this");
      } catch (t) {
        "object" == typeof window && (r = window);
      }
      t.exports = r;
    }
  ]);
});
//# sourceMappingURL=eventDrops.js.map
