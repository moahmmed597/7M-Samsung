function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != _typeof(t) || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
(function () {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = function __commonJS(cb, mod) {
    return function __require() {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
        exports: {}
      }).exports, mod), mod.exports;
    };
  };
  var __copyProps = function __copyProps(to, from, except, desc) {
    if (from && _typeof(from) === "object" || typeof from === "function") {
      var _iterator = _createForOfIteratorHelper(__getOwnPropNames(from)),
        _step;
      try {
        var _loop = function _loop() {
          var key3 = _step.value;
          if (!__hasOwnProp.call(to, key3) && key3 !== except) __defProp(to, key3, {
            get: function get() {
              return from[key3];
            },
            enumerable: !(desc = __getOwnPropDesc(from, key3)) || desc.enumerable
          });
        };
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return to;
  };
  var __toESM = function __toESM(mod, isNodeMode, target) {
    return target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
      value: mod,
      enumerable: true
    }) : target, mod);
  };

  // node_modules/core-js/internals/global-this.js
  var require_global_this = __commonJS({
    "node_modules/core-js/internals/global-this.js": function node_modules_coreJs_internals_globalThisJs(exports, module) {
      "use strict";

      var check3 = function check3(it) {
        return it && it.Math === Math && it;
      };
      module.exports =
      // eslint-disable-next-line es/no-global-this -- safe
      check3((typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) == "object" && globalThis) || check3((typeof window === "undefined" ? "undefined" : _typeof(window)) == "object" && window) ||
      // eslint-disable-next-line no-restricted-globals -- safe
      check3((typeof self === "undefined" ? "undefined" : _typeof(self)) == "object" && self) || check3((typeof global === "undefined" ? "undefined" : _typeof(global)) == "object" && global) || check3(_typeof(exports) == "object" && exports) ||
      // eslint-disable-next-line no-new-func -- fallback
      /* @__PURE__ */
      function () {
        return this;
      }() || Function("return this")();
    }
  });

  // node_modules/core-js/internals/fails.js
  var require_fails = __commonJS({
    "node_modules/core-js/internals/fails.js": function node_modules_coreJs_internals_failsJs(exports, module) {
      "use strict";

      module.exports = function (exec) {
        try {
          return !!exec();
        } catch (error) {
          return true;
        }
      };
    }
  });

  // node_modules/core-js/internals/descriptors.js
  var require_descriptors = __commonJS({
    "node_modules/core-js/internals/descriptors.js": function node_modules_coreJs_internals_descriptorsJs(exports, module) {
      "use strict";

      var fails = require_fails();
      module.exports = !fails(function () {
        return Object.defineProperty({}, 1, {
          get: function get() {
            return 7;
          }
        })[1] !== 7;
      });
    }
  });

  // node_modules/core-js/internals/function-bind-native.js
  var require_function_bind_native = __commonJS({
    "node_modules/core-js/internals/function-bind-native.js": function node_modules_coreJs_internals_functionBindNativeJs(exports, module) {
      "use strict";

      var fails = require_fails();
      module.exports = !fails(function () {
        var test = function () {}.bind();
        return typeof test != "function" || test.hasOwnProperty("prototype");
      });
    }
  });

  // node_modules/core-js/internals/function-call.js
  var require_function_call = __commonJS({
    "node_modules/core-js/internals/function-call.js": function node_modules_coreJs_internals_functionCallJs(exports, module) {
      "use strict";

      var NATIVE_BIND = require_function_bind_native();
      var call4 = Function.prototype.call;
      module.exports = NATIVE_BIND ? call4.bind(call4) : function () {
        return call4.apply(call4, arguments);
      };
    }
  });

  // node_modules/core-js/internals/object-property-is-enumerable.js
  var require_object_property_is_enumerable = __commonJS({
    "node_modules/core-js/internals/object-property-is-enumerable.js": function node_modules_coreJs_internals_objectPropertyIsEnumerableJs(exports) {
      "use strict";

      var $propertyIsEnumerable = {}.propertyIsEnumerable;
      var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({
        1: 2
      }, 1);
      exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
        var descriptor = getOwnPropertyDescriptor(this, V);
        return !!descriptor && descriptor.enumerable;
      } : $propertyIsEnumerable;
    }
  });

  // node_modules/core-js/internals/create-property-descriptor.js
  var require_create_property_descriptor = __commonJS({
    "node_modules/core-js/internals/create-property-descriptor.js": function node_modules_coreJs_internals_createPropertyDescriptorJs(exports, module) {
      "use strict";

      module.exports = function (bitmap, value) {
        return {
          enumerable: !(bitmap & 1),
          configurable: !(bitmap & 2),
          writable: !(bitmap & 4),
          value: value
        };
      };
    }
  });

  // node_modules/core-js/internals/function-uncurry-this.js
  var require_function_uncurry_this = __commonJS({
    "node_modules/core-js/internals/function-uncurry-this.js": function node_modules_coreJs_internals_functionUncurryThisJs(exports, module) {
      "use strict";

      var NATIVE_BIND = require_function_bind_native();
      var FunctionPrototype = Function.prototype;
      var call4 = FunctionPrototype.call;
      var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call4, call4);
      module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
        return function () {
          return call4.apply(fn, arguments);
        };
      };
    }
  });

  // node_modules/core-js/internals/classof-raw.js
  var require_classof_raw = __commonJS({
    "node_modules/core-js/internals/classof-raw.js": function node_modules_coreJs_internals_classofRawJs(exports, module) {
      "use strict";

      var uncurryThis = require_function_uncurry_this();
      var toString = uncurryThis({}.toString);
      var stringSlice = uncurryThis("".slice);
      module.exports = function (it) {
        return stringSlice(toString(it), 8, -1);
      };
    }
  });

  // node_modules/core-js/internals/indexed-object.js
  var require_indexed_object = __commonJS({
    "node_modules/core-js/internals/indexed-object.js": function node_modules_coreJs_internals_indexedObjectJs(exports, module) {
      "use strict";

      var uncurryThis = require_function_uncurry_this();
      var fails = require_fails();
      var classof = require_classof_raw();
      var $Object = Object;
      var split = uncurryThis("".split);
      module.exports = fails(function () {
        return !$Object("z").propertyIsEnumerable(0);
      }) ? function (it) {
        return classof(it) === "String" ? split(it, "") : $Object(it);
      } : $Object;
    }
  });

  // node_modules/core-js/internals/is-null-or-undefined.js
  var require_is_null_or_undefined = __commonJS({
    "node_modules/core-js/internals/is-null-or-undefined.js": function node_modules_coreJs_internals_isNullOrUndefinedJs(exports, module) {
      "use strict";

      module.exports = function (it) {
        return it === null || it === void 0;
      };
    }
  });

  // node_modules/core-js/internals/require-object-coercible.js
  var require_require_object_coercible = __commonJS({
    "node_modules/core-js/internals/require-object-coercible.js": function node_modules_coreJs_internals_requireObjectCoercibleJs(exports, module) {
      "use strict";

      var isNullOrUndefined = require_is_null_or_undefined();
      var $TypeError = TypeError;
      module.exports = function (it) {
        if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
        return it;
      };
    }
  });

  // node_modules/core-js/internals/to-indexed-object.js
  var require_to_indexed_object = __commonJS({
    "node_modules/core-js/internals/to-indexed-object.js": function node_modules_coreJs_internals_toIndexedObjectJs(exports, module) {
      "use strict";

      var IndexedObject = require_indexed_object();
      var requireObjectCoercible = require_require_object_coercible();
      module.exports = function (it) {
        return IndexedObject(requireObjectCoercible(it));
      };
    }
  });

  // node_modules/core-js/internals/is-callable.js
  var require_is_callable = __commonJS({
    "node_modules/core-js/internals/is-callable.js": function node_modules_coreJs_internals_isCallableJs(exports, module) {
      "use strict";

      var documentAll = (typeof document === "undefined" ? "undefined" : _typeof(document)) == "object" && document.all;
      module.exports = typeof documentAll == "undefined" && documentAll !== void 0 ? function (argument) {
        return typeof argument == "function" || argument === documentAll;
      } : function (argument) {
        return typeof argument == "function";
      };
    }
  });

  // node_modules/core-js/internals/is-object.js
  var require_is_object = __commonJS({
    "node_modules/core-js/internals/is-object.js": function node_modules_coreJs_internals_isObjectJs(exports, module) {
      "use strict";

      var isCallable = require_is_callable();
      module.exports = function (it) {
        return _typeof(it) == "object" ? it !== null : isCallable(it);
      };
    }
  });

  // node_modules/core-js/internals/get-built-in.js
  var require_get_built_in = __commonJS({
    "node_modules/core-js/internals/get-built-in.js": function node_modules_coreJs_internals_getBuiltInJs(exports, module) {
      "use strict";

      var globalThis2 = require_global_this();
      var isCallable = require_is_callable();
      var aFunction = function aFunction(argument) {
        return isCallable(argument) ? argument : void 0;
      };
      module.exports = function (namespace, method) {
        return arguments.length < 2 ? aFunction(globalThis2[namespace]) : globalThis2[namespace] && globalThis2[namespace][method];
      };
    }
  });

  // node_modules/core-js/internals/object-is-prototype-of.js
  var require_object_is_prototype_of = __commonJS({
    "node_modules/core-js/internals/object-is-prototype-of.js": function node_modules_coreJs_internals_objectIsPrototypeOfJs(exports, module) {
      "use strict";

      var uncurryThis = require_function_uncurry_this();
      module.exports = uncurryThis({}.isPrototypeOf);
    }
  });

  // node_modules/core-js/internals/environment-user-agent.js
  var require_environment_user_agent = __commonJS({
    "node_modules/core-js/internals/environment-user-agent.js": function node_modules_coreJs_internals_environmentUserAgentJs(exports, module) {
      "use strict";

      var globalThis2 = require_global_this();
      var navigator2 = globalThis2.navigator;
      var userAgent = navigator2 && navigator2.userAgent;
      module.exports = userAgent ? String(userAgent) : "";
    }
  });

  // node_modules/core-js/internals/environment-v8-version.js
  var require_environment_v8_version = __commonJS({
    "node_modules/core-js/internals/environment-v8-version.js": function node_modules_coreJs_internals_environmentV8VersionJs(exports, module) {
      "use strict";

      var globalThis2 = require_global_this();
      var userAgent = require_environment_user_agent();
      var process = globalThis2.process;
      var Deno = globalThis2.Deno;
      var versions = process && process.versions || Deno && Deno.version;
      var v8 = versions && versions.v8;
      var match;
      var version;
      if (v8) {
        match = v8.split(".");
        version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
      }
      if (!version && userAgent) {
        match = userAgent.match(/Edge\/(\d+)/);
        if (!match || match[1] >= 74) {
          match = userAgent.match(/Chrome\/(\d+)/);
          if (match) version = +match[1];
        }
      }
      module.exports = version;
    }
  });

  // node_modules/core-js/internals/symbol-constructor-detection.js
  var require_symbol_constructor_detection = __commonJS({
    "node_modules/core-js/internals/symbol-constructor-detection.js": function node_modules_coreJs_internals_symbolConstructorDetectionJs(exports, module) {
      "use strict";

      var V8_VERSION = require_environment_v8_version();
      var fails = require_fails();
      var globalThis2 = require_global_this();
      var $String = globalThis2.String;
      module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
        var symbol = Symbol("symbol detection");
        return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
        // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
        !Symbol.sham && V8_VERSION && V8_VERSION < 41;
      });
    }
  });

  // node_modules/core-js/internals/use-symbol-as-uid.js
  var require_use_symbol_as_uid = __commonJS({
    "node_modules/core-js/internals/use-symbol-as-uid.js": function node_modules_coreJs_internals_useSymbolAsUidJs(exports, module) {
      "use strict";

      var NATIVE_SYMBOL = require_symbol_constructor_detection();
      module.exports = NATIVE_SYMBOL && !Symbol.sham && _typeof(Symbol.iterator) == "symbol";
    }
  });

  // node_modules/core-js/internals/is-symbol.js
  var require_is_symbol = __commonJS({
    "node_modules/core-js/internals/is-symbol.js": function node_modules_coreJs_internals_isSymbolJs(exports, module) {
      "use strict";

      var getBuiltIn = require_get_built_in();
      var isCallable = require_is_callable();
      var isPrototypeOf = require_object_is_prototype_of();
      var USE_SYMBOL_AS_UID = require_use_symbol_as_uid();
      var $Object = Object;
      module.exports = USE_SYMBOL_AS_UID ? function (it) {
        return _typeof(it) == "symbol";
      } : function (it) {
        var $Symbol = getBuiltIn("Symbol");
        return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
      };
    }
  });

  // node_modules/core-js/internals/try-to-string.js
  var require_try_to_string = __commonJS({
    "node_modules/core-js/internals/try-to-string.js": function node_modules_coreJs_internals_tryToStringJs(exports, module) {
      "use strict";

      var $String = String;
      module.exports = function (argument) {
        try {
          return $String(argument);
        } catch (error) {
          return "Object";
        }
      };
    }
  });

  // node_modules/core-js/internals/a-callable.js
  var require_a_callable = __commonJS({
    "node_modules/core-js/internals/a-callable.js": function node_modules_coreJs_internals_aCallableJs(exports, module) {
      "use strict";

      var isCallable = require_is_callable();
      var tryToString = require_try_to_string();
      var $TypeError = TypeError;
      module.exports = function (argument) {
        if (isCallable(argument)) return argument;
        throw new $TypeError(tryToString(argument) + " is not a function");
      };
    }
  });

  // node_modules/core-js/internals/get-method.js
  var require_get_method = __commonJS({
    "node_modules/core-js/internals/get-method.js": function node_modules_coreJs_internals_getMethodJs(exports, module) {
      "use strict";

      var aCallable = require_a_callable();
      var isNullOrUndefined = require_is_null_or_undefined();
      module.exports = function (V, P) {
        var func = V[P];
        return isNullOrUndefined(func) ? void 0 : aCallable(func);
      };
    }
  });

  // node_modules/core-js/internals/ordinary-to-primitive.js
  var require_ordinary_to_primitive = __commonJS({
    "node_modules/core-js/internals/ordinary-to-primitive.js": function node_modules_coreJs_internals_ordinaryToPrimitiveJs(exports, module) {
      "use strict";

      var call4 = require_function_call();
      var isCallable = require_is_callable();
      var isObject = require_is_object();
      var $TypeError = TypeError;
      module.exports = function (input, pref) {
        var fn, val;
        if (pref === "string" && isCallable(fn = input.toString) && !isObject(val = call4(fn, input))) return val;
        if (isCallable(fn = input.valueOf) && !isObject(val = call4(fn, input))) return val;
        if (pref !== "string" && isCallable(fn = input.toString) && !isObject(val = call4(fn, input))) return val;
        throw new $TypeError("Can't convert object to primitive value");
      };
    }
  });

  // node_modules/core-js/internals/is-pure.js
  var require_is_pure = __commonJS({
    "node_modules/core-js/internals/is-pure.js": function node_modules_coreJs_internals_isPureJs(exports, module) {
      "use strict";

      module.exports = false;
    }
  });

  // node_modules/core-js/internals/define-global-property.js
  var require_define_global_property = __commonJS({
    "node_modules/core-js/internals/define-global-property.js": function node_modules_coreJs_internals_defineGlobalPropertyJs(exports, module) {
      "use strict";

      var globalThis2 = require_global_this();
      var defineProperty = Object.defineProperty;
      module.exports = function (key3, value) {
        try {
          defineProperty(globalThis2, key3, {
            value: value,
            configurable: true,
            writable: true
          });
        } catch (error) {
          globalThis2[key3] = value;
        }
        return value;
      };
    }
  });

  // node_modules/core-js/internals/shared-store.js
  var require_shared_store = __commonJS({
    "node_modules/core-js/internals/shared-store.js": function node_modules_coreJs_internals_sharedStoreJs(exports, module) {
      "use strict";

      var IS_PURE = require_is_pure();
      var globalThis2 = require_global_this();
      var defineGlobalProperty = require_define_global_property();
      var SHARED = "__core-js_shared__";
      var store = module.exports = globalThis2[SHARED] || defineGlobalProperty(SHARED, {});
      (store.versions || (store.versions = [])).push({
        version: "3.50.0",
        mode: IS_PURE ? "pure" : "global",
        copyright: "© 2013–2025 Denis Pushkarev (zloirock.ru), 2025–2026 CoreJS Company (core-js.io). All rights reserved.",
        license: "https://github.com/zloirock/core-js/blob/v3.50.0/LICENSE",
        source: "https://github.com/zloirock/core-js"
      });
    }
  });

  // node_modules/core-js/internals/shared.js
  var require_shared = __commonJS({
    "node_modules/core-js/internals/shared.js": function node_modules_coreJs_internals_sharedJs(exports, module) {
      "use strict";

      var store = require_shared_store();
      var create2 = Object.create || Object;
      module.exports = function (key3, value) {
        return store[key3] || (store[key3] = value || create2(null));
      };
    }
  });

  // node_modules/core-js/internals/to-object.js
  var require_to_object = __commonJS({
    "node_modules/core-js/internals/to-object.js": function node_modules_coreJs_internals_toObjectJs(exports, module) {
      "use strict";

      var requireObjectCoercible = require_require_object_coercible();
      var $Object = Object;
      module.exports = function (argument) {
        return $Object(requireObjectCoercible(argument));
      };
    }
  });

  // node_modules/core-js/internals/has-own-property.js
  var require_has_own_property = __commonJS({
    "node_modules/core-js/internals/has-own-property.js": function node_modules_coreJs_internals_hasOwnPropertyJs(exports, module) {
      "use strict";

      var uncurryThis = require_function_uncurry_this();
      var toObject = require_to_object();
      var hasOwnProperty = uncurryThis({}.hasOwnProperty);
      module.exports = Object.hasOwn || function hasOwn(it, key3) {
        return hasOwnProperty(toObject(it), key3);
      };
    }
  });

  // node_modules/core-js/internals/uid.js
  var require_uid = __commonJS({
    "node_modules/core-js/internals/uid.js": function node_modules_coreJs_internals_uidJs(exports, module) {
      "use strict";

      var uncurryThis = require_function_uncurry_this();
      var id = 0;
      var postfix = Math.random();
      var toString = uncurryThis(1.1.toString);
      module.exports = function (key3) {
        return "Symbol(" + (key3 === void 0 ? "" : key3) + ")_" + toString(++id + postfix, 36);
      };
    }
  });

  // node_modules/core-js/internals/well-known-symbol.js
  var require_well_known_symbol = __commonJS({
    "node_modules/core-js/internals/well-known-symbol.js": function node_modules_coreJs_internals_wellKnownSymbolJs(exports, module) {
      "use strict";

      var globalThis2 = require_global_this();
      var shared = require_shared();
      var hasOwn = require_has_own_property();
      var uid = require_uid();
      var NATIVE_SYMBOL = require_symbol_constructor_detection();
      var USE_SYMBOL_AS_UID = require_use_symbol_as_uid();
      var Symbol2 = globalThis2.Symbol;
      var WellKnownSymbolsStore = shared("wks");
      var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol2["for"] || Symbol2 : Symbol2 && Symbol2.withoutSetter || uid;
      module.exports = function (name) {
        if (!hasOwn(WellKnownSymbolsStore, name)) {
          WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol2, name) ? Symbol2[name] : createWellKnownSymbol("Symbol." + name);
        }
        return WellKnownSymbolsStore[name];
      };
    }
  });

  // node_modules/core-js/internals/to-primitive.js
  var require_to_primitive = __commonJS({
    "node_modules/core-js/internals/to-primitive.js": function node_modules_coreJs_internals_toPrimitiveJs(exports, module) {
      "use strict";

      var call4 = require_function_call();
      var isObject = require_is_object();
      var isSymbol = require_is_symbol();
      var getMethod = require_get_method();
      var ordinaryToPrimitive = require_ordinary_to_primitive();
      var wellKnownSymbol = require_well_known_symbol();
      var $TypeError = TypeError;
      var TO_PRIMITIVE = wellKnownSymbol("toPrimitive");
      module.exports = function (input, pref) {
        if (!isObject(input) || isSymbol(input)) return input;
        var exoticToPrim = getMethod(input, TO_PRIMITIVE);
        var result;
        if (exoticToPrim) {
          if (pref === void 0) pref = "default";
          result = call4(exoticToPrim, input, pref);
          if (!isObject(result) || isSymbol(result)) return result;
          throw new $TypeError("Can't convert object to primitive value");
        }
        if (pref === void 0) pref = "number";
        return ordinaryToPrimitive(input, pref);
      };
    }
  });

  // node_modules/core-js/internals/to-property-key.js
  var require_to_property_key = __commonJS({
    "node_modules/core-js/internals/to-property-key.js": function node_modules_coreJs_internals_toPropertyKeyJs(exports, module) {
      "use strict";

      var toPrimitive = require_to_primitive();
      var isSymbol = require_is_symbol();
      module.exports = function (argument) {
        var key3 = toPrimitive(argument, "string");
        return isSymbol(key3) ? key3 : key3 + "";
      };
    }
  });

  // node_modules/core-js/internals/document-create-element.js
  var require_document_create_element = __commonJS({
    "node_modules/core-js/internals/document-create-element.js": function node_modules_coreJs_internals_documentCreateElementJs(exports, module) {
      "use strict";

      var globalThis2 = require_global_this();
      var isObject = require_is_object();
      var document2 = globalThis2.document;
      var EXISTS = isObject(document2) && isObject(document2.createElement);
      module.exports = function (it) {
        return EXISTS ? document2.createElement(it) : {};
      };
    }
  });

  // node_modules/core-js/internals/ie8-dom-define.js
  var require_ie8_dom_define = __commonJS({
    "node_modules/core-js/internals/ie8-dom-define.js": function node_modules_coreJs_internals_ie8DomDefineJs(exports, module) {
      "use strict";

      var DESCRIPTORS = require_descriptors();
      var fails = require_fails();
      var createElement = require_document_create_element();
      module.exports = !DESCRIPTORS && !fails(function () {
        return Object.defineProperty(createElement("div"), "a", {
          get: function get() {
            return 7;
          }
        }).a !== 7;
      });
    }
  });

  // node_modules/core-js/internals/object-get-own-property-descriptor.js
  var require_object_get_own_property_descriptor = __commonJS({
    "node_modules/core-js/internals/object-get-own-property-descriptor.js": function node_modules_coreJs_internals_objectGetOwnPropertyDescriptorJs(exports) {
      "use strict";

      var DESCRIPTORS = require_descriptors();
      var call4 = require_function_call();
      var propertyIsEnumerableModule = require_object_property_is_enumerable();
      var createPropertyDescriptor = require_create_property_descriptor();
      var toIndexedObject = require_to_indexed_object();
      var toPropertyKey = require_to_property_key();
      var hasOwn = require_has_own_property();
      var IE8_DOM_DEFINE = require_ie8_dom_define();
      var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
        O = toIndexedObject(O);
        P = toPropertyKey(P);
        if (IE8_DOM_DEFINE) try {
          return $getOwnPropertyDescriptor(O, P);
        } catch (error) {}
        if (hasOwn(O, P)) return createPropertyDescriptor(!call4(propertyIsEnumerableModule.f, O, P), O[P]);
      };
    }
  });

  // node_modules/core-js/internals/v8-prototype-define-bug.js
  var require_v8_prototype_define_bug = __commonJS({
    "node_modules/core-js/internals/v8-prototype-define-bug.js": function node_modules_coreJs_internals_v8PrototypeDefineBugJs(exports, module) {
      "use strict";

      var DESCRIPTORS = require_descriptors();
      var fails = require_fails();
      module.exports = DESCRIPTORS && fails(function () {
        return Object.defineProperty(function () {}, "prototype", {
          value: 42,
          writable: false
        }).prototype !== 42;
      });
    }
  });

  // node_modules/core-js/internals/an-object.js
  var require_an_object = __commonJS({
    "node_modules/core-js/internals/an-object.js": function node_modules_coreJs_internals_anObjectJs(exports, module) {
      "use strict";

      var isObject = require_is_object();
      var $String = String;
      var $TypeError = TypeError;
      module.exports = function (argument) {
        if (isObject(argument)) return argument;
        throw new $TypeError($String(argument) + " is not an object");
      };
    }
  });

  // node_modules/core-js/internals/object-define-property.js
  var require_object_define_property = __commonJS({
    "node_modules/core-js/internals/object-define-property.js": function node_modules_coreJs_internals_objectDefinePropertyJs(exports) {
      "use strict";

      var DESCRIPTORS = require_descriptors();
      var IE8_DOM_DEFINE = require_ie8_dom_define();
      var V8_PROTOTYPE_DEFINE_BUG = require_v8_prototype_define_bug();
      var anObject = require_an_object();
      var toPropertyKey = require_to_property_key();
      var $TypeError = TypeError;
      var $defineProperty = Object.defineProperty;
      var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      var ENUMERABLE = "enumerable";
      var CONFIGURABLE = "configurable";
      var WRITABLE = "writable";
      exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
        anObject(O);
        P = toPropertyKey(P);
        anObject(Attributes);
        if (typeof O === "function" && P === "prototype" && "value" in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
          var current3 = $getOwnPropertyDescriptor(O, P);
          if (current3 && current3[WRITABLE]) {
            O[P] = Attributes.value;
            Attributes = {
              configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current3[CONFIGURABLE],
              enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current3[ENUMERABLE],
              writable: false
            };
          }
        }
        return $defineProperty(O, P, Attributes);
      } : $defineProperty : function defineProperty(O, P, Attributes) {
        anObject(O);
        P = toPropertyKey(P);
        anObject(Attributes);
        if (IE8_DOM_DEFINE) try {
          return $defineProperty(O, P, Attributes);
        } catch (error) {}
        if ("get" in Attributes || "set" in Attributes) throw new $TypeError("Accessors not supported");
        if ("value" in Attributes) O[P] = Attributes.value;
        return O;
      };
    }
  });

  // node_modules/core-js/internals/create-non-enumerable-property.js
  var require_create_non_enumerable_property = __commonJS({
    "node_modules/core-js/internals/create-non-enumerable-property.js": function node_modules_coreJs_internals_createNonEnumerablePropertyJs(exports, module) {
      "use strict";

      var DESCRIPTORS = require_descriptors();
      var definePropertyModule = require_object_define_property();
      var createPropertyDescriptor = require_create_property_descriptor();
      module.exports = DESCRIPTORS ? function (object, key3, value) {
        return definePropertyModule.f(object, key3, createPropertyDescriptor(1, value));
      } : function (object, key3, value) {
        object[key3] = value;
        return object;
      };
    }
  });

  // node_modules/core-js/internals/function-name.js
  var require_function_name = __commonJS({
    "node_modules/core-js/internals/function-name.js": function node_modules_coreJs_internals_functionNameJs(exports, module) {
      "use strict";

      var DESCRIPTORS = require_descriptors();
      var hasOwn = require_has_own_property();
      var FunctionPrototype = Function.prototype;
      var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;
      var EXISTS = hasOwn(FunctionPrototype, "name");
      var PROPER = EXISTS && function something() {}.name === "something";
      var CONFIGURABLE = EXISTS && (!DESCRIPTORS || DESCRIPTORS && getDescriptor(FunctionPrototype, "name").configurable);
      module.exports = {
        EXISTS: EXISTS,
        PROPER: PROPER,
        CONFIGURABLE: CONFIGURABLE
      };
    }
  });

  // node_modules/core-js/internals/inspect-source.js
  var require_inspect_source = __commonJS({
    "node_modules/core-js/internals/inspect-source.js": function node_modules_coreJs_internals_inspectSourceJs(exports, module) {
      "use strict";

      var uncurryThis = require_function_uncurry_this();
      var isCallable = require_is_callable();
      var store = require_shared_store();
      var functionToString = uncurryThis(Function.toString);
      if (!isCallable(store.inspectSource)) {
        store.inspectSource = function (it) {
          return functionToString(it);
        };
      }
      module.exports = store.inspectSource;
    }
  });

  // node_modules/core-js/internals/weak-map-basic-detection.js
  var require_weak_map_basic_detection = __commonJS({
    "node_modules/core-js/internals/weak-map-basic-detection.js": function node_modules_coreJs_internals_weakMapBasicDetectionJs(exports, module) {
      "use strict";

      var globalThis2 = require_global_this();
      var isCallable = require_is_callable();
      var WeakMap = globalThis2.WeakMap;
      module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));
    }
  });

  // node_modules/core-js/internals/shared-key.js
  var require_shared_key = __commonJS({
    "node_modules/core-js/internals/shared-key.js": function node_modules_coreJs_internals_sharedKeyJs(exports, module) {
      "use strict";

      var shared = require_shared();
      var uid = require_uid();
      var keys2 = shared("keys");
      module.exports = function (key3) {
        return keys2[key3] || (keys2[key3] = uid(key3));
      };
    }
  });

  // node_modules/core-js/internals/hidden-keys.js
  var require_hidden_keys = __commonJS({
    "node_modules/core-js/internals/hidden-keys.js": function node_modules_coreJs_internals_hiddenKeysJs(exports, module) {
      "use strict";

      module.exports = {};
    }
  });

  // node_modules/core-js/internals/internal-state.js
  var require_internal_state = __commonJS({
    "node_modules/core-js/internals/internal-state.js": function node_modules_coreJs_internals_internalStateJs(exports, module) {
      "use strict";

      var NATIVE_WEAK_MAP = require_weak_map_basic_detection();
      var globalThis2 = require_global_this();
      var isObject = require_is_object();
      var createNonEnumerableProperty = require_create_non_enumerable_property();
      var hasOwn = require_has_own_property();
      var shared = require_shared_store();
      var sharedKey = require_shared_key();
      var hiddenKeys = require_hidden_keys();
      var OBJECT_ALREADY_INITIALIZED = "Object already initialized";
      var TypeError2 = globalThis2.TypeError;
      var WeakMap = globalThis2.WeakMap;
      var set2;
      var get2;
      var has;
      var enforce = function enforce(it) {
        return has(it) ? get2(it) : set2(it, {});
      };
      var getterFor = function getterFor(TYPE) {
        return function (it) {
          var state;
          if (!isObject(it) || (state = get2(it)).type !== TYPE) {
            throw new TypeError2("Incompatible receiver, " + TYPE + " required");
          }
          return state;
        };
      };
      if (NATIVE_WEAK_MAP || shared.state) {
        store = shared.state || (shared.state = new WeakMap());
        store.get = store.get;
        store.has = store.has;
        store.set = store.set;
        set2 = function set2(it, metadata) {
          if (store.has(it)) throw new TypeError2(OBJECT_ALREADY_INITIALIZED);
          metadata.facade = it;
          store.set(it, metadata);
          return metadata;
        };
        get2 = function get2(it) {
          return store.get(it) || {};
        };
        has = function has(it) {
          return store.has(it);
        };
      } else {
        STATE = sharedKey("state");
        hiddenKeys[STATE] = true;
        set2 = function set2(it, metadata) {
          if (hasOwn(it, STATE)) throw new TypeError2(OBJECT_ALREADY_INITIALIZED);
          metadata.facade = it;
          createNonEnumerableProperty(it, STATE, metadata);
          return metadata;
        };
        get2 = function get2(it) {
          return hasOwn(it, STATE) ? it[STATE] : {};
        };
        has = function has(it) {
          return hasOwn(it, STATE);
        };
      }
      var store;
      var STATE;
      module.exports = {
        set: set2,
        get: get2,
        has: has,
        enforce: enforce,
        getterFor: getterFor
      };
    }
  });

  // node_modules/core-js/internals/make-built-in.js
  var require_make_built_in = __commonJS({
    "node_modules/core-js/internals/make-built-in.js": function node_modules_coreJs_internals_makeBuiltInJs(exports, module) {
      "use strict";

      var uncurryThis = require_function_uncurry_this();
      var fails = require_fails();
      var isCallable = require_is_callable();
      var hasOwn = require_has_own_property();
      var DESCRIPTORS = require_descriptors();
      var CONFIGURABLE_FUNCTION_NAME = require_function_name().CONFIGURABLE;
      var inspectSource = require_inspect_source();
      var InternalStateModule = require_internal_state();
      var enforceInternalState = InternalStateModule.enforce;
      var getInternalState = InternalStateModule.get;
      var $String = String;
      var defineProperty = Object.defineProperty;
      var stringSlice = uncurryThis("".slice);
      var replace = uncurryThis("".replace);
      var join = uncurryThis([].join);
      var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
        return defineProperty(function () {}, "length", {
          value: 8
        }).length !== 8;
      });
      var TEMPLATE = String(String).split("String");
      var makeBuiltIn = module.exports = function (value, name, options) {
        if (stringSlice($String(name), 0, 7) === "Symbol(") {
          name = "[" + replace($String(name), /^Symbol\(([^)]*)\).*$/, "$1") + "]";
        }
        if (options && options.getter) name = "get " + name;
        if (options && options.setter) name = "set " + name;
        if (!hasOwn(value, "name") || CONFIGURABLE_FUNCTION_NAME && value.name !== name) {
          if (DESCRIPTORS) defineProperty(value, "name", {
            value: name,
            configurable: true
          });else value.name = name;
        }
        if (CONFIGURABLE_LENGTH && options && hasOwn(options, "arity") && value.length !== options.arity) {
          defineProperty(value, "length", {
            value: options.arity
          });
        }
        try {
          if (options && hasOwn(options, "constructor") && options.constructor) {
            if (DESCRIPTORS) defineProperty(value, "prototype", {
              writable: false
            });
          } else if (value.prototype) value.prototype = void 0;
        } catch (error) {}
        var state = enforceInternalState(value);
        if (!hasOwn(state, "source")) {
          state.source = join(TEMPLATE, typeof name == "string" ? name : "");
        }
        return value;
      };
      Function.prototype.toString = makeBuiltIn(function toString() {
        return isCallable(this) && getInternalState(this).source || inspectSource(this);
      }, "toString");
    }
  });

  // node_modules/core-js/internals/define-built-in.js
  var require_define_built_in = __commonJS({
    "node_modules/core-js/internals/define-built-in.js": function node_modules_coreJs_internals_defineBuiltInJs(exports, module) {
      "use strict";

      var isCallable = require_is_callable();
      var definePropertyModule = require_object_define_property();
      var makeBuiltIn = require_make_built_in();
      var defineGlobalProperty = require_define_global_property();
      module.exports = function (O, key3, value, options) {
        if (!options) options = {};
        var simple = options.enumerable;
        var name = options.name !== void 0 ? options.name : key3;
        if (isCallable(value)) makeBuiltIn(value, name, options);
        if (options.global) {
          if (simple) O[key3] = value;else defineGlobalProperty(key3, value);
        } else {
          try {
            if (!options.unsafe) delete O[key3];else if (O[key3]) simple = true;
          } catch (error) {}
          if (simple) O[key3] = value;else definePropertyModule.f(O, key3, {
            value: value,
            enumerable: false,
            configurable: !options.nonConfigurable,
            writable: !options.nonWritable
          });
        }
        return O;
      };
    }
  });

  // node_modules/core-js/internals/math-trunc.js
  var require_math_trunc = __commonJS({
    "node_modules/core-js/internals/math-trunc.js": function node_modules_coreJs_internals_mathTruncJs(exports, module) {
      "use strict";

      var ceil = Math.ceil;
      var floor = Math.floor;
      module.exports = Math.trunc || function trunc(x) {
        var n = +x;
        return (n > 0 ? floor : ceil)(n);
      };
    }
  });

  // node_modules/core-js/internals/to-integer-or-infinity.js
  var require_to_integer_or_infinity = __commonJS({
    "node_modules/core-js/internals/to-integer-or-infinity.js": function node_modules_coreJs_internals_toIntegerOrInfinityJs(exports, module) {
      "use strict";

      var trunc = require_math_trunc();
      module.exports = function (argument) {
        var number = +argument;
        return number !== number || number === 0 ? 0 : trunc(number);
      };
    }
  });

  // node_modules/core-js/internals/to-absolute-index.js
  var require_to_absolute_index = __commonJS({
    "node_modules/core-js/internals/to-absolute-index.js": function node_modules_coreJs_internals_toAbsoluteIndexJs(exports, module) {
      "use strict";

      var toIntegerOrInfinity = require_to_integer_or_infinity();
      var max = Math.max;
      var min = Math.min;
      module.exports = function (index2, length) {
        var integer = toIntegerOrInfinity(index2);
        return integer < 0 ? max(integer + length, 0) : min(integer, length);
      };
    }
  });

  // node_modules/core-js/internals/to-length.js
  var require_to_length = __commonJS({
    "node_modules/core-js/internals/to-length.js": function node_modules_coreJs_internals_toLengthJs(exports, module) {
      "use strict";

      var toIntegerOrInfinity = require_to_integer_or_infinity();
      var min = Math.min;
      module.exports = function (argument) {
        var len = toIntegerOrInfinity(argument);
        return len > 0 ? min(len, 9007199254740991) : 0;
      };
    }
  });

  // node_modules/core-js/internals/length-of-array-like.js
  var require_length_of_array_like = __commonJS({
    "node_modules/core-js/internals/length-of-array-like.js": function node_modules_coreJs_internals_lengthOfArrayLikeJs(exports, module) {
      "use strict";

      var toLength = require_to_length();
      module.exports = function (obj) {
        return toLength(obj.length);
      };
    }
  });

  // node_modules/core-js/internals/array-includes.js
  var require_array_includes = __commonJS({
    "node_modules/core-js/internals/array-includes.js": function node_modules_coreJs_internals_arrayIncludesJs(exports, module) {
      "use strict";

      var toIndexedObject = require_to_indexed_object();
      var toAbsoluteIndex = require_to_absolute_index();
      var lengthOfArrayLike = require_length_of_array_like();
      var createMethod = function createMethod(IS_INCLUDES) {
        return function ($this, el, fromIndex) {
          var O = toIndexedObject($this);
          var length = lengthOfArrayLike(O);
          if (length === 0) return !IS_INCLUDES && -1;
          var index2 = toAbsoluteIndex(fromIndex, length);
          var value;
          if (IS_INCLUDES && el !== el) while (length > index2) {
            value = O[index2++];
            if (value !== value) return true;
          } else for (; length > index2; index2++) {
            if ((IS_INCLUDES || index2 in O) && O[index2] === el) return IS_INCLUDES || index2 || 0;
          }
          return !IS_INCLUDES && -1;
        };
      };
      module.exports = {
        // `Array.prototype.includes` method
        // https://tc39.es/ecma262/#sec-array.prototype.includes
        includes: createMethod(true),
        // `Array.prototype.indexOf` method
        // https://tc39.es/ecma262/#sec-array.prototype.indexof
        indexOf: createMethod(false)
      };
    }
  });

  // node_modules/core-js/internals/object-keys-internal.js
  var require_object_keys_internal = __commonJS({
    "node_modules/core-js/internals/object-keys-internal.js": function node_modules_coreJs_internals_objectKeysInternalJs(exports, module) {
      "use strict";

      var uncurryThis = require_function_uncurry_this();
      var hasOwn = require_has_own_property();
      var toIndexedObject = require_to_indexed_object();
      var indexOf = require_array_includes().indexOf;
      var hiddenKeys = require_hidden_keys();
      var push2 = uncurryThis([].push);
      module.exports = function (object, names) {
        var O = toIndexedObject(object);
        var i = 0;
        var result = [];
        var key3;
        for (key3 in O) !hasOwn(hiddenKeys, key3) && hasOwn(O, key3) && push2(result, key3);
        while (names.length > i) if (hasOwn(O, key3 = names[i++])) {
          ~indexOf(result, key3) || push2(result, key3);
        }
        return result;
      };
    }
  });

  // node_modules/core-js/internals/enum-bug-keys.js
  var require_enum_bug_keys = __commonJS({
    "node_modules/core-js/internals/enum-bug-keys.js": function node_modules_coreJs_internals_enumBugKeysJs(exports, module) {
      "use strict";

      module.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
    }
  });

  // node_modules/core-js/internals/object-get-own-property-names.js
  var require_object_get_own_property_names = __commonJS({
    "node_modules/core-js/internals/object-get-own-property-names.js": function node_modules_coreJs_internals_objectGetOwnPropertyNamesJs(exports) {
      "use strict";

      var internalObjectKeys = require_object_keys_internal();
      var enumBugKeys = require_enum_bug_keys();
      var hiddenKeys = enumBugKeys.concat("length", "prototype");
      exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
        return internalObjectKeys(O, hiddenKeys);
      };
    }
  });

  // node_modules/core-js/internals/object-get-own-property-symbols.js
  var require_object_get_own_property_symbols = __commonJS({
    "node_modules/core-js/internals/object-get-own-property-symbols.js": function node_modules_coreJs_internals_objectGetOwnPropertySymbolsJs(exports) {
      "use strict";

      exports.f = Object.getOwnPropertySymbols;
    }
  });

  // node_modules/core-js/internals/own-keys.js
  var require_own_keys = __commonJS({
    "node_modules/core-js/internals/own-keys.js": function node_modules_coreJs_internals_ownKeysJs(exports, module) {
      "use strict";

      var getBuiltIn = require_get_built_in();
      var uncurryThis = require_function_uncurry_this();
      var getOwnPropertyNamesModule = require_object_get_own_property_names();
      var getOwnPropertySymbolsModule = require_object_get_own_property_symbols();
      var anObject = require_an_object();
      var concat = uncurryThis([].concat);
      module.exports = getBuiltIn("Reflect", "ownKeys") || function ownKeys(it) {
        var keys2 = getOwnPropertyNamesModule.f(anObject(it));
        var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
        return getOwnPropertySymbols ? concat(keys2, getOwnPropertySymbols(it)) : keys2;
      };
    }
  });

  // node_modules/core-js/internals/copy-constructor-properties.js
  var require_copy_constructor_properties = __commonJS({
    "node_modules/core-js/internals/copy-constructor-properties.js": function node_modules_coreJs_internals_copyConstructorPropertiesJs(exports, module) {
      "use strict";

      var hasOwn = require_has_own_property();
      var ownKeys = require_own_keys();
      var getOwnPropertyDescriptorModule = require_object_get_own_property_descriptor();
      var definePropertyModule = require_object_define_property();
      module.exports = function (target, source, exceptions) {
        var keys2 = ownKeys(source);
        var defineProperty = definePropertyModule.f;
        var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
        for (var i = 0; i < keys2.length; i++) {
          var key3 = keys2[i];
          if (!hasOwn(target, key3) && !(exceptions && hasOwn(exceptions, key3))) {
            defineProperty(target, key3, getOwnPropertyDescriptor(source, key3));
          }
        }
      };
    }
  });

  // node_modules/core-js/internals/is-forced.js
  var require_is_forced = __commonJS({
    "node_modules/core-js/internals/is-forced.js": function node_modules_coreJs_internals_isForcedJs(exports, module) {
      "use strict";

      var fails = require_fails();
      var isCallable = require_is_callable();
      var replacement = /#|\.prototype\./;
      var isForced = function isForced(feature, detection) {
        var value = data[normalize3(feature)];
        return value === POLYFILL ? true : value === NATIVE ? false : isCallable(detection) ? fails(detection) : !!detection;
      };
      var normalize3 = isForced.normalize = function (string) {
        return String(string).replace(replacement, ".").toLowerCase();
      };
      var data = isForced.data = {};
      var NATIVE = isForced.NATIVE = "N";
      var POLYFILL = isForced.POLYFILL = "P";
      module.exports = isForced;
    }
  });

  // node_modules/core-js/internals/export.js
  var require_export = __commonJS({
    "node_modules/core-js/internals/export.js": function node_modules_coreJs_internals_exportJs(exports, module) {
      "use strict";

      var globalThis2 = require_global_this();
      var getOwnPropertyDescriptor = require_object_get_own_property_descriptor().f;
      var createNonEnumerableProperty = require_create_non_enumerable_property();
      var defineBuiltIn = require_define_built_in();
      var defineGlobalProperty = require_define_global_property();
      var copyConstructorProperties = require_copy_constructor_properties();
      var isForced = require_is_forced();
      module.exports = function (options, source) {
        var TARGET = options.target;
        var GLOBAL = options.global;
        var STATIC = options.stat;
        var FORCED, target, key3, targetProperty, sourceProperty, descriptor;
        if (GLOBAL) {
          target = globalThis2;
        } else if (STATIC) {
          target = globalThis2[TARGET] || defineGlobalProperty(TARGET, {});
        } else {
          target = globalThis2[TARGET] && globalThis2[TARGET].prototype;
        }
        if (target) for (key3 in source) {
          sourceProperty = source[key3];
          if (options.dontCallGetSet) {
            descriptor = getOwnPropertyDescriptor(target, key3);
            targetProperty = descriptor && descriptor.value;
          } else targetProperty = target[key3];
          FORCED = isForced(GLOBAL ? key3 : TARGET + (STATIC ? "." : "#") + key3, options.forced);
          if (!FORCED && targetProperty !== void 0) {
            if (_typeof(sourceProperty) == _typeof(targetProperty)) continue;
            copyConstructorProperties(sourceProperty, targetProperty);
          }
          if (options.sham || targetProperty && targetProperty.sham) {
            createNonEnumerableProperty(sourceProperty, "sham", true);
          }
          defineBuiltIn(target, key3, sourceProperty, options);
        }
      };
    }
  });

  // node_modules/core-js/internals/object-keys.js
  var require_object_keys = __commonJS({
    "node_modules/core-js/internals/object-keys.js": function node_modules_coreJs_internals_objectKeysJs(exports, module) {
      "use strict";

      var internalObjectKeys = require_object_keys_internal();
      var enumBugKeys = require_enum_bug_keys();
      module.exports = Object.keys || function keys2(O) {
        return internalObjectKeys(O, enumBugKeys);
      };
    }
  });

  // node_modules/core-js/internals/object-assign.js
  var require_object_assign = __commonJS({
    "node_modules/core-js/internals/object-assign.js": function node_modules_coreJs_internals_objectAssignJs(exports, module) {
      "use strict";

      var DESCRIPTORS = require_descriptors();
      var uncurryThis = require_function_uncurry_this();
      var call4 = require_function_call();
      var fails = require_fails();
      var objectKeys = require_object_keys();
      var getOwnPropertySymbolsModule = require_object_get_own_property_symbols();
      var propertyIsEnumerableModule = require_object_property_is_enumerable();
      var toObject = require_to_object();
      var IndexedObject = require_indexed_object();
      var $assign = Object.assign;
      var defineProperty = Object.defineProperty;
      var concat = uncurryThis([].concat);
      module.exports = !$assign || fails(function () {
        if (DESCRIPTORS && $assign({
          b: 1
        }, $assign(defineProperty({}, "a", {
          enumerable: true,
          get: function get() {
            defineProperty(this, "b", {
              value: 3,
              enumerable: false
            });
          }
        }), {
          b: 2
        })).b !== 1) return true;
        var A = {};
        var B = {};
        var symbol = Symbol("assign detection");
        var alphabet = "abcdefghijklmnopqrst";
        A[symbol] = 7;
        alphabet.split("").forEach(function (chr) {
          B[chr] = chr;
        });
        return $assign({}, A)[symbol] !== 7 || objectKeys($assign({}, B)).join("") !== alphabet;
      }) ? function assign(target, source) {
        var T = toObject(target);
        var argumentsLength = arguments.length;
        var index2 = 1;
        var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
        var propertyIsEnumerable = propertyIsEnumerableModule.f;
        while (argumentsLength > index2) {
          var S = IndexedObject(arguments[index2++]);
          var keys2 = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
          var length = keys2.length;
          var j = 0;
          var key3;
          while (length > j) {
            key3 = keys2[j++];
            if (!DESCRIPTORS || call4(propertyIsEnumerable, S, key3)) T[key3] = S[key3];
          }
        }
        return T;
      } : $assign;
    }
  });

  // node_modules/core-js/modules/es.object.assign.js
  var require_es_object_assign = __commonJS({
    "node_modules/core-js/modules/es.object.assign.js": function node_modules_coreJs_modules_esObjectAssignJs() {
      "use strict";

      var $ = require_export();
      var assign = require_object_assign();
      $({
        target: "Object",
        stat: true,
        arity: 2,
        forced: Object.assign !== assign
      }, {
        assign: assign
      });
    }
  });

  // node_modules/core-js/internals/path.js
  var require_path = __commonJS({
    "node_modules/core-js/internals/path.js": function node_modules_coreJs_internals_pathJs(exports, module) {
      "use strict";

      var globalThis2 = require_global_this();
      module.exports = globalThis2;
    }
  });

  // node_modules/core-js/es/object/assign.js
  var require_assign = __commonJS({
    "node_modules/core-js/es/object/assign.js": function node_modules_coreJs_es_object_assignJs(exports, module) {
      "use strict";

      require_es_object_assign();
      var path = require_path();
      module.exports = path.Object.assign;
    }
  });

  // node_modules/core-js/internals/correct-prototype-getter.js
  var require_correct_prototype_getter = __commonJS({
    "node_modules/core-js/internals/correct-prototype-getter.js": function node_modules_coreJs_internals_correctPrototypeGetterJs(exports, module) {
      "use strict";

      var fails = require_fails();
      module.exports = !fails(function () {
        function F() {}
        F.prototype.constructor = null;
        return Object.getPrototypeOf(new F()) !== F.prototype;
      });
    }
  });

  // node_modules/core-js/internals/object-get-prototype-of.js
  var require_object_get_prototype_of = __commonJS({
    "node_modules/core-js/internals/object-get-prototype-of.js": function node_modules_coreJs_internals_objectGetPrototypeOfJs(exports, module) {
      "use strict";

      var hasOwn = require_has_own_property();
      var isCallable = require_is_callable();
      var toObject = require_to_object();
      var sharedKey = require_shared_key();
      var CORRECT_PROTOTYPE_GETTER = require_correct_prototype_getter();
      var IE_PROTO = sharedKey("IE_PROTO");
      var $Object = Object;
      var ObjectPrototype = $Object.prototype;
      module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
        var object = toObject(O);
        if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
        var constructor = object.constructor;
        if (isCallable(constructor) && object instanceof constructor) {
          return constructor.prototype;
        }
        return object instanceof $Object ? ObjectPrototype : null;
      };
    }
  });

  // node_modules/core-js/internals/object-to-array.js
  var require_object_to_array = __commonJS({
    "node_modules/core-js/internals/object-to-array.js": function node_modules_coreJs_internals_objectToArrayJs(exports, module) {
      "use strict";

      var DESCRIPTORS = require_descriptors();
      var fails = require_fails();
      var uncurryThis = require_function_uncurry_this();
      var objectGetPrototypeOf = require_object_get_prototype_of();
      var objectKeys = require_object_keys();
      var toIndexedObject = require_to_indexed_object();
      var $propertyIsEnumerable = require_object_property_is_enumerable().f;
      var propertyIsEnumerable = uncurryThis($propertyIsEnumerable);
      var push2 = uncurryThis([].push);
      var IE_BUG = DESCRIPTORS && fails(function () {
        var O = /* @__PURE__ */Object.create(null);
        O[2] = 2;
        return !propertyIsEnumerable(O, 2);
      });
      var createMethod = function createMethod(TO_ENTRIES) {
        return function (it) {
          var O = toIndexedObject(it);
          var keys2 = objectKeys(O);
          var IE_WORKAROUND = IE_BUG && objectGetPrototypeOf(O) === null;
          var length = keys2.length;
          var i = 0;
          var result = [];
          var key3;
          while (length > i) {
            key3 = keys2[i++];
            if (!DESCRIPTORS || (IE_WORKAROUND ? key3 in O : propertyIsEnumerable(O, key3))) {
              push2(result, TO_ENTRIES ? [key3, O[key3]] : O[key3]);
            }
          }
          return result;
        };
      };
      module.exports = {
        // `Object.entries` method
        // https://tc39.es/ecma262/#sec-object.entries
        entries: createMethod(true),
        // `Object.values` method
        // https://tc39.es/ecma262/#sec-object.values
        values: createMethod(false)
      };
    }
  });

  // node_modules/core-js/modules/es.object.entries.js
  var require_es_object_entries = __commonJS({
    "node_modules/core-js/modules/es.object.entries.js": function node_modules_coreJs_modules_esObjectEntriesJs() {
      "use strict";

      var $ = require_export();
      var $entries = require_object_to_array().entries;
      $({
        target: "Object",
        stat: true
      }, {
        entries: function entries(O) {
          return $entries(O);
        }
      });
    }
  });

  // node_modules/core-js/es/object/entries.js
  var require_entries = __commonJS({
    "node_modules/core-js/es/object/entries.js": function node_modules_coreJs_es_object_entriesJs(exports, module) {
      "use strict";

      require_es_object_entries();
      var path = require_path();
      module.exports = path.Object.entries;
    }
  });

  // node_modules/core-js/modules/es.object.values.js
  var require_es_object_values = __commonJS({
    "node_modules/core-js/modules/es.object.values.js": function node_modules_coreJs_modules_esObjectValuesJs() {
      "use strict";

      var $ = require_export();
      var $values = require_object_to_array().values;
      $({
        target: "Object",
        stat: true
      }, {
        values: function values(O) {
          return $values(O);
        }
      });
    }
  });

  // node_modules/core-js/es/object/values.js
  var require_values = __commonJS({
    "node_modules/core-js/es/object/values.js": function node_modules_coreJs_es_object_valuesJs(exports, module) {
      "use strict";

      require_es_object_values();
      var path = require_path();
      module.exports = path.Object.values;
    }
  });

  // node_modules/core-js/internals/to-string-tag-support.js
  var require_to_string_tag_support = __commonJS({
    "node_modules/core-js/internals/to-string-tag-support.js": function node_modules_coreJs_internals_toStringTagSupportJs(exports, module) {
      "use strict";

      var wellKnownSymbol = require_well_known_symbol();
      var TO_STRING_TAG = wellKnownSymbol("toStringTag");
      var test = {};
      test[TO_STRING_TAG] = "z";
      module.exports = String(test) === "[object z]";
    }
  });

  // node_modules/core-js/internals/classof.js
  var require_classof = __commonJS({
    "node_modules/core-js/internals/classof.js": function node_modules_coreJs_internals_classofJs(exports, module) {
      "use strict";

      var TO_STRING_TAG_SUPPORT = require_to_string_tag_support();
      var isCallable = require_is_callable();
      var classofRaw = require_classof_raw();
      var wellKnownSymbol = require_well_known_symbol();
      var TO_STRING_TAG = wellKnownSymbol("toStringTag");
      var $Object = Object;
      var CORRECT_ARGUMENTS = classofRaw(/* @__PURE__ */function () {
        return arguments;
      }()) === "Arguments";
      var tryGet = function tryGet(it, key3) {
        try {
          return it[key3];
        } catch (error) {}
      };
      module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
        var O, tag, result;
        return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == "string" ? tag : CORRECT_ARGUMENTS ? classofRaw(O) : (result = classofRaw(O)) === "Object" && isCallable(O.callee) ? "Arguments" : result;
      };
    }
  });

  // node_modules/core-js/internals/to-string.js
  var require_to_string = __commonJS({
    "node_modules/core-js/internals/to-string.js": function node_modules_coreJs_internals_toStringJs(exports, module) {
      "use strict";

      var classof = require_classof();
      var $String = String;
      module.exports = function (argument) {
        if (classof(argument) === "Symbol") throw new TypeError("Cannot convert a Symbol value to a string");
        return $String(argument);
      };
    }
  });

  // node_modules/core-js/internals/string-multibyte.js
  var require_string_multibyte = __commonJS({
    "node_modules/core-js/internals/string-multibyte.js": function node_modules_coreJs_internals_stringMultibyteJs(exports, module) {
      "use strict";

      var uncurryThis = require_function_uncurry_this();
      var toIntegerOrInfinity = require_to_integer_or_infinity();
      var toString = require_to_string();
      var requireObjectCoercible = require_require_object_coercible();
      var charAt = uncurryThis("".charAt);
      var charCodeAt = uncurryThis("".charCodeAt);
      var stringSlice = uncurryThis("".slice);
      var createMethod = function createMethod(CONVERT_TO_STRING) {
        return function ($this, pos) {
          var S = toString(requireObjectCoercible($this));
          var position = toIntegerOrInfinity(pos);
          var size = S.length;
          var first, second;
          if (position < 0 || position >= size) return CONVERT_TO_STRING ? "" : void 0;
          first = charCodeAt(S, position);
          return first < 55296 || first > 56319 || position + 1 === size || (second = charCodeAt(S, position + 1)) < 56320 || second > 57343 ? CONVERT_TO_STRING ? charAt(S, position) : first : CONVERT_TO_STRING ? stringSlice(S, position, position + 2) : (first - 55296 << 10) + (second - 56320) + 65536;
        };
      };
      module.exports = {
        // `String.prototype.codePointAt` method
        // https://tc39.es/ecma262/#sec-string.prototype.codepointat
        codeAt: createMethod(false),
        // `String.prototype.at` method
        // https://github.com/mathiasbynens/String.prototype.at
        charAt: createMethod(true)
      };
    }
  });

  // node_modules/core-js/internals/object-define-properties.js
  var require_object_define_properties = __commonJS({
    "node_modules/core-js/internals/object-define-properties.js": function node_modules_coreJs_internals_objectDefinePropertiesJs(exports) {
      "use strict";

      var DESCRIPTORS = require_descriptors();
      var V8_PROTOTYPE_DEFINE_BUG = require_v8_prototype_define_bug();
      var definePropertyModule = require_object_define_property();
      var anObject = require_an_object();
      var toIndexedObject = require_to_indexed_object();
      var objectKeys = require_object_keys();
      exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
        anObject(O);
        var props = toIndexedObject(Properties);
        var keys2 = objectKeys(Properties);
        var length = keys2.length;
        var index2 = 0;
        var key3;
        while (length > index2) definePropertyModule.f(O, key3 = keys2[index2++], props[key3]);
        return O;
      };
    }
  });

  // node_modules/core-js/internals/html.js
  var require_html = __commonJS({
    "node_modules/core-js/internals/html.js": function node_modules_coreJs_internals_htmlJs(exports, module) {
      "use strict";

      var getBuiltIn = require_get_built_in();
      module.exports = getBuiltIn("document", "documentElement");
    }
  });

  // node_modules/core-js/internals/object-create.js
  var require_object_create = __commonJS({
    "node_modules/core-js/internals/object-create.js": function node_modules_coreJs_internals_objectCreateJs(exports, module) {
      "use strict";

      var anObject = require_an_object();
      var definePropertiesModule = require_object_define_properties();
      var enumBugKeys = require_enum_bug_keys();
      var hiddenKeys = require_hidden_keys();
      var html = require_html();
      var documentCreateElement = require_document_create_element();
      var sharedKey = require_shared_key();
      var GT = ">";
      var LT = "<";
      var PROTOTYPE = "prototype";
      var SCRIPT = "script";
      var IE_PROTO = sharedKey("IE_PROTO");
      var EmptyConstructor = function EmptyConstructor() {};
      var scriptTag = function scriptTag(content) {
        return LT + SCRIPT + GT + content + LT + "/" + SCRIPT + GT;
      };
      var NullProtoObjectViaActiveX = function NullProtoObjectViaActiveX(activeXDocument2) {
        activeXDocument2.write(scriptTag(""));
        activeXDocument2.close();
        var temp = activeXDocument2.parentWindow.Object;
        activeXDocument2 = null;
        return temp;
      };
      var NullProtoObjectViaIFrame = function NullProtoObjectViaIFrame() {
        var iframe = documentCreateElement("iframe");
        var JS = "java" + SCRIPT + ":";
        var iframeDocument;
        iframe.style.display = "none";
        html.appendChild(iframe);
        iframe.src = String(JS);
        iframeDocument = iframe.contentWindow.document;
        iframeDocument.open();
        iframeDocument.write(scriptTag("document.F=Object"));
        iframeDocument.close();
        return iframeDocument.F;
      };
      var activeXDocument;
      var _NullProtoObject = function NullProtoObject() {
        try {
          activeXDocument = new ActiveXObject("htmlfile");
        } catch (error) {}
        _NullProtoObject = typeof document != "undefined" ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument);
        var length = enumBugKeys.length;
        while (length--) delete _NullProtoObject[PROTOTYPE][enumBugKeys[length]];
        return _NullProtoObject();
      };
      hiddenKeys[IE_PROTO] = true;
      module.exports = Object.create || function create2(O, Properties) {
        var result;
        if (O !== null) {
          EmptyConstructor[PROTOTYPE] = anObject(O);
          result = new EmptyConstructor();
          EmptyConstructor[PROTOTYPE] = null;
          result[IE_PROTO] = O;
        } else result = _NullProtoObject();
        return Properties === void 0 ? result : definePropertiesModule.f(result, Properties);
      };
    }
  });

  // node_modules/core-js/internals/iterators-core.js
  var require_iterators_core = __commonJS({
    "node_modules/core-js/internals/iterators-core.js": function node_modules_coreJs_internals_iteratorsCoreJs(exports, module) {
      "use strict";

      var fails = require_fails();
      var isCallable = require_is_callable();
      var isObject = require_is_object();
      var create2 = require_object_create();
      var getPrototypeOf = require_object_get_prototype_of();
      var defineBuiltIn = require_define_built_in();
      var wellKnownSymbol = require_well_known_symbol();
      var IS_PURE = require_is_pure();
      var ITERATOR = wellKnownSymbol("iterator");
      var BUGGY_SAFARI_ITERATORS = false;
      var IteratorPrototype;
      var PrototypeOfArrayIteratorPrototype;
      var arrayIterator;
      if ([].keys) {
        arrayIterator = [].keys();
        if (!("next" in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;else {
          PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
          if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
        }
      }
      var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
        var test = {};
        return IteratorPrototype[ITERATOR].call(test) !== test;
      });
      if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};else if (IS_PURE) IteratorPrototype = create2(IteratorPrototype);
      if (!isCallable(IteratorPrototype[ITERATOR])) {
        defineBuiltIn(IteratorPrototype, ITERATOR, function () {
          return this;
        });
      }
      module.exports = {
        IteratorPrototype: IteratorPrototype,
        BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
      };
    }
  });

  // node_modules/core-js/internals/set-to-string-tag.js
  var require_set_to_string_tag = __commonJS({
    "node_modules/core-js/internals/set-to-string-tag.js": function node_modules_coreJs_internals_setToStringTagJs(exports, module) {
      "use strict";

      var defineProperty = require_object_define_property().f;
      var hasOwn = require_has_own_property();
      var wellKnownSymbol = require_well_known_symbol();
      var TO_STRING_TAG = wellKnownSymbol("toStringTag");
      module.exports = function (target, TAG, STATIC) {
        if (target && !STATIC) target = target.prototype;
        if (target && !hasOwn(target, TO_STRING_TAG)) {
          defineProperty(target, TO_STRING_TAG, {
            configurable: true,
            value: TAG
          });
        }
      };
    }
  });

  // node_modules/core-js/internals/iterators.js
  var require_iterators = __commonJS({
    "node_modules/core-js/internals/iterators.js": function node_modules_coreJs_internals_iteratorsJs(exports, module) {
      "use strict";

      module.exports = Object.create ? /* @__PURE__ */Object.create(null) : {};
    }
  });

  // node_modules/core-js/internals/iterator-create-constructor.js
  var require_iterator_create_constructor = __commonJS({
    "node_modules/core-js/internals/iterator-create-constructor.js": function node_modules_coreJs_internals_iteratorCreateConstructorJs(exports, module) {
      "use strict";

      var IteratorPrototype = require_iterators_core().IteratorPrototype;
      var create2 = require_object_create();
      var createPropertyDescriptor = require_create_property_descriptor();
      var setToStringTag = require_set_to_string_tag();
      var Iterators = require_iterators();
      var returnThis = function returnThis() {
        return this;
      };
      module.exports = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
        var TO_STRING_TAG = NAME + " Iterator";
        IteratorConstructor.prototype = create2(IteratorPrototype, {
          next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next)
        });
        setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
        Iterators[TO_STRING_TAG] = returnThis;
        return IteratorConstructor;
      };
    }
  });

  // node_modules/core-js/internals/function-uncurry-this-accessor.js
  var require_function_uncurry_this_accessor = __commonJS({
    "node_modules/core-js/internals/function-uncurry-this-accessor.js": function node_modules_coreJs_internals_functionUncurryThisAccessorJs(exports, module) {
      "use strict";

      var uncurryThis = require_function_uncurry_this();
      var aCallable = require_a_callable();
      module.exports = function (object, key3, method) {
        try {
          return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key3)[method]));
        } catch (error) {}
      };
    }
  });

  // node_modules/core-js/internals/is-possible-prototype.js
  var require_is_possible_prototype = __commonJS({
    "node_modules/core-js/internals/is-possible-prototype.js": function node_modules_coreJs_internals_isPossiblePrototypeJs(exports, module) {
      "use strict";

      var isObject = require_is_object();
      module.exports = function (argument) {
        return isObject(argument) || argument === null;
      };
    }
  });

  // node_modules/core-js/internals/a-possible-prototype.js
  var require_a_possible_prototype = __commonJS({
    "node_modules/core-js/internals/a-possible-prototype.js": function node_modules_coreJs_internals_aPossiblePrototypeJs(exports, module) {
      "use strict";

      var isPossiblePrototype = require_is_possible_prototype();
      var $String = String;
      var $TypeError = TypeError;
      module.exports = function (argument) {
        if (isPossiblePrototype(argument)) return argument;
        throw new $TypeError("Can't set " + $String(argument) + " as a prototype");
      };
    }
  });

  // node_modules/core-js/internals/object-set-prototype-of.js
  var require_object_set_prototype_of = __commonJS({
    "node_modules/core-js/internals/object-set-prototype-of.js": function node_modules_coreJs_internals_objectSetPrototypeOfJs(exports, module) {
      "use strict";

      var uncurryThisAccessor = require_function_uncurry_this_accessor();
      var isObject = require_is_object();
      var requireObjectCoercible = require_require_object_coercible();
      var aPossiblePrototype = require_a_possible_prototype();
      module.exports = Object.setPrototypeOf || ("__proto__" in {} ? function () {
        var CORRECT_SETTER = false;
        var test = {};
        var setter;
        try {
          setter = uncurryThisAccessor(Object.prototype, "__proto__", "set");
          setter(test, []);
          CORRECT_SETTER = test instanceof Array;
        } catch (error) {}
        return function setPrototypeOf(O, proto) {
          requireObjectCoercible(O);
          aPossiblePrototype(proto);
          if (!isObject(O)) return O;
          if (CORRECT_SETTER) setter(O, proto);else O.__proto__ = proto;
          return O;
        };
      }() : void 0);
    }
  });

  // node_modules/core-js/internals/iterator-define.js
  var require_iterator_define = __commonJS({
    "node_modules/core-js/internals/iterator-define.js": function node_modules_coreJs_internals_iteratorDefineJs(exports, module) {
      "use strict";

      var $ = require_export();
      var call4 = require_function_call();
      var IS_PURE = require_is_pure();
      var FunctionName = require_function_name();
      var isCallable = require_is_callable();
      var createIteratorConstructor = require_iterator_create_constructor();
      var getPrototypeOf = require_object_get_prototype_of();
      var setPrototypeOf = require_object_set_prototype_of();
      var setToStringTag = require_set_to_string_tag();
      var createNonEnumerableProperty = require_create_non_enumerable_property();
      var defineBuiltIn = require_define_built_in();
      var wellKnownSymbol = require_well_known_symbol();
      var Iterators = require_iterators();
      var IteratorsCore = require_iterators_core();
      var PROPER_FUNCTION_NAME = FunctionName.PROPER;
      var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
      var IteratorPrototype = IteratorsCore.IteratorPrototype;
      var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
      var ITERATOR = wellKnownSymbol("iterator");
      var KEYS = "keys";
      var VALUES = "values";
      var ENTRIES = "entries";
      var returnThis = function returnThis() {
        return this;
      };
      module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
        createIteratorConstructor(IteratorConstructor, NAME, next);
        var getIterationMethod = function getIterationMethod(KIND) {
          if (KIND === DEFAULT && defaultIterator) return defaultIterator;
          if (!BUGGY_SAFARI_ITERATORS && KIND && KIND in IterablePrototype) return IterablePrototype[KIND];
          switch (KIND) {
            case KEYS:
              return function keys2() {
                return new IteratorConstructor(this, KIND);
              };
            case VALUES:
              return function values() {
                return new IteratorConstructor(this, KIND);
              };
            case ENTRIES:
              return function entries() {
                return new IteratorConstructor(this, KIND);
              };
          }
          return function () {
            return new IteratorConstructor(this);
          };
        };
        var TO_STRING_TAG = NAME + " Iterator";
        var INCORRECT_VALUES_NAME = false;
        var IterablePrototype = Iterable.prototype;
        var nativeIterator = IterablePrototype[ITERATOR] || IterablePrototype["@@iterator"] || DEFAULT && IterablePrototype[DEFAULT];
        var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
        var anyNativeIterator = NAME === "Array" ? IterablePrototype.entries || nativeIterator : nativeIterator;
        var CurrentIteratorPrototype, methods, KEY3;
        if (anyNativeIterator) {
          CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
          if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
            if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
              if (setPrototypeOf) {
                setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
              } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
                defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
              }
            }
            setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
            if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
          }
        }
        if (PROPER_FUNCTION_NAME && DEFAULT === VALUES && nativeIterator && nativeIterator.name !== VALUES) {
          if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
            createNonEnumerableProperty(IterablePrototype, "name", VALUES);
          } else {
            INCORRECT_VALUES_NAME = true;
            defaultIterator = function values() {
              return call4(nativeIterator, this);
            };
          }
        }
        if (DEFAULT) {
          methods = {
            values: getIterationMethod(VALUES),
            keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
            entries: getIterationMethod(ENTRIES)
          };
          if (FORCED) for (KEY3 in methods) {
            if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY3 in IterablePrototype)) {
              defineBuiltIn(IterablePrototype, KEY3, methods[KEY3]);
            }
          } else $({
            target: NAME,
            proto: true,
            forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME
          }, methods);
        }
        if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
          defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, {
            name: DEFAULT
          });
        }
        Iterators[NAME] = defaultIterator;
        return methods;
      };
    }
  });

  // node_modules/core-js/internals/create-iter-result-object.js
  var require_create_iter_result_object = __commonJS({
    "node_modules/core-js/internals/create-iter-result-object.js": function node_modules_coreJs_internals_createIterResultObjectJs(exports, module) {
      "use strict";

      module.exports = function (value, done) {
        return {
          value: value,
          done: done
        };
      };
    }
  });

  // node_modules/core-js/modules/es.string.iterator.js
  var require_es_string_iterator = __commonJS({
    "node_modules/core-js/modules/es.string.iterator.js": function node_modules_coreJs_modules_esStringIteratorJs() {
      "use strict";

      var charAt = require_string_multibyte().charAt;
      var toString = require_to_string();
      var InternalStateModule = require_internal_state();
      var defineIterator = require_iterator_define();
      var createIterResultObject = require_create_iter_result_object();
      var STRING_ITERATOR = "String Iterator";
      var setInternalState = InternalStateModule.set;
      var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);
      defineIterator(String, "String", function (iterated) {
        setInternalState(this, {
          type: STRING_ITERATOR,
          string: toString(iterated),
          index: 0
        });
      }, function next() {
        var state = getInternalState(this);
        var string = state.string;
        var index2 = state.index;
        var point;
        if (index2 >= string.length) return createIterResultObject(void 0, true);
        point = charAt(string, index2);
        state.index += point.length;
        return createIterResultObject(point, false);
      });
    }
  });

  // node_modules/core-js/internals/function-uncurry-this-clause.js
  var require_function_uncurry_this_clause = __commonJS({
    "node_modules/core-js/internals/function-uncurry-this-clause.js": function node_modules_coreJs_internals_functionUncurryThisClauseJs(exports, module) {
      "use strict";

      var classofRaw = require_classof_raw();
      var uncurryThis = require_function_uncurry_this();
      module.exports = function (fn) {
        if (classofRaw(fn) === "Function") return uncurryThis(fn);
      };
    }
  });

  // node_modules/core-js/internals/function-bind-context.js
  var require_function_bind_context = __commonJS({
    "node_modules/core-js/internals/function-bind-context.js": function node_modules_coreJs_internals_functionBindContextJs(exports, module) {
      "use strict";

      var uncurryThis = require_function_uncurry_this_clause();
      var aCallable = require_a_callable();
      var NATIVE_BIND = require_function_bind_native();
      var bind = uncurryThis(uncurryThis.bind);
      module.exports = function (fn, that) {
        aCallable(fn);
        return that === void 0 ? fn : NATIVE_BIND ? bind(fn, that) : function () {
          return fn.apply(that, arguments);
        };
      };
    }
  });

  // node_modules/core-js/internals/iterator-close.js
  var require_iterator_close = __commonJS({
    "node_modules/core-js/internals/iterator-close.js": function node_modules_coreJs_internals_iteratorCloseJs(exports, module) {
      "use strict";

      var call4 = require_function_call();
      var anObject = require_an_object();
      var getMethod = require_get_method();
      module.exports = function (iterator, kind, value) {
        var innerResult, innerError;
        anObject(iterator);
        try {
          innerResult = getMethod(iterator, "return");
          if (!innerResult) {
            if (kind === "throw") throw value;
            return value;
          }
          innerResult = call4(innerResult, iterator);
        } catch (error) {
          innerError = true;
          innerResult = error;
        }
        if (kind === "throw") throw value;
        if (innerError) throw innerResult;
        anObject(innerResult);
        return value;
      };
    }
  });

  // node_modules/core-js/internals/call-with-safe-iteration-closing.js
  var require_call_with_safe_iteration_closing = __commonJS({
    "node_modules/core-js/internals/call-with-safe-iteration-closing.js": function node_modules_coreJs_internals_callWithSafeIterationClosingJs(exports, module) {
      "use strict";

      var anObject = require_an_object();
      var iteratorClose = require_iterator_close();
      module.exports = function (iterator, fn, value, ENTRIES) {
        try {
          return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
        } catch (error) {
          iteratorClose(iterator, "throw", error);
        }
      };
    }
  });

  // node_modules/core-js/internals/is-array-iterator-method.js
  var require_is_array_iterator_method = __commonJS({
    "node_modules/core-js/internals/is-array-iterator-method.js": function node_modules_coreJs_internals_isArrayIteratorMethodJs(exports, module) {
      "use strict";

      var wellKnownSymbol = require_well_known_symbol();
      var Iterators = require_iterators();
      var ITERATOR = wellKnownSymbol("iterator");
      var ArrayPrototype = Array.prototype;
      module.exports = function (it) {
        return it !== void 0 && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
      };
    }
  });

  // node_modules/core-js/internals/is-constructor.js
  var require_is_constructor = __commonJS({
    "node_modules/core-js/internals/is-constructor.js": function node_modules_coreJs_internals_isConstructorJs(exports, module) {
      "use strict";

      var uncurryThis = require_function_uncurry_this();
      var fails = require_fails();
      var isCallable = require_is_callable();
      var classof = require_classof();
      var getBuiltIn = require_get_built_in();
      var inspectSource = require_inspect_source();
      var noop = function noop() {};
      var construct = getBuiltIn("Reflect", "construct");
      var constructorRegExp = /^\s*(?:class|function)\b/;
      var exec = uncurryThis(constructorRegExp.exec);
      var INCORRECT_TO_STRING = !constructorRegExp.test(noop);
      var isConstructorModern = function isConstructor(argument) {
        if (!isCallable(argument)) return false;
        try {
          construct(noop, [], argument);
          return true;
        } catch (error) {
          return false;
        }
      };
      var isConstructorLegacy = function isConstructor(argument) {
        if (!isCallable(argument)) return false;
        switch (classof(argument)) {
          case "AsyncFunction":
          case "GeneratorFunction":
          case "AsyncGeneratorFunction":
            return false;
        }
        try {
          return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
        } catch (error) {
          return true;
        }
      };
      isConstructorLegacy.sham = true;
      module.exports = !construct || fails(function () {
        var called;
        return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function () {
          called = true;
        }) || called;
      }) ? isConstructorLegacy : isConstructorModern;
    }
  });

  // node_modules/core-js/internals/create-property.js
  var require_create_property = __commonJS({
    "node_modules/core-js/internals/create-property.js": function node_modules_coreJs_internals_createPropertyJs(exports, module) {
      "use strict";

      var DESCRIPTORS = require_descriptors();
      var definePropertyModule = require_object_define_property();
      var createPropertyDescriptor = require_create_property_descriptor();
      module.exports = function (object, key3, value) {
        if (DESCRIPTORS) definePropertyModule.f(object, key3, createPropertyDescriptor(0, value));else object[key3] = value;
      };
    }
  });

  // node_modules/core-js/internals/is-array.js
  var require_is_array = __commonJS({
    "node_modules/core-js/internals/is-array.js": function node_modules_coreJs_internals_isArrayJs(exports, module) {
      "use strict";

      var classof = require_classof_raw();
      module.exports = Array.isArray || function isArray(argument) {
        return classof(argument) === "Array";
      };
    }
  });

  // node_modules/core-js/internals/array-set-length.js
  var require_array_set_length = __commonJS({
    "node_modules/core-js/internals/array-set-length.js": function node_modules_coreJs_internals_arraySetLengthJs(exports, module) {
      "use strict";

      var DESCRIPTORS = require_descriptors();
      var isArray = require_is_array();
      var $TypeError = TypeError;
      var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
        if (this !== void 0) return true;
        try {
          Object.defineProperty([], "length", {
            writable: false
          }).length = 1;
        } catch (error) {
          return error instanceof TypeError;
        }
      }();
      module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
        if (isArray(O) && !getOwnPropertyDescriptor(O, "length").writable) {
          throw new $TypeError("Cannot set read only .length");
        }
        return O.length = length;
      } : function (O, length) {
        return O.length = length;
      };
    }
  });

  // node_modules/core-js/internals/get-iterator-method-internal.js
  var require_get_iterator_method_internal = __commonJS({
    "node_modules/core-js/internals/get-iterator-method-internal.js": function node_modules_coreJs_internals_getIteratorMethodInternalJs(exports, module) {
      "use strict";

      var classof = require_classof_raw();
      var isNullOrUndefined = require_is_null_or_undefined();
      var getMethod = require_get_method();
      var wellKnownSymbol = require_well_known_symbol();
      var ITERATOR = wellKnownSymbol("iterator");
      var ArrayPrototype = Array.prototype;
      module.exports = function (it) {
        if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR) || getMethod(it, "@@iterator") || (classof(it) === "Arguments" ? ArrayPrototype[ITERATOR] : void 0);
      };
    }
  });

  // node_modules/core-js/internals/get-iterator-internal.js
  var require_get_iterator_internal = __commonJS({
    "node_modules/core-js/internals/get-iterator-internal.js": function node_modules_coreJs_internals_getIteratorInternalJs(exports, module) {
      "use strict";

      var call4 = require_function_call();
      var isCallable = require_is_callable();
      var anObject = require_an_object();
      var tryToString = require_try_to_string();
      var getIteratorMethod = require_get_iterator_method_internal();
      var $TypeError = TypeError;
      module.exports = function (argument, usingIterator) {
        var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
        if (isCallable(iteratorMethod)) return anObject(call4(iteratorMethod, argument));
        throw new $TypeError(tryToString(argument) + " is not iterable");
      };
    }
  });

  // node_modules/core-js/internals/does-not-exceed-safe-integer.js
  var require_does_not_exceed_safe_integer = __commonJS({
    "node_modules/core-js/internals/does-not-exceed-safe-integer.js": function node_modules_coreJs_internals_doesNotExceedSafeIntegerJs(exports, module) {
      "use strict";

      var $TypeError = TypeError;
      var MAX_SAFE_INTEGER = 9007199254740991;
      module.exports = function (it) {
        if (it > MAX_SAFE_INTEGER) throw new $TypeError("Maximum allowed index exceeded");
        return it;
      };
    }
  });

  // node_modules/core-js/internals/array-from.js
  var require_array_from = __commonJS({
    "node_modules/core-js/internals/array-from.js": function node_modules_coreJs_internals_arrayFromJs(exports, module) {
      "use strict";

      var bind = require_function_bind_context();
      var call4 = require_function_call();
      var toObject = require_to_object();
      var callWithSafeIterationClosing = require_call_with_safe_iteration_closing();
      var isArrayIteratorMethod = require_is_array_iterator_method();
      var isConstructor = require_is_constructor();
      var lengthOfArrayLike = require_length_of_array_like();
      var createProperty = require_create_property();
      var setArrayLength = require_array_set_length();
      var getIterator = require_get_iterator_internal();
      var getIteratorMethod = require_get_iterator_method_internal();
      var iteratorClose = require_iterator_close();
      var doesNotExceedSafeInteger = require_does_not_exceed_safe_integer();
      var $Array = Array;
      module.exports = function from(arrayLike) {
        var IS_CONSTRUCTOR = isConstructor(this);
        var argumentsLength = arguments.length;
        var mapfn = argumentsLength > 1 ? arguments[1] : void 0;
        var mapping = mapfn !== void 0;
        if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : void 0);
        var O = toObject(arrayLike);
        var iteratorMethod = getIteratorMethod(O);
        var index2 = 0;
        var length, result, step, iterator, next, value;
        if (iteratorMethod && !(this === $Array && isArrayIteratorMethod(iteratorMethod))) {
          result = IS_CONSTRUCTOR ? new this() : [];
          iterator = getIterator(O, iteratorMethod);
          next = iterator.next;
          for (; !(step = call4(next, iterator)).done; index2++) {
            try {
              doesNotExceedSafeInteger(index2);
            } catch (error) {
              iteratorClose(iterator, "throw", error);
            }
            value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index2], true) : step.value;
            try {
              createProperty(result, index2, value);
            } catch (error) {
              iteratorClose(iterator, "throw", error);
            }
          }
        } else {
          length = lengthOfArrayLike(O);
          result = IS_CONSTRUCTOR ? new this(length) : $Array(length);
          for (; length > index2; index2++) {
            value = mapping ? mapfn(O[index2], index2) : O[index2];
            createProperty(result, index2, value);
          }
        }
        setArrayLength(result, index2);
        return result;
      };
    }
  });

  // node_modules/core-js/internals/check-correctness-of-iteration.js
  var require_check_correctness_of_iteration = __commonJS({
    "node_modules/core-js/internals/check-correctness-of-iteration.js": function node_modules_coreJs_internals_checkCorrectnessOfIterationJs(exports, module) {
      "use strict";

      var wellKnownSymbol = require_well_known_symbol();
      var ITERATOR = wellKnownSymbol("iterator");
      var SAFE_CLOSING = false;
      try {
        called = 0;
        iteratorWithReturn = {
          next: function next() {
            return {
              done: !!called++
            };
          },
          "return": function _return() {
            SAFE_CLOSING = true;
          }
        };
        iteratorWithReturn[ITERATOR] = function () {
          return this;
        };
        Array.from(iteratorWithReturn, function () {
          throw 2;
        });
      } catch (error) {}
      var called;
      var iteratorWithReturn;
      module.exports = function (exec, SKIP_CLOSING) {
        try {
          if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
        } catch (error) {
          return false;
        }
        var ITERATION_SUPPORT = false;
        try {
          var object = {};
          object[ITERATOR] = function () {
            return {
              next: function next() {
                return {
                  done: ITERATION_SUPPORT = true
                };
              }
            };
          };
          exec(object);
        } catch (error) {}
        return ITERATION_SUPPORT;
      };
    }
  });

  // node_modules/core-js/modules/es.array.from.js
  var require_es_array_from = __commonJS({
    "node_modules/core-js/modules/es.array.from.js": function node_modules_coreJs_modules_esArrayFromJs() {
      "use strict";

      var $ = require_export();
      var from = require_array_from();
      var checkCorrectnessOfIteration = require_check_correctness_of_iteration();
      var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
        Array.from(iterable);
      });
      $({
        target: "Array",
        stat: true,
        forced: INCORRECT_ITERATION
      }, {
        from: from
      });
    }
  });

  // node_modules/core-js/es/array/from.js
  var require_from = __commonJS({
    "node_modules/core-js/es/array/from.js": function node_modules_coreJs_es_array_fromJs(exports, module) {
      "use strict";

      require_es_string_iterator();
      require_es_array_from();
      var path = require_path();
      module.exports = path.Array.from;
    }
  });

  // node_modules/core-js/internals/array-species-constructor.js
  var require_array_species_constructor = __commonJS({
    "node_modules/core-js/internals/array-species-constructor.js": function node_modules_coreJs_internals_arraySpeciesConstructorJs(exports, module) {
      "use strict";

      var isArray = require_is_array();
      var isConstructor = require_is_constructor();
      var isObject = require_is_object();
      var wellKnownSymbol = require_well_known_symbol();
      var SPECIES = wellKnownSymbol("species");
      var $Array = Array;
      module.exports = function (originalArray) {
        var C;
        if (isArray(originalArray)) {
          C = originalArray.constructor;
          if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = void 0;else if (isObject(C)) {
            C = C[SPECIES];
            if (C === null) C = void 0;
          }
        }
        return C === void 0 ? $Array : C;
      };
    }
  });

  // node_modules/core-js/internals/array-species-create.js
  var require_array_species_create = __commonJS({
    "node_modules/core-js/internals/array-species-create.js": function node_modules_coreJs_internals_arraySpeciesCreateJs(exports, module) {
      "use strict";

      var arraySpeciesConstructor = require_array_species_constructor();
      module.exports = function (originalArray, length) {
        return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
      };
    }
  });

  // node_modules/core-js/internals/array-iteration.js
  var require_array_iteration = __commonJS({
    "node_modules/core-js/internals/array-iteration.js": function node_modules_coreJs_internals_arrayIterationJs(exports, module) {
      "use strict";

      var bind = require_function_bind_context();
      var IndexedObject = require_indexed_object();
      var toObject = require_to_object();
      var lengthOfArrayLike = require_length_of_array_like();
      var arraySpeciesCreate = require_array_species_create();
      var createProperty = require_create_property();
      var createMethod = function createMethod(TYPE) {
        var IS_MAP = TYPE === 1;
        var IS_FILTER = TYPE === 2;
        var IS_SOME = TYPE === 3;
        var IS_EVERY = TYPE === 4;
        var IS_FIND_INDEX = TYPE === 6;
        var IS_FILTER_REJECT = TYPE === 7;
        var NO_HOLES = TYPE === 5 || IS_FIND_INDEX;
        return function ($this, callbackfn, that) {
          var O = toObject($this);
          var self2 = IndexedObject(O);
          var length = lengthOfArrayLike(self2);
          var boundFunction = bind(callbackfn, that);
          var index2 = 0;
          var resIndex = 0;
          var target = IS_MAP ? arraySpeciesCreate($this, length) : IS_FILTER || IS_FILTER_REJECT ? arraySpeciesCreate($this, 0) : void 0;
          var value, result;
          for (; length > index2; index2++) if (NO_HOLES || index2 in self2) {
            value = self2[index2];
            result = boundFunction(value, index2, O);
            if (TYPE) {
              if (IS_MAP) createProperty(target, index2, result);else if (result) switch (TYPE) {
                case 3:
                  return true;
                // some
                case 5:
                  return value;
                // find
                case 6:
                  return index2;
                // findIndex
                case 2:
                  createProperty(target, resIndex++, value);
              } else switch (TYPE) {
                case 4:
                  return false;
                // every
                case 7:
                  createProperty(target, resIndex++, value);
              }
            }
          }
          return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
        };
      };
      module.exports = {
        // `Array.prototype.forEach` method
        // https://tc39.es/ecma262/#sec-array.prototype.foreach
        forEach: createMethod(0),
        // `Array.prototype.map` method
        // https://tc39.es/ecma262/#sec-array.prototype.map
        map: createMethod(1),
        // `Array.prototype.filter` method
        // https://tc39.es/ecma262/#sec-array.prototype.filter
        filter: createMethod(2),
        // `Array.prototype.some` method
        // https://tc39.es/ecma262/#sec-array.prototype.some
        some: createMethod(3),
        // `Array.prototype.every` method
        // https://tc39.es/ecma262/#sec-array.prototype.every
        every: createMethod(4),
        // `Array.prototype.find` method
        // https://tc39.es/ecma262/#sec-array.prototype.find
        find: createMethod(5),
        // `Array.prototype.findIndex` method
        // https://tc39.es/ecma262/#sec-array.prototype.findIndex
        findIndex: createMethod(6),
        // `Array.prototype.filterReject` method
        // https://github.com/tc39/proposal-array-filtering
        filterReject: createMethod(7)
      };
    }
  });

  // node_modules/core-js/internals/add-to-unscopables.js
  var require_add_to_unscopables = __commonJS({
    "node_modules/core-js/internals/add-to-unscopables.js": function node_modules_coreJs_internals_addToUnscopablesJs(exports, module) {
      "use strict";

      var wellKnownSymbol = require_well_known_symbol();
      var create2 = require_object_create();
      var defineProperty = require_object_define_property().f;
      var UNSCOPABLES = wellKnownSymbol("unscopables");
      var ArrayPrototype = Array.prototype;
      if (ArrayPrototype[UNSCOPABLES] === void 0) {
        defineProperty(ArrayPrototype, UNSCOPABLES, {
          configurable: true,
          value: create2(null)
        });
      }
      module.exports = function (key3) {
        ArrayPrototype[UNSCOPABLES][key3] = true;
      };
    }
  });

  // node_modules/core-js/modules/es.array.find.js
  var require_es_array_find = __commonJS({
    "node_modules/core-js/modules/es.array.find.js": function node_modules_coreJs_modules_esArrayFindJs() {
      "use strict";

      var $ = require_export();
      var $find = require_array_iteration().find;
      var addToUnscopables = require_add_to_unscopables();
      var FIND = "find";
      var SKIPS_HOLES = true;
      if (FIND in []) Array(1)[FIND](function () {
        SKIPS_HOLES = false;
      });
      $({
        target: "Array",
        proto: true,
        forced: SKIPS_HOLES
      }, {
        find: function find2(callbackfn) {
          return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
        }
      });
      addToUnscopables(FIND);
    }
  });

  // node_modules/core-js/internals/entry-unbind.js
  var require_entry_unbind = __commonJS({
    "node_modules/core-js/internals/entry-unbind.js": function node_modules_coreJs_internals_entryUnbindJs(exports, module) {
      "use strict";

      var globalThis2 = require_global_this();
      var uncurryThis = require_function_uncurry_this();
      module.exports = function (CONSTRUCTOR, METHOD) {
        return uncurryThis(globalThis2[CONSTRUCTOR].prototype[METHOD]);
      };
    }
  });

  // node_modules/core-js/es/array/find.js
  var require_find = __commonJS({
    "node_modules/core-js/es/array/find.js": function node_modules_coreJs_es_array_findJs(exports, module) {
      "use strict";

      require_es_array_find();
      var entryUnbind = require_entry_unbind();
      module.exports = entryUnbind("Array", "find");
    }
  });

  // node_modules/core-js/modules/es.array.find-index.js
  var require_es_array_find_index = __commonJS({
    "node_modules/core-js/modules/es.array.find-index.js": function node_modules_coreJs_modules_esArrayFindIndexJs() {
      "use strict";

      var $ = require_export();
      var $findIndex = require_array_iteration().findIndex;
      var addToUnscopables = require_add_to_unscopables();
      var FIND_INDEX = "findIndex";
      var SKIPS_HOLES = true;
      if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () {
        SKIPS_HOLES = false;
      });
      $({
        target: "Array",
        proto: true,
        forced: SKIPS_HOLES
      }, {
        findIndex: function findIndex(callbackfn) {
          return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
        }
      });
      addToUnscopables(FIND_INDEX);
    }
  });

  // node_modules/core-js/es/array/find-index.js
  var require_find_index = __commonJS({
    "node_modules/core-js/es/array/find-index.js": function node_modules_coreJs_es_array_findIndexJs(exports, module) {
      "use strict";

      require_es_array_find_index();
      var entryUnbind = require_entry_unbind();
      module.exports = entryUnbind("Array", "findIndex");
    }
  });

  // node_modules/core-js/modules/es.array.includes.js
  var require_es_array_includes = __commonJS({
    "node_modules/core-js/modules/es.array.includes.js": function node_modules_coreJs_modules_esArrayIncludesJs() {
      "use strict";

      var $ = require_export();
      var $includes = require_array_includes().includes;
      var fails = require_fails();
      var addToUnscopables = require_add_to_unscopables();
      var BROKEN_ON_SPARSE = fails(function () {
        return !Array(1).includes();
      });
      var BROKEN_ON_SPARSE_WITH_FROM_INDEX = fails(function () {
        return [, 1].includes(void 0, 1);
      });
      $({
        target: "Array",
        proto: true,
        forced: BROKEN_ON_SPARSE || BROKEN_ON_SPARSE_WITH_FROM_INDEX
      }, {
        includes: function includes(el) {
          return $includes(this, el, arguments.length > 1 ? arguments[1] : void 0);
        }
      });
      addToUnscopables("includes");
    }
  });

  // node_modules/core-js/es/array/includes.js
  var require_includes = __commonJS({
    "node_modules/core-js/es/array/includes.js": function node_modules_coreJs_es_array_includesJs(exports, module) {
      "use strict";

      require_es_array_includes();
      var entryUnbind = require_entry_unbind();
      module.exports = entryUnbind("Array", "includes");
    }
  });

  // node_modules/core-js/internals/array-fill.js
  var require_array_fill = __commonJS({
    "node_modules/core-js/internals/array-fill.js": function node_modules_coreJs_internals_arrayFillJs(exports, module) {
      "use strict";

      var toObject = require_to_object();
      var toAbsoluteIndex = require_to_absolute_index();
      var lengthOfArrayLike = require_length_of_array_like();
      module.exports = [].fill || function fill(value) {
        var O = toObject(this);
        var length = lengthOfArrayLike(O);
        var argumentsLength = arguments.length;
        var index2 = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : void 0, length);
        var end = argumentsLength > 2 ? arguments[2] : void 0;
        var endPos = end === void 0 ? length : toAbsoluteIndex(end, length);
        while (endPos > index2) O[index2++] = value;
        return O;
      };
    }
  });

  // node_modules/core-js/modules/es.array.fill.js
  var require_es_array_fill = __commonJS({
    "node_modules/core-js/modules/es.array.fill.js": function node_modules_coreJs_modules_esArrayFillJs() {
      "use strict";

      var $ = require_export();
      var fill = require_array_fill();
      var addToUnscopables = require_add_to_unscopables();
      $({
        target: "Array",
        proto: true
      }, {
        fill: fill
      });
      addToUnscopables("fill");
    }
  });

  // node_modules/core-js/es/array/fill.js
  var require_fill = __commonJS({
    "node_modules/core-js/es/array/fill.js": function node_modules_coreJs_es_array_fillJs(exports, module) {
      "use strict";

      require_es_array_fill();
      var entryUnbind = require_entry_unbind();
      module.exports = entryUnbind("Array", "fill");
    }
  });

  // node_modules/core-js/internals/is-regexp.js
  var require_is_regexp = __commonJS({
    "node_modules/core-js/internals/is-regexp.js": function node_modules_coreJs_internals_isRegexpJs(exports, module) {
      "use strict";

      var isObject = require_is_object();
      var classof = require_classof_raw();
      var wellKnownSymbol = require_well_known_symbol();
      var MATCH = wellKnownSymbol("match");
      module.exports = function (it) {
        var isRegExp;
        return isObject(it) && ((isRegExp = it[MATCH]) !== void 0 ? !!isRegExp : classof(it) === "RegExp");
      };
    }
  });

  // node_modules/core-js/internals/not-a-regexp.js
  var require_not_a_regexp = __commonJS({
    "node_modules/core-js/internals/not-a-regexp.js": function node_modules_coreJs_internals_notARegexpJs(exports, module) {
      "use strict";

      var isRegExp = require_is_regexp();
      var $TypeError = TypeError;
      module.exports = function (it) {
        if (isRegExp(it)) {
          throw new $TypeError("The method doesn't accept regular expressions");
        }
        return it;
      };
    }
  });

  // node_modules/core-js/internals/correct-is-regexp-logic.js
  var require_correct_is_regexp_logic = __commonJS({
    "node_modules/core-js/internals/correct-is-regexp-logic.js": function node_modules_coreJs_internals_correctIsRegexpLogicJs(exports, module) {
      "use strict";

      var wellKnownSymbol = require_well_known_symbol();
      var MATCH = wellKnownSymbol("match");
      module.exports = function (METHOD_NAME) {
        var regexp = /./;
        try {
          "/./"[METHOD_NAME](regexp);
        } catch (error1) {
          try {
            regexp[MATCH] = false;
            return "/./"[METHOD_NAME](regexp);
          } catch (error2) {}
        }
        return false;
      };
    }
  });

  // node_modules/core-js/modules/es.string.includes.js
  var require_es_string_includes = __commonJS({
    "node_modules/core-js/modules/es.string.includes.js": function node_modules_coreJs_modules_esStringIncludesJs() {
      "use strict";

      var $ = require_export();
      var uncurryThis = require_function_uncurry_this();
      var notARegExp = require_not_a_regexp();
      var requireObjectCoercible = require_require_object_coercible();
      var toString = require_to_string();
      var correctIsRegExpLogic = require_correct_is_regexp_logic();
      var stringIndexOf = uncurryThis("".indexOf);
      $({
        target: "String",
        proto: true,
        forced: !correctIsRegExpLogic("includes")
      }, {
        includes: function includes(searchString) {
          return !!~stringIndexOf(toString(requireObjectCoercible(this)), toString(notARegExp(searchString)), arguments.length > 1 ? arguments[1] : void 0);
        }
      });
    }
  });

  // node_modules/core-js/es/string/includes.js
  var require_includes2 = __commonJS({
    "node_modules/core-js/es/string/includes.js": function node_modules_coreJs_es_string_includesJs(exports, module) {
      "use strict";

      require_es_string_includes();
      var entryUnbind = require_entry_unbind();
      module.exports = entryUnbind("String", "includes");
    }
  });

  // node_modules/core-js/modules/es.string.starts-with.js
  var require_es_string_starts_with = __commonJS({
    "node_modules/core-js/modules/es.string.starts-with.js": function node_modules_coreJs_modules_esStringStartsWithJs() {
      "use strict";

      var $ = require_export();
      var uncurryThis = require_function_uncurry_this_clause();
      var getOwnPropertyDescriptor = require_object_get_own_property_descriptor().f;
      var toLength = require_to_length();
      var toString = require_to_string();
      var notARegExp = require_not_a_regexp();
      var requireObjectCoercible = require_require_object_coercible();
      var correctIsRegExpLogic = require_correct_is_regexp_logic();
      var IS_PURE = require_is_pure();
      var stringSlice = uncurryThis("".slice);
      var min = Math.min;
      var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic("startsWith");
      var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function () {
        var descriptor = getOwnPropertyDescriptor(String.prototype, "startsWith");
        return descriptor && !descriptor.writable;
      }();
      $({
        target: "String",
        proto: true,
        forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC
      }, {
        startsWith: function startsWith(searchString) {
          var that = toString(requireObjectCoercible(this));
          notARegExp(searchString);
          var search2 = toString(searchString);
          var index2 = toLength(min(arguments.length > 1 ? arguments[1] : void 0, that.length));
          return stringSlice(that, index2, index2 + search2.length) === search2;
        }
      });
    }
  });

  // node_modules/core-js/es/string/starts-with.js
  var require_starts_with = __commonJS({
    "node_modules/core-js/es/string/starts-with.js": function node_modules_coreJs_es_string_startsWithJs(exports, module) {
      "use strict";

      require_es_string_starts_with();
      var entryUnbind = require_entry_unbind();
      module.exports = entryUnbind("String", "startsWith");
    }
  });

  // node_modules/core-js/modules/es.string.ends-with.js
  var require_es_string_ends_with = __commonJS({
    "node_modules/core-js/modules/es.string.ends-with.js": function node_modules_coreJs_modules_esStringEndsWithJs() {
      "use strict";

      var $ = require_export();
      var uncurryThis = require_function_uncurry_this_clause();
      var getOwnPropertyDescriptor = require_object_get_own_property_descriptor().f;
      var toLength = require_to_length();
      var toString = require_to_string();
      var notARegExp = require_not_a_regexp();
      var requireObjectCoercible = require_require_object_coercible();
      var correctIsRegExpLogic = require_correct_is_regexp_logic();
      var IS_PURE = require_is_pure();
      var slice = uncurryThis("".slice);
      var min = Math.min;
      var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic("endsWith");
      var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function () {
        var descriptor = getOwnPropertyDescriptor(String.prototype, "endsWith");
        return descriptor && !descriptor.writable;
      }();
      $({
        target: "String",
        proto: true,
        forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC
      }, {
        endsWith: function endsWith(searchString) {
          var that = toString(requireObjectCoercible(this));
          notARegExp(searchString);
          var search2 = toString(searchString);
          var endPosition = arguments.length > 1 ? arguments[1] : void 0;
          var len = that.length;
          var end = endPosition === void 0 ? len : min(toLength(endPosition), len);
          return slice(that, end - search2.length, end) === search2;
        }
      });
    }
  });

  // node_modules/core-js/es/string/ends-with.js
  var require_ends_with = __commonJS({
    "node_modules/core-js/es/string/ends-with.js": function node_modules_coreJs_es_string_endsWithJs(exports, module) {
      "use strict";

      require_es_string_ends_with();
      var entryUnbind = require_entry_unbind();
      module.exports = entryUnbind("String", "endsWith");
    }
  });

  // node_modules/core-js/internals/string-repeat.js
  var require_string_repeat = __commonJS({
    "node_modules/core-js/internals/string-repeat.js": function node_modules_coreJs_internals_stringRepeatJs(exports, module) {
      "use strict";

      var toIntegerOrInfinity = require_to_integer_or_infinity();
      var toString = require_to_string();
      var requireObjectCoercible = require_require_object_coercible();
      var $RangeError = RangeError;
      var floor = Math.floor;
      module.exports = function repeat(count) {
        var str = toString(requireObjectCoercible(this));
        var result = "";
        var n = toIntegerOrInfinity(count);
        if (n < 0 || n === Infinity) throw new $RangeError("Wrong number of repetitions");
        for (; n > 0; (n = floor(n / 2)) && (str += str)) if (n % 2) result += str;
        return result;
      };
    }
  });

  // node_modules/core-js/internals/string-pad.js
  var require_string_pad = __commonJS({
    "node_modules/core-js/internals/string-pad.js": function node_modules_coreJs_internals_stringPadJs(exports, module) {
      "use strict";

      var uncurryThis = require_function_uncurry_this();
      var toLength = require_to_length();
      var toString = require_to_string();
      var $repeat = require_string_repeat();
      var requireObjectCoercible = require_require_object_coercible();
      var repeat = uncurryThis($repeat);
      var stringSlice = uncurryThis("".slice);
      var ceil = Math.ceil;
      var createMethod = function createMethod(IS_END) {
        return function ($this, maxLength, fillString) {
          var S = toString(requireObjectCoercible($this));
          var intMaxLength = toLength(maxLength);
          var stringLength = S.length;
          if (intMaxLength <= stringLength) return S;
          var fillStr = fillString === void 0 ? " " : toString(fillString);
          var fillLen, stringFiller;
          if (fillStr === "") return S;
          fillLen = intMaxLength - stringLength;
          stringFiller = repeat(fillStr, ceil(fillLen / fillStr.length));
          if (stringFiller.length > fillLen) stringFiller = stringSlice(stringFiller, 0, fillLen);
          return IS_END ? S + stringFiller : stringFiller + S;
        };
      };
      module.exports = {
        // `String.prototype.padStart` method
        // https://tc39.es/ecma262/#sec-string.prototype.padstart
        start: createMethod(false),
        // `String.prototype.padEnd` method
        // https://tc39.es/ecma262/#sec-string.prototype.padend
        end: createMethod(true)
      };
    }
  });

  // node_modules/core-js/internals/string-pad-webkit-bug.js
  var require_string_pad_webkit_bug = __commonJS({
    "node_modules/core-js/internals/string-pad-webkit-bug.js": function node_modules_coreJs_internals_stringPadWebkitBugJs(exports, module) {
      "use strict";

      var userAgent = require_environment_user_agent();
      module.exports = /Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(userAgent);
    }
  });

  // node_modules/core-js/modules/es.string.pad-start.js
  var require_es_string_pad_start = __commonJS({
    "node_modules/core-js/modules/es.string.pad-start.js": function node_modules_coreJs_modules_esStringPadStartJs() {
      "use strict";

      var $ = require_export();
      var $padStart = require_string_pad().start;
      var WEBKIT_BUG = require_string_pad_webkit_bug();
      $({
        target: "String",
        proto: true,
        forced: WEBKIT_BUG
      }, {
        padStart: function padStart(maxLength) {
          return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : void 0);
        }
      });
    }
  });

  // node_modules/core-js/es/string/pad-start.js
  var require_pad_start = __commonJS({
    "node_modules/core-js/es/string/pad-start.js": function node_modules_coreJs_es_string_padStartJs(exports, module) {
      "use strict";

      require_es_string_pad_start();
      var entryUnbind = require_entry_unbind();
      module.exports = entryUnbind("String", "padStart");
    }
  });

  // node_modules/core-js/modules/es.string.repeat.js
  var require_es_string_repeat = __commonJS({
    "node_modules/core-js/modules/es.string.repeat.js": function node_modules_coreJs_modules_esStringRepeatJs() {
      "use strict";

      var $ = require_export();
      var repeat = require_string_repeat();
      $({
        target: "String",
        proto: true
      }, {
        repeat: repeat
      });
    }
  });

  // node_modules/core-js/es/string/repeat.js
  var require_repeat = __commonJS({
    "node_modules/core-js/es/string/repeat.js": function node_modules_coreJs_es_string_repeatJs(exports, module) {
      "use strict";

      require_es_string_repeat();
      var entryUnbind = require_entry_unbind();
      module.exports = entryUnbind("String", "repeat");
    }
  });

  // node_modules/core-js/internals/number-is-finite.js
  var require_number_is_finite = __commonJS({
    "node_modules/core-js/internals/number-is-finite.js": function node_modules_coreJs_internals_numberIsFiniteJs(exports, module) {
      "use strict";

      var globalThis2 = require_global_this();
      var globalIsFinite = globalThis2.isFinite;
      module.exports = Number.isFinite || function isFinite2(it) {
        return typeof it == "number" && globalIsFinite(it);
      };
    }
  });

  // node_modules/core-js/modules/es.number.is-finite.js
  var require_es_number_is_finite = __commonJS({
    "node_modules/core-js/modules/es.number.is-finite.js": function node_modules_coreJs_modules_esNumberIsFiniteJs() {
      "use strict";

      var $ = require_export();
      var numberIsFinite = require_number_is_finite();
      $({
        target: "Number",
        stat: true
      }, {
        isFinite: numberIsFinite
      });
    }
  });

  // node_modules/core-js/es/number/is-finite.js
  var require_is_finite = __commonJS({
    "node_modules/core-js/es/number/is-finite.js": function node_modules_coreJs_es_number_isFiniteJs(exports, module) {
      "use strict";

      require_es_number_is_finite();
      var path = require_path();
      module.exports = path.Number.isFinite;
    }
  });

  // node_modules/core-js/modules/es.number.is-nan.js
  var require_es_number_is_nan = __commonJS({
    "node_modules/core-js/modules/es.number.is-nan.js": function node_modules_coreJs_modules_esNumberIsNanJs() {
      "use strict";

      var $ = require_export();
      $({
        target: "Number",
        stat: true
      }, {
        isNaN: function isNaN2(number) {
          return number !== number;
        }
      });
    }
  });

  // node_modules/core-js/es/number/is-nan.js
  var require_is_nan = __commonJS({
    "node_modules/core-js/es/number/is-nan.js": function node_modules_coreJs_es_number_isNanJs(exports, module) {
      "use strict";

      require_es_number_is_nan();
      var path = require_path();
      module.exports = path.Number.isNaN;
    }
  });

  // node_modules/qrcode-generator/qrcode.js
  var require_qrcode = __commonJS({
    "node_modules/qrcode-generator/qrcode.js": function node_modules_qrcodeGenerator_qrcodeJs(exports, module) {
      var qrcode2 = function () {
        var qrcode3 = function qrcode3(typeNumber, errorCorrectionLevel) {
          var PAD0 = 236;
          var PAD1 = 17;
          var _typeNumber = typeNumber;
          var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
          var _modules = null;
          var _moduleCount = 0;
          var _dataCache = null;
          var _dataList = [];
          var _this = {};
          var makeImpl = function makeImpl(test, maskPattern) {
            _moduleCount = _typeNumber * 4 + 17;
            _modules = function (moduleCount) {
              var modules = new Array(moduleCount);
              for (var row = 0; row < moduleCount; row += 1) {
                modules[row] = new Array(moduleCount);
                for (var col = 0; col < moduleCount; col += 1) {
                  modules[row][col] = null;
                }
              }
              return modules;
            }(_moduleCount);
            setupPositionProbePattern(0, 0);
            setupPositionProbePattern(_moduleCount - 7, 0);
            setupPositionProbePattern(0, _moduleCount - 7);
            setupPositionAdjustPattern();
            setupTimingPattern();
            setupTypeInfo(test, maskPattern);
            if (_typeNumber >= 7) {
              setupTypeNumber(test);
            }
            if (_dataCache == null) {
              _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
            }
            mapData(_dataCache, maskPattern);
          };
          var setupPositionProbePattern = function setupPositionProbePattern(row, col) {
            for (var r = -1; r <= 7; r += 1) {
              if (row + r <= -1 || _moduleCount <= row + r) continue;
              for (var c = -1; c <= 7; c += 1) {
                if (col + c <= -1 || _moduleCount <= col + c) continue;
                if (0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
                  _modules[row + r][col + c] = true;
                } else {
                  _modules[row + r][col + c] = false;
                }
              }
            }
          };
          var getBestMaskPattern = function getBestMaskPattern() {
            var minLostPoint = 0;
            var pattern = 0;
            for (var i = 0; i < 8; i += 1) {
              makeImpl(true, i);
              var lostPoint = QRUtil.getLostPoint(_this);
              if (i == 0 || minLostPoint > lostPoint) {
                minLostPoint = lostPoint;
                pattern = i;
              }
            }
            return pattern;
          };
          var setupTimingPattern = function setupTimingPattern() {
            for (var r = 8; r < _moduleCount - 8; r += 1) {
              if (_modules[r][6] != null) {
                continue;
              }
              _modules[r][6] = r % 2 == 0;
            }
            for (var c = 8; c < _moduleCount - 8; c += 1) {
              if (_modules[6][c] != null) {
                continue;
              }
              _modules[6][c] = c % 2 == 0;
            }
          };
          var setupPositionAdjustPattern = function setupPositionAdjustPattern() {
            var pos = QRUtil.getPatternPosition(_typeNumber);
            for (var i = 0; i < pos.length; i += 1) {
              for (var j = 0; j < pos.length; j += 1) {
                var row = pos[i];
                var col = pos[j];
                if (_modules[row][col] != null) {
                  continue;
                }
                for (var r = -2; r <= 2; r += 1) {
                  for (var c = -2; c <= 2; c += 1) {
                    if (r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0) {
                      _modules[row + r][col + c] = true;
                    } else {
                      _modules[row + r][col + c] = false;
                    }
                  }
                }
              }
            }
          };
          var setupTypeNumber = function setupTypeNumber(test) {
            var bits = QRUtil.getBCHTypeNumber(_typeNumber);
            for (var i = 0; i < 18; i += 1) {
              var mod = !test && (bits >> i & 1) == 1;
              _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
            }
            for (var i = 0; i < 18; i += 1) {
              var mod = !test && (bits >> i & 1) == 1;
              _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
            }
          };
          var setupTypeInfo = function setupTypeInfo(test, maskPattern) {
            var data = _errorCorrectionLevel << 3 | maskPattern;
            var bits = QRUtil.getBCHTypeInfo(data);
            for (var i = 0; i < 15; i += 1) {
              var mod = !test && (bits >> i & 1) == 1;
              if (i < 6) {
                _modules[i][8] = mod;
              } else if (i < 8) {
                _modules[i + 1][8] = mod;
              } else {
                _modules[_moduleCount - 15 + i][8] = mod;
              }
            }
            for (var i = 0; i < 15; i += 1) {
              var mod = !test && (bits >> i & 1) == 1;
              if (i < 8) {
                _modules[8][_moduleCount - i - 1] = mod;
              } else if (i < 9) {
                _modules[8][15 - i - 1 + 1] = mod;
              } else {
                _modules[8][15 - i - 1] = mod;
              }
            }
            _modules[_moduleCount - 8][8] = !test;
          };
          var mapData = function mapData(data, maskPattern) {
            var inc = -1;
            var row = _moduleCount - 1;
            var bitIndex = 7;
            var byteIndex = 0;
            var maskFunc = QRUtil.getMaskFunction(maskPattern);
            for (var col = _moduleCount - 1; col > 0; col -= 2) {
              if (col == 6) col -= 1;
              while (true) {
                for (var c = 0; c < 2; c += 1) {
                  if (_modules[row][col - c] == null) {
                    var dark = false;
                    if (byteIndex < data.length) {
                      dark = (data[byteIndex] >>> bitIndex & 1) == 1;
                    }
                    var mask = maskFunc(row, col - c);
                    if (mask) {
                      dark = !dark;
                    }
                    _modules[row][col - c] = dark;
                    bitIndex -= 1;
                    if (bitIndex == -1) {
                      byteIndex += 1;
                      bitIndex = 7;
                    }
                  }
                }
                row += inc;
                if (row < 0 || _moduleCount <= row) {
                  row -= inc;
                  inc = -inc;
                  break;
                }
              }
            }
          };
          var createBytes = function createBytes(buffer2, rsBlocks) {
            var offset = 0;
            var maxDcCount = 0;
            var maxEcCount = 0;
            var dcdata = new Array(rsBlocks.length);
            var ecdata = new Array(rsBlocks.length);
            for (var r = 0; r < rsBlocks.length; r += 1) {
              var dcCount = rsBlocks[r].dataCount;
              var ecCount = rsBlocks[r].totalCount - dcCount;
              maxDcCount = Math.max(maxDcCount, dcCount);
              maxEcCount = Math.max(maxEcCount, ecCount);
              dcdata[r] = new Array(dcCount);
              for (var i = 0; i < dcdata[r].length; i += 1) {
                dcdata[r][i] = 255 & buffer2.getBuffer()[i + offset];
              }
              offset += dcCount;
              var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
              var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);
              var modPoly = rawPoly.mod(rsPoly);
              ecdata[r] = new Array(rsPoly.getLength() - 1);
              for (var i = 0; i < ecdata[r].length; i += 1) {
                var modIndex = i + modPoly.getLength() - ecdata[r].length;
                ecdata[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
              }
            }
            var totalCodeCount = 0;
            for (var i = 0; i < rsBlocks.length; i += 1) {
              totalCodeCount += rsBlocks[i].totalCount;
            }
            var data = new Array(totalCodeCount);
            var index2 = 0;
            for (var i = 0; i < maxDcCount; i += 1) {
              for (var r = 0; r < rsBlocks.length; r += 1) {
                if (i < dcdata[r].length) {
                  data[index2] = dcdata[r][i];
                  index2 += 1;
                }
              }
            }
            for (var i = 0; i < maxEcCount; i += 1) {
              for (var r = 0; r < rsBlocks.length; r += 1) {
                if (i < ecdata[r].length) {
                  data[index2] = ecdata[r][i];
                  index2 += 1;
                }
              }
            }
            return data;
          };
          var createData = function createData(typeNumber2, errorCorrectionLevel2, dataList) {
            var rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, errorCorrectionLevel2);
            var buffer2 = qrBitBuffer();
            for (var i = 0; i < dataList.length; i += 1) {
              var data = dataList[i];
              buffer2.put(data.getMode(), 4);
              buffer2.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
              data.write(buffer2);
            }
            var totalDataCount = 0;
            for (var i = 0; i < rsBlocks.length; i += 1) {
              totalDataCount += rsBlocks[i].dataCount;
            }
            if (buffer2.getLengthInBits() > totalDataCount * 8) {
              throw "code length overflow. (" + buffer2.getLengthInBits() + ">" + totalDataCount * 8 + ")";
            }
            if (buffer2.getLengthInBits() + 4 <= totalDataCount * 8) {
              buffer2.put(0, 4);
            }
            while (buffer2.getLengthInBits() % 8 != 0) {
              buffer2.putBit(false);
            }
            while (true) {
              if (buffer2.getLengthInBits() >= totalDataCount * 8) {
                break;
              }
              buffer2.put(PAD0, 8);
              if (buffer2.getLengthInBits() >= totalDataCount * 8) {
                break;
              }
              buffer2.put(PAD1, 8);
            }
            return createBytes(buffer2, rsBlocks);
          };
          _this.addData = function (data, mode) {
            mode = mode || "Byte";
            var newData = null;
            switch (mode) {
              case "Numeric":
                newData = qrNumber(data);
                break;
              case "Alphanumeric":
                newData = qrAlphaNum(data);
                break;
              case "Byte":
                newData = qr8BitByte(data);
                break;
              case "Kanji":
                newData = qrKanji(data);
                break;
              default:
                throw "mode:" + mode;
            }
            _dataList.push(newData);
            _dataCache = null;
          };
          _this.isDark = function (row, col) {
            if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
              throw row + "," + col;
            }
            return _modules[row][col];
          };
          _this.getModuleCount = function () {
            return _moduleCount;
          };
          _this.make = function () {
            if (_typeNumber < 1) {
              var typeNumber2 = 1;
              for (; typeNumber2 < 40; typeNumber2++) {
                var rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, _errorCorrectionLevel);
                var buffer2 = qrBitBuffer();
                for (var i = 0; i < _dataList.length; i++) {
                  var data = _dataList[i];
                  buffer2.put(data.getMode(), 4);
                  buffer2.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
                  data.write(buffer2);
                }
                var totalDataCount = 0;
                for (var i = 0; i < rsBlocks.length; i++) {
                  totalDataCount += rsBlocks[i].dataCount;
                }
                if (buffer2.getLengthInBits() <= totalDataCount * 8) {
                  break;
                }
              }
              _typeNumber = typeNumber2;
            }
            makeImpl(false, getBestMaskPattern());
          };
          _this.createTableTag = function (cellSize, margin) {
            cellSize = cellSize || 2;
            margin = typeof margin == "undefined" ? cellSize * 4 : margin;
            var qrHtml = "";
            qrHtml += '<table style="';
            qrHtml += " border-width: 0px; border-style: none;";
            qrHtml += " border-collapse: collapse;";
            qrHtml += " padding: 0px; margin: " + margin + "px;";
            qrHtml += '">';
            qrHtml += "<tbody>";
            for (var r = 0; r < _this.getModuleCount(); r += 1) {
              qrHtml += "<tr>";
              for (var c = 0; c < _this.getModuleCount(); c += 1) {
                qrHtml += '<td style="';
                qrHtml += " border-width: 0px; border-style: none;";
                qrHtml += " border-collapse: collapse;";
                qrHtml += " padding: 0px; margin: 0px;";
                qrHtml += " width: " + cellSize + "px;";
                qrHtml += " height: " + cellSize + "px;";
                qrHtml += " background-color: ";
                qrHtml += _this.isDark(r, c) ? "#000000" : "#ffffff";
                qrHtml += ";";
                qrHtml += '"/>';
              }
              qrHtml += "</tr>";
            }
            qrHtml += "</tbody>";
            qrHtml += "</table>";
            return qrHtml;
          };
          _this.createSvgTag = function (cellSize, margin, alt, title) {
            var opts = {};
            if (_typeof(arguments[0]) == "object") {
              opts = arguments[0];
              cellSize = opts.cellSize;
              margin = opts.margin;
              alt = opts.alt;
              title = opts.title;
            }
            cellSize = cellSize || 2;
            margin = typeof margin == "undefined" ? cellSize * 4 : margin;
            alt = typeof alt === "string" ? {
              text: alt
            } : alt || {};
            alt.text = alt.text || null;
            alt.id = alt.text ? alt.id || "qrcode-description" : null;
            title = typeof title === "string" ? {
              text: title
            } : title || {};
            title.text = title.text || null;
            title.id = title.text ? title.id || "qrcode-title" : null;
            var size = _this.getModuleCount() * cellSize + margin * 2;
            var c,
              mc,
              r,
              mr,
              qrSvg = "",
              rect;
            rect = "l" + cellSize + ",0 0," + cellSize + " -" + cellSize + ",0 0,-" + cellSize + "z ";
            qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
            qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : "";
            qrSvg += ' viewBox="0 0 ' + size + " " + size + '" ';
            qrSvg += ' preserveAspectRatio="xMinYMin meet"';
            qrSvg += title.text || alt.text ? ' role="img" aria-labelledby="' + escapeXml([title.id, alt.id].join(" ").trim()) + '"' : "";
            qrSvg += ">";
            qrSvg += title.text ? '<title id="' + escapeXml(title.id) + '">' + escapeXml(title.text) + "</title>" : "";
            qrSvg += alt.text ? '<description id="' + escapeXml(alt.id) + '">' + escapeXml(alt.text) + "</description>" : "";
            qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
            qrSvg += '<path d="';
            for (r = 0; r < _this.getModuleCount(); r += 1) {
              mr = r * cellSize + margin;
              for (c = 0; c < _this.getModuleCount(); c += 1) {
                if (_this.isDark(r, c)) {
                  mc = c * cellSize + margin;
                  qrSvg += "M" + mc + "," + mr + rect;
                }
              }
            }
            qrSvg += '" stroke="transparent" fill="black"/>';
            qrSvg += "</svg>";
            return qrSvg;
          };
          _this.createDataURL = function (cellSize, margin) {
            cellSize = cellSize || 2;
            margin = typeof margin == "undefined" ? cellSize * 4 : margin;
            var size = _this.getModuleCount() * cellSize + margin * 2;
            var min = margin;
            var max = size - margin;
            return createDataURL(size, size, function (x, y) {
              if (min <= x && x < max && min <= y && y < max) {
                var c = Math.floor((x - min) / cellSize);
                var r = Math.floor((y - min) / cellSize);
                return _this.isDark(r, c) ? 0 : 1;
              } else {
                return 1;
              }
            });
          };
          _this.createImgTag = function (cellSize, margin, alt) {
            cellSize = cellSize || 2;
            margin = typeof margin == "undefined" ? cellSize * 4 : margin;
            var size = _this.getModuleCount() * cellSize + margin * 2;
            var img = "";
            img += "<img";
            img += ' src="';
            img += _this.createDataURL(cellSize, margin);
            img += '"';
            img += ' width="';
            img += size;
            img += '"';
            img += ' height="';
            img += size;
            img += '"';
            if (alt) {
              img += ' alt="';
              img += escapeXml(alt);
              img += '"';
            }
            img += "/>";
            return img;
          };
          var escapeXml = function escapeXml(s) {
            var escaped = "";
            for (var i = 0; i < s.length; i += 1) {
              var c = s.charAt(i);
              switch (c) {
                case "<":
                  escaped += "&lt;";
                  break;
                case ">":
                  escaped += "&gt;";
                  break;
                case "&":
                  escaped += "&amp;";
                  break;
                case '"':
                  escaped += "&quot;";
                  break;
                default:
                  escaped += c;
                  break;
              }
            }
            return escaped;
          };
          var _createHalfASCII = function _createHalfASCII(margin) {
            var cellSize = 1;
            margin = typeof margin == "undefined" ? cellSize * 2 : margin;
            var size = _this.getModuleCount() * cellSize + margin * 2;
            var min = margin;
            var max = size - margin;
            var y, x, r1, r2, p;
            var blocks = {
              "██": "█",
              "█ ": "▀",
              " █": "▄",
              "  ": " "
            };
            var blocksLastLineNoMargin = {
              "██": "▀",
              "█ ": "▀",
              " █": " ",
              "  ": " "
            };
            var ascii = "";
            for (y = 0; y < size; y += 2) {
              r1 = Math.floor((y - min) / cellSize);
              r2 = Math.floor((y + 1 - min) / cellSize);
              for (x = 0; x < size; x += 1) {
                p = "█";
                if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
                  p = " ";
                }
                if (min <= x && x < max && min <= y + 1 && y + 1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
                  p += " ";
                } else {
                  p += "█";
                }
                ascii += margin < 1 && y + 1 >= max ? blocksLastLineNoMargin[p] : blocks[p];
              }
              ascii += "\n";
            }
            if (size % 2 && margin > 0) {
              return ascii.substring(0, ascii.length - size - 1) + Array(size + 1).join("▀");
            }
            return ascii.substring(0, ascii.length - 1);
          };
          _this.createASCII = function (cellSize, margin) {
            cellSize = cellSize || 1;
            if (cellSize < 2) {
              return _createHalfASCII(margin);
            }
            cellSize -= 1;
            margin = typeof margin == "undefined" ? cellSize * 2 : margin;
            var size = _this.getModuleCount() * cellSize + margin * 2;
            var min = margin;
            var max = size - margin;
            var y, x, r, p;
            var white = Array(cellSize + 1).join("██");
            var black = Array(cellSize + 1).join("  ");
            var ascii = "";
            var line = "";
            for (y = 0; y < size; y += 1) {
              r = Math.floor((y - min) / cellSize);
              line = "";
              for (x = 0; x < size; x += 1) {
                p = 1;
                if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
                  p = 0;
                }
                line += p ? white : black;
              }
              for (r = 0; r < cellSize; r += 1) {
                ascii += line + "\n";
              }
            }
            return ascii.substring(0, ascii.length - 1);
          };
          _this.renderTo2dContext = function (context, cellSize) {
            cellSize = cellSize || 2;
            var length = _this.getModuleCount();
            for (var row = 0; row < length; row++) {
              for (var col = 0; col < length; col++) {
                context.fillStyle = _this.isDark(row, col) ? "black" : "white";
                context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
              }
            }
          };
          return _this;
        };
        qrcode3.stringToBytesFuncs = {
          "default": function _default(s) {
            var bytes = [];
            for (var i = 0; i < s.length; i += 1) {
              var c = s.charCodeAt(i);
              bytes.push(c & 255);
            }
            return bytes;
          }
        };
        qrcode3.stringToBytes = qrcode3.stringToBytesFuncs["default"];
        qrcode3.createStringToBytes = function (unicodeData, numChars) {
          var unicodeMap = function () {
            var bin = base64DecodeInputStream(unicodeData);
            var read = function read() {
              var b = bin.read();
              if (b == -1) throw "eof";
              return b;
            };
            var count = 0;
            var unicodeMap2 = {};
            while (true) {
              var b0 = bin.read();
              if (b0 == -1) break;
              var b1 = read();
              var b2 = read();
              var b3 = read();
              var k = String.fromCharCode(b0 << 8 | b1);
              var v = b2 << 8 | b3;
              unicodeMap2[k] = v;
              count += 1;
            }
            if (count != numChars) {
              throw count + " != " + numChars;
            }
            return unicodeMap2;
          }();
          var unknownChar = "?".charCodeAt(0);
          return function (s) {
            var bytes = [];
            for (var i = 0; i < s.length; i += 1) {
              var c = s.charCodeAt(i);
              if (c < 128) {
                bytes.push(c);
              } else {
                var b = unicodeMap[s.charAt(i)];
                if (typeof b == "number") {
                  if ((b & 255) == b) {
                    bytes.push(b);
                  } else {
                    bytes.push(b >>> 8);
                    bytes.push(b & 255);
                  }
                } else {
                  bytes.push(unknownChar);
                }
              }
            }
            return bytes;
          };
        };
        var QRMode = {
          MODE_NUMBER: 1 << 0,
          MODE_ALPHA_NUM: 1 << 1,
          MODE_8BIT_BYTE: 1 << 2,
          MODE_KANJI: 1 << 3
        };
        var QRErrorCorrectionLevel = {
          L: 1,
          M: 0,
          Q: 3,
          H: 2
        };
        var QRMaskPattern = {
          PATTERN000: 0,
          PATTERN001: 1,
          PATTERN010: 2,
          PATTERN011: 3,
          PATTERN100: 4,
          PATTERN101: 5,
          PATTERN110: 6,
          PATTERN111: 7
        };
        var QRUtil = function () {
          var PATTERN_POSITION_TABLE = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]];
          var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
          var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
          var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
          var _this = {};
          var getBCHDigit = function getBCHDigit(data) {
            var digit = 0;
            while (data != 0) {
              digit += 1;
              data >>>= 1;
            }
            return digit;
          };
          _this.getBCHTypeInfo = function (data) {
            var d = data << 10;
            while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
              d ^= G15 << getBCHDigit(d) - getBCHDigit(G15);
            }
            return (data << 10 | d) ^ G15_MASK;
          };
          _this.getBCHTypeNumber = function (data) {
            var d = data << 12;
            while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
              d ^= G18 << getBCHDigit(d) - getBCHDigit(G18);
            }
            return data << 12 | d;
          };
          _this.getPatternPosition = function (typeNumber) {
            return PATTERN_POSITION_TABLE[typeNumber - 1];
          };
          _this.getMaskFunction = function (maskPattern) {
            switch (maskPattern) {
              case QRMaskPattern.PATTERN000:
                return function (i, j) {
                  return (i + j) % 2 == 0;
                };
              case QRMaskPattern.PATTERN001:
                return function (i, j) {
                  return i % 2 == 0;
                };
              case QRMaskPattern.PATTERN010:
                return function (i, j) {
                  return j % 3 == 0;
                };
              case QRMaskPattern.PATTERN011:
                return function (i, j) {
                  return (i + j) % 3 == 0;
                };
              case QRMaskPattern.PATTERN100:
                return function (i, j) {
                  return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
                };
              case QRMaskPattern.PATTERN101:
                return function (i, j) {
                  return i * j % 2 + i * j % 3 == 0;
                };
              case QRMaskPattern.PATTERN110:
                return function (i, j) {
                  return (i * j % 2 + i * j % 3) % 2 == 0;
                };
              case QRMaskPattern.PATTERN111:
                return function (i, j) {
                  return (i * j % 3 + (i + j) % 2) % 2 == 0;
                };
              default:
                throw "bad maskPattern:" + maskPattern;
            }
          };
          _this.getErrorCorrectPolynomial = function (errorCorrectLength) {
            var a = qrPolynomial([1], 0);
            for (var i = 0; i < errorCorrectLength; i += 1) {
              a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
            }
            return a;
          };
          _this.getLengthInBits = function (mode, type) {
            if (1 <= type && type < 10) {
              switch (mode) {
                case QRMode.MODE_NUMBER:
                  return 10;
                case QRMode.MODE_ALPHA_NUM:
                  return 9;
                case QRMode.MODE_8BIT_BYTE:
                  return 8;
                case QRMode.MODE_KANJI:
                  return 8;
                default:
                  throw "mode:" + mode;
              }
            } else if (type < 27) {
              switch (mode) {
                case QRMode.MODE_NUMBER:
                  return 12;
                case QRMode.MODE_ALPHA_NUM:
                  return 11;
                case QRMode.MODE_8BIT_BYTE:
                  return 16;
                case QRMode.MODE_KANJI:
                  return 10;
                default:
                  throw "mode:" + mode;
              }
            } else if (type < 41) {
              switch (mode) {
                case QRMode.MODE_NUMBER:
                  return 14;
                case QRMode.MODE_ALPHA_NUM:
                  return 13;
                case QRMode.MODE_8BIT_BYTE:
                  return 16;
                case QRMode.MODE_KANJI:
                  return 12;
                default:
                  throw "mode:" + mode;
              }
            } else {
              throw "type:" + type;
            }
          };
          _this.getLostPoint = function (qrcode4) {
            var moduleCount = qrcode4.getModuleCount();
            var lostPoint = 0;
            for (var row = 0; row < moduleCount; row += 1) {
              for (var col = 0; col < moduleCount; col += 1) {
                var sameCount = 0;
                var dark = qrcode4.isDark(row, col);
                for (var r = -1; r <= 1; r += 1) {
                  if (row + r < 0 || moduleCount <= row + r) {
                    continue;
                  }
                  for (var c = -1; c <= 1; c += 1) {
                    if (col + c < 0 || moduleCount <= col + c) {
                      continue;
                    }
                    if (r == 0 && c == 0) {
                      continue;
                    }
                    if (dark == qrcode4.isDark(row + r, col + c)) {
                      sameCount += 1;
                    }
                  }
                }
                if (sameCount > 5) {
                  lostPoint += 3 + sameCount - 5;
                }
              }
            }
            ;
            for (var row = 0; row < moduleCount - 1; row += 1) {
              for (var col = 0; col < moduleCount - 1; col += 1) {
                var count = 0;
                if (qrcode4.isDark(row, col)) count += 1;
                if (qrcode4.isDark(row + 1, col)) count += 1;
                if (qrcode4.isDark(row, col + 1)) count += 1;
                if (qrcode4.isDark(row + 1, col + 1)) count += 1;
                if (count == 0 || count == 4) {
                  lostPoint += 3;
                }
              }
            }
            for (var row = 0; row < moduleCount; row += 1) {
              for (var col = 0; col < moduleCount - 6; col += 1) {
                if (qrcode4.isDark(row, col) && !qrcode4.isDark(row, col + 1) && qrcode4.isDark(row, col + 2) && qrcode4.isDark(row, col + 3) && qrcode4.isDark(row, col + 4) && !qrcode4.isDark(row, col + 5) && qrcode4.isDark(row, col + 6)) {
                  lostPoint += 40;
                }
              }
            }
            for (var col = 0; col < moduleCount; col += 1) {
              for (var row = 0; row < moduleCount - 6; row += 1) {
                if (qrcode4.isDark(row, col) && !qrcode4.isDark(row + 1, col) && qrcode4.isDark(row + 2, col) && qrcode4.isDark(row + 3, col) && qrcode4.isDark(row + 4, col) && !qrcode4.isDark(row + 5, col) && qrcode4.isDark(row + 6, col)) {
                  lostPoint += 40;
                }
              }
            }
            var darkCount = 0;
            for (var col = 0; col < moduleCount; col += 1) {
              for (var row = 0; row < moduleCount; row += 1) {
                if (qrcode4.isDark(row, col)) {
                  darkCount += 1;
                }
              }
            }
            var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
            lostPoint += ratio * 10;
            return lostPoint;
          };
          return _this;
        }();
        var QRMath = function () {
          var EXP_TABLE = new Array(256);
          var LOG_TABLE = new Array(256);
          for (var i = 0; i < 8; i += 1) {
            EXP_TABLE[i] = 1 << i;
          }
          for (var i = 8; i < 256; i += 1) {
            EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
          }
          for (var i = 0; i < 255; i += 1) {
            LOG_TABLE[EXP_TABLE[i]] = i;
          }
          var _this = {};
          _this.glog = function (n) {
            if (n < 1) {
              throw "glog(" + n + ")";
            }
            return LOG_TABLE[n];
          };
          _this.gexp = function (n) {
            while (n < 0) {
              n += 255;
            }
            while (n >= 256) {
              n -= 255;
            }
            return EXP_TABLE[n];
          };
          return _this;
        }();
        function qrPolynomial(num, shift) {
          if (typeof num.length == "undefined") {
            throw num.length + "/" + shift;
          }
          var _num = function () {
            var offset = 0;
            while (offset < num.length && num[offset] == 0) {
              offset += 1;
            }
            var _num2 = new Array(num.length - offset + shift);
            for (var i = 0; i < num.length - offset; i += 1) {
              _num2[i] = num[i + offset];
            }
            return _num2;
          }();
          var _this = {};
          _this.getAt = function (index2) {
            return _num[index2];
          };
          _this.getLength = function () {
            return _num.length;
          };
          _this.multiply = function (e) {
            var num2 = new Array(_this.getLength() + e.getLength() - 1);
            for (var i = 0; i < _this.getLength(); i += 1) {
              for (var j = 0; j < e.getLength(); j += 1) {
                num2[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i)) + QRMath.glog(e.getAt(j)));
              }
            }
            return qrPolynomial(num2, 0);
          };
          _this.mod = function (e) {
            if (_this.getLength() - e.getLength() < 0) {
              return _this;
            }
            var ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e.getAt(0));
            var num2 = new Array(_this.getLength());
            for (var i = 0; i < _this.getLength(); i += 1) {
              num2[i] = _this.getAt(i);
            }
            for (var i = 0; i < e.getLength(); i += 1) {
              num2[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio);
            }
            return qrPolynomial(num2, 0).mod(e);
          };
          return _this;
        }
        ;
        var QRRSBlock = function () {
          var RS_BLOCK_TABLE = [
          // L
          // M
          // Q
          // H
          // 1
          [1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9],
          // 2
          [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16],
          // 3
          [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13],
          // 4
          [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9],
          // 5
          [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12],
          // 6
          [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15],
          // 7
          [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14],
          // 8
          [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15],
          // 9
          [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13],
          // 10
          [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16],
          // 11
          [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13],
          // 12
          [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15],
          // 13
          [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12],
          // 14
          [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13],
          // 15
          [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12, 7, 37, 13],
          // 16
          [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16],
          // 17
          [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15],
          // 18
          [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15],
          // 19
          [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14],
          // 20
          [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16],
          // 21
          [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17],
          // 22
          [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13],
          // 23
          [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16],
          // 24
          [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17],
          // 25
          [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16],
          // 26
          [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17],
          // 27
          [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16],
          // 28
          [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16],
          // 29
          [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16],
          // 30
          [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16],
          // 31
          [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16],
          // 32
          [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16],
          // 33
          [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16],
          // 34
          [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17],
          // 35
          [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16],
          // 36
          [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16],
          // 37
          [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16],
          // 38
          [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16],
          // 39
          [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16],
          // 40
          [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]];
          var qrRSBlock = function qrRSBlock(totalCount, dataCount) {
            var _this2 = {};
            _this2.totalCount = totalCount;
            _this2.dataCount = dataCount;
            return _this2;
          };
          var _this = {};
          var getRsBlockTable = function getRsBlockTable(typeNumber, errorCorrectionLevel) {
            switch (errorCorrectionLevel) {
              case QRErrorCorrectionLevel.L:
                return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
              case QRErrorCorrectionLevel.M:
                return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
              case QRErrorCorrectionLevel.Q:
                return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
              case QRErrorCorrectionLevel.H:
                return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
              default:
                return void 0;
            }
          };
          _this.getRSBlocks = function (typeNumber, errorCorrectionLevel) {
            var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);
            if (typeof rsBlock == "undefined") {
              throw "bad rs block @ typeNumber:" + typeNumber + "/errorCorrectionLevel:" + errorCorrectionLevel;
            }
            var length = rsBlock.length / 3;
            var list2 = [];
            for (var i = 0; i < length; i += 1) {
              var count = rsBlock[i * 3 + 0];
              var totalCount = rsBlock[i * 3 + 1];
              var dataCount = rsBlock[i * 3 + 2];
              for (var j = 0; j < count; j += 1) {
                list2.push(qrRSBlock(totalCount, dataCount));
              }
            }
            return list2;
          };
          return _this;
        }();
        var qrBitBuffer = function qrBitBuffer() {
          var _buffer = [];
          var _length = 0;
          var _this = {};
          _this.getBuffer = function () {
            return _buffer;
          };
          _this.getAt = function (index2) {
            var bufIndex = Math.floor(index2 / 8);
            return (_buffer[bufIndex] >>> 7 - index2 % 8 & 1) == 1;
          };
          _this.put = function (num, length) {
            for (var i = 0; i < length; i += 1) {
              _this.putBit((num >>> length - i - 1 & 1) == 1);
            }
          };
          _this.getLengthInBits = function () {
            return _length;
          };
          _this.putBit = function (bit) {
            var bufIndex = Math.floor(_length / 8);
            if (_buffer.length <= bufIndex) {
              _buffer.push(0);
            }
            if (bit) {
              _buffer[bufIndex] |= 128 >>> _length % 8;
            }
            _length += 1;
          };
          return _this;
        };
        var qrNumber = function qrNumber(data) {
          var _mode = QRMode.MODE_NUMBER;
          var _data = data;
          var _this = {};
          _this.getMode = function () {
            return _mode;
          };
          _this.getLength = function (buffer2) {
            return _data.length;
          };
          _this.write = function (buffer2) {
            var data2 = _data;
            var i = 0;
            while (i + 2 < data2.length) {
              buffer2.put(strToNum(data2.substring(i, i + 3)), 10);
              i += 3;
            }
            if (i < data2.length) {
              if (data2.length - i == 1) {
                buffer2.put(strToNum(data2.substring(i, i + 1)), 4);
              } else if (data2.length - i == 2) {
                buffer2.put(strToNum(data2.substring(i, i + 2)), 7);
              }
            }
          };
          var strToNum = function strToNum(s) {
            var num = 0;
            for (var i = 0; i < s.length; i += 1) {
              num = num * 10 + chatToNum(s.charAt(i));
            }
            return num;
          };
          var chatToNum = function chatToNum(c) {
            if ("0" <= c && c <= "9") {
              return c.charCodeAt(0) - "0".charCodeAt(0);
            }
            throw "illegal char :" + c;
          };
          return _this;
        };
        var qrAlphaNum = function qrAlphaNum(data) {
          var _mode = QRMode.MODE_ALPHA_NUM;
          var _data = data;
          var _this = {};
          _this.getMode = function () {
            return _mode;
          };
          _this.getLength = function (buffer2) {
            return _data.length;
          };
          _this.write = function (buffer2) {
            var s = _data;
            var i = 0;
            while (i + 1 < s.length) {
              buffer2.put(getCode(s.charAt(i)) * 45 + getCode(s.charAt(i + 1)), 11);
              i += 2;
            }
            if (i < s.length) {
              buffer2.put(getCode(s.charAt(i)), 6);
            }
          };
          var getCode = function getCode(c) {
            if ("0" <= c && c <= "9") {
              return c.charCodeAt(0) - "0".charCodeAt(0);
            } else if ("A" <= c && c <= "Z") {
              return c.charCodeAt(0) - "A".charCodeAt(0) + 10;
            } else {
              switch (c) {
                case " ":
                  return 36;
                case "$":
                  return 37;
                case "%":
                  return 38;
                case "*":
                  return 39;
                case "+":
                  return 40;
                case "-":
                  return 41;
                case ".":
                  return 42;
                case "/":
                  return 43;
                case ":":
                  return 44;
                default:
                  throw "illegal char :" + c;
              }
            }
          };
          return _this;
        };
        var qr8BitByte = function qr8BitByte(data) {
          var _mode = QRMode.MODE_8BIT_BYTE;
          var _data = data;
          var _bytes = qrcode3.stringToBytes(data);
          var _this = {};
          _this.getMode = function () {
            return _mode;
          };
          _this.getLength = function (buffer2) {
            return _bytes.length;
          };
          _this.write = function (buffer2) {
            for (var i = 0; i < _bytes.length; i += 1) {
              buffer2.put(_bytes[i], 8);
            }
          };
          return _this;
        };
        var qrKanji = function qrKanji(data) {
          var _mode = QRMode.MODE_KANJI;
          var _data = data;
          var stringToBytes = qrcode3.stringToBytesFuncs["SJIS"];
          if (!stringToBytes) {
            throw "sjis not supported.";
          }
          !function (c, code) {
            var test = stringToBytes(c);
            if (test.length != 2 || (test[0] << 8 | test[1]) != code) {
              throw "sjis not supported.";
            }
          }("友", 38726);
          var _bytes = stringToBytes(data);
          var _this = {};
          _this.getMode = function () {
            return _mode;
          };
          _this.getLength = function (buffer2) {
            return ~~(_bytes.length / 2);
          };
          _this.write = function (buffer2) {
            var data2 = _bytes;
            var i = 0;
            while (i + 1 < data2.length) {
              var c = (255 & data2[i]) << 8 | 255 & data2[i + 1];
              if (33088 <= c && c <= 40956) {
                c -= 33088;
              } else if (57408 <= c && c <= 60351) {
                c -= 49472;
              } else {
                throw "illegal char at " + (i + 1) + "/" + c;
              }
              c = (c >>> 8 & 255) * 192 + (c & 255);
              buffer2.put(c, 13);
              i += 2;
            }
            if (i < data2.length) {
              throw "illegal char at " + (i + 1);
            }
          };
          return _this;
        };
        var byteArrayOutputStream = function byteArrayOutputStream() {
          var _bytes = [];
          var _this = {};
          _this.writeByte = function (b) {
            _bytes.push(b & 255);
          };
          _this.writeShort = function (i) {
            _this.writeByte(i);
            _this.writeByte(i >>> 8);
          };
          _this.writeBytes = function (b, off, len) {
            off = off || 0;
            len = len || b.length;
            for (var i = 0; i < len; i += 1) {
              _this.writeByte(b[i + off]);
            }
          };
          _this.writeString = function (s) {
            for (var i = 0; i < s.length; i += 1) {
              _this.writeByte(s.charCodeAt(i));
            }
          };
          _this.toByteArray = function () {
            return _bytes;
          };
          _this.toString = function () {
            var s = "";
            s += "[";
            for (var i = 0; i < _bytes.length; i += 1) {
              if (i > 0) {
                s += ",";
              }
              s += _bytes[i];
            }
            s += "]";
            return s;
          };
          return _this;
        };
        var base64EncodeOutputStream = function base64EncodeOutputStream() {
          var _buffer = 0;
          var _buflen = 0;
          var _length = 0;
          var _base64 = "";
          var _this = {};
          var writeEncoded = function writeEncoded(b) {
            _base64 += String.fromCharCode(encode(b & 63));
          };
          var encode = function encode(n) {
            if (n < 0) {} else if (n < 26) {
              return 65 + n;
            } else if (n < 52) {
              return 97 + (n - 26);
            } else if (n < 62) {
              return 48 + (n - 52);
            } else if (n == 62) {
              return 43;
            } else if (n == 63) {
              return 47;
            }
            throw "n:" + n;
          };
          _this.writeByte = function (n) {
            _buffer = _buffer << 8 | n & 255;
            _buflen += 8;
            _length += 1;
            while (_buflen >= 6) {
              writeEncoded(_buffer >>> _buflen - 6);
              _buflen -= 6;
            }
          };
          _this.flush = function () {
            if (_buflen > 0) {
              writeEncoded(_buffer << 6 - _buflen);
              _buffer = 0;
              _buflen = 0;
            }
            if (_length % 3 != 0) {
              var padlen = 3 - _length % 3;
              for (var i = 0; i < padlen; i += 1) {
                _base64 += "=";
              }
            }
          };
          _this.toString = function () {
            return _base64;
          };
          return _this;
        };
        var base64DecodeInputStream = function base64DecodeInputStream(str) {
          var _str = str;
          var _pos = 0;
          var _buffer = 0;
          var _buflen = 0;
          var _this = {};
          _this.read = function () {
            while (_buflen < 8) {
              if (_pos >= _str.length) {
                if (_buflen == 0) {
                  return -1;
                }
                throw "unexpected end of file./" + _buflen;
              }
              var c = _str.charAt(_pos);
              _pos += 1;
              if (c == "=") {
                _buflen = 0;
                return -1;
              } else if (c.match(/^\s$/)) {
                continue;
              }
              _buffer = _buffer << 6 | decode(c.charCodeAt(0));
              _buflen += 6;
            }
            var n = _buffer >>> _buflen - 8 & 255;
            _buflen -= 8;
            return n;
          };
          var decode = function decode(c) {
            if (65 <= c && c <= 90) {
              return c - 65;
            } else if (97 <= c && c <= 122) {
              return c - 97 + 26;
            } else if (48 <= c && c <= 57) {
              return c - 48 + 52;
            } else if (c == 43) {
              return 62;
            } else if (c == 47) {
              return 63;
            } else {
              throw "c:" + c;
            }
          };
          return _this;
        };
        var gifImage = function gifImage(width, height) {
          var _width = width;
          var _height = height;
          var _data = new Array(width * height);
          var _this = {};
          _this.setPixel = function (x, y, pixel) {
            _data[y * _width + x] = pixel;
          };
          _this.write = function (out) {
            out.writeString("GIF87a");
            out.writeShort(_width);
            out.writeShort(_height);
            out.writeByte(128);
            out.writeByte(0);
            out.writeByte(0);
            out.writeByte(0);
            out.writeByte(0);
            out.writeByte(0);
            out.writeByte(255);
            out.writeByte(255);
            out.writeByte(255);
            out.writeString(",");
            out.writeShort(0);
            out.writeShort(0);
            out.writeShort(_width);
            out.writeShort(_height);
            out.writeByte(0);
            var lzwMinCodeSize = 2;
            var raster = getLZWRaster(lzwMinCodeSize);
            out.writeByte(lzwMinCodeSize);
            var offset = 0;
            while (raster.length - offset > 255) {
              out.writeByte(255);
              out.writeBytes(raster, offset, 255);
              offset += 255;
            }
            out.writeByte(raster.length - offset);
            out.writeBytes(raster, offset, raster.length - offset);
            out.writeByte(0);
            out.writeString(";");
          };
          var bitOutputStream = function bitOutputStream(out) {
            var _out = out;
            var _bitLength = 0;
            var _bitBuffer = 0;
            var _this2 = {};
            _this2.write = function (data, length) {
              if (data >>> length != 0) {
                throw "length over";
              }
              while (_bitLength + length >= 8) {
                _out.writeByte(255 & (data << _bitLength | _bitBuffer));
                length -= 8 - _bitLength;
                data >>>= 8 - _bitLength;
                _bitBuffer = 0;
                _bitLength = 0;
              }
              _bitBuffer = data << _bitLength | _bitBuffer;
              _bitLength = _bitLength + length;
            };
            _this2.flush = function () {
              if (_bitLength > 0) {
                _out.writeByte(_bitBuffer);
              }
            };
            return _this2;
          };
          var getLZWRaster = function getLZWRaster(lzwMinCodeSize) {
            var clearCode = 1 << lzwMinCodeSize;
            var endCode = (1 << lzwMinCodeSize) + 1;
            var bitLength = lzwMinCodeSize + 1;
            var table = lzwTable();
            for (var i = 0; i < clearCode; i += 1) {
              table.add(String.fromCharCode(i));
            }
            table.add(String.fromCharCode(clearCode));
            table.add(String.fromCharCode(endCode));
            var byteOut = byteArrayOutputStream();
            var bitOut = bitOutputStream(byteOut);
            bitOut.write(clearCode, bitLength);
            var dataIndex = 0;
            var s = String.fromCharCode(_data[dataIndex]);
            dataIndex += 1;
            while (dataIndex < _data.length) {
              var c = String.fromCharCode(_data[dataIndex]);
              dataIndex += 1;
              if (table.contains(s + c)) {
                s = s + c;
              } else {
                bitOut.write(table.indexOf(s), bitLength);
                if (table.size() < 4095) {
                  if (table.size() == 1 << bitLength) {
                    bitLength += 1;
                  }
                  table.add(s + c);
                }
                s = c;
              }
            }
            bitOut.write(table.indexOf(s), bitLength);
            bitOut.write(endCode, bitLength);
            bitOut.flush();
            return byteOut.toByteArray();
          };
          var lzwTable = function lzwTable() {
            var _map = {};
            var _size = 0;
            var _this2 = {};
            _this2.add = function (key3) {
              if (_this2.contains(key3)) {
                throw "dup key:" + key3;
              }
              _map[key3] = _size;
              _size += 1;
            };
            _this2.size = function () {
              return _size;
            };
            _this2.indexOf = function (key3) {
              return _map[key3];
            };
            _this2.contains = function (key3) {
              return typeof _map[key3] != "undefined";
            };
            return _this2;
          };
          return _this;
        };
        var createDataURL = function createDataURL(width, height, getPixel) {
          var gif = gifImage(width, height);
          for (var y = 0; y < height; y += 1) {
            for (var x = 0; x < width; x += 1) {
              gif.setPixel(x, y, getPixel(x, y));
            }
          }
          var b = byteArrayOutputStream();
          gif.write(b);
          var base64 = base64EncodeOutputStream();
          var bytes = b.toByteArray();
          for (var i = 0; i < bytes.length; i += 1) {
            base64.writeByte(bytes[i]);
          }
          base64.flush();
          return "data:image/gif;base64," + base64;
        };
        return qrcode3;
      }();
      !function () {
        qrcode2.stringToBytesFuncs["UTF-8"] = function (s) {
          function toUTF8Array(str) {
            var utf82 = [];
            for (var i = 0; i < str.length; i++) {
              var charcode = str.charCodeAt(i);
              if (charcode < 128) utf82.push(charcode);else if (charcode < 2048) {
                utf82.push(192 | charcode >> 6, 128 | charcode & 63);
              } else if (charcode < 55296 || charcode >= 57344) {
                utf82.push(224 | charcode >> 12, 128 | charcode >> 6 & 63, 128 | charcode & 63);
              } else {
                i++;
                charcode = 65536 + ((charcode & 1023) << 10 | str.charCodeAt(i) & 1023);
                utf82.push(240 | charcode >> 18, 128 | charcode >> 12 & 63, 128 | charcode >> 6 & 63, 128 | charcode & 63);
              }
            }
            return utf82;
          }
          return toUTF8Array(s);
        };
      }();
      (function (factory) {
        if (typeof define === "function" && define.amd) {
          define([], factory);
        } else if (_typeof(exports) === "object") {
          module.exports = factory();
        }
      })(function () {
        return qrcode2;
      });
    }
  });

  // src/js/polyfills.js
  var import_assign = __toESM(require_assign(), 1);
  var import_entries = __toESM(require_entries(), 1);
  var import_values = __toESM(require_values(), 1);
  var import_from = __toESM(require_from(), 1);
  var import_find = __toESM(require_find(), 1);
  var import_find_index = __toESM(require_find_index(), 1);
  var import_includes = __toESM(require_includes(), 1);
  var import_fill = __toESM(require_fill(), 1);
  var import_includes2 = __toESM(require_includes2(), 1);
  var import_starts_with = __toESM(require_starts_with(), 1);
  var import_ends_with = __toESM(require_ends_with(), 1);
  var import_pad_start = __toESM(require_pad_start(), 1);
  var import_repeat = __toESM(require_repeat(), 1);
  var import_is_finite = __toESM(require_is_finite(), 1);
  var import_is_nan = __toESM(require_is_nan(), 1);
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.webkitMatchesSelector;
  }
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (sel) {
      var el = this;
      while (el && el.nodeType === 1) {
        if (el.matches(sel)) return el;
        el = el.parentNode;
      }
      return null;
    };
  }

  // src/js/lib/log.js
  var remoteUrl = "";
  var buffer = [];
  var flushing = false;
  function redact(text) {
    return text.replace(/((?:realdebrid|alldebrid|premiumize|debridlink|easydebrid|offcloud|torbox|putio|apikey|api_key|token|authKey)(?:=|%3D|:|\/))[A-Za-z0-9._-]{8,}/gi, "$1***");
  }
  function send(level, args) {
    var raw = Array.prototype.map.call(args, function (a) {
      if (a instanceof Error) return a.message + (a.stack ? "\n" + a.stack : "");
      if (_typeof(a) === "object") {
        try {
          return JSON.stringify(a);
        } catch (e) {
          return String(a);
        }
      }
      return String(a);
    }).join(" ");
    var text = redact(raw);
    try {
      (console[level] || console.log).call(console, "[kai] " + text);
    } catch (e) {}
    if (!remoteUrl) return;
    buffer.push({
      t: Date.now(),
      level: level,
      text: text
    });
    if (buffer.length > 200) buffer.shift();
    flush();
  }
  function flush() {
    if (flushing || !buffer.length || !remoteUrl) return;
    flushing = true;
    var batch2 = buffer.splice(0, buffer.length);
    var xhr2 = new XMLHttpRequest();
    xhr2.open("POST", remoteUrl, true);
    xhr2.setRequestHeader("Content-Type", "application/json");
    xhr2.timeout = 5e3;
    xhr2.onloadend = function () {
      flushing = false;
      if (buffer.length) setTimeout(flush, 200);
    };
    xhr2.send(JSON.stringify(batch2));
  }
  var log = {
    info: function info() {
      send("log", arguments);
    },
    warn: function warn() {
      send("warn", arguments);
    },
    error: function error() {
      send("error", arguments);
    },
    setRemote: function setRemote(url2) {
      remoteUrl = url2 || "";
      flush();
    }
  };
  window.onerror = function (msg, src, line, col, err) {
    log.error("ERRO JS:", msg, (src || "") + ":" + line + ":" + col, err && err.stack ? err.stack : "");
  };

  // src/js/lib/i18n-en.js
  var EN = {
    // Navegação e geral
    "Início": "Home",
    "Buscar": "Search",
    "Biblioteca": "Library",
    "Ajustes": "Settings",
    "Cancelar": "Cancel",
    "Voltar": "Back",
    "Continuar": "Continue",
    "Pular": "Skip",
    "Sair": "Exit",
    "Nada por aqui.": "Nothing here.",
    "Carregando...": "Loading...",
    "Ver tudo": "See all",
    "Novos episódios": "New episodes",
    "Séries da sua biblioteca, últimos 7 dias": "Series in your library, last 7 days",
    "Pessoas": "People",
    "Tema de cores": "Colour theme",
    "Cor de destaque do app": "The app's highlight colour",
    "Dourado": "Gold",
    "Assistir agora": "Play now",
    "A seguir": "Up next",
    "Começa em {n}s": "Starts in {n}s",
    "Ligue uma legenda primeiro.": "Turn on subtitles first.",
    "O ajuste funciona com legendas de addons (OpenSubtitles etc.).": "Sync works with add-on subtitles (OpenSubtitles etc.).",
    "Você já tem a versão mais nova.": "You're on the newest version.",
    "Atualização disponível ({date}): {msg}": "Update available ({date}): {msg}",
    "Atualizar agora": "Update now",
    "Atualizando... o app vai recarregar.": "Updating... the app will reload.",
    "A atualização ainda está chegando. Tente de novo em alguns minutos.": "The update is still on its way. Try again in a few minutes.",
    "Atualizações": "Updates",
    "Versão instalada": "Installed version",
    "Versão mais nova no GitHub": "Newest version on GitHub",
    "Verificando...": "Checking...",
    "nova!": "new!",
    "em dia": "up to date",
    "sem conexão": "no connection",
    "Atualização disponível: Ajustes → Procurar atualização": "Update available: Settings → Check for updates",
    "Descrições em árabe, perfis de atores, calendário de filmes, logos e elenco com fotos (grátis em themoviedb.org)": "Arabic descriptions, actor profiles, movie calendar, logos and cast photos (free at themoviedb.org)",
    "Trailer": "Trailer",
    "Voltar fecha o trailer": "Back closes the trailer",
    "Nascimento: {date}": "Born: {date}",
    "Falecimento: {date}": "Died: {date}",
    "{n} anos": "{n} years old",
    "Local de nascimento: {place}": "Birthplace: {place}",
    "Direção": "Directing",
    "Atuação": "Acting",
    "Sem biografia disponível.": "No biography available.",
    "Esse título ainda não tem página no Stremio.": "This title doesn't have a Stremio page yet.",
    "Não foi possível carregar este perfil.": "Couldn't load this profile.",
    "Controle pelo celular": "Phone remote",
    "O controle pelo celular não está rodando. Feche o app e abra de novo pelo TizenBrew.": "The phone remote isn't running. Close the app and open it again from TizenBrew.",
    "Aponte a câmera do celular para o código": "Point your phone's camera at the code",
    "Ou abra no navegador do celular (mesmo Wi-Fi):": "Or open this in your phone's browser (same Wi-Fi):",
    "PIN: {pin}": "PIN: {pin}",
    "Selecione um campo de texto na TV primeiro.": "Select a text box on the TV first.",
    "Árabe quando houver": "Arabic when available",
    "Calendário": "Calendar",
    "Streaming": "Streaming",
    "As datas de streaming dos filmes vêm do TMDB: coloque sua chave grátis do TMDB em Ajustes.": "Movie streaming dates come from TMDB: add your free TMDB key in Settings.",
    "Nenhum filme chega ao streaming neste dia.": "No movies arrive on streaming this day.",
    "Esse filme ainda não tem página no Stremio.": "This movie doesn't have a Stremio page yet.",
    "Escolha inteligente": "Smart Choice",
    "Assistir já toca a melhor fonte; o botão Fontes mostra a lista": "Watch plays the best source right away; the Sources button shows the list",
    "Escolha inteligente: procurando a melhor fonte...": "Smart Choice: finding the best source...",
    "aperte uma seta para escolher você": "press an arrow to choose yourself",
    "Escolha inteligente: nenhuma fonte que a TV toque. Escolha na lista.": "Smart Choice: no source the TV can play. Pick one from the list.",
    "Essa fonte não tocou. Tentando outra...": "That source didn't play. Trying another...",
    "carregando...": "loading...",
    "Sair do Stremio Kai?": "Exit Stremio Kai?",
    "Desconhecido": "Unknown",
    "Desligado": "Off",
    "Desligada": "Off",
    "Automático": "Automatic",
    // Perfis
    "Perfil": "Profile",
    "Perfis": "Profiles",
    "Perfil atual": "Current profile",
    "Trocar para este perfil": "Switch to this profile",
    "+ Adicionar perfil": "+ Add profile",
    "Adicionar perfil": "Add profile",
    "Com outra conta Stremio (histórico separado)": "With another Stremio account (separate history)",
    "Gerenciar perfis": "Manage profiles",
    "Nome, cor, apagar": "Name, color, delete",
    "Quem está assistindo?": "Who's watching?",
    "Cada perfil tem sua própria conta Stremio, com histórico e biblioteca separados.": "Each profile has its own Stremio account, with separate history and library.",
    "Nome do novo perfil": "New profile name",
    "Criar perfil": "Create profile",
    "Ex.: Ana, Pedro, Sala": "E.g.: Anna, Peter, Living room",
    "Digite um nome para o perfil.": "Type a name for the profile.",
    "Já existe um perfil com esse nome.": "A profile with this name already exists.",
    "Nome do perfil": "Profile name",
    "Nome do perfil salvo": "Profile name saved",
    "Este perfil usa a conta Stremio abaixo": "This profile uses the Stremio account below",
    "Cor do perfil": "Profile color",
    "Roxo": "Purple",
    "Rosa": "Pink",
    "Verde-água": "Teal",
    "Laranja": "Orange",
    "Azul": "Blue",
    "Vermelho": "Red",
    "Verde": "Green",
    "Cinza": "Gray",
    "Trocar de perfil": "Switch profile",
    "{n} perfis nesta TV": "{n} profiles on this TV",
    "Para outra pessoa, com outra conta Stremio": "For someone else, with another Stremio account",
    'Perguntar "Quem está assistindo?" ao abrir': "Ask \"Who's watching?\" on launch",
    "Apagar este perfil": "Delete this profile",
    "Remove deste aparelho a conta e as preferências do perfil (a conta Stremio continua existindo)": "Removes the profile's account and preferences from this TV (the Stremio account itself is kept)",
    'Apagar o perfil "{name}" desta TV?': 'Delete profile "{name}" from this TV?',
    "Apagar": "Delete",
    // Assistente
    "PASSO {n} DE {total}": "STEP {n} OF {total}",
    "Bem-vindo! Quem vai usar este perfil?": "Welcome! Who will use this profile?",
    "Dê um nome ao perfil. Depois você pode criar outros perfis, cada um com a própria conta Stremio e histórico.": "Give this profile a name. Later you can create other profiles, each with its own Stremio account and history.",
    "Bem-vindo ao Stremio Kai": "Welcome to Stremio Kai",
    "Você já está conectado à sua conta Stremio. Seus addons e sua biblioteca já estão aqui.": "You're already signed in to Stremio. Your add-ons and library are here.",
    "Entre com a sua conta Stremio para trazer seus addons (Torrentio, debrid, Anime Kitsu...) e a biblioteca.": "Sign in with your Stremio account to bring your add-ons (Torrentio, debrid, Anime Kitsu...) and library.",
    "Entrar na conta": "Sign in",
    "Servidor de torrents no PC": "Torrent server on a PC",
    "Servidor conectado em {url}. Torrents liberados.": "Server connected at {url}. Torrents enabled.",
    "Para tocar torrents, deixe o stremio-service aberto num PC da rede. Links de debrid funcionam sem ele.": "To play torrents, keep stremio-service running on a PC on your network. Debrid links work without it.",
    "Procurar na rede": "Scan network",
    "Procurando o servidor na rede...": "Scanning the network for the server...",
    "Nenhum servidor encontrado. Você pode configurar depois em Ajustes.": "No server found. You can set it up later in Settings.",
    "Servidor encontrado em {ip}": "Server found at {ip}",
    "Servidor do PC conectado": "PC server connected",
    "Não foi possível procurar. Configure depois em Ajustes.": "Couldn't scan. Set it up later in Settings.",
    "Legendas": "Subtitles",
    "Em qual idioma o app deve ligar a legenda sozinho quando o áudio não for no seu idioma?": "Which subtitle language should turn on automatically when the audio is not in your language?",
    "Português (BR)": "Portuguese (BR)",
    "Inglês": "English",
    "Não ligar sozinho": "Don't turn on automatically",
    // Login
    "Gerando código...": "Generating code...",
    "E-mail": "E-mail",
    "Senha": "Password",
    "Entrar": "Sign in",
    "Entrar com o celular": "Sign in with your phone",
    "No celular ou PC, abra <b>link.stremio.com</b> e digite o código:": "On your phone or PC, open <b>link.stremio.com</b> and enter the code:",
    "Ou com e-mail": "Or with e-mail",
    "Use a mesma conta do Stremio. Seus addons e a biblioteca vêm junto.": "Use your Stremio account. Your add-ons and library come along.",
    "Aguardando confirmação...": "Waiting for confirmation...",
    "Não foi possível gerar o código. Use o e-mail ao lado.": "Couldn't generate a code. Use e-mail instead.",
    "Código expirou. Gerando outro...": "Code expired. Generating a new one...",
    "Preencha e-mail e senha.": "Enter your e-mail and password.",
    "Entrando...": "Signing in...",
    "Falha no login": "Sign-in failed",
    "Conectado à conta Stremio": "Signed in to Stremio",
    // Início, busca, biblioteca, calendário
    "Continuar assistindo": "Continue watching",
    "Carregando catálogos...": "Loading catalogs...",
    "Nenhum catálogo. Entre na sua conta em Ajustes.": "No catalogs. Sign in to your account in Settings.",
    "Erro ao carregar addons: {msg}": "Error loading add-ons: {msg}",
    "Filmes": "Movies",
    "Séries": "Series",
    "Canais": "Channels",
    "Assistir": "Watch",
    "Detalhes": "Details",
    "Buscar filmes e séries...": "Search movies and series...",
    "Digite pelo menos 2 letras e confirme no teclado.": "Type at least 2 letters and confirm on the keyboard.",
    'Buscando "{q}"...': 'Searching "{q}"...',
    "Nenhum addon com busca instalado.": "No add-on with search installed.",
    'Nada encontrado para "{q}".': 'Nothing found for "{q}".',
    "Tudo": "All",
    "Sua biblioteca está vazia.": "Your library is empty.",
    "Entre na sua conta em Ajustes para ver a biblioteca.": "Sign in to your account in Settings to see your library.",
    "Carregando biblioteca...": "Loading library...",
    "Hoje": "Today",
    "Amanhã": "Tomorrow",
    "Ontem": "Yesterday",
    "Domingo": "Sunday",
    "Segunda": "Monday",
    "Terça": "Tuesday",
    "Quarta": "Wednesday",
    "Quinta": "Thursday",
    "Sexta": "Friday",
    "Sábado": "Saturday",
    "Buscando lançamentos...": "Loading releases...",
    "Nenhum episódio neste dia.": "No episodes on this day.",
    "Abrindo {name}...": "Opening {name}...",
    "Esse anime não foi encontrado nos seus addons (instale o Anime Kitsu).": "This anime was not found in your add-ons (install Anime Kitsu).",
    "Não foi possível carregar o calendário: {msg}": "Couldn't load the calendar: {msg}",
    // Detalhes e fontes
    "{n} temporadas": "{n} seasons",
    "{n} temporada": "{n} season",
    "Direção: ": "Director: ",
    "Elenco: ": "Cast: ",
    "Na biblioteca": "In library",
    "Removido da biblioteca": "Removed from library",
    "Adicionado à biblioteca": "Added to library",
    "Episódios": "Episodes",
    "Especiais": "Specials",
    "Temporada {n}": "Season {n}",
    "Episódio {n}": "Episode {n}",
    "Episódio": "Episode",
    "parou em {time}": "stopped at {time}",
    "Fontes": "Sources",
    "Todos": "All",
    "Todos ▾": "All ▾",
    "Buscando fontes nos addons...": "Searching add-ons for sources...",
    "Nenhum addon de streams instalado (ex.: Torrentio). Instale pela sua conta Stremio.": "No stream add-on installed (e.g. Torrentio). Install one in your Stremio account.",
    "Servidor do PC não conectado: só links diretos": "PC server not connected: direct links only",
    "{n} addon(s) ainda carregando": "{n} add-on(s) still loading",
    "{n} fontes": "{n} sources",
    "Mostrar fontes de": "Show sources from",
    "Nenhuma fonte encontrada.": "No sources found.",
    "Não suportado na TV": "Not supported on TV",
    "Torrent · via PC": "Torrent · via PC",
    "Torrent · precisa do PC": "Torrent · needs PC",
    "Direto": "Direct",
    "Esse tipo de fonte não abre na TV.": "This kind of source doesn't open on the TV.",
    "Torrent precisa do stremio-service rodando no PC. Configure em Ajustes.": "Torrents need stremio-service running on a PC. Set it up in Settings.",
    "Continuar de onde parou?": "Resume where you left off?",
    "Continuar de {time}": "Resume from {time}",
    "Começar do início": "Start from the beginning",
    "Não foi possível abrir": "Couldn't open",
    "Detalhes não encontrados": "Details not found",
    "Nenhum addon fornece detalhes para {id}": "No add-on provides details for {id}",
    "Público": "Audience",
    // Player
    "Áudio": "Audio",
    "Próximo": "Next",
    "Tocar": "Play",
    "Pausar": "Pause",
    "Pular abertura": "Skip intro",
    "Pular recapitulação": "Skip recap",
    "Próximo episódio": "Next episode",
    "Pular encerramento": "Skip credits",
    "Abertura pulada": "Intro skipped",
    "Recapitulação pulada": "Recap skipped",
    "Encerramento pulado": "Credits skipped",
    "Termina às {time}": "Ends at {time}",
    "O vídeo parou de carregar": "The video stopped loading",
    "Reabre o vídeo em {time}": "Reopens the video at {time}",
    "Tentar de novo": "Try again",
    "Escolher outra fonte": "Choose another source",
    "Reconectando ao vídeo...": "Reconnecting to the video...",
    "A TV não conseguiu tocar este arquivo diretamente.": "The TV couldn't play this file directly.",
    "A TV não conseguiu tocar este arquivo (formato ou codec não suportado).": "The TV couldn't play this file (unsupported format or codec).",
    "Tente outra fonte (de preferência MP4/MKV com H.264 ou HEVC e áudio AAC/AC3).": "Try another source (preferably MP4/MKV with H.264 or HEVC and AAC/AC3 audio).",
    "Converter no PC (experimental)": "Convert on PC (experimental)",
    "O servidor converte para HLS que a TV aceita": "The server converts to HLS the TV accepts",
    "Problema na reprodução": "Playback problem",
    "Troca de áudio indisponível agora.": "Audio switching unavailable right now.",
    "Falha ao trocar áudio: {msg}": "Failed to switch audio: {msg}",
    "Falha na legenda embutida: {msg}": "Embedded subtitle failed: {msg}",
    "Legenda: {lang}": "Subtitle: {lang}",
    "Não foi possível baixar a legenda.": "Couldn't download the subtitle.",
    "Lendo as faixas do arquivo...": "Reading the file's tracks...",
    "{n} canais": "{n} channels",
    "Só uma faixa de áudio.": "Only one audio track.",
    "Para listar as faixas, conecte o servidor do PC em Ajustes.": "To list tracks, connect the PC server in Settings.",
    "Embutida no arquivo": "Embedded in file",
    "Atraso da legenda: {n}s": "Subtitle delay: {n}s",
    "Ajustar sincronia": "Adjust sync",
    "Tamanho: {n}%": "Size: {n}%",
    "Carregando legendas...": "Loading subtitles...",
    "Nenhuma legenda.": "No subtitles.",
    "Atraso da legenda": "Subtitle delay",
    "Legenda aparece antes": "Subtitle shows earlier",
    "Legenda aparece depois": "Subtitle shows later",
    "Sem ajuste": "No adjustment",
    "Tamanho da legenda": "Subtitle size",
    "Essa fonte precisa do servidor do PC.": "This source needs the PC server.",
    "Procurando o próximo episódio...": "Looking for the next episode...",
    // nomes de idiomas
    "Português": "Portuguese",
    "Espanhol": "Spanish",
    "Japonês": "Japanese",
    "Francês": "French",
    "Alemão": "German",
    "Italiano": "Italian",
    "Coreano": "Korean",
    "Chinês": "Chinese",
    "Russo": "Russian",
    "Árabe": "Arabic",
    "Hindi": "Hindi",
    "Indefinido": "Undefined",
    // Ajustes
    "Automático (idioma da TV)": "Automatic (TV language)",
    "Conta Stremio": "Stremio account",
    "Conectado": "Signed in",
    "Addons e biblioteca sincronizados com a conta": "Add-ons and library synced with the account",
    "conta Stremio": "Stremio account",
    "Atualizar addons e biblioteca": "Refresh add-ons and library",
    "Busca de novo a lista de addons instalados": "Reloads the list of installed add-ons",
    "Atualizado": "Updated",
    "Erro: {msg}": "Error: {msg}",
    "Sair da conta": "Sign out",
    "Sair da conta Stremio?": "Sign out of Stremio?",
    "Traz seus addons (Torrentio, debrid...) e a biblioteca": "Brings your add-ons (Torrentio, debrid...) and library",
    "Servidor de streaming (PC)": "Streaming server (PC)",
    "não configurado": "not set",
    "conectado ✓": "connected ✓",
    "sem resposta": "no response",
    "Servidor conectado": "Server connected",
    "Servidor não respondeu em {url}": "Server did not respond at {url}",
    "Endereço do PC": "PC address",
    "Rode o stremio-service no PC (porta 11470). Status: {s}": "Run stremio-service on the PC (port 11470). Status: {s}",
    "Varre a rede local atrás do servidor": "Scans the local network for the server",
    "Procurando servidor na rede...": "Scanning the network for the server...",
    "Nenhum servidor encontrado. Ele está aberto no PC?": "No server found. Is it running on the PC?",
    "Falha na busca: {msg}": "Scan failed: {msg}",
    "Testar conexão": "Test connection",
    "Servidor OK": "Server OK",
    "Sem resposta de {url}": "No response from {url}",
    "Aparência (Kai)": "Appearance (Kai)",
    "Hero Banner": "Hero Banner",
    "Destaques no topo da tela inicial": "Highlights at the top of the home screen",
    "Fonte do Hero Banner": "Hero Banner source",
    "Cinemeta · Populares": "Cinemeta · Popular",
    "Cinemeta · Mais bem avaliados": "Cinemeta · Top rated",
    "MDBList · Tendências (Snoak)": "MDBList · Trending (Snoak)",
    "Tema OLED (preto puro)": "OLED theme (pure black)",
    "Fundo totalmente preto": "Fully black background",
    "Modo desempenho": "Performance mode",
    "Mais rápido na TV: sem animações, sem Novos episódios e sem sincronizar em segundo plano": "Faster on the TV: no animations, no New episodes and no background syncing",
    "Rolagem animada": "Animated scrolling",
    "Mais bonita, porém mais pesada na TV": "Prettier, but heavier on the TV",
    "Legendas e áudio": "Subtitles and audio",
    "Idioma da legenda": "Subtitle language",
    "Escolhida sozinha ao abrir o vídeo": "Picked automatically when a video opens",
    "Português (BR) e Português": "Portuguese (BR) and Portuguese",
    "Nenhum (não ligar sozinho)": "None (don't turn on automatically)",
    "Ligar legenda automaticamente": "Turn on subtitles automatically",
    "Se o áudio não estiver no seu idioma": "If the audio isn't in your language",
    "Áudio preferido": "Preferred audio",
    "Precisa do servidor do PC para ler as faixas": "Needs the PC server to read tracks",
    "Original do arquivo": "File's original",
    "Português (dublado) quando houver": "Portuguese (dubbed) when available",
    "Inglês quando houver": "English when available",
    "Japonês quando houver": "Japanese when available",
    "Aparência da legenda": "Subtitle appearance",
    "Oi. Meu nome é Peter Parker.": "Hi. My name is Peter Parker.",
    "Você não lembra de mim...": "You don't remember me...",
    "Fonte": "Font",
    "Vale para legendas de addons (OpenSubtitles etc.)": "Applies to add-on subtitles (OpenSubtitles etc.)",
    "Estilo": "Style",
    "Contorno, sombra ou caixa de fundo": "Outline, shadow or background box",
    "Cor do texto": "Text color",
    "Tamanho": "Size",
    "Posição": "Position",
    "Distância da borda de baixo": "Distance from the bottom edge",
    "Negrito": "Bold",
    "O Kai usa negrito": "Kai uses bold",
    "Legendas embutidas no arquivo são desenhadas pela própria TV: só cor, tamanho, posição e caixa se aplicam a elas.": "Subtitles embedded in the file are drawn by the TV itself: only color, size, position and box apply to them.",
    "Nata Sans (padrão Kai)": "Nata Sans (Kai default)",
    "Fonte da TV (LG)": "TV font (LG)",
    "Clássica (Arial)": "Classic (Arial)",
    "Contorno fino + sombra (Kai)": "Thin outline + shadow (Kai)",
    "Contorno grosso": "Thick outline",
    "Só sombra": "Shadow only",
    "Caixa de fundo": "Background box",
    "Branco": "White",
    "Amarelo": "Yellow",
    "Cinza claro": "Light gray",
    "Ciano": "Cyan",
    "Baixa": "Low",
    "Média": "Middle",
    "Alta": "High",
    "Player": "Player",
    "Pular abertura e encerramento": "Skip intros and credits",
    "IntroDB (séries e filmes) e AniSkip (animes)": "IntroDB (series and movies) and AniSkip (anime)",
    'Mostrar botão "Pular"': 'Show "Skip" button',
    "Pular automaticamente": "Skip automatically",
    "Mostrar botão": "Show button",
    "Metadados extras (opcional)": "Extra metadata (optional)",
    "Chave salva": "Key saved",
    "Chave removida": "Key removed",
    "Chave TMDB": "TMDB key",
    "Sinopses e títulos em PT-BR, logos e elenco com fotos (grátis em themoviedb.org)": "Localized synopses and titles, logos and cast photos (free at themoviedb.org)",
    "Chave MDBList": "MDBList key",
    "Notas do Rotten Tomatoes, Metacritic, Trakt e Letterboxd (grátis em mdblist.com)": "Rotten Tomatoes, Metacritic, Trakt and Letterboxd ratings (free at mdblist.com)",
    "Addons": "Add-ons",
    "Addons ativos": "Active add-ons",
    "Gerencie pela sua conta em web.stremio.com": "Manage them in your account at web.stremio.com",
    "Sem conta: Cinemeta, OpenSubtitles e os adicionados aqui": "No account: Cinemeta, OpenSubtitles and the ones added here",
    "{n} addon(s)": "{n} add-on(s)",
    "Instalar {name}": "Install {name}",
    "Catálogos e detalhes de animes (usado pelo calendário)": "Anime catalogs and details (used by the calendar)",
    "Legendas em português para quase tudo": "Subtitles for almost everything",
    "Cole a URL do manifest.json do addon": "Paste the add-on's manifest.json URL",
    "o addon": "the add-on",
    "Addon adicionado": "Add-on added",
    "Adicionar addon por URL": "Add add-on by URL",
    "Instala na sua conta Stremio": "Installs into your Stremio account",
    "Fica só nesta TV": "Stays on this TV only",
    "Entre na conta primeiro": "Sign in first",
    "Instalar {name} na sua conta Stremio?": "Install {name} into your Stremio account?",
    "Instalar": "Install",
    "Instalando...": "Installing...",
    "{name} instalado na sua conta": "{name} installed in your account",
    "Não foi possível instalar: {msg}": "Couldn't install: {msg}",
    "Esse addon já está instalado": "This add-on is already installed",
    "Manifest inválido": "Invalid manifest",
    "Sobre e depuração": "About and debugging",
    "Log remoto": "Remote log",
    "npm run logs no PC": "npm run logs on the PC",
    "Log remoto ligado": "Remote log on",
    "Enviando logs para o PC": "Sending logs to the PC",
    "Log remoto desligado": "Remote log off",
    "Versão": "Version",
    "Procurar atualização": "Check for update",
    "Baixa a versão nova do GitHub ({repo})": "Downloads the new version from GitHub ({repo})",
    "Procurando atualização...": "Checking for update...",
    "Você já está na versão mais nova (v{v}).": "You're on the latest version (v{v}).",
    "Versão {v} disponível": "Version {v} available",
    "Versão {v} disponível: Ajustes → Procurar atualização": "Version {v} available: Settings → Check for update",
    "Como atualizar": "How to update",
    "No PC: webOS Dev Manager → instalar o .ipk da release": "On the PC: webOS Dev Manager → install the release's .ipk",
    "Página da release": "Release page",
    "Instalar a versão {v}? O app vai fechar e reabrir.": "Install version {v}? The app will close and reopen.",
    "Atualizar": "Update",
    "Atualizado! Reabrindo...": "Updated! Reopening...",
    "Não foi possível atualizar: {msg}": "Couldn't update: {msg}",
    "Não foi possível verificar: {msg}": "Couldn't check: {msg}",
    "Baixando": "Downloading",
    "Conferindo o arquivo...": "Verifying the file...",
    "Falha na instalação": "Installation failed",
    "Release sem hash SHA-256": "Release has no SHA-256 hash",
    // Erros de rede e da conta
    "Erro da API Stremio": "Stremio API error",
    "Não foi possível gerar o código": "Couldn't generate the code",
    "Falha de rede em {url}": "Network error at {url}",
    "Tempo esgotado em {url}": "Timed out at {url}",
    "JSON inválido de {url}": "Invalid JSON from {url}",
    "HTTP {code} em {url}": "HTTP {code} at {url}",
    "Este link é torrent: configure o servidor do PC": "This link is a torrent: set up the PC server",
    "Magnet inválido": "Invalid magnet link",
    "Tipo de link não suportado na TV": "Link type not supported on the TV",
    "Usando o player do navegador nesta TV.": "Using the browser player on this TV.",
    "Áudio: {lang}": "Audio: {lang}",
    "Escolhido sozinho ao abrir o vídeo": "Picked automatically when the video opens",
    "Player de vídeo": "Video player",
    "O player da Samsung troca a faixa de áudio; o do navegador é o antigo": "Samsung's player can switch audio tracks; the browser player is the old one",
    "Samsung (AVPlay)": "Samsung (AVPlay)",
    "Samsung (AVPlay) · indisponível nesta TV": "Samsung (AVPlay) · not available on this TV",
    "Navegador (HTML5)": "Browser (HTML5)",
    "Rastreamento (Trakt e Simkl)": "Tracking (Trakt and Simkl)",
    "Conectado: {user}": "Connected: {user}",
    "Reconectar": "Reconnect",
    "Desconectado": "Not connected",
    "Sincroniza assistidos, progresso e Continuar assistindo com o Trakt": "Syncs watched history, progress and Continue watching with Trakt",
    "Sincroniza assistidos e progresso com o Simkl": "Syncs watched history and progress with Simkl",
    "Sincronizar agora": "Sync now",
    "Desconectar": "Disconnect",
    "Sincronizando...": "Syncing...",
    "Sincronizado": "Synced",
    "{name} desconectado": "{name} disconnected",
    "Preencha o Client ID e o Client Secret do Trakt abaixo.": "Fill in the Trakt Client ID and Client Secret below.",
    "Preencha o Client ID do Simkl abaixo.": "Fill in the Simkl Client ID below.",
    "Trakt Client ID": "Trakt Client ID",
    "Crie um app grátis em trakt.tv/oauth/applications (Redirect: urn:ietf:wg:oauth:2.0:oob)": "Create a free app at trakt.tv/oauth/applications (Redirect: urn:ietf:wg:oauth:2.0:oob)",
    "Trakt Client Secret": "Trakt Client Secret",
    "Do mesmo app do Trakt": "From the same Trakt app",
    "Simkl Client ID": "Simkl Client ID",
    "Crie um app grátis em simkl.com/settings/developer": "Create a free app at simkl.com/settings/developer",
    "Conectar {name}": "Connect {name}",
    "{name} conectado: {user}": "{name} connected: {user}",
    "{name} conectado": "{name} connected",
    "Código expirou. Abra de novo.": "The code expired. Open this again.",
    "Acesso negado no site.": "Access was denied on the website.",
    "Falhou: {msg}": "Failed: {msg}",
    "No celular ou PC, abra": "On your phone or PC, open",
    "e digite o código:": "and enter the code:",
    "Carregando coleção...": "Loading collection...",
    "Nenhum título encontrado nesta coleção.": "No titles found in this collection.",
    "Não foi possível carregar a coleção.": "Couldn't load the collection.",
    "{n} títulos": "{n} titles",
    "Coleções": "Collections",
    "Buscar outra coleção (ex.: Shrek, Rambo, Saw)...": "Search another collection (e.g. Shrek, Rambo, Saw)...",
    "Com uma chave TMDB em Ajustes, dá para buscar qualquer outra coleção de filmes.": "With a TMDB key in Settings you can search any other film collection.",
    "Nenhuma coleção encontrada.": "No collection found.",
    "Resultados": "Results",
    "Não foi possível buscar agora.": "Couldn't search right now.",
    "Assistidos: {done} de {n}": "Watched: {done} of {n}",
    "Ordem da história": "Story order",
    "Ordem de lançamento": "Release order",
    "Próximo: {title}": "Next: {title}",
    "Esconder assistidos": "Hide watched",
    "série": "series",
    "Você já assistiu tudo desta coleção.": "You've watched everything in this collection.",
    "Coleção": "Collection",
    "Favoritas": "Favorites",
    "Fixar no topo": "Pin to top",
    "Fixada no topo": "Pinned to top",
    "Fixada no topo da aba Coleções": "Pinned to the top of Collections",
    "Removida das favoritas": "Removed from favorites",
    "Contas conectadas": "Connected accounts",
    "Trakt e Simkl": "Trakt and Simkl",
    "Fonte da biblioteca": "Library source",
    "De onde vêm os assistidos e o Continuar assistindo": "Where watched items and Continue watching come from",
    "Fonte do progresso": "Watch progress source",
    "Para onde o progresso de reprodução é enviado": "Where playback progress is sent",
    "Recursos do Trakt": "Trakt features",
    "Atualiza assistidos e Continuar assistindo": "Refreshes watched items and Continue watching",
    "Conecte uma conta primeiro": "Connect an account first",
    "Pular trechos": "Skip segments",
    "IntroDB (séries e filmes) — introdb.app": "IntroDB (series and movies) — introdb.app",
    'Desligado: mostra o botão "Pular"': 'Off: shows the "Skip" button',
    "Anime Skip": "Anime Skip",
    "Anime-Skip (anime-skip.com) e AniSkip: abertura e encerramento de animes": "Anime-Skip (anime-skip.com) and AniSkip: anime openings and endings",
    "AnimeSkip Client ID": "AnimeSkip Client ID",
    "Sua chave do anime-skip.com (fica só nesta TV)": "Your anime-skip.com key (stays on this TV only)",
    "Integrações": "Integrations",
    "Contas, fontes e recursos do Trakt": "Accounts, sources and Trakt features",
    "Abertura, recapitulação e encerramento": "Intro, recap and outro",
    "Ligado": "On",
    "Filmes e séries": "Movies and series",
    "Desenhos animados": "Cartoons",
    "Animes": "Anime",
    "{name}: este torrent ainda não está no cache. Escolha outra fonte.": "{name}: this torrent is not cached yet. Pick another source.",
    "Chave inválida": "Invalid key",
    "Endereço inválido": "Invalid address",
    "Usuário ou senha errados": "Wrong user name or password",
    "Leve": "Mild",
    "Moderado": "Moderate",
    "Forte": "Severe",
    "Nudez": "Nudity",
    "Violência": "Violence",
    "Palavrões": "Profanity",
    "Álcool e drogas": "Alcohol and drugs",
    "Cenas assustadoras": "Frightening scenes",
    "Torrent · via {name}": "Torrent · via {name}",
    "Debrid": "Debrid",
    "Toca fontes torrent pela sua conta debrid, sem o servidor do PC. Cada um usa a própria chave, que fica só nesta TV.": "Plays torrent sources through your debrid account, no PC server needed. Everyone uses their own key, kept only on this TV.",
    "Usar debrid": "Use debrid",
    "Usando {name}": "Using {name}",
    "Preencha uma chave abaixo": "Fill in a key below",
    "Serviço preferido": "Preferred service",
    "Usado quando há mais de uma chave": "Used when there is more than one key",
    "Chaves de API": "API keys",
    "Sua chave de API em {site}": "Your API key at {site}",
    "Testar {name}": "Test {name}",
    "Testando...": "Testing...",
    "{name} OK: {user}": "{name} OK: {user}",
    "{name} recusou a chave: {msg}": "{name} rejected the key: {msg}",
    "Servidores de mídia (Jellyfin e Emby)": "Media servers (Jellyfin and Emby)",
    "Os filmes e séries do seu servidor aparecem como fonte, junto com os addons.": "Movies and series on your server show up as a source, next to the add-ons.",
    "Mostrar como fonte": "Show as a source",
    "Lista os arquivos do servidor nas fontes": "Lists the server files among the sources",
    "Tipo de servidor": "Server type",
    "Endereço do servidor": "Server address",
    "Ex.: 192.168.0.20:8096": "E.g. 192.168.0.20:8096",
    "Usuário": "User name",
    "Usada só para entrar; não fica salva": "Only used to sign in; it is not saved",
    "Conectar": "Connect",
    "Preencha o endereço e o usuário": "Fill in the address and the user name",
    "Conectando...": "Connecting...",
    "Conectado a {name}": "Connected to {name}",
    "Não foi possível conectar: {msg}": "Could not connect: {msg}",
    "Seu próprio servidor como fonte": "Your own server as a source",
    "Chave RPDB": "RPDB key",
    "Pôsteres com as notas desenhadas (ratingposterdb.com)": "Posters with the ratings drawn on them (ratingposterdb.com)",
    "Guia para os pais": "Parental guide",
    "Violência, palavrões e cenas fortes na página do título (IMDb via tiffara.com)": "Violence, profanity and intense scenes on the title page (IMDb via tiffara.com)",
    "Abrir": "Open",
    'Adicionado a "{name}"': 'Added to "{name}"',
    "Adicionar a esta coleção": "Add to this collection",
    "Adicionar lista pública": "Add a public list",
    "Ajustes copiados de {name}": "Settings copied from {name}",
    'Ao terminar um filme, mostra "Mais como este"': 'When a film ends, shows "More like this"',
    'Apagar a coleção "{name}"?': 'Delete the collection "{name}"?',
    "Apagar coleção": "Delete collection",
    "Baixando arquivo de teste...": "Downloading a test file...",
    "Capítulo {n}": "Chapter {n}",
    "Capítulos": "Chapters",
    'Coleção "{name}" criada': 'Collection "{name}" created',
    "Coleção sua": "Your collection",
    "Coloque sua chave MDBList em Ajustes → Metadados extras para usar listas.": "Put your MDBList key in Settings → Extra metadata to use lists.",
    "Copiar": "Copy",
    "Copiar ajustes de": "Copy settings from",
    "Copiar ajustes de outro perfil": "Copy settings from another profile",
    "Descer": "Move down",
    "Escolha quais das suas listas aparecem na tela inicial": "Choose which of your lists show on the home screen",
    "Esconder": "Hide",
    "Escondida": "Hidden",
    "Este arquivo não tem capítulos.": "This file has no chapters.",
    "Ex.: Para ver no fim de semana": "E.g. For the weekend",
    "Ex.: usuario/nome-da-lista ou o link do mdblist.com": "E.g. user/list-name or the mdblist.com link",
    "Fechar": "Close",
    "Fileiras": "Rows",
    "Internet: {mbps} Mbps, ping {ms} ms ({verdict})": "Internet: {mbps} Mbps, ping {ms} ms ({verdict})",
    "Legendas, aparência, tela inicial e coleções (a conta não é copiada)": "Subtitles, appearance, home screen and collections (the account is not copied)",
    'Lista "{name}" adicionada': 'List "{name}" added',
    "Lista não encontrada": "List not found",
    "Listas do MDBList": "MDBList lists",
    "Mais como este": "More like this",
    "Medindo o ping...": "Measuring ping...",
    "Minhas coleções": "My collections",
    "Minhas listas": "My lists",
    "Modo ambiente": "Ambient mode",
    "Mostrar": "Show",
    "Nome da nova coleção": "New collection name",
    "Nova coleção": "New collection",
    "Nova coleção...": "New collection...",
    "O teste falhou: {msg}": "The test failed: {msg}",
    "O trailer toca sem som atrás do Hero Banner (mais pesado na TV)": "The trailer plays muted behind the Hero Banner (heavier on the TV)",
    "OK numa fileira: subir, descer ou esconder.": "OK on a row: move up, move down or hide.",
    "Ordem das fileiras, listas do MDBList e Continuar assistindo": "Row order, MDBList lists and Continue watching",
    "Ordem do Continuar assistindo": "Continue watching order",
    "Ordem padrão restaurada": "Default order restored",
    "Ping e velocidade de download (Cloudflare)": "Ping and download speed (Cloudflare)",
    "Procurando capítulos...": "Looking for chapters...",
    "Qualidade, HDR, áudio, idioma, tamanho...": "Quality, HDR, audio, language, size...",
    'Removido de "{name}"': 'Removed from "{name}"',
    "Renomear": "Rename",
    "Restaurar ordem padrão": "Restore default order",
    "Selos das fontes": "Stream badges",
    "Subir": "Move up",
    "Sugestões no fim": "Suggestions at the end",
    "Tela inicial": "Home screen",
    "Testar a internet": "Test the internet",
    "Tirar desta coleção": "Remove from this collection",
    "Toque para tirar desta coleção": "Select to remove it from this collection",
    'Trocar os ajustes de "{to}" pelos de "{from}"?': 'Replace the settings of "{to}" with those of "{from}"?',
    "Vazia. Na página de um filme ou série, use o botão Coleção para adicionar.": "Empty. On a film or series page, use the Collection button to add it.",
    "Visível": "Visible",
    "Você ainda não tem listas no MDBList.": "You have no MDBList lists yet.",
    "bom para 1080p": "good for 1080p",
    "dá para 4K": "enough for 4K",
    "lenta para vídeo": "slow for video",
    "só 720p com folga": "720p only, comfortably",
    "Assistidos por último": "Last watched",
    "Quase terminados primeiro": "Almost finished first",
    "Nome (A–Z)": "Name (A–Z)",
    "Qualidade (4K, 1080p, 720p)": "Quality (4K, 1080p, 720p)",
    "HDR e Dolby Vision": "HDR and Dolby Vision",
    "REMUX": "REMUX",
    "Codec (HEVC, AV1)": "Codec (HEVC, AV1)",
    "Áudio (Atmos, DTS, 5.1)": "Audio (Atmos, DTS, 5.1)",
    "Idioma (Árabe, Multi)": "Language (Arabic, Multi)",
    "Tamanho do arquivo": "File size",
    "Taxa estimada (Mbps)": "Estimated bitrate (Mbps)",
    "{name}: a chave de API foi recusada. Confira em Ajustes → Debrid.": "{name}: the API key was rejected. Check Settings → Debrid.",
    "A legenda e o áudio que você escolher valem para os outros episódios": "The subtitle and audio you pick apply to the other episodes",
    "Aponte a câmera do celular para o QR, entre na sua conta e pronto: conecta sozinho.": "Point your phone camera at the QR, sign in and that is it: it links by itself.",
    "Boa noite!": "Good night!",
    "Boa noite! O vídeo foi pausado.": "Good night! The video was paused.",
    "Buscas recentes": "Recent searches",
    "Buscas recentes:": "Recent searches:",
    "Cantos dos pôsteres e botões": "Corners of posters and buttons",
    "Chave SubDL": "SubDL key",
    "Como o item selecionado aparece": "How the selected item looks",
    "Contagem regressiva": "Countdown",
    "Contagem regressiva nos créditos e toca o próximo": "Counts down at the credits and plays the next one",
    "Cor de destaque de botões, foco e barras": "Accent colour of buttons, focus and bars",
    "Cor do app": "App colour",
    "Cores e formas": "Colours and shapes",
    "Depois de {n} min": "After {n} min",
    "Desempenho": "Performance",
    "Diagnóstico": "Diagnostics",
    "Dormir": "Sleep",
    "Escuro, preto puro ou com brilho da cor": "Dark, pure black or with a colour glow",
    "Estilo do foco": "Focus style",
    "Ex.: só os pais abrem este perfil": "E.g. only parents can open this profile",
    "Fileiras e Continuar assistindo": "Rows and Continue watching",
    "Formato dos cartões": "Card shape",
    "Funciona (direto)": "Works (direct)",
    "Funciona (pelo servidor do PC)": "Works (through the PC server)",
    "Funciona (pelo serviço da TV)": "Works (through the TV service)",
    "Fundo": "Background",
    "Fundos de filmes e o relógio quando a TV fica parada": "Film backdrops and the clock when the TV sits idle",
    "Legendas em árabe do subdl.com (crie a chave grátis em subdl.com/panel/api)": "Arabic subtitles from subdl.com (get a free key at subdl.com/panel/api)",
    "Lembrar por série": "Remember per series",
    "Limpar": "Clear",
    "Mais pôsteres por linha ou pôsteres maiores": "More posters per row or bigger posters",
    "Minha lista do Trakt": "My Trakt watchlist",
    "Mostra as últimas buscas na tela de busca": "Shows your last searches on the search screen",
    "No fim deste vídeo": "At the end of this video",
    "Novo PIN (4 a 8 números)": "New PIN (4 to 8 digits)",
    "Não funciona: o serviço da TV não respondeu. Feche o app e abra de novo pelo TizenBrew.": "Not working: the TV service did not answer. Close the app and open it again from TizenBrew.",
    "O player da Samsung (AVPlay) não carregou nesta TV, então o app usa o do navegador e não consegue trocar o áudio. Feche o app e abra de novo pelo TizenBrew; se continuar, avise.": "The Samsung player (AVPlay) did not load on this TV, so the app uses the browser one and cannot switch audio. Close the app and open it again from TizenBrew; if it stays like this, let us know.",
    "O vídeo para em {n} minutos": "The video stops in {n} minutes",
    "O vídeo para no fim deste episódio": "The video stops at the end of this episode",
    "Ou abra": "Or open",
    "PIN de {name}": "PIN for {name}",
    "PIN errado. Tente de novo.": "Wrong PIN. Try again.",
    "PIN removido": "PIN removed",
    "PIN salvo": "PIN saved",
    "Para trocar o áudio, o app precisa do player da Samsung (AVPlay), que não carregou. Veja Ajustes → Reprodução.": "To switch audio the app needs the Samsung player (AVPlay), which did not load. See Settings → Playback.",
    "Pede ao IntroDB a abertura de WandaVision T1E1 e diz por qual caminho funcionou": "Asks IntroDB for the WandaVision S1E1 intro and says which way worked",
    "Pede o PIN para abrir este perfil": "Asks for the PIN to open this profile",
    "Proteção de tela": "Screensaver",
    "Próximo episódio automático": "Play next episode automatically",
    "Quanto tempo o aviso do próximo episódio espera": "How long the next episode notice waits",
    "Tamanho dos pôsteres": "Poster size",
    "Testar o pulo de abertura": "Test intro skipping",
    "Timer desligado": "Timer off",
    "Tirar o PIN": "Remove the PIN",
    "Trancar com PIN": "Lock with a PIN",
    "Trocar o PIN": "Change the PIN",
    "faltam {n} min": "{n} min left",
    "{n} minutos": "{n} minutes",
    "{n} segundos": "{n} seconds",
    "Conta e perfis": "Account and profiles",
    "Idioma, perfis, conta Stremio, controle pelo celular": "Language, profiles, Stremio account, phone remote",
    "Reprodução": "Playback",
    "Servidor do PC, player, próximo episódio, selos das fontes": "PC server, player, next episode, stream badges",
    "Idiomas, SubDL, aparência da legenda": "Languages, SubDL, subtitle look",
    "Aparência": "Appearance",
    "Tema, tela inicial, modo ambiente, proteção de tela": "Theme, home screen, ambient mode, screensaver",
    "Trakt, Simkl, pular trechos, debrid, Jellyfin, chaves, addons": "Trakt, Simkl, skip segments, debrid, Jellyfin, keys, add-ons",
    "Sobre": "About",
    "Atualizações, teste de internet, log": "Updates, internet test, log",
    "Arredondado": "Rounded",
    "Reto": "Square",
    "Bem redondo": "Very round",
    "Pequeno": "Small",
    "Médio": "Medium",
    "Grande": "Large",
    "Contorno e aumento": "Outline and zoom",
    "Só contorno": "Outline only",
    "Só aumento": "Zoom only",
    "Escuro (padrão)": "Dark (default)",
    "Preto puro (OLED)": "Pure black (OLED)",
    "Escuro com brilho da cor": "Dark with a colour glow",
    "Índigo": "Indigo",
    "Prata": "Silver",
    "Turco": "Turkish",
    "Persa": "Persian",
    "Urdu": "Urdu",
    "Indonésio": "Indonesian",
    "Malaio": "Malay",
    "Use de 4 a 8 números.": "Use 4 to 8 digits.",
    "Chaves próprias (opcional)": "Your own keys (optional)",
    "Aponte a câmera para o código, cole as chaves e toque em Enviar. Elas ficam só nesta TV.": "Point the camera at the code, paste the keys and tap Send. They stay on this TV only.",
    "Chaves pelo celular": "Keys from your phone",
    "Chaves recebidas do celular: {n}": "Keys received from the phone: {n}",
    "Coloque as chaves pelo celular": "Add the keys from your phone",
    "O serviço da TV não está rodando. Feche o app e abra de novo.": "The TV service is not running. Close the app and open it again.",
    "Primeiro coloque as chaves pelo celular: aponte a câmera para o QR desta página.": "First add the keys from your phone: point the camera at the QR on this page.",
    "Opcional: só apps antigos do Trakt têm": "Optional: only older Trakt apps have one",
    "Fonte do app": "App font",
    "Letra dos menus e textos": "Font of the menus and texts",
    "Samsung (da TV)": "Samsung (TV font)",
    "Montserrat (Kai)": "Montserrat (Kai)",
    "Aponte a câmera: abra a página da chave, copie, cole e envie.": "Point the camera: open the key page, copy, paste and send.",
    "Aponte o celular para o QR e entre na sua conta": "Point your phone at the QR and sign in",
    "Ative o Quick Connect no painel do Jellyfin": "Turn on Quick Connect in the Jellyfin dashboard",
    "Entrar com QR (sem chave)": "Sign in with a QR (no key)",
    "Entrar com Quick Connect": "Sign in with Quick Connect",
    "Entrar no {name}": "Sign in to {name}",
    "No app ou site do Jellyfin: Configurações → Quick Connect, e digite o código.": "In the Jellyfin app or site: Settings → Quick Connect, then type the code.",
    "Ou cole a chave": "Or paste the key",
    "Preencha o endereço do servidor primeiro": "Fill in the server address first",
    "QR que abre direto a página da chave": "QR that opens the key page directly",
    "Sem senha: aprove um código no Jellyfin do celular": "No password: approve a code in Jellyfin on your phone",
    "{name} pelo celular": "{name} from your phone",
    "Aba Animes": "Anime tab",
    "Carregar mais": "Load more",
    "Descobrir": "Discover",
    "Em alta agora": "Trending now",
    "Esta temporada": "This season",
    "Estúdios": "Studios",
    "Filmes de anime": "Anime movies",
    "Gêneros": "Genres",
    "Lançando agora": "Airing now",
    "Não encontrei este anime nos addons.": "Could not find this anime in your add-ons.",
    "Não foi possível carregar agora.": "Could not load right now.",
    "Temporada, estúdios e gêneros de anime (AniList)": "Anime season, studios and genres (AniList)",
    "Mais populares": "Most popular",
    "Mais bem avaliados": "Top rated",
    "Em breve": "Upcoming",
    "Ação": "Action",
    "Aventura": "Adventure",
    "Comédia": "Comedy",
    "Drama": "Drama",
    "Fantasia": "Fantasy",
    "Terror": "Horror",
    "Mistério": "Mystery",
    "Romance": "Romance",
    "Ficção científica": "Sci-Fi",
    "Cotidiano": "Slice of Life",
    "Esportes": "Sports",
    "Sobrenatural": "Supernatural",
    "Mecha": "Mecha",
    "Psicológico": "Psychological",
    "Música": "Music",
    "Anime da temporada": "Seasonal anime",
    "Coleções prontas (filmes, séries, atores, estúdios...) ou os catálogos dos seus addons": "Ready-made collections (movies, series, actors, studios...) or your add-ons' catalogs",
    "Coloque sua chave TMDB (Ajustes → Integrações) para ver as coleções da tela inicial.": "Add your TMDB key (Settings → Integrations) to see the home collections.",
    "Conteúdo da tela inicial": "Home screen content",
    "Crime e vida cotidiana": "Crime & everyday life",
    "Décadas": "Decades",
    "Estilos de comédia e romance": "Comedy & romance styles",
    "Mais favoritados": "Most favourites",
    "Melhores filmes": "Top anime movies",
    "Melhores séries": "Top anime series",
    "Não foi possível abrir agora.": "Could not open it right now.",
    "Não foi possível carregar as coleções agora.": "Could not load the collections right now.",
    "Próxima temporada": "Upcoming season",
    "Temas": "Themes",
    "{n} pastas": "{n} folders",
    "Coleções (Kaptain)": "Collections (Kaptain)",
    "Coleções e addons": "Collections and add-ons",
    "Só os catálogos dos addons": "Add-on catalogs only",
    "Infantil": "Kids",
    "Inverno": "Winter",
    "Primavera": "Spring",
    "Verão": "Summer",
    "Outono": "Fall",
    "Não foi possível ligar esta legenda.": "Could not turn this subtitle on."
  };

  // src/js/lib/i18n-ar.js
  var AR = {
    // Navegação e geral
    "Início": "الرئيسية",
    "Buscar": "بحث",
    "Biblioteca": "المكتبة",
    "Ajustes": "الإعدادات",
    "Cancelar": "إلغاء",
    "Voltar": "رجوع",
    "Continuar": "متابعة",
    "Pular": "تخطي",
    "Sair": "خروج",
    "Nada por aqui.": "لا يوجد شيء هنا.",
    "Carregando...": "جارٍ التحميل...",
    "Ver tudo": "عرض الكل",
    "Novos episódios": "حلقات جديدة",
    "Séries da sua biblioteca, últimos 7 dias": "مسلسلات مكتبتك، آخر 7 أيام",
    "Pessoas": "الأشخاص",
    "Tema de cores": "سمة الألوان",
    "Cor de destaque do app": "لون التمييز في التطبيق",
    "Dourado": "ذهبي",
    "Assistir agora": "شاهد الآن",
    "A seguir": "التالي",
    "Começa em {n}s": "يبدأ خلال {n} ث",
    "Ligue uma legenda primeiro.": "شغّل الترجمة أولًا.",
    "O ajuste funciona com legendas de addons (OpenSubtitles etc.).": "يعمل الضبط مع ترجمات الإضافات (OpenSubtitles وغيرها).",
    "Você já tem a versão mais nova.": "لديك أحدث إصدار.",
    "Atualização disponível ({date}): {msg}": "يتوفر تحديث ({date}): {msg}",
    "Atualizar agora": "تحديث الآن",
    "Atualizando... o app vai recarregar.": "جارٍ التحديث... سيُعاد تحميل التطبيق.",
    "A atualização ainda está chegando. Tente de novo em alguns minutos.": "التحديث لم يصل بعد. حاول مجددًا بعد بضع دقائق.",
    "Atualizações": "التحديثات",
    "Versão instalada": "الإصدار المثبّت",
    "Versão mais nova no GitHub": "أحدث إصدار على GitHub",
    "Verificando...": "جارٍ التحقق...",
    "nova!": "جديد!",
    "em dia": "محدّث",
    "sem conexão": "لا يوجد اتصال",
    "Atualização disponível: Ajustes → Procurar atualização": "يتوفر تحديث: الإعدادات ← البحث عن تحديث",
    "Descrições em árabe, perfis de atores, calendário de filmes, logos e elenco com fotos (grátis em themoviedb.org)": "الأوصاف بالعربية، ملفات الممثلين، تقويم الأفلام، الشعارات وصور طاقم التمثيل (مجانًا من themoviedb.org)",
    "Trailer": "الإعلان",
    "Voltar fecha o trailer": "زر الرجوع يغلق الإعلان",
    "Nascimento: {date}": "تاريخ الميلاد: {date}",
    "Falecimento: {date}": "تاريخ الوفاة: {date}",
    "{n} anos": "{n} سنة",
    "Local de nascimento: {place}": "مكان الميلاد: {place}",
    "Direção": "الإخراج",
    "Atuação": "التمثيل",
    "Sem biografia disponível.": "لا تتوفر سيرة ذاتية.",
    "Esse título ainda não tem página no Stremio.": "لا توجد صفحة لهذا العنوان في Stremio بعد.",
    "Não foi possível carregar este perfil.": "تعذّر تحميل هذا الملف الشخصي.",
    "Controle pelo celular": "التحكم بالهاتف",
    "O controle pelo celular não está rodando. Feche o app e abra de novo pelo TizenBrew.": "التحكم بالهاتف لا يعمل. أغلق التطبيق وافتحه مرة أخرى من TizenBrew.",
    "Aponte a câmera do celular para o código": "وجّه كاميرا الهاتف نحو الرمز",
    "Ou abra no navegador do celular (mesmo Wi-Fi):": "أو افتح هذا العنوان في متصفح الهاتف (نفس شبكة Wi-Fi):",
    "PIN: {pin}": "الرمز السري: {pin}",
    "Selecione um campo de texto na TV primeiro.": "اختر حقل نص على التلفاز أولًا.",
    "Árabe quando houver": "العربية عند توفرها",
    "Calendário": "التقويم",
    "Streaming": "البث",
    "As datas de streaming dos filmes vêm do TMDB: coloque sua chave grátis do TMDB em Ajustes.": "مواعيد بث الأفلام مصدرها TMDB: أضف مفتاح TMDB المجاني في الإعدادات.",
    "Nenhum filme chega ao streaming neste dia.": "لا توجد أفلام تصل إلى البث في هذا اليوم.",
    "Esse filme ainda não tem página no Stremio.": "هذا الفيلم ليست له صفحة على Stremio بعد.",
    "Escolha inteligente": "الاختيار الذكي",
    "Assistir já toca a melhor fonte; o botão Fontes mostra a lista": "زر مشاهدة يشغّل أفضل مصدر فورًا؛ وزر المصادر يعرض القائمة",
    "Escolha inteligente: procurando a melhor fonte...": "الاختيار الذكي: جارٍ البحث عن أفضل مصدر...",
    "aperte uma seta para escolher você": "اضغط سهمًا لتختار بنفسك",
    "Escolha inteligente: nenhuma fonte que a TV toque. Escolha na lista.": "الاختيار الذكي: لا يوجد مصدر يمكن للتلفاز تشغيله. اختر من القائمة.",
    "Essa fonte não tocou. Tentando outra...": "تعذّر تشغيل هذا المصدر. جارٍ تجربة مصدر آخر...",
    "carregando...": "جارٍ التحميل...",
    "Sair do Stremio Kai?": "الخروج من Stremio Kai؟",
    "Desconhecido": "غير معروف",
    "Desligado": "إيقاف",
    "Desligada": "إيقاف",
    "Automático": "تلقائي",
    // Perfis
    "Perfil": "الملف الشخصي",
    "Perfis": "الملفات الشخصية",
    "Perfil atual": "الملف الحالي",
    "Trocar para este perfil": "التبديل إلى هذا الملف",
    "+ Adicionar perfil": "+ إضافة ملف",
    "Adicionar perfil": "إضافة ملف",
    "Com outra conta Stremio (histórico separado)": "بحساب Stremio آخر (سجل منفصل)",
    "Gerenciar perfis": "إدارة الملفات",
    "Nome, cor, apagar": "الاسم، اللون، الحذف",
    "Quem está assistindo?": "من يشاهد؟",
    "Cada perfil tem sua própria conta Stremio, com histórico e biblioteca separados.": "لكل ملف حساب Stremio خاص به، مع سجل ومكتبة منفصلين.",
    "Nome do novo perfil": "اسم الملف الجديد",
    "Criar perfil": "إنشاء ملف",
    "Ex.: Ana, Pedro, Sala": "مثال: أحمد، سارة، غرفة المعيشة",
    "Digite um nome para o perfil.": "اكتب اسمًا للملف.",
    "Já existe um perfil com esse nome.": "يوجد ملف بهذا الاسم بالفعل.",
    "Nome do perfil": "اسم الملف",
    "Nome do perfil salvo": "تم حفظ اسم الملف",
    "Este perfil usa a conta Stremio abaixo": "يستخدم هذا الملف حساب Stremio أدناه",
    "Cor do perfil": "لون الملف",
    "Roxo": "بنفسجي",
    "Rosa": "وردي",
    "Verde-água": "أزرق مخضر",
    "Laranja": "برتقالي",
    "Azul": "أزرق",
    "Vermelho": "أحمر",
    "Verde": "أخضر",
    "Cinza": "رمادي",
    "Trocar de perfil": "تبديل الملف",
    "{n} perfis nesta TV": "{n} ملفات على هذا التلفاز",
    "Para outra pessoa, com outra conta Stremio": "لشخص آخر، بحساب Stremio آخر",
    'Perguntar "Quem está assistindo?" ao abrir': 'السؤال "من يشاهد؟" عند التشغيل',
    "Apagar este perfil": "حذف هذا الملف",
    "Remove deste aparelho a conta e as preferências do perfil (a conta Stremio continua existindo)": "يزيل حساب الملف وتفضيلاته من هذا التلفاز (يبقى حساب Stremio نفسه)",
    'Apagar o perfil "{name}" desta TV?': 'حذف الملف "{name}" من هذا التلفاز؟',
    "Apagar": "حذف",
    // Assistente
    "PASSO {n} DE {total}": "الخطوة {n} من {total}",
    "Bem-vindo! Quem vai usar este perfil?": "مرحبًا! من سيستخدم هذا الملف؟",
    "Dê um nome ao perfil. Depois você pode criar outros perfis, cada um com a própria conta Stremio e histórico.": "اختر اسمًا لهذا الملف. لاحقًا يمكنك إنشاء ملفات أخرى، لكل منها حساب Stremio وسجل خاص به.",
    "Bem-vindo ao Stremio Kai": "مرحبًا بك في Stremio Kai",
    "Você já está conectado à sua conta Stremio. Seus addons e sua biblioteca já estão aqui.": "أنت مسجّل الدخول إلى Stremio بالفعل. إضافاتك ومكتبتك موجودة هنا.",
    "Entre com a sua conta Stremio para trazer seus addons (Torrentio, debrid, Anime Kitsu...) e a biblioteca.": "سجّل الدخول بحساب Stremio لجلب إضافاتك (Torrentio، debrid، Anime Kitsu...) ومكتبتك.",
    "Entrar na conta": "تسجيل الدخول",
    "Servidor de torrents no PC": "خادم التورنت على الكمبيوتر",
    "Servidor conectado em {url}. Torrents liberados.": "الخادم متصل على {url}. تم تفعيل التورنت.",
    "Para tocar torrents, deixe o stremio-service aberto num PC da rede. Links de debrid funcionam sem ele.": "لتشغيل التورنت، أبقِ stremio-service يعمل على كمبيوتر في شبكتك. روابط debrid تعمل بدونه.",
    "Procurar na rede": "البحث في الشبكة",
    "Procurando o servidor na rede...": "جارٍ البحث عن الخادم في الشبكة...",
    "Nenhum servidor encontrado. Você pode configurar depois em Ajustes.": "لم يُعثر على خادم. يمكنك إعداده لاحقًا من الإعدادات.",
    "Servidor encontrado em {ip}": "تم العثور على الخادم على {ip}",
    "Servidor do PC conectado": "خادم الكمبيوتر متصل",
    "Não foi possível procurar. Configure depois em Ajustes.": "تعذّر البحث. أعدّه لاحقًا من الإعدادات.",
    "Legendas": "الترجمة",
    "Em qual idioma o app deve ligar a legenda sozinho quando o áudio não for no seu idioma?": "ما لغة الترجمة التي تُفعَّل تلقائيًا عندما لا يكون الصوت بلغتك؟",
    "Português (BR)": "البرتغالية (البرازيل)",
    "Inglês": "الإنجليزية",
    "Não ligar sozinho": "عدم التفعيل تلقائيًا",
    // Login
    "Gerando código...": "جارٍ إنشاء الرمز...",
    "E-mail": "البريد الإلكتروني",
    "Senha": "كلمة المرور",
    "Entrar": "تسجيل الدخول",
    "Entrar com o celular": "تسجيل الدخول بالهاتف",
    "No celular ou PC, abra <b>link.stremio.com</b> e digite o código:": "على هاتفك أو الكمبيوتر، افتح <b>link.stremio.com</b> وأدخل الرمز:",
    "Ou com e-mail": "أو بالبريد الإلكتروني",
    "Use a mesma conta do Stremio. Seus addons e a biblioteca vêm junto.": "استخدم حساب Stremio الخاص بك. ستأتي إضافاتك ومكتبتك معه.",
    "Aguardando confirmação...": "في انتظار التأكيد...",
    "Não foi possível gerar o código. Use o e-mail ao lado.": "تعذّر إنشاء الرمز. استخدم البريد الإلكتروني بدلًا من ذلك.",
    "Código expirou. Gerando outro...": "انتهت صلاحية الرمز. جارٍ إنشاء رمز جديد...",
    "Preencha e-mail e senha.": "أدخل البريد الإلكتروني وكلمة المرور.",
    "Entrando...": "جارٍ تسجيل الدخول...",
    "Falha no login": "فشل تسجيل الدخول",
    "Conectado à conta Stremio": "تم تسجيل الدخول إلى Stremio",
    // Início, busca, biblioteca, calendário
    "Continuar assistindo": "متابعة المشاهدة",
    "Carregando catálogos...": "جارٍ تحميل الكتالوجات...",
    "Nenhum catálogo. Entre na sua conta em Ajustes.": "لا توجد كتالوجات. سجّل الدخول إلى حسابك من الإعدادات.",
    "Erro ao carregar addons: {msg}": "خطأ في تحميل الإضافات: {msg}",
    "Filmes": "أفلام",
    "Séries": "مسلسلات",
    "Canais": "القنوات",
    "Assistir": "مشاهدة",
    "Detalhes": "التفاصيل",
    "Buscar filmes e séries...": "ابحث عن أفلام ومسلسلات...",
    "Digite pelo menos 2 letras e confirme no teclado.": "اكتب حرفين على الأقل وأكّد من لوحة المفاتيح.",
    'Buscando "{q}"...': 'جارٍ البحث عن "{q}"...',
    "Nenhum addon com busca instalado.": "لا توجد إضافة بحث مثبّتة.",
    'Nada encontrado para "{q}".': 'لا توجد نتائج لـ "{q}".',
    "Tudo": "الكل",
    "Sua biblioteca está vazia.": "مكتبتك فارغة.",
    "Entre na sua conta em Ajustes para ver a biblioteca.": "سجّل الدخول إلى حسابك من الإعدادات لعرض مكتبتك.",
    "Carregando biblioteca...": "جارٍ تحميل المكتبة...",
    "Hoje": "اليوم",
    "Amanhã": "غدًا",
    "Ontem": "أمس",
    "Domingo": "الأحد",
    "Segunda": "الاثنين",
    "Terça": "الثلاثاء",
    "Quarta": "الأربعاء",
    "Quinta": "الخميس",
    "Sexta": "الجمعة",
    "Sábado": "السبت",
    "Buscando lançamentos...": "جارٍ تحميل الإصدارات...",
    "Nenhum episódio neste dia.": "لا توجد حلقات في هذا اليوم.",
    "Abrindo {name}...": "جارٍ فتح {name}...",
    "Esse anime não foi encontrado nos seus addons (instale o Anime Kitsu).": "لم يُعثر على هذا الأنمي في إضافاتك (ثبّت Anime Kitsu).",
    "Não foi possível carregar o calendário: {msg}": "تعذّر تحميل التقويم: {msg}",
    // Detalhes e fontes
    "{n} temporadas": "{n} مواسم",
    "{n} temporada": "{n} موسم",
    "Direção: ": "الإخراج: ",
    "Elenco: ": "الممثلون: ",
    "Na biblioteca": "في المكتبة",
    "Removido da biblioteca": "أُزيل من المكتبة",
    "Adicionado à biblioteca": "أُضيف إلى المكتبة",
    "Episódios": "الحلقات",
    "Especiais": "حلقات خاصة",
    "Temporada {n}": "الموسم {n}",
    "Episódio {n}": "الحلقة {n}",
    "Episódio": "الحلقة",
    "parou em {time}": "توقف عند {time}",
    "Fontes": "المصادر",
    "Todos": "الكل",
    "Todos ▾": "الكل ▾",
    "Buscando fontes nos addons...": "جارٍ البحث عن مصادر في الإضافات...",
    "Nenhum addon de streams instalado (ex.: Torrentio). Instale pela sua conta Stremio.": "لا توجد إضافة بث مثبّتة (مثل Torrentio). ثبّت واحدة من حساب Stremio.",
    "Servidor do PC não conectado: só links diretos": "خادم الكمبيوتر غير متصل: الروابط المباشرة فقط",
    "{n} addon(s) ainda carregando": "{n} إضافة لا تزال قيد التحميل",
    "{n} fontes": "{n} مصادر",
    "Mostrar fontes de": "عرض المصادر من",
    "Nenhuma fonte encontrada.": "لم يُعثر على مصادر.",
    "Não suportado na TV": "غير مدعوم على التلفاز",
    "Torrent · via PC": "تورنت · عبر الكمبيوتر",
    "Torrent · precisa do PC": "تورنت · يحتاج الكمبيوتر",
    "Direto": "مباشر",
    "Esse tipo de fonte não abre na TV.": "هذا النوع من المصادر لا يعمل على التلفاز.",
    "Torrent precisa do stremio-service rodando no PC. Configure em Ajustes.": "التورنت يحتاج إلى تشغيل stremio-service على الكمبيوتر. أعدّه من الإعدادات.",
    "Continuar de onde parou?": "المتابعة من حيث توقفت؟",
    "Continuar de {time}": "المتابعة من {time}",
    "Começar do início": "البدء من البداية",
    "Não foi possível abrir": "تعذّر الفتح",
    "Detalhes não encontrados": "لم يُعثر على التفاصيل",
    "Nenhum addon fornece detalhes para {id}": "لا توجد إضافة توفّر تفاصيل لـ {id}",
    "Público": "الجمهور",
    // Player
    "Áudio": "الصوت",
    "Próximo": "التالي",
    "Tocar": "تشغيل",
    "Pausar": "إيقاف مؤقت",
    "Pular abertura": "تخطي المقدمة",
    "Pular recapitulação": "تخطي الملخص",
    "Próximo episódio": "الحلقة التالية",
    "Pular encerramento": "تخطي الخاتمة",
    "Abertura pulada": "تم تخطي المقدمة",
    "Recapitulação pulada": "تم تخطي الملخص",
    "Encerramento pulado": "تم تخطي الخاتمة",
    "Termina às {time}": "ينتهي في {time}",
    "O vídeo parou de carregar": "توقف تحميل الفيديو",
    "Reabre o vídeo em {time}": "يعيد فتح الفيديو عند {time}",
    "Tentar de novo": "إعادة المحاولة",
    "Escolher outra fonte": "اختيار مصدر آخر",
    "Reconectando ao vídeo...": "جارٍ إعادة الاتصال بالفيديو...",
    "A TV não conseguiu tocar este arquivo diretamente.": "تعذّر على التلفاز تشغيل هذا الملف مباشرة.",
    "A TV não conseguiu tocar este arquivo (formato ou codec não suportado).": "تعذّر على التلفاز تشغيل هذا الملف (صيغة أو ترميز غير مدعوم).",
    "Tente outra fonte (de preferência MP4/MKV com H.264 ou HEVC e áudio AAC/AC3).": "جرّب مصدرًا آخر (ويُفضَّل MP4/MKV بترميز H.264 أو HEVC وصوت AAC/AC3).",
    "Converter no PC (experimental)": "التحويل على الكمبيوتر (تجريبي)",
    "O servidor converte para HLS que a TV aceita": "يحوّل الخادم الفيديو إلى HLS الذي يقبله التلفاز",
    "Problema na reprodução": "مشكلة في التشغيل",
    "Troca de áudio indisponível agora.": "تبديل الصوت غير متاح الآن.",
    "Falha ao trocar áudio: {msg}": "فشل تبديل الصوت: {msg}",
    "Falha na legenda embutida: {msg}": "فشل الترجمة المدمجة: {msg}",
    "Legenda: {lang}": "الترجمة: {lang}",
    "Não foi possível baixar a legenda.": "تعذّر تنزيل الترجمة.",
    "Lendo as faixas do arquivo...": "جارٍ قراءة مسارات الملف...",
    "{n} canais": "{n} قنوات",
    "Só uma faixa de áudio.": "مسار صوتي واحد فقط.",
    "Para listar as faixas, conecte o servidor do PC em Ajustes.": "لعرض المسارات، اربط خادم الكمبيوتر من الإعدادات.",
    "Embutida no arquivo": "مدمجة في الملف",
    "Atraso da legenda: {n}s": "تأخير الترجمة: {n} ث",
    "Ajustar sincronia": "ضبط المزامنة",
    "Tamanho: {n}%": "الحجم: {n}%",
    "Carregando legendas...": "جارٍ تحميل الترجمات...",
    "Nenhuma legenda.": "لا توجد ترجمات.",
    "Atraso da legenda": "تأخير الترجمة",
    "Legenda aparece antes": "تظهر الترجمة أبكر",
    "Legenda aparece depois": "تظهر الترجمة لاحقًا",
    "Sem ajuste": "بدون ضبط",
    "Tamanho da legenda": "حجم الترجمة",
    "Essa fonte precisa do servidor do PC.": "هذا المصدر يحتاج إلى خادم الكمبيوتر.",
    "Procurando o próximo episódio...": "جارٍ البحث عن الحلقة التالية...",
    // nomes de idiomas
    "Português": "البرتغالية",
    "Espanhol": "الإسبانية",
    "Japonês": "اليابانية",
    "Francês": "الفرنسية",
    "Alemão": "الألمانية",
    "Italiano": "الإيطالية",
    "Coreano": "الكورية",
    "Chinês": "الصينية",
    "Russo": "الروسية",
    "Árabe": "العربية",
    "Hindi": "الهندية",
    "Indefinido": "غير محدد",
    // Ajustes
    "Automático (idioma da TV)": "تلقائي (لغة التلفاز)",
    "Conta Stremio": "حساب Stremio",
    "Conectado": "تم تسجيل الدخول",
    "Addons e biblioteca sincronizados com a conta": "الإضافات والمكتبة متزامنة مع الحساب",
    "conta Stremio": "حساب Stremio",
    "Atualizar addons e biblioteca": "تحديث الإضافات والمكتبة",
    "Busca de novo a lista de addons instalados": "يعيد تحميل قائمة الإضافات المثبّتة",
    "Atualizado": "تم التحديث",
    "Erro: {msg}": "خطأ: {msg}",
    "Sair da conta": "تسجيل الخروج",
    "Sair da conta Stremio?": "تسجيل الخروج من Stremio؟",
    "Traz seus addons (Torrentio, debrid...) e a biblioteca": "يجلب إضافاتك (Torrentio، debrid...) ومكتبتك",
    "Servidor de streaming (PC)": "خادم البث (الكمبيوتر)",
    "não configurado": "غير مُعدّ",
    "conectado ✓": "متصل ✓",
    "sem resposta": "لا استجابة",
    "Servidor conectado": "الخادم متصل",
    "Servidor não respondeu em {url}": "لم يستجب الخادم على {url}",
    "Endereço do PC": "عنوان الكمبيوتر",
    "Rode o stremio-service no PC (porta 11470). Status: {s}": "شغّل stremio-service على الكمبيوتر (المنفذ 11470). الحالة: {s}",
    "Varre a rede local atrás do servidor": "يفحص الشبكة المحلية بحثًا عن الخادم",
    "Procurando servidor na rede...": "جارٍ البحث عن الخادم في الشبكة...",
    "Nenhum servidor encontrado. Ele está aberto no PC?": "لم يُعثر على خادم. هل هو قيد التشغيل على الكمبيوتر؟",
    "Falha na busca: {msg}": "فشل البحث: {msg}",
    "Testar conexão": "اختبار الاتصال",
    "Servidor OK": "الخادم يعمل",
    "Sem resposta de {url}": "لا استجابة من {url}",
    "Aparência (Kai)": "المظهر (Kai)",
    "Hero Banner": "البانر الرئيسي",
    "Destaques no topo da tela inicial": "أبرز العناوين أعلى الشاشة الرئيسية",
    "Fonte do Hero Banner": "مصدر البانر الرئيسي",
    "Cinemeta · Populares": "Cinemeta · الأكثر شعبية",
    "Cinemeta · Mais bem avaliados": "Cinemeta · الأعلى تقييمًا",
    "MDBList · Tendências (Snoak)": "MDBList · الرائج (Snoak)",
    "Tema OLED (preto puro)": "سمة OLED (أسود خالص)",
    "Fundo totalmente preto": "خلفية سوداء بالكامل",
    "Modo desempenho": "وضع الأداء",
    "Mais rápido na TV: sem animações, sem Novos episódios e sem sincronizar em segundo plano": "أسرع على التلفاز: بدون حركات، بدون الحلقات الجديدة وبدون مزامنة في الخلفية",
    "Rolagem animada": "تمرير متحرك",
    "Mais bonita, porém mais pesada na TV": "أجمل، لكنها أثقل على التلفاز",
    "Legendas e áudio": "الترجمة والصوت",
    "Idioma da legenda": "لغة الترجمة",
    "Escolhida sozinha ao abrir o vídeo": "تُختار تلقائيًا عند فتح الفيديو",
    "Português (BR) e Português": "البرتغالية (البرازيل) والبرتغالية",
    "Nenhum (não ligar sozinho)": "بدون (عدم التفعيل تلقائيًا)",
    "Ligar legenda automaticamente": "تفعيل الترجمة تلقائيًا",
    "Se o áudio não estiver no seu idioma": "إذا لم يكن الصوت بلغتك",
    "Áudio preferido": "الصوت المفضّل",
    "Precisa do servidor do PC para ler as faixas": "يحتاج إلى خادم الكمبيوتر لقراءة المسارات",
    "Original do arquivo": "الأصلي في الملف",
    "Português (dublado) quando houver": "البرتغالية (مدبلج) عند توفرها",
    "Inglês quando houver": "الإنجليزية عند توفرها",
    "Japonês quando houver": "اليابانية عند توفرها",
    "Aparência da legenda": "مظهر الترجمة",
    "Oi. Meu nome é Peter Parker.": "مرحبًا. اسمي بيتر باركر.",
    "Você não lembra de mim...": "أنت لا تتذكرني...",
    "Fonte": "الخط",
    "Vale para legendas de addons (OpenSubtitles etc.)": "ينطبق على ترجمات الإضافات (OpenSubtitles وغيرها)",
    "Estilo": "النمط",
    "Contorno, sombra ou caixa de fundo": "إطار، ظل أو صندوق خلفية",
    "Cor do texto": "لون النص",
    "Tamanho": "الحجم",
    "Posição": "الموضع",
    "Distância da borda de baixo": "المسافة من الحافة السفلية",
    "Negrito": "عريض",
    "O Kai usa negrito": "يستخدم Kai الخط العريض",
    "Legendas embutidas no arquivo são desenhadas pela própria TV: só cor, tamanho, posição e caixa se aplicam a elas.": "الترجمات المدمجة في الملف يرسمها التلفاز نفسه: لا ينطبق عليها إلا اللون والحجم والموضع والصندوق.",
    "Nata Sans (padrão Kai)": "Nata Sans (افتراضي Kai)",
    "Fonte da TV (LG)": "خط التلفاز (LG)",
    "Clássica (Arial)": "كلاسيكي (Arial)",
    "Contorno fino + sombra (Kai)": "إطار رفيع + ظل (Kai)",
    "Contorno grosso": "إطار سميك",
    "Só sombra": "ظل فقط",
    "Caixa de fundo": "صندوق خلفية",
    "Branco": "أبيض",
    "Amarelo": "أصفر",
    "Cinza claro": "رمادي فاتح",
    "Ciano": "سماوي",
    "Baixa": "منخفض",
    "Média": "متوسط",
    "Alta": "مرتفع",
    "Player": "المشغّل",
    "Pular abertura e encerramento": "تخطي المقدمة والخاتمة",
    "IntroDB (séries e filmes) e AniSkip (animes)": "IntroDB (المسلسلات والأفلام) وAniSkip (الأنمي)",
    'Mostrar botão "Pular"': 'إظهار زر "تخطي"',
    "Pular automaticamente": "التخطي تلقائيًا",
    "Mostrar botão": "إظهار الزر",
    "Metadados extras (opcional)": "بيانات وصفية إضافية (اختياري)",
    "Chave salva": "تم حفظ المفتاح",
    "Chave removida": "تمت إزالة المفتاح",
    "Chave TMDB": "مفتاح TMDB",
    "Sinopses e títulos em PT-BR, logos e elenco com fotos (grátis em themoviedb.org)": "ملخصات وعناوين مترجمة، وشعارات، وصور الممثلين (مجانًا على themoviedb.org)",
    "Chave MDBList": "مفتاح MDBList",
    "Notas do Rotten Tomatoes, Metacritic, Trakt e Letterboxd (grátis em mdblist.com)": "تقييمات Rotten Tomatoes وMetacritic وTrakt وLetterboxd (مجانًا على mdblist.com)",
    "Addons": "الإضافات",
    "Addons ativos": "الإضافات النشطة",
    "Gerencie pela sua conta em web.stremio.com": "أدِرها من حسابك على web.stremio.com",
    "Sem conta: Cinemeta, OpenSubtitles e os adicionados aqui": "بدون حساب: Cinemeta وOpenSubtitles والإضافات المضافة هنا",
    "{n} addon(s)": "{n} إضافة",
    "Instalar {name}": "تثبيت {name}",
    "Catálogos e detalhes de animes (usado pelo calendário)": "كتالوجات وتفاصيل الأنمي (يستخدمها التقويم)",
    "Legendas em português para quase tudo": "ترجمات لكل شيء تقريبًا",
    "Cole a URL do manifest.json do addon": "الصق رابط manifest.json الخاص بالإضافة",
    "o addon": "الإضافة",
    "Addon adicionado": "تمت إضافة الإضافة",
    "Adicionar addon por URL": "إضافة إضافة عبر رابط",
    "Instala na sua conta Stremio": "تُثبَّت في حساب Stremio الخاص بك",
    "Fica só nesta TV": "تبقى على هذا التلفاز فقط",
    "Entre na conta primeiro": "سجّل الدخول أولًا",
    "Instalar {name} na sua conta Stremio?": "تثبيت {name} في حساب Stremio الخاص بك؟",
    "Instalar": "تثبيت",
    "Instalando...": "جارٍ التثبيت...",
    "{name} instalado na sua conta": "تم تثبيت {name} في حسابك",
    "Não foi possível instalar: {msg}": "تعذّر التثبيت: {msg}",
    "Esse addon já está instalado": "هذه الإضافة مثبّتة بالفعل",
    "Manifest inválido": "ملف manifest غير صالح",
    "Sobre e depuração": "حول التطبيق وتصحيح الأخطاء",
    "Log remoto": "السجل عن بُعد",
    "npm run logs no PC": "npm run logs على الكمبيوتر",
    "Log remoto ligado": "السجل عن بُعد مفعّل",
    "Enviando logs para o PC": "جارٍ إرسال السجلات إلى الكمبيوتر",
    "Log remoto desligado": "السجل عن بُعد متوقف",
    "Versão": "الإصدار",
    "Procurar atualização": "البحث عن تحديث",
    "Baixa a versão nova do GitHub ({repo})": "ينزّل الإصدار الجديد من GitHub ({repo})",
    "Procurando atualização...": "جارٍ البحث عن تحديث...",
    "Você já está na versão mais nova (v{v}).": "لديك أحدث إصدار (v{v}).",
    "Versão {v} disponível": "الإصدار {v} متاح",
    "Versão {v} disponível: Ajustes → Procurar atualização": "الإصدار {v} متاح: الإعدادات ← البحث عن تحديث",
    "Como atualizar": "طريقة التحديث",
    "No PC: webOS Dev Manager → instalar o .ipk da release": "على الكمبيوتر: webOS Dev Manager ← ثبّت ملف .ipk الخاص بالإصدار",
    "Página da release": "صفحة الإصدار",
    "Instalar a versão {v}? O app vai fechar e reabrir.": "تثبيت الإصدار {v}؟ سيُغلق التطبيق ثم يُعاد فتحه.",
    "Atualizar": "تحديث",
    "Atualizado! Reabrindo...": "تم التحديث! جارٍ إعادة الفتح...",
    "Não foi possível atualizar: {msg}": "تعذّر التحديث: {msg}",
    "Não foi possível verificar: {msg}": "تعذّر التحقق: {msg}",
    "Baixando": "جارٍ التنزيل",
    "Conferindo o arquivo...": "جارٍ التحقق من الملف...",
    "Falha na instalação": "فشل التثبيت",
    "Release sem hash SHA-256": "الإصدار بدون بصمة SHA-256",
    // Erros de rede e da conta
    "Erro da API Stremio": "خطأ في واجهة Stremio API",
    "Não foi possível gerar o código": "تعذّر إنشاء الرمز",
    "Falha de rede em {url}": "خطأ في الشبكة على {url}",
    "Tempo esgotado em {url}": "انتهت المهلة على {url}",
    "JSON inválido de {url}": "JSON غير صالح من {url}",
    "HTTP {code} em {url}": "HTTP {code} على {url}",
    "Este link é torrent: configure o servidor do PC": "هذا الرابط تورنت: أعدّ خادم الكمبيوتر",
    "Magnet inválido": "رابط magnet غير صالح",
    "Tipo de link não suportado na TV": "نوع الرابط غير مدعوم على التلفاز",
    "Usando o player do navegador nesta TV.": "سيُستخدم مشغّل المتصفح على هذا التلفاز.",
    "Áudio: {lang}": "الصوت: {lang}",
    "Escolhido sozinho ao abrir o vídeo": "يُختار تلقائيًا عند فتح الفيديو",
    "Player de vídeo": "مشغّل الفيديو",
    "O player da Samsung troca a faixa de áudio; o do navegador é o antigo": "مشغّل سامسونج يبدّل مسارات الصوت؛ مشغّل المتصفح هو القديم",
    "Samsung (AVPlay)": "سامسونج (AVPlay)",
    "Samsung (AVPlay) · indisponível nesta TV": "سامسونج (AVPlay) · غير متاح على هذا التلفاز",
    "Navegador (HTML5)": "المتصفح (HTML5)",
    "Rastreamento (Trakt e Simkl)": "التتبّع (Trakt وSimkl)",
    "Conectado: {user}": "متصل: {user}",
    "Reconectar": "أعد الربط",
    "Desconectado": "غير متصل",
    "Sincroniza assistidos, progresso e Continuar assistindo com o Trakt": "يزامن المشاهدات والتقدّم و«متابعة المشاهدة» مع Trakt",
    "Sincroniza assistidos e progresso com o Simkl": "يزامن المشاهدات والتقدّم مع Simkl",
    "Sincronizar agora": "زامن الآن",
    "Desconectar": "فصل الحساب",
    "Sincronizando...": "جارٍ المزامنة...",
    "Sincronizado": "تمت المزامنة",
    "{name} desconectado": "فُصل {name}",
    "Preencha o Client ID e o Client Secret do Trakt abaixo.": "أدخل Client ID وClient Secret الخاصين بـ Trakt في الأسفل.",
    "Preencha o Client ID do Simkl abaixo.": "أدخل Client ID الخاص بـ Simkl في الأسفل.",
    "Trakt Client ID": "Trakt Client ID",
    "Crie um app grátis em trakt.tv/oauth/applications (Redirect: urn:ietf:wg:oauth:2.0:oob)": "أنشئ تطبيقًا مجانيًا في trakt.tv/oauth/applications (Redirect: urn:ietf:wg:oauth:2.0:oob)",
    "Trakt Client Secret": "Trakt Client Secret",
    "Do mesmo app do Trakt": "من تطبيق Trakt نفسه",
    "Simkl Client ID": "Simkl Client ID",
    "Crie um app grátis em simkl.com/settings/developer": "أنشئ تطبيقًا مجانيًا في simkl.com/settings/developer",
    "Conectar {name}": "ربط {name}",
    "{name} conectado: {user}": "تم ربط {name}: {user}",
    "{name} conectado": "تم ربط {name}",
    "Código expirou. Abra de novo.": "انتهت صلاحية الرمز. افتح الصفحة من جديد.",
    "Acesso negado no site.": "رُفض الإذن في الموقع.",
    "Falhou: {msg}": "فشل: {msg}",
    "No celular ou PC, abra": "على الجوال أو الكمبيوتر افتح",
    "e digite o código:": "وأدخل الرمز:",
    "Carregando coleção...": "جارٍ تحميل السلسلة...",
    "Nenhum título encontrado nesta coleção.": "لا توجد أعمال في هذه السلسلة.",
    "Não foi possível carregar a coleção.": "تعذّر تحميل السلسلة.",
    "{n} títulos": "{n} عمل",
    "Coleções": "السلاسل",
    "Buscar outra coleção (ex.: Shrek, Rambo, Saw)...": "ابحث عن سلسلة أخرى (مثل Shrek أو Rambo أو Saw)...",
    "Com uma chave TMDB em Ajustes, dá para buscar qualquer outra coleção de filmes.": "بإضافة مفتاح TMDB في الإعدادات تقدر تبحث عن أي سلسلة أفلام أخرى.",
    "Nenhuma coleção encontrada.": "لم يُعثر على أي سلسلة.",
    "Resultados": "النتائج",
    "Não foi possível buscar agora.": "تعذّر البحث الآن.",
    "Assistidos: {done} de {n}": "شاهدت {done} من {n}",
    "Ordem da história": "ترتيب الأحداث",
    "Ordem de lançamento": "ترتيب الصدور",
    "Próximo: {title}": "التالي: {title}",
    "Esconder assistidos": "إخفاء ما شاهدته",
    "série": "مسلسل",
    "Você já assistiu tudo desta coleção.": "شاهدت كل أعمال هذه السلسلة.",
    "Coleção": "السلسلة",
    "Favoritas": "المفضلة",
    "Fixar no topo": "تثبيت في الأعلى",
    "Fixada no topo": "مثبّتة في الأعلى",
    "Fixada no topo da aba Coleções": "تم تثبيتها في أعلى السلاسل",
    "Removida das favoritas": "أُزيلت من المفضلة",
    "Contas conectadas": "الحسابات المربوطة",
    "Trakt e Simkl": "Trakt و Simkl",
    "Fonte da biblioteca": "مصدر المكتبة",
    "De onde vêm os assistidos e o Continuar assistindo": "من وين تجي المشاهَدات وإكمال المشاهدة",
    "Fonte do progresso": "مصدر تقدّم المشاهدة",
    "Para onde o progresso de reprodução é enviado": "وين يُرسل تقدّم التشغيل",
    "Recursos do Trakt": "ميزات Trakt",
    "Atualiza assistidos e Continuar assistindo": "يحدّث المشاهَدات وإكمال المشاهدة",
    "Conecte uma conta primeiro": "اربط حساب أول",
    "Pular trechos": "تخطي المقاطع",
    "IntroDB (séries e filmes) — introdb.app": "IntroDB (مسلسلات وأفلام) — introdb.app",
    'Desligado: mostra o botão "Pular"': "مطفي: يطلع زر «تخطي»",
    "Anime Skip": "Anime Skip",
    "Anime-Skip (anime-skip.com) e AniSkip: abertura e encerramento de animes": "Anime-Skip (anime-skip.com) و AniSkip: مقدمات ونهايات الأنمي",
    "AnimeSkip Client ID": "AnimeSkip Client ID",
    "Sua chave do anime-skip.com (fica só nesta TV)": "مفتاحك من anime-skip.com (يبقى في هالتلفزيون فقط)",
    "Integrações": "التكاملات",
    "Contas, fontes e recursos do Trakt": "الحسابات والمصادر وميزات Trakt",
    "Abertura, recapitulação e encerramento": "المقدمة والملخص والخاتمة",
    "Ligado": "شغّال",
    "Filmes e séries": "أفلام ومسلسلات",
    "Desenhos animados": "كرتون",
    "Animes": "أنمي",
    "{name}: este torrent ainda não está no cache. Escolha outra fonte.": "{name}: هذا التورنت مو موجود بالكاش. اختر مصدر ثاني.",
    "Chave inválida": "المفتاح غلط",
    "Endereço inválido": "العنوان غلط",
    "Usuário ou senha errados": "اسم المستخدم أو كلمة المرور غلط",
    "Leve": "خفيف",
    "Moderado": "متوسط",
    "Forte": "قوي",
    "Nudez": "عُري",
    "Violência": "عنف",
    "Palavrões": "ألفاظ",
    "Álcool e drogas": "كحول ومخدرات",
    "Cenas assustadoras": "مشاهد مخيفة",
    "Torrent · via {name}": "تورنت · عبر {name}",
    "Debrid": "Debrid",
    "Toca fontes torrent pela sua conta debrid, sem o servidor do PC. Cada um usa a própria chave, que fica só nesta TV.": "يشغّل مصادر التورنت عن طريق حسابك في الـ debrid بدون سيرفر الكمبيوتر. كل واحد يحط مفتاحه، ويبقى بس في هالتلفزيون.",
    "Usar debrid": "استخدم الـ debrid",
    "Usando {name}": "يستخدم {name}",
    "Preencha uma chave abaixo": "حط مفتاح تحت",
    "Serviço preferido": "الخدمة المفضلة",
    "Usado quando há mais de uma chave": "تُستخدم إذا عندك أكثر من مفتاح",
    "Chaves de API": "مفاتيح API",
    "Sua chave de API em {site}": "مفتاح API حقك من {site}",
    "Testar {name}": "اختبر {name}",
    "Testando...": "جاري الاختبار...",
    "{name} OK: {user}": "{name} شغّال: {user}",
    "{name} recusou a chave: {msg}": "{name} رفض المفتاح: {msg}",
    "Servidores de mídia (Jellyfin e Emby)": "سيرفرات الوسائط (Jellyfin و Emby)",
    "Os filmes e séries do seu servidor aparecem como fonte, junto com os addons.": "الأفلام والمسلسلات اللي في سيرفرك تطلع كمصدر مع الإضافات.",
    "Mostrar como fonte": "اعرضه كمصدر",
    "Lista os arquivos do servidor nas fontes": "يعرض ملفات السيرفر مع المصادر",
    "Tipo de servidor": "نوع السيرفر",
    "Endereço do servidor": "عنوان السيرفر",
    "Ex.: 192.168.0.20:8096": "مثال: 192.168.0.20:8096",
    "Usuário": "اسم المستخدم",
    "Usada só para entrar; não fica salva": "تُستخدم للدخول بس وما تنحفظ",
    "Conectar": "اتصال",
    "Preencha o endereço e o usuário": "حط العنوان واسم المستخدم",
    "Conectando...": "جاري الاتصال...",
    "Conectado a {name}": "متصل بـ {name}",
    "Não foi possível conectar: {msg}": "ما قدر يتصل: {msg}",
    "Seu próprio servidor como fonte": "سيرفرك الخاص كمصدر",
    "Chave RPDB": "مفتاح RPDB",
    "Pôsteres com as notas desenhadas (ratingposterdb.com)": "بوسترات عليها التقييمات (ratingposterdb.com)",
    "Guia para os pais": "دليل الأهل",
    "Violência, palavrões e cenas fortes na página do título (IMDb via tiffara.com)": "العنف والألفاظ والمشاهد القوية في صفحة العمل (IMDb عن طريق tiffara.com)",
    "Abrir": "افتح",
    'Adicionado a "{name}"': 'انضاف إلى "{name}"',
    "Adicionar a esta coleção": "أضف لهالمجموعة",
    "Adicionar lista pública": "أضف قائمة عامة",
    "Ajustes copiados de {name}": "انتسخت الإعدادات من {name}",
    'Ao terminar um filme, mostra "Mais como este"': 'لما يخلص الفيلم يعرض "أعمال مشابهة"',
    'Apagar a coleção "{name}"?': 'تحذف مجموعة "{name}"؟',
    "Apagar coleção": "احذف المجموعة",
    "Baixando arquivo de teste...": "جاري تنزيل ملف الاختبار...",
    "Capítulo {n}": "الفصل {n}",
    "Capítulos": "الفصول",
    'Coleção "{name}" criada': 'انسوّت مجموعة "{name}"',
    "Coleção sua": "مجموعتك",
    "Coloque sua chave MDBList em Ajustes → Metadados extras para usar listas.": "حط مفتاح MDBList في الإعدادات ← بيانات إضافية عشان تستخدم القوائم.",
    "Copiar": "انسخ",
    "Copiar ajustes de": "انسخ الإعدادات من",
    "Copiar ajustes de outro perfil": "انسخ الإعدادات من بروفايل ثاني",
    "Descer": "نزّل",
    "Escolha quais das suas listas aparecem na tela inicial": "اختر أي قوائمك تطلع في الرئيسية",
    "Esconder": "إخفاء",
    "Escondida": "مخفية",
    "Este arquivo não tem capítulos.": "هالملف ما فيه فصول.",
    "Ex.: Para ver no fim de semana": "مثال: للويكند",
    "Ex.: usuario/nome-da-lista ou o link do mdblist.com": "مثال: user/list-name أو رابط mdblist.com",
    "Fechar": "إغلاق",
    "Fileiras": "الصفوف",
    "Internet: {mbps} Mbps, ping {ms} ms ({verdict})": "النت: {mbps} ميغابت، البنق {ms} ms ({verdict})",
    "Legendas, aparência, tela inicial e coleções (a conta não é copiada)": "الترجمة والشكل والرئيسية والمجموعات (الحساب ما ينسخ)",
    'Lista "{name}" adicionada': 'انضافت قائمة "{name}"',
    "Lista não encontrada": "ما لقيت القائمة",
    "Listas do MDBList": "قوائم MDBList",
    "Mais como este": "أعمال مشابهة",
    "Medindo o ping...": "جاري قياس البنق...",
    "Minhas coleções": "مجموعاتي",
    "Minhas listas": "قوائمي",
    "Modo ambiente": "وضع الأجواء (Ambient)",
    "Mostrar": "إظهار",
    "Nome da nova coleção": "اسم المجموعة الجديدة",
    "Nova coleção": "مجموعة جديدة",
    "Nova coleção...": "مجموعة جديدة...",
    "O teste falhou: {msg}": "الاختبار فشل: {msg}",
    "O trailer toca sem som atrás do Hero Banner (mais pesado na TV)": "التريلر يشتغل بدون صوت خلف البانر (أثقل على التلفزيون)",
    "OK numa fileira: subir, descer ou esconder.": "اضغط OK على صف: طلّعه أو نزّله أو اخفه.",
    "Ordem das fileiras, listas do MDBList e Continuar assistindo": "ترتيب الصفوف وقوائم MDBList وأكمل المشاهدة",
    "Ordem do Continuar assistindo": "ترتيب أكمل المشاهدة",
    "Ordem padrão restaurada": "رجع الترتيب الأصلي",
    "Ping e velocidade de download (Cloudflare)": "البنق وسرعة التنزيل (Cloudflare)",
    "Procurando capítulos...": "جاري البحث عن الفصول...",
    "Qualidade, HDR, áudio, idioma, tamanho...": "الجودة و HDR والصوت واللغة والحجم...",
    'Removido de "{name}"': 'انشال من "{name}"',
    "Renomear": "إعادة تسمية",
    "Restaurar ordem padrão": "رجّع الترتيب الأصلي",
    "Selos das fontes": "شارات المصادر",
    "Subir": "طلّع",
    "Sugestões no fim": "اقتراحات بعد النهاية",
    "Tela inicial": "الصفحة الرئيسية",
    "Testar a internet": "اختبر النت",
    "Tirar desta coleção": "شيله من هالمجموعة",
    "Toque para tirar desta coleção": "اضغط عشان تشيله من هالمجموعة",
    'Trocar os ajustes de "{to}" pelos de "{from}"?': 'تستبدل إعدادات "{to}" بإعدادات "{from}"؟',
    "Vazia. Na página de um filme ou série, use o botão Coleção para adicionar.": "فاضية. من صفحة أي فيلم أو مسلسل اضغط زر المجموعة عشان تضيفه.",
    "Visível": "ظاهرة",
    "Você ainda não tem listas no MDBList.": "ما عندك قوائم في MDBList للحين.",
    "bom para 1080p": "زين للـ 1080p",
    "dá para 4K": "يكفي للـ 4K",
    "lenta para vídeo": "بطيء على الفيديو",
    "só 720p com folga": "720p بس براحة",
    "Assistidos por último": "آخر شي شفته",
    "Quase terminados primeiro": "اللي قربت تخلصه أول",
    "Nome (A–Z)": "الاسم (أ–ي)",
    "Qualidade (4K, 1080p, 720p)": "الجودة (4K و 1080p و 720p)",
    "HDR e Dolby Vision": "HDR و Dolby Vision",
    "REMUX": "REMUX",
    "Codec (HEVC, AV1)": "الترميز (HEVC و AV1)",
    "Áudio (Atmos, DTS, 5.1)": "الصوت (Atmos و DTS و 5.1)",
    "Idioma (Árabe, Multi)": "اللغة (عربي، متعدد)",
    "Tamanho do arquivo": "حجم الملف",
    "Taxa estimada (Mbps)": "معدل البت التقريبي (Mbps)",
    "{name}: a chave de API foi recusada. Confira em Ajustes → Debrid.": "{name}: المفتاح انرفض. تأكد منه في الإعدادات ← Debrid.",
    "A legenda e o áudio que você escolher valem para os outros episódios": "الترجمة والصوت اللي تختارهم ينطبقون على باقي الحلقات",
    "Aponte a câmera do celular para o QR, entre na sua conta e pronto: conecta sozinho.": "وجّه كاميرا الجوال على الباركود، سجّل دخول بحسابك، ويرتبط لحاله.",
    "Boa noite!": "تصبح على خير!",
    "Boa noite! O vídeo foi pausado.": "تصبح على خير! وقّفت الفيديو.",
    "Buscas recentes": "آخر عمليات البحث",
    "Buscas recentes:": "آخر عمليات البحث:",
    "Cantos dos pôsteres e botões": "زوايا البوسترات والأزرار",
    "Chave SubDL": "مفتاح SubDL",
    "Como o item selecionado aparece": "شكل العنصر المحدد",
    "Contagem regressiva": "العد التنازلي",
    "Contagem regressiva nos créditos e toca o próximo": "يعد تنازلي عند النهاية ويشغّل الحلقة الجاية",
    "Cor de destaque de botões, foco e barras": "لون الأزرار والتحديد والأشرطة",
    "Cor do app": "لون التطبيق",
    "Cores e formas": "الألوان والأشكال",
    "Depois de {n} min": "بعد {n} دقيقة",
    "Desempenho": "الأداء",
    "Diagnóstico": "الفحص",
    "Dormir": "مؤقت النوم",
    "Escuro, preto puro ou com brilho da cor": "داكن، أسود خالص أو مع توهج اللون",
    "Estilo do foco": "شكل التحديد",
    "Ex.: só os pais abrem este perfil": "مثال: بس الأهل يفتحون هالبروفايل",
    "Fileiras e Continuar assistindo": "الصفوف وأكمل المشاهدة",
    "Formato dos cartões": "شكل البطاقات",
    "Funciona (direto)": "شغّال (مباشر)",
    "Funciona (pelo servidor do PC)": "شغّال (عن طريق سيرفر الكمبيوتر)",
    "Funciona (pelo serviço da TV)": "شغّال (عن طريق خدمة التلفزيون)",
    "Fundo": "الخلفية",
    "Fundos de filmes e o relógio quando a TV fica parada": "خلفيات أفلام والساعة لما يكون التلفزيون واقف",
    "Legendas em árabe do subdl.com (crie a chave grátis em subdl.com/panel/api)": "ترجمات عربية من subdl.com (المفتاح مجاني من subdl.com/panel/api)",
    "Lembrar por série": "تذكّر لكل مسلسل",
    "Limpar": "مسح",
    "Mais pôsteres por linha ou pôsteres maiores": "بوسترات أكثر في الصف أو بوسترات أكبر",
    "Minha lista do Trakt": "قائمتي في Trakt",
    "Mostra as últimas buscas na tela de busca": "يعرض آخر عمليات البحث في شاشة البحث",
    "No fim deste vídeo": "في نهاية هالفيديو",
    "Novo PIN (4 a 8 números)": "رقم سري جديد (من 4 إلى 8 أرقام)",
    "Não funciona: o serviço da TV não respondeu. Feche o app e abra de novo pelo TizenBrew.": "ما يشتغل: خدمة التلفزيون ما ردّت. سكّر التطبيق وافتحه من TizenBrew من جديد.",
    "O player da Samsung (AVPlay) não carregou nesta TV, então o app usa o do navegador e não consegue trocar o áudio. Feche o app e abra de novo pelo TizenBrew; se continuar, avise.": "مشغّل سامسونج (AVPlay) ما اشتغل في هالتلفزيون، فالتطبيق يستخدم مشغّل المتصفح وما يقدر يغيّر الصوت. سكّر التطبيق وافتحه من TizenBrew من جديد، وإذا استمر قول لنا.",
    "O vídeo para em {n} minutos": "الفيديو بيوقف بعد {n} دقيقة",
    "O vídeo para no fim deste episódio": "الفيديو بيوقف في نهاية هالحلقة",
    "Ou abra": "أو افتح",
    "PIN de {name}": "الرقم السري لـ {name}",
    "PIN errado. Tente de novo.": "الرقم السري غلط. جرّب مرة ثانية.",
    "PIN removido": "انشال الرقم السري",
    "PIN salvo": "انحفظ الرقم السري",
    "Para trocar o áudio, o app precisa do player da Samsung (AVPlay), que não carregou. Veja Ajustes → Reprodução.": "عشان يتغيّر الصوت لازم مشغّل سامسونج (AVPlay)، وهو ما اشتغل. شوف الإعدادات ← التشغيل.",
    "Pede ao IntroDB a abertura de WandaVision T1E1 e diz por qual caminho funcionou": "يطلب من IntroDB مقدمة WandaVision الموسم 1 الحلقة 1 ويقول لك أي طريق اشتغل",
    "Pede o PIN para abrir este perfil": "يطلب الرقم السري لفتح هالبروفايل",
    "Proteção de tela": "شاشة التوقف",
    "Próximo episódio automático": "تشغيل الحلقة الجاية تلقائياً",
    "Quanto tempo o aviso do próximo episódio espera": "كم ينتظر تنبيه الحلقة الجاية",
    "Tamanho dos pôsteres": "حجم البوسترات",
    "Testar o pulo de abertura": "اختبر تخطي المقدمة",
    "Timer desligado": "المؤقت طافي",
    "Tirar o PIN": "شيل الرقم السري",
    "Trancar com PIN": "قفل برقم سري",
    "Trocar o PIN": "غيّر الرقم السري",
    "faltam {n} min": "باقي {n} دقيقة",
    "{n} minutos": "{n} دقيقة",
    "{n} segundos": "{n} ثانية",
    "Conta e perfis": "الحساب والبروفايلات",
    "Idioma, perfis, conta Stremio, controle pelo celular": "اللغة، البروفايلات، حساب Stremio، التحكم بالجوال",
    "Reprodução": "التشغيل",
    "Servidor do PC, player, próximo episódio, selos das fontes": "سيرفر الكمبيوتر، المشغّل، الحلقة الجاية، شارات المصادر",
    "Idiomas, SubDL, aparência da legenda": "اللغات، SubDL، شكل الترجمة",
    "Aparência": "المظهر",
    "Tema, tela inicial, modo ambiente, proteção de tela": "الألوان، الرئيسية، وضع الأجواء، شاشة التوقف",
    "Trakt, Simkl, pular trechos, debrid, Jellyfin, chaves, addons": "Trakt و Simkl، التخطي، Debrid، Jellyfin، المفاتيح، الإضافات",
    "Sobre": "حول التطبيق",
    "Atualizações, teste de internet, log": "التحديثات، اختبار النت، السجل",
    "Arredondado": "مدوّر",
    "Reto": "حاد",
    "Bem redondo": "مدوّر كثير",
    "Pequeno": "صغير",
    "Médio": "متوسط",
    "Grande": "كبير",
    "Contorno e aumento": "إطار وتكبير",
    "Só contorno": "إطار بس",
    "Só aumento": "تكبير بس",
    "Escuro (padrão)": "داكن (الافتراضي)",
    "Preto puro (OLED)": "أسود خالص (OLED)",
    "Escuro com brilho da cor": "داكن مع توهج اللون",
    "Índigo": "نيلي",
    "Prata": "فضي",
    "Turco": "تركي",
    "Persa": "فارسي",
    "Urdu": "أردو",
    "Indonésio": "إندونيسي",
    "Malaio": "ملايو",
    "Use de 4 a 8 números.": "استخدم من 4 إلى 8 أرقام.",
    "Chaves próprias (opcional)": "مفاتيحك الخاصة (اختياري)",
    "Aponte a câmera para o código, cole as chaves e toque em Enviar. Elas ficam só nesta TV.": "وجّه الكاميرا على الباركود، الصق المفاتيح واضغط إرسال. تبقى في هالتلفزيون بس.",
    "Chaves pelo celular": "المفاتيح من الجوال",
    "Chaves recebidas do celular: {n}": "وصلت المفاتيح من الجوال: {n}",
    "Coloque as chaves pelo celular": "حط المفاتيح من جوالك",
    "O serviço da TV não está rodando. Feche o app e abra de novo.": "خدمة التلفزيون مو شغالة. سكّر التطبيق وافتحه من جديد.",
    "Primeiro coloque as chaves pelo celular: aponte a câmera para o QR desta página.": "أول شي حط المفاتيح من جوالك: صوّر الباركود اللي في هالصفحة.",
    "Opcional: só apps antigos do Trakt têm": "اختياري: بس تطبيقات Trakt القديمة فيها",
    "Fonte do app": "خط التطبيق",
    "Letra dos menus e textos": "خط القوائم والنصوص",
    "Samsung (da TV)": "سامسونج (خط التلفزيون)",
    "Montserrat (Kai)": "Montserrat (Kai)",
    "Aponte a câmera: abra a página da chave, copie, cole e envie.": "صوّر الباركود: افتح صفحة المفتاح، انسخه، الصقه، وأرسله.",
    "Aponte o celular para o QR e entre na sua conta": "صوّر الباركود بجوالك وسجّل دخول بحسابك",
    "Ative o Quick Connect no painel do Jellyfin": "فعّل Quick Connect من لوحة تحكم Jellyfin",
    "Entrar com QR (sem chave)": "الدخول بالباركود (بدون مفتاح)",
    "Entrar com Quick Connect": "الدخول بـ Quick Connect",
    "Entrar no {name}": "الدخول إلى {name}",
    "No app ou site do Jellyfin: Configurações → Quick Connect, e digite o código.": "في تطبيق أو موقع Jellyfin: الإعدادات ← Quick Connect، واكتب الكود.",
    "Ou cole a chave": "أو الصق المفتاح",
    "Preencha o endereço do servidor primeiro": "اكتب عنوان السيرفر أول",
    "QR que abre direto a página da chave": "باركود يفتح لك صفحة المفتاح مباشرة",
    "Sem senha: aprove um código no Jellyfin do celular": "بدون كلمة مرور: وافق على كود من Jellyfin في جوالك",
    "{name} pelo celular": "{name} من الجوال",
    "Aba Animes": "تبويب الأنمي",
    "Carregar mais": "تحميل المزيد",
    "Descobrir": "اكتشف",
    "Em alta agora": "الرائج الحين",
    "Esta temporada": "هذا الموسم",
    "Estúdios": "الاستوديوهات",
    "Filmes de anime": "أفلام أنمي",
    "Gêneros": "التصنيفات",
    "Lançando agora": "ينعرض الحين",
    "Não encontrei este anime nos addons.": "ما لقيت هالأنمي في الإضافات.",
    "Não foi possível carregar agora.": "ما قدرت أحمّل الحين.",
    "Temporada, estúdios e gêneros de anime (AniList)": "موسم الأنمي والاستوديوهات والتصنيفات (AniList)",
    "Mais populares": "الأشهر",
    "Mais bem avaliados": "الأعلى تقييماً",
    "Em breve": "قريباً",
    "Ação": "أكشن",
    "Aventura": "مغامرة",
    "Comédia": "كوميدي",
    "Drama": "دراما",
    "Fantasia": "فانتازيا",
    "Terror": "رعب",
    "Mistério": "غموض",
    "Romance": "رومانسي",
    "Ficção científica": "خيال علمي",
    "Cotidiano": "شريحة من الحياة",
    "Esportes": "رياضة",
    "Sobrenatural": "خارق للطبيعة",
    "Mecha": "ميكا",
    "Psicológico": "نفسي",
    "Música": "موسيقى",
    "Anime da temporada": "أنمي المواسم",
    "Coleções prontas (filmes, séries, atores, estúdios...) ou os catálogos dos seus addons": "مجموعات جاهزة (أفلام، مسلسلات، ممثلين، استوديوهات...) أو كتالوجات إضافاتك",
    "Coloque sua chave TMDB (Ajustes → Integrações) para ver as coleções da tela inicial.": "حط مفتاح TMDB (الإعدادات ← التكاملات) عشان تشتغل مجموعات الرئيسية.",
    "Conteúdo da tela inicial": "محتوى الصفحة الرئيسية",
    "Crime e vida cotidiana": "الجريمة والحياة اليومية",
    "Décadas": "العقود",
    "Estilos de comédia e romance": "أنواع الكوميديا والرومانسي",
    "Mais favoritados": "الأكثر تفضيلاً",
    "Melhores filmes": "أفضل الأفلام",
    "Melhores séries": "أفضل المسلسلات",
    "Não foi possível abrir agora.": "ما قدرت أفتحه الحين.",
    "Não foi possível carregar as coleções agora.": "ما قدرت أحمّل المجموعات الحين.",
    "Próxima temporada": "الموسم الجاي",
    "Temas": "المواضيع",
    "{n} pastas": "{n} مجلد",
    "Coleções (Kaptain)": "المجموعات (Kaptain)",
    "Coleções e addons": "المجموعات والإضافات",
    "Só os catálogos dos addons": "كتالوجات الإضافات بس",
    "Infantil": "أطفال",
    "Inverno": "الشتاء",
    "Primavera": "الربيع",
    "Verão": "الصيف",
    "Outono": "الخريف",
    "Não foi possível ligar esta legenda.": "ما قدرت أشغّل هالترجمة."
  };

  // src/js/lib/i18n.js
  var lang = "en";
  var TABLES = {
    en: EN,
    ar: AR
  };
  function detect() {
    var nav = window.navigator && (window.navigator.language || window.navigator.userLanguage) || "";
    return /^ar/i.test(nav) ? "ar" : "en";
  }
  function init(setting) {
    lang = setting === "en" || setting === "ar" ? setting : detect();
    var root2 = document.documentElement;
    root2.setAttribute("lang", lang);
    root2.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    return lang;
  }
  function current() {
    return lang;
  }
  function apiLang() {
    return lang === "ar" ? "ar-SA" : "en-US";
  }
  function t(text, params) {
    var table = TABLES[lang];
    var out = table[text] !== void 0 ? table[text] : EN[text] !== void 0 ? EN[text] : text;
    if (params) {
      Object.keys(params).forEach(function (k) {
        out = out.split("{" + k + "}").join(String(params[k]));
      });
    }
    return out;
  }
  function epLabel(season, episode) {
    return lang === "ar" ? "م" + season + " ح" + episode : "S" + season + " E" + episode;
  }

  // src/js/lib/http.js
  function request(method, url2, body, opts) {
    var o = opts || {};
    return new Promise(function (resolve2, reject) {
      var xhr2 = new XMLHttpRequest();
      xhr2.open(method, url2, true);
      xhr2.timeout = o.timeout || 2e4;
      var hasBody = body !== void 0 && body !== null;
      var payload = !hasBody ? null : o.form ? formEncode(body) : JSON.stringify(body);
      if (hasBody) xhr2.setRequestHeader("Content-Type", o.form ? "application/x-www-form-urlencoded" : "application/json");
      if (o.headers) for (var k in o.headers) xhr2.setRequestHeader(k, o.headers[k]);
      xhr2.onload = function () {
        if (xhr2.status >= 200 && xhr2.status < 300) {
          if (o.raw) return resolve2(xhr2.responseText);
          try {
            resolve2(xhr2.responseText ? JSON.parse(xhr2.responseText) : null);
          } catch (e) {
            reject(new Error(t("JSON inválido de {url}", {
              url: url2
            })));
          }
        } else {
          var err = new Error(t("HTTP {code} em {url}", {
            code: xhr2.status,
            url: url2
          }));
          err.status = xhr2.status;
          reject(err);
        }
      };
      xhr2.onerror = function () {
        var err = new Error(t("Falha de rede em {url}", {
          url: url2
        }));
        err.status = 0;
        reject(err);
      };
      xhr2.ontimeout = function () {
        var err = new Error(t("Tempo esgotado em {url}", {
          url: url2
        }));
        err.status = 0;
        err.timeout = true;
        reject(err);
      };
      xhr2.send(payload);
    }).catch(function (err) {
      if (!o.quiet) log.warn(err.message);
      throw err;
    });
  }
  function formEncode(obj) {
    return Object.keys(obj).filter(function (k) {
      return obj[k] !== void 0 && obj[k] !== null;
    }).map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]);
    }).join("&");
  }
  function getJSON(url2, opts) {
    return request("GET", url2, null, opts);
  }
  function postJSON(url2, body, opts) {
    return request("POST", url2, body, opts);
  }
  function getText(url2, opts) {
    return request("GET", url2, null, Object.assign({
      raw: true
    }, opts));
  }
  var cache = /* @__PURE__ */new Map();
  function cachedJSON(url2, ttlMs, opts) {
    var hit = cache.get(url2);
    var now = Date.now();
    if (hit && now - hit.t < (ttlMs || 6e5)) return hit.p;
    var p = getJSON(url2, opts).catch(function (e) {
      cache.delete(url2);
      throw e;
    });
    cache.set(url2, {
      t: now,
      p: p
    });
    if (cache.size > 60) cache.delete(cache.keys().next().value);
    return p;
  }

  // src/js/lib/img.js
  function smallPoster(url2) {
    if (!url2) return url2;
    return String(url2).replace(/(images\.metahub\.space\/poster\/)(medium|large)\//, "$1small/").replace(/(image\.tmdb\.org\/t\/p\/)[^/]+\//, "$1w185/").replace(/(artworks\.thetvdb\.com\/banners\/(?:[^?]*\/)?posters\/[^/?]+?)(?:_t)?\.(jpg|png)/, "$1_t.$2").replace(/(static\.tvmaze\.com\/uploads\/images\/)(original_untouched|large_landscape|medium_landscape)\//, "$1medium_portrait/").replace(/(kitsu\.app\/anime\/poster_images\/\d+\/)(original|large|medium)\.(jpg|jpeg|png)/, "$1small.jpg");
  }
  function ratedPoster(id, key3) {
    var k = String(key3 || "").trim();
    var m = String(id || "").match(/^tt\d+/);
    if (!k || !m || !/^[\w-]+$/.test(k)) return null;
    return "https://api.ratingposterdb.com/" + k + "/imdb/poster-default/" + m[0] + ".jpg?fallback=true";
  }
  function smallBackground(url2) {
    if (!url2) return url2;
    return String(url2).replace(/(images\.metahub\.space\/background\/)(medium|large)\//, "$1small/").replace(/(image\.tmdb\.org\/t\/p\/)[^/]+\//, "$1w300/").replace(/(kitsu\.app\/anime\/(?:poster|cover)_images\/\d+\/)(original|large)\.(jpg|jpeg|png)/, "$1small.jpg").replace(/(artworks\.thetvdb\.com\/banners\/(?:[^?]*\/)?(?:posters|fanart)\/[^/?]+?)(?:_t)?\.(jpg|png)/, "$1_t.$2");
  }
  function smallThumb(url2) {
    if (!url2) return url2;
    return String(url2).replace(/(image\.tmdb\.org\/t\/p\/)[^/]+\//, "$1w300/").replace(/(artworks\.thetvdb\.com\/banners\/(?:[^?]*\/)?episodes\/[^/?]+?)(?:_t)?\.(jpg|png)/, "$1_t.$2");
  }
  var KITSU_RE = /(?:media\.kitsu\.app|kitsu-production-media\.[^/]+)\/anime\/(?:poster_images\/)?(\d+)\/(poster_image|cover_image)\/(?!small-|tiny-|medium-|large-)/;
  var kitsuCache = {};
  var batch = {};
  var batchTimer = null;
  function kitsuInfo(url2) {
    var m = String(url2 || "").match(KITSU_RE);
    return m ? {
      id: m[1],
      kind: m[2] === "cover_image" ? "cover" : "poster"
    } : null;
  }
  function flush2() {
    var ids2 = Object.keys(batch);
    var waiting = batch;
    batch = {};
    batchTimer = null;
    var _loop2 = function _loop2() {
      var chunk = ids2.slice(i, i + 20);
      getJSON("https://kitsu.io/api/edge/anime?filter%5Bid%5D=" + chunk.join(",") + "&fields%5Banime%5D=posterImage,coverImage&page%5Blimit%5D=20", {
        quiet: true,
        timeout: 15e3
      }).then(function (r) {
        var found = {};
        (r && r.data || []).forEach(function (a) {
          return found[a.id] = a.attributes || {};
        });
        chunk.forEach(function (id) {
          var at = found[id] || {};
          var p = at.posterImage || {};
          var c = at.coverImage || {};
          waiting[id].forEach(function (w) {
            return w.resolve(w.kind === "cover" ? c.small || c.tiny || null : p.small || p.tiny || null);
          });
        });
      }).catch(function () {
        return chunk.forEach(function (id) {
          return waiting[id].forEach(function (w) {
            return w.resolve(null);
          });
        });
      });
    };
    for (var i = 0; i < ids2.length; i += 20) {
      _loop2();
    }
  }
  function kitsuSmall(info2) {
    var key3 = info2.id + ":" + info2.kind;
    if (!kitsuCache[key3]) {
      kitsuCache[key3] = new Promise(function (resolve2) {
        (batch[info2.id] = batch[info2.id] || []).push({
          kind: info2.kind,
          resolve: resolve2
        });
        if (!batchTimer) batchTimer = setTimeout(flush2, 60);
      });
    }
    return kitsuCache[key3];
  }

  // src/js/lib/dom.js
  function h(tag, props, children) {
    var parts = tag.split(/(?=[.#])/);
    var el = document.createElement(parts[0] || "div");
    for (var i = 1; i < parts.length; i++) {
      var p = parts[i];
      if (p[0] === ".") el.classList.add(p.slice(1));else if (p[0] === "#") el.id = p.slice(1);
    }
    if (props) {
      for (var key3 in props) {
        var val = props[key3];
        if (val === void 0 || val === null || val === false) continue;
        if (key3 === "text") el.textContent = val;else if (key3 === "html") el.innerHTML = val;else if (key3 === "style" && _typeof(val) === "object") Object.assign(el.style, val);else if (key3 === "on") for (var ev in val) el.addEventListener(ev, val[ev]);else if (key3 === "onSelect") el.__select = val;else if (key3 === "onFocus") el.__focus = val;else if (key3 === "focusable") el.setAttribute("data-focus", "");else if (key3 === "cls") String(val).split(" ").forEach(function (c) {
          return c && el.classList.add(c);
        });else el.setAttribute(key3, val === true ? "" : val);
      }
    }
    append(el, children);
    return el;
  }
  function append(el, children) {
    if (children === void 0 || children === null || children === false) return el;
    if (Array.isArray(children)) children.forEach(function (c) {
      return append(el, c);
    });else if (typeof children === "string" || typeof children === "number") el.appendChild(document.createTextNode(String(children)));else el.appendChild(children);
    return el;
  }
  function clear(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
    return el;
  }
  function $$(sel, root2) {
    return Array.prototype.slice.call((root2 || document).querySelectorAll(sel));
  }
  var BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  function setOn(el, on) {
    if (on && !el.__on) {
      el.__on = true;
      var url2 = el.getAttribute("data-lazy");
      var kitsu = kitsuInfo(url2);
      if (!kitsu) {
        el.src = url2;
        return;
      }
      kitsuSmall(kitsu).then(function (small) {
        if (!el.__on) return;
        if (small) {
          el.setAttribute("data-lazy", small);
          el.src = small;
        } else if (el.onerror) el.onerror();
      });
    } else if (!on && el.__on) {
      el.__on = false;
      el.src = BLANK;
    }
  }
  function loadVisibleImages(root2, margin) {
    var m = margin === void 0 ? 400 : margin;
    var W = window.innerWidth;
    var H = window.innerHeight;
    var isFar = function isFar(r) {
      return r.right < -W * 0.5 || r.left > W * 1.6 || r.bottom < -H * 0.8 || r.top > H * 1.8;
    };
    var handled = [];
    $$("[data-scroll-x]", root2).forEach(function (track) {
      if (track.offsetParent === null) return;
      var tr = track.getBoundingClientRect();
      if (tr.bottom < -H * 0.8 || tr.top > H * 1.8) {
        $$("img[data-lazy]", track).forEach(function (el) {
          return setOn(el, false);
        });
        handled.push(track);
      }
    });
    $$("img[data-lazy]", root2).forEach(function (el) {
      if (el.offsetParent === null) return;
      for (var i = 0; i < handled.length; i++) if (handled[i].contains(el)) return;
      var r = el.getBoundingClientRect();
      var near = r.right > -m && r.left < W + m && r.bottom > -m && r.top < H + m;
      if (near) setOn(el, true);else if (isFar(r)) setOn(el, false);
    });
  }
  function unloadImages(root2) {
    $$("img[data-lazy]", root2).forEach(function (el) {
      if (el.__on) {
        el.__on = false;
        el.src = BLANK;
      }
    });
  }

  // src/js/lib/platform.js
  function isTizen() {
    return _typeof(window.tizen) === "object" || /Tizen/i.test(navigator.userAgent || "");
  }
  function registerTizenKeys() {
    var input = window.tizen && window.tizen.tvinputdevice;
    if (!input) return;
    ["MediaPlayPause", "MediaPlay", "MediaPause", "MediaStop", "MediaFastForward", "MediaRewind", "ColorF0Red", "ColorF1Green", "ColorF2Yellow", "ColorF3Blue", "ChannelUp", "ChannelDown"].forEach(function (k) {
      try {
        input.registerKey(k);
      } catch (e) {}
    });
  }

  // src/js/lib/nav.js
  var TIZEN = isTizen();
  var KEY = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    ENTER: 13,
    IME_DONE: 65376,
    // Samsung on-screen keyboard Done (not the remote's OK)
    IME_CANCEL: 65385,
    // Samsung on-screen keyboard Cancel
    BACK: TIZEN ? 10009 : 461,
    // Samsung Return / LG Back
    ESC: 27,
    BACKSPACE: 8,
    PLAY: 415,
    PAUSE: 19,
    PLAYPAUSE: TIZEN ? 10252 : 179,
    STOP: 413,
    FF: 417,
    RW: 412,
    RED: 403,
    GREEN: 404,
    YELLOW: 405,
    BLUE: 406,
    CH_UP: TIZEN ? 427 : 33,
    CH_DOWN: TIZEN ? 428 : 34
  };
  var layers = [];
  var scrollHook = null;
  var pointerMode = false;
  var smooth = false;
  function setSmooth(on) {
    smooth = !!on;
  }
  function top() {
    return layers[layers.length - 1] || null;
  }
  function isVisible(el) {
    if (!el || el.offsetParent === null) return false;
    if (el.hasAttribute("disabled")) return false;
    return true;
  }
  function candidates(root2) {
    return $$("[data-focus]", root2).filter(isVisible);
  }
  function center(r) {
    return {
      x: (r.left + r.right) / 2,
      y: (r.top + r.bottom) / 2
    };
  }
  function pick(list2, cur, dir) {
    var cr = cur.getBoundingClientRect();
    var cc = center(cr);
    var tol = 8;
    var best = null;
    var bestScore = Infinity;
    for (var i = 0; i < list2.length; i++) {
      var el = list2[i];
      var r = el.getBoundingClientRect();
      var primary = void 0;
      var secondary = void 0;
      if (dir === "right") {
        if (r.left < cr.right - tol && center(r).x <= cc.x + tol) continue;
        if (center(r).x <= cc.x) continue;
        primary = Math.max(0, r.left - cr.right);
        secondary = overlap(r.top, r.bottom, cr.top, cr.bottom) ? 0 : Math.abs(center(r).y - cc.y);
      } else if (dir === "left") {
        if (center(r).x >= cc.x) continue;
        if (r.right > cr.left + tol && center(r).x >= cc.x - tol) continue;
        primary = Math.max(0, cr.left - r.right);
        secondary = overlap(r.top, r.bottom, cr.top, cr.bottom) ? 0 : Math.abs(center(r).y - cc.y);
      } else if (dir === "down") {
        if (r.top < cr.bottom - tol) continue;
        primary = Math.max(0, r.top - cr.bottom);
        secondary = overlap(r.left, r.right, cr.left, cr.right) ? Math.abs(r.left - cr.left) / 10 : Math.abs(center(r).x - cc.x);
      } else {
        if (r.bottom > cr.top + tol) continue;
        primary = Math.max(0, cr.top - r.bottom);
        secondary = overlap(r.left, r.right, cr.left, cr.right) ? Math.abs(r.left - cr.left) / 10 : Math.abs(center(r).x - cc.x);
      }
      var score = primary + secondary * 2.5;
      if (score < bestScore) {
        bestScore = score;
        best = el;
      }
    }
    return best;
  }
  function overlap(a1, a2, b1, b2) {
    return Math.min(a2, b2) - Math.max(a1, b1) > 4;
  }
  function animateScroll(node, prop, target) {
    if (node.__anim) cancelAnimationFrame(node.__anim);
    var start3 = node[prop];
    var delta = target - start3;
    if (!smooth || Math.abs(delta) < 2) {
      node[prop] = target;
      if (scrollHook) scrollHook(node);
      return;
    }
    var dur = 160;
    var t0 = Date.now();
    var _step2 = function step() {
      var k = Math.min(1, (Date.now() - t0) / dur);
      node[prop] = start3 + delta * (1 - Math.pow(1 - k, 3));
      if (k < 1) node.__anim = requestAnimationFrame(_step2);else {
        node.__anim = null;
        if (scrollHook) scrollHook(node);
      }
    };
    node.__anim = requestAnimationFrame(_step2);
  }
  function ensureVisible(el) {
    var node = el.parentNode;
    while (node && node.nodeType === 1) {
      if (node.hasAttribute("data-scroll-x")) {
        var pad = parseInt(node.getAttribute("data-pad") || "96", 10);
        var er = el.getBoundingClientRect();
        var nr = node.getBoundingClientRect();
        var target = node.scrollLeft;
        if (er.left < nr.left + pad) target -= nr.left + pad - er.left;else if (er.right > nr.right - pad) target += er.right - (nr.right - pad);
        target = Math.max(0, Math.min(target, node.scrollWidth - node.clientWidth));
        if (target !== node.scrollLeft) animateScroll(node, "scrollLeft", target);
      }
      if (node.hasAttribute("data-scroll-y")) {
        var _pad = parseInt(node.getAttribute("data-pad-y") || "140", 10);
        var _er = el.getBoundingClientRect();
        var _nr = node.getBoundingClientRect();
        var _target = node.scrollTop;
        var anchor = el.closest("[data-anchor]");
        if (anchor && node.contains(anchor)) {
          var ar = anchor.getBoundingClientRect();
          _target += ar.top - _nr.top - parseInt(anchor.getAttribute("data-anchor") || "0", 10);
        } else if (_er.top < _nr.top + _pad) _target -= _nr.top + _pad - _er.top;else if (_er.bottom > _nr.bottom - _pad) _target += _er.bottom - (_nr.bottom - _pad);
        _target = Math.max(0, Math.min(_target, node.scrollHeight - node.clientHeight));
        if (_target !== node.scrollTop) animateScroll(node, "scrollTop", _target);
      }
      node = node.parentNode;
    }
  }
  function focus(el, opts) {
    var layer = top();
    if (!layer || !el) return;
    var prev = layer.current;
    if (prev && prev !== el) {
      prev.classList.remove("focused");
      if (prev.__blur) prev.__blur();
    }
    layer.current = el;
    el.classList.add("focused");
    var group = el.closest("[data-group]");
    if (group) group.__last = el;
    if (!(opts && opts.noScroll)) ensureVisible(el);
    if (el.__focus && prev !== el) el.__focus(el);
  }
  function current2() {
    var layer = top();
    return layer ? layer.current : null;
  }
  function focusFirst(root2) {
    var layer = top();
    if (!layer) return;
    var scope = root2 || layer.root;
    var pref = $$("[data-autofocus]", scope).filter(isVisible)[0];
    var el = pref || candidates(scope)[0];
    if (el) focus(el);
  }
  function move(dir) {
    var layer = top();
    if (!layer) return false;
    var cur = layer.current;
    if (!cur || !document.body.contains(cur) || !isVisible(cur)) {
      focusFirst();
      return true;
    }
    var group = cur.closest("[data-group]");
    var horizontal = dir === "left" || dir === "right";
    if (group && horizontal === !group.hasAttribute("data-vertical")) {
      var inGroup = candidates(group).filter(function (e) {
        return e !== cur;
      });
      var g = pick(inGroup, cur, dir);
      if (g) {
        focus(g);
        return true;
      }
      if (group.hasAttribute("data-trap")) return false;
    }
    var all2 = candidates(layer.root).filter(function (e) {
      return e !== cur;
    });
    var best = pick(all2, cur, dir);
    if (!best) return false;
    var bg = best.closest("[data-group]");
    if (bg && bg !== group && bg.__last && bg.contains(bg.__last) && isVisible(bg.__last)) best = bg.__last;
    focus(best);
    return true;
  }
  function select(el) {
    var target = el || current2();
    if (!target) return;
    if (target.tagName === "INPUT") {
      target.focus();
      return;
    }
    if (target.__select) target.__select(target);
  }
  function pushLayer(root2, handlers) {
    var layer = Object.assign({
      root: root2,
      current: null
    }, handlers || {});
    layers.push(layer);
    return layer;
  }
  function popLayer(layer) {
    var i = layers.indexOf(layer);
    if (i >= 0) layers.splice(i, 1);
    var t2 = top();
    if (t2 && t2.current) {
      t2.current.classList.add("focused");
    }
  }
  function topLayer() {
    return top();
  }
  function onScroll(fn) {
    scrollHook = fn;
  }
  function onKeyDown(e) {
    var layer = top();
    if (!layer) return;
    var code = e.keyCode;
    var active2 = document.activeElement;
    var typing = active2 && (active2.tagName === "INPUT" || active2.tagName === "TEXTAREA");
    if (typing) {
      if (code === KEY.ENTER || code === KEY.IME_DONE) {
        if (code === KEY.ENTER) e.preventDefault();
        active2.blur();
        if (active2.__submit) active2.__submit(active2.value);
        return;
      } else if (code === KEY.BACK || code === KEY.ESC || code === KEY.IME_CANCEL) {
        if (code !== KEY.IME_CANCEL) e.preventDefault();
        active2.blur();
        return;
      } else if (code === KEY.UP || code === KEY.DOWN) {
        active2.blur();
      } else return;
    }
    if (code >= 37 && code <= 40 && pointerMode) pointerMode = false;
    if (layer.onKey && layer.onKey(e) === true) {
      e.preventDefault();
      return;
    }
    switch (code) {
      case KEY.LEFT:
        move("left");
        break;
      case KEY.RIGHT:
        move("right");
        break;
      case KEY.UP:
        move("up");
        break;
      case KEY.DOWN:
        move("down");
        break;
      case KEY.ENTER:
        select();
        break;
      case KEY.BACK:
      case KEY.ESC:
      case KEY.BACKSPACE:
        if (layer.onBack) layer.onBack();
        break;
      default:
        return;
    }
    e.preventDefault();
  }
  function onMouseOver(e) {
    var layer = top();
    if (!layer) return;
    pointerMode = true;
    var el = e.target.closest ? e.target.closest("[data-focus]") : null;
    if (el && layer.root.contains(el) && el !== layer.current) focus(el, {
      noScroll: true
    });
  }
  function onClick(e) {
    var layer = top();
    if (!layer) return;
    var el = e.target.closest ? e.target.closest("[data-focus]") : null;
    if (el && layer.root.contains(el)) {
      focus(el, {
        noScroll: true
      });
      select(el);
    }
  }
  var wheelLock = 0;
  function onWheel(e) {
    var now = Date.now();
    if (now - wheelLock < 120) return;
    wheelLock = now;
    move(e.deltaY > 0 ? "down" : "up");
  }
  function install() {
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("click", onClick);
    document.addEventListener("mousewheel", onWheel);
  }

  // src/js/lib/store.js
  var PREFIX = "kai.";
  function rawGet(key3, fallback) {
    try {
      var raw = window.localStorage.getItem(PREFIX + key3);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }
  function rawSet(key3, value) {
    try {
      if (value === void 0 || value === null) window.localStorage.removeItem(PREFIX + key3);else window.localStorage.setItem(PREFIX + key3, JSON.stringify(value));
    } catch (e) {}
  }
  var COLORS = ["#7b5bf5", "#e5508c", "#2bb6a3", "#f0a030", "#3d8bfd", "#e55353", "#8bc34a", "#9e9e9e"];
  function profileKey(id, key3) {
    return "p." + id + "." + key3;
  }
  function ensureProfiles() {
    var list2 = rawGet("profiles", null);
    if (list2 && list2.length) return list2;
    var id = "p" + Date.now().toString(36);
    var oldAuth = rawGet("auth", null);
    var email = oldAuth && oldAuth.user && oldAuth.user.email;
    list2 = [email ? {
      id: id,
      name: email.split("@")[0],
      color: COLORS[0]
    } : {
      id: id,
      name: "Perfil 1",
      color: COLORS[0],
      unnamed: true
    }];
    ["auth", "addons", "library"].forEach(function (k) {
      var v = rawGet(k, null);
      if (v !== null) rawSet(profileKey(id, k), v);
      rawSet(k, null);
    });
    var oldSettings = rawGet("settings", null);
    if (oldSettings) {
      var dev = {};
      var prof = {};
      Object.keys(oldSettings).forEach(function (k) {
        if (k === "devlogUrl" || oldSettings[k] === "") return;
        (DEVICE_KEYS.indexOf(k) >= 0 ? dev : prof)[k] = oldSettings[k];
      });
      rawSet("device", dev);
      rawSet(profileKey(id, "settings"), prof);
      rawSet("settings", null);
    }
    rawSet("profiles", list2);
    rawSet("activeProfile", id);
    return list2;
  }
  function profiles() {
    return ensureProfiles();
  }
  function activeProfile() {
    var list2 = ensureProfiles();
    var id = rawGet("activeProfile", null);
    return list2.find(function (p) {
      return p.id === id;
    }) || list2[0];
  }
  function setActiveProfile(id) {
    rawSet("activeProfile", id);
  }
  function addProfile(name, color) {
    var list2 = ensureProfiles();
    var p = {
      id: "p" + Date.now().toString(36),
      name: name || "Perfil " + (list2.length + 1),
      color: color || COLORS[list2.length % COLORS.length]
    };
    list2.push(p);
    rawSet("profiles", list2);
    return p;
  }
  function updateProfile(id, patch) {
    var list2 = ensureProfiles().map(function (p) {
      return p.id === id ? Object.assign({}, p, patch) : p;
    });
    rawSet("profiles", list2);
  }
  function removeProfile(id) {
    var list2 = ensureProfiles().filter(function (p) {
      return p.id !== id;
    });
    if (!list2.length) return false;
    ["auth", "addons", "library", "settings", "watched", "track.trakt", "track.simkl"].forEach(function (k) {
      return rawSet(profileKey(id, k), null);
    });
    rawSet("profiles", list2);
    if (rawGet("activeProfile", null) === id) rawSet("activeProfile", list2[0].id);
    return true;
  }
  function getFor(profileId, key3, fallback) {
    return rawGet(profileKey(profileId, key3), fallback);
  }
  function get(key3, fallback) {
    return rawGet(profileKey(activeProfile().id, key3), fallback);
  }
  function set(key3, value) {
    rawSet(profileKey(activeProfile().id, key3), value);
  }
  var DEVICE_KEYS = ["serverUrl", "tmdbKey", "mdblistKey", "smoothScroll", "perfMode", "devlogUrl", "lastUpdateCheck", "askProfile", "wizardDone", "language", "traktClientId", "traktClientSecret", "simklClientId", "playerEngine", "animeSkipClientId", "animeSkip", "librarySource", "progressSource", "debridEnabled", "debridProvider", "realDebridKey", "torboxKey", "premiumizeKey", "mediaServer", "mediaServerEnabled", "mediaServerDeviceId", "rpdbKey", "parentalGuide", "subdlKey", "screensaver", "realDebridAuth", "appFont"];
  var DEFAULT_SETTINGS = {
    // TV
    serverUrl: "",
    tmdbKey: true ? "" : "",
    mdblistKey: true ? "" : "",
    smoothScroll: false,
    // rolagem animada (mais bonita, mais pesada na TV)
    perfMode: true,
    // Performance mode: no animations, no New episodes row, no background sync
    smartChoice: true,
    // Watch picks the best source and plays it
    theme: "purple",
    // see lib/theme.js
    devlogUrl: true ? "" : "",
    language: "auto",
    // 'auto' (TV language: Arabic or English) | 'en' | 'ar'
    // Tracking API apps (trakt.tv/oauth/applications, simkl.com/settings/developer): build or Settings.
    traktClientId: "",
    // empty = the app's own keys from the build (api/tracker.js)
    traktClientSecret: "",
    simklClientId: "",
    playerEngine: "auto",
    // 'auto' = Samsung AVPlay when present (audio track switching) | 'html5'
    askProfile: true,
    // "Quem está assistindo?" ao abrir, se houver mais de um perfil
    wizardDone: false,
    // Perfil
    heroSource: "cinemeta",
    oled: false,
    subtitleLangs: ["eng", "en"],
    audioLangs: [],
    // vazio = mantém o áudio padrão do arquivo (geralmente o original)
    subtitleSize: 100,
    subtitleFont: "nata",
    subtitleStyle: "kai",
    subtitleColor: "#ffffff",
    subtitleBold: true,
    subtitlePosition: "low",
    skipMode: "auto",
    // auto (default) | prompt | off
    animeSkip: true,
    // AniSkip for anime
    animeSkipClientId: "",
    librarySource: "both",
    // both | trakt | simkl
    progressSource: "both",
    subtitlesAuto: true,
    localAddons: [],
    // Integrations from Nuvio. Each user types their own keys; empty = off.
    debridEnabled: true,
    // only does something once a key is filled in
    debridProvider: "realdebrid",
    realDebridKey: "",
    torboxKey: "",
    premiumizeKey: "",
    mediaServer: null,
    // { providerId, address, token, userId, user, name } (no password)
    mediaServerEnabled: true,
    rpdbKey: "",
    parentalGuide: false,
    // Nuvio features (per profile)
    homeRows: null,
    // { order: [], hidden: [] }
    cwSort: "recent",
    mdblistRows: [],
    // [{ id, name }]
    ambientMode: false,
    postPlay: true,
    streamBadges: null,
    // { quality, hdr, remux, bitrate, size, audio, codec, lang } → false hides
    subdlKey: "",
    // SubDL API key (TV)
    screensaver: 0,
    // minutes idle before the screensaver (TV); 0 = off
    autoNext: true,
    upNextSeconds: 10,
    rememberTracks: true,
    traktWatchlistRow: true,
    searchHistory: true,
    cardShape: "rounded",
    // rounded | square | soft
    cardSize: "medium",
    // small | medium | large
    focusStyle: "glow"
    // glow | outline | lift
  };
  function settings() {
    var subs = {
      en: ["eng", "en"],
      ar: ["ara", "ar"]
    }[current()];
    var base = Object.assign({}, DEFAULT_SETTINGS, subs ? {
      subtitleLangs: subs
    } : null);
    return Object.assign(base, rawGet("device", {}), get("settings", {}));
  }
  function copySettingsFrom(profileId) {
    var from = getFor(profileId, "settings", {}) || {};
    set("settings", JSON.parse(JSON.stringify(from)));
    ["franchiseOrder", "franchiseFavs", "myCollections", "subDelays"].forEach(function (k) {
      var v = getFor(profileId, k, null);
      if (v !== null) set(k, JSON.parse(JSON.stringify(v)));
    });
  }
  function saveSettings(patch) {
    var dev = rawGet("device", {});
    var prof = get("settings", {});
    Object.keys(patch).forEach(function (k) {
      return (DEVICE_KEYS.indexOf(k) >= 0 ? dev : prof)[k] = patch[k];
    });
    rawSet("device", dev);
    set("settings", prof);
    return settings();
  }

  // src/js/api/stremio.js
  var API = "https://api.strem.io/api/";
  var LINK = "https://link.stremio.com/api/v2/";
  var auth = get("auth", null);
  function reloadProfile() {
    auth = get("auth", null);
    libMem = null;
  }
  function call(method, body) {
    return postJSON(API + method, body).then(function (res) {
      if (res && res.error) {
        var err = new Error(res.error.message || t("Erro da API Stremio"));
        err.code = res.error.code;
        throw err;
      }
      return res ? res.result : null;
    });
  }
  function isLoggedIn() {
    return !!(auth && auth.authKey);
  }
  function user() {
    return auth ? auth.user : null;
  }
  function authKey() {
    return auth ? auth.authKey : null;
  }
  function saveAuth(result) {
    auth = {
      authKey: result.authKey,
      user: result.user || null
    };
    set("auth", auth);
    return auth;
  }
  function login(email, password) {
    return call("login", {
      type: "Login",
      email: email,
      password: password,
      facebook: false
    }).then(saveAuth);
  }
  function createLinkCode() {
    return getJSON(LINK + "create?type=Create").then(function (res) {
      if (!res || !res.result || !res.result.code) throw new Error(t("Não foi possível gerar o código"));
      return res.result;
    });
  }
  function readLinkCode(code) {
    return getJSON(LINK + "read?type=Read&code=" + encodeURIComponent(code), {
      quiet: true
    }).then(function (res) {
      if (res && res.result && res.result.authKey) {
        saveAuth({
          authKey: res.result.authKey,
          user: null
        });
        return refreshUser().then(function () {
          return true;
        });
      }
      return false;
    });
  }
  function refreshUser() {
    if (!isLoggedIn()) return Promise.resolve(null);
    return call("getUser", {
      type: "GetUser",
      authKey: auth.authKey
    }).then(function (u) {
      auth.user = u;
      set("auth", auth);
      return u;
    }).catch(function (e) {
      if (e.code === 1) logout();
      throw e;
    });
  }
  function logout() {
    var key3 = authKey();
    auth = null;
    set("auth", null);
    set("addons", null);
    setLibrary([]);
    if (key3) call("logout", {
      type: "Logout",
      authKey: key3
    }).catch(function () {});
  }
  function getAddonCollection() {
    if (!isLoggedIn()) return Promise.resolve(null);
    return call("addonCollectionGet", {
      type: "AddonCollectionGet",
      authKey: auth.authKey,
      update: true
    }).then(function (r) {
      var addons2 = r && r.addons || [];
      set("addons", addons2);
      return addons2;
    });
  }
  function installAddon(transportUrl) {
    if (!isLoggedIn()) return Promise.reject(new Error(t("Entre na conta primeiro")));
    return getJSON(transportUrl).then(function (manifest) {
      if (!manifest || !manifest.id) throw new Error(t("Manifest inválido"));
      return call("addonCollectionGet", {
        type: "AddonCollectionGet",
        authKey: auth.authKey,
        update: true
      }).then(function (r) {
        var list2 = r && r.addons || [];
        if (list2.some(function (a) {
          return a.transportUrl === transportUrl || a.manifest && a.manifest.id === manifest.id;
        })) {
          throw new Error(t("Esse addon já está instalado"));
        }
        var next = list2.concat([{
          transportUrl: transportUrl,
          transportName: "http",
          manifest: manifest,
          flags: {
            official: false,
            protected: false
          }
        }]);
        return call("addonCollectionSet", {
          type: "AddonCollectionSet",
          authKey: auth.authKey,
          addons: next
        }).then(function () {
          set("addons", next);
          return manifest;
        });
      });
    });
  }
  function cachedAddons() {
    return get("addons", null);
  }
  function getLibrary() {
    if (!isLoggedIn()) return Promise.resolve(cachedLibrary());
    return call("datastoreGet", {
      authKey: auth.authKey,
      collection: "libraryItem",
      ids: [],
      all: true
    }).then(function (items3) {
      var list2 = Array.isArray(items3) ? items3 : [];
      setLibrary(list2);
      return list2;
    });
  }
  var libMem = null;
  var libSaveTimer = null;
  function setLibrary(list2) {
    libMem = list2;
    clearTimeout(libSaveTimer);
    libSaveTimer = setTimeout(function () {
      var slim = (libMem || []).filter(function (it) {
        return !it.removed || it.temp || it.state && it.state.timeOffset > 0;
      });
      set("library", slim);
    }, 1500);
  }
  function cachedLibrary() {
    if (!libMem) libMem = get("library", []);
    return libMem;
  }
  function putLibraryItems(items3) {
    var lib = cachedLibrary();
    items3.forEach(function (it) {
      var i = lib.findIndex(function (x) {
        return x._id === it._id;
      });
      if (i >= 0) lib[i] = it;else lib.push(it);
    });
    setLibrary(lib);
    if (!isLoggedIn()) return Promise.resolve();
    return call("datastorePut", {
      authKey: auth.authKey,
      collection: "libraryItem",
      changes: items3
    }).catch(function (e) {
      log.warn("Falha ao salvar na biblioteca", e.message);
    });
  }
  function libraryItem(id) {
    return cachedLibrary().find(function (x) {
      return x._id === id;
    }) || null;
  }
  function nowIso() {
    return (/* @__PURE__ */new Date()).toISOString();
  }
  function newLibraryItem(meta) {
    return {
      _id: meta.id,
      name: meta.name || "",
      type: meta.type,
      poster: meta.poster || null,
      posterShape: meta.posterShape || "poster",
      removed: true,
      temp: true,
      _ctime: nowIso(),
      _mtime: nowIso(),
      state: {
        lastWatched: null,
        timeWatched: 0,
        timeOffset: 0,
        overallTimeWatched: 0,
        timesWatched: 0,
        flaggedWatched: 0,
        duration: 0,
        video_id: null,
        watched: null,
        noNotif: false
      },
      behaviorHints: {
        defaultVideoId: null,
        featuredVideoId: null,
        hasScheduledVideos: false
      }
    };
  }
  function clone(o) {
    return JSON.parse(JSON.stringify(o));
  }
  function setInLibrary(meta, inLibrary) {
    var existing = libraryItem(meta.id);
    var item2 = existing ? clone(existing) : newLibraryItem(meta);
    item2.removed = !inLibrary;
    item2.temp = false;
    item2._mtime = nowIso();
    return putLibraryItems([item2]).then(function () {
      return item2;
    });
  }
  function isInLibrary(id) {
    var it = libraryItem(id);
    return !!(it && !it.removed);
  }
  function saveProgress(meta, videoId, timeMs, durationMs, deltaWatchedMs) {
    var existing = libraryItem(meta.id);
    var item2 = existing ? clone(existing) : newLibraryItem(meta);
    var s = item2.state;
    if (s.video_id !== videoId) {
      s.timeWatched = 0;
      s.flaggedWatched = 0;
    }
    s.video_id = videoId;
    s.timeOffset = Math.max(0, Math.round(timeMs));
    s.duration = Math.max(0, Math.round(durationMs));
    s.lastWatched = nowIso();
    s.timeWatched = (s.timeWatched || 0) + Math.max(0, Math.round(deltaWatchedMs));
    s.overallTimeWatched = (s.overallTimeWatched || 0) + Math.max(0, Math.round(deltaWatchedMs));
    if (!s.flaggedWatched && s.duration > 0 && s.timeWatched > s.duration * 0.7) {
      s.flaggedWatched = 1;
      s.timesWatched = (s.timesWatched || 0) + 1;
    }
    if (s.duration > 0 && s.timeOffset > s.duration * 0.95) s.timeOffset = 0;
    if (!item2.name && meta.name) item2.name = meta.name;
    if (!item2.poster && meta.poster) item2.poster = meta.poster;
    item2._mtime = nowIso();
    return putLibraryItems([item2]);
  }
  function mergeExternalProgress(list2) {
    var changed = [];
    (list2 || []).forEach(function (p) {
      var existing = libraryItem(p.id);
      var localAt = existing && existing.state && existing.state.lastWatched;
      if (localAt && String(localAt) >= String(p.at || "")) return;
      var item2 = existing ? clone(existing) : newLibraryItem({
        id: p.id,
        type: p.type,
        name: p.name,
        poster: /^tt\d+$/.test(p.id) ? "https://images.metahub.space/poster/medium/" + p.id + "/img" : null
      });
      var s = item2.state;
      var dur = s.video_id === p.videoId && s.duration > 0 ? s.duration : (p.runtime || (p.type === "movie" ? 110 : 45)) * 6e4;
      s.video_id = p.videoId;
      s.duration = dur;
      s.timeOffset = Math.round(dur * p.progress);
      s.lastWatched = p.at || nowIso();
      if (!item2.name && p.name) item2.name = p.name;
      item2._mtime = nowIso();
      changed.push(item2);
    });
    if (changed.length) putLibraryItems(changed);
    return changed.length > 0;
  }
  function continueWatching() {
    return cachedLibrary().filter(function (it) {
      return it.type !== "other" && (!it.removed || it.temp) && it.state && it.state.timeOffset > 0;
    }).sort(function (a, b) {
      return String(b.state.lastWatched || "").localeCompare(String(a.state.lastWatched || ""));
    });
  }

  // src/js/lib/phone.js
  var import_qrcode_generator = __toESM(require_qrcode(), 1);

  // src/js/views/profiles.js
  var SESSION_PICKED = "kai.profilePicked";
  var SESSION_NEW = "kai.newProfile";
  function session(key3, value) {
    try {
      if (value === void 0) return window.sessionStorage.getItem(key3);
      if (value === null) window.sessionStorage.removeItem(key3);else window.sessionStorage.setItem(key3, value);
    } catch (e) {}
    return null;
  }
  function avatar(p, cls) {
    var initial = String(p.name || "?").trim().charAt(0).toUpperCase() || "?";
    return h("div.avatar", {
      cls: cls || "",
      style: {
        backgroundColor: p.color || COLORS[0]
      },
      text: initial
    });
  }
  function switchProfile(id) {
    var target = profiles().find(function (p) {
      return p.id === id;
    });
    checkPin(target, function () {
      setActiveProfile(id);
      session(SESSION_PICKED, "1");
      window.location.reload();
    });
  }
  function checkPin(profile, onOk) {
    if (!profile || !profile.pin) return onOk();
    pinDialog(t("PIN de {name}", {
      name: profile.name
    }), function (pin) {
      if (pin === profile.pin) {
        onOk();
        return true;
      }
      return false;
    });
  }
  function pinDialog(title, onSubmit, badText) {
    var err = h("div.modal-text.err-text");
    var input = h("input.input.pin-input", {
      type: "password",
      inputmode: "numeric",
      maxlength: "8",
      placeholder: "••••",
      focusable: true,
      "data-autofocus": ""
    });
    var box = h("div.modal-box.center", null, [h("h3", {
      text: title
    }), input, err]);
    var modal = h("div.modal", null, box);
    document.getElementById("app").appendChild(modal);
    var layer = pushLayer(modal, {
      onBack: function onBack() {
        return close();
      }
    });
    focusFirst(modal);
    setTimeout(function () {
      return select(input);
    }, 50);
    input.__submit = function (v) {
      var pin = String(v || "").trim();
      if (!pin) return;
      if (onSubmit(pin) === false) {
        err.textContent = badText || t("PIN errado. Tente de novo.");
        input.value = "";
        focus(input);
        return;
      }
      close();
    };
    function close() {
      popLayer(layer);
      if (modal.parentNode) modal.parentNode.removeChild(modal);
    }
  }
  function askProfileName(title, initial, okLabel, onOk, onCancel) {
    var err = h("div.modal-text.err-text");
    var input = h("input.input", {
      type: "text",
      value: initial || "",
      placeholder: t("Ex.: Ana, Pedro, Sala"),
      maxlength: "20",
      focusable: true,
      "data-autofocus": ""
    });
    var submit = function submit() {
      var name = String(input.value || "").trim();
      if (!name) {
        err.textContent = t("Digite um nome para o perfil.");
        focus(input);
        return;
      }
      var dup = profiles().some(function (p) {
        return p.name.toLowerCase() === name.toLowerCase() && p.name !== initial;
      });
      if (dup) {
        err.textContent = t("Já existe um perfil com esse nome.");
        focus(input);
        return;
      }
      close();
      onOk(name);
    };
    input.__submit = submit;
    var box = h("div.modal-box.center", null, [h("h3", {
      text: title
    }), h("div.modal-text", null, input), err, h("div.modal-actions", {
      "data-group": ""
    }, [h("div.btn.primary", {
      focusable: true,
      text: okLabel || t("Continuar"),
      onSelect: submit
    }), h("div.btn", {
      focusable: true,
      text: t("Cancelar"),
      onSelect: function onSelect() {
        return close(), onCancel && onCancel();
      }
    })])]);
    var modal = h("div.modal", null, box);
    document.getElementById("app").appendChild(modal);
    var layer = pushLayer(modal, {
      onBack: function onBack() {
        return close(), onCancel && onCancel();
      }
    });
    focusFirst(modal);
    function close() {
      popLayer(layer);
      if (modal.parentNode) modal.parentNode.removeChild(modal);
    }
  }
  function createProfile() {
    askProfileName(t("Nome do novo perfil"), "", t("Criar perfil"), function (name) {
      var p = addProfile(name);
      session(SESSION_NEW, p.id);
      switchProfile(p.id);
    });
  }
  function isNewProfilePendingLogin() {
    return session(SESSION_NEW) === activeProfile().id;
  }
  function clearNewProfileFlag() {
    session(SESSION_NEW, null);
  }
  function needsPicker() {
    if (session(SESSION_PICKED)) return false;
    return profiles().length > 1 && settings().askProfile || !!activeProfile().pin;
  }
  function showPicker(onPicked) {
    var list2 = profiles();
    var active2 = activeProfile();
    var cards = list2.map(function (p) {
      return h("div.profile-card", {
        focusable: true,
        "data-autofocus": p.id === active2.id ? "" : null,
        onSelect: function onSelect() {
          return pick2(p.id);
        }
      }, [avatar(p, "big"), h("div.profile-name", {
        text: (p.pin ? "🔒 " : "") + p.name
      })]);
    });
    cards.push(h("div.profile-card", {
      focusable: true,
      onSelect: function onSelect() {
        return createProfile();
      }
    }, [h("div.avatar.big.add", {
      text: "+"
    }), h("div.profile-name", {
      text: t("Adicionar perfil")
    })]));
    var el = h("div.view.profile-picker", null, [h("div.boot-logo", {
      html: "Stremio <b>Kai</b>"
    }), h("h1", {
      text: t("Quem está assistindo?")
    }), h("div.profile-row", {
      "data-group": ""
    }, cards), h("p.profile-hint", {
      text: t("Cada perfil tem sua própria conta Stremio, com histórico e biblioteca separados.")
    })]);
    document.getElementById("app").appendChild(el);
    var layer = pushLayer(el, {
      onBack: function onBack() {
        return pick2(active2.id);
      }
    });
    focusFirst(el);
    function pick2(id) {
      checkPin(list2.find(function (p) {
        return p.id === id;
      }), function () {
        return done(id);
      });
    }
    function done(id) {
      setActiveProfile(id);
      session(SESSION_PICKED, "1");
      popLayer(layer);
      if (el.parentNode) el.parentNode.removeChild(el);
      onPicked();
    }
  }

  // src/js/ui.js
  var toastTimer = null;
  function toast(msg, ms) {
    var el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      return el.classList.remove("show");
    }, ms || 3500);
  }
  function menu(title, options, opts) {
    var o = opts || {};
    var list2 = h("div.modal-list", {
      "data-scroll-y": "",
      "data-pad-y": "80"
    });
    options.forEach(function (opt) {
      list2.appendChild(h("div.opt", {
        focusable: true,
        cls: opt.checked ? "checked" : "",
        "data-autofocus": opt.checked ? "" : null,
        onSelect: function onSelect() {
          close();
          if (opt.onSelect) opt.onSelect(opt.value);
          if (o.onPick) o.onPick(opt.value, opt);
        }
      }, [opt.label, opt.sub ? h("small", {
        text: opt.sub
      }) : null]));
    });
    if (!options.length) list2.appendChild(h("div.modal-text", {
      text: o.empty || t("Nada por aqui.")
    }));
    var box = h("div.modal-box", {
      cls: o.center ? "center" : ""
    }, [h("h3", {
      text: title
    }), list2]);
    var modal = h("div.modal", null, box);
    document.getElementById("app").appendChild(modal);
    var layer = pushLayer(modal, {
      onBack: function onBack() {
        return close();
      },
      onKey: o.onKey
    });
    focusFirst(modal);
    var closed = false;
    function close() {
      if (closed) return;
      closed = true;
      popLayer(layer);
      if (modal.parentNode) modal.parentNode.removeChild(modal);
      if (o.onClose) o.onClose();
    }
    return {
      close: close,
      el: modal
    };
  }
  function confirmDialog(text, okLabel, onOk) {
    var box = h("div.modal-box.center", null, [h("h3", {
      text: text
    }), h("div.modal-actions", null, [h("div.btn.primary", {
      focusable: true,
      "data-autofocus": "",
      text: okLabel || "OK",
      onSelect: function onSelect() {
        return close(), onOk && onOk();
      }
    }), h("div.btn", {
      focusable: true,
      text: t("Cancelar"),
      onSelect: function onSelect() {
        return close();
      }
    })])]);
    var modal = h("div.modal", null, box);
    document.getElementById("app").appendChild(modal);
    var layer = pushLayer(modal, {
      onBack: function onBack() {
        return close();
      }
    });
    focusFirst(modal);
    function close() {
      popLayer(layer);
      if (modal.parentNode) modal.parentNode.removeChild(modal);
    }
  }
  function promptText(title, value, placeholder, onSubmit) {
    var input = h("input.input", {
      type: "text",
      value: value || "",
      placeholder: placeholder || ""
    });
    var row = h("div.set-row", {
      focusable: true,
      "data-autofocus": "",
      onSelect: function onSelect() {
        return select(input);
      }
    }, input);
    var box = h("div.modal-box.center", null, [h("h3", {
      text: title
    }), row]);
    var modal = h("div.modal", null, box);
    document.getElementById("app").appendChild(modal);
    var layer = pushLayer(modal, {
      onBack: function onBack() {
        return close();
      }
    });
    focusFirst(modal);
    input.__submit = function (v) {
      var text = String(v || "").trim();
      close();
      if (text) onSubmit(text);
    };
    setTimeout(function () {
      return select(input);
    }, 50);
    function close() {
      popLayer(layer);
      if (modal.parentNode) modal.parentNode.removeChild(modal);
    }
  }
  var TABS = [{
    id: "home",
    label: "Início"
  }, {
    id: "search",
    label: "Buscar"
  }, {
    id: "library",
    label: "Biblioteca"
  }, {
    id: "collections",
    label: "Coleções"
  }, {
    id: "anime",
    label: "Animes"
  }, {
    id: "calendar",
    label: "Calendário"
  }, {
    id: "settings",
    label: "Ajustes"
  }];
  function topbar(activeId, onTab) {
    var clock = h("div.clock");
    var tick = function tick() {
      return clock.textContent = timeHM(/* @__PURE__ */new Date());
    };
    tick();
    var timer = setInterval(tick, 2e4);
    var bar = h("div.topbar", {
      "data-group": ""
    }, [h("div.brand", {
      html: "Stremio <b>Kai</b>"
    }),
    // The Anime tab can be hidden in Settings → Appearance.
    TABS.filter(function (tab) {
      return tab.id !== "anime" || settings().animeTab !== false;
    }).map(function (tab) {
      return h("div.tab", {
        focusable: true,
        cls: tab.id === activeId ? "active" : "",
        text: t(tab.label),
        onSelect: function onSelect() {
          return onTab(tab.id);
        }
      });
    }), h("div.spacer"), profileButton(onTab), clock]);
    bar.__destroy = function () {
      return clearInterval(timer);
    };
    return bar;
  }
  function profileButton(onTab) {
    var chip = h("div.profile-chip", {
      focusable: true,
      onSelect: function onSelect() {
        return profileMenu(onTab);
      }
    });
    fillChip(chip);
    return chip;
  }
  function fillChip(chip) {
    var p = activeProfile();
    clear(chip);
    chip.appendChild(avatar(p, "small"));
    chip.appendChild(h("span", {
      text: p.name
    }));
  }
  function refreshProfileChips() {
    Array.prototype.forEach.call(document.querySelectorAll(".profile-chip"), fillChip);
  }
  function profileMenu(onTab) {
    var active2 = activeProfile();
    var opts = profiles().map(function (p) {
      return {
        label: p.name,
        sub: p.id === active2.id ? t("Perfil atual") : t("Trocar para este perfil"),
        value: p.id,
        checked: p.id === active2.id
      };
    });
    opts.push({
      label: t("+ Adicionar perfil"),
      sub: t("Com outra conta Stremio (histórico separado)"),
      value: "__add"
    });
    opts.push({
      label: t("Gerenciar perfis"),
      sub: t("Nome, cor, apagar"),
      value: "__manage"
    });
    menu(t("Perfis"), opts, {
      onPick: function onPick(v) {
        if (v === "__add") createProfile();else if (v === "__manage") onTab("settings");else if (v !== active2.id) switchProfile(v);
      }
    });
  }
  function timeHM(d) {
    return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  }
  function fmtTime(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    var s = Math.floor(sec % 60);
    var m = Math.floor(sec / 60 % 60);
    var hh = Math.floor(sec / 3600);
    return (hh ? hh + ":" + ("0" + m).slice(-2) : m) + ":" + ("0" + s).slice(-2);
  }
  function card(item2, opts) {
    var o = opts || {};
    var wrap = h("div.poster-wrap");
    var plain = o.wide ? smallBackground(o.image || item2.background || item2.poster) : smallPoster(item2.poster);
    var rated = o.wide ? null : ratedPoster(item2.id || item2.imdb_id, settings().rpdbKey);
    var src = rated || plain;
    if (src) {
      var im = h("img", {
        alt: ""
      });
      im.setAttribute("data-lazy", src);
      im.onerror = function () {
        if (rated && plain && im.src.indexOf(plain) < 0) {
          im.src = plain;
          return;
        }
        im.style.display = "none";
        wrap.appendChild(h("div.ph", {
          text: item2.name || ""
        }));
      };
      wrap.appendChild(im);
    } else wrap.appendChild(h("div.ph", {
      text: item2.name || ""
    }));
    if (o.progress) wrap.appendChild(h("div.progress", null, h("i", {
      style: {
        width: Math.round(o.progress * 100) + "%"
      }
    })));
    if (o.badge) wrap.appendChild(h("div.badge", {
      text: o.badge
    }));
    return h("div.card", {
      focusable: true,
      cls: o.wide ? "wide" : "",
      onSelect: o.onSelect,
      onFocus: o.onFocus
    }, [wrap, h("div.name", {
      text: o.title || item2.name || ""
    })]);
  }
  function spinnerLine(text) {
    return h("div.loading-line", null, [h("div.spinner.small"), text]);
  }

  // src/js/lib/phone.js
  var PORT = 8095;
  function fetchUrl(url2) {
    return "http://127.0.0.1:" + PORT + "/api/fetch?url=" + encodeURIComponent(url2);
  }
  var BASE = "http://127.0.0.1:" + PORT;
  var ENTER = 13;
  var last = 0;
  var started = false;
  function request2(url2, timeout) {
    return new Promise(function (resolve2, reject) {
      var x = new XMLHttpRequest();
      x.open("GET", url2);
      x.timeout = timeout;
      x.onload = function () {
        try {
          resolve2(x.status === 200 ? JSON.parse(x.responseText) : null);
        } catch (e) {
          reject(e);
        }
      };
      x.onerror = x.ontimeout = function () {
        return reject(new Error("remote service unreachable"));
      };
      x.send();
    });
  }
  function fireKey(code) {
    var e = document.createEvent("Event");
    e.initEvent("keydown", true, true);
    e.keyCode = code;
    e.which = code;
    (document.activeElement || document.body).dispatchEvent(e);
  }
  function typeText(text, submit) {
    var el = document.activeElement;
    if (!el || el.tagName !== "INPUT" && el.tagName !== "TEXTAREA") {
      toast(t("Selecione um campo de texto na TV primeiro."), 4e3);
      return;
    }
    el.value = text;
    var ev = document.createEvent("Event");
    ev.initEvent("input", true, true);
    el.dispatchEvent(ev);
    if (submit) fireKey(ENTER);
  }
  function nowPlaying(state) {
    var x = new XMLHttpRequest();
    x.open("POST", BASE + "/api/state");
    x.onerror = function () {};
    x.send(JSON.stringify(state || null));
  }
  function browse(data) {
    var x = new XMLHttpRequest();
    x.open("POST", BASE + "/api/browse");
    x.onerror = function () {};
    x.send(JSON.stringify(data));
  }
  var openHandler = null;
  function onOpen(fn) {
    openHandler = fn;
  }
  var seekHandler = null;
  function onSeek(fn) {
    seekHandler = fn;
  }
  var searchHandler = null;
  var keysHandler = null;
  function onKeys(fn) {
    keysHandler = fn;
  }
  function setupUrl(i) {
    return i ? "http://" + i.ip + ":" + i.port + "/setup#pin=" + i.pin : null;
  }
  function onSearch(fn) {
    searchHandler = fn;
  }
  function handle(ev) {
    if (ev.type === "key") fireKey(ev.code);else if (ev.type === "text") typeText(ev.text, ev.submit);else if (ev.type === "search" && searchHandler && ev.text) searchHandler(ev.text);else if (ev.type === "seek" && seekHandler) seekHandler(ev.to);else if (ev.type === "open" && openHandler && ev.item) openHandler(ev);else if (ev.type === "keys" && keysHandler && ev.keys) keysHandler(ev.keys);
  }
  function poll(wait2) {
    setTimeout(function () {
      request2(BASE + "/api/events?since=" + last, 35e3).then(function (r) {
        if (r) {
          (r.events || []).forEach(handle);
          last = r.last || last;
        }
        poll(0);
      }).catch(function () {
        return poll(Math.min((wait2 || 2e3) * 2, 6e4));
      });
    }, wait2);
  }
  function startService() {
    try {
      if (window.tizen && window.tizen.application && !/^https?:/.test(location.protocol)) {
        var pkg = window.tizen.application.getCurrentApplication().appInfo.packageId;
        window.tizen.application.launchAppControl(new window.tizen.ApplicationControl("http://tizen.org/appcontrol/operation/service"), pkg + ".Service", function () {}, function () {});
        return true;
      }
    } catch (e) {}
    var m = location.pathname.match(/\/module\/([^/]+)\//);
    if (!m || typeof WebSocket === "undefined") return false;
    try {
      var ws = new WebSocket("ws://127.0.0.1:8081");
      ws.onopen = function () {
        ws.send(JSON.stringify({
          type: 6,
          payload: {
            fullName: decodeURIComponent(m[1]),
            serviceFile: "dist/remote-service.js"
          }
        }));
        setTimeout(function () {
          return ws.close();
        }, 1e3);
      };
      ws.onerror = function () {};
      return true;
    } catch (e) {
      return false;
    }
  }
  function start() {
    if (started) return;
    started = true;
    request2(BASE + "/api/info", 3e3).then(function (r) {
      if (r) last = r.last || 0;
    }).catch(function () {
      setTimeout(function () {
        return request2(BASE + "/api/info", 4e3).catch(function () {
          return startService();
        });
      }, 15e3);
    }).then(function () {
      return poll(0);
    });
  }
  function info() {
    var get2 = function get2() {
      return request2(BASE + "/api/info", 4e3).then(function (r) {
        return r && r.ip ? {
          ip: r.ip,
          port: r.port,
          pin: r.pin,
          url: "http://" + r.ip + ":" + r.port + "/#pin=" + r.pin
        } : null;
      }).catch(function () {
        return null;
      });
    };
    return get2().then(function (i) {
      return i || !startService() ? i : new Promise(function (r) {
        return setTimeout(r, 5e3);
      }).then(get2);
    });
  }
  function qrImage(text, size) {
    var qr = (0, import_qrcode_generator.default)(0, "M");
    qr.addData(text);
    qr.make();
    var cell = Math.max(2, Math.floor(size / (qr.getModuleCount() + 8)));
    return qr.createDataURL(cell, cell * 4);
  }

  // src/js/lib/luna.js
  var pending = /* @__PURE__ */new Set();
  function hasLuna() {
    return typeof window.PalmServiceBridge === "function";
  }
  function luna(service, method, params) {
    return new Promise(function (resolve2, reject) {
      if (!hasLuna()) return reject(new Error("Luna indisponível"));
      var bridge = new window.PalmServiceBridge();
      pending.add(bridge);
      bridge.onservicecallback = function (msg) {
        pending.delete(bridge);
        var res;
        try {
          res = JSON.parse(msg);
        } catch (e) {
          return reject(new Error("Resposta Luna inválida"));
        }
        if (res && res.returnValue === false) {
          var err = new Error(service + "/" + method + ": " + (res.errorText || res.errorCode || "falhou"));
          err.result = res;
          reject(err);
        } else resolve2(res);
      };
      bridge.call(service.replace(/\/$/, "") + "/" + method, JSON.stringify(params || {}));
    });
  }
  function platformBack() {
    try {
      if (window.tizen && window.tizen.application) return window.tizen.application.getCurrentApplication().exit();
      if (window.webOSSystem && window.webOSSystem.platformBack) return window.webOSSystem.platformBack();
      if (window.PalmSystem && window.PalmSystem.platformBack) return window.PalmSystem.platformBack();
    } catch (e) {}
    window.close();
  }
  function getTvIp() {
    if (!hasLuna()) return tizenIp();
    return luna("luna://com.webos.service.connectionmanager", "getStatus", {}).then(function (r) {
      var w = r.wired && r.wired.ipAddress || r.wifi && r.wifi.ipAddress;
      if (!w) throw new Error("Sem IP");
      return w;
    });
  }
  function deviceInfo() {
    var pi = window.webapis && window.webapis.productinfo;
    if (pi) {
      return Promise.resolve({
        modelName: pi.getRealModel ? pi.getRealModel() : pi.getModel(),
        firmwareVersion: pi.getFirmware(),
        sdkVersion: "",
        platform: "Tizen"
      });
    }
    if (isTizen()) return Promise.resolve({
      modelName: "Samsung",
      firmwareVersion: "",
      sdkVersion: ""
    });
    return luna("luna://com.webos.service.tv.systemproperty", "getSystemInfo", {
      keys: ["modelName", "firmwareVersion", "sdkVersion"]
    });
  }
  function tizenIp() {
    try {
      var net = window.webapis && window.webapis.network;
      var ip = net && net.getIp && net.getIp();
      if (ip) return Promise.resolve(ip);
    } catch (e) {}
    var RTC = window.RTCPeerConnection || window.webkitRTCPeerConnection;
    if (!RTC) return Promise.reject(new Error("Sem IP"));
    return new Promise(function (resolve2, reject) {
      var pc = new RTC({
        iceServers: []
      });
      var done = function done(fn, v) {
        try {
          pc.close();
        } catch (e) {}
        fn(v);
      };
      var timer = setTimeout(function () {
        return done(reject, new Error("Sem IP"));
      }, 3e3);
      pc.onicecandidate = function (e) {
        var m = e && e.candidate && /(\d+\.\d+\.\d+\.\d+)/.exec(e.candidate.candidate);
        if (m && !/^(0\.|127\.)/.test(m[1])) {
          clearTimeout(timer);
          done(resolve2, m[1]);
        }
      };
      pc.createDataChannel("ip");
      pc.createOffer(function (o) {
        return pc.setLocalDescription(o, function () {}, function () {});
      }, function () {});
    });
  }
  var HEAVY = /netflix|youtube|amazon|primevideo|disney|hbo|\.max\b|globoplay|spotify|twitch|plex|crunchyroll|paramount|starplus|appletv/i;
  function closeHeavyBackgroundApps() {
    if (!hasLuna()) return Promise.resolve([]);
    return luna("luna://com.webos.applicationManager", "running", {}).then(function (r) {
      var ids2 = (r && r.running || []).map(function (a) {
        return a.id;
      }).filter(function (id) {
        return id && HEAVY.test(id);
      });
      return Promise.all(ids2.map(function (id) {
        return luna("luna://com.webos.applicationManager", "closeByAppId", {
          id: id
        }).then(function () {
          return id;
        }).catch(function () {
          return null;
        });
      })).then(function (list2) {
        return list2.filter(Boolean);
      });
    }).catch(function () {
      return [];
    });
  }

  // src/js/api/debrid.js
  var PROVIDERS = [{
    id: "realdebrid",
    name: "Real-Debrid",
    key: "realDebridKey",
    site: "real-debrid.com/apitoken"
  }, {
    id: "torbox",
    name: "TorBox",
    key: "torboxKey",
    site: "torbox.app/settings"
  }, {
    id: "premiumize",
    name: "Premiumize",
    key: "premiumizeKey",
    site: "premiumize.me/account"
  }];
  function active() {
    var s = settings();
    if (s.debridEnabled === false) return null;
    var has = function has(p2) {
      return !!(s[p2.key] || "").trim();
    };
    var chosen = PROVIDERS.find(function (p2) {
      return p2.id === s.debridProvider;
    });
    var p = chosen && has(chosen) ? chosen : PROVIDERS.find(has);
    return p ? {
      id: p.id,
      name: p.name,
      key: s[p.key].trim()
    } : null;
  }
  var VIDEO_RE = /\.(mkv|mp4|avi|m4v|mov|ts|webm|wmv)$/i;
  function magnet(infoHash, sources) {
    var tr = (sources || []).filter(function (x) {
      return /^tracker:/.test(x);
    }).map(function (x) {
      return "&tr=" + encodeURIComponent(x.slice(8));
    });
    return "magnet:?xt=urn:btih:" + infoHash + tr.join("");
  }
  function pickFile(files2, hint) {
    var vids = files2.filter(function (f) {
      return VIDEO_RE.test(f.name) && !/sample/i.test(f.name);
    });
    var pool = vids.length ? vids : files2;
    if (!pool.length) return null;
    var base = function base(n) {
      return String(n || "").split("/").pop().toLowerCase();
    };
    if (hint.filename) {
      var m = pool.find(function (f) {
        return base(f.name) === base(hint.filename);
      });
      if (m) return m;
    }
    if (hint.season != null && hint.episode != null) {
      var s = +hint.season;
      var e = +hint.episode;
      var re = new RegExp("(s0*" + s + "[ ._-]*e0*" + e + "(?!\\d))|(\\b" + s + "x0*" + e + "(?!\\d))", "i");
      var _m = pool.find(function (f) {
        return re.test(base(f.name));
      });
      if (_m) return _m;
    }
    if (hint.fileIdx != null && files2[hint.fileIdx] && pool.indexOf(files2[hint.fileIdx]) >= 0) return files2[hint.fileIdx];
    return pool.slice().sort(function (a, b) {
      return b.size - a.size;
    })[0];
  }
  function wait(ms) {
    return new Promise(function (r) {
      return setTimeout(r, ms);
    });
  }
  function notCached(name) {
    return new Error(t("{name}: este torrent ainda não está no cache. Escolha outra fonte.", {
      name: name
    }));
  }
  var RD = "https://api.real-debrid.com/rest/1.0/";
  function rd(key3, method, path, body) {
    return request(method, RD + path, body, {
      form: true,
      timeout: 2e4,
      headers: {
        Authorization: "Bearer " + key3
      }
    });
  }
  function realDebrid(key3, mag, hint) {
    return rd(key3, "POST", "torrents/addMagnet", {
      magnet: mag
    }).then(function (added) {
      var id = added && added.id;
      if (!id) throw new Error("Real-Debrid: addMagnet");
      var info2 = function info2() {
        return rd(key3, "GET", "torrents/info/" + encodeURIComponent(id));
      };
      return info2().then(function (tor) {
        var files2 = (tor.files || []).map(function (f) {
          return {
            id: f.id,
            name: f.path,
            size: f.bytes
          };
        });
        var file = pickFile(files2, hint);
        if (!file) throw new Error("Real-Debrid: no files");
        return rd(key3, "POST", "torrents/selectFiles/" + encodeURIComponent(id), {
          files: String(file.id)
        });
      }).then(function poll2(_, n) {
        n = n || 0;
        return info2().then(function (tor) {
          if (tor.status === "downloaded" && tor.links && tor.links.length) return tor.links[0];
          if (n >= 3 || /error|dead|virus|magnet_error/.test(tor.status)) {
            rd(key3, "DELETE", "torrents/delete/" + encodeURIComponent(id)).catch(function () {});
            throw notCached("Real-Debrid");
          }
          return wait(1500).then(function () {
            return poll2(null, n + 1);
          });
        });
      }).then(function (link) {
        return rd(key3, "POST", "unrestrict/link", {
          link: link
        });
      }).then(function (r) {
        if (!r || !r.download) throw new Error("Real-Debrid: unrestrict");
        return r.download;
      });
    });
  }
  var TB = "https://api.torbox.app/v1/api/";
  function torbox(key3, mag, hint) {
    var auth2 = {
      Authorization: "Bearer " + key3
    };
    return request("POST", TB + "torrents/createtorrent", {
      magnet: mag,
      allow_zip: "false"
    }, {
      form: true,
      timeout: 2e4,
      headers: auth2
    }).then(function (r) {
      var id = r && r.data && r.data.torrent_id;
      if (!id) throw new Error(r && r.detail || "TorBox: createtorrent");
      var _poll = function poll2(n) {
        return getJSON(TB + "torrents/mylist?bypass_cache=true&id=" + encodeURIComponent(id), {
          timeout: 15e3,
          headers: auth2
        }).then(function (l) {
          var tor = l && l.data;
          if (tor && (tor.download_present || tor.download_finished) && tor.files && tor.files.length) return tor;
          if (n >= 3) throw notCached("TorBox");
          return wait(1500).then(function () {
            return _poll(n + 1);
          });
        });
      };
      return _poll(0).then(function (tor) {
        var files2 = tor.files.map(function (f) {
          return {
            id: f.id,
            name: f.name || f.short_name,
            size: f.size
          };
        });
        var file = pickFile(files2, hint);
        if (!file) throw new Error("TorBox: no files");
        return getJSON(TB + "torrents/requestdl?token=" + encodeURIComponent(key3) + "&torrent_id=" + encodeURIComponent(id) + "&file_id=" + encodeURIComponent(file.id), {
          timeout: 15e3
        }).then(function (d) {
          if (!d || !d.data) throw new Error("TorBox: requestdl");
          return d.data;
        });
      });
    });
  }
  function premiumize(key3, mag, hint) {
    return request("POST", "https://www.premiumize.me/api/transfer/directdl", {
      src: mag,
      apikey: key3
    }, {
      form: true,
      timeout: 25e3
    }).then(function (r) {
      if (!r || r.status !== "success" || !r.content || !r.content.length) throw notCached("Premiumize");
      var files2 = r.content.map(function (f, i) {
        return {
          id: i,
          name: f.path,
          size: f.size,
          link: f.stream_link || f.link
        };
      });
      var file = pickFile(files2, hint);
      if (!file || !file.link) throw notCached("Premiumize");
      return file.link;
    });
  }
  function resolve(infoHash, sources, hint) {
    return freshRealDebrid().then(function () {
      return resolveNow(infoHash, sources, hint);
    });
  }
  function resolveNow(infoHash, sources, hint) {
    var p = active();
    if (!p) return Promise.reject(new Error("debrid off"));
    var mag = magnet(String(infoHash).toLowerCase(), sources);
    var fn = p.id === "realdebrid" ? realDebrid : p.id === "torbox" ? torbox : premiumize;
    return fn(p.key, mag, hint || {}).catch(function (e) {
      if (e.status === 401 || e.status === 403) throw new Error(t("{name}: a chave de API foi recusada. Confira em Ajustes → Debrid.", {
        name: p.name
      }));
      throw e;
    });
  }
  function testKey(id, key3) {
    if (id === "realdebrid") return request("GET", RD + "user", null, {
      timeout: 15e3,
      headers: {
        Authorization: "Bearer " + key3
      }
    }).then(function (u) {
      return u && u.username || "OK";
    });
    if (id === "torbox") return getJSON(TB + "user/me", {
      timeout: 15e3,
      headers: {
        Authorization: "Bearer " + key3
      }
    }).then(function (u) {
      return u && u.data && u.data.email ? u.data.email : "OK";
    });
    return getJSON("https://www.premiumize.me/api/account/info?apikey=" + encodeURIComponent(key3), {
      timeout: 15e3
    }).then(function (u) {
      if (!u || u.status !== "success") throw new Error(t("Chave inválida"));
      return u.customer_id ? String(u.customer_id) : "OK";
    });
  }
  var RD_OAUTH = "https://api.real-debrid.com/oauth/v2/";
  var RD_OPEN_CLIENT = "X245A4XAIBGVM";
  var RD_GRANT = "http://oauth.net/grant_type/device/1.0";
  function canSignIn(id) {
    return id === "torbox" || id === "realdebrid";
  }
  function signInFlow(id) {
    var p = PROVIDERS.find(function (x) {
      return x.id === id;
    });
    if (id === "torbox") return {
      name: p.name,
      start: function start() {
        return getJSONViaProxy(TB + "user/auth/device/start?app=" + encodeURIComponent("Stremio Kai"), {
          timeout: 15e3
        }).then(function (r) {
          var d = r && r.data;
          if (!d || !d.device_code) throw new Error("TorBox");
          return {
            code: d.code,
            url: d.friendly_verification_url || d.verification_url,
            qrUrl: d.verification_url_complete || d.verification_url,
            interval: d.interval,
            expiresIn: d.expires_in,
            poll: function poll() {
              return (
                // TorBox refuses the app's origin (no CORS): straight first, then through the TV service.
                request("POST", TB + "user/auth/device/token", {
                  device_code: d.device_code
                }, {
                  timeout: 15e3,
                  quiet: true
                }).catch(function (e) {
                  if (e.status) throw e;
                  return request("POST", fetchUrl(TB + "user/auth/device/token"), {
                    device_code: d.device_code
                  }, {
                    timeout: 15e3,
                    quiet: true
                  });
                }).then(function (x) {
                  var token = x && x.data && x.data.access_token;
                  if (!token) return "pending";
                  saveSettings({
                    torboxKey: token,
                    debridProvider: settings().debridProvider || "torbox"
                  });
                  return "ok";
                }, function (e) {
                  return e.status === 410 ? "expired" : "pending";
                })
              );
            }
          };
        });
      }
    };
    if (id === "realdebrid") return {
      name: p.name,
      start: function start() {
        return getJSON(RD_OAUTH + "device/code?client_id=" + RD_OPEN_CLIENT + "&new_credentials=yes", {
          timeout: 15e3
        }).then(function (d) {
          if (!d || !d.device_code) throw new Error("Real-Debrid");
          return {
            code: d.user_code,
            url: d.verification_url,
            qrUrl: d.direct_verification_url || d.verification_url,
            interval: d.interval,
            expiresIn: d.expires_in,
            poll: function poll() {
              return getJSON(RD_OAUTH + "device/credentials?client_id=" + RD_OPEN_CLIENT + "&code=" + encodeURIComponent(d.device_code), {
                timeout: 15e3,
                quiet: true
              }).then(function (c) {
                return c && c.client_id && c.client_secret ? rdToken(c.client_id, c.client_secret, d.device_code).then(function () {
                  return "ok";
                }) : "pending";
              }, function (e) {
                return e.status === 403 ? "denied" : "pending";
              });
            }
          };
        });
      }
    };
    return null;
  }
  function rdToken(clientId, clientSecret, code) {
    return request("POST", RD_OAUTH + "token", {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      grant_type: RD_GRANT
    }, {
      form: true,
      timeout: 15e3
    }).then(function (r) {
      if (!r || !r.access_token) throw new Error("Real-Debrid token");
      saveSettings({
        realDebridKey: r.access_token,
        realDebridAuth: {
          clientId: clientId,
          clientSecret: clientSecret,
          refresh: r.refresh_token,
          expiresAt: Date.now() + (r.expires_in || 3600) * 1e3
        }
      });
      return r.access_token;
    });
  }
  function freshRealDebrid() {
    var a = settings().realDebridAuth;
    if (!a || !a.refresh || Date.now() < (a.expiresAt || 0) - 12e4) return Promise.resolve();
    return rdToken(a.clientId, a.clientSecret, a.refresh).catch(function () {});
  }

  // src/js/api/server.js
  var status = {
    ok: false,
    checkedAt: 0,
    url: ""
  };
  function baseUrl() {
    var u = (settings().serverUrl || "").trim();
    if (!u) return "";
    if (!/^https?:\/\//.test(u)) u = "http://" + u;
    if (!/:\d+/.test(u.replace(/^https?:\/\//, ""))) u = u.replace(/\/$/, "") + ":11470";
    return u.replace(/\/$/, "") + "/";
  }
  function check(urlOverride) {
    var u = urlOverride || baseUrl();
    if (!u) {
      status = {
        ok: false,
        checkedAt: Date.now(),
        url: ""
      };
      return Promise.resolve(status);
    }
    return getJSON(u + "settings", {
      timeout: 4e3,
      quiet: true
    }).then(function (r) {
      status = {
        ok: true,
        checkedAt: Date.now(),
        url: u,
        version: r && r.values && r.values.serverVersion
      };
      return status;
    }).catch(function () {
      status = {
        ok: false,
        checkedAt: Date.now(),
        url: u
      };
      return status;
    });
  }
  function isAvailable() {
    return status.ok && status.url === baseUrl();
  }
  function lastStatus() {
    return status;
  }
  function scan(onProgress2) {
    return getTvIp().then(function (ip) {
      var prefix = ip.split(".").slice(0, 3).join(".") + ".";
      var hosts = [];
      for (var i = 1; i < 255; i++) if (prefix + i !== ip) hosts.push(prefix + i);
      var found = null;
      var done = 0;
      var batch2 = 24;
      var _runBatch = function runBatch(start3) {
        if (found || start3 >= hosts.length) return Promise.resolve(found);
        var slice = hosts.slice(start3, start3 + batch2);
        return Promise.all(slice.map(function (h2) {
          return getJSON("http://" + h2 + ":11470/settings", {
            timeout: 1500,
            quiet: true
          }).then(function () {
            if (!found) found = h2;
          }).catch(function () {}).then(function () {
            done++;
            if (onProgress2) onProgress2(done, hosts.length);
          });
        })).then(function () {
          return _runBatch(start3 + batch2);
        });
      };
      return _runBatch(0);
    });
  }
  function parseMagnet(uri) {
    var m = uri.match(/xt=urn:btih:([a-zA-Z0-9]+)/);
    if (!m) return null;
    var hash = m[1];
    if (hash.length === 32) hash = base32ToHex(hash);
    var trackers = [];
    uri.replace(/[?&]tr=([^&]+)/g, function (_, tracker) {
      trackers.push("tracker:" + decodeURIComponent(tracker));
      return "";
    });
    return {
      infoHash: hash.toLowerCase(),
      sources: trackers
    };
  }
  function base32ToHex(s) {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    var bits = "";
    s.toUpperCase().split("").forEach(function (c) {
      var v = alphabet.indexOf(c);
      if (v >= 0) bits += ("00000" + v.toString(2)).slice(-5);
    });
    var hex = "";
    for (var i = 0; i + 4 <= bits.length; i += 4) hex += parseInt(bits.substr(i, 4), 2).toString(16);
    return hex;
  }
  function torrentUrl(base, infoHash, fileIdx, sources) {
    var u = base + encodeURIComponent(infoHash) + "/" + encodeURIComponent(fileIdx);
    if (sources && sources.length) {
      u += "?" + sources.map(function (s) {
        return "tr=" + encodeURIComponent(s);
      }).join("&");
    }
    return u;
  }
  function createTorrent(base, infoHash, fileIdx, sources, seriesInfo) {
    var hasIdx = fileIdx !== null && fileIdx !== void 0 && isFinite(fileIdx);
    if ((!sources || !sources.length) && hasIdx) return Promise.resolve(torrentUrl(base, infoHash, fileIdx, []));
    var body = {
      torrent: {
        infoHash: infoHash
      }
    };
    if (sources && sources.length) {
      var all2 = ["dht:" + infoHash].concat(sources.map(function (s) {
        return /^(tracker|dht):/.test(s) ? s : "tracker:" + s;
      }));
      body.peerSearch = {
        sources: all2.filter(function (s, i) {
          return all2.indexOf(s) === i;
        }),
        min: 40,
        max: 200
      };
    }
    if (!hasIdx) {
      body.guessFileIdx = {};
      if (seriesInfo && isFinite(seriesInfo.season)) body.guessFileIdx.season = seriesInfo.season;
      if (seriesInfo && isFinite(seriesInfo.episode)) body.guessFileIdx.episode = seriesInfo.episode;
    } else body.guessFileIdx = false;
    return postJSON(base + encodeURIComponent(infoHash) + "/create", body, {
      timeout: 3e4
    }).then(function (r) {
      return torrentUrl(base, infoHash, hasIdx ? fileIdx : r && r.guessedFileIdx, body.peerSearch ? body.peerSearch.sources : []);
    });
  }
  function proxyUrl(base, streamUrl2, reqHeaders, resHeaders) {
    var m = streamUrl2.match(/^(https?:\/\/[^/?#]+)([^?#]*)(\?[^#]*)?/);
    if (!m) return streamUrl2;
    var parts = ["d=" + encodeURIComponent(m[1])];
    Object.keys(reqHeaders || {}).forEach(function (k) {
      return parts.push("h=" + encodeURIComponent(k + ":" + reqHeaders[k]));
    });
    Object.keys(resHeaders || {}).forEach(function (k) {
      return parts.push("r=" + encodeURIComponent(k + ":" + resHeaders[k]));
    });
    return base + "proxy/" + parts.join("&") + (m[2] || "/") + (m[3] || "");
  }
  function corsProxyUrl(url2) {
    var base = isAvailable() ? baseUrl() : "";
    var m = url2.match(/^(https?:\/\/[^/?#]+)(.*)$/);
    if (!base || !m) return null;
    return base + "proxy/d=" + encodeURIComponent(m[1]) + "&r=" + encodeURIComponent("Access-Control-Allow-Origin:*") + (m[2] || "/");
  }
  function getJSONViaProxy(url2, opts) {
    return getJSON(url2, Object.assign({
      quiet: true
    }, opts)).catch(function (e) {
      if (e.status && e.status !== 0) throw e;
      return getJSON(fetchUrl(url2), Object.assign({
        quiet: true
      }, opts)).catch(function (e2) {
        var p = corsProxyUrl(url2);
        if (!p || e2.status && e2.status !== 0) throw e2;
        return getJSON(p, Object.assign({
          quiet: true
        }, opts));
      });
    });
  }
  function needsServer(stream) {
    if (isTorrent(stream) && active()) return false;
    if (typeof stream.url === "string") {
      if (stream.url.indexOf("magnet:") === 0) return true;
      return !!(stream.behaviorHints && stream.behaviorHints.proxyHeaders);
    }
    return typeof stream.infoHash === "string";
  }
  function isPlayableType(stream) {
    return typeof stream.url === "string" || typeof stream.infoHash === "string";
  }
  function isTorrent(stream) {
    return typeof stream.infoHash === "string" || typeof stream.url === "string" && stream.url.indexOf("magnet:") === 0;
  }
  function toPlayable(stream, seriesInfo) {
    var p = isTorrent(stream) && active();
    if (!p) return toPlayableLocal(stream, seriesInfo);
    var mg = stream.infoHash ? {
      infoHash: stream.infoHash,
      sources: stream.sources || []
    } : parseMagnet(stream.url);
    if (!mg) return Promise.reject(new Error(t("Magnet inválido")));
    var hint = {
      fileIdx: stream.fileIdx,
      filename: stream.behaviorHints && stream.behaviorHints.filename,
      season: seriesInfo && seriesInfo.season,
      episode: seriesInfo && seriesInfo.episode
    };
    return resolve(mg.infoHash, mg.sources, hint).then(function (u) {
      return {
        url: u,
        viaServer: false,
        debrid: p.name
      };
    }).catch(function (e) {
      return baseUrl() ? toPlayableLocal(stream, seriesInfo) : Promise.reject(e);
    });
  }
  function toPlayableLocal(stream, seriesInfo) {
    var base = baseUrl();
    if (typeof stream.url === "string") {
      if (stream.url.indexOf("magnet:") === 0) {
        if (!base) return Promise.reject(new Error(t("Este link é torrent: configure o servidor do PC")));
        var mg = parseMagnet(stream.url);
        if (!mg) return Promise.reject(new Error(t("Magnet inválido")));
        return createTorrent(base, mg.infoHash, null, mg.sources, seriesInfo).then(function (u) {
          return {
            url: u,
            viaServer: true
          };
        });
      }
      var ph = stream.behaviorHints && stream.behaviorHints.proxyHeaders;
      if (ph && base) {
        return Promise.resolve({
          url: proxyUrl(base, stream.url, ph.request, ph.response),
          viaServer: true
        });
      }
      return Promise.resolve({
        url: stream.url,
        viaServer: false
      });
    }
    if (typeof stream.infoHash === "string") {
      if (!base) return Promise.reject(new Error(t("Este link é torrent: configure o servidor do PC")));
      return createTorrent(base, stream.infoHash.toLowerCase(), stream.fileIdx, stream.sources || [], seriesInfo).then(function (u) {
        return {
          url: u,
          viaServer: true
        };
      });
    }
    return Promise.reject(new Error(t("Tipo de link não suportado na TV")));
  }
  function tracks(mediaUrl) {
    var base = baseUrl();
    if (!base) return Promise.resolve(null);
    return getJSON(base + "tracks/" + encodeURIComponent(mediaUrl), {
      timeout: 2e4,
      quiet: true
    }).then(function (list2) {
      var arr = Array.isArray(list2) ? list2 : [];
      return {
        audio: arr.filter(function (tk) {
          return tk && tk.type === "audio";
        }),
        subs: arr.filter(function (tk) {
          return tk && tk.type === "text";
        })
      };
    });
  }
  function streamProgress(mediaUrl) {
    var m = String(mediaUrl || "").match(/\/([a-f0-9]{40})\/(\d+)/i);
    var base = baseUrl();
    if (!m || !base) return Promise.resolve(null);
    return getJSON(base + m[1] + "/" + m[2] + "/stats.json", {
      timeout: 5e3,
      quiet: true
    }).then(function (r) {
      return r && typeof r.streamProgress === "number" ? r.streamProgress : null;
    }).catch(function () {
      return null;
    });
  }
  function subtitlesProxy(subUrl) {
    var base = baseUrl();
    return base ? base + "subtitles.vtt?from=" + encodeURIComponent(subUrl) : null;
  }

  // src/js/api/extras.js
  var TMDB = "https://api.themoviedb.org/3/";
  var TMDB_IMG = "https://image.tmdb.org/t/p/";
  var ARM = "https://arm.haglund.dev/api/v2/";
  function imdbOf(id) {
    var m = String(id || "").match(/^tt\d+/);
    return m ? m[0] : null;
  }
  function tmdbKey() {
    return (settings().tmdbKey || "").trim();
  }
  function hasTmdb() {
    return !!tmdbKey();
  }
  function tmdb(path, params) {
    var q2 = ["api_key=" + encodeURIComponent(tmdbKey())];
    Object.keys(params || {}).forEach(function (k) {
      return q2.push(k + "=" + encodeURIComponent(params[k]));
    });
    return cachedJSON(TMDB + path + "?" + q2.join("&"), 6 * 36e5, {
      quiet: true
    });
  }
  function digitalReleases(ymd2, region) {
    if (!tmdbKey()) return Promise.resolve(null);
    return tmdb("discover/movie", {
      with_release_type: 4,
      "release_date.gte": ymd2,
      "release_date.lte": ymd2,
      region: region,
      sort_by: "popularity.desc",
      include_adult: "false",
      language: apiLang()
    }).then(function (r) {
      return (r && r.results || []).map(function (m) {
        return {
          tmdb: m.id,
          name: m.title,
          poster: m.poster_path ? TMDB_IMG + "w342" + m.poster_path : null,
          score: m.vote_average ? Math.round(m.vote_average * 10) : 0
        };
      });
    });
  }
  function tmdbFind(imdb) {
    if (!tmdbKey() || !imdb) return Promise.resolve(null);
    return tmdb("find/" + imdb, {
      external_source: "imdb_id",
      language: apiLang()
    }).then(function (r) {
      var m = (r.movie_results || [])[0];
      var tv = (r.tv_results || [])[0];
      var hit = m || tv;
      if (!hit) return null;
      return {
        id: hit.id,
        type: m ? "movie" : "tv",
        overview: hit.overview || "",
        title: hit.title || hit.name || ""
      };
    });
  }
  function pickLogo(logos) {
    var pref = current() === "ar" ? ["ar", "en", null] : ["en", null];
    var _loop3 = function _loop3(i) {
        var l = (logos || []).find(function (x) {
          return x.iso_639_1 === pref[i];
        });
        if (l) return {
          v: TMDB_IMG + "w500" + l.file_path
        };
      },
      _ret;
    for (var i = 0; i < pref.length; i++) {
      _ret = _loop3(i);
      if (_ret) return _ret.v;
    }
    return null;
  }
  function localized(meta) {
    var imdb = imdbOf(meta.id);
    return tmdbFind(imdb).then(function (f) {
      if (!f) return null;
      return tmdb(f.type + "/" + f.id, {
        language: apiLang(),
        append_to_response: "credits,images",
        include_image_language: "en,ar,null"
      }).then(function (d) {
        return {
          tmdbId: f.id,
          tmdbType: f.type,
          title: d.title || d.name || f.title,
          overview: d.overview || f.overview,
          tagline: d.tagline || "",
          // TMDB's own collection (any film series): { id, name }
          collection: d.belongs_to_collection ? {
            id: d.belongs_to_collection.id,
            name: d.belongs_to_collection.name
          } : null,
          logo: pickLogo(d.images && d.images.logos),
          cast: (d.credits && d.credits.cast || []).slice(0, 14).map(function (c) {
            return {
              id: c.id,
              name: c.name,
              character: c.character || "",
              photo: c.profile_path ? TMDB_IMG + "w185" + c.profile_path : null
            };
          })
        };
      });
    });
  }
  function person(id) {
    return tmdb("person/" + id, {
      language: apiLang(),
      append_to_response: "combined_credits"
    }).then(function (p) {
      var bio = p.biography ? Promise.resolve(p.biography) : current() === "ar" ? tmdb("person/" + id, {
        language: "en-US"
      }).then(function (e) {
        return e && e.biography || "";
      }) : Promise.resolve("");
      return bio.then(function (biography) {
        var seen = {};
        var credits = (p.combined_credits && p.combined_credits.cast || []).concat((p.combined_credits && p.combined_credits.crew || []).filter(function (c) {
          return c.job === "Director";
        })).filter(function (c) {
          var key3 = c.media_type + c.id;
          if (!c.poster_path || seen[key3] || c.media_type !== "movie" && c.media_type !== "tv") return false;
          if (c.media_type === "tv" && /^(Self|Himself|Herself|Host)/i.test(c.character || "")) return false;
          seen[key3] = true;
          return true;
        }).sort(function (a, b) {
          return (b.popularity || 0) - (a.popularity || 0);
        }).map(function (c) {
          return {
            tmdb: c.id,
            type: c.media_type,
            name: c.title || c.name,
            poster: TMDB_IMG + "w342" + c.poster_path,
            year: String(c.release_date || c.first_air_date || "").slice(0, 4),
            role: c.character || c.job || ""
          };
        });
        return {
          name: p.name,
          photo: p.profile_path ? TMDB_IMG + "h632" + p.profile_path : null,
          birthday: p.birthday,
          deathday: p.deathday,
          place: p.place_of_birth || "",
          department: p.known_for_department || "",
          biography: biography,
          credits: credits
        };
      });
    });
  }
  function searchPeople(query) {
    if (!tmdbKey()) return Promise.resolve([]);
    return tmdb("search/person", {
      query: query,
      include_adult: "false",
      language: apiLang()
    }).then(function (r) {
      return (r && r.results || []).filter(function (p) {
        return p.profile_path && (p.known_for_department === "Acting" || p.known_for_department === "Directing") && p.popularity > 1;
      }).slice(0, 12).map(function (p) {
        return {
          id: p.id,
          name: p.name,
          photo: TMDB_IMG + "w185" + p.profile_path
        };
      });
    });
  }
  function tmdbGet(path, params) {
    if (!tmdbKey()) return Promise.reject(new Error("no TMDB key"));
    return tmdb(path, Object.assign({
      language: apiLang()
    }, params || {}));
  }
  function tmdbImdb(type, id) {
    return tmdb(type + "/" + id + "/external_ids", {}).then(function (r) {
      return r && r.imdb_id || null;
    });
  }
  function seasonPt(tmdbId, season) {
    if (!tmdbKey()) return Promise.resolve({});
    return tmdb("tv/" + tmdbId + "/season/" + season, {
      language: apiLang()
    }).then(function (r) {
      var map = {};
      (r.episodes || []).forEach(function (e) {
        map[e.episode_number] = {
          name: e.name,
          overview: e.overview,
          still: e.still_path ? TMDB_IMG + "w300" + e.still_path : null
        };
      });
      return map;
    });
  }
  function mdblist(meta) {
    var key3 = (settings().mdblistKey || "").trim();
    var imdb = imdbOf(meta.id);
    if (!key3 || !imdb) return Promise.resolve([]);
    var type = meta.type === "series" ? "show" : "movie";
    return getJSONViaProxy("https://api.mdblist.com/imdb/" + type + "/" + imdb + "?apikey=" + encodeURIComponent(key3), {
      timeout: 12e3
    }).then(function (d) {
      var out = [];
      (d.ratings || []).forEach(function (r) {
        var v = r.value;
        if (v === null || v === void 0 || v === 0) return;
        var src = String(r.source || "").toLowerCase();
        if (src === "tomatoes") out.push({
          cls: "rt",
          label: "RT",
          value: v + "%"
        });else if (src === "popcorn" || src === "tomatoesaudience") out.push({
          cls: "rt",
          label: t("Público"),
          value: v + "%"
        });else if (src === "metacritic") out.push({
          cls: "mc",
          label: "MC",
          value: String(v)
        });else if (src === "trakt") out.push({
          cls: "trakt",
          label: "Trakt",
          value: v + "%"
        });else if (src === "letterboxd") out.push({
          cls: "lb",
          label: "LB",
          value: Number(v).toFixed(1)
        });else if (src === "tmdb") out.push({
          cls: "tmdb",
          label: "TMDB",
          value: v + "%"
        });
      });
      return out;
    }).catch(function () {
      return [];
    });
  }
  function anilistScore(meta) {
    var m = String(meta.id).match(/^(kitsu|mal|anilist):(\d+)/);
    var idPromise;
    if (m && m[1] === "anilist") idPromise = Promise.resolve({
      anilist: parseInt(m[2], 10)
    });else if (m) idPromise = getJSON(ARM + "ids?source=" + (m[1] === "mal" ? "myanimelist" : m[1]) + "&id=" + m[2], {
      quiet: true
    });else if (imdbOf(meta.id)) idPromise = getJSON(ARM + "imdb?id=" + imdbOf(meta.id), {
      quiet: true
    }).then(function (l) {
      return Array.isArray(l) && l[0] || null;
    });else return Promise.resolve([]);
    return idPromise.then(function (ids2) {
      if (!ids2 || !ids2.anilist) return [];
      return postJSON("https://graphql.anilist.co", {
        query: "query($id:Int){Media(id:$id,type:ANIME){averageScore}}",
        variables: {
          id: ids2.anilist
        }
      }, {
        quiet: true
      }).then(function (r) {
        var sc = r && r.data && r.data.Media && r.data.Media.averageScore;
        return sc ? [{
          cls: "al",
          label: "AniList",
          value: sc + "%"
        }] : [];
      });
    }).catch(function () {
      return [];
    });
  }
  function ratings(meta, anime) {
    var base = meta.imdbRating ? [{
      cls: "imdb",
      label: "IMDb",
      value: String(meta.imdbRating)
    }] : [];
    return Promise.all([mdblist(meta), anime ? anilistScore(meta) : Promise.resolve([])]).then(function (r) {
      return base.concat(r[0], r[1]);
    });
  }
  function searchCollections(query) {
    if (!tmdbKey()) return Promise.resolve([]);
    return tmdb("search/collection", {
      query: query,
      language: apiLang()
    }).then(function (r) {
      return (r && r.results || []).slice(0, 20).map(function (c) {
        return {
          id: c.id,
          name: c.name,
          poster: c.poster_path ? TMDB_IMG + "w342" + c.poster_path : null
        };
      });
    });
  }
  var collectionCache = {};
  function tmdbCollection(id) {
    if (collectionCache[id]) return collectionCache[id];
    var p = tmdb("collection/" + id, {
      language: apiLang()
    }).then(function (c) {
      var parts = (c && c.parts || []).filter(function (x) {
        return x.release_date;
      }).sort(function (a, b) {
        return String(a.release_date).localeCompare(String(b.release_date));
      });
      return Promise.all(parts.map(function (x) {
        return tmdbImdb("movie", x.id).catch(function () {
          return null;
        });
      })).then(function (ids2) {
        return {
          id: "tmdb:" + id,
          name: c.name,
          ar: c.name,
          items: parts.map(function (x, i) {
            return ids2[i] ? [ids2[i], x.title, parseInt(x.release_date, 10)] : null;
          }).filter(Boolean)
        };
      });
    });
    collectionCache[id] = p;
    p.catch(function () {
      return delete collectionCache[id];
    });
    return p;
  }

  // src/js/lib/watched.js
  var KEY2 = "watched";
  var DONE = 0.9;
  var MAX = 3e3;
  var cache2 = null;
  var cacheFor = null;
  function all() {
    var id = activeProfile().id;
    if (cacheFor !== id) {
      cache2 = get(KEY2, {}) || {};
      cacheFor = id;
    }
    return cache2;
  }
  function record(videoId, fraction) {
    if (!videoId || !(fraction > 0.02)) return;
    var map = all();
    delete map[videoId];
    map[videoId] = fraction >= DONE ? 1 : Math.round(fraction * 1e3) / 1e3;
    var keys2 = Object.keys(map);
    for (var i = 0; i < keys2.length - MAX; i++) delete map[keys2[i]];
    set(KEY2, map);
  }
  function markWatchedMany(ids2) {
    if (!ids2 || !ids2.length) return;
    var map = all();
    var changed = false;
    ids2.forEach(function (id) {
      if (id && map[id] !== 1) {
        map[id] = 1;
        changed = true;
      }
    });
    if (!changed) return;
    var keys2 = Object.keys(map);
    for (var i = 0; i < keys2.length - MAX; i++) delete map[keys2[i]];
    set(KEY2, map);
  }
  function isWatched(videoId) {
    return all()[videoId] === 1;
  }
  function progress(videoId) {
    var v = all()[videoId];
    return v && v < 1 ? v : 0;
  }

  // src/js/router.js
  var stack = [];
  var app = function app() {
    return document.getElementById("app");
  };
  var tabs = {};
  function show(view) {
    view.el.classList.remove("hidden");
    if (view.layer) {
      popLayer(view.layer);
    }
    view.layer = pushLayer(view.el, {
      onBack: function onBack() {
        return back();
      },
      onKey: view.onKey
    });
    if (view.restoreFocus && document.body.contains(view.restoreFocus)) focus(view.restoreFocus, {
      noScroll: true
    });else focusFirst(view.el);
    if (view.onShow) view.onShow();
    loadVisibleImages(view.el);
  }
  function hide(view) {
    view.restoreFocus = current2();
    if (view.layer) popLayer(view.layer);
    view.layer = null;
    view.el.classList.add("hidden");
    if (view.onHide) view.onHide();
    unloadImages(view.el);
  }
  function push(view) {
    var prev = stack[stack.length - 1];
    if (prev) hide(prev);
    if (!view.el.parentNode) app().appendChild(view.el);
    stack.push(view);
    show(view);
  }
  function pop() {
    if (stack.length <= 1) return false;
    var view = stack.pop();
    hide(view);
    if (!view.keepAlive) {
      if (view.destroy) view.destroy();
      if (view.el.parentNode) view.el.parentNode.removeChild(view.el);
    }
    show(stack[stack.length - 1]);
    return true;
  }
  function back() {
    var view = stack[stack.length - 1];
    if (view && view.onBack && view.onBack() === true) return;
    if (stack.length > 1) {
      pop();
      return;
    }
    if (view && view.tabId && view.tabId !== "home") {
      goTab("home");
      return;
    }
    confirmDialog(t("Sair do Stremio Kai?"), t("Sair"), function () {
      return platformBack();
    });
  }
  function goTab(id) {
    while (stack.length > 1) pop();
    var cur = stack[0];
    if (cur && cur.tabId === id) return;
    var view = tabs[id];
    if (!view) {
      view = registry[id]();
      view.tabId = id;
      view.keepAlive = true;
      tabs[id] = view;
    }
    if (cur) {
      hide(cur);
      stack.length = 0;
      if (cur.tabId !== "home") dropTab(cur.tabId);
    }
    if (!view.el.parentNode) app().appendChild(view.el);
    stack.push(view);
    show(view);
  }
  var registry = {};
  function registerTab(id, factory) {
    registry[id] = factory;
  }
  function tabView(id) {
    return tabs[id] || null;
  }
  function currentView() {
    return stack[stack.length - 1] || null;
  }
  function dropTab(id) {
    var v = tabs[id];
    if (!v) return;
    delete tabs[id];
    if (v.destroy) v.destroy();
    if (v.el.parentNode && stack.indexOf(v) < 0) v.el.parentNode.removeChild(v.el);
    if (v.layer) popLayer(v.layer);
  }

  // src/js/api/mediaserver.js
  var KINDS = [{
    id: "jellyfin",
    name: "Jellyfin"
  }, {
    id: "emby",
    name: "Emby"
  }];
  function connection() {
    var c = settings().mediaServer;
    return c && c.token && c.address ? c : null;
  }
  function enabled() {
    return !!connection() && settings().mediaServerEnabled !== false;
  }
  function deviceId() {
    var id = settings().mediaServerDeviceId;
    if (!id) {
      id = "tv" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      saveSettings({
        mediaServerDeviceId: id
      });
    }
    return id;
  }
  function root(c) {
    return c.address + (c.providerId === "emby" ? "/emby" : "");
  }
  function headers(c) {
    var auth2 = 'MediaBrowser Client="Stremio 7M", Device="Samsung TV", DeviceId="' + deviceId() + '", Version="1.0"' + (c.token ? ', Token="' + c.token + '"' : "");
    var h2 = {};
    h2[c.providerId === "emby" ? "X-Emby-Authorization" : "Authorization"] = auth2;
    return h2;
  }
  function call2(c, method, path, body) {
    return request(method, root(c) + path, body, {
      timeout: 15e3,
      headers: headers(c)
    });
  }
  function normalizeAddress(value) {
    var v = String(value || "").trim();
    if (!v) return "";
    if (!/^https?:\/\//i.test(v)) v = "http://" + v;
    if (!/:\d+(\/|$)/.test(v.replace(/^https?:\/\//i, "")) && /^http:/i.test(v)) v = v.replace(/\/*$/, "") + ":8096";
    return v.replace(/\/+$/, "").replace(/\/emby$/i, "");
  }
  function connect(providerId, address, username, password) {
    var draft = {
      providerId: providerId,
      address: normalizeAddress(address)
    };
    if (!draft.address) return Promise.reject(new Error(t("Endereço inválido")));
    return call2(draft, "GET", "/System/Info/Public").then(function (info2) {
      return call2(draft, "POST", "/Users/AuthenticateByName", {
        Username: username,
        Pw: password || ""
      }).then(function (auth2) {
        if (!auth2 || !auth2.AccessToken || !auth2.User) throw new Error(t("Usuário ou senha errados"));
        var c = {
          providerId: providerId,
          address: draft.address,
          token: auth2.AccessToken,
          userId: auth2.User.Id,
          user: auth2.User.Name || username,
          name: info2 && info2.ServerName || draft.address
        };
        saveSettings({
          mediaServer: c,
          mediaServerEnabled: true
        });
        return c;
      });
    });
  }
  function disconnect() {
    var c = connection();
    if (c) call2(c, "POST", "/Sessions/Logout").catch(function () {});
    saveSettings({
      mediaServer: null
    });
  }
  function q(obj) {
    return Object.keys(obj).map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]);
    }).join("&");
  }
  function findItem(c, type, imdb) {
    var params = {
      Recursive: "true",
      IncludeItemTypes: type === "movie" ? "Movie" : "Series",
      AnyProviderIdEquals: "imdb." + imdb,
      Fields: "ProviderIds,MediaSources",
      Limit: 20
    };
    return call2(c, "GET", "/Users/" + c.userId + "/Items?" + q(params)).then(function (r) {
      return (r && r.Items || []).filter(function (it) {
        var ids2 = it.ProviderIds || {};
        return String(ids2.Imdb || ids2.IMDB || ids2.imdb || "") === imdb;
      });
    });
  }
  function streamUrl(c, itemId, sourceId) {
    return root(c) + "/Videos/" + encodeURIComponent(itemId) + "/stream?" + q({
      static: "true",
      MediaSourceId: sourceId,
      DeviceId: deviceId(),
      api_key: c.token
    });
  }
  function sizeLabel(bytes) {
    if (!bytes) return "";
    return bytes > 1073741824 ? (bytes / 1073741824).toFixed(1) + " GB" : Math.round(bytes / 1048576) + " MB";
  }
  function streams(type, id) {
    var c = connection();
    var m = String(id).match(/^(tt\d+)(?::(\d+):(\d+))?$/);
    if (!c || !m) return Promise.resolve([]);
    return findItem(c, type, m[1]).then(function (items3) {
      if (items3.length !== 1) return [];
      var item2 = items3[0];
      var pick2 = type === "movie" ? Promise.resolve(item2) : call2(c, "GET", "/Shows/" + encodeURIComponent(item2.Id) + "/Episodes?" + q({
        UserId: c.userId,
        Season: m[2],
        Fields: "MediaSources"
      })).then(function (r) {
        return (r && r.Items || []).find(function (ep) {
          return ep.ParentIndexNumber === +m[2] && ep.IndexNumber === +m[3] && !ep.IsMissing;
        });
      });
      return pick2.then(function (it) {
        return !it ? [] : (it.MediaSources || []).map(function (src) {
          var video = (src.MediaStreams || []).find(function (x) {
            return x.Type === "Video";
          });
          var audio = (src.MediaStreams || []).find(function (x) {
            return x.Type === "Audio";
          });
          return {
            name: c.name,
            title: [src.Name || it.Name, [video && video.DisplayTitle, audio && audio.DisplayTitle, (src.Container || "").toUpperCase(), sizeLabel(src.Size)].filter(Boolean).join(" · ")].join("\n"),
            url: streamUrl(c, it.Id, src.Id),
            behaviorHints: {
              filename: (src.Path || "").split(/[\\/]/).pop()
            }
          };
        });
      });
    });
  }
  function virtualAddon() {
    if (!enabled()) return null;
    var c = connection();
    return {
      transportUrl: "mediaserver://" + c.providerId,
      manifest: {
        id: "mediaserver." + c.providerId,
        name: c.name,
        resources: ["stream"],
        types: ["movie", "series"],
        idPrefixes: ["tt"]
      },
      base: "",
      query: "",
      virtualStreams: streams
    };
  }
  function quickConnectFlow(address) {
    var draft = {
      providerId: "jellyfin",
      address: normalizeAddress(address)
    };
    return {
      name: "Jellyfin",
      hint: t("No app ou site do Jellyfin: Configurações → Quick Connect, e digite o código."),
      start: function start() {
        if (!draft.address) return Promise.reject(new Error(t("Endereço inválido")));
        return call2(draft, "GET", "/QuickConnect/Enabled").then(function (on) {
          if (on === false) throw new Error(t("Ative o Quick Connect no painel do Jellyfin"));
          return call2(draft, "POST", "/QuickConnect/Initiate").then(function (r) {
            if (!r || !r.Secret) throw new Error("Quick Connect");
            return {
              code: r.Code,
              url: draft.address + "/web/#/quickconnect",
              qrUrl: draft.address + "/web/#/quickconnect",
              interval: 4,
              expiresIn: 600,
              poll: function poll() {
                return call2(draft, "GET", "/QuickConnect/Connect?secret=" + encodeURIComponent(r.Secret)).then(function (st) {
                  if (!st || !st.Authenticated) return "pending";
                  return Promise.all([call2(draft, "GET", "/System/Info/Public").catch(function () {
                    return null;
                  }), call2(draft, "POST", "/Users/AuthenticateWithQuickConnect", {
                    Secret: r.Secret
                  })]).then(function (x) {
                    var info2 = x[0];
                    var auth2 = x[1];
                    if (!auth2 || !auth2.AccessToken) return "pending";
                    saveSettings({
                      mediaServer: {
                        providerId: "jellyfin",
                        address: draft.address,
                        token: auth2.AccessToken,
                        userId: auth2.User.Id,
                        user: auth2.User.Name,
                        name: info2 && info2.ServerName || draft.address
                      },
                      mediaServerEnabled: true
                    });
                    return "ok";
                  });
                });
              }
            };
          });
        });
      }
    };
  }

  // src/js/api/addons.js
  var CINEMETA = "https://v3-cinemeta.strem.io/manifest.json";
  var OPENSUBTITLES = "https://opensubtitles-v3.strem.io/manifest.json";
  var addons = null;
  function normalize(list2) {
    return (list2 || []).filter(function (a) {
      return a && a.transportUrl && a.manifest;
    }).filter(function (a) {
      return /^https?:/.test(a.transportUrl);
    }).map(function (a) {
      return {
        transportUrl: a.transportUrl,
        manifest: a.manifest,
        base: a.transportUrl.replace(/\/manifest\.json(\?.*)?$/, ""),
        query: (a.transportUrl.match(/\/manifest\.json(\?.*)$/) || [])[1] || ""
      };
    });
  }
  function defaultAddons() {
    var urls = [CINEMETA, OPENSUBTITLES].concat(settings().localAddons || []);
    return Promise.all(urls.map(function (u) {
      return getJSON(u).then(function (m) {
        return {
          transportUrl: u,
          manifest: m
        };
      }).catch(function () {
        return null;
      });
    })).then(function (list2) {
      return list2.filter(Boolean);
    });
  }
  function load(force) {
    if (addons && !force) return Promise.resolve(addons);
    if (isLoggedIn()) {
      var cached2 = cachedAddons();
      var fresh = getAddonCollection().then(function (list2) {
        return addons = normalize(list2);
      });
      if (cached2 && cached2.length && !force) {
        addons = normalize(cached2);
        fresh.catch(function (e) {
          return log.warn("Addons: usando cache", e.message);
        });
        return Promise.resolve(addons);
      }
      return fresh.catch(function () {
        addons = normalize(cached2 || []);
        return addons;
      });
    }
    return defaultAddons().then(function (list2) {
      return addons = normalize(list2);
    });
  }
  function list() {
    var ms = virtualAddon();
    return ms ? [ms].concat(addons || []) : addons || [];
  }
  function resourceMatch(addon, resource, type, id) {
    var m = addon.manifest;
    var resources = m.resources || [];
    for (var i = 0; i < resources.length; i++) {
      var r = resources[i];
      var name = typeof r === "string" ? r : r.name;
      if (name !== resource) continue;
      var types = _typeof(r) === "object" && r.types || m.types || [];
      if (type && types.length && types.indexOf(type) < 0) continue;
      var prefixes = _typeof(r) === "object" && r.idPrefixes || m.idPrefixes;
      if (id && prefixes && prefixes.length && !prefixes.some(function (p) {
        return id.indexOf(p) === 0;
      })) continue;
      return true;
    }
    return false;
  }
  function withResource(resource, type, id) {
    return list().filter(function (a) {
      return resourceMatch(a, resource, type, id);
    });
  }
  function url(addon, resource, type, id, extra) {
    var path = "/" + resource + "/" + encodeURIComponent(type) + "/" + encodeURIComponent(id);
    if (extra) {
      var parts = Object.keys(extra).filter(function (k) {
        return extra[k] !== void 0 && extra[k] !== null && extra[k] !== "";
      }).map(function (k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(extra[k]);
      });
      if (parts.length) path += "/" + parts.join("&");
    }
    return addon.base + path + ".json" + addon.query;
  }
  function boardCatalogs() {
    var out = [];
    list().forEach(function (addon) {
      (addon.manifest.catalogs || []).forEach(function (cat) {
        var extras = cat.extra || [];
        var required = extras.some(function (e) {
          return e.isRequired;
        }) || cat.extraRequired && cat.extraRequired.length;
        if (required) return;
        out.push({
          addon: addon,
          catalog: cat
        });
      });
    });
    return out;
  }
  function searchCatalogs() {
    var out = [];
    list().forEach(function (addon) {
      (addon.manifest.catalogs || []).forEach(function (cat) {
        var extras = cat.extra || [];
        var supports = extras.some(function (e) {
          return e.name === "search";
        }) || (cat.extraSupported || []).indexOf("search") >= 0;
        if (supports) out.push({
          addon: addon,
          catalog: cat
        });
      });
    });
    return out;
  }
  function catalogTitle(entry) {
    var typeName = {
      movie: t("Filmes"),
      series: t("Séries"),
      anime: t("Animes"),
      channel: t("Canais"),
      tv: "TV"
    }[entry.catalog.type] || entry.catalog.type;
    var name = entry.catalog.name || entry.catalog.id;
    return name + " · " + typeName;
  }
  function fetchCatalog(entry, extra) {
    return cachedJSON(url(entry.addon, "catalog", entry.catalog.type, entry.catalog.id, extra), 15 * 6e4, {
      timeout: 12e3
    }).then(function (r) {
      return r && r.metas || [];
    });
  }
  function fetchMeta(type, id) {
    var sources = withResource("meta", type, id);
    if (!sources.length) return Promise.reject(new Error(t("Nenhum addon fornece detalhes para {id}", {
      id: id
    })));
    var i = 0;
    var _next = function next() {
      if (i >= sources.length) throw new Error(t("Detalhes não encontrados"));
      var a = sources[i++];
      return cachedJSON(url(a, "meta", type, id), 30 * 6e4).then(function (r) {
        if (r && r.meta) return r.meta;
        return _next();
      }).catch(function () {
        return _next();
      });
    };
    return _next();
  }
  function fetchStreams(type, id, onAddon) {
    var sources = withResource("stream", type, id);
    return Promise.all(sources.map(function (a) {
      return (a.virtualStreams ? a.virtualStreams(type, id).then(function (list2) {
        return {
          streams: list2
        };
      }) : getJSON(url(a, "stream", type, id), {
        timeout: 3e4
      })).then(function (r) {
        var streams2 = (r && r.streams || []).map(function (s) {
          return Object.assign({
            addon: a.manifest.name || a.manifest.id
          }, s);
        });
        if (onAddon) onAddon(a, streams2);
        return streams2;
      }).catch(function (e) {
        if (onAddon) onAddon(a, [], e);
        return [];
      });
    })).then(function (all2) {
      return all2.reduce(function (acc, x) {
        return acc.concat(x);
      }, []);
    });
  }
  function fetchSubtitles(type, id, extra, onAddon) {
    var sources = withResource("subtitles", type, id);
    return Promise.all(sources.map(function (a) {
      return getJSON(url(a, "subtitles", type, id, extra), {
        timeout: 15e3
      }).then(function (r) {
        return (r && r.subtitles || []).map(function (s) {
          return Object.assign({
            addon: a.manifest.name
          }, s);
        });
      }).catch(function () {
        return [];
      }).then(function (list2) {
        if (onAddon) onAddon(list2);
        return list2;
      });
    })).then(function (all2) {
      return all2.reduce(function (acc, x) {
        return acc.concat(x);
      }, []);
    });
  }

  // src/js/api/hero.js
  var SOURCES = [{
    id: "cinemeta",
    name: "Cinemeta · Populares"
  }, {
    id: "cinemeta-featured",
    name: "Cinemeta · Mais bem avaliados"
  }, {
    id: "mdblist",
    name: "MDBList · Tendências (Snoak)"
  }, {
    id: "off",
    name: "Desligado"
  }];
  var CINEMETA2 = "https://cinemeta-catalogs.strem.io/top/catalog/";
  var MDBLIST = {
    movie: "https://mdblist.com/lists/snoak/trending-movies/json",
    series: "https://mdblist.com/lists/snoak/trakt-s-trending-shows/json"
  };
  function background(id) {
    return "https://images.metahub.space/background/medium/" + id + "/img";
  }
  function logo(id) {
    return "https://images.metahub.space/logo/medium/" + id + "/img";
  }
  function fromMeta(m) {
    return {
      id: m.id || m.imdb_id,
      type: m.type,
      name: m.name,
      description: m.description || "",
      year: m.releaseInfo || m.year || "",
      genres: m.genres || m.genre || [],
      rating: m.imdbRating || "",
      runtime: m.runtime || "",
      background: m.background || background(m.id || m.imdb_id),
      logo: m.logo || logo(m.id || m.imdb_id),
      poster: m.poster
    };
  }
  function interleave(a, b) {
    var out = [];
    for (var i = 0; i < Math.max(a.length, b.length); i++) {
      if (a[i]) out.push(a[i]);
      if (b[i]) out.push(b[i]);
    }
    return out;
  }
  function cinemeta(catalogId) {
    return Promise.all(["movie", "series"].map(function (t2) {
      return cachedJSON(CINEMETA2 + t2 + "/" + catalogId + ".json", 36e5).then(function (r) {
        return (r.metas || []).slice(0, 8).map(fromMeta);
      }).catch(function () {
        return [];
      });
    })).then(function (r) {
      return interleave(r[0], r[1]);
    });
  }
  function mdblist2() {
    return Promise.all(["movie", "series"].map(function (t2) {
      return getJSONViaProxy(MDBLIST[t2], {
        timeout: 15e3
      }).then(function (list2) {
        return Promise.all((list2 || []).filter(function (x) {
          return x.imdb_id;
        }).slice(0, 6).map(function (x) {
          return fetchMeta(t2, x.imdb_id).then(fromMeta).catch(function () {
            return null;
          });
        }));
      }).then(function (l) {
        return l.filter(Boolean);
      });
    })).then(function (r) {
      return interleave(r[0], r[1]);
    });
  }
  function localize(items3) {
    if (!hasTmdb()) return items3;
    return Promise.all(items3.map(function (it) {
      return tmdbFind(it.id).then(function (f) {
        if (f && f.overview) it.description = f.overview;
        if (f && f.title) it.name = f.title;
        return it;
      }).catch(function () {
        return it;
      });
    }));
  }
  function load2() {
    return loadRaw().then(function (items3) {
      return localize(items3.slice(0, 12));
    });
  }
  function loadRaw() {
    var src = settings().heroSource;
    if (src === "off") return Promise.resolve([]);
    if (src === "mdblist") {
      return mdblist2().then(function (l) {
        return l.length ? l : cinemeta("top");
      }).catch(function () {
        return cinemeta("top");
      });
    }
    return cinemeta(src === "cinemeta-featured" ? "imdbRating" : "top");
  }

  // src/js/lib/subs.js
  function toSec(ts) {
    var m = ts.trim().replace(",", ".").match(/(?:(\d+):)?(\d+):(\d+(?:\.\d+)?)/);
    if (!m) return NaN;
    return parseInt(m[1] || "0", 10) * 3600 + parseInt(m[2], 10) * 60 + parseFloat(m[3]);
  }
  function parse(text) {
    var cues = [];
    var blocks = String(text).replace(/^﻿/, "").replace(/\r\n?/g, "\n").split(/\n{2,}/);
    for (var i = 0; i < blocks.length; i++) {
      var lines = blocks[i].split("\n");
      var j = 0;
      while (j < lines.length && lines[j].indexOf("-->") < 0) j++;
      if (j >= lines.length) continue;
      var parts = lines[j].split("-->");
      var start3 = toSec(parts[0]);
      var end = toSec(parts[1].trim().split(/\s+/)[0]);
      if (!isFinite(start3) || !isFinite(end)) continue;
      var body = lines.slice(j + 1).join("\n").replace(/\{\\[^}]*\}/g, "").trim();
      if (body) cues.push({
        start: start3,
        end: end,
        text: sanitize(body)
      });
    }
    cues.sort(function (a, b) {
      return a.start - b.start;
    });
    return cues;
  }
  function sanitize(s) {
    var esc = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return esc.replace(/&lt;(\/?)(i|b|u)&gt;/gi, "<$1$2>").replace(/&lt;\/?[^&]*&gt;/g, "");
  }
  function load3(url2, fallbackUrl) {
    return getText(url2, {
      timeout: 2e4
    }).catch(function (e) {
      if (fallbackUrl) return getText(fallbackUrl, {
        timeout: 2e4
      });
      throw e;
    }).then(parse);
  }
  function Renderer(el) {
    var cues = [];
    var _offset = 0;
    var lastHtml = "";
    var idx = 0;
    function find2(t2) {
      if (idx >= cues.length || cues[idx] && cues[idx].start > t2) idx = 0;
      while (idx < cues.length && cues[idx].end < t2) idx++;
      var out = [];
      for (var k = idx; k < cues.length && cues[k].start <= t2; k++) {
        if (cues[k].end >= t2) out.push(cues[k].text);
      }
      return out.join("\n");
    }
    return {
      set: function set(c) {
        cues = c || [];
        idx = 0;
        lastHtml = "";
        el.innerHTML = "";
      },
      clear: function clear() {
        cues = [];
        lastHtml = "";
        el.innerHTML = "";
      },
      // One cue at a time (embedded subtitles delivered live by the Samsung player).
      add: function add(c) {
        cues.push(c);
        if (cues.length > 300) cues.splice(0, 100);
        idx = 0;
      },
      active: function active() {
        return cues.length > 0;
      },
      setOffset: function setOffset(sec) {
        return _offset = sec;
      },
      offset: function offset() {
        return _offset;
      },
      update: function update(t2) {
        if (!cues.length) return;
        var html = find2(t2 - _offset);
        if (html === lastHtml) return;
        lastHtml = html;
        el.innerHTML = html ? "<span>" + html + "</span>" : "";
      }
    };
  }

  // src/js/lib/substyle.js
  var FONTS = [{
    id: "nata",
    label: "Nata Sans (padrão Kai)",
    css: "'Nata Sans', 'Montserrat', sans-serif"
  }, {
    id: "montserrat",
    label: "Montserrat",
    css: "'Montserrat', sans-serif"
  }, {
    id: "tv",
    label: "Fonte da TV (LG)",
    css: "'LG Display', 'Museo Sans', sans-serif"
  }, {
    id: "classic",
    label: "Clássica (Arial)",
    css: "Arial, Helvetica, sans-serif"
  }];
  var STYLES = [{
    id: "kai",
    label: "Contorno fino + sombra (Kai)"
  }, {
    id: "outline",
    label: "Contorno grosso"
  }, {
    id: "shadow",
    label: "Só sombra"
  }, {
    id: "box",
    label: "Caixa de fundo"
  }];
  var COLORS2 = [{
    id: "#ffffff",
    label: "Branco",
    webos: "white"
  }, {
    id: "#ffe14d",
    label: "Amarelo",
    webos: "yellow"
  }, {
    id: "#dcdcdc",
    label: "Cinza claro",
    webos: "white"
  }, {
    id: "#8ff0ff",
    label: "Ciano",
    webos: "blue"
  }];
  var POSITIONS = [{
    id: "low",
    label: "Baixa",
    bottom: 56,
    webos: -3
  }, {
    id: "mid",
    label: "Média",
    bottom: 120,
    webos: 0
  }, {
    id: "high",
    label: "Alta",
    bottom: 200,
    webos: 2
  }];
  var SIZES = [70, 85, 100, 115, 130, 150];
  var BASE_PX = 64;
  var SHADOWS = {
    kai: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 2px 2px 3px rgba(0,0,0,0.9)",
    outline: "-3px -3px 0 #000, 0 -3px 0 #000, 3px -3px 0 #000, 3px 0 0 #000, 3px 3px 0 #000, 0 3px 0 #000, -3px 3px 0 #000, -3px 0 0 #000, 0 0 8px rgba(0,0,0,0.8)",
    shadow: "3px 3px 6px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.6)",
    box: "none"
  };
  function find(list2, id) {
    return list2.find(function (x) {
      return x.id === id;
    }) || list2[0];
  }
  function apply(el, s) {
    var font = find(FONTS, s.subtitleFont);
    var pos = find(POSITIONS, s.subtitlePosition);
    el.style.fontFamily = font.css;
    el.style.fontSize = Math.round(BASE_PX * ((s.subtitleSize || 100) / 100)) + "px";
    el.style.fontWeight = s.subtitleBold === false ? "500" : "700";
    el.style.color = s.subtitleColor || "#ffffff";
    el.style.textShadow = SHADOWS[s.subtitleStyle] || SHADOWS.kai;
    el.style.bottom = pos.bottom + "px";
    el.classList.toggle("box", s.subtitleStyle === "box");
  }
  function applyNative(mediaId, s) {
    if (!hasLuna() || !mediaId) return;
    var size = s.subtitleSize || 100;
    var fontSize = size <= 85 ? 0 : size <= 100 ? 1 : size <= 125 ? 2 : size <= 150 ? 3 : 4;
    var color = find(COLORS2, s.subtitleColor).webos;
    var box = s.subtitleStyle === "box";
    var calls = {
      setSubtitleCharacterColor: {
        charColor: color
      },
      setSubtitleFontSize: {
        fontSize: fontSize
      },
      setSubtitlePosition: {
        position: find(POSITIONS, s.subtitlePosition).webos
      },
      setSubtitleBackgroundColor: {
        bgColor: "black"
      },
      setSubtitleBackgroundOpacity: {
        bgOpacity: box ? 190 : 0
      },
      setSubtitleCharacterOpacity: {
        charOpacity: 255
      }
    };
    Object.keys(calls).forEach(function (m) {
      luna("luna://com.webos.media", m, Object.assign({
        mediaId: mediaId
      }, calls[m])).catch(function () {});
    });
  }
  function labels(s) {
    return {
      font: find(FONTS, s.subtitleFont).label,
      style: find(STYLES, s.subtitleStyle).label,
      color: find(COLORS2, s.subtitleColor).label,
      position: find(POSITIONS, s.subtitlePosition).label
    };
  }

  // src/js/api/skip.js
  var INTRODB = "https://api.introdb.app/segments";
  var ANISKIP = "https://api.aniskip.com/v2/skip-times/";
  var ANIMESKIP = "https://api.anime-skip.com/graphql";
  var ARM2 = "https://arm.haglund.dev/api/v2/";
  function getJSONWithProxy(url2) {
    return getJSONViaProxy(url2, {
      timeout: 1e4
    });
  }
  function animeSkipKey() {
    var s = settings();
    return s.animeSkip === false ? "" : (s.animeSkipClientId || "").trim();
  }
  function animeSkipQuery(query, key3) {
    var body = {
      query: query
    };
    var opts = {
      timeout: 1e4,
      quiet: true,
      headers: {
        "X-Client-ID": key3
      }
    };
    return postJSON(ANIMESKIP, body, opts).catch(function (e) {
      if (e.status && e.status !== 0) throw e;
      return postJSON(fetchUrl(ANIMESKIP), body, opts);
    });
  }
  function fromAnimeSkipTimestamps(list2, baseDuration) {
    var map = {
      intro: "intro",
      "new intro": "intro",
      "mixed intro": "intro",
      recap: "recap",
      credits: "outro",
      "new credits": "outro",
      "mixed credits": "outro"
    };
    var sorted = (list2 || []).filter(function (x) {
      return isFinite(x.at) && x.at >= 0;
    }).sort(function (a, b) {
      return a.at - b.at;
    });
    var out = [];
    sorted.forEach(function (x, i) {
      var type = map[String(x.type && x.type.name || "").toLowerCase()];
      if (!type) return;
      var next = sorted[i + 1];
      var end = next && next.at > x.at ? next.at : null;
      if (end === null && type === "outro" && (!baseDuration || x.at >= baseDuration / 2)) end = 1e5;
      if (end !== null && end > x.at) out.push({
        type: type,
        start: x.at,
        end: end,
        source: "Anime-Skip"
      });
    });
    return out;
  }
  var showCache = {};
  function animeSkipSegments(anilist2, season, episode, key3) {
    if (!anilist2 || !episode) return Promise.resolve([]);
    var ck = String(anilist2);
    if (!showCache[ck]) showCache[ck] = animeSkipQuery('{ findShowsByExternalId(service: ANILIST, serviceId: "' + ck + '") { id } }', key3).then(function (r) {
      return (r && r.data && r.data.findShowsByExternalId || []).map(function (x) {
        return String(x.id);
      }).filter(function (x) {
        return /^[\w-]+$/.test(x);
      });
    }).catch(function (e) {
      delete showCache[ck];
      throw e;
    });
    return showCache[ck].then(function (ids2) {
      var chain = Promise.resolve([]);
      ids2.forEach(function (id) {
        chain = chain.then(function (found) {
          if (found.length) return found;
          return animeSkipQuery('{ findEpisodesByShowId(showId: "' + id + '") { season number baseDuration timestamps { at type { name } } } }', key3).then(function (r) {
            var eps = r && r.data && r.data.findEpisodesByShowId || [];
            var same = eps.filter(function (e) {
              return Number(e.number) === Number(episode);
            });
            var bySeason = season ? same.filter(function (e) {
              return Number(e.season) === Number(season);
            }) : same;
            var best = [];
            (bySeason.length ? bySeason : same).forEach(function (e) {
              var segs = fromAnimeSkipTimestamps(e.timestamps, e.baseDuration);
              if (segs.length > best.length) best = segs;
            });
            return best;
          });
        });
      });
      return chain;
    });
  }
  function fromIntroDb(data) {
    var out = [];
    var map = {
      intro: "intro",
      recap: "recap",
      outro: "outro"
    };
    Object.keys(map).forEach(function (k) {
      var s = data && data[k];
      if (s && isFinite(s.start_sec) && isFinite(s.end_sec) && s.end_sec > s.start_sec) out.push({
        type: map[k],
        start: s.start_sec,
        end: s.end_sec,
        source: "IntroDB"
      });
    });
    return out;
  }
  function fromAniSkip(data) {
    var map = {
      op: "intro",
      "mixed-op": "intro",
      recap: "recap",
      ed: "outro",
      "mixed-ed": "outro"
    };
    return (data && data.found && data.results || []).filter(function (r) {
      return map[r.skipType] && r.interval;
    }).map(function (r) {
      return {
        type: map[r.skipType],
        start: r.interval.startTime,
        end: r.interval.endTime,
        source: "AniSkip"
      };
    });
  }
  function parseAnimeId(videoId) {
    var m = String(videoId).match(/^(kitsu|mal|anilist):(\d+)(?::(\d+))?/);
    return m ? {
      source: m[1] === "mal" ? "myanimelist" : m[1],
      id: m[2],
      episode: m[3] ? parseInt(m[3], 10) : 1
    } : null;
  }
  var malCache = {};
  function idsFromAnime(a) {
    var key3 = a.source + ":" + a.id;
    if (!malCache[key3]) malCache[key3] = getJSON(ARM2 + "ids?source=" + a.source + "&id=" + a.id, {
      quiet: true
    }).then(function (r) {
      return {
        mal: a.source === "myanimelist" ? parseInt(a.id, 10) : r && r.myanimelist || null,
        anilist: a.source === "anilist" ? parseInt(a.id, 10) : r && r.anilist || null
      };
    }).catch(function () {
      return {
        mal: a.source === "myanimelist" ? parseInt(a.id, 10) : null,
        anilist: a.source === "anilist" ? parseInt(a.id, 10) : null
      };
    });
    return malCache[key3];
  }
  function idsFromImdb(imdb, season) {
    var key3 = imdb + ":" + season;
    if (!malCache[key3]) malCache[key3] = getJSON(ARM2 + "imdb?id=" + imdb, {
      quiet: true
    }).then(function (list2) {
      var arr = Array.isArray(list2) ? list2 : [];
      var hit = arr.find(function (x) {
        return (x.myanimelist || x.anilist) && (x["thetvdb-season"] === season || x["themoviedb-season"] === season);
      }) || (arr.length === 1 ? arr[0] : null);
      return {
        mal: hit && hit.myanimelist || null,
        anilist: hit && hit.anilist || null
      };
    }).catch(function () {
      return {
        mal: null,
        anilist: null
      };
    });
    return malCache[key3];
  }
  function isAnime(meta) {
    var g = (meta.genres || meta.genre || []).map(function (x) {
      return String(x).toLowerCase();
    });
    return /^(kitsu|mal|anilist):/.test(meta.id) || g.indexOf("anime") >= 0 || g.indexOf("animation") >= 0 && /japan/i.test(meta.country || "");
  }
  function getSegments(meta, video, durationSec) {
    var anime = parseAnimeId(video.id);
    var imdb = /^tt\d+/.test(meta.id) ? meta.id.match(/^tt\d+/)[0] : null;
    var season = video.season;
    var episode = video.episode;
    var intro = imdb ? getJSONWithProxy(INTRODB + "?imdb_id=" + imdb + (isFinite(season) && isFinite(episode) ? "&season=" + season + "&episode=" + episode : "")).then(fromIntroDb).catch(function () {
      return [];
    }) : Promise.resolve([]);
    return intro.then(function (segs) {
      if (segs.length) return segs;
      var idsPromise = null;
      var ep = episode;
      var seasonForSkip = null;
      if (anime) {
        idsPromise = idsFromAnime(anime);
        ep = anime.episode;
      } else if (imdb && isAnime(meta) && isFinite(episode)) {
        idsPromise = idsFromImdb(imdb, season || 1);
        seasonForSkip = season || 1;
      }
      if (!idsPromise || !ep) return [];
      return idsPromise.then(function (ids2) {
        var key3 = animeSkipKey();
        var fromAs = key3 && ids2.anilist ? animeSkipSegments(ids2.anilist, seasonForSkip, ep, key3).catch(function () {
          return [];
        }) : Promise.resolve([]);
        return fromAs.then(function (found) {
          if (found.length) return found;
          if (!ids2.mal) return [];
          var q2 = ["op", "ed", "recap", "mixed-op", "mixed-ed"].map(function (t2) {
            return "types%5B%5D=" + t2;
          }).join("&");
          return getJSONWithProxy(ANISKIP + ids2.mal + "/" + ep + "?" + q2 + "&episodeLength=" + Math.round(durationSec || 0)).then(fromAniSkip).catch(function () {
            return [];
          });
        });
      });
    }).then(function (segs) {
      if (segs.length) log.info("Pular: " + segs.map(function (s) {
        return s.type + " " + s.start.toFixed(0) + "-" + s.end.toFixed(0) + " (" + s.source + ")";
      }).join(", "));
      return segs;
    });
  }
  function selfTest() {
    var url2 = INTRODB + "?imdb_id=tt9140560&season=1&episode=1";
    var ok = function ok(r) {
      return !!(r && r.intro);
    };
    var tryOne = function tryOne(u) {
      return getJSON(u, {
        timeout: 8e3,
        quiet: true
      }).then(ok, function () {
        return false;
      });
    };
    return tryOne(url2).then(function (direct) {
      if (direct) return "direct";
      return tryOne(fetchUrl(url2)).then(function (viaTv) {
        if (viaTv) return "tv";
        var p = getJSONViaProxy(url2, {
          timeout: 8e3
        }).then(ok, function () {
          return false;
        });
        return p.then(function (viaPc) {
          return viaPc ? "pc" : "none";
        });
      });
    });
  }

  // src/js/lib/avvideo.js
  function available() {
    try {
      return !!(window.webapis && window.webapis.avplay && typeof window.webapis.avplay.open === "function");
    } catch (e) {
      return false;
    }
  }
  function create() {
    var AV = window.webapis.avplay;
    var node = h("object", {
      type: "application/avplayer"
    });
    node.className = "av-video";
    var listeners = {};
    var src = "";
    var opened = false;
    var prepared = false;
    var state = "NONE";
    var wantPlay = false;
    var curMs = 0;
    var durMs = NaN;
    var ended = false;
    var buffering = false;
    var error = null;
    var pendingSeekMs = null;
    var pendingAudio = null;
    var pendingText = null;
    var textOn = false;
    var subCb = null;
    var lastTimeEmit = 0;
    var generation = 0;
    function emit(type) {
      var list2 = (listeners[type] || []).slice();
      for (var i = 0; i < list2.length; i++) {
        try {
          list2[i].call(api, {
            type: type,
            target: api
          });
        } catch (e) {
          log.warn("avplay listener", type, e && e.message);
        }
      }
    }
    function readState() {
      try {
        state = AV.getState();
      } catch (e) {}
      return state;
    }
    function stopAndClose() {
      if (!opened) return;
      try {
        AV.stop();
      } catch (e) {}
      try {
        AV.close();
      } catch (e) {}
      opened = false;
      prepared = false;
      state = "NONE";
    }
    function setListener(gen) {
      var ok = function ok() {
        return gen === generation;
      };
      AV.setListener({
        onbufferingstart: function onbufferingstart() {
          if (!ok()) return;
          buffering = true;
          emit("waiting");
        },
        onbufferingprogress: function onbufferingprogress() {},
        onbufferingcomplete: function onbufferingcomplete() {
          if (!ok()) return;
          buffering = false;
          emit("canplay");
          if (readState() === "PLAYING") emit("playing");
        },
        oncurrentplaytime: function oncurrentplaytime(ms) {
          if (!ok()) return;
          if (typeof ms === "number" && isFinite(ms)) curMs = ms;
          var now = Date.now();
          if (now - lastTimeEmit >= 240) {
            lastTimeEmit = now;
            emit("timeupdate");
          }
        },
        onstreamcompleted: function onstreamcompleted() {
          if (!ok()) return;
          ended = true;
          try {
            AV.pause();
          } catch (e) {}
          readState();
          emit("pause");
          emit("ended");
        },
        onerror: function onerror(type) {
          if (!ok()) return;
          fail(String(type || "PLAYER_ERROR"));
        },
        onevent: function onevent() {},
        // Embedded subtitles: the player parses them (SRT, ASS...) and hands over the text to show.
        onsubtitlechange: function onsubtitlechange(duration, text) {
          if (!ok() || !textOn || !subCb) return;
          try {
            subCb({
              text: String(text || ""),
              duration: Number(duration) || 0
            });
          } catch (e) {
            log.warn("avplay subtitle", e && e.message);
          }
        },
        ondrmevent: function ondrmevent() {}
      });
    }
    function fail(msg) {
      log.warn("avplay error", msg);
      error = {
        code: 4,
        message: msg
      };
      emit("error");
    }
    function open(url2) {
      generation++;
      var gen = generation;
      stopAndClose();
      src = url2;
      ended = false;
      error = null;
      curMs = 0;
      durMs = NaN;
      pendingSeekMs = null;
      pendingAudio = null;
      pendingText = null;
      textOn = false;
      wantPlay = !!api.autoplay;
      if (!url2) {
        emit("emptied");
        return;
      }
      try {
        AV.open(url2);
        opened = true;
        setListener(gen);
        AV.setDisplayRect(0, 0, 1920, 1080);
        try {
          AV.setDisplayMethod("PLAYER_DISPLAY_MODE_LETTER_BOX");
        } catch (e) {}
      } catch (e) {
        setTimeout(function () {
          return gen === generation && fail("open: " + (e && e.message));
        }, 0);
        return;
      }
      emit("loadstart");
      buffering = true;
      emit("waiting");
      AV.prepareAsync(function () {
        if (gen !== generation) return;
        prepared = true;
        readState();
        try {
          durMs = AV.getDuration();
        } catch (e) {
          durMs = NaN;
        }
        emit("loadedmetadata");
        emit("loadeddata");
        buffering = false;
        emit("canplay");
        if (wantPlay) startPlayback();
      }, function (err) {
        if (gen !== generation) return;
        fail("prepare: " + (err && (err.name || err.message) ? err.name || err.message : err));
      });
    }
    function startPlayback() {
      if (!prepared) return;
      var go = function go() {
        try {
          AV.play();
        } catch (e) {
          fail("play: " + (e && e.message));
          return;
        }
        readState();
        emit("play");
        emit("playing");
        if (pendingAudio !== null) {
          var idx = pendingAudio;
          pendingAudio = null;
          setTimeout(function () {
            return applyAudio(idx);
          }, 300);
        }
        if (pendingText !== null) {
          var ti = pendingText;
          pendingText = null;
          setTimeout(function () {
            return applyText(ti);
          }, 500);
        }
      };
      if (pendingSeekMs !== null) {
        var ms = pendingSeekMs;
        pendingSeekMs = null;
        doSeek(ms, go);
      } else go();
    }
    function doSeek(ms, then) {
      emit("seeking");
      var done = function done() {
        curMs = ms;
        emit("seeked");
        emit("timeupdate");
        if (then) then();
      };
      try {
        AV.seekTo(Math.max(0, Math.floor(ms)), done, function (e) {
          log.warn("avplay seek", e && e.name);
          emit("seeked");
          if (then) then();
        });
      } catch (e) {
        log.warn("avplay seek threw", e && e.message);
        emit("seeked");
        if (then) then();
      }
    }
    function trackInfo(type) {
      var all2 = [];
      try {
        all2 = AV.getTotalTrackInfo() || [];
      } catch (e) {
        return [];
      }
      var out = [];
      for (var i = 0; i < all2.length; i++) {
        if (all2[i].type !== type) continue;
        var extra = {};
        try {
          extra = JSON.parse(all2[i].extra_info || "{}");
        } catch (e) {}
        out.push({
          index: all2[i].index,
          language: String(extra.language || extra.track_lang || "").trim(),
          channels: extra.channels ? Number(extra.channels) : 0,
          codec: extra.fourCC || ""
        });
      }
      return out;
    }
    function currentIndex(type) {
      try {
        var cur = AV.getCurrentStreamInfo() || [];
        for (var i = 0; i < cur.length; i++) if (cur[i].type === type) return cur[i].index;
      } catch (e) {}
      return null;
    }
    function applyAudio(avIndex) {
      try {
        AV.setSelectTrack("AUDIO", avIndex);
        log.info("avplay audio ->", avIndex);
        if (readState() === "PLAYING") {
          var back2 = Math.max(0, curMs - 800);
          setTimeout(function () {
            if (readState() === "PLAYING") doSeek(back2);
          }, 250);
        }
        return true;
      } catch (e) {
        log.warn("avplay setSelectTrack", e && (e.name || e.message));
        return false;
      }
    }
    function applyText(avIndex) {
      try {
        AV.setSilentSubtitle(true);
        AV.setSelectTrack("TEXT", avIndex);
        log.info("avplay text ->", avIndex);
        return true;
      } catch (e) {
        log.warn("avplay text track", e && (e.name || e.message));
        return false;
      }
    }
    var api = {
      node: node,
      isAVPlay: true,
      mediaId: "",
      preload: "auto",
      autoplay: false,
      addEventListener: function addEventListener(type, fn) {
        (listeners[type] = listeners[type] || []).push(fn);
      },
      removeEventListener: function removeEventListener(type, fn) {
        var l = listeners[type];
        if (l) listeners[type] = l.filter(function (x) {
          return x !== fn;
        });
      },
      play: function play() {
        wantPlay = true;
        if (!prepared) return Promise.resolve();
        if (ended) {
          ended = false;
          pendingSeekMs = 0;
        }
        if (readState() === "PAUSED") {
          try {
            AV.play();
          } catch (e) {}
          readState();
          emit("play");
          emit("playing");
          if (pendingAudio !== null) {
            var idx = pendingAudio;
            pendingAudio = null;
            setTimeout(function () {
              return applyAudio(idx);
            }, 300);
          }
          if (pendingText !== null) {
            var ti = pendingText;
            pendingText = null;
            setTimeout(function () {
              return applyText(ti);
            }, 500);
          }
        } else if (state === "READY") startPlayback();
        return Promise.resolve();
      },
      pause: function pause() {
        wantPlay = false;
        if (readState() === "PLAYING") {
          try {
            AV.pause();
          } catch (e) {}
          readState();
          emit("pause");
        }
      },
      load: function load() {
        if (!src) stopAndClose();
      },
      removeAttribute: function removeAttribute(name) {
        if (name === "src") {
          wantPlay = false;
          generation++;
          stopAndClose();
          src = "";
        }
      },
      // Audio: list in file order, the playing one marked.
      audioTrackList: function audioTrackList() {
        var list2 = trackInfo("AUDIO");
        var cur = pendingAudio !== null ? pendingAudio : currentIndex("AUDIO");
        return list2.map(function (tr, i) {
          return {
            language: tr.language,
            label: "",
            channels: tr.channels,
            codec: tr.codec,
            enabled: cur === null ? i === 0 : tr.index === cur
          };
        });
      },
      // position = place in audioTrackList()
      selectAudio: function selectAudio(position) {
        var list2 = trackInfo("AUDIO");
        var tr = list2[position];
        if (!tr) return false;
        if (readState() !== "PLAYING") {
          pendingAudio = tr.index;
          return true;
        }
        return applyAudio(tr.index);
      },
      // Embedded subtitle tracks, in file order.
      textTrackList: function textTrackList() {
        return trackInfo("TEXT").map(function (tr) {
          return {
            language: tr.language,
            index: tr.index
          };
        });
      },
      // position = place in textTrackList()
      selectText: function selectText(position) {
        var tr = trackInfo("TEXT")[position];
        if (!tr) return false;
        textOn = true;
        if (readState() !== "PLAYING") {
          pendingText = tr.index;
          return true;
        }
        return applyText(tr.index);
      },
      disableText: function disableText() {
        textOn = false;
        pendingText = null;
      },
      onSubtitle: function onSubtitle(fn) {
        subCb = fn;
      },
      destroy: function destroy() {
        wantPlay = false;
        generation++;
        stopAndClose();
        Object.keys(listeners).forEach(function (k) {
          return delete listeners[k];
        });
      }
    };
    Object.defineProperty(api, "src", {
      get: function get() {
        return src;
      },
      set: function set(v) {
        return open(String(v || ""));
      }
    });
    Object.defineProperty(api, "currentSrc", {
      get: function get() {
        return src;
      }
    });
    Object.defineProperty(api, "currentTime", {
      get: function get() {
        return curMs / 1e3;
      },
      set: function set(sec) {
        var ms = Math.max(0, Number(sec) * 1e3 || 0);
        ended = false;
        var st = readState();
        if (!prepared || st === "READY") {
          pendingSeekMs = ms;
          curMs = ms;
          return;
        }
        curMs = ms;
        doSeek(ms);
      }
    });
    Object.defineProperty(api, "duration", {
      get: function get() {
        return durMs > 0 ? durMs / 1e3 : NaN;
      }
    });
    Object.defineProperty(api, "paused", {
      get: function get() {
        return readState() !== "PLAYING";
      }
    });
    Object.defineProperty(api, "ended", {
      get: function get() {
        return ended;
      }
    });
    Object.defineProperty(api, "error", {
      get: function get() {
        return error;
      }
    });
    Object.defineProperty(api, "readyState", {
      get: function get() {
        return prepared ? buffering ? 2 : 4 : 0;
      }
    });
    Object.defineProperty(api, "networkState", {
      get: function get() {
        return opened ? 2 : 0;
      }
    });
    Object.defineProperty(api, "buffered", {
      // AVPlay doesn't report buffered ranges; the seek bar just shows no buffer line.
      get: function get() {
        return {
          length: 0,
          start: function start() {
            return 0;
          },
          end: function end() {
            return 0;
          }
        };
      }
    });
    Object.defineProperty(api, "audioTracks", {
      get: function get() {
        return null;
      }
    });
    return api;
  }

  // src/js/api/tracker.js
  var TRAKT_API = "https://api.trakt.tv";
  var SIMKL_API = "https://api.simkl.com";
  var SYNC_EVERY = 30 * 60 * 1e3;
  var PROVIDERS2 = ["trakt", "simkl"];
  var BUILT = {
    // The app's own Trakt Client ID (approved by the owner). Apps on Trakt's new developer site sign
    // users in with device codes/PKCE and have no secret: the Client ID is public by design and can't
    // be turned into tokens without the user approving on trakt.tv. So linking is "scan and sign in".
    traktId: "U3R0Jew72DahpIxoxD5sl9jw7J6sGMaWLrdji9xTark",
    traktSecret: true ? "" : "",
    simklId: true ? "" : ""
  };
  function withSecret(body, k) {
    if (k.traktSecret) body.client_secret = k.traktSecret;
    return body;
  }
  function keys() {
    var s = settings();
    return {
      // Own keys typed in Settings win; otherwise the app's own keys from the build (GitHub secrets).
      traktId: (s.traktClientId || "").trim() || BUILT.traktId,
      traktSecret: (s.traktClientId || "").trim() ? (s.traktClientSecret || "").trim() : BUILT.traktSecret,
      simklId: (s.simklClientId || "").trim() || BUILT.simklId
    };
  }
  function hasBuiltInKeys(provider) {
    return provider === "trakt" ? !!BUILT.traktId : !!BUILT.simklId;
  }
  function hasKeys(provider) {
    var k = keys();
    return provider === "trakt" ? !!k.traktId : !!k.simklId;
  }
  function account(provider) {
    return get("track." + provider, null);
  }
  function saveAccount(provider, acc) {
    set("track." + provider, acc);
  }
  function isConnected(provider) {
    var a = account(provider);
    return !!(a && a.token && !a.invalid);
  }
  function needsReconnect(provider) {
    var a = account(provider);
    return !!(a && a.invalid);
  }
  function useFor(key3, p) {
    var v = settings()[key3];
    return v !== "trakt" && v !== "simkl" ? true : v === p;
  }
  function connected() {
    return PROVIDERS2.filter(isConnected);
  }
  function disconnect2(provider) {
    var a = account(provider);
    saveAccount(provider, null);
    if (provider === "trakt" && a && a.token && hasKeys("trakt")) {
      var k = keys();
      request("POST", TRAKT_API + "/oauth/revoke", withSecret({
        token: a.token,
        client_id: k.traktId
      }, k), {
        quiet: true
      }).catch(function () {});
    }
  }
  function traktHeaders(token) {
    var hd = {
      "trakt-api-version": "2",
      "trakt-api-key": keys().traktId
    };
    if (token) hd.Authorization = "Bearer " + token;
    return hd;
  }
  function simklHeaders(token) {
    var hd = {
      "simkl-api-key": keys().simklId
    };
    if (token) hd.Authorization = "Bearer " + token;
    return hd;
  }
  var refreshing = null;
  function traktRefresh() {
    var a = account("trakt");
    if (!a || !a.refresh) return Promise.reject(new Error("no refresh token"));
    if (refreshing) return refreshing;
    var k = keys();
    refreshing = request("POST", TRAKT_API + "/oauth/token", withSecret({
      refresh_token: a.refresh,
      client_id: k.traktId,
      redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
      grant_type: "refresh_token"
    }, k), {
      headers: traktHeaders(),
      quiet: true
    }).then(function (r) {
      saveAccount("trakt", Object.assign({}, a, tokenFields(r), {
        invalid: false
      }));
      return r.access_token;
    }).catch(function (e) {
      if (e.status === 400 || e.status === 401) saveAccount("trakt", Object.assign({}, a, {
        invalid: true
      }));
      throw e;
    }).then(function (v) {
      refreshing = null;
      return v;
    }, function (e) {
      refreshing = null;
      throw e;
    });
    return refreshing;
  }
  function tokenFields(r) {
    return {
      token: r.access_token,
      refresh: r.refresh_token || null,
      expires: r.expires_in ? Date.now() + r.expires_in * 1e3 : 0
    };
  }
  function trakt(method, path, body) {
    var a = account("trakt");
    if (!a || !a.token) return Promise.reject(new Error("Trakt not connected"));
    var go = function go(token) {
      return request(method, TRAKT_API + path, body, {
        headers: traktHeaders(token),
        quiet: true,
        timeout: 15e3
      });
    };
    var fresh = a.expires && a.expires - Date.now() < 36e5 ? traktRefresh().catch(function () {
      return a.token;
    }) : Promise.resolve(a.token);
    return fresh.then(function (token) {
      return go(token).catch(function (e) {
        if (e.status !== 401) throw e;
        return traktRefresh().then(go);
      });
    });
  }
  function simkl(method, path, body) {
    var a = account("simkl");
    if (!a || !a.token) return Promise.reject(new Error("Simkl not connected"));
    return request(method, SIMKL_API + path, body, {
      headers: simklHeaders(a.token),
      quiet: true,
      timeout: 15e3
    }).catch(function (e) {
      if (e.status === 401) saveAccount("simkl", Object.assign({}, a, {
        invalid: true
      }));
      throw e;
    });
  }
  function startLink(provider, onDone, onFail) {
    var stopped = false;
    var timer = null;
    var k = keys();
    var finish = function finish(fn, v) {
      if (stopped) return;
      stopped = true;
      clearTimeout(timer);
      fn(v);
    };
    var begin = provider === "trakt" ? request("POST", TRAKT_API + "/oauth/device/code", {
      client_id: k.traktId
    }, {
      headers: traktHeaders(),
      quiet: true
    }).then(function (r) {
      return {
        code: r.user_code,
        url: r.verification_url || "https://trakt.tv/activate",
        device: r.device_code,
        interval: (r.interval || 5) * 1e3,
        expires: Date.now() + (r.expires_in || 600) * 1e3
      };
    }) : request("GET", SIMKL_API + "/oauth/pin?client_id=" + encodeURIComponent(k.simklId), null, {
      quiet: true
    }).then(function (r) {
      return {
        code: r.user_code,
        url: r.verification_url || "https://simkl.com/pin",
        device: r.device_code,
        interval: (r.interval || 5) * 1e3,
        expires: Date.now() + (r.expires_in || 900) * 1e3
      };
    });
    var _poll2 = function poll2(info2) {
      if (stopped) return;
      if (Date.now() > info2.expires) return finish(onFail, "expired");
      timer = setTimeout(function () {
        var check3 = provider === "trakt" ? request("POST", TRAKT_API + "/oauth/device/token", withSecret({
          code: info2.device,
          client_id: k.traktId
        }, k), {
          headers: traktHeaders(),
          quiet: true
        }) : request("GET", SIMKL_API + "/oauth/pin/" + encodeURIComponent(info2.code) + "?client_id=" + encodeURIComponent(k.simklId), null, {
          quiet: true
        });
        check3.then(function (r) {
          if (stopped) return;
          var token = r && r.access_token;
          if (!token) return _poll2(info2);
          saveAccount(provider, Object.assign({
            provider: provider
          }, tokenFields(r)));
          return whoAmI(provider).catch(function () {
            return "";
          }).then(function (name) {
            var acc = account(provider);
            if (acc) saveAccount(provider, Object.assign({}, acc, {
              user: name
            }));
            finish(onDone, name);
            syncNow();
          });
        }).catch(function (e) {
          if (e.status === 400 || e.status === 429 || e.status === 0) return _poll2(e.status === 429 ? Object.assign({}, info2, {
            interval: info2.interval + 1e3
          }) : info2);
          finish(onFail, e.status === 418 ? "denied" : e.status === 410 ? "expired" : e.message);
        });
      }, info2.interval);
    };
    var handle2 = {
      code: "",
      url: "",
      cancel: function cancel() {
        return finish(function () {});
      }
    };
    handle2.ready = begin.then(function (info2) {
      handle2.code = info2.code;
      handle2.url = info2.url;
      _poll2(info2);
      return handle2;
    });
    handle2.ready.catch(function (e) {
      return finish(onFail, e.message);
    });
    return handle2;
  }
  function whoAmI(provider) {
    if (provider === "trakt") return trakt("GET", "/users/settings").then(function (r) {
      return r && r.user && (r.user.name || r.user.username) || "";
    });
    return simkl("POST", "/users/settings", {}).then(function (r) {
      return r && r.user && r.user.name || "";
    });
  }
  function ids(metaId) {
    var id = String(metaId || "");
    if (/^tt\d+$/.test(id)) return {
      imdb: id
    };
    var m = /^tmdb:(\d+)$/.exec(id);
    if (m) return {
      tmdb: Number(m[1])
    };
    return null;
  }
  function item(meta, video) {
    var i = ids(meta && meta.id);
    if (!i) return null;
    if (meta.type === "series") {
      if (!video || !(video.season > 0) || !(video.episode > 0)) return null;
      return {
        show: {
          ids: i,
          title: meta.name || void 0
        },
        episode: {
          season: Number(video.season),
          number: Number(video.episode)
        }
      };
    }
    return {
      movie: {
        ids: i,
        title: meta.name || void 0
      }
    };
  }
  var playing = null;
  function scrobble(action, progress2) {
    if (!playing) return;
    var body = Object.assign({}, playing.body, {
      progress: Math.max(0, Math.min(100, Math.round(progress2 * 1e4) / 100))
    });
    connected().filter(function (p) {
      return useFor("progressSource", p);
    }).forEach(function (p) {
      var call4 = p === "trakt" ? trakt("POST", "/scrobble/" + action, body) : simkl("POST", "/scrobble/" + action, body);
      call4.then(function () {
        return log.info("tracker", p, action, body.progress);
      }).catch(function (e) {
        if (e.status !== 409) log.warn("tracker", p, action, e.message);
      });
    });
    playing.lastAction = action;
    playing.lastAt = Date.now();
  }
  function onPlay(meta, video, fraction) {
    if (!connected().length) return;
    var body = item(meta, video);
    if (!body) {
      playing = null;
      return;
    }
    var key3 = JSON.stringify(body);
    if (playing && playing.key !== key3 && playing.lastAction !== "stop") scrobble("pause", playing.progress || 0);
    if (!playing || playing.key !== key3) playing = {
      key: key3,
      body: body,
      progress: fraction
    };
    playing.progress = fraction;
    if (playing.lastAction === "start") return;
    scrobble("start", fraction);
  }
  function onPause(fraction) {
    if (!playing || playing.lastAction === "stop") return;
    playing.progress = fraction;
    if (playing.lastAction === "pause") return;
    scrobble("pause", fraction);
  }
  function onProgress(fraction) {
    if (playing) playing.progress = fraction;
  }
  function onStop(fraction) {
    if (!playing || playing.lastAction === "stop") return;
    playing.progress = fraction;
    scrobble(fraction >= 0.8 ? "stop" : "pause", fraction);
    if (fraction >= 0.8) playing.lastAction = "stop";
  }
  function stop() {
    if (playing && playing.lastAction === "start") onStop(playing.progress || 0);
    playing = null;
  }
  var syncing = null;
  var lastSync = 0;
  function syncNow() {
    if (syncing) return syncing;
    var tasks = [];
    if (isConnected("trakt") && useFor("librarySource", "trakt")) tasks.push(pullTraktWatched(), pullTraktPlayback());
    if (isConnected("simkl") && useFor("librarySource", "simkl")) tasks.push(pullSimklWatched());
    if (!tasks.length) return Promise.resolve(false);
    lastSync = Date.now();
    syncing = Promise.all(tasks.map(function (p) {
      return p.catch(function (e) {
        return log.warn("tracker sync", e.message);
      });
    })).then(function () {
      return true;
    }).then(function (v) {
      syncing = null;
      return v;
    }, function () {
      syncing = null;
      return false;
    });
    return syncing;
  }
  function maybeSync() {
    if (Date.now() - lastSync < SYNC_EVERY) return Promise.resolve(false);
    return syncNow();
  }
  function pullTraktWatched() {
    return Promise.all([trakt("GET", "/sync/watched/movies"), trakt("GET", "/sync/watched/shows")]).then(function (res) {
      var ids2 = [];
      (res[0] || []).forEach(function (m) {
        return m.movie && m.movie.ids && m.movie.ids.imdb && ids2.push(m.movie.ids.imdb);
      });
      (res[1] || []).forEach(function (s) {
        var imdb = s.show && s.show.ids && s.show.ids.imdb;
        if (!imdb) return;
        (s.seasons || []).forEach(function (se) {
          return (se.episodes || []).forEach(function (ep) {
            return ids2.push(imdb + ":" + se.number + ":" + ep.number);
          });
        });
      });
      markWatchedMany(ids2);
    });
  }
  function pullSimklWatched() {
    return simkl("GET", "/sync/all-items/?extended=full").then(function (r) {
      if (!r) return;
      var ids2 = [];
      (r.movies || []).forEach(function (m) {
        var imdb = m.movie && m.movie.ids && m.movie.ids.imdb;
        if (imdb && m.status === "completed") ids2.push(imdb);
      });
      (r.shows || []).concat(r.anime || []).forEach(function (s) {
        var imdb = s.show && s.show.ids && s.show.ids.imdb;
        if (!imdb) return;
        (s.seasons || []).forEach(function (se) {
          return (se.episodes || []).forEach(function (ep) {
            return ids2.push(imdb + ":" + se.number + ":" + ep.number);
          });
        });
      });
      markWatchedMany(ids2);
    });
  }
  var playbackSink = null;
  function onPlayback(fn) {
    playbackSink = fn;
  }
  function pullTraktPlayback() {
    return trakt("GET", "/sync/playback?extended=full").then(function (list2) {
      var out = [];
      (list2 || []).forEach(function (p) {
        var at = p.paused_at;
        var pct = Number(p.progress) || 0;
        if (pct < 1 || pct > 95) return;
        if (p.type === "movie" && p.movie && p.movie.ids && p.movie.ids.imdb) {
          out.push({
            type: "movie",
            id: p.movie.ids.imdb,
            videoId: p.movie.ids.imdb,
            name: p.movie.title,
            runtime: p.movie.runtime || 0,
            progress: pct / 100,
            at: at
          });
        } else if (p.type === "episode" && p.show && p.show.ids && p.show.ids.imdb && p.episode) {
          out.push({
            type: "series",
            id: p.show.ids.imdb,
            videoId: p.show.ids.imdb + ":" + p.episode.season + ":" + p.episode.number,
            name: p.show.title,
            runtime: p.episode.runtime || p.show && p.show.runtime || 0,
            progress: pct / 100,
            at: at
          });
        }
      });
      if (playbackSink && out.length) playbackSink(out);
    });
  }
  function watchlistEntry() {
    if (!isConnected("trakt") || settings().traktWatchlistRow === false) return null;
    return {
      addon: {
        transportUrl: "trakt",
        manifest: {
          id: "trakt",
          name: "Trakt"
        }
      },
      catalog: {
        id: "watchlist",
        name: t("Minha lista do Trakt"),
        type: "movie"
      },
      fetch: function fetch() {
        return trakt("GET", "/sync/watchlist?sort=added,desc").then(function (list2) {
          return (list2 || []).map(function (x) {
            var m = x.movie || x.show;
            var imdb = m && m.ids && m.ids.imdb;
            return imdb ? {
              id: imdb,
              type: x.movie ? "movie" : "series",
              name: m.title,
              poster: "https://images.metahub.space/poster/medium/" + imdb + "/img"
            } : null;
          }).filter(Boolean).slice(0, 40);
        });
      }
    };
  }
  function traktPublic(path) {
    return request("GET", TRAKT_API + path, null, {
      headers: traktHeaders(),
      quiet: true,
      timeout: 15e3
    });
  }

  // src/js/lib/chapters.js
  var HEAD_BYTES = 256 * 1024;
  var MAX_CHAPTERS_BYTES = 1024 * 1024;
  var ID = {
    EBML: 440786851,
    SEGMENT: 408125543,
    SEEK_HEAD: 290298740,
    SEEK: 19899,
    SEEK_ID: 21419,
    SEEK_POS: 21420,
    CHAPTERS: 272869232,
    EDITION: 17849,
    EDITION_HIDDEN: 17853,
    EDITION_DEFAULT: 17883,
    ATOM: 182,
    TIME_START: 145,
    ATOM_HIDDEN: 152,
    ATOM_ENABLED: 17816,
    DISPLAY: 128,
    STRING: 133,
    CLUSTER: 524531317
  };
  function vint(b, pos, keepMarker) {
    if (pos >= b.length) return null;
    var first = b[pos];
    var len = 1;
    var mask = 128;
    while (len <= 8 && !(first & mask)) {
      len++;
      mask >>= 1;
    }
    if (len > 8 || pos + len > b.length) return null;
    var value = keepMarker ? first : first & mask - 1;
    var allOnes = value === mask - 1;
    for (var i = 1; i < len; i++) {
      value = value * 256 + b[pos + i];
      if (b[pos + i] !== 255) allOnes = false;
    }
    return {
      value: value,
      len: len,
      unknown: !keepMarker && allOnes
    };
  }
  function element(b, pos) {
    var id = vint(b, pos, true);
    if (!id || id.len > 4) return null;
    var size = vint(b, pos + id.len, false);
    if (!size) return null;
    var start3 = pos + id.len + size.len;
    return {
      id: id.value,
      start: start3,
      end: size.unknown ? Infinity : start3 + size.value,
      pos: pos
    };
  }
  function kids(b, parent) {
    var out = [];
    var end = Math.min(parent.end, b.length);
    var pos = parent.start;
    while (pos < end) {
      var e = element(b, pos);
      if (!e || e.end > end || e.end <= pos) break;
      out.push(e);
      pos = e.end;
    }
    return out;
  }
  function uint(b, e) {
    var v = 0;
    for (var i = e.start; i < e.end && i < b.length; i++) v = v * 256 + b[i];
    return v;
  }
  function utf8(b, e) {
    var s = "";
    for (var i = e.start; i < e.end && i < b.length; i++) s += "%" + ("0" + b[i].toString(16)).slice(-2);
    try {
      return decodeURIComponent(s).replace(/\0+$/, "").trim();
    } catch (x) {
      return "";
    }
  }
  function flag(b, parent, id, dflt) {
    var e = kids(b, parent).find(function (x) {
      return x.id === id;
    });
    return e ? uint(b, e) !== 0 : dflt;
  }
  function parse2(b) {
    var root2 = element(b, 0);
    if (!root2 || root2.id !== ID.CHAPTERS) return [];
    var editions = kids(b, root2).filter(function (e) {
      return e.id === ID.EDITION && !flag(b, e, ID.EDITION_HIDDEN, false);
    });
    var ed = editions.find(function (e) {
      return flag(b, e, ID.EDITION_DEFAULT, false);
    }) || editions[0];
    if (!ed) return [];
    return kids(b, ed).filter(function (e) {
      return e.id === ID.ATOM && !flag(b, e, ID.ATOM_HIDDEN, false) && flag(b, e, ID.ATOM_ENABLED, true);
    }).map(function (atom) {
      var parts = kids(b, atom);
      var st = parts.find(function (x) {
        return x.id === ID.TIME_START;
      });
      if (!st) return null;
      var disp = parts.find(function (x) {
        return x.id === ID.DISPLAY;
      });
      var str = disp && kids(b, disp).find(function (x) {
        return x.id === ID.STRING;
      });
      return {
        start: uint(b, st) / 1e9,
        title: str ? utf8(b, str) : ""
      };
    }).filter(Boolean).sort(function (x, y) {
      return x.start - y.start;
    });
  }
  function range(url2, start3, length) {
    return new Promise(function (resolve2) {
      var xhr2 = new XMLHttpRequest();
      xhr2.open("GET", url2, true);
      xhr2.responseType = "arraybuffer";
      xhr2.timeout = 8e3;
      xhr2.setRequestHeader("Range", "bytes=" + start3 + "-" + (start3 + length - 1));
      xhr2.onload = function () {
        var ok = xhr2.status === 206 || xhr2.status === 200 && start3 === 0;
        if (!ok || !xhr2.response) return resolve2(null);
        var b = new Uint8Array(xhr2.response);
        if (b.length > length) b = b.subarray(0, length);
        resolve2(b);
      };
      xhr2.onerror = xhr2.ontimeout = function () {
        return resolve2(null);
      };
      xhr2.send();
    });
  }
  function elementAt(url2, head, pos, max) {
    var fromHead = pos < head.length ? element(head, pos) : null;
    var probe = fromHead ? Promise.resolve({
      b: head,
      e: fromHead
    }) : range(url2, pos, 64).then(function (b) {
      return b ? {
        b: b,
        e: element(b, 0)
      } : null;
    });
    return probe.then(function (p) {
      if (!p || !p.e || p.e.end === Infinity) return null;
      var total = p.e.end - p.e.pos;
      if (total <= 0 || total > max) return null;
      if (pos + total <= head.length) return head.subarray(pos, pos + total);
      return range(url2, pos, total).then(function (b) {
        return b && b.length === total ? b : null;
      });
    });
  }
  function load4(url2) {
    if (!/^https?:\/\//i.test(String(url2 || "")) || typeof Uint8Array === "undefined") return Promise.resolve([]);
    return range(url2, 0, HEAD_BYTES).then(function (head) {
      if (!head) return [];
      var ebml = element(head, 0);
      if (!ebml || ebml.id !== ID.EBML) return [];
      var seg = element(head, ebml.end);
      if (!seg || seg.id !== ID.SEGMENT) return [];
      var pos = seg.start;
      var seekHead = null;
      var chaptersPos = null;
      while (pos < head.length) {
        var e = element(head, pos);
        if (!e || e.end <= pos) break;
        if (e.id === ID.SEEK_HEAD && seekHead === null) seekHead = pos;
        if (e.id === ID.CHAPTERS) {
          chaptersPos = pos;
          break;
        }
        if (e.id === ID.CLUSTER || e.end === Infinity) break;
        pos = e.end;
      }
      var findPos = chaptersPos !== null || seekHead === null ? Promise.resolve(chaptersPos) : elementAt(url2, head, seekHead, HEAD_BYTES).then(function (sh) {
        if (!sh) return null;
        var root2 = element(sh, 0);
        var rel = null;
        kids(sh, root2).filter(function (x) {
          return x.id === ID.SEEK;
        }).forEach(function (s) {
          var id = null;
          var p = null;
          kids(sh, s).forEach(function (c) {
            if (c.id === ID.SEEK_ID) id = uint(sh, c);else if (c.id === ID.SEEK_POS) p = uint(sh, c);
          });
          if (id === ID.CHAPTERS && p !== null && rel === null) rel = p;
        });
        return rel === null ? null : seg.start + rel;
      });
      return findPos.then(function (cp) {
        return cp === null ? [] : elementAt(url2, head, cp, MAX_CHAPTERS_BYTES).then(function (b) {
          return b ? parse2(b) : [];
        });
      });
    }).catch(function () {
      return [];
    });
  }

  // src/js/api/subdl.js
  var API2 = "https://api.subdl.com/api/v1/subtitles";
  var DL = "https://dl.subdl.com";
  var LANGS = {
    AR: "ara",
    EN: "eng",
    FR: "fre",
    ES: "spa",
    TR: "tur",
    FA: "per",
    UR: "urd"
  };
  function key() {
    return (settings().subdlKey || "").trim();
  }
  function prefLangs() {
    var map = {
      ara: "AR",
      ar: "AR",
      eng: "EN",
      en: "EN",
      spa: "ES",
      es: "ES",
      fre: "FR",
      fr: "FR",
      tur: "TR",
      tr: "TR"
    };
    var out = [];
    (settings().subtitleLangs || []).forEach(function (l) {
      var c = map[String(l).toLowerCase()];
      if (c && out.indexOf(c) < 0) out.push(c);
    });
    if (out.indexOf("AR") < 0) out.unshift("AR");
    return out.join(",");
  }
  function search(type, videoId) {
    var k = key();
    var m = String(videoId || "").match(/^(tt\d+)(?::(\d+):(\d+))?$/);
    if (!k || !m) return Promise.resolve([]);
    var params = ["api_key=" + encodeURIComponent(k), "imdb_id=" + m[1], "type=" + (type === "series" ? "tv" : "movie"), "languages=" + prefLangs(), "subs_per_page=30"];
    if (m[2]) params.push("season_number=" + m[2], "episode_number=" + m[3]);
    var ep = m[2] ? "S" + ("0" + m[2]).slice(-2) + "E" + ("0" + m[3]).slice(-2) : "";
    return getJSONViaProxy(API2 + "?" + params.join("&"), {
      timeout: 12e3
    }).then(function (r) {
      return (r && r.subtitles || []).filter(function (s) {
        return s && s.url;
      }).map(function (s, i) {
        return {
          id: "subdl-" + i + "-" + s.url,
          lang: LANGS[String(s.language || s.lang || "").toUpperCase()] || String(s.lang || s.language || "").toLowerCase(),
          url: "http://127.0.0.1:" + PORT + "/api/subzip?url=" + encodeURIComponent(DL + s.url) + (ep ? "&ep=" + ep : ""),
          addon: "SubDL" + (s.release_name ? " · " + s.release_name : "")
        };
      });
    }).catch(function () {
      return [];
    });
  }

  // src/js/views/player.js
  var HIDE_MS = 5e3;
  var SAVE_MS = 15e3;
  var LANG_NAMES = {
    por: "Português",
    pob: "Português (BR)",
    pt: "Português",
    "pt-br": "Português (BR)",
    eng: "Inglês",
    en: "Inglês",
    spa: "Espanhol",
    es: "Espanhol",
    jpn: "Japonês",
    ja: "Japonês",
    fre: "Francês",
    fra: "Francês",
    fr: "Francês",
    ger: "Alemão",
    deu: "Alemão",
    de: "Alemão",
    ita: "Italiano",
    it: "Italiano",
    kor: "Coreano",
    ko: "Coreano",
    chi: "Chinês",
    zho: "Chinês",
    rus: "Russo",
    ara: "Árabe",
    hin: "Hindi",
    und: "Indefinido"
  };
  var LANG2 = {
    eng: "en",
    english: "en",
    ara: "ar",
    arabic: "ar",
    rus: "ru",
    russian: "ru",
    jpn: "ja",
    japanese: "ja",
    spa: "es",
    spanish: "es",
    fre: "fr",
    fra: "fr",
    french: "fr",
    ger: "de",
    deu: "de",
    german: "de",
    ita: "it",
    italian: "it",
    por: "pt",
    pob: "pt",
    portuguese: "pt",
    tur: "tr",
    turkish: "tr",
    hin: "hi",
    hindi: "hi",
    kor: "ko",
    korean: "ko",
    chi: "zh",
    zho: "zh",
    chinese: "zh",
    per: "fa",
    fas: "fa",
    persian: "fa",
    urd: "ur",
    urdu: "ur",
    heb: "he",
    hebrew: "he",
    ind: "id",
    indonesian: "id",
    may: "ms",
    msa: "ms",
    malay: "ms",
    tha: "th",
    thai: "th",
    ukr: "uk",
    ukrainian: "uk",
    pol: "pl",
    polish: "pl",
    dut: "nl",
    nld: "nl",
    dutch: "nl",
    gre: "el",
    ell: "el",
    greek: "el",
    swe: "sv",
    swedish: "sv"
  };
  function lang2(x) {
    var v = String(x || "").toLowerCase().trim().split(/[-_ (]/)[0];
    return LANG2[v] || v;
  }
  function langName(code) {
    if (!code) return t("Desconhecido");
    var name = LANG_NAMES[String(code).toLowerCase()];
    return name ? t(name) : code;
  }
  function openPlayer(opts) {
    push(PlayerView(opts));
  }
  function PlayerView(opts) {
    var meta = opts.meta;
    var video = opts.video;
    var stream = opts.stream;
    var settings2 = settings();
    var useAV = settings2.playerEngine !== "html5" && available();
    var videoEl = useAV ? create() : h("video", {
      preload: "auto"
    });
    var videoNode = useAV ? videoEl.node : videoEl;
    if (useAV) document.documentElement.classList.add("av-playing");
    var subsEl = h("div.subs");
    var titleEl = h("div.p-title");
    var clockEl = h("div.p-clock");
    var posEl = h("div.pos");
    var bufEl = h("div.buf");
    var knobEl = h("div.knob");
    var seekLabel = h("div.seek-label");
    var bar = h("div.p-bar", {
      focusable: true,
      onSelect: function onSelect() {
        return togglePlay();
      }
    }, [bufEl, posEl, knobEl, seekLabel]);
    var curTimeEl = h("span");
    var durEl = h("span");
    var playBtn = h("div.btn", {
      focusable: true,
      onSelect: function onSelect() {
        return togglePlay();
      }
    });
    var audioBtn = h("div.btn", {
      focusable: true,
      html: '<span class="ico">♫</span>' + t("Áudio"),
      onSelect: function onSelect() {
        return audioMenu();
      }
    });
    var subsBtn = h("div.btn", {
      focusable: true,
      html: '<span class="ico">≡</span>' + t("Legendas"),
      onSelect: function onSelect() {
        return subsMenu();
      }
    });
    var srcBtn = h("div.btn", {
      focusable: true,
      html: '<span class="ico">⇄</span>' + t("Fontes"),
      onSelect: function onSelect() {
        return sourcesMenu();
      }
    });
    var nextBtn = h("div.btn", {
      focusable: true,
      html: '<span class="ico">⏭</span>' + t("Próximo"),
      onSelect: function onSelect() {
        return playNext();
      }
    });
    var chapBtn = h("div.btn", {
      focusable: true,
      html: '<span class="ico">☰</span>' + t("Capítulos"),
      onSelect: function onSelect() {
        return chaptersMenu();
      }
    });
    var sleepBtn = h("div.btn", {
      focusable: true,
      html: '<span class="ico">☾</span>' + t("Dormir"),
      onSelect: function onSelect() {
        return sleepMenu();
      }
    });
    var buttons = h("div.p-buttons", {
      "data-group": ""
    }, [playBtn, audioBtn, subsBtn, srcBtn, chapBtn, sleepBtn, nextBtn]);
    var spinner = h("div.p-center", null, h("div.spinner"));
    var msgEl = h("div.p-msg");
    var skipFill = h("i");
    var skipBtn = h("div.btn", {
      focusable: true,
      onSelect: function onSelect() {
        return doSkip();
      }
    });
    var skipBox = h("div.p-skip", null, [skipBtn, h("div.bar", null, skipFill)]);
    var overlay2 = h("div.p-overlay", null, [h("div.p-top", null, [titleEl, clockEl]), h("div.p-bottom", null, [bar, h("div.p-times", null, [curTimeEl, h("div.spacer"), durEl]), buttons])]);
    var upNextTitle = h("div.un-title");
    var upNextCount = h("div.un-count");
    var upNextPlay = h("div.btn.primary", {
      focusable: true,
      onSelect: function onSelect() {
        return upNextGo();
      }
    }, [h("span.ico", {
      text: "▶"
    }), t("Assistir agora")]);
    var upNextCancel = h("div.btn", {
      focusable: true,
      onSelect: function onSelect() {
        return upNextStop(true);
      }
    }, t("Cancelar"));
    var upNextBox = h("div.p-upnext", null, [h("div.un-label", {
      text: t("A seguir")
    }), upNextTitle, upNextCount, h("div.un-buttons", {
      "data-group": ""
    }, [upNextPlay, upNextCancel])]);
    var postTrack = h("div.row-track", {
      "data-scroll-x": "",
      "data-group": ""
    });
    var postClose = h("div.btn", {
      focusable: true,
      onSelect: function onSelect() {
        return pop();
      }
    }, t("Fechar"));
    var postBox = h("div.p-postplay", null, [h("div.un-label", {
      text: t("Mais como este")
    }), postTrack, h("div.un-buttons", {
      "data-group": ""
    }, [postClose])]);
    var el = h("div.view.player", null, [videoNode, subsEl, overlay2, skipBox, upNextBox, postBox, spinner, msgEl]);
    var renderer = Renderer(subsEl);
    apply(subsEl, settings2);
    var alive = true;
    var controlsOn = false;
    var hideTimer = null;
    var ticker = null;
    var saveTimer = null;
    var watchTimer = null;
    var statusTimer = null;
    var mediaUrl = "";
    var viaServer = false;
    var lastTick = 0;
    var watchedDelta = 0;
    var pendingStart = opts.startTime || 0;
    var seekTarget = null;
    var seekCommitTimer = null;
    var seekRepeats = 0;
    var embedded = null;
    var addonSubs = null;
    var currentSub = {
      kind: "off"
    };
    var currentAudio = null;
    var triedTranscode = false;
    var seriesInfo = function seriesInfo() {
      return opts.isSeries ? {
        season: video.season,
        episode: video.episode
      } : null;
    };
    var frac = function frac() {
      var d = videoEl.duration;
      return d > 0 && isFinite(d) ? Math.min(1, (videoEl.currentTime || 0) / d) : 0;
    };
    function setTitle() {
      clear(titleEl);
      titleEl.appendChild(document.createTextNode(meta.name || ""));
      if (opts.isSeries) titleEl.appendChild(h("small", {
        text: epLabel(video.season, video.episode) + " · " + (video.name || video.title || "")
      }));
      nextBtn.style.display = opts.isSeries && nextVideo() ? "" : "none";
    }
    function nextVideo() {
      var vids = sortedVideos(meta);
      var i = vids.findIndex(function (v) {
        return v.id === video.id;
      });
      return i >= 0 && i + 1 < vids.length ? vids[i + 1] : null;
    }
    function start3() {
      setTitle();
      showSpinner(true);
      message("");
      embedded = null;
      tracksPromise = null;
      addonSubs = null;
      renderer.clear();
      currentSub = {
        kind: "off"
      };
      segments = [];
      segmentsLoaded = false;
      if (typeof upNextStop === "function") upNextStop(false);
      upNextCancelled = false;
      nativeOffDone = false;
      hideSkip();
      toPlayable(stream, seriesInfo()).then(function (res) {
        if (!alive) return;
        mediaUrl = res.url;
        viaServer = res.viaServer;
        log.info("Tocando", mediaUrl);
        hasPlayed = false;
        videoEl.autoplay = true;
        videoEl.src = mediaUrl;
        freeBackgroundMemory();
        loadSubtitles();
      }).catch(function (e) {
        return fail(e.message);
      });
    }
    var tracksPromise = null;
    function loadEmbeddedTracks() {
      if (!isAvailable()) return Promise.resolve(null);
      if (!tracksPromise) {
        var forUrl = mediaUrl;
        tracksPromise = tracks(mediaUrl).then(function (tracks2) {
          if (!alive || !tracks2 || forUrl !== mediaUrl) return null;
          embedded = tracks2;
          log.info("Faixas embutidas", JSON.stringify(tracks2));
          return tracks2;
        }).catch(function () {
          tracksPromise = null;
          return null;
        });
      }
      return tracksPromise;
    }
    function loadSubtitles() {
      var forVideo = video;
      addonSubs = null;
      fetchSubtitles(meta.type, video.id, {}, function (list2) {
        if (!alive || forVideo !== video) return;
        addonSubs = (addonSubs || []).concat(list2);
        autoPick();
      }).catch(function () {
        if (!addonSubs) addonSubs = [];
      });
      if (key()) search(meta.type, video.id).then(function (list2) {
        if (!alive || forVideo !== video || !list2.length) return;
        addonSubs = (addonSubs || []).concat(list2);
        autoPick();
      });
    }
    var autoDone = {
      sub: false,
      audio: false
    };
    var TRACKS_KEY = "seriesTracks";
    function rememberedTracks() {
      if (!opts.isSeries || settings2.rememberTracks === false) return {};
      return (get(TRACKS_KEY, {}) || {})[meta.id] || {};
    }
    function rememberTrack(kind, lang3) {
      if (!opts.isSeries || settings2.rememberTracks === false || !lang3) return;
      var all2 = get(TRACKS_KEY, {}) || {};
      var ids2 = Object.keys(all2);
      if (ids2.length > 200) delete all2[ids2[0]];
      all2[meta.id] = Object.assign({}, all2[meta.id], _defineProperty({}, kind, String(lang3).toLowerCase()));
      set(TRACKS_KEY, all2);
    }
    function autoPick() {
      var mem = rememberedTracks();
      if (mem.sub === "off") autoDone.sub = true;
      var prefSubs = (mem.sub ? [mem.sub] : []).concat((settings2.subtitleLangs || []).map(function (x) {
        return x.toLowerCase();
      }));
      var prefAudio = mem.audio ? [mem.audio] : (settings2.audioLangs || []).map(function (x) {
        return x.toLowerCase();
      });
      var avList = videoEl.isAVPlay ? videoEl.audioTrackList().map(function (x) {
        return {
          lang: x.language
        };
      }) : [];
      var audioList = avList.length > 1 ? avList : embedded ? embedded.audio : [];
      if (!autoDone.audio && prefAudio.length && audioList.length > 1) {
        autoDone.audio = true;
        var want = prefAudio.map(lang2);
        var avNow = videoEl.isAVPlay ? videoEl.audioTrackList().findIndex(function (x) {
          return x.enabled;
        }) : 0;
        var nowIdx = avNow >= 0 ? avNow : 0;
        var already = audioList[nowIdx] && want.indexOf(lang2(audioList[nowIdx].lang)) >= 0;
        if (!already) {
          var idx = -1;
          var _loop4 = function _loop4(w) {
            idx = audioList.findIndex(function (tr) {
              return lang2(tr.lang) === want[w];
            });
          };
          for (var w = 0; w < want.length && idx < 0; w++) {
            _loop4(w);
          }
          if (idx >= 0 && idx !== nowIdx) selectEmbeddedAudio(idx, true);
        }
      }
      if (autoDone.sub || !(settings2.subtitlesAuto || mem.sub) || !prefSubs.length || !addonSubs) return;
      var _loop5 = function _loop5(p) {
          var s = addonSubs.find(function (x) {
            return lang2(x.lang) === lang2(prefSubs[p]);
          });
          if (s) {
            autoDone.sub = true;
            selectAddonSub(s, true);
            return {
              v: void 0
            };
          }
        },
        _ret2;
      for (var p = 0; p < prefSubs.length; p++) {
        _ret2 = _loop5(p);
        if (_ret2) return _ret2.v;
      }
    }
    function scheduleAudioPick() {
      if (!(settings2.audioLangs || []).length && !rememberedTracks().audio) return;
      if (videoEl.isAVPlay) {
        setTimeout(function () {
          return alive && hasPlayed && autoPick();
        }, 1500);
        return;
      }
      if (!isAvailable()) return;
      setTimeout(function () {
        if (alive && hasPlayed) loadEmbeddedTracks().then(function () {
          return autoPick();
        });
      }, 2e4);
    }
    videoEl.addEventListener("loadedmetadata", function () {
      if (pendingStart > 0) {
        try {
          videoEl.currentTime = pendingStart / 1e3;
          autoResume = true;
        } catch (e) {}
        pendingStart = 0;
      }
      updateTimes();
      loadSegments();
    });
    videoEl.addEventListener("playing", function () {
      if (!hasPlayed) scheduleAudioPick();
      hasPlayed = true;
      if (meta.id !== "dev") onPlay(meta, video, frac());
      showSpinner(false);
      message("");
      updatePlayBtn();
      scheduleHide();
    });
    videoEl.addEventListener("pause", function () {
      if (!videoEl.ended) onPause(frac());
      updatePlayBtn();
      showControls();
      saveProgress2();
    });
    videoEl.addEventListener("waiting", function () {
      return showSpinner(true);
    });
    videoEl.addEventListener("canplay", function () {
      return showSpinner(false);
    });
    videoEl.addEventListener("timeupdate", function () {
      var now = Date.now();
      if (!videoEl.paused && lastTick) {
        var d = now - lastTick;
        if (d > 0 && d < 3e3) watchedDelta += d;
      }
      lastTick = now;
      renderer.update(videoEl.currentTime);
      if (controlsOn) updateTimes();
      checkUpNext();
    });
    videoEl.addEventListener("ended", function () {
      saveProgress2();
      record(video.id, 1);
      onStop(1);
      if (sleepAt === -1) {
        sleepAt = 0;
        toast(t("Boa noite!"), 5e3);
        return pop();
      }
      if (opts.isSeries && nextVideo() && !upNextCancelled && settings2.autoNext !== false) playNext();else if (!(opts.isSeries && nextVideo()) && settings().postPlay !== false) showPostPlay();else pop();
    });
    var postPlayOn = false;
    function showPostPlay() {
      var genre = (meta.genres || meta.genre || [])[0];
      var type = meta.type === "series" ? "series" : "movie";
      var url2 = "https://v3-cinemeta.strem.io/catalog/" + type + "/top" + (genre ? "/genre=" + encodeURIComponent(genre) : "") + ".json";
      getJSON(url2, {
        timeout: 1e4,
        quiet: true
      }).then(function (r) {
        if (!alive) return;
        var list2 = (r && r.metas || []).filter(function (m) {
          return m.id !== meta.id && !isWatched(m.id);
        }).slice(0, 10);
        if (!list2.length) return pop();
        clear(postTrack);
        list2.forEach(function (m) {
          return postTrack.appendChild(card(m, {
            onSelect: function onSelect() {
              pop();
              openDetails(m.type || type, m.id);
            }
          }));
        });
        hideControls();
        postPlayOn = true;
        postBox.classList.add("show");
        loadVisibleImages(postBox);
        focus(postTrack.firstChild, {
          noScroll: true
        });
      }).catch(function () {
        return alive && pop();
      });
    }
    var sleepTimer = null;
    var sleepAt = 0;
    function sleepNow() {
      clearTimeout(sleepTimer);
      sleepTimer = null;
      sleepAt = 0;
      saveProgress2();
      videoEl.pause();
      toast(t("Boa noite! O vídeo foi pausado."), 6e3);
      setTimeout(function () {
        return alive && videoEl.paused && close();
      }, 6e4);
    }
    function sleepMenu() {
      var left = sleepAt > 0 ? Math.max(1, Math.round((sleepAt - Date.now()) / 6e4)) : 0;
      var opts2 = [{
        label: t("Desligado"),
        value: 0,
        checked: !sleepAt
      }, {
        label: t("{n} minutos", {
          n: 15
        }),
        value: 15
      }, {
        label: t("{n} minutos", {
          n: 30
        }),
        value: 30
      }, {
        label: t("{n} minutos", {
          n: 60
        }),
        value: 60
      }, {
        label: t("{n} minutos", {
          n: 90
        }),
        value: 90
      }, {
        label: t("No fim deste vídeo"),
        value: -1,
        checked: sleepAt === -1
      }];
      menu(t("Dormir") + (left ? " · " + t("faltam {n} min", {
        n: left
      }) : ""), opts2, {
        onPick: function onPick(v) {
          clearTimeout(sleepTimer);
          sleepTimer = null;
          sleepAt = 0;
          sleepBtn.classList.remove("on");
          if (!v) return toast(t("Timer desligado"));
          sleepBtn.classList.add("on");
          if (v === -1) {
            sleepAt = -1;
            return toast(t("O vídeo para no fim deste episódio"));
          }
          sleepAt = Date.now() + v * 6e4;
          sleepTimer = setTimeout(sleepNow, v * 6e4);
          toast(t("O vídeo para em {n} minutos", {
            n: v
          }));
        }
      });
    }
    var chapterList = null;
    function chaptersMenu() {
      var forUrl = mediaUrl;
      var open = function open(list2) {
        if (!list2.length) return toast(t("Este arquivo não tem capítulos."));
        var now = videoEl.currentTime || 0;
        var cur = 0;
        list2.forEach(function (c, i) {
          return c.start <= now + 0.5 && (cur = i);
        });
        menu(t("Capítulos"), list2.map(function (c, i) {
          return {
            label: c.title || t("Capítulo {n}", {
              n: i + 1
            }),
            sub: fmtTime(c.start),
            value: i,
            checked: i === cur
          };
        }), {
          onPick: function onPick(i) {
            videoEl.currentTime = Math.max(0, list2[i].start);
            showControls();
          }
        });
      };
      if (chapterList && chapterList.url === forUrl) return open(chapterList.list);
      toast(t("Procurando capítulos..."));
      load4(forUrl).then(function (list2) {
        if (!alive || forUrl !== mediaUrl) return;
        chapterList = {
          url: forUrl,
          list: list2
        };
        open(list2);
      });
    }
    function sendNowPlaying() {
      var d = videoEl.duration;
      nowPlaying({
        title: meta.name || "",
        episode: opts.isSeries ? epLabel(video.season, video.episode) + (video.name || video.title ? " · " + (video.name || video.title) : "") : "",
        poster: meta.poster || "",
        position: Math.floor(videoEl.currentTime || 0),
        duration: d > 0 && isFinite(d) ? Math.floor(d) : 0,
        paused: videoEl.paused
      });
    }
    onSeek(function (sec) {
      if (!alive || !(videoEl.duration > 0)) return;
      videoEl.currentTime = Math.max(0, Math.min(sec, videoEl.duration - 2));
      showControls();
      sendNowPlaying();
    });
    ["play", "pause", "seeked", "loadedmetadata"].forEach(function (ev) {
      return videoEl.addEventListener(ev, sendNowPlaying);
    });
    var nowTimer = setInterval(function () {
      return alive && !videoEl.paused && sendNowPlaying();
    }, 15e3);
    var UP_NEXT_SECONDS = 25;
    var UP_NEXT_COUNT = Math.max(3, +settings2.upNextSeconds || 10);
    var upNextTimer = null;
    var upNextLeft = 0;
    var upNextCancelled = false;
    function upNextStart() {
      var outro = segments.find(function (s) {
        return s.type === "outro";
      });
      var d = videoEl.duration;
      return outro ? outro.start : d - UP_NEXT_SECONDS;
    }
    function checkUpNext() {
      if (upNextTimer || upNextCancelled || !opts.isSeries || seekTarget !== null || videoEl.paused || settings2.autoNext === false || sleepAt === -1) return;
      var d = videoEl.duration;
      var nv = nextVideo();
      if (!nv || !(d > 300) || !isFinite(d) || videoEl.currentTime < upNextStart()) return;
      hideSkip();
      upNextTitle.textContent = epLabel(nv.season, nv.episode) + (nv.name || nv.title ? " · " + (nv.name || nv.title) : "");
      upNextLeft = UP_NEXT_COUNT;
      upNextCount.textContent = t("Começa em {n}s", {
        n: upNextLeft
      });
      upNextBox.classList.add("show");
      focus(upNextPlay, {
        noScroll: true
      });
      upNextTimer = setInterval(function () {
        upNextLeft--;
        upNextCount.textContent = t("Começa em {n}s", {
          n: upNextLeft
        });
        if (upNextLeft <= 0) upNextGo();
      }, 1e3);
    }
    function upNextStop(cancelled) {
      clearInterval(upNextTimer);
      upNextTimer = null;
      upNextBox.classList.remove("show");
      if (cancelled) {
        upNextCancelled = true;
        focus(bar, {
          noScroll: true
        });
      }
    }
    function upNextGo() {
      upNextStop(false);
      record(video.id, 1);
      upNextCancelled = false;
      playNext();
    }
    var SUB_STEP = 0.25;
    var SUB_DELAYS = "subDelays";
    function savedDelay() {
      return (get(SUB_DELAYS, {}) || {})[video.id] || 0;
    }
    function rememberDelay(v) {
      var all2 = get(SUB_DELAYS, {}) || {};
      delete all2[video.id];
      if (v) all2[video.id] = v;
      var keys2 = Object.keys(all2);
      if (keys2.length > 200) delete all2[keys2[0]];
      set(SUB_DELAYS, all2);
    }
    function setSubDelay(v) {
      v = Math.round(Math.max(-30, Math.min(30, v)) * 100) / 100;
      renderer.setOffset(v);
      rememberDelay(v);
      return v;
    }
    function nudgeSubs(dir) {
      if (currentSub.kind === "off") return toast(t("Ligue uma legenda primeiro."));
      if (currentSub.kind === "embedded") return toast(t("O ajuste funciona com legendas de addons (OpenSubtitles etc.)."), 4e3);
      var v = setSubDelay(renderer.offset() + dir * SUB_STEP);
      toast(t("Atraso da legenda: {n}s", {
        n: (v > 0 ? "+" : "") + v.toFixed(2)
      }) + "  ·  " + (v < 0 ? t("Legenda aparece antes") : v > 0 ? t("Legenda aparece depois") : t("Sem ajuste")), 1800);
    }
    videoEl.addEventListener("error", function () {
      var err = videoEl.error;
      log.warn("Erro de vídeo", err && err.code, err && err.message, mediaUrl);
      if (!alive) return;
      if (videoEl.isAVPlay && !hasPlayed && err && /^open:/.test(err.message || "")) {
        saveSettings({
          playerEngine: "html5"
        });
        toast(t("Usando o player do navegador nesta TV."));
        pop();
        openPlayer(Object.assign({}, opts, {
          stream: stream,
          video: video,
          startTime: pendingStart
        }));
        return;
      }
      if (!hasPlayed && opts.fallbacks && opts.fallbacks.length) {
        stream = opts.fallbacks.shift();
        toast(t("Essa fonte não tocou. Tentando outra..."));
        triedTranscode = false;
        autoDone = {
          sub: false,
          audio: false
        };
        start3();
        return;
      }
      if (!triedTranscode && isAvailable()) {
        fail(t("A TV não conseguiu tocar este arquivo diretamente."), true);
      } else fail(t("A TV não conseguiu tocar este arquivo (formato ou codec não suportado)."));
    });
    var segments = [];
    var segmentsLoaded = false;
    var activeSeg = null;
    var doneSegs = {};
    function loadSegments() {
      if (segmentsLoaded || settings().skipMode === "off") return;
      segmentsLoaded = true;
      var forVideo = video;
      getSegments(meta, video, videoEl.duration).then(function (list2) {
        if (alive && forVideo === video) segments = list2;
      }).catch(function () {});
    }
    function segLabel(seg) {
      if (seg.type === "intro") return t("Pular abertura");
      if (seg.type === "recap") return t("Pular recapitulação");
      return opts.isSeries && nextVideo() ? t("Próximo episódio") : t("Pular encerramento");
    }
    function segKey(seg) {
      return video.id + ":" + seg.type + ":" + seg.start;
    }
    function checkSkip() {
      if (!segments.length || seekTarget !== null) return;
      var pos = videoEl.currentTime;
      var seg = segments.find(function (x) {
        return pos >= x.start && pos < x.end - 0.5;
      }) || null;
      if (seg !== activeSeg) {
        activeSeg = seg;
        if (!seg || doneSegs[segKey(seg)]) {
          hideSkip();
          if (seg) activeSeg = null;
          return;
        }
        if (settings().skipMode === "auto" && !(seg.type === "outro" && opts.isSeries && nextVideo())) {
          doSkip();
          return;
        }
        skipBtn.innerHTML = '<span class="ico">⏭</span>' + segLabel(seg);
        skipBox.classList.add("show");
        if (controlsOn) focus(skipBtn, {
          noScroll: true
        });
      }
      if (activeSeg) skipFill.style.width = Math.max(0, Math.min(100, (pos - activeSeg.start) / (activeSeg.end - activeSeg.start) * 100)) + "%";
    }
    function hideSkip() {
      skipBox.classList.remove("show");
      if (current2() === skipBtn) focus(bar, {
        noScroll: true
      });
    }
    function dismissSkip() {
      if (activeSeg) doneSegs[segKey(activeSeg)] = true;
      activeSeg = null;
      hideSkip();
    }
    function doSkip() {
      var seg = activeSeg;
      if (!seg) return;
      doneSegs[segKey(seg)] = true;
      activeSeg = null;
      hideSkip();
      if (seg.type === "outro" && opts.isSeries && nextVideo()) {
        playNext();
        return;
      }
      var d = videoEl.duration;
      try {
        videoEl.currentTime = Math.min(seg.end, isFinite(d) ? d - 1 : seg.end);
      } catch (e) {}
      if (settings().skipMode === "auto") toast(seg.type === "intro" ? t("Abertura pulada") : seg.type === "recap" ? t("Recapitulação pulada") : t("Encerramento pulado"));
    }
    function bufferedInfo() {
      try {
        var b = videoEl.buffered;
        var out = [];
        for (var i = 0; i < b.length; i++) out.push(b.start(i).toFixed(0) + "-" + b.end(i).toFixed(0));
        return out.join(",");
      } catch (e) {
        return "?";
      }
    }
    function diag(ev) {
      log.info("video", ev, "t=" + videoEl.currentTime.toFixed(1), "dur=" + (isFinite(videoEl.duration) ? videoEl.duration.toFixed(0) : "?"), "ready=" + videoEl.readyState, "net=" + videoEl.networkState, "buf=" + bufferedInfo());
    }
    ["waiting", "stalled", "suspend", "abort", "emptied", "seeking", "seeked", "ended", "loadeddata"].forEach(function (ev) {
      return videoEl.addEventListener(ev, function () {
        return diag(ev);
      });
    });
    var lastT = -1;
    var hasPlayed = false;
    var gaveUp = false;
    var autoResume = false;
    videoEl.addEventListener("seeked", function () {
      if (autoResume) {
        autoResume = false;
        var p = videoEl.play();
        if (p && p.catch) p.catch(function () {});
      }
    });
    function stuckMenu(pos) {
      showSpinner(false);
      menu(t("O vídeo parou de carregar"), [{
        label: t("Tentar de novo"),
        sub: t("Reabre o vídeo em {time}", {
          time: fmtTime(pos)
        }),
        value: "retry",
        checked: true
      }, {
        label: t("Escolher outra fonte"),
        value: "src"
      }, {
        label: t("Voltar"),
        value: "back"
      }], {
        center: true,
        onPick: function onPick(v) {
          if (v === "retry") {
            gaveUp = false;
            recoveries = 0;
            reopenAt(pos);
          } else if (v === "src") sourcesMenu();else pop();
        }
      });
    }
    function freeBackgroundMemory() {
      closeHeavyBackgroundApps().then(function (closed) {
        return closed.length && log.info("Apps fechados em segundo plano: " + closed.join(", "));
      });
      var home = tabView("home");
      if (home && home.freeMemory) home.freeMemory();
    }
    var stuckSince = 0;
    var recoveries = 0;
    var lastRecoveryAt = 0;
    function watchdog() {
      if (!alive || gaveUp || !hasPlayed || !mediaUrl || videoEl.paused || seekTarget !== null || videoEl.ended) {
        stuckSince = 0;
        return;
      }
      var pos = videoEl.currentTime;
      if (Math.abs(pos - lastT) > 0.05) {
        lastT = pos;
        stuckSince = 0;
        if (Date.now() - lastRecoveryAt > 12e4) recoveries = 0;
        return;
      }
      if (!stuckSince) {
        stuckSince = Date.now();
        return;
      }
      var stuckFor = Date.now() - stuckSince;
      if (stuckFor > 15e3) {
        stuckSince = 0;
        if (recoveries >= 3) {
          diag("travado-desisti");
          gaveUp = true;
          stuckMenu(pos);
          return;
        }
        recoveries++;
        lastRecoveryAt = Date.now();
        diag("travado-recuperando#" + recoveries);
        reopenAt(pos);
      }
    }
    function reopenAt(pos) {
      showSpinner(true);
      toast(t("Reconectando ao vídeo..."));
      pendingStart = Math.max(0, pos - 1) * 1e3;
      var src = videoEl.currentSrc || mediaUrl;
      try {
        videoEl.pause();
        videoEl.removeAttribute("src");
        videoEl.load();
      } catch (e) {}
      setTimeout(function () {
        if (!alive) return;
        hasPlayed = false;
        videoEl.autoplay = true;
        videoEl.src = src;
        nativeOffDone = false;
        if (currentSub.kind === "embedded" && !currentSub.extracted) {
          var idx = currentSub.index;
          setTimeout(function () {
            return alive && selectEmbeddedSub(idx);
          }, 2500);
        }
      }, 300);
    }
    function fail(text, offerTranscode) {
      showSpinner(false);
      var box = h("div", null, [text, h("small", {
        text: t("Tente outra fonte (de preferência MP4/MKV com H.264 ou HEVC e áudio AAC/AC3).")
      })]);
      clear(msgEl);
      msgEl.appendChild(box);
      var opts2 = [{
        label: t("Escolher outra fonte"),
        value: "src"
      }];
      if (offerTranscode) opts2.unshift({
        label: t("Converter no PC (experimental)"),
        sub: t("O servidor converte para HLS que a TV aceita"),
        value: "hls"
      });
      opts2.push({
        label: t("Voltar"),
        value: "back"
      });
      menu(t("Problema na reprodução"), opts2, {
        center: true,
        onPick: function onPick(v) {
          if (v === "hls") transcode();else if (v === "src") sourcesMenu();else pop();
        }
      });
    }
    function transcode() {
      triedTranscode = true;
      var base = baseUrl();
      var id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      var q2 = ["mediaURL=" + encodeURIComponent(mediaUrl)];
      ["h264", "h265", "hevc"].forEach(function (c) {
        return q2.push("videoCodecs=" + c);
      });
      ["aac", "mp3", "ac3", "eac3"].forEach(function (c) {
        return q2.push("audioCodecs=" + c);
      });
      q2.push("maxAudioChannels=6");
      var url2 = base + "hlsv2/" + id + "/master.m3u8?" + q2.join("&");
      pendingStart = videoEl.currentTime * 1e3 || pendingStart;
      showSpinner(true);
      message("");
      log.info("Transcodificando", url2);
      videoEl.src = url2;
      videoEl.load();
      videoEl.play();
    }
    function togglePlay() {
      if (videoEl.paused) videoEl.play();else videoEl.pause();
      showControls();
    }
    function updatePlayBtn() {
      playBtn.innerHTML = videoEl.paused ? '<span class="ico">▶</span>' + t("Tocar") : '<span class="ico">❚❚</span>' + t("Pausar");
    }
    function updateTimes() {
      var d = videoEl.duration;
      var pos = seekTarget !== null ? seekTarget : videoEl.currentTime;
      var pct = d > 0 && isFinite(d) ? Math.min(100, pos / d * 100) : 0;
      posEl.style.width = pct + "%";
      knobEl.style.left = pct + "%";
      seekLabel.style.left = pct + "%";
      curTimeEl.textContent = fmtTime(pos);
      durEl.textContent = isFinite(d) ? fmtTime(d) : "--:--";
      try {
        var b = videoEl.buffered;
        for (var i = 0; i < b.length; i++) {
          if (b.start(i) <= videoEl.currentTime + 1 && b.end(i) >= videoEl.currentTime) {
            bufEl.style.width = (d > 0 ? Math.min(100, b.end(i) / d * 100) : 0) + "%";
          }
        }
      } catch (e) {}
      var now = /* @__PURE__ */new Date();
      clear(clockEl);
      clockEl.appendChild(document.createTextNode(timeHM(now)));
      if (d > 0 && isFinite(d)) {
        var end = new Date(now.getTime() + Math.max(0, d - videoEl.currentTime) * 1e3);
        clockEl.appendChild(h("small", {
          text: t("Termina às {time}", {
            time: timeHM(end)
          })
        }));
      }
    }
    function showControls(focusEl) {
      if (!controlsOn) {
        controlsOn = true;
        el.classList.add("controls-on");
        updateTimes();
        updatePlayBtn();
        if (!current2() || !overlay2.contains(current2())) focus(focusEl || bar);
      } else if (focusEl) focus(focusEl);
      scheduleHide();
    }
    function hideControls() {
      controlsOn = false;
      el.classList.remove("controls-on");
      clearTimeout(hideTimer);
    }
    function scheduleHide() {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        if (!videoEl.paused && seekTarget === null && topLayer() && topLayer().root === el) hideControls();
      }, HIDE_MS);
    }
    function showSpinner(on) {
      spinner.style.display = on ? "" : "none";
    }
    function message(text) {
      msgEl.textContent = text;
    }
    function seekBy(dir) {
      var d = videoEl.duration;
      if (!(d > 0) || !isFinite(d)) return;
      if (seekTarget === null) {
        seekTarget = videoEl.currentTime;
        seekRepeats = 0;
      }
      seekRepeats++;
      var step = seekRepeats > 15 ? 60 : seekRepeats > 5 ? 30 : 10;
      seekTarget = Math.max(0, Math.min(d - 2, seekTarget + dir * step));
      bar.classList.add("seeking");
      seekLabel.textContent = fmtTime(seekTarget);
      showControls(bar);
      updateTimes();
      clearTimeout(seekCommitTimer);
      seekCommitTimer = setTimeout(commitSeek, 700);
    }
    function commitSeek() {
      if (seekTarget === null) return;
      try {
        videoEl.currentTime = seekTarget;
      } catch (e) {}
      seekTarget = null;
      bar.classList.remove("seeking");
      if (videoEl.paused) videoEl.play();
      scheduleHide();
    }
    function cancelSeek() {
      clearTimeout(seekCommitTimer);
      seekTarget = null;
      bar.classList.remove("seeking");
      updateTimes();
    }
    function mediaId() {
      var id = String(videoEl.mediaId || "").trim();
      return id && id !== "<invalid mediaId>" ? id : null;
    }
    function selectEmbeddedAudio(index2, silent) {
      if (videoEl.isAVPlay) {
        if (videoEl.selectAudio(index2)) {
          currentAudio = index2;
          if (!silent) toast(t("Áudio: {lang}", {
            lang: audioName(index2)
          }));
        } else toast(t("Troca de áudio indisponível agora."));
        return;
      }
      var native = videoEl.audioTracks;
      if (native && native.length > index2) {
        for (var i = 0; i < native.length; i++) native[i].enabled = i === index2;
        currentAudio = index2;
        try {
          if (!videoEl.paused) videoEl.currentTime = Math.max(0, videoEl.currentTime - 0.2);
        } catch (e) {}
        return;
      }
      var id = mediaId();
      if (!id || !hasLuna()) return toast(available() ? t("Troca de áudio indisponível agora.") : t("Para trocar o áudio, o app precisa do player da Samsung (AVPlay), que não carregou. Veja Ajustes → Reprodução."), 6e3);
      luna("luna://com.webos.media", "selectTrack", {
        mediaId: id,
        type: "audio",
        index: index2
      }).then(function () {
        return currentAudio = index2;
      }).catch(function (e) {
        return toast(t("Falha ao trocar áudio: {msg}", {
          msg: e.message
        }));
      });
    }
    var nativeOffDone = false;
    function nativeSubsOff() {
      var id = mediaId();
      if (!id || !hasLuna()) return;
      nativeOffDone = true;
      luna("luna://com.webos.media", "setSubtitleEnable", {
        mediaId: id,
        enable: false
      }).catch(function () {});
    }
    function selectEmbeddedSub(index2) {
      renderer.clear();
      streamProgress(mediaUrl).then(function (p) {
        if (!alive) return;
        if (p !== null && p >= 0.999) extractedSub(index2);else nativeEmbeddedSub(index2);
      });
    }
    function extractedSub(index2) {
      nativeSubsOff();
      var cs = {
        kind: "embedded",
        index: index2,
        extracted: true,
        sid: "kai" + Math.random().toString(36).slice(2),
        segs: {},
        cues: [],
        busy: false
      };
      currentSub = cs;
      ensureSegments();
    }
    function ensureSegments() {
      var cs = currentSub;
      if (!cs.extracted || cs.busy || !alive) return;
      var n = Math.floor(videoEl.currentTime / 10) + 1;
      var k = !cs.segs[n] ? n : !cs.segs[n + 1] ? n + 1 : 0;
      if (!k) return;
      cs.segs[k] = "loading";
      cs.busy = true;
      var url2 = baseUrl() + "hlsv2/" + cs.sid + "/subtitle" + cs.index + "/segment" + k + ".vtt?mediaURL=" + encodeURIComponent(mediaUrl);
      getText(url2, {
        timeout: 3e4,
        quiet: true
      }).then(function (txt) {
        if (currentSub !== cs) return;
        var seen = {};
        cs.cues.forEach(function (c) {
          return seen[c.start + "|" + c.text] = true;
        });
        parse(txt).forEach(function (c) {
          if (!seen[c.start + "|" + c.text]) cs.cues.push(c);
        });
        cs.cues.sort(function (a, b) {
          return a.start - b.start;
        });
        renderer.set(cs.cues);
        renderer.update(videoEl.currentTime);
      }).catch(function () {
        return delete cs.segs[k];
      }).then(function () {
        return cs.busy = false;
      });
    }
    function nativeEmbeddedSub(index2) {
      var id = mediaId();
      if (!id || !hasLuna()) {
        setTimeout(function () {
          return alive && mediaId() && nativeEmbeddedSub(index2);
        }, 1200);
        return;
      }
      applyNative(id, settings());
      luna("luna://com.webos.media", "setSubtitleEnable", {
        mediaId: id,
        enable: true
      }).then(function () {
        return luna("luna://com.webos.media", "selectTrack", {
          mediaId: id,
          type: "text",
          index: index2
        });
      }).then(function () {
        currentSub = {
          kind: "embedded",
          index: index2
        };
      }).catch(function (e) {
        return toast(t("Falha na legenda embutida: {msg}", {
          msg: e.message
        }));
      });
    }
    function cleanAvText(raw) {
      var x = String(raw || "");
      var d = /^Dialogue:\s*(?:[^,]*,){9}([\s\S]*)$/.exec(x);
      if (d) x = d[1];
      return x.replace(/\{\\[^}]*\}/g, "").replace(/\\[Nn]/g, "\n").replace(/\\h/g, " ").replace(/\r/g, "").trim();
    }
    function selectAvText(index2) {
      disableEmbeddedSubs();
      renderer.clear();
      renderer.setOffset(0);
      currentSub = {
        kind: "avtext",
        index: index2
      };
      videoEl.onSubtitle(function (s) {
        var text = cleanAvText(s.text);
        if (!text || currentSub.kind !== "avtext") return;
        var now = videoEl.currentTime || 0;
        renderer.add({
          start: now,
          end: now + Math.max(1.5, (s.duration || 3e3) / 1e3),
          text: sanitize(text)
        });
      });
      if (!videoEl.selectText(index2)) toast(t("Não foi possível ligar esta legenda."));
    }
    function disableEmbeddedSubs() {
      if (videoEl.isAVPlay && currentSub.kind === "avtext") videoEl.disableText();
      var id = mediaId();
      if (id && hasLuna() && currentSub.kind === "embedded" && !currentSub.extracted) {
        luna("luna://com.webos.media", "setSubtitleEnable", {
          mediaId: id,
          enable: false
        }).catch(function () {});
      }
    }
    function selectAddonSub(s, silent) {
      disableEmbeddedSubs();
      currentSub = {
        kind: "addon",
        id: s.id || s.url
      };
      renderer.setOffset(savedDelay());
      load3(s.url, subtitlesProxy(s.url)).then(function (cues) {
        if (!alive || currentSub.id !== (s.id || s.url)) return;
        renderer.set(cues);
        if (!silent) toast(t("Legenda: {lang}", {
          lang: langName(s.lang)
        }));
      }).catch(function () {
        return toast(t("Não foi possível baixar a legenda."));
      });
    }
    function withTracks(open) {
      if (embedded || !isAvailable()) return open();
      toast(t("Lendo as faixas do arquivo..."), 2500);
      loadEmbeddedTracks().then(function () {
        return alive && open();
      });
    }
    function audioMenu() {
      if (videoEl.isAVPlay && videoEl.audioTrackList().length) return openAudioMenu();
      withTracks(openAudioMenu);
    }
    function audioName(i) {
      var av = videoEl.isAVPlay ? videoEl.audioTrackList() : [];
      var tr = av[i] || embedded && embedded.audio[i];
      return tr ? langName(tr.language || tr.lang) : "#" + (i + 1);
    }
    function openAudioMenu() {
      var native = videoEl.audioTracks;
      var av = videoEl.isAVPlay ? videoEl.audioTrackList() : [];
      var list2 = [];
      if (av.length) {
        list2 = av.map(function (tr, i) {
          var info2 = embedded && embedded.audio[i];
          return {
            label: langName(info2 && info2.lang || tr.language) + (info2 && info2.label ? " · " + info2.label : ""),
            sub: [info2 && info2.codec || tr.codec, tr.channels || info2 && info2.channels ? t("{n} canais", {
              n: tr.channels || info2.channels
            }) : ""].filter(Boolean).join(" · "),
            value: i,
            checked: tr.enabled
          };
        });
      } else if (native && native.length) {
        for (var i = 0; i < native.length; i++) {
          list2.push({
            label: langName(native[i].language) + (native[i].label ? " · " + native[i].label : ""),
            value: i,
            checked: native[i].enabled
          });
        }
      } else if (embedded && embedded.audio.length) {
        list2 = embedded.audio.map(function (tr, i) {
          return {
            label: langName(tr.lang) + (tr.label ? " · " + tr.label : ""),
            sub: [tr.codec, tr.channels ? t("{n} canais", {
              n: tr.channels
            }) : ""].filter(Boolean).join(" · "),
            value: i,
            checked: currentAudio === null ? i === 0 : currentAudio === i
          };
        });
      }
      menu(t("Áudio"), list2, {
        empty: isAvailable() || videoEl.isAVPlay ? t("Só uma faixa de áudio.") : t("Para listar as faixas, conecte o servidor do PC em Ajustes."),
        onPick: function onPick(i) {
          selectEmbeddedAudio(i);
          var av2 = videoEl.isAVPlay ? videoEl.audioTrackList() : [];
          var tr = embedded && embedded.audio[i] || av2[i] || native && native[i];
          rememberTrack("audio", tr && (tr.lang || tr.language));
        }
      });
    }
    function subsMenu() {
      withTracks(openSubsMenu);
    }
    function openSubsMenu() {
      var opts2 = [{
        label: t("Desligada"),
        value: {
          kind: "off"
        },
        checked: currentSub.kind === "off"
      }];
      var avText = videoEl.isAVPlay ? videoEl.textTrackList() : [];
      avText.forEach(function (tr, i) {
        var info2 = embedded && embedded.subs.length === avText.length ? embedded.subs[i] : null;
        if (info2 && /PGS|VOBSUB|DVD/i.test(info2.codec || "")) return;
        opts2.push({
          label: langName(info2 && info2.lang || tr.language) + (info2 && info2.label ? " · " + info2.label : ""),
          sub: t("Embutida no arquivo") + (info2 && info2.codec ? " · " + info2.codec : ""),
          value: {
            kind: "avtext",
            index: i
          },
          checked: currentSub.kind === "avtext" && currentSub.index === i
        });
      });
      if (!avText.length && embedded && embedded.subs.length) {
        embedded.subs.forEach(function (tr, i) {
          return /PGS|VOBSUB|DVD/i.test(tr.codec || "") ? null : opts2.push({
            label: langName(tr.lang) + (tr.label ? " · " + tr.label : ""),
            sub: t("Embutida no arquivo") + (tr.codec ? " · " + tr.codec : ""),
            value: {
              kind: "embedded",
              index: i
            },
            checked: currentSub.kind === "embedded" && currentSub.index === i
          });
        });
      }
      var pref = (settings2.subtitleLangs || []).map(function (x) {
        return x.toLowerCase();
      });
      var sorted = (addonSubs || []).slice().sort(function (a, b) {
        var ia = pref.indexOf(String(a.lang).toLowerCase());
        var ib = pref.indexOf(String(b.lang).toLowerCase());
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      });
      sorted.slice(0, 60).forEach(function (s) {
        return opts2.push({
          label: langName(s.lang),
          sub: s.addon || "Addon",
          value: {
            kind: "addon",
            sub: s
          },
          checked: currentSub.kind === "addon" && currentSub.id === (s.id || s.url)
        });
      });
      opts2.push({
        label: t("Atraso da legenda: {n}s", {
          n: renderer.offset().toFixed(1)
        }),
        sub: t("Ajustar sincronia"),
        value: {
          kind: "delay"
        }
      });
      opts2.push({
        label: t("Tamanho: {n}%", {
          n: settings().subtitleSize || 100
        }),
        value: {
          kind: "size"
        }
      });
      menu(t("Legendas"), opts2, {
        empty: addonSubs === null ? t("Carregando legendas...") : t("Nenhuma legenda."),
        onPick: function onPick(v) {
          if (v.kind === "off" || v.kind === "embedded" || v.kind === "addon" || v.kind === "avtext") autoDone.sub = true;
          if (v.kind === "off") rememberTrack("sub", "off");else if (v.kind === "addon") rememberTrack("sub", v.sub.lang);else if (v.kind === "embedded") rememberTrack("sub", embedded.subs[v.index] && embedded.subs[v.index].lang);else if (v.kind === "avtext") rememberTrack("sub", avText[v.index] && avText[v.index].language);
          if (v.kind === "off") {
            disableEmbeddedSubs();
            renderer.clear();
            currentSub = {
              kind: "off"
            };
          } else if (v.kind === "embedded") selectEmbeddedSub(v.index);else if (v.kind === "avtext") selectAvText(v.index);else if (v.kind === "addon") selectAddonSub(v.sub);else if (v.kind === "delay") delayMenu();else if (v.kind === "size") sizeMenu();
        }
      });
    }
    function delayMenu() {
      var vals = [-5, -3, -2, -1, -0.5, -0.25, 0, 0.25, 0.5, 1, 2, 3, 5];
      menu(t("Atraso da legenda"), vals.map(function (v) {
        return {
          label: (v > 0 ? "+" : "") + v + "s",
          sub: v < 0 ? t("Legenda aparece antes") : v > 0 ? t("Legenda aparece depois") : t("Sem ajuste"),
          value: v,
          checked: renderer.offset() === v
        };
      }), {
        onPick: function onPick(v) {
          return setSubDelay(v);
        }
      });
    }
    function sizeMenu() {
      var vals = [70, 85, 100, 115, 130, 150];
      var cur = settings().subtitleSize || 100;
      menu(t("Tamanho da legenda"), vals.map(function (v) {
        return {
          label: v + "%",
          value: v,
          checked: v === cur
        };
      }), {
        onPick: function onPick(v) {
          var next = saveSettings({
            subtitleSize: v
          });
          apply(subsEl, next);
          if (currentSub.kind === "embedded") applyNative(mediaId(), next);
        }
      });
    }
    function sourcesMenu() {
      var list2 = (opts.streams || []).map(function (s, i) {
        return {
          label: ((s.name || s.addon || "") + "").replace(/\n/g, " "),
          sub: ((s.title || s.description || "") + "").replace(/\n/g, " · "),
          value: i,
          checked: s === stream
        };
      });
      menu(t("Fontes"), list2, {
        onPick: function onPick(i) {
          var s = opts.streams[i];
          if (!s || s === stream) return;
          if (needsServer(s) && !isAvailable()) return toast(t("Essa fonte precisa do servidor do PC."));
          saveProgress2();
          pendingStart = videoEl.currentTime * 1e3;
          stream = s;
          triedTranscode = false;
          autoDone = {
            sub: false,
            audio: false
          };
          start3();
        }
      });
    }
    function playNext() {
      var nv = nextVideo();
      if (!nv) return;
      saveProgress2();
      onStop(frac());
      var group = stream.behaviorHints && stream.behaviorHints.bingeGroup;
      showSpinner(true);
      message(t("Procurando o próximo episódio..."));
      fetchStreams(meta.type, nv.id).then(function (list2) {
        if (!alive) return;
        var match = group ? list2.find(function (s) {
          return s.behaviorHints && s.behaviorHints.bingeGroup === group;
        }) : null;
        if (match && (!needsServer(match) || isAvailable())) {
          video = nv;
          stream = match;
          opts.streams = list2;
          pendingStart = 0;
          triedTranscode = false;
          autoDone = {
            sub: false,
            audio: false
          };
          start3();
        } else {
          pop();
          openDetails(meta.type, meta.id, {
            videoId: nv.id,
            autoStreams: true
          });
        }
      });
    }
    function saveProgress2() {
      var d = videoEl.duration;
      if (!(d > 0) || !isFinite(d) || !videoEl.currentTime) return;
      var delta = watchedDelta;
      watchedDelta = 0;
      if (meta.id === "dev") return;
      record(video.id, videoEl.currentTime / d);
      onProgress(videoEl.currentTime / d);
      saveProgress(meta, video.id, videoEl.currentTime * 1e3, d * 1e3, delta);
    }
    function onKey(e) {
      var k = e.keyCode;
      var cur = current2();
      if (upNextTimer && (k === KEY.BACK || k === KEY.ESC || k === KEY.BACKSPACE)) {
        upNextStop(true);
        return true;
      }
      if (upNextTimer && cur && upNextBox.contains(cur)) return false;
      if (postPlayOn) {
        if (k === KEY.BACK || k === KEY.ESC || k === KEY.BACKSPACE) {
          pop();
          return true;
        }
        return false;
      }
      if (k === KEY.CH_UP || k === KEY.YELLOW) {
        nudgeSubs(1);
        return true;
      }
      if (k === KEY.CH_DOWN || k === KEY.BLUE) {
        nudgeSubs(-1);
        return true;
      }
      switch (k) {
        case KEY.PLAY:
          videoEl.play();
          showControls();
          return true;
        case KEY.PAUSE:
          videoEl.pause();
          return true;
        case KEY.PLAYPAUSE:
          togglePlay();
          return true;
        case KEY.STOP:
          close();
          return true;
        case KEY.FF:
          seekBy(1);
          return true;
        case KEY.RW:
          seekBy(-1);
          return true;
        case KEY.BACK:
        case KEY.ESC:
        case KEY.BACKSPACE:
          if (seekTarget !== null) cancelSeek();else if (activeSeg && !controlsOn) dismissSkip();else if (controlsOn && !videoEl.paused) hideControls();else close();
          return true;
      }
      if (!controlsOn && activeSeg) {
        if (k === KEY.ENTER) {
          doSkip();
          return true;
        }
      }
      if (activeSeg && k === KEY.UP && cur !== skipBtn) {
        showControls(skipBtn);
        focus(skipBtn, {
          noScroll: true
        });
        return true;
      }
      if (!controlsOn) {
        if (k === KEY.LEFT) seekBy(-1);else if (k === KEY.RIGHT) seekBy(1);else if (k === KEY.ENTER) togglePlay();else if (k === KEY.DOWN) showControls(playBtn);else showControls(bar);
        return true;
      }
      scheduleHide();
      if (cur === bar) {
        if (k === KEY.LEFT) {
          seekBy(-1);
          return true;
        }
        if (k === KEY.RIGHT) {
          seekBy(1);
          return true;
        }
        if (k === KEY.UP) {
          hideControls();
          return true;
        }
      }
      return false;
    }
    function close() {
      saveProgress2();
      pop();
    }
    return {
      el: el,
      onKey: onKey,
      onShow: function onShow() {
        if (!ticker) {
          start3();
          ticker = setInterval(function () {
            if (controlsOn) updateTimes();
            renderer.update(videoEl.currentTime);
            checkSkip();
            if (!nativeOffDone && !(currentSub.kind === "embedded" && !currentSub.extracted)) nativeSubsOff();
            if (currentSub.extracted) ensureSegments();
          }, 250);
          saveTimer = setInterval(function () {
            if (!videoEl.paused) saveProgress2();
          }, SAVE_MS);
          watchTimer = setInterval(watchdog, 2e3);
          if ("") statusTimer = setInterval(function () {
            return !videoEl.paused && diag("status");
          }, 1e4);
        }
        showControls(bar);
      },
      onBack: function onBack() {
        close();
        return true;
      },
      destroy: function destroy() {
        alive = false;
        clearTimeout(sleepTimer);
        clearInterval(nowTimer);
        onSeek(null);
        nowPlaying(null);
        clearInterval(ticker);
        clearInterval(saveTimer);
        clearInterval(watchTimer);
        clearInterval(statusTimer);
        clearTimeout(hideTimer);
        clearTimeout(seekCommitTimer);
        disableEmbeddedSubs();
        stop();
        try {
          videoEl.pause();
          videoEl.removeAttribute("src");
          videoEl.load();
        } catch (e) {}
        if (videoEl.isAVPlay) {
          videoEl.destroy();
          document.documentElement.classList.remove("av-playing");
        }
      }
    };
  }

  // src/js/views/person.js
  function age(birthday, deathday) {
    var b = new Date(birthday);
    if (isNaN(b.getTime())) return null;
    var end = deathday ? new Date(deathday) : /* @__PURE__ */new Date();
    var a = end.getFullYear() - b.getFullYear();
    if (end.getMonth() < b.getMonth() || end.getMonth() === b.getMonth() && end.getDate() < b.getDate()) a--;
    return a;
  }
  function longDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    try {
      return d.toLocaleDateString(current() === "ar" ? "ar" : "en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch (e) {
      return iso;
    }
  }
  function PersonView(personId, name) {
    var el = h("div.view");
    var scroller = h("div.scroll-y", {
      "data-scroll-y": ""
    });
    var head = h("div.person-head");
    var grid = h("div.grid");
    scroller.appendChild(head);
    scroller.appendChild(grid);
    el.appendChild(scroller);
    head.appendChild(h("div.person-name", {
      text: name || ""
    }));
    head.appendChild(spinnerLine(t("Carregando...")));
    person(personId).then(function (p) {
      clear(head);
      if (p.photo) head.appendChild(h("img.person-photo", {
        src: p.photo,
        alt: ""
      }));
      var facts = [];
      var years = age(p.birthday, p.deathday);
      if (p.birthday) facts.push(t("Nascimento: {date}", {
        date: longDate(p.birthday)
      }) + (years !== null && !p.deathday ? " · " + t("{n} anos", {
        n: years
      }) : ""));
      if (p.deathday) facts.push(t("Falecimento: {date}", {
        date: longDate(p.deathday)
      }) + (years !== null ? " · " + t("{n} anos", {
        n: years
      }) : ""));
      if (p.place) facts.push(t("Local de nascimento: {place}", {
        place: p.place
      }));
      head.appendChild(h("div.person-info", {
        focusable: true
      }, [h("div.person-name", {
        text: p.name
      }), p.department ? h("div.person-dept", {
        text: t(p.department === "Directing" ? "Direção" : "Atuação")
      }) : null, h("div.person-facts", null, facts.map(function (f) {
        return h("div", {
          text: f
        });
      })), p.biography ? h("div.person-bio", {
        text: p.biography
      }) : h("div.person-bio.empty", {
        text: t("Sem biografia disponível.")
      })]));
      if (!p.credits.length) return;
      scroller.insertBefore(h("div.row-title.person-credits", {
        text: t("Filmes e séries")
      }), grid);
      p.credits.forEach(function (c) {
        grid.appendChild(card({
          name: c.name,
          poster: c.poster
        }, {
          title: c.name + (c.year ? " (" + c.year + ")" : ""),
          onSelect: function onSelect() {
            toast(t("Abrindo {name}...", {
              name: c.name
            }), 2e3);
            tmdbImdb(c.type, c.tmdb).then(function (imdb) {
              if (!imdb) return toast(t("Esse título ainda não tem página no Stremio."), 4e3);
              openDetails(c.type === "tv" ? "series" : "movie", imdb);
            });
          }
        }));
      });
      loadVisibleImages(el, 600);
    }).catch(function () {
      clear(head);
      head.appendChild(h("div.hint", {
        text: t("Não foi possível carregar este perfil.")
      }));
    });
    return {
      el: el,
      onShow: function onShow() {
        return loadVisibleImages(el, 600);
      }
    };
  }

  // src/js/views/trailer.js
  function trailerIds(meta) {
    var ids2 = [];
    (meta.trailerStreams || []).forEach(function (s) {
      return s && s.ytId && ids2.push(s.ytId);
    });
    (meta.trailers || []).forEach(function (tr) {
      return tr && tr.source && (!tr.type || tr.type === "Trailer") && ids2.push(tr.source);
    });
    return ids2.filter(function (id, i) {
      return /^[\w-]{11}$/.test(id) && ids2.indexOf(id) === i;
    });
  }
  function openTrailer(ids2, title) {
    push(TrailerView(ids2, title));
  }
  function TrailerView(ids2, title) {
    var index2 = 0;
    var playing3 = true;
    var el = h("div.view.trailer");
    var frame = h("iframe.trailer-frame", {
      tabindex: "-1",
      allow: "autoplay; encrypted-media",
      allowfullscreen: "",
      referrerpolicy: "origin"
    });
    var hint = h("div.trailer-hint", {
      text: title + "  ·  " + t("Voltar fecha o trailer")
    });
    el.appendChild(frame);
    el.appendChild(hint);
    el.appendChild(h("div.trailer-focus", {
      focusable: true
    }));
    function load7() {
      var params = "autoplay=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&enablejsapi=1&hl=" + current();
      frame.src = "https://www.youtube-nocookie.com/embed/" + ids2[index2] + "?" + params;
      playing3 = true;
    }
    function command(func, args) {
      try {
        frame.contentWindow.postMessage(JSON.stringify({
          event: "command",
          func: func,
          args: args || []
        }), "*");
      } catch (e) {}
    }
    var hintTimer = setTimeout(function () {
      return hint.classList.add("faded");
    }, 4e3);
    function showHint() {
      hint.classList.remove("faded");
      clearTimeout(hintTimer);
      hintTimer = setTimeout(function () {
        return hint.classList.add("faded");
      }, 3e3);
    }
    load7();
    return {
      el: el,
      onKey: function onKey(e) {
        var k = e.keyCode;
        showHint();
        if (k === KEY.PLAYPAUSE || k === KEY.PLAY || k === KEY.PAUSE || k === KEY.ENTER) {
          playing3 = k === KEY.PLAY ? true : k === KEY.PAUSE ? false : !playing3;
          command(playing3 ? "playVideo" : "pauseVideo");
          return true;
        }
        if ((k === KEY.RIGHT || k === KEY.FF) && ids2.length > 1) {
          index2 = (index2 + 1) % ids2.length;
          load7();
          return true;
        }
        if (k === KEY.LEFT || k === KEY.RW) {
          if (ids2.length > 1 && k === KEY.LEFT) {
            index2 = (index2 - 1 + ids2.length) % ids2.length;
            load7();
          }
          return true;
        }
        return k === KEY.UP || k === KEY.DOWN;
      },
      destroy: function destroy() {
        clearTimeout(hintTimer);
        frame.src = "about:blank";
      }
    };
  }

  // src/js/api/parental.js
  var API3 = "https://api.tiffara.com/titles/";
  var CATS = [{
    key: "SEXUAL_CONTENT",
    label: "Nudez"
  }, {
    key: "VIOLENCE",
    label: "Violência"
  }, {
    key: "PROFANITY",
    label: "Palavrões"
  }, {
    key: "ALCOHOL_DRUGS",
    label: "Álcool e drogas"
  }, {
    key: "FRIGHTENING_INTENSE_SCENES",
    label: "Cenas assustadoras"
  }];
  var cache3 = {};
  function severity(cat) {
    var list2 = (cat && cat.severityBreakdowns || []).map(function (x) {
      return {
        level: String(x.severityLevel || "").toLowerCase(),
        votes: +x.voteCount || 0
      };
    });
    var none = (list2.find(function (x) {
      return x.level === "none";
    }) || {
      votes: 0
    }).votes;
    var top2 = list2.filter(function (x) {
      return x.level && x.level !== "none";
    }).sort(function (a, b) {
      return b.votes - a.votes;
    })[0];
    return top2 && top2.votes > none ? top2.level : null;
  }
  function guide(imdbId) {
    var id = (String(imdbId || "").match(/^tt\d+/) || [])[0];
    if (!id) return Promise.resolve([]);
    if (cache3[id]) return cache3[id];
    var p = getJSONViaProxy(API3 + id + "/parentsGuide", {
      timeout: 6e3
    }).then(function (r) {
      var map = {};
      (r && r.parentsGuide || []).forEach(function (c) {
        return map[String(c.category || "").toUpperCase()] = c;
      });
      return CATS.map(function (c) {
        return {
          label: c.label,
          level: severity(map[c.key])
        };
      }).filter(function (x) {
        return x.level;
      });
    }).catch(function () {
      delete cache3[id];
      return [];
    });
    cache3[id] = p;
    return p;
  }

  // src/js/lib/badges.js
  var KINDS2 = [{
    id: "quality",
    label: "Qualidade (4K, 1080p, 720p)",
    dflt: true
  }, {
    id: "hdr",
    label: "HDR e Dolby Vision",
    dflt: true
  }, {
    id: "remux",
    label: "REMUX",
    dflt: true
  }, {
    id: "codec",
    label: "Codec (HEVC, AV1)",
    dflt: false
  }, {
    id: "audio",
    label: "Áudio (Atmos, DTS, 5.1)",
    dflt: true
  }, {
    id: "lang",
    label: "Idioma (Árabe, Multi)",
    dflt: true
  }, {
    id: "size",
    label: "Tamanho do arquivo",
    dflt: false
  }, {
    id: "bitrate",
    label: "Taxa estimada (Mbps)",
    dflt: true
  }];
  function streamBadgeSettings() {
    var saved = settings().streamBadges || {};
    var out = {};
    KINDS2.forEach(function (k) {
      return out[k.id] = saved[k.id] === void 0 ? k.dflt : !!saved[k.id];
    });
    return out;
  }
  function setBadge(kind, on) {
    var cur = streamBadgeSettings();
    cur[kind] = on;
    saveSettings({
      streamBadges: cur
    });
  }

  // src/js/views/details.js
  function openDetails(type, id, opts) {
    push(DetailsView(type, id, opts || {}));
  }
  function sortedVideos(meta) {
    return (meta.videos || []).filter(function (v) {
      return v && v.id;
    }).slice().sort(function (a, b) {
      var sa = a.season === 0 ? 9999 : a.season || 0;
      var sb = b.season === 0 ? 9999 : b.season || 0;
      return sa - sb || (a.episode || 0) - (b.episode || 0);
    });
  }
  var SMART_WAIT_MS = 1e4;
  var SMART_FALLBACKS = 4;
  function DetailsView(type, id, opts) {
    var el = h("div.view");
    var bg = h("img.details-bg", {
      alt: ""
    });
    var info2 = h("div.details-info", null, spinnerLine(t("Carregando...")));
    var panel = h("div.details-panel");
    el.appendChild(bg);
    el.appendChild(h("div.details-shade"));
    el.appendChild(info2);
    el.appendChild(panel);
    var meta = null;
    var mode = "none";
    var season = null;
    var streamsVideo = null;
    var alive = true;
    var watchBtn = null;
    var libBtn = null;
    var tmdbInfo = null;
    var ui_collBtn = null;
    var isSeries = function isSeries() {
      return meta && sortedVideos(meta).length > 0 && meta.type !== "movie";
    };
    function movieVideoId() {
      return meta.behaviorHints && meta.behaviorHints.defaultVideoId || meta.id;
    }
    function nextUpVideo() {
      var vids = sortedVideos(meta);
      var li = libraryItem(meta.id);
      if (li && li.state && li.state.video_id) {
        var i = vids.findIndex(function (v) {
          return v.id === li.state.video_id;
        });
        if (i >= 0) return vids[i];
      }
      return vids.filter(function (v) {
        return v.season !== 0;
      })[0] || vids[0];
    }
    function renderInfo() {
      clear(info2);
      var logo2 = h("img.details-logo", {
        alt: ""
      });
      var title = h("div.details-title", {
        text: meta.name
      });
      title.style.display = "none";
      logo2.onerror = function () {
        logo2.style.display = "none";
        title.style.display = "";
      };
      logo2.src = meta.logo || logo(meta.id);
      var parts = [];
      if (meta.releaseInfo || meta.year) parts.push(meta.releaseInfo || meta.year);
      if (meta.runtime) parts.push(meta.runtime);
      if (isSeries()) {
        var seasons = uniqueSeasons().filter(function (s) {
          return s !== 0;
        });
        if (seasons.length) parts.push(t(seasons.length > 1 ? "{n} temporadas" : "{n} temporada", {
          n: seasons.length
        }));
      }
      var metaLine = h("div.details-meta", {
        text: parts.join("  ·  ")
      });
      var ratingsEl = h("div.ratings");
      renderRatings(ratingsEl, meta.imdbRating ? [{
        cls: "imdb",
        label: "IMDb",
        value: String(meta.imdbRating)
      }] : []);
      var genres = h("div.details-genres", null, (meta.genres || meta.genre || []).slice(0, 5).map(function (g) {
        return h("span", {
          text: g
        });
      }));
      var desc = h("div.details-desc", {
        text: meta.description || ""
      });
      var cast = (meta.cast || []).slice(0, 5);
      var director = (meta.director || []).slice(0, 2);
      var castLine = h("div.details-cast", null, [director.length ? h("b", {
        text: t("Direção: ")
      }) : null, director.length ? director.join(", ") + "   " : null, cast.length ? h("b", {
        text: t("Elenco: ")
      }) : null, cast.length ? cast.join(", ") : null]);
      watchBtn = h("div.btn.primary", {
        focusable: true,
        "data-autofocus": "",
        onSelect: function onSelect() {
          return onWatch(smartOn());
        }
      });
      libBtn = h("div.btn", {
        focusable: true,
        onSelect: toggleLibrary
      });
      var sourcesBtn = smartOn() ? h("div.btn", {
        focusable: true,
        onSelect: function onSelect() {
          return onWatch(false);
        }
      }, [h("span.ico", {
        text: "☰"
      }), t("Fontes")]) : null;
      var trailers = trailerIds(meta);
      var trailerBtn = trailers.length ? h("div.btn", {
        focusable: true,
        onSelect: function onSelect() {
          return openTrailer(trailers, meta.name);
        }
      }, [h("span.ico", {
        text: "🎬"
      }), t("Trailer")]) : null;
      var collBtn = h("div.btn", {
        focusable: true,
        onSelect: function onSelect() {
          return collectionMenu(meta, tmdbInfo && tmdbInfo.collection);
        }
      }, [h("span.ico", {
        text: "🎞"
      }), t("Coleção")]);
      ui_collBtn = collBtn;
      updateButtons();
      info2.appendChild(logo2);
      info2.appendChild(title);
      info2.appendChild(metaLine);
      info2.appendChild(ratingsEl);
      info2.appendChild(genres);
      if (settings().parentalGuide) {
        var guideEl = h("div.details-guide");
        guideEl.style.display = "none";
        info2.appendChild(guideEl);
        guide(meta.imdb_id || meta.id).then(function (list2) {
          if (!list2.length) return;
          var LV = {
            mild: t("Leve"),
            moderate: t("Moderado"),
            severe: t("Forte")
          };
          list2.forEach(function (g) {
            return guideEl.appendChild(h("span", {
              cls: "lv-" + g.level
            }, [h("b", {
              text: t(g.label)
            }), " " + (LV[g.level] || g.level)]));
          });
          guideEl.style.display = "";
        });
      }
      info2.appendChild(desc);
      info2.appendChild(castLine);
      info2.appendChild(h("div.details-buttons", {
        "data-group": ""
      }, [watchBtn, sourcesBtn, trailerBtn, collBtn, libBtn]));
      loadExtras({
        logo: logo2,
        title: title,
        desc: desc,
        castLine: castLine,
        ratingsEl: ratingsEl
      });
    }
    function renderRatings(el2, list2) {
      clear(el2);
      list2.forEach(function (r) {
        return el2.appendChild(h("span.rating", {
          cls: r.cls
        }, [h("b", {
          text: r.label
        }), r.value]));
      });
      el2.style.display = list2.length ? "" : "none";
    }
    function loadExtras(ui) {
      ratings(meta, isAnime(meta)).then(function (list2) {
        return alive && renderRatings(ui.ratingsEl, list2);
      }).catch(function () {});
      if (!hasTmdb()) return;
      localized(meta).then(function (loc) {
        if (!alive || !loc) return;
        tmdbInfo = loc;
        if (loc.collection && ui_collBtn) ui_collBtn.style.display = "";
        if (loc.overview) ui.desc.textContent = loc.overview;
        if (loc.title) ui.title.textContent = loc.title;
        if (loc.logo) {
          ui.logo.style.display = "";
          ui.title.style.display = "none";
          ui.logo.src = loc.logo;
        }
        if (loc.cast.length) {
          var row = h("div.cast-row", {
            "data-group": ""
          }, loc.cast.slice(0, 7).map(function (c) {
            return h("div.cast", {
              focusable: true,
              onSelect: function onSelect() {
                return push(PersonView(c.id, c.name));
              }
            }, [h("div.ph", null, c.photo ? h("img", {
              src: c.photo,
              alt: ""
            }) : null), h("div.nm", {
              text: c.name
            }), h("div.ch", {
              text: c.character
            })]);
          }));
          ui.castLine.parentNode.replaceChild(row, ui.castLine);
        }
        if (mode === "episodes") localizeEpisodes();
      }).catch(function () {});
    }
    function localizeEpisodes() {
      if (!tmdbInfo || tmdbInfo.tmdbType !== "tv" || season === null) return;
      var forSeason = season;
      seasonPt(tmdbInfo.tmdbId, season).then(function (map) {
        if (!alive || mode !== "episodes" || forSeason !== season) return;
        Array.prototype.forEach.call(panel.querySelectorAll(".episode"), function (row) {
          var ep = map[row.__episode];
          if (!ep) return;
          if (ep.name) row.querySelector(".ep-title").textContent = row.__episode + ". " + ep.name;
          if (ep.overview) row.querySelector(".ep-desc").textContent = ep.overview;
        });
      }).catch(function () {});
    }
    function updateButtons() {
      var li = libraryItem(meta.id);
      var label = t("Assistir");
      if (li && li.state && li.state.timeOffset > 0) {
        var ep = isSeries() ? sortedVideos(meta).find(function (v) {
          return v.id === li.state.video_id;
        }) : null;
        label = t("Continuar") + (ep ? " " + epLabel(ep.season, ep.episode) : "");
      }
      watchBtn.innerHTML = '<span class="ico">▶</span>' + label;
      libBtn.innerHTML = isInLibrary(meta.id) ? '<span class="ico">✓</span>' + t("Na biblioteca") : '<span class="ico">＋</span>' + t("Biblioteca");
    }
    function smartOn() {
      return settings().smartChoice !== false;
    }
    function onWatch(smart) {
      if (isSeries()) {
        var v = nextUpVideo();
        if (v) showStreams(v, true, smart);
      } else {
        showStreams({
          id: movieVideoId(),
          title: meta.name
        }, true, smart);
      }
    }
    function toggleLibrary() {
      var inLib = isInLibrary(meta.id);
      setInLibrary(meta, !inLib).then(function () {
        updateButtons();
        toast(inLib ? t("Removido da biblioteca") : t("Adicionado à biblioteca"));
      });
    }
    function uniqueSeasons() {
      var out = [];
      sortedVideos(meta).forEach(function (v) {
        var s = v.season || 0;
        if (out.indexOf(s) < 0) out.push(s);
      });
      return out;
    }
    function showEpisodes(focusVideoId) {
      mode = "episodes";
      clear(panel);
      var seasons = uniqueSeasons();
      if (season === null) {
        var nu = nextUpVideo();
        season = nu ? nu.season || 0 : seasons[0];
      }
      panel.appendChild(h("div.panel-head", null, h("h2", {
        text: t("Episódios")
      })));
      var chips = h("div.seasons", {
        "data-scroll-x": "",
        "data-group": "",
        "data-pad": "60"
      }, seasons.map(function (s) {
        return h("div.chip", {
          focusable: true,
          cls: s === season ? "active" : "",
          text: s === 0 ? t("Especiais") : t("Temporada {n}", {
            n: s
          }),
          onSelect: function onSelect() {
            season = s;
            showEpisodes();
            var first = panel.querySelector(".episode");
            if (first) focus(first);
          }
        });
      }));
      panel.appendChild(chips);
      var list2 = h("div.list", {
        "data-scroll-y": "",
        "data-pad-y": "120",
        "data-group": "",
        "data-vertical": ""
      });
      list2.style.top = "190px";
      var li = libraryItem(meta.id);
      var focusEl = null;
      sortedVideos(meta).filter(function (v) {
        return (v.season || 0) === season;
      }).forEach(function (v) {
        var thumb = h("div.thumb");
        if (v.thumbnail) {
          var im = h("img", {
            alt: ""
          });
          im.setAttribute("data-lazy", smallThumb(v.thumbnail));
          im.onerror = function () {
            return im.style.display = "none";
          };
          thumb.appendChild(im);
        }
        var sub = t("Episódio {n}", {
          n: v.episode || "?"
        });
        if (v.released) sub += " · " + formatDate(v.released);
        var inProgress = li && li.state && li.state.video_id === v.id && li.state.timeOffset > 0;
        if (inProgress) sub += " · " + t("parou em {time}", {
          time: fmtTime(li.state.timeOffset / 1e3)
        });
        var done = isWatched(v.id);
        var part = done ? 0 : progress(v.id) || (inProgress && li.state.duration ? li.state.timeOffset / li.state.duration : 0);
        if (done) thumb.appendChild(h("div.ep-watched", {
          text: "✓"
        }));else if (part > 0) thumb.appendChild(h("div.progress", null, h("i", {
          style: {
            width: Math.round(part * 100) + "%"
          }
        })));
        var row = h("div.episode", {
          focusable: true,
          cls: done ? "watched" : "",
          onSelect: function onSelect() {
            return showStreams(v, true);
          }
        }, [thumb, h("div.ep-info", null, [h("div.ep-title", {
          text: (v.episode ? v.episode + ". " : "") + (v.name || v.title || t("Episódio"))
        }), h("div.ep-sub", {
          text: sub
        }), h("div.ep-desc", {
          text: v.overview || v.description || ""
        })])]);
        row.__episode = v.episode;
        if (v.id === focusVideoId || !focusVideoId && inProgress) focusEl = row;
        list2.appendChild(row);
      });
      panel.appendChild(list2);
      list2.__last = focusEl || list2.firstChild;
      localizeEpisodes();
      loadVisibleImages(panel, 300);
      if (focusEl && focusVideoId) setTimeout(function () {
        return focus(focusEl);
      }, 0);
    }
    function addonRank(a) {
      var n = (a.manifest.name || "") + " " + a.transportUrl;
      if (/realdebrid|alldebrid|premiumize|debridlink|torbox|easydebrid|offcloud|\bRD\b/i.test(n)) return 0;
      if (/torrentio/i.test(n)) return 1;
      return 2;
    }
    function runtimeMinutes() {
      var r = String(meta.runtime || "");
      var hMatch = r.match(/(\d+)\s*h/i);
      var mMatch = r.match(/(\d+)\s*min/i);
      var mins = (hMatch ? parseInt(hMatch[1], 10) * 60 : 0) + (mMatch ? parseInt(mMatch[1], 10) : 0);
      return mins || (isSeries() ? 45 : 110);
    }
    function streamBadges(s) {
      var text = (s.name || "") + " " + (s.title || s.description || "") + " " + (s.behaviorHints && s.behaviorHints.filename || "");
      var on = streamBadgeSettings();
      var out = [];
      var add = function add(kind, b) {
        return out.push(Object.assign({
          kind: kind,
          hide: on[kind] === false
        }, b));
      };
      if (/2160p|\b4k\b|uhd/i.test(text)) add("quality", {
        t: "4K"
      });else if (/1080p/i.test(text)) add("quality", {
        t: "1080p"
      });else if (/720p/i.test(text)) add("quality", {
        t: "720p"
      });
      if (/dolby.?vision|\bdovi\b|\bdv\b/i.test(text)) add("hdr", {
        t: "Dolby Vision",
        warn: true
      });else if (/hdr/i.test(text)) add("hdr", {
        t: "HDR"
      });
      if (/remux/i.test(text)) add("remux", {
        t: "REMUX",
        warn: true
      });
      if (/\b(hevc|x265|h\.?265)\b/i.test(text)) add("codec", {
        t: "HEVC"
      });else if (/\bav1\b/i.test(text)) add("codec", {
        t: "AV1"
      });
      if (/atmos/i.test(text)) add("audio", {
        t: "Atmos"
      });else if (/truehd/i.test(text)) add("audio", {
        t: "TrueHD"
      });else if (/\bdts/i.test(text)) add("audio", {
        t: "DTS"
      });
      if (/\b7[ .]1\b/.test(text)) add("audio", {
        t: "7.1"
      });else if (/\b5[ .]1\b/.test(text)) add("audio", {
        t: "5.1"
      });
      if (/arabic|\bara\b|عربي/i.test(text)) add("lang", {
        t: t("Árabe")
      });else if (/\bmulti\b/i.test(text)) add("lang", {
        t: "Multi"
      });
      var m = text.match(/(\d+(?:[.,]\d+)?)\s*(GB|MB)\b/i);
      if (m) {
        var mb = parseFloat(m[1].replace(",", ".")) * (m[2].toUpperCase() === "GB" ? 1024 : 1);
        add("size", {
          t: m[1].replace(",", ".") + " " + m[2].toUpperCase()
        });
        var mbps = Math.round(mb * 8 / (runtimeMinutes() * 60));
        if (mbps > 0) add("bitrate", {
          t: "~" + mbps + " Mbps",
          warn: mbps > 30
        });
      }
      return out;
    }
    function showStreams(video, focusFirst2, smart) {
      mode = "streams";
      streamsVideo = video;
      clear(panel);
      var head = isSeries() ? epLabel(video.season, video.episode) + " · " + (video.name || video.title || "") : t("Fontes");
      var filterBtn = h("div.btn.small", {
        focusable: true,
        text: t("Todos ▾"),
        onSelect: function onSelect() {
          return filterMenu();
        }
      });
      panel.appendChild(h("div.panel-head", {
        "data-group": ""
      }, [h("h2", {
        text: head
      }), filterBtn]));
      var sub = h("div.panel-sub");
      var barFill = h("i");
      panel.appendChild(sub);
      panel.appendChild(h("div.load-bar", null, barFill));
      var list2 = h("div.list", {
        "data-scroll-y": "",
        "data-pad-y": "120",
        "data-group": "",
        "data-vertical": ""
      });
      list2.style.top = "178px";
      panel.appendChild(list2);
      var srcs = withResource("stream", meta.type, video.id).map(function (a, i) {
        return {
          a: a,
          i: i
        };
      }).sort(function (x, y) {
        return addonRank(x.a) - addonRank(y.a) || x.i - y.i;
      }).map(function (x) {
        return x.a;
      });
      if (!srcs.length) {
        list2.appendChild(h("div.loading-line", {
          text: t("Nenhum addon de streams instalado (ex.: Torrentio). Instale pela sua conta Stremio.")
        }));
        return;
      }
      var groups = srcs.map(function (a) {
        var el2 = h("div.stream-group");
        list2.appendChild(el2);
        return {
          addon: a,
          el: el2,
          count: 0,
          done: false
        };
      });
      var loadingLine = spinnerLine(t("Buscando fontes nos addons..."));
      list2.appendChild(loadingLine);
      var filter = "all";
      var pendingCount = srcs.length;
      var all2 = [];
      var autoFocused = null;
      var serverOk = isAvailable();
      var smartActive = !!smart;
      var smartTimer = smartActive ? setTimeout(function () {
        return decideSmart(true);
      }, SMART_WAIT_MS) : null;
      function stopSmart() {
        smartActive = false;
        clearTimeout(smartTimer);
      }
      function smartCandidates() {
        var out = [];
        groups.forEach(function (g, gi) {
          (g.streams || []).forEach(function (s, si) {
            if (!isPlayableType(s)) return;
            var needs = needsServer(s);
            if (needs && !serverOk) return;
            var badges = streamBadges(s);
            var warn = badges.some(function (b) {
              return b.warn;
            });
            var heavy = badges.some(function (b) {
              return b.t === "4K" || b.t === "HDR";
            });
            out.push({
              s: s,
              key: [needs ? 1 : 0, warn ? 1 : 0, heavy ? 1 : 0, gi, si]
            });
          });
        });
        out.sort(function (x, y) {
          for (var i = 0; i < 5; i++) if (x.key[i] !== y.key[i]) return x.key[i] - y.key[i];
          return 0;
        });
        return out.map(function (c) {
          return c.s;
        });
      }
      function decideSmart(timedOut) {
        if (!smartActive || !alive || streamsVideo !== video) return;
        if (focusFirst2 && autoFocused && current2() !== autoFocused) return stopSmart();
        var list3 = smartCandidates();
        var debridPending = groups.some(function (g) {
          return addonRank(g.addon) === 0 && !g.done;
        });
        var best = list3[0];
        var clean = best && !needsServer(best) && !streamBadges(best).some(function (b) {
          return b.warn;
        });
        if (!best) {
          if (pendingCount <= 0 || timedOut) {
            stopSmart();
            if (pendingCount <= 0) toast(t("Escolha inteligente: nenhuma fonte que a TV toque. Escolha na lista."), 5e3);
          }
          return;
        }
        if (pendingCount > 0 && !timedOut && (debridPending || !clean)) return;
        stopSmart();
        play(video, best, all2, list3.slice(1, 1 + SMART_FALLBACKS));
      }
      function status2() {
        if (smartActive) {
          sub.textContent = t("Escolha inteligente: procurando a melhor fonte...") + "  ·  " + t("aperte uma seta para escolher você");
          barFill.style.width = Math.round((srcs.length - pendingCount) / srcs.length * 100) + "%";
          return;
        }
        var srv = serverOk ? t("Servidor do PC conectado") : t("Servidor do PC não conectado: só links diretos");
        sub.textContent = srv + (pendingCount > 0 ? "  ·  " + t("{n} addon(s) ainda carregando", {
          n: pendingCount
        }) : "  ·  " + t("{n} fontes", {
          n: all2.length
        }));
        barFill.style.width = Math.round((srcs.length - pendingCount) / srcs.length * 100) + "%";
        var g = groups.find(function (x) {
          return x.addon.transportUrl === filter;
        });
        filterBtn.textContent = (g ? g.addon.manifest.name : t("Todos")) + " ▾";
      }
      function firstVisibleItem() {
        var items3 = list2.querySelectorAll(".stream");
        for (var i = 0; i < items3.length; i++) if (items3[i].offsetParent !== null && !items3[i].classList.contains("disabled")) return items3[i];
        return null;
      }
      function applyFilter() {
        groups.forEach(function (g) {
          return g.el.style.display = filter === "all" || filter === g.addon.transportUrl ? "" : "none";
        });
        list2.scrollTop = 0;
        status2();
        var first = firstVisibleItem();
        if (first) focus(first);
      }
      function filterMenu() {
        var opts2 = [{
          label: t("Todos"),
          sub: t("{n} fontes", {
            n: all2.length
          }),
          value: "all",
          checked: filter === "all"
        }].concat(groups.map(function (g) {
          return {
            label: g.addon.manifest.name || g.addon.manifest.id,
            sub: g.done ? t("{n} fontes", {
              n: g.count
            }) : t("carregando..."),
            value: g.addon.transportUrl,
            checked: filter === g.addon.transportUrl
          };
        }));
        menu(t("Mostrar fontes de"), opts2, {
          onPick: function onPick(v) {
            filter = v;
            applyFilter();
          }
        });
      }
      status2();
      (serverOk ? Promise.resolve() : check().then(function (r) {
        return serverOk = r.ok;
      })).then(function () {
        status2();
        return fetchStreams(meta.type, video.id, function (addon, streams2) {
          if (!alive || streamsVideo !== video) return;
          pendingCount--;
          var g = groups.find(function (x) {
            return x.addon === addon;
          });
          if (g) {
            g.done = true;
            g.count = streams2.length;
            g.streams = streams2;
            streams2.forEach(function (s) {
              all2.push(s);
              g.el.appendChild(streamItem(s, video, serverOk, all2));
            });
          }
          if (focusFirst2 && (!autoFocused || current2() === autoFocused)) {
            var first = firstVisibleItem();
            if (first) {
              autoFocused = first;
              focus(first);
            }
          }
          if (pendingCount <= 0) {
            if (loadingLine.parentNode) list2.removeChild(loadingLine);
            if (!all2.length) list2.appendChild(h("div.loading-line", {
              text: t("Nenhuma fonte encontrada.")
            }));
          }
          status2();
          decideSmart(false);
        });
      }).catch(function () {});
    }
    function streamItem(s, video, serverOk, all2) {
      var playableType = isPlayableType(s);
      var needs = needsServer(s);
      var disabled = !playableType || needs && !serverOk;
      var tags = [];
      if (!playableType) tags.push(h("span.s-tag.warn", {
        text: t("Não suportado na TV")
      }));else if (needs) tags.push(h("span.s-tag", {
        cls: serverOk ? "" : "warn",
        text: serverOk ? t("Torrent · via PC") : t("Torrent · precisa do PC")
      }));else if (isTorrent(s) && active()) tags.push(h("span.s-tag.ok", {
        text: t("Torrent · via {name}", {
          name: active().name
        })
      }));else tags.push(h("span.s-tag.ok", {
        text: t("Direto")
      }));
      streamBadges(s).filter(function (b) {
        return !b.hide;
      }).forEach(function (b) {
        return tags.push(h("span.s-tag", {
          cls: b.warn ? "warn" : "",
          text: b.t
        }));
      });
      return h("div.stream", {
        focusable: true,
        cls: disabled ? "disabled" : "",
        onSelect: function onSelect() {
          if (!playableType) return toast(t("Esse tipo de fonte não abre na TV."));
          if (needs && !serverOk) return toast(t("Torrent precisa do stremio-service rodando no PC. Configure em Ajustes."), 5e3);
          play(video, s, all2);
        }
      }, [h("div.s-addon", {
        text: (s.name || s.addon || "").trim()
      }), h("div.s-body", null, [h("div.s-title", {
        text: (s.title || s.description || "").trim()
      }), h("div.s-tags", null, tags)])]);
    }
    function play(video, stream, all2, fallbacks) {
      var li = libraryItem(meta.id);
      var resumeMs = li && li.state && li.state.video_id === video.id ? li.state.timeOffset : 0;
      var start3 = function start3(ms) {
        return openPlayer({
          meta: meta,
          video: video,
          stream: stream,
          streams: all2,
          startTime: ms,
          isSeries: isSeries(),
          fallbacks: fallbacks || []
        });
      };
      if (resumeMs > 3e4) {
        menu(t("Continuar de onde parou?"), [{
          label: t("Continuar de {time}", {
            time: fmtTime(resumeMs / 1e3)
          }),
          value: resumeMs,
          checked: true
        }, {
          label: t("Começar do início"),
          value: 0
        }], {
          center: true,
          onPick: function onPick(v) {
            return start3(v);
          }
        });
      } else start3(0);
    }
    function formatDate(iso) {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
    }
    load().then(function () {
      return fetchMeta(type, id);
    }).then(function (m) {
      if (!alive) return;
      meta = m;
      if (!meta.type) meta.type = type;
      bg.onerror = function () {
        return bg.style.display = "none";
      };
      bg.setAttribute("data-lazy", meta.background || background(meta.id));
      loadVisibleImages(el);
      renderInfo();
      if (isSeries()) {
        if (opts.videoId) {
          var v = sortedVideos(meta).find(function (x) {
            return x.id === opts.videoId;
          });
          if (v) season = v.season || 0;
          if (v && opts.autoStreams) {
            showStreams(v, true);
            return;
          }
        }
        showEpisodes(opts.videoId);
        if (opts.autoStreams) {
          var _v = nextUpVideo();
          if (_v) showStreams(_v, true);
          return;
        }
      } else {
        showStreams({
          id: movieVideoId(),
          title: meta.name
        }, !!opts.autoStreams);
      }
      if (!opts.autoStreams) focus(watchBtn);
    }).catch(function (e) {
      clear(info2);
      info2.appendChild(h("div.details-title", {
        text: t("Não foi possível abrir")
      }));
      info2.appendChild(h("div.details-desc", {
        text: e.message
      }));
      info2.appendChild(h("div.btn", {
        focusable: true,
        "data-autofocus": "",
        text: t("Voltar"),
        onSelect: function onSelect() {
          return pop();
        }
      }));
      focusFirst(el);
    });
    return {
      el: el,
      onShow: function onShow() {
        if (meta && watchBtn) updateButtons();
        loadVisibleImages(panel, 300);
      },
      onBack: function onBack() {
        if (mode === "streams" && isSeries()) {
          var v = streamsVideo;
          showEpisodes(v && v.id);
          return true;
        }
        return false;
      },
      destroy: function destroy() {
        alive = false;
      }
    };
  }

  // src/js/data/franchises.js
  var FRANCHISES = [{
    id: "mcu",
    name: "Marvel Cinematic Universe",
    ar: "عالم مارفل السينمائي (MCU)",
    items: [["tt0371746", "Iron Man", 2008], ["tt0800080", "The Incredible Hulk", 2008], ["tt1228705", "Iron Man 2", 2010], ["tt0800369", "Thor", 2011], ["tt0458339", "Captain America: The First Avenger", 2011], ["tt0848228", "The Avengers", 2012], ["tt1300854", "Iron Man 3", 2013], ["tt1981115", "Thor: The Dark World", 2013], ["tt1843866", "Captain America: The Winter Soldier", 2014], ["tt2015381", "Guardians of the Galaxy", 2014], ["tt2395427", "Avengers: Age of Ultron", 2015], ["tt0478970", "Ant-Man", 2015], ["tt3498820", "Captain America: Civil War", 2016], ["tt1211837", "Doctor Strange", 2016], ["tt3896198", "Guardians of the Galaxy Vol. 2", 2017], ["tt2250912", "Spider-Man: Homecoming", 2017], ["tt3501632", "Thor: Ragnarok", 2017], ["tt1825683", "Black Panther", 2018], ["tt4154756", "Avengers: Infinity War", 2018], ["tt5095030", "Ant-Man and the Wasp", 2018], ["tt4154664", "Captain Marvel", 2019], ["tt4154796", "Avengers: Endgame", 2019], ["tt6320628", "Spider-Man: Far From Home", 2019], ["tt9140560", "WandaVision", 2021, "s"], ["tt9208876", "The Falcon and the Winter Soldier", 2021, "s"], ["tt9140554", "Loki", 2021, "s"], ["tt3480822", "Black Widow", 2021], ["tt10168312", "What If...?", 2021, "s"], ["tt9376612", "Shang-Chi and the Legend of the Ten Rings", 2021], ["tt9032400", "Eternals", 2021], ["tt10160804", "Hawkeye", 2021, "s"], ["tt10872600", "Spider-Man: No Way Home", 2021], ["tt10234724", "Moon Knight", 2022, "s"], ["tt9419884", "Doctor Strange in the Multiverse of Madness", 2022], ["tt10857164", "Ms. Marvel", 2022, "s"], ["tt10648342", "Thor: Love and Thunder", 2022], ["tt10857160", "She-Hulk: Attorney at Law", 2022, "s"], ["tt15318872", "Werewolf by Night", 2022], ["tt9114286", "Black Panther: Wakanda Forever", 2022], ["tt13623136", "The Guardians of the Galaxy Holiday Special", 2022], ["tt10954600", "Ant-Man and the Wasp: Quantumania", 2023], ["tt6791350", "Guardians of the Galaxy Vol. 3", 2023], ["tt13157618", "Secret Invasion", 2023, "s"], ["tt10676048", "The Marvels", 2023], ["tt13966962", "Echo", 2024, "s"], ["tt6263850", "Deadpool & Wolverine", 2024], ["tt15571732", "Agatha All Along", 2024, "s"], ["tt14513804", "Captain America: Brave New World", 2025], ["tt18923754", "Daredevil: Born Again", 2025, "s"], ["tt20969586", "Thunderbolts*", 2025], ["tt13623126", "Ironheart", 2025, "s"], ["tt10676052", "The Fantastic Four: First Steps", 2025]],
    // Disney+'s timeline order.
    chrono: ["tt0458339", "tt4154664", "tt0371746", "tt1228705", "tt0800080", "tt0800369", "tt0848228", "tt1981115", "tt1300854", "tt1843866", "tt2015381", "tt3896198", "tt2395427", "tt0478970", "tt3498820", "tt3480822", "tt1825683", "tt2250912", "tt1211837", "tt3501632", "tt5095030", "tt4154756", "tt4154796", "tt9140554", "tt10168312", "tt9140560", "tt9208876", "tt9376612", "tt9032400", "tt6320628", "tt10872600", "tt10160804", "tt10234724", "tt9419884", "tt10857164", "tt10648342", "tt15318872", "tt10857160", "tt9114286", "tt13623136", "tt13157618", "tt13966962", "tt10954600", "tt6791350", "tt10676048", "tt15571732", "tt6263850", "tt14513804", "tt18923754", "tt20969586", "tt13623126", "tt10676052"]
  }, {
    id: "xmen",
    name: "X-Men",
    ar: "إكس-مين (X-Men)",
    items: [["tt0120903", "X-Men", 2e3], ["tt0290334", "X2", 2003], ["tt0376994", "X-Men: The Last Stand", 2006], ["tt0458525", "X-Men Origins: Wolverine", 2009], ["tt1270798", "X-Men: First Class", 2011], ["tt1430132", "The Wolverine", 2013], ["tt1877832", "X-Men: Days of Future Past", 2014], ["tt1431045", "Deadpool", 2016], ["tt3385516", "X-Men: Apocalypse", 2016], ["tt3315342", "Logan", 2017], ["tt5463162", "Deadpool 2", 2018], ["tt6565702", "Dark Phoenix", 2019], ["tt4682266", "The New Mutants", 2020], ["tt6263850", "Deadpool & Wolverine", 2024]],
    chrono: ["tt1270798", "tt0458525", "tt0120903", "tt0290334", "tt0376994", "tt1430132", "tt1877832", "tt3385516", "tt6565702", "tt4682266", "tt1431045", "tt5463162", "tt3315342", "tt6263850"]
  }, {
    id: "spiderman",
    name: "Spider-Man",
    ar: "سبايدر مان",
    items: [["tt0145487", "Spider-Man", 2002], ["tt0316654", "Spider-Man 2", 2004], ["tt0413300", "Spider-Man 3", 2007], ["tt0948470", "The Amazing Spider-Man", 2012], ["tt1872181", "The Amazing Spider-Man 2", 2014], ["tt2250912", "Spider-Man: Homecoming", 2017], ["tt4633694", "Spider-Man: Into the Spider-Verse", 2018], ["tt6320628", "Spider-Man: Far From Home", 2019], ["tt10872600", "Spider-Man: No Way Home", 2021], ["tt9362722", "Spider-Man: Across the Spider-Verse", 2023]]
  }, {
    id: "dceu",
    name: "DC Extended Universe",
    ar: "عالم دي سي (DCEU)",
    items: [["tt0770828", "Man of Steel", 2013], ["tt2975590", "Batman v Superman: Dawn of Justice", 2016], ["tt1386697", "Suicide Squad", 2016], ["tt0451279", "Wonder Woman", 2017], ["tt0974015", "Justice League", 2017], ["tt1477834", "Aquaman", 2018], ["tt0448115", "Shazam!", 2019], ["tt7713068", "Birds of Prey", 2020], ["tt7126948", "Wonder Woman 1984", 2020], ["tt12361974", "Zack Snyder's Justice League", 2021], ["tt6334354", "The Suicide Squad", 2021], ["tt6443346", "Black Adam", 2022], ["tt10151854", "Shazam! Fury of the Gods", 2023], ["tt0439572", "The Flash", 2023], ["tt9362930", "Blue Beetle", 2023], ["tt9663764", "Aquaman and the Lost Kingdom", 2023]],
    chrono: ["tt0451279", "tt7126948", "tt0770828", "tt2975590", "tt1386697", "tt0974015", "tt12361974", "tt1477834", "tt0448115", "tt7713068", "tt6334354", "tt6443346", "tt10151854", "tt0439572", "tt9362930", "tt9663764"]
  }, {
    id: "darkknight",
    name: "The Dark Knight Trilogy",
    ar: "ثلاثية فارس الظلام (باتمان - نولان)",
    items: [["tt0372784", "Batman Begins", 2005], ["tt0468569", "The Dark Knight", 2008], ["tt1345836", "The Dark Knight Rises", 2012]]
  }, {
    id: "middleearth",
    name: "The Lord of the Rings & The Hobbit",
    ar: "سيد الخواتم والهوبيت",
    items: [["tt0120737", "The Lord of the Rings: The Fellowship of the Ring", 2001], ["tt0167261", "The Lord of the Rings: The Two Towers", 2002], ["tt0167260", "The Lord of the Rings: The Return of the King", 2003], ["tt0903624", "The Hobbit: An Unexpected Journey", 2012], ["tt1170358", "The Hobbit: The Desolation of Smaug", 2013], ["tt2310332", "The Hobbit: The Battle of the Five Armies", 2014], ["tt7631058", "The Lord of the Rings: The Rings of Power", 2022, "s"], ["tt14824600", "The Lord of the Rings: The War of the Rohirrim", 2024]],
    chrono: ["tt7631058", "tt14824600", "tt0903624", "tt1170358", "tt2310332", "tt0120737", "tt0167261", "tt0167260"]
  }, {
    id: "wizarding",
    name: "Harry Potter & Fantastic Beasts",
    ar: "هاري بوتر والوحوش المذهلة",
    items: [["tt0241527", "Harry Potter and the Sorcerer's Stone", 2001], ["tt0295297", "Harry Potter and the Chamber of Secrets", 2002], ["tt0304141", "Harry Potter and the Prisoner of Azkaban", 2004], ["tt0330373", "Harry Potter and the Goblet of Fire", 2005], ["tt0373889", "Harry Potter and the Order of the Phoenix", 2007], ["tt0417741", "Harry Potter and the Half-Blood Prince", 2009], ["tt0926084", "Harry Potter and the Deathly Hallows: Part 1", 2010], ["tt1201607", "Harry Potter and the Deathly Hallows: Part 2", 2011], ["tt3183660", "Fantastic Beasts and Where to Find Them", 2016], ["tt4123430", "Fantastic Beasts: The Crimes of Grindelwald", 2018], ["tt4123432", "Fantastic Beasts: The Secrets of Dumbledore", 2022]],
    chrono: ["tt3183660", "tt4123430", "tt4123432", "tt0241527", "tt0295297", "tt0304141", "tt0330373", "tt0373889", "tt0417741", "tt0926084", "tt1201607"]
  }, {
    id: "starwars",
    name: "Star Wars",
    ar: "حرب النجوم (Star Wars)",
    items: [["tt0076759", "Star Wars: Episode IV - A New Hope", 1977], ["tt0080684", "Star Wars: Episode V - The Empire Strikes Back", 1980], ["tt0086190", "Star Wars: Episode VI - Return of the Jedi", 1983], ["tt0120915", "Star Wars: Episode I - The Phantom Menace", 1999], ["tt0121765", "Star Wars: Episode II - Attack of the Clones", 2002], ["tt0121766", "Star Wars: Episode III - Revenge of the Sith", 2005], ["tt1185834", "Star Wars: The Clone Wars", 2008], ["tt0458290", "Star Wars: The Clone Wars", 2008, "s"], ["tt2488496", "Star Wars: Episode VII - The Force Awakens", 2015], ["tt3748528", "Rogue One: A Star Wars Story", 2016], ["tt2527336", "Star Wars: Episode VIII - The Last Jedi", 2017], ["tt3778644", "Solo: A Star Wars Story", 2018], ["tt2527338", "Star Wars: Episode IX - The Rise of Skywalker", 2019], ["tt8111088", "The Mandalorian", 2019, "s"], ["tt12708542", "Star Wars: The Bad Batch", 2021, "s"], ["tt13668894", "The Book of Boba Fett", 2021, "s"], ["tt8466564", "Obi-Wan Kenobi", 2022, "s"], ["tt9253284", "Andor", 2022, "s"], ["tt13622776", "Ahsoka", 2023, "s"], ["tt12262202", "The Acolyte", 2024, "s"]],
    chrono: ["tt12262202", "tt0120915", "tt0121765", "tt1185834", "tt0458290", "tt0121766", "tt12708542", "tt3778644", "tt8466564", "tt9253284", "tt3748528", "tt0076759", "tt0080684", "tt0086190", "tt8111088", "tt13668894", "tt13622776", "tt2488496", "tt2527336", "tt2527338"]
  }, {
    id: "dollars",
    name: "The Dollars Trilogy",
    ar: "ثلاثية الدولار (حفنة من الدولارات)",
    items: [["tt0058461", "A Fistful of Dollars", 1964], ["tt0059578", "For a Few Dollars More", 1965], ["tt0060196", "The Good, the Bad and the Ugly", 1966]],
    chrono: ["tt0060196", "tt0058461", "tt0059578"]
  }, {
    id: "godfather",
    name: "The Godfather",
    ar: "العراب",
    items: [["tt0068646", "The Godfather", 1972], ["tt0071562", "The Godfather Part II", 1974], ["tt0099674", "The Godfather Part III", 1990]]
  }, {
    id: "johnwick",
    name: "John Wick",
    ar: "جون ويك",
    items: [["tt2911666", "John Wick", 2014], ["tt4425200", "John Wick: Chapter 2", 2017], ["tt6146586", "John Wick: Chapter 3 - Parabellum", 2019], ["tt10366206", "John Wick: Chapter 4", 2023], ["tt6486762", "The Continental", 2023, "s"], ["tt7181546", "Ballerina", 2025]],
    chrono: ["tt6486762", "tt2911666", "tt4425200", "tt6146586", "tt7181546", "tt10366206"]
  }, {
    id: "fast",
    name: "Fast & Furious",
    ar: "السرعة والغضب (Fast & Furious)",
    items: [["tt0232500", "The Fast and the Furious", 2001], ["tt0322259", "2 Fast 2 Furious", 2003], ["tt0463985", "The Fast and the Furious: Tokyo Drift", 2006], ["tt1013752", "Fast & Furious", 2009], ["tt1596343", "Fast Five", 2011], ["tt1905041", "Fast & Furious 6", 2013], ["tt2820852", "Furious 7", 2015], ["tt4630562", "The Fate of the Furious", 2017], ["tt6806448", "Fast & Furious Presents: Hobbs & Shaw", 2019], ["tt5433138", "F9", 2021], ["tt5433140", "Fast X", 2023]],
    chrono: ["tt0232500", "tt0322259", "tt1013752", "tt1596343", "tt1905041", "tt0463985", "tt2820852", "tt4630562", "tt6806448", "tt5433138", "tt5433140"]
  }, {
    id: "mi",
    name: "Mission: Impossible",
    ar: "المهمة المستحيلة",
    items: [["tt0117060", "Mission: Impossible", 1996], ["tt0120755", "Mission: Impossible II", 2e3], ["tt0317919", "Mission: Impossible III", 2006], ["tt1229238", "Mission: Impossible - Ghost Protocol", 2011], ["tt2381249", "Mission: Impossible - Rogue Nation", 2015], ["tt4912910", "Mission: Impossible - Fallout", 2018], ["tt9603212", "Mission: Impossible - Dead Reckoning Part One", 2023], ["tt9603208", "Mission: Impossible - The Final Reckoning", 2025]]
  }, {
    id: "bond",
    name: "James Bond 007",
    ar: "جيمس بوند 007",
    items: [["tt0055928", "Dr. No", 1962], ["tt0057076", "From Russia with Love", 1963], ["tt0058150", "Goldfinger", 1964], ["tt0059800", "Thunderball", 1965], ["tt0062512", "You Only Live Twice", 1967], ["tt0064757", "On Her Majesty's Secret Service", 1969], ["tt0066995", "Diamonds Are Forever", 1971], ["tt0070328", "Live and Let Die", 1973], ["tt0071807", "The Man with the Golden Gun", 1974], ["tt0076752", "The Spy Who Loved Me", 1977], ["tt0079574", "Moonraker", 1979], ["tt0082398", "For Your Eyes Only", 1981], ["tt0086034", "Octopussy", 1983], ["tt0090264", "A View to a Kill", 1985], ["tt0093428", "The Living Daylights", 1987], ["tt0097742", "Licence to Kill", 1989], ["tt0113189", "GoldenEye", 1995], ["tt0120347", "Tomorrow Never Dies", 1997], ["tt0143145", "The World Is Not Enough", 1999], ["tt0246460", "Die Another Day", 2002], ["tt0381061", "Casino Royale", 2006], ["tt0830515", "Quantum of Solace", 2008], ["tt1074638", "Skyfall", 2012], ["tt2379713", "Spectre", 2015], ["tt2382320", "No Time to Die", 2021]]
  }, {
    id: "bourne",
    name: "Bourne",
    ar: "بورن",
    items: [["tt0258463", "The Bourne Identity", 2002], ["tt0372183", "The Bourne Supremacy", 2004], ["tt0440963", "The Bourne Ultimatum", 2007], ["tt1194173", "The Bourne Legacy", 2012], ["tt4196776", "Jason Bourne", 2016]]
  }, {
    id: "matrix",
    name: "The Matrix",
    ar: "المصفوفة (The Matrix)",
    items: [["tt0133093", "The Matrix", 1999], ["tt0234215", "The Matrix Reloaded", 2003], ["tt0242653", "The Matrix Revolutions", 2003], ["tt10838180", "The Matrix Resurrections", 2021]]
  }, {
    id: "indy",
    name: "Indiana Jones",
    ar: "إنديانا جونز",
    items: [["tt0082971", "Raiders of the Lost Ark", 1981], ["tt0087469", "Indiana Jones and the Temple of Doom", 1984], ["tt0097576", "Indiana Jones and the Last Crusade", 1989], ["tt0367882", "Indiana Jones and the Kingdom of the Crystal Skull", 2008], ["tt1462764", "Indiana Jones and the Dial of Destiny", 2023]],
    chrono: ["tt0087469", "tt0082971", "tt0097576", "tt0367882", "tt1462764"]
  }, {
    id: "jurassic",
    name: "Jurassic Park & Jurassic World",
    ar: "الحديقة الجوراسية والعالم الجوراسي",
    items: [["tt0107290", "Jurassic Park", 1993], ["tt0119567", "The Lost World: Jurassic Park", 1997], ["tt0163025", "Jurassic Park III", 2001], ["tt0369610", "Jurassic World", 2015], ["tt4881806", "Jurassic World: Fallen Kingdom", 2018], ["tt8041270", "Jurassic World Dominion", 2022], ["tt31036941", "Jurassic World Rebirth", 2025]]
  }, {
    id: "alien",
    name: "Alien",
    ar: "الفضائي (Alien)",
    items: [["tt0078748", "Alien", 1979], ["tt0090605", "Aliens", 1986], ["tt0103644", "Alien 3", 1992], ["tt0118583", "Alien Resurrection", 1997], ["tt1446714", "Prometheus", 2012], ["tt2316204", "Alien: Covenant", 2017], ["tt18412256", "Alien: Romulus", 2024]],
    chrono: ["tt1446714", "tt2316204", "tt0078748", "tt18412256", "tt0090605", "tt0103644", "tt0118583"]
  }, {
    id: "terminator",
    name: "The Terminator",
    ar: "المدمّر (Terminator)",
    items: [["tt0088247", "The Terminator", 1984], ["tt0103064", "Terminator 2: Judgment Day", 1991], ["tt0181852", "Terminator 3: Rise of the Machines", 2003], ["tt0438488", "Terminator Salvation", 2009], ["tt1340138", "Terminator Genisys", 2015], ["tt6450804", "Terminator: Dark Fate", 2019]]
  }, {
    id: "pirates",
    name: "Pirates of the Caribbean",
    ar: "قراصنة الكاريبي",
    items: [["tt0325980", "Pirates of the Caribbean: The Curse of the Black Pearl", 2003], ["tt0383574", "Pirates of the Caribbean: Dead Man's Chest", 2006], ["tt0449088", "Pirates of the Caribbean: At World's End", 2007], ["tt1298650", "Pirates of the Caribbean: On Stranger Tides", 2011], ["tt1790809", "Pirates of the Caribbean: Dead Men Tell No Tales", 2017]]
  }, {
    id: "apes",
    name: "Planet of the Apes",
    ar: "كوكب القردة",
    items: [["tt1318514", "Rise of the Planet of the Apes", 2011], ["tt2103281", "Dawn of the Planet of the Apes", 2014], ["tt3450958", "War for the Planet of the Apes", 2017], ["tt11389872", "Kingdom of the Planet of the Apes", 2024]]
  }, {
    id: "bttf",
    name: "Back to the Future",
    ar: "العودة إلى المستقبل",
    items: [["tt0088763", "Back to the Future", 1985], ["tt0096874", "Back to the Future Part II", 1989], ["tt0099088", "Back to the Future Part III", 1990]]
  }, {
    id: "madmax",
    name: "Mad Max",
    ar: "ماد ماكس",
    items: [["tt0079501", "Mad Max", 1979], ["tt0082694", "Mad Max 2: The Road Warrior", 1981], ["tt0089530", "Mad Max Beyond Thunderdome", 1985], ["tt1392190", "Mad Max: Fury Road", 2015], ["tt12037194", "Furiosa: A Mad Max Saga", 2024]],
    chrono: ["tt0079501", "tt0082694", "tt0089530", "tt12037194", "tt1392190"]
  }, {
    id: "rocky",
    name: "Rocky & Creed",
    ar: "روكي وكريد",
    items: [["tt0075148", "Rocky", 1976], ["tt0079817", "Rocky II", 1979], ["tt0084602", "Rocky III", 1982], ["tt0089927", "Rocky IV", 1985], ["tt0100507", "Rocky V", 1990], ["tt0479143", "Rocky Balboa", 2006], ["tt3076658", "Creed", 2015], ["tt6343314", "Creed II", 2018], ["tt11145118", "Creed III", 2023]]
  }, {
    id: "diehard",
    name: "Die Hard",
    ar: "داي هارد",
    items: [["tt0095016", "Die Hard", 1988], ["tt0099423", "Die Hard 2", 1990], ["tt0112864", "Die Hard with a Vengeance", 1995], ["tt0337978", "Live Free or Die Hard", 2007], ["tt1606378", "A Good Day to Die Hard", 2013]]
  }, {
    id: "conjuring",
    name: "The Conjuring Universe",
    ar: "عالم الشعوذة (The Conjuring)",
    items: [["tt1457767", "The Conjuring", 2013], ["tt3322940", "Annabelle", 2014], ["tt3065204", "The Conjuring 2", 2016], ["tt5140878", "Annabelle: Creation", 2017], ["tt5814060", "The Nun", 2018], ["tt4913966", "The Curse of La Llorona", 2019], ["tt8350360", "Annabelle Comes Home", 2019], ["tt7069210", "The Conjuring: The Devil Made Me Do It", 2021], ["tt10160976", "The Nun II", 2023], ["tt22898462", "The Conjuring: Last Rites", 2025]],
    chrono: ["tt5814060", "tt10160976", "tt5140878", "tt3322940", "tt1457767", "tt4913966", "tt3065204", "tt8350360", "tt7069210", "tt22898462"]
  }, {
    id: "monsterverse",
    name: "MonsterVerse (Godzilla & Kong)",
    ar: "عالم الوحوش (غودزيلا وكونغ)",
    items: [["tt0831387", "Godzilla", 2014], ["tt3731562", "Kong: Skull Island", 2017], ["tt3741700", "Godzilla: King of the Monsters", 2019], ["tt5034838", "Godzilla vs. Kong", 2021], ["tt17220216", "Monarch: Legacy of Monsters", 2023, "s"], ["tt14539740", "Godzilla x Kong: The New Empire", 2024]],
    chrono: ["tt3731562", "tt0831387", "tt17220216", "tt3741700", "tt5034838", "tt14539740"]
  }, {
    id: "transformers",
    name: "Transformers",
    ar: "المتحولون (Transformers)",
    items: [["tt0418279", "Transformers", 2007], ["tt1055369", "Transformers: Revenge of the Fallen", 2009], ["tt1399103", "Transformers: Dark of the Moon", 2011], ["tt2109248", "Transformers: Age of Extinction", 2014], ["tt3371366", "Transformers: The Last Knight", 2017], ["tt4701182", "Bumblebee", 2018], ["tt5090568", "Transformers: Rise of the Beasts", 2023], ["tt8864596", "Transformers One", 2024]],
    chrono: ["tt8864596", "tt4701182", "tt5090568", "tt0418279", "tt1055369", "tt1399103", "tt2109248", "tt3371366"]
  }, {
    id: "hungergames",
    name: "The Hunger Games",
    ar: "مباريات الجوع",
    items: [["tt1392170", "The Hunger Games", 2012], ["tt1951264", "The Hunger Games: Catching Fire", 2013], ["tt1951265", "The Hunger Games: Mockingjay - Part 1", 2014], ["tt1951266", "The Hunger Games: Mockingjay - Part 2", 2015], ["tt10545296", "The Hunger Games: The Ballad of Songbirds & Snakes", 2023]],
    chrono: ["tt10545296", "tt1392170", "tt1951264", "tt1951265", "tt1951266"]
  }, {
    id: "toystory",
    cat: "cartoon",
    name: "Toy Story",
    ar: "حكاية لعبة",
    items: [["tt0114709", "Toy Story", 1995], ["tt0120363", "Toy Story 2", 1999], ["tt0435761", "Toy Story 3", 2010], ["tt1979376", "Toy Story 4", 2019]]
  },
  // ---------------- Anime ----------------
  {
    id: "fate",
    name: "Fate (stay night, Zero, Heaven's Feel...)",
    ar: "فيت (Fate): ستاي نايت وزيرو وهيفنز فيل",
    items: [["tt0774809", "Fate/stay night", 2006, "s"], ["tt2051178", "Fate/Zero", 2011, "s"], ["tt3621796", "Fate/stay night [Unlimited Blade Works]", 2014, "s"], ["tt6424454", "Fate/Apocrypha", 2017, "s"], ["tt4054952", "Fate/stay night [Heaven's Feel] I. presage flower", 2017], ["tt8091892", "Fate/stay night [Heaven's Feel] II. lost butterfly", 2019], ["tt8092118", "Fate/stay night [Heaven's Feel] III. spring song", 2020]],
    // Zero is the prequel (4th war); stay night / UBW / Heaven's Feel are the 5th war; Apocrypha is separate.
    chrono: ["tt2051178", "tt0774809", "tt3621796", "tt4054952", "tt8091892", "tt8092118", "tt6424454"]
  }, {
    id: "evangelion",
    name: "Evangelion",
    ar: "إيفانجيليون (Evangelion)",
    items: [["tt0112159", "Neon Genesis Evangelion", 1995, "s"], ["tt0169880", "Neon Genesis Evangelion: Death & Rebirth", 1997], ["tt0169858", "Neon Genesis Evangelion: The End of Evangelion", 1997], ["tt0923811", "Evangelion: 1.0 You Are (Not) Alone", 2007], ["tt0860906", "Evangelion: 2.0 You Can (Not) Advance", 2009], ["tt0860907", "Evangelion: 3.0 You Can (Not) Redo", 2012], ["tt2458948", "Evangelion: 3.0+1.0 Thrice Upon a Time", 2021]]
  }, {
    id: "gundam-uc",
    name: "Gundam - Universal Century",
    ar: "جاندام: التقويم العالمي (Universal Century)",
    items: [["tt0159172", "Mobile Suit Gundam", 1979, "s"], ["tt0159186", "Mobile Suit Zeta Gundam", 1985, "s"], ["tt0159184", "Mobile Suit Gundam ZZ", 1986, "s"], ["tt0095262", "Mobile Suit Gundam: Char's Counterattack", 1988], ["tt0097661", "Mobile Suit Gundam 0080: War in the Pocket", 1989, "s"], ["tt0159567", "Mobile Suit Gundam 0083: Stardust Memory", 1991, "s"], ["tt0159568", "Mobile Suit Gundam F91", 1991], ["tt0159185", "Mobile Suit Victory Gundam", 1993, "s"], ["tt1587790", "Mobile Suit Gundam Unicorn", 2010, "s"], ["tt12899130", "Mobile Suit Gundam: The Origin - Advent of the Red Comet", 2019, "s"], ["tt13288678", "Mobile Suit Gundam: Hathaway", 2021]],
    // By the year inside the story (UC 0068 → 0153).
    chrono: ["tt12899130", "tt0159172", "tt0097661", "tt0159567", "tt0159186", "tt0159184", "tt0095262", "tt1587790", "tt13288678", "tt0159568", "tt0159185"]
  }, {
    id: "gundam-alt",
    name: "Gundam - Other universes",
    ar: "جاندام: الأكوان الأخرى (Wing وSEED وغيرها)",
    items: [["tt0159182", "Mobile Fighter G Gundam", 1994, "s"], ["tt0159193", "Mobile Suit Gundam Wing", 1995, "s"], ["tt0159183", "After War Gundam X", 1996, "s"], ["tt0260191", "Gundam Wing: The Movie - Endless Waltz", 1998], ["tt0189318", "Turn A Gundam", 1999, "s"], ["tt0374407", "Mobile Suit Gundam SEED", 2002, "s"], ["tt1134000", "Mobile Suit Gundam 00", 2007, "s"], ["tt5344382", "Mobile Suit Gundam: Iron-Blooded Orphans", 2015, "s"], ["tt15433166", "Mobile Suit Gundam: The Witch from Mercury", 2022, "s"]]
  }, {
    id: "macross",
    name: "Macross",
    ar: "ماكروس (Macross)",
    items: [["tt0142183", "Super Dimension Fortress Macross", 1982, "s"], ["tt0087660", "Macross: Do You Remember Love?", 1984], ["tt0110426", "Macross Plus", 1994, "s"], ["tt0156220", "Macross 7", 1994, "s"], ["tt0353685", "Macross Zero", 2002, "s"], ["tt1216150", "Macross Frontier", 2008, "s"], ["tt5827092", "Macross Delta", 2015, "s"]],
    chrono: ["tt0353685", "tt0142183", "tt0087660", "tt0110426", "tt0156220", "tt1216150", "tt5827092"]
  }, {
    id: "monogatari",
    name: "Monogatari Series",
    ar: "سلسلة مونوغاتاري (Monogatari)",
    items: [["tt1480925", "Bakemonogatari", 2009, "s"], ["tt2178501", "Nisemonogatari", 2012, "s"], ["tt2575678", "Nekomonogatari (Kuro)", 2012, "s"], ["tt2922300", "Monogatari Series: Second Season", 2013, "s"], ["tt3621678", "Hanamonogatari", 2014, "s"], ["tt4213580", "Tsukimonogatari", 2014, "s"], ["tt5274556", "Owarimonogatari", 2015, "s"], ["tt3138698", "Kizumonogatari Part 1: Tekketsu", 2016], ["tt5084196", "Kizumonogatari Part 2: Nekketsu", 2016], ["tt5483932", "Koyomimonogatari", 2016, "s"], ["tt5084198", "Kizumonogatari Part 3: Reiketsu", 2017], ["tt9266104", "Zoku Owarimonogatari", 2018], ["tt30971467", "Monogatari Series: Off & Monster Season", 2024, "s"]],
    // The order most fans recommend for the story's own timeline.
    chrono: ["tt3138698", "tt5084196", "tt5084198", "tt2575678", "tt1480925", "tt2178501", "tt2922300", "tt4213580", "tt3621678", "tt5274556", "tt5483932", "tt9266104", "tt30971467"]
  }, {
    id: "madoka",
    name: "Puella Magi Madoka Magica",
    ar: "مادوكا ماجيكا",
    items: [["tt1773185", "Puella Magi Madoka Magica", 2011, "s"], ["tt2205948", "Puella Magi Madoka Magica the Movie Part 1: Beginnings", 2012], ["tt2194724", "Puella Magi Madoka Magica the Movie Part 2: Eternal", 2012], ["tt2457282", "Puella Magi Madoka Magica the Movie Part III: The Rebellion Story", 2013]]
  }, {
    id: "gits",
    name: "Ghost in the Shell",
    ar: "شبح في القوقعة (Ghost in the Shell)",
    items: [["tt0113568", "Ghost in the Shell", 1995], ["tt0346314", "Ghost in the Shell: Stand Alone Complex", 2002, "s"], ["tt0347246", "Ghost in the Shell 2: Innocence", 2004], ["tt4337072", "Ghost in the Shell: The New Movie", 2015], ["tt9466298", "Ghost in the Shell: SAC_2045", 2020, "s"]]
  },
  // ---------- Series universes ----------
  {
    id: "breakingbad",
    cat: "series",
    name: "Breaking Bad universe",
    ar: "عالم بريكنج باد (Breaking Bad)",
    items: [["tt0903747", "Breaking Bad", 2008, "s"], ["tt3032476", "Better Call Saul", 2015, "s"], ["tt9243946", "El Camino: A Breaking Bad Movie", 2019]],
    chrono: ["tt3032476", "tt0903747", "tt9243946"]
  }, {
    id: "got",
    cat: "series",
    name: "Game of Thrones universe",
    ar: "عالم صراع العروش (Game of Thrones)",
    items: [["tt0944947", "Game of Thrones", 2011, "s"], ["tt11198330", "House of the Dragon", 2022, "s"], ["tt27497448", "A Knight of the Seven Kingdoms", 2026, "s"]],
    chrono: ["tt11198330", "tt27497448", "tt0944947"]
  }, {
    id: "walkingdead",
    cat: "series",
    name: "The Walking Dead universe",
    ar: "عالم الموتى السائرون (The Walking Dead)",
    items: [["tt1520211", "The Walking Dead", 2010, "s"], ["tt3743822", "Fear the Walking Dead", 2015, "s"], ["tt10148174", "The Walking Dead: World Beyond", 2020, "s"], ["tt15669534", "Tales of the Walking Dead", 2022, "s"], ["tt18546730", "The Walking Dead: Dead City", 2023, "s"], ["tt13062500", "The Walking Dead: Daryl Dixon", 2023, "s"], ["tt9859436", "The Walking Dead: The Ones Who Live", 2024, "s"]]
  }, {
    id: "yellowstone",
    cat: "series",
    name: "Yellowstone universe",
    ar: "عالم يلوستون (Yellowstone)",
    items: [["tt4236770", "Yellowstone", 2018, "s"], ["tt13991232", "1883", 2021, "s"], ["tt18335752", "1923", 2022, "s"]],
    chrono: ["tt13991232", "tt18335752", "tt4236770"]
  }, {
    id: "theboys",
    cat: "series",
    name: "The Boys universe",
    ar: "عالم ذا بويز (The Boys)",
    items: [["tt1190634", "The Boys", 2019, "s"], ["tt16350094", "The Boys Presents: Diabolical", 2022, "s"], ["tt13159924", "Gen V", 2023, "s"]]
  }, {
    id: "dexter",
    cat: "series",
    name: "Dexter",
    ar: "دكستر (Dexter)",
    items: [["tt0773262", "Dexter", 2006, "s"], ["tt14164730", "Dexter: New Blood", 2021, "s"], ["tt32252772", "Dexter: Original Sin", 2024, "s"], ["tt33043892", "Dexter: Resurrection", 2025, "s"]],
    chrono: ["tt32252772", "tt0773262", "tt14164730", "tt33043892"]
  }, {
    id: "marvel-netflix",
    cat: "series",
    name: "Marvel Defenders saga",
    ar: "مسلسلات مارفل المدافعون (Defenders)",
    items: [["tt3322312", "Daredevil", 2015, "s"], ["tt2357547", "Jessica Jones", 2015, "s"], ["tt3322314", "Luke Cage", 2016, "s"], ["tt3322310", "Iron Fist", 2017, "s"], ["tt4230076", "The Defenders", 2017, "s"], ["tt5675620", "The Punisher", 2017, "s"], ["tt18923754", "Daredevil: Born Again", 2025, "s"]]
  }, {
    id: "arrowverse",
    cat: "series",
    name: "Arrowverse",
    ar: "عالم آرو (Arrowverse)",
    items: [["tt2193021", "Arrow", 2012, "s"], ["tt3107288", "The Flash", 2014, "s"], ["tt4016454", "Supergirl", 2015, "s"], ["tt4532368", "DC's Legends of Tomorrow", 2016, "s"], ["tt6045840", "Black Lightning", 2018, "s"], ["tt8712204", "Batwoman", 2019, "s"]]
  }, {
    id: "startrek-tv",
    cat: "series",
    name: "Star Trek (series)",
    ar: "ستار تريك المسلسلات (Star Trek)",
    items: [["tt0060028", "Star Trek: The Original Series", 1966, "s"], ["tt0092455", "Star Trek: The Next Generation", 1987, "s"], ["tt0106145", "Star Trek: Deep Space Nine", 1993, "s"], ["tt0112178", "Star Trek: Voyager", 1995, "s"], ["tt0244365", "Star Trek: Enterprise", 2001, "s"], ["tt5171438", "Star Trek: Discovery", 2017, "s"], ["tt8806524", "Star Trek: Picard", 2020, "s"], ["tt12327578", "Star Trek: Strange New Worlds", 2022, "s"]],
    chrono: ["tt0244365", "tt5171438", "tt12327578", "tt0060028", "tt0092455", "tt0106145", "tt0112178", "tt8806524"]
  }, {
    id: "xmen-cartoon",
    cat: "cartoon",
    name: "X-Men (animated)",
    ar: "إكس-مين الكرتون (X-Men Animated)",
    items: [["tt0103584", "X-Men: The Animated Series", 1992, "s"], ["tt0247827", "X-Men: Evolution", 2e3, "s"], ["tt16026746", "X-Men '97", 2024, "s"]]
  }, {
    id: "dcau",
    cat: "cartoon",
    name: "DC Animated Universe",
    ar: "عالم DC الكرتوني (DCAU)",
    items: [["tt0103359", "Batman: The Animated Series", 1992, "s"], ["tt0106364", "Batman: Mask of the Phantasm", 1993], ["tt0115378", "Superman: The Animated Series", 1996, "s"], ["tt0147746", "Batman Beyond", 1999, "s"], ["tt0275137", "Justice League", 2001, "s"], ["tt6025022", "Justice League Unlimited", 2004, "s"]]
  }, {
    id: "avatar",
    cat: "cartoon",
    name: "Avatar: The Last Airbender",
    ar: "أفاتار: آخر سيد للهواء",
    items: [["tt0417299", "Avatar: The Last Airbender", 2005, "s"], ["tt1695360", "The Legend of Korra", 2012, "s"]]
  }, {
    id: "starwars-animated",
    cat: "cartoon",
    name: "Star Wars (animated)",
    ar: "ستار وورز الكرتونية",
    items: [["tt0458290", "Star Wars: The Clone Wars", 2008, "s"], ["tt2930604", "Star Wars Rebels", 2014, "s"], ["tt12708542", "Star Wars: The Bad Batch", 2021, "s"]]
  }, {
    id: "dragonball",
    cat: "anime",
    name: "Dragon Ball",
    ar: "دراقون بول (Dragon Ball)",
    items: [["tt0088509", "Dragon Ball", 1986, "s"], ["tt0121220", "Dragon Ball Z", 1989, "s"], ["tt0139774", "Dragon Ball GT", 1996, "s"], ["tt4644488", "Dragon Ball Super", 2015, "s"]]
  }, {
    id: "naruto",
    cat: "anime",
    name: "Naruto",
    ar: "ناروتو (Naruto)",
    items: [["tt0409591", "Naruto", 2002, "s"], ["tt0988824", "Naruto Shippuden", 2007, "s"], ["tt6342474", "Boruto: Naruto Next Generations", 2017, "s"]]
  }];
  function findFranchise(id) {
    return FRANCHISES.find(function (f) {
      return f.id === id;
    }) || null;
  }
  function franchisesOf(imdb) {
    return FRANCHISES.filter(function (f) {
      return f.items.some(function (it) {
        return it[0] === imdb;
      });
    });
  }
  var CATS2 = [{
    id: "movies",
    label: "Filmes"
  }, {
    id: "series",
    label: "Séries"
  }, {
    id: "cartoon",
    label: "Desenhos animados"
  }, {
    id: "anime",
    label: "Animes"
  }];
  var ANIME_IDS = ["fate", "evangelion", "gundam-uc", "gundam-alt", "macross", "monogatari", "madoka", "gits"];
  function catOf(f) {
    return f.cat || (ANIME_IDS.indexOf(f.id) >= 0 ? "anime" : "movies");
  }

  // src/js/views/collections.js
  var POSTER = function POSTER(imdb) {
    return "https://images.metahub.space/poster/medium/" + imdb + "/img";
  };
  var ORDER_KEY = "franchiseOrder";
  function displayName(f) {
    return current() === "ar" && f.ar ? f.ar : f.name;
  }
  var FAV_KEY = "franchiseFavs";
  function favs() {
    return get(FAV_KEY, []) || [];
  }
  function isFav(id) {
    return favs().some(function (x) {
      return x.id === id;
    });
  }
  function toggleFav(f) {
    var list2 = favs();
    var i = list2.findIndex(function (x) {
      return x.id === f.id;
    });
    if (i >= 0) list2.splice(i, 1);else list2.push(findFranchise(f.id) ? {
      id: f.id
    } : {
      id: f.id,
      name: f.name,
      poster: f.items[0][0]
    });
    set(FAV_KEY, list2);
    return i < 0;
  }
  function favEntries() {
    return favs().map(function (x) {
      var f = findFranchise(x.id);
      if (f) return {
        f: f
      };
      var m = /^tmdb:(\d+)$/.exec(x.id);
      return m ? {
        f: {
          id: x.id,
          name: x.name,
          ar: x.name,
          items: [[x.poster]]
        },
        tmdbId: Number(m[1])
      } : null;
    }).filter(Boolean);
  }
  var MINE_KEY = "myCollections";
  function myCollections() {
    return get(MINE_KEY, []) || [];
  }
  function saveMine(list2) {
    set(MINE_KEY, list2);
  }
  function newCollection(name, first) {
    var list2 = myCollections();
    var c = {
      id: "my" + Date.now().toString(36),
      name: name,
      items: first ? [first] : []
    };
    list2.push(c);
    saveMine(list2);
    return c;
  }
  function toggleInCollection(id, item2) {
    var list2 = myCollections();
    var c = list2.find(function (x) {
      return x.id === id;
    });
    if (!c) return false;
    var i = c.items.findIndex(function (x) {
      return x.id === item2.id;
    });
    if (i >= 0) c.items.splice(i, 1);else c.items.push(item2);
    saveMine(list2);
    return i < 0;
  }
  function collectionMenu(meta, tmdbCollection2) {
    var item2 = {
      id: meta.id,
      type: meta.type,
      name: meta.name,
      poster: meta.poster || ""
    };
    var opts = [];
    franchisesOf(meta.id).forEach(function (f) {
      return opts.push({
        label: displayName(f),
        sub: t("{n} títulos", {
          n: f.items.length
        }),
        value: {
          f: f
        }
      });
    });
    if (tmdbCollection2 && !franchisesOf(meta.id).some(function (f) {
      return normalize2(f.name) === normalize2(tmdbCollection2.name);
    })) {
      opts.push({
        label: tmdbCollection2.name,
        sub: "TMDB",
        value: {
          tmdb: tmdbCollection2.id
        }
      });
    }
    myCollections().forEach(function (c) {
      var inside = c.items.some(function (x) {
        return x.id === meta.id;
      });
      opts.push({
        label: (inside ? "✓ " : "+ ") + c.name,
        sub: inside ? t("Toque para tirar desta coleção") : t("Adicionar a esta coleção"),
        value: {
          mine: c.id
        }
      });
    });
    opts.push({
      label: "+ " + t("Nova coleção..."),
      value: {
        create: true
      }
    });
    menu(t("Coleções"), opts, {
      onPick: function onPick(v) {
        if (v.f) return openFranchise(v.f);
        if (v.tmdb) return openTmdbCollection(v.tmdb);
        if (v.mine) {
          var c = myCollections().find(function (x) {
            return x.id === v.mine;
          });
          var added = toggleInCollection(v.mine, item2);
          return toast(added ? t('Adicionado a "{name}"', {
            name: c.name
          }) : t('Removido de "{name}"', {
            name: c.name
          }));
        }
        promptText(t("Nome da nova coleção"), "", t("Ex.: Para ver no fim de semana"), function (name) {
          newCollection(name, item2);
          toast(t('Coleção "{name}" criada', {
            name: name
          }));
        });
      }
    });
  }
  function MyCollectionView(id) {
    var el = h("div.view");
    var scroller = h("div.scroll-y", {
      "data-scroll-y": ""
    });
    var head = h("div.franchise-head");
    var filters = h("div.filters", {
      "data-group": ""
    });
    var grid = h("div.grid");
    scroller.appendChild(head);
    scroller.appendChild(filters);
    scroller.appendChild(grid);
    el.appendChild(scroller);
    function render() {
      var c = myCollections().find(function (x) {
        return x.id === id;
      });
      if (!c) return pop();
      clear(head);
      head.appendChild(h("h1", {
        text: c.name
      }));
      head.appendChild(h("div.franchise-sub", {
        text: t("{n} títulos", {
          n: c.items.length
        }) + "  ·  " + t("Coleção sua")
      }));
      clear(filters);
      filters.appendChild(h("div.chip", {
        focusable: true,
        text: t("Renomear"),
        onSelect: function onSelect() {
          return promptText(t("Renomear"), c.name, "", function (name) {
            var list2 = myCollections();
            var x = list2.find(function (y) {
              return y.id === id;
            });
            if (x) x.name = name;
            saveMine(list2);
            render();
          });
        }
      }));
      filters.appendChild(h("div.chip", {
        focusable: true,
        text: t("Apagar coleção"),
        onSelect: function onSelect() {
          return confirmDialog(t('Apagar a coleção "{name}"?', {
            name: c.name
          }), t("Apagar"), function () {
            saveMine(myCollections().filter(function (x) {
              return x.id !== id;
            }));
            pop();
          });
        }
      }));
      clear(grid);
      c.items.forEach(function (it) {
        return grid.appendChild(card({
          id: it.id,
          name: it.name,
          poster: it.poster || POSTER(it.id)
        }, {
          badge: isWatched(it.id) ? "✓" : "",
          onSelect: function onSelect() {
            return menu(it.name, [{
              label: t("Abrir"),
              value: "open"
            }, {
              label: t("Tirar desta coleção"),
              value: "remove"
            }], {
              onPick: function onPick(v) {
                if (v === "open") return openDetails(it.type, it.id);
                toggleInCollection(id, it);
                render();
              }
            });
          }
        }));
      });
      if (!c.items.length) grid.appendChild(h("div.hint", {
        text: t("Vazia. Na página de um filme ou série, use o botão Coleção para adicionar.")
      }));
      loadVisibleImages(el, 400);
    }
    render();
    return {
      el: el,
      onShow: function onShow() {
        return render();
      }
    };
  }
  function isSeriesItem(it) {
    return it[3] === "s";
  }
  function itemWatched(it) {
    if (isSeriesItem(it)) return false;
    if (isWatched(it[0])) return true;
    var li = libraryItem(it[0]);
    return !!(li && li.state && (li.state.timesWatched > 0 || li.state.flaggedWatched));
  }
  function itemProgress(it) {
    var li = libraryItem(it[0]);
    if (li && li.state && li.state.timeOffset > 0 && li.state.duration > 0) return li.state.timeOffset / li.state.duration;
    return isSeriesItem(it) ? 0 : progress(it[0]);
  }
  function watchedCount(f) {
    return f.items.filter(itemWatched).length;
  }
  function orderOf(f) {
    var all2 = get(ORDER_KEY, {}) || {};
    return f.chrono && all2[f.id] === "chrono" ? "chrono" : "release";
  }
  function setOrder(f, order) {
    var all2 = get(ORDER_KEY, {}) || {};
    all2[f.id] = order;
    set(ORDER_KEY, all2);
  }
  function ordered(f, order) {
    if (order !== "chrono" || !f.chrono) return f.items.slice();
    var byId = {};
    f.items.forEach(function (it) {
      return byId[it[0]] = it;
    });
    return f.chrono.map(function (id) {
      return byId[id];
    }).filter(Boolean);
  }
  function openFranchise(f) {
    push(FranchiseView(f));
  }
  function openTmdbCollection(id) {
    toast(t("Carregando coleção..."), 2500);
    tmdbCollection(id).then(function (f) {
      if (!f.items.length) return toast(t("Nenhum título encontrado nesta coleção."));
      openFranchise(f);
    }).catch(function () {
      return toast(t("Não foi possível carregar a coleção."));
    });
  }
  function normalize2(s) {
    return String(s || "").toLowerCase().replace(/collection|coleção|سلسلة|[^a-z0-9]/g, "");
  }
  function CollectionsView() {
    var el = h("div.view");
    var scroller = h("div.scroll-y", {
      "data-scroll-y": ""
    });
    var bar = topbar("collections", goTab);
    var searchBox = h("div.search-box");
    var results = h("div");
    var mineBox = h("div");
    var favBox = h("div");
    var grid = h("div");
    scroller.appendChild(bar);
    scroller.appendChild(searchBox);
    scroller.appendChild(results);
    scroller.appendChild(mineBox);
    scroller.appendChild(favBox);
    scroller.appendChild(h("div.row-title", {
      text: t("Coleções")
    }));
    scroller.appendChild(grid);
    el.appendChild(scroller);
    if (hasTmdb()) {
      var input = h("input.input", {
        type: "text",
        placeholder: t("Buscar outra coleção (ex.: Shrek, Rambo, Saw)..."),
        focusable: true
      });
      input.__submit = function (q2) {
        return search2(q2);
      };
      searchBox.appendChild(input);
    } else {
      searchBox.appendChild(h("div.hint", {
        text: t("Com uma chave TMDB em Ajustes, dá para buscar qualquer outra coleção de filmes.")
      }));
    }
    var token = 0;
    function search2(q2) {
      var query = (q2 || "").trim();
      clear(results);
      if (query.length < 2) return;
      var my = ++token;
      results.appendChild(spinnerLine(t('Buscando "{q}"...', {
        q: query
      })));
      searchCollections(query).then(function (list2) {
        if (my !== token) return;
        clear(results);
        if (!list2.length) {
          results.appendChild(h("div.hint", {
            text: t("Nenhuma coleção encontrada.")
          }));
          return;
        }
        results.appendChild(h("div.row-title", {
          text: t("Resultados")
        }));
        var track = h("div.row-track", {
          "data-scroll-x": "",
          "data-group": ""
        });
        list2.forEach(function (c) {
          return track.appendChild(card({
            name: c.name,
            poster: c.poster
          }, {
            onSelect: function onSelect() {
              return openTmdbCollection(c.id);
            }
          }));
        });
        results.appendChild(h("div.row", null, track));
        loadVisibleImages(el, 400);
      }).catch(function () {
        if (my !== token) return;
        clear(results);
        results.appendChild(h("div.hint", {
          text: t("Não foi possível buscar agora.")
        }));
      });
    }
    function franchiseCard(f, tmdbId) {
      var done = tmdbId ? 0 : watchedCount(f);
      return card({
        name: displayName(f),
        poster: POSTER(f.items[0][0])
      }, {
        badge: tmdbId ? "★" : (isFav(f.id) ? "★ " : "") + (done ? done + "/" + f.items.length : String(f.items.length)),
        progress: done ? done / f.items.length : 0,
        onSelect: function onSelect() {
          return tmdbId ? openTmdbCollection(tmdbId) : openFranchise(f);
        }
      });
    }
    function renderMine() {
      clear(mineBox);
      mineBox.appendChild(h("div.row-title", {
        text: t("Minhas coleções")
      }));
      var g = h("div.grid.fav-grid");
      myCollections().forEach(function (c) {
        var first = c.items[0];
        g.appendChild(card({
          name: c.name,
          poster: first ? first.poster || POSTER(first.id) : ""
        }, {
          badge: String(c.items.length),
          onSelect: function onSelect() {
            return push(MyCollectionView(c.id));
          }
        }));
      });
      g.appendChild(h("div.card.see-all", {
        focusable: true,
        onSelect: function onSelect() {
          return promptText(t("Nome da nova coleção"), "", t("Ex.: Para ver no fim de semana"), function (name) {
            var c = newCollection(name);
            renderMine();
            push(MyCollectionView(c.id));
          });
        }
      }, [h("div.poster-wrap", null, h("div.see-all-label", null, [h("b", {
        text: "+"
      }), t("Nova coleção")])), h("div.name", {
        text: ""
      })]));
      mineBox.appendChild(g);
    }
    function renderGrid() {
      renderMine();
      clear(favBox);
      var pinned = favEntries();
      if (pinned.length) {
        favBox.appendChild(h("div.row-title", {
          text: "★ " + t("Favoritas")
        }));
        var fg = h("div.grid.fav-grid");
        pinned.forEach(function (e) {
          return fg.appendChild(franchiseCard(e.f, e.tmdbId));
        });
        favBox.appendChild(fg);
      }
      clear(grid);
      var pinnedIds = pinned.map(function (e) {
        return e.f.id;
      });
      CATS2.forEach(function (c) {
        var list2 = FRANCHISES.filter(function (f) {
          return pinnedIds.indexOf(f.id) < 0 && catOf(f) === c.id;
        });
        if (!list2.length) return;
        grid.appendChild(h("div.row-title.cat-title", {
          text: t(c.label)
        }));
        var g = h("div.grid");
        list2.forEach(function (f) {
          return g.appendChild(franchiseCard(f));
        });
        grid.appendChild(g);
      });
      loadVisibleImages(el, 400);
    }
    renderGrid();
    return {
      el: el,
      onShow: function onShow() {
        return renderGrid();
      },
      destroy: function destroy() {
        return bar.__destroy && bar.__destroy();
      }
    };
  }
  function FranchiseView(f) {
    var el = h("div.view");
    var scroller = h("div.scroll-y", {
      "data-scroll-y": ""
    });
    var head = h("div.franchise-head");
    var filters = h("div.filters", {
      "data-group": ""
    });
    var grid = h("div.grid");
    scroller.appendChild(head);
    scroller.appendChild(filters);
    scroller.appendChild(grid);
    el.appendChild(scroller);
    var order = orderOf(f);
    var hideWatched = false;
    function nextUp(list2) {
      return list2.find(function (it) {
        return !itemWatched(it);
      }) || null;
    }
    function open(it) {
      openDetails(isSeriesItem(it) ? "series" : "movie", it[0]);
    }
    function render(keepFocus) {
      var list2 = ordered(f, order);
      var done = list2.filter(itemWatched).length;
      clear(head);
      head.appendChild(h("h1", {
        text: displayName(f)
      }));
      head.appendChild(h("div.franchise-sub", {
        text: t("{n} títulos", {
          n: list2.length
        }) + "  ·  " + t("Assistidos: {done} de {n}", {
          done: done,
          n: list2.length
        }) + (order === "chrono" ? "  ·  " + t("Ordem da história") : "  ·  " + t("Ordem de lançamento"))
      }));
      clear(filters);
      var next = nextUp(list2);
      if (next) {
        filters.appendChild(h("div.chip.primary-chip", {
          focusable: true,
          onSelect: function onSelect() {
            return open(next);
          }
        }, "▶ " + t("Próximo: {title}", {
          title: next[1]
        })));
      }
      var chip = function chip(key3, label, active2, onSelect) {
        var c = h("div.chip", {
          focusable: true,
          cls: active2 ? "active" : "",
          text: label,
          onSelect: onSelect
        });
        c.__key = key3;
        return c;
      };
      filters.appendChild(chip("release", t("Ordem de lançamento"), order === "release", function () {
        order = "release";
        setOrder(f, order);
        render("release");
      }));
      if (f.chrono) {
        filters.appendChild(chip("chrono", t("Ordem da história"), order === "chrono", function () {
          order = "chrono";
          setOrder(f, order);
          render("chrono");
        }));
      }
      filters.appendChild(chip("hide", t("Esconder assistidos"), hideWatched, function () {
        hideWatched = !hideWatched;
        render("hide");
      }));
      filters.appendChild(chip("fav", isFav(f.id) ? "★ " + t("Fixada no topo") : "☆ " + t("Fixar no topo"), isFav(f.id), function () {
        var on = toggleFav(f);
        toast(on ? t("Fixada no topo da aba Coleções") : t("Removida das favoritas"));
        render("fav");
      }));
      clear(grid);
      list2.forEach(function (it, i) {
        var seen = itemWatched(it);
        if (hideWatched && seen) return;
        grid.appendChild(card({
          name: it[1],
          poster: POSTER(it[0])
        }, {
          title: i + 1 + ". " + it[1] + (isSeriesItem(it) ? " · " + t("série") : "") + " (" + it[2] + ")",
          badge: seen ? "✓ " + (i + 1) : String(i + 1),
          progress: seen ? 0 : itemProgress(it),
          onSelect: function onSelect() {
            return open(it);
          }
        }));
      });
      if (!grid.firstChild) grid.appendChild(h("div.hint", {
        text: t("Você já assistiu tudo desta coleção.")
      }));
      if (keepFocus) {
        var c = Array.prototype.find.call(filters.children, function (x) {
          return x.__key === keepFocus;
        });
        if (c) focus(c);
      }
      loadVisibleImages(el, 400);
    }
    render();
    return {
      el: el,
      onShow: function onShow() {
        return render();
      }
    };
  }

  // src/js/views/anime.js
  var API4 = "https://graphql.anilist.co";
  var ARM3 = "https://arm.haglund.dev/api/v2/ids?source=anilist&id=";
  var FIELDS = "id format title { romaji english } coverImage { large }";
  function seasonNow() {
    var d = /* @__PURE__ */new Date();
    return {
      season: ["WINTER", "SPRING", "SUMMER", "FALL"][Math.floor(d.getMonth() / 3)],
      year: d.getFullYear()
    };
  }
  var SEASONS = ["WINTER", "SPRING", "SUMMER", "FALL"];
  var SEASON_LABEL = {
    WINTER: "Winter",
    SPRING: "Spring",
    SUMMER: "Summer",
    FALL: "Fall"
  };
  function nextSeason(s) {
    var i = SEASONS.indexOf(s.season);
    return i === 3 ? {
      season: "WINTER",
      year: s.year + 1
    } : {
      season: SEASONS[i + 1],
      year: s.year
    };
  }
  var STUDIO_LIST = ["MAPPA", "Madhouse", "ufotable", "Kyoto Animation", "Bones", "Wit Studio", "Production I.G", "Sunrise", "Trigger", "CloverWorks", "A-1 Pictures", "Toei Animation", "Studio Pierrot", "David Production", "TMS Entertainment", "P.A. Works", "J.C.Staff", "Studio Ghibli"];
  var GENRE_LIST = [["Action", "Ação", 'genre: "Action"'], ["Adventure", "Aventura", 'genre: "Adventure"'], ["Comedy", "Comédia", 'genre: "Comedy"'], ["Drama", "Drama", 'genre: "Drama"'], ["Fantasy", "Fantasia", 'genre: "Fantasy"'], ["Horror", "Terror", 'genre: "Horror"'], ["Mahou Shoujo", null, 'genre: "Mahou Shoujo"'], ["Mecha", "Mecha", 'genre: "Mecha"'], ["Music", "Música", 'genre: "Music"'], ["Mystery", "Mistério", 'genre: "Mystery"'], ["Psychological", "Psicológico", 'genre: "Psychological"'], ["Romance", "Romance", 'genre: "Romance"'], ["Sci-Fi", "Ficção científica", 'genre: "Sci-Fi"'], ["Slice of Life", "Cotidiano", 'genre: "Slice of Life"'], ["Sports", "Esportes", 'genre: "Sports"'], ["Supernatural", "Sobrenatural", 'genre: "Supernatural"'], ["Suspense", null, 'genre: "Thriller"']];
  var DEMOGRAPHICS = [["Shounen", null, 'tag: "Shounen"'], ["Seinen", null, 'tag: "Seinen"'], ["Shoujo", null, 'tag: "Shoujo"'], ["Josei", null, 'tag: "Josei"'], ["Kids", "Infantil", 'tag: "Kids"']];
  var THEMES = [["Isekai", null, 'tag: "Isekai"'], ["Reincarnation", null, 'tag: "Reincarnation"'], ["Mythology", null, 'tag: "Mythology"'], ["Vampire", null, 'tag: "Vampire"'], ["Super Power", null, 'tag: "Super Power"'], ["Samurai", null, 'tag: "Samurai"'], ["Martial Arts", null, 'tag: "Martial Arts"'], ["Survival", null, 'tag: "Survival"'], ["Military", null, 'tag: "Military"'], ["Time Travel", null, 'tag: "Time Manipulation"'], ["Space", null, 'tag: "Space"'], ["Mecha", null, 'tag: "Real Robot"'], ["Urban Fantasy", null, 'tag: "Urban Fantasy"'], ["Team Sports", null, 'tag: "Team Sports"'], ["Love Polygon", null, 'tag: "Love Triangle"']];
  var EVERYDAY = [["Detective", null, 'tag: "Detective"'], ["Organized Crime", null, 'tag: "Organized Crime"'], ["Gore", null, 'tag: "Gore"'], ["Medical", null, 'tag: "Medicine"'], ["Historical", null, 'tag: "Historical"'], ["CGDCT", null, 'tag: "Cute Girls Doing Cute Things"'], ["Iyashikei", null, 'tag: "Iyashikei"'], ["Childcare", null, 'tag: "Parenthood"'], ["Gourmet", null, 'tag: "Food"'], ["Workplace", null, 'tag: "Workplace"'], ["School", null, 'tag: "School"'], ["Performing Arts", null, 'tag: "Acting"'], ["Visual Arts", null, 'tag: "Drawing"'], ["Pets", null, 'tag: "Pets"'], ["Showbiz", null, 'tag: "Idol"']];
  var STYLES2 = [["Parody", null, 'tag: "Parody"'], ["Gag Humor", null, 'tag: "Slapstick"'], ["Otaku Culture", null, 'tag: "Otaku Culture"'], ["Delinquents", null, 'tag: "Delinquents"'], ["Crossdressing", null, 'tag: "Crossdressing"'], ["Harem", null, 'tag: "Male Harem"'], ["Reverse Harem", null, 'tag: "Female Harem"'], ["Love Polygon", null, 'tag: "Love Triangle"']];
  var DECADES = [[1980, "80s"], [1990, "90s"], [2e3, "2000s"], [2010, "2010s"], [2020, "2020s"]];
  var cache4 = {};
  function anilist(query) {
    if (cache4[query]) return cache4[query];
    var p = postJSON(API4, {
      query: query
    }, {
      timeout: 15e3,
      quiet: true
    }).then(function (r) {
      return r && r.data;
    }).catch(function (e) {
      delete cache4[query];
      throw e;
    });
    cache4[query] = p;
    return p;
  }
  function toMetas(list2) {
    return (list2 || []).map(function (m) {
      return {
        id: "anilist:" + m.id,
        anilist: m.id,
        type: m.format === "MOVIE" ? "movie" : "series",
        name: m.title && (m.title.english || m.title.romaji) || "",
        poster: m.coverImage && m.coverImage.large
      };
    });
  }
  function page(args, n, perPage) {
    return anilist("{ Page(page: " + (n || 1) + ", perPage: " + (perPage || 20) + ") { pageInfo { hasNextPage } media(type: ANIME, isAdult: false, " + args + ") { " + FIELDS + " } } }").then(function (d) {
      return {
        items: toMetas(d && d.Page && d.Page.media),
        more: !!(d && d.Page && d.Page.pageInfo && d.Page.pageInfo.hasNextPage)
      };
    });
  }
  function studioPage(name) {
    return anilist("{ Studio(search: " + JSON.stringify(name) + ") { media(sort: POPULARITY_DESC, isMain: true, perPage: 40) { nodes { " + FIELDS + " } } } }").then(function (d) {
      return {
        items: toMetas(d && d.Studio && d.Studio.media && d.Studio.media.nodes).filter(function (m) {
          return m.name;
        }),
        more: false
      };
    });
  }
  var idCache = {};
  function openAnime(m) {
    if (m.aio) {
      var mal = /^mal:(\d+)/.exec(m.id);
      if (!mal) return openDetails(m.type, m.id);
      return getJSON("https://arm.haglund.dev/api/v2/ids?source=myanimelist&id=" + mal[1], {
        timeout: 1e4,
        quiet: true
      }).then(function (r) {
        var kitsuOk = r && r.kitsu && withResource("meta", "series", "kitsu:" + r.kitsu).length;
        openDetails(m.type, kitsuOk ? "kitsu:" + r.kitsu : r && r.imdb || m.id);
      }).catch(function () {
        return openDetails(m.type, m.id);
      });
    }
    var go = function go(ids2) {
      var kitsuOk = ids2.kitsu && withResource("meta", "series", "kitsu:" + ids2.kitsu).length;
      var id = kitsuOk ? "kitsu:" + ids2.kitsu : ids2.imdb || (ids2.kitsu ? "kitsu:" + ids2.kitsu : null);
      if (!id) return toast(t("Não encontrei este anime nos addons."));
      openDetails(m.type, id);
    };
    if (idCache[m.anilist]) return go(idCache[m.anilist]);
    getJSON(ARM3 + m.anilist, {
      timeout: 1e4,
      quiet: true
    }).then(function (r) {
      idCache[m.anilist] = {
        imdb: r && r.imdb,
        kitsu: r && r.kitsu
      };
      go(idCache[m.anilist]);
    }).catch(function () {
      return toast(t("Não encontrei este anime nos addons."));
    });
  }
  function aioAddon() {
    return list().find(function (a) {
      return a.manifest && a.manifest.id === "aio-metadata";
    });
  }
  function aioOption(cat, want) {
    var a = aioAddon();
    var c = a && (a.manifest.catalogs || []).find(function (x) {
      return x.id === cat;
    });
    var ex = c && (c.extra || []).find(function (e) {
      return e.name === "genre";
    });
    var opts = ex && ex.options || [];
    var w = String(want).toLowerCase();
    return opts.find(function (o) {
      return String(o).toLowerCase() === w;
    }) || opts.find(function (o) {
      return String(o).toLowerCase().indexOf(w + " - ") === 0;
    }) || null;
  }
  function aioPage(cat, genre, n) {
    var a = aioAddon();
    if (!a) return Promise.reject(new Error("no aio"));
    var extra = {};
    if (genre) extra.genre = genre;
    if (n > 1) extra.skip = (n - 1) * 50;
    return fetchCatalog({
      addon: a,
      catalog: {
        type: "anime",
        id: cat
      }
    }, extra).then(function (metas) {
      return {
        items: metas.map(function (m) {
          return Object.assign({}, m, {
            type: m.type === "movie" || /movie/i.test(m.type) ? "movie" : "series",
            aio: true
          });
        }),
        more: metas.length >= 50
      };
    });
  }
  function listSource(aioCat, aioGenre, aniArgs) {
    var opt = aioCat && (aioGenre ? aioOption(aioCat, aioGenre) : true);
    if (aioAddon() && opt) return function (n) {
      return aioPage(aioCat, aioGenre ? opt : null, n);
    };
    return aniArgs ? function (n) {
      return page(aniArgs, n, 35);
    } : null;
  }
  function posterRow(parent, title, load7, onMore) {
    var row = h("div.row", {
      "data-anchor": "30"
    });
    var track = h("div.row-track.pending", {
      "data-scroll-x": "",
      "data-group": ""
    }, spinnerLine(t("Carregando...")));
    row.appendChild(h("div.row-title", {
      text: title
    }));
    row.appendChild(track);
    parent.appendChild(row);
    return {
      row: row,
      load: function load() {
        return load7().then(function (r) {
          clear(track);
          track.classList.remove("pending");
          if (!r.items.length) return parent.removeChild(row);
          r.items.forEach(function (m) {
            return track.appendChild(card(m, {
              onSelect: function onSelect() {
                return openAnime(m);
              }
            }));
          });
          if (onMore) track.appendChild(h("div.card.see-all", {
            focusable: true,
            onSelect: onMore
          }, [h("div.poster-wrap", null, h("div.see-all-label", null, [h("b", {
            text: "→"
          }), t("Ver tudo")])), h("div.name", {
            text: ""
          })]));
          loadVisibleImages(row);
        }).catch(function () {
          return row.parentNode && parent.removeChild(row);
        });
      }
    };
  }
  var ART = "https://raw.githubusercontent.com/aliabdoxd14/collectionsart/refs/heads/main/";
  function slug(x) {
    return String(x).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function artUrl(file) {
    return file ? "https://wsrv.nl/?url=" + encodeURIComponent(ART + file + ".jpg") + "&w=320&h=180&fit=cover&output=jpg&q=80" : null;
  }
  function tileRow(parent, title, tiles, cls) {
    var row = h("div.row", {
      "data-anchor": "30"
    });
    row.appendChild(h("div.row-title", {
      text: title
    }));
    row.appendChild(h("div.row-track", {
      "data-scroll-x": "",
      "data-group": ""
    }, tiles.map(function (x, i) {
      var wrap = h("div.poster-wrap", null, h("div.tile-label", {
        text: x.label
      }));
      var url2 = artUrl(x.art);
      if (url2) {
        var im = h("img.tile-art", {
          alt: ""
        });
        im.setAttribute("data-lazy", url2);
        im.onload = function () {
          return wrap.classList.add(/^landscape-/.test(x.art) ? "has-art" : "has-art-label");
        };
        im.onerror = function () {
          return im.parentNode && im.parentNode.removeChild(im);
        };
        wrap.appendChild(im);
      }
      return h("div.card.anime-tile", {
        focusable: true,
        cls: cls + " hue-" + i % 6,
        onSelect: x.open
      }, [wrap, h("div.name", {
        text: ""
      })]);
    })));
    parent.appendChild(row);
    loadVisibleImages(row);
  }
  function AnimeView() {
    var el = h("div.view");
    var scroller = h("div.scroll-y", {
      "data-scroll-y": ""
    });
    var bar = topbar("anime", goTab);
    var rows2 = h("div.rows");
    scroller.appendChild(bar);
    scroller.appendChild(rows2);
    el.appendChild(scroller);
    var pending2 = [];
    var active2 = 0;
    function loadNearby() {
      if (el.offsetParent === null) return;
      var limit = window.innerHeight * 2.2;
      var _loop6 = function _loop6() {
          var p = pending2[i];
          if (p.state) return 0; // continue
          if (p.row.getBoundingClientRect().top > limit) return 1; // break
          p.state = "loading";
          active2++;
          p.load().then(function () {
            p.state = "done";
            active2--;
            loadNearby();
          });
        },
        _ret3;
      for (var i = 0; i < pending2.length && active2 < 2; i++) {
        _ret3 = _loop6();
        if (_ret3 === 0) continue;
        if (_ret3 === 1) break;
      }
    }
    var s = seasonNow();
    var ns = nextSeason(s);
    var seasonArgs = function seasonArgs(x) {
      return "season: " + x.season + ", seasonYear: " + x.year + ", sort: POPULARITY_DESC";
    };
    var seasonName = function seasonName(x) {
      return SEASON_LABEL[x.season] + " " + x.year;
    };
    var add = function add(title, load7, onMore) {
      return pending2.push(posterRow(rows2, title, load7, onMore));
    };
    var tiles = function tiles(title, list2, cls) {
      var usable = list2.filter(function (x) {
        return x.src;
      });
      if (usable.length) tileRow(rows2, title, usable.map(function (x) {
        return {
          label: x.label,
          art: x.art,
          open: function open() {
            return push(AnimeGridView(x.label, null, null, x.src));
          }
        };
      }), cls);
    };
    var GENRE_ART = {
      Suspense: "thriller",
      Mecha: "mecha"
    };
    var malList = function malList(list2, cls, title, themes) {
      return tiles(title, list2.map(function (g) {
        return {
          label: g[1] ? t(g[1]) : g[0],
          art: "genre-" + (themes && g[0] === "Mecha" ? "real-robot" : GENRE_ART[g[0]] || slug(g[0])),
          src: listSource("mal.genres", g[0], g[2] + ", sort: POPULARITY_DESC")
        };
      }), cls);
    };
    add(t("Esta temporada"), function () {
      return page(seasonArgs(s));
    }, function () {
      return push(AnimeGridView(t("Esta temporada"), seasonArgs(s)));
    });
    tiles(t("Descobrir"), [{
      label: t("Lançando agora"),
      art: "landscape-airing-now",
      src: listSource("mal.airing", null, "status: RELEASING, sort: POPULARITY_DESC")
    }, {
      label: t("Esta temporada"),
      art: "landscape-this-season",
      src: listSource("mal.seasons", seasonName(s), seasonArgs(s))
    }, {
      label: t("Próxima temporada"),
      art: "landscape-upcoming-season",
      src: listSource("mal.seasons", seasonName(ns), seasonArgs(ns))
    }, {
      label: t("Mais populares"),
      art: "landscape-most-popular",
      src: listSource(null, null, "sort: POPULARITY_DESC")
    }, {
      label: t("Mais favoritados"),
      art: "landscape-most-favourites",
      src: listSource(null, null, "sort: FAVOURITES_DESC")
    }, {
      label: t("Melhores séries"),
      art: "landscape-top-series",
      src: listSource("mal.top_anime", null, "format: TV, sort: SCORE_DESC")
    }, {
      label: t("Melhores filmes"),
      art: "landscape-top-movies",
      src: listSource(null, null, "format: MOVIE, sort: SCORE_DESC")
    }, {
      label: t("Mais bem avaliados"),
      art: "landscape-top-anime",
      src: listSource(null, null, "sort: SCORE_DESC")
    }], "discover");
    add(t("Em alta agora"), function () {
      return page("sort: TRENDING_DESC");
    }, function () {
      return push(AnimeGridView(t("Em alta agora"), "sort: TRENDING_DESC"));
    });
    tiles(t("Anime da temporada"), SEASONS.map(function (x) {
      var one = {
        season: x,
        year: s.year
      };
      return {
        label: t(SEASON_LABEL[x] === "Winter" ? "Inverno" : SEASON_LABEL[x] === "Spring" ? "Primavera" : SEASON_LABEL[x] === "Summer" ? "Verão" : "Outono") + " " + s.year,
        src: listSource("mal.seasons", seasonName(one), seasonArgs(one))
      };
    }), "genre");
    tiles(t("Estúdios"), STUDIO_LIST.map(function (name) {
      return {
        label: name,
        art: "studio-" + slug(name),
        src: listSource("mal.studios", name, null) || function (n) {
          return n > 1 ? Promise.resolve({
            items: [],
            more: false
          }) : studioPage(name);
        }
      };
    }), "studio");
    malList(GENRE_LIST, "genre", t("Gêneros"));
    malList(DEMOGRAPHICS, "discover", t("Público"));
    tiles(t("Décadas"), DECADES.map(function (d) {
      return {
        label: d[1],
        art: "landscape-best-of-the-" + d[1].toLowerCase(),
        src: listSource(null, null, "startDate_greater: " + d[0] + "0000, startDate_lesser: " + (d[0] + 10) + "0000, sort: SCORE_DESC")
      };
    }), "genre");
    malList(THEMES, "discover", t("Temas"), true);
    malList(EVERYDAY, "genre", t("Crime e vida cotidiana"));
    malList(STYLES2, "discover", t("Estilos de comédia e romance"));
    add(t("Filmes de anime"), function () {
      return page("format: MOVIE, sort: POPULARITY_DESC");
    }, function () {
      return push(AnimeGridView(t("Filmes de anime"), "format: MOVIE, sort: POPULARITY_DESC"));
    });
    return {
      el: el,
      onShow: function onShow() {
        loadNearby();
        loadVisibleImages(el);
      },
      onScroll: function onScroll() {
        return loadNearby();
      },
      destroy: function destroy() {
        return bar.__destroy && bar.__destroy();
      }
    };
  }
  function AnimeGridView(title, args, studio, src) {
    var el = h("div.view");
    var scroller = h("div.scroll-y", {
      "data-scroll-y": ""
    });
    var grid = h("div.grid");
    scroller.appendChild(h("div.row-title.catalog-title", {
      text: title
    }));
    scroller.appendChild(grid);
    el.appendChild(scroller);
    var n = 0;
    var moreCard = null;
    function more() {
      if (moreCard && moreCard.parentNode) grid.removeChild(moreCard);
      grid.appendChild(spinnerLine(t("Carregando...")));
      (src ? src(++n) : studio ? studioPage(studio) : page(args, ++n, 35)).then(function (r) {
        var sp = grid.querySelector(".loading-line");
        if (sp) grid.removeChild(sp);
        r.items.forEach(function (m) {
          return grid.appendChild(card(m, {
            onSelect: function onSelect() {
              return openAnime(m);
            }
          }));
        });
        if (r.more && (src || !studio)) {
          moreCard = h("div.card.see-all", {
            focusable: true,
            onSelect: function onSelect() {
              return more();
            }
          }, [h("div.poster-wrap", null, h("div.see-all-label", null, [h("b", {
            text: "+"
          }), t("Carregar mais")])), h("div.name", {
            text: ""
          })]);
          grid.appendChild(moreCard);
        }
        loadVisibleImages(el, 400);
        if (n === 1 || studio && !src) {
          var first = grid.querySelector(".card");
          if (first) focus(first);
        }
      }).catch(function () {
        return toast(t("Não foi possível carregar agora."));
      });
    }
    more();
    return {
      el: el,
      onShow: function onShow() {
        return loadVisibleImages(el, 400);
      }
    };
  }

  // src/js/api/newEpisodes.js
  var DAYS = 7;
  var CHECK = 25;
  var PARALLEL = 1;
  function librarySeries() {
    return cachedLibrary().filter(function (it) {
      return it.type === "series" && (!it.removed || it.state && it.state.timeOffset > 0);
    }).sort(function (a, b) {
      return String(b._mtime || "").localeCompare(String(a._mtime || ""));
    }).slice(0, CHECK);
  }
  function recent(meta, it) {
    var now = Date.now();
    var from = now - DAYS * 864e5;
    return (meta.videos || []).filter(function (v) {
      var t2 = Date.parse(v.released);
      return v.id && v.season && t2 >= from && t2 <= now && !isWatched(v.id);
    }).map(function (v) {
      return {
        seriesId: it._id,
        type: "series",
        name: meta.name || it.name,
        poster: meta.poster || it.poster,
        background: meta.background,
        thumbnail: v.thumbnail,
        videoId: v.id,
        season: v.season,
        episode: v.episode,
        title: v.name || v.title || "",
        released: Date.parse(v.released)
      };
    });
  }
  function cached() {
    return (get("newEpisodes", []) || []).filter(function (e) {
      return !isWatched(e.videoId) && Date.now() - e.released <= DAYS * 864e5;
    });
  }
  var run = 0;
  function load5() {
    var my = ++run;
    return load().then(function () {
      return scan2(my);
    }).then(function (list2) {
      if (my !== run) throw new Error("stopped");
      set("newEpisodes", list2.slice(0, 40));
      return list2;
    });
  }
  function stop2() {
    run++;
  }
  function scan2(my) {
    var series = librarySeries();
    var out = [];
    var i = 0;
    var _worker = function worker() {
      if (i >= series.length || my !== run) return Promise.resolve();
      var it = series[i++];
      return fetchMeta("series", it._id).then(function (meta) {
        recent(meta, it).forEach(function (e) {
          return out.push(e);
        });
      }).catch(function () {}).then(_worker);
    };
    var workers = [];
    for (var n = 0; n < PARALLEL; n++) workers.push(_worker());
    return Promise.all(workers).then(function () {
      return out.sort(function (a, b) {
        return b.released - a.released;
      });
    });
  }

  // src/js/views/catalog.js
  var PER_ROW = 7;
  function canPage(entry) {
    var c = entry.catalog;
    return (c.extra || []).some(function (e) {
      return e && e.name === "skip";
    }) || (c.extraSupported || []).indexOf("skip") >= 0;
  }
  function CatalogView(entry) {
    var el = h("div.view");
    var scroller = h("div.scroll-y", {
      "data-scroll-y": ""
    });
    var grid = h("div.grid");
    var status2 = h("div.grid-status");
    scroller.appendChild(h("div.row-title.catalog-title", {
      text: catalogTitle(entry)
    }));
    scroller.appendChild(grid);
    scroller.appendChild(status2);
    el.appendChild(scroller);
    var paging = canPage(entry);
    var seen = {};
    var count = 0;
    var loading = false;
    var done = false;
    function add(metas) {
      metas.forEach(function (m) {
        if (!m || seen[m.id]) return;
        seen[m.id] = true;
        var index2 = count++;
        grid.appendChild(card(m, {
          onSelect: function onSelect() {
            return openDetails(m.type || entry.catalog.type, m.id);
          },
          onFocus: function onFocus() {
            if (count - index2 <= PER_ROW * 2) more();
          }
        }));
      });
      loadVisibleImages(el, 600);
    }
    function more() {
      if (loading || done) return;
      loading = true;
      clear(status2);
      status2.appendChild(spinnerLine(t("Carregando...")));
      var before = count;
      fetchCatalog(entry, count ? {
        skip: count
      } : null).then(function (metas) {
        add(metas);
        if (!paging || count === before) done = true;
      }).catch(function () {
        done = true;
      }).then(function () {
        loading = false;
        clear(status2);
        if (!count) status2.appendChild(h("div.hint", {
          text: t("Nada por aqui.")
        }));
      });
    }
    more();
    return {
      el: el
    };
  }

  // src/js/lib/homeRows.js
  function key2(entry) {
    return (entry.addon.transportUrl || entry.addon.manifest.id || "") + "|" + entry.catalog.type + "|" + entry.catalog.id;
  }
  function prefs() {
    var p = settings().homeRows || {};
    return {
      order: p.order || [],
      hidden: p.hidden || []
    };
  }
  function save(p) {
    saveSettings({
      homeRows: {
        order: p.order,
        hidden: p.hidden
      }
    });
  }
  function isHidden(entry) {
    return prefs().hidden.indexOf(key2(entry)) >= 0;
  }
  function sort(entries) {
    var order = prefs().order;
    return entries.map(function (e, i) {
      return {
        e: e,
        i: i,
        o: order.indexOf(key2(e))
      };
    }).sort(function (a, b) {
      return (a.o < 0 ? 1e6 + a.i : a.o) - (b.o < 0 ? 1e6 + b.i : b.o);
    }).map(function (x) {
      return x.e;
    });
  }
  function visible(entries) {
    var hidden = prefs().hidden;
    return sort(entries).filter(function (e) {
      return hidden.indexOf(key2(e)) < 0;
    });
  }
  function toggleHidden(entry) {
    var p = prefs();
    var k = key2(entry);
    var i = p.hidden.indexOf(k);
    if (i >= 0) p.hidden.splice(i, 1);else p.hidden.push(k);
    save(p);
  }
  function move2(entries, entry, delta) {
    var list2 = sort(entries).map(key2);
    var k = key2(entry);
    var i = list2.indexOf(k);
    var j = i + delta;
    if (i < 0 || j < 0 || j >= list2.length) return;
    list2.splice(i, 1);
    list2.splice(j, 0, k);
    var p = prefs();
    p.order = list2;
    save(p);
  }
  function reset() {
    saveSettings({
      homeRows: null
    });
  }

  // src/js/api/mdblistRows.js
  var API5 = "https://api.mdblist.com/";
  var POSTER2 = function POSTER2(imdb) {
    return "https://images.metahub.space/poster/medium/" + imdb + "/img";
  };
  function apiKey() {
    return (settings().mdblistKey || "").trim();
  }
  function hasKey() {
    return !!apiKey();
  }
  function call3(path) {
    var sep = path.indexOf("?") >= 0 ? "&" : "?";
    return getJSONViaProxy(API5 + path + sep + "apikey=" + encodeURIComponent(apiKey()), {
      timeout: 15e3
    });
  }
  function myLists() {
    if (!hasKey()) return Promise.resolve([]);
    return call3("lists/user").then(function (r) {
      return (Array.isArray(r) ? r : []).map(function (l) {
        return {
          id: String(l.id),
          name: l.name,
          items: l.items || 0
        };
      });
    });
  }
  function findList(text) {
    var v = String(text || "").trim();
    var m = v.match(/mdblist\.com\/lists\/([^/?#]+)\/([^/?#]+)/i) || v.match(/^([\w.-]+)\/([\w.-]+)$/);
    var path = m ? "lists/" + encodeURIComponent(m[1]) + "/" + encodeURIComponent(m[2]) : /^\d+$/.test(v) ? "lists/" + v : null;
    if (!path) return Promise.reject(new Error("?"));
    return call3(path).then(function (r) {
      var l = Array.isArray(r) ? r[0] : r;
      if (!l || !l.id) throw new Error("?");
      return {
        id: String(l.id),
        name: l.name
      };
    });
  }
  function rows() {
    return hasKey() ? settings().mdblistRows || [] : [];
  }
  function setRows(list2) {
    saveSettings({
      mdblistRows: list2
    });
  }
  function items(id) {
    return call3("lists/" + encodeURIComponent(id) + "/items?limit=40").then(function (r) {
      var out = [];
      var add = function add(x, type) {
        return x && x.imdb_id && out.push({
          id: x.imdb_id,
          type: type,
          name: x.title,
          poster: POSTER2(x.imdb_id),
          rank: x.rank || 0
        });
      };
      (r && r.movies || []).forEach(function (x) {
        return add(x, "movie");
      });
      (r && r.shows || []).forEach(function (x) {
        return add(x, "series");
      });
      return out.sort(function (a, b) {
        return a.rank - b.rank;
      });
    });
  }
  function boardEntries() {
    return rows().map(function (l) {
      return {
        addon: {
          transportUrl: "mdblist",
          manifest: {
            id: "mdblist",
            name: "MDBList"
          }
        },
        catalog: {
          id: l.id,
          name: l.name,
          type: "movie"
        },
        fetch: function fetch() {
          return items(l.id);
        }
      };
    });
  }

  // src/js/api/nuvioCollections.js
  var TMDB_IMG2 = "https://image.tmdb.org/t/p/w342";
  var files = {};
  function load6(name) {
    if (!files[name]) {
      var base = window.__KAI_BASE__ || "";
      files[name] = getJSON(base + "collections/" + name + ".json", {
        timeout: 3e4
      }).catch(function (e) {
        delete files[name];
        throw e;
      });
    }
    return files[name];
  }
  function fromTmdb(list2, media) {
    return (list2 || []).filter(function (x) {
      return x && x.poster_path;
    }).map(function (x) {
      var type = (x.media_type || media) === "tv" ? "series" : "movie";
      return {
        id: "tmdb:" + x.id,
        tmdb: x.id,
        tmdbType: type === "series" ? "tv" : "movie",
        type: type,
        name: x.title || x.name || "",
        poster: TMDB_IMG2 + x.poster_path
      };
    });
  }
  function sortList(items3, sort2) {
    var s = String(sort2 || "");
    var key3 = s.split(".")[0];
    var desc = /desc$/.test(s);
    if (!key3 || key3 === "original_order" || key3 === "rank") return items3;
    return items3.slice().sort(function (a, b) {
      return ((a.__s[key3] || 0) - (b.__s[key3] || 0)) * (desc ? -1 : 1);
    });
  }
  function fetchSource(src, page2) {
    var n = page2 || 1;
    if (src.q) {
      return tmdbGet("discover/" + src.m, Object.assign({
        page: n,
        include_adult: "false"
      }, src.q)).then(function (r) {
        return {
          items: fromTmdb(r && r.results, src.m),
          more: !!(r && r.page < r.total_pages && n < 20)
        };
      });
    }
    if (src.list) {
      return tmdbGet("list/" + src.list, {}).then(function (r) {
        var raw = (r && r.items || []).map(function (x) {
          return Object.assign({}, x, {
            __s: {
              vote_average: x.vote_average,
              popularity: x.popularity,
              release_date: Date.parse(x.release_date || x.first_air_date) || 0
            }
          });
        });
        var items3 = fromTmdb(sortList(raw, src.sort), src.m);
        return {
          items: items3.slice((n - 1) * 40, n * 40),
          more: items3.length > n * 40
        };
      });
    }
    if (src.coll) {
      return tmdbGet("collection/" + src.coll, {}).then(function (r) {
        var parts = (r && r.parts || []).slice().sort(function (a, b) {
          return (Date.parse(a.release_date) || 9e15) - (Date.parse(b.release_date) || 9e15);
        });
        return {
          items: fromTmdb(parts, "movie"),
          more: false
        };
      });
    }
    if (src.trakt) {
      var kind = src.m === "tv" ? "show" : "movie";
      return traktPublic("/lists/" + src.trakt + "/items/" + kind + "?limit=40&page=" + n).then(function (list2) {
        return {
          items: (list2 || []).map(function (x) {
            var m = x.movie || x.show;
            var imdb = m && m.ids && m.ids.imdb;
            return imdb ? {
              id: imdb,
              type: x.movie ? "movie" : "series",
              name: m.title,
              poster: "https://images.metahub.space/poster/medium/" + imdb + "/img"
            } : null;
          }).filter(Boolean),
          more: (list2 || []).length >= 40
        };
      });
    }
    if (src.addon) {
      var a = list().find(function (x) {
        return x.manifest && x.manifest.id === src.addon;
      });
      if (!a) return Promise.resolve({
        items: [],
        more: false,
        missing: src.addon
      });
      var extra = {};
      if (src.genre) extra.genre = src.genre;
      if (n > 1) extra.skip = (n - 1) * 100;
      return fetchCatalog({
        addon: a,
        catalog: {
          type: src.m,
          id: src.cat
        }
      }, extra).then(function (metas) {
        return {
          items: metas,
          more: metas.length >= 50
        };
      });
    }
    return Promise.resolve({
      items: [],
      more: false
    });
  }
  function idFor(m) {
    if (!m.tmdb) return Promise.resolve(m.id);
    return tmdbImdb(m.tmdbType, m.tmdb).then(function (imdb) {
      return imdb || m.id;
    });
  }

  // src/js/views/nuvioHome.js
  function openItem(m) {
    idFor(m).then(function (id) {
      return openDetails(m.type, id);
    }).catch(function () {
      return toast(t("Não foi possível abrir agora."));
    });
  }
  function folderTile(f) {
    var shape = f.s === "L" ? "landscape" : f.s === "S" ? "square" : "poster";
    var wrap = h("div.poster-wrap");
    if (f.c) {
      var im = h("img", {
        alt: ""
      });
      var size = shape === "landscape" ? "&w=400&h=225&fit=cover" : shape === "square" ? "&w=260&h=260&fit=contain&cbg=f2f0f8" : "&w=230&h=345&fit=cover";
      var small = "https://wsrv.nl/?url=" + encodeURIComponent(f.c) + size + "&output=jpg&q=80";
      im.setAttribute("data-lazy", small);
      var triedFull = false;
      im.onerror = function () {
        if (!triedFull) {
          triedFull = true;
          im.src = f.c;
          return;
        }
        im.style.display = "none";
        wrap.appendChild(h("div.ph", {
          text: f.t
        }));
      };
      wrap.appendChild(im);
    } else wrap.appendChild(h("div.ph", {
      text: (f.e ? f.e + " " : "") + f.t
    }));
    var open = function open() {
      return push(f.src.length === 1 ? SourceGridView(f.src[0], f.t) : FolderView(f));
    };
    return h("div.card.nc-tile", {
      focusable: true,
      cls: "nc-" + shape,
      onSelect: open
    }, [wrap, h("div.name", {
      text: f.h ? "" : f.t
    })]);
  }
  function collectionRows(parent, data) {
    return data.map(function (c) {
      var row = h("div.row.nc-row", {
        "data-anchor": "30"
      });
      var track = h("div.row-track", {
        "data-scroll-x": "",
        "data-group": ""
      });
      row.appendChild(h("div.row-title", null, [c.t, h("small", {
        text: t("{n} pastas", {
          n: c.f.length
        })
      })]));
      row.appendChild(track);
      parent.appendChild(row);
      return {
        row: row,
        load: function load() {
          c.f.slice(0, ROW_TILES).forEach(function (f) {
            return track.appendChild(folderTile(f));
          });
          if (c.f.length > ROW_TILES) track.appendChild(h("div.card.see-all", {
            focusable: true,
            onSelect: function onSelect() {
              return push(CollectionGridView(c));
            }
          }, [h("div.poster-wrap", null, h("div.see-all-label", null, [h("b", {
            text: "→"
          }), t("Ver tudo")])), h("div.name", {
            text: ""
          })]));
          loadVisibleImages(row);
          return Promise.resolve();
        }
      };
    });
  }
  var ROW_TILES = 15;
  function CollectionGridView(c) {
    var el = h("div.view");
    var scroller = h("div.scroll-y", {
      "data-scroll-y": ""
    });
    var grid = h("div.grid.nc-grid");
    scroller.appendChild(h("div.row-title.catalog-title", {
      text: c.t
    }));
    scroller.appendChild(grid);
    el.appendChild(scroller);
    c.f.forEach(function (f) {
      return grid.appendChild(folderTile(f));
    });
    setTimeout(function () {
      var first = grid.querySelector(".card");
      if (first) focus(first);
      loadVisibleImages(el, 400);
    }, 0);
    return {
      el: el,
      onShow: function onShow() {
        return loadVisibleImages(el, 400);
      },
      onScroll: function onScroll() {
        return loadVisibleImages(el, 400);
      }
    };
  }
  function sourceRow(parent, src, title) {
    var row = h("div.row", {
      "data-anchor": "30"
    });
    var track = h("div.row-track.pending", {
      "data-scroll-x": "",
      "data-group": ""
    }, spinnerLine(t("Carregando...")));
    row.appendChild(h("div.row-title", {
      text: title
    }));
    row.appendChild(track);
    parent.appendChild(row);
    return {
      row: row,
      load: function load() {
        return fetchSource(src, 1).then(function (r) {
          clear(track);
          track.classList.remove("pending");
          if (!r.items.length) {
            if (row.parentNode) parent.removeChild(row);
            return;
          }
          r.items.slice(0, 20).forEach(function (m) {
            return track.appendChild(card(m, {
              onSelect: function onSelect() {
                return openItem(m);
              }
            }));
          });
          if (r.more || r.items.length > 20) track.appendChild(h("div.card.see-all", {
            focusable: true,
            onSelect: function onSelect() {
              return push(SourceGridView(src, title));
            }
          }, [h("div.poster-wrap", null, h("div.see-all-label", null, [h("b", {
            text: "→"
          }), t("Ver tudo")])), h("div.name", {
            text: ""
          })]));
          loadVisibleImages(row);
        }).catch(function () {
          return row.parentNode && parent.removeChild(row);
        });
      }
    };
  }
  function lazyQueue(el) {
    var pending2 = [];
    var active2 = 0;
    function run3() {
      if (el.offsetParent === null) return;
      var limit = window.innerHeight * 2.2;
      var _loop7 = function _loop7() {
          var p = pending2[i];
          if (p.state) return 0; // continue
          if (!p.row.parentNode) {
            p.state = "done";
            return 0; // continue
          }
          if (p.row.getBoundingClientRect().top > limit) return 1; // break
          p.state = "loading";
          active2++;
          p.load().then(function () {
            p.state = "done";
            active2--;
            run3();
          }, function () {
            p.state = "done";
            active2--;
            run3();
          });
        },
        _ret4;
      for (var i = 0; i < pending2.length && active2 < 2; i++) {
        _ret4 = _loop7();
        if (_ret4 === 0) continue;
        if (_ret4 === 1) break;
      }
    }
    return {
      add: function add(list2) {
        list2.forEach(function (p) {
          return pending2.push(p);
        });
        run3();
      },
      run: run3,
      clear: function clear() {
        return pending2.length = 0;
      }
    };
  }
  function FolderView(f) {
    var el = h("div.view");
    var scroller = h("div.scroll-y", {
      "data-scroll-y": ""
    });
    var rows2 = h("div.rows");
    scroller.appendChild(h("div.row-title.catalog-title", {
      text: f.t
    }));
    scroller.appendChild(rows2);
    el.appendChild(scroller);
    var q2 = lazyQueue(el);
    q2.add(f.src.map(function (s) {
      return sourceRow(rows2, s, s.n || f.t);
    }));
    return {
      el: el,
      onShow: function onShow() {
        q2.run();
        loadVisibleImages(el);
      },
      onScroll: function onScroll() {
        return q2.run();
      }
    };
  }
  function SourceGridView(src, title) {
    var el = h("div.view");
    var scroller = h("div.scroll-y", {
      "data-scroll-y": ""
    });
    var grid = h("div.grid");
    scroller.appendChild(h("div.row-title.catalog-title", {
      text: title
    }));
    scroller.appendChild(grid);
    el.appendChild(scroller);
    var n = 0;
    var more = null;
    var seen = {};
    function next() {
      if (more && more.parentNode) grid.removeChild(more);
      grid.appendChild(spinnerLine(t("Carregando...")));
      fetchSource(src, ++n).then(function (r) {
        var sp = grid.querySelector(".loading-line");
        if (sp) grid.removeChild(sp);
        r.items.forEach(function (m) {
          if (seen[m.id]) return;
          seen[m.id] = true;
          grid.appendChild(card(m, {
            onSelect: function onSelect() {
              return openItem(m);
            }
          }));
        });
        if (r.more) {
          more = h("div.card.see-all", {
            focusable: true,
            onSelect: function onSelect() {
              return next();
            }
          }, [h("div.poster-wrap", null, h("div.see-all-label", null, [h("b", {
            text: "+"
          }), t("Carregar mais")])), h("div.name", {
            text: ""
          })]);
          grid.appendChild(more);
        }
        loadVisibleImages(el, 400);
        if (n === 1) {
          var first = grid.querySelector(".card");
          if (first) focus(first);
        }
      }).catch(function () {
        return toast(t("Não foi possível carregar agora."));
      });
    }
    next();
    return {
      el: el,
      onShow: function onShow() {
        return loadVisibleImages(el, 400);
      }
    };
  }

  // src/js/views/home.js
  var ROTATE_MS = 8e3;
  function HomeView() {
    var el = h("div.view");
    var scroller = h("div.scroll-y", {
      "data-scroll-y": ""
    });
    var bar = topbar("home", goTab);
    var heroUi = buildHero();
    var cwRow = h("div.row", {
      "data-anchor": "30"
    });
    var neRow = h("div.row", {
      "data-anchor": "30"
    });
    var rows2 = h("div.rows");
    scroller.appendChild(bar);
    scroller.appendChild(heroUi.el);
    scroller.appendChild(cwRow);
    scroller.appendChild(neRow);
    scroller.appendChild(rows2);
    el.appendChild(scroller);
    var loadedBoard = false;
    onPlayback(function (list2) {
      if (mergeExternalProgress(list2)) {
        renderContinue();
        publishBrowse();
      }
    });
    var lastSync2 = Date.now();
    function syncContinue() {
      if (!isLoggedIn() || Date.now() - lastSync2 < 6e4) return;
      lastSync2 = Date.now();
      var before = JSON.stringify(continueWatching().map(function (it) {
        return [it._id, it.state.video_id, it.state.timeOffset];
      }));
      getLibrary().then(function () {
        var after = JSON.stringify(continueWatching().map(function (it) {
          return [it._id, it.state.video_id, it.state.timeOffset];
        }));
        if (after !== before) {
          renderContinue();
          loadNew(true);
          publishBrowse();
        }
      }).catch(function () {});
    }
    var syncTimer = setInterval(function () {
      if (!el.classList.contains("hidden") && !perf()) syncContinue();
    }, 3e5);
    var newList = perf() ? [] : cached();
    var newLoadedAt = 0;
    function loadNew(force) {
      if (perf() || !force && Date.now() - newLoadedAt < 30 * 6e4) return;
      newLoadedAt = Date.now();
      load5().then(function (list2) {
        newList = list2;
        renderNew();
        publishBrowse();
      }).catch(function () {});
    }
    function renderNew() {
      clear(neRow);
      if (!newList.length) {
        neRow.style.display = "none";
        return;
      }
      neRow.style.display = "";
      neRow.appendChild(h("div.row-title", null, [t("Novos episódios"), h("small", {
        text: t("Séries da sua biblioteca, últimos 7 dias")
      })]));
      var track = h("div.row-track", {
        "data-scroll-x": "",
        "data-group": ""
      });
      newList.slice(0, 20).forEach(function (e) {
        var c = card({
          name: e.name,
          poster: e.poster
        }, {
          wide: true,
          image: e.thumbnail || e.background || e.poster,
          title: e.name + " · " + epLabel(e.season, e.episode),
          onSelect: function onSelect() {
            return openDetails("series", e.seriesId, {
              videoId: e.videoId,
              autoStreams: true
            });
          }
        });
        c.querySelector(".poster-wrap").appendChild(h("div.badge.new-badge", {
          text: dayLabel(e.released)
        }));
        track.appendChild(c);
      });
      neRow.appendChild(track);
      loadVisibleImages(neRow);
    }
    function dayLabel(ms) {
      var d = new Date(ms);
      var today = /* @__PURE__ */new Date();
      today.setHours(0, 0, 0, 0);
      var day = new Date(d.getTime());
      day.setHours(0, 0, 0, 0);
      var diff = Math.round((today - day) / 864e5);
      if (diff <= 0) return t("Hoje");
      if (diff === 1) return t("Ontem");
      return t(["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"][d.getDay()]);
    }
    function publishBrowse() {
      var cont = continueWatching().slice(0, 20).map(function (it) {
        return {
          type: it.type,
          id: it._id,
          video: it.state.video_id,
          name: it.name,
          sub: episodeLabel(it.state.video_id, it._id),
          poster: it.poster,
          progress: it.state.duration ? Math.round(it.state.timeOffset / it.state.duration * 100) / 100 : 0
        };
      });
      var fresh = newList.slice(0, 20).map(function (e) {
        return {
          type: "series",
          id: e.seriesId,
          video: e.videoId,
          name: e.name,
          sub: epLabel(e.season, e.episode) + (e.title ? " · " + e.title : ""),
          poster: e.poster
        };
      });
      var lib = cachedLibrary().filter(function (it) {
        return !it.removed && it.type !== "other" && it.poster;
      }).sort(function (a, b) {
        return String(b._mtime || "").localeCompare(String(a._mtime || ""));
      }).slice(0, 60).map(function (it) {
        return {
          type: it.type,
          id: it._id,
          name: it.name,
          poster: it.poster
        };
      });
      browse({
        continueWatching: cont,
        newEpisodes: fresh,
        library: lib,
        labels: {
          continueWatching: t("Continuar assistindo"),
          newEpisodes: t("Novos episódios"),
          library: t("Biblioteca")
        }
      });
    }
    function renderContinue() {
      clear(cwRow);
      var items3 = sortContinue(continueWatching()).slice(0, 20);
      if (!items3.length) {
        cwRow.style.display = "none";
        return;
      }
      cwRow.style.display = "";
      cwRow.appendChild(h("div.row-title", {
        text: t("Continuar assistindo")
      }));
      var track = h("div.row-track", {
        "data-scroll-x": "",
        "data-group": ""
      });
      items3.forEach(function (it) {
        var s = it.state;
        var ep = episodeLabel(s.video_id, it._id);
        var bg = /^tt\d+/.test(it._id) ? background(it._id) : it.poster;
        track.appendChild(card({
          name: it.name,
          poster: it.poster
        }, {
          wide: true,
          image: bg,
          title: it.name + (ep ? " · " + ep : ""),
          progress: s.duration ? s.timeOffset / s.duration : 0,
          onSelect: function onSelect() {
            return openDetails(it.type, it._id, {
              videoId: s.video_id,
              autoStreams: true
            });
          }
        }));
      });
      cwRow.appendChild(track);
      loadVisibleImages(cwRow);
    }
    var pending2 = [];
    var active2 = 0;
    function loadNearby() {
      if (el.offsetParent === null) return;
      var limit = window.innerHeight * 2.2;
      var _loop8 = function _loop8() {
          var p = pending2[i];
          if (p.state !== "idle") return 0; // continue
          if (!p.row.parentNode) {
            p.state = "done";
            return 0; // continue
          }
          if (p.row.getBoundingClientRect().top > limit) return 1; // break
          p.state = "loading";
          active2++;
          p.load().then(function () {
            p.state = "done";
            active2--;
            loadNearby();
          });
        },
        _ret5;
      for (var i = 0; i < pending2.length && active2 < 2; i++) {
        _ret5 = _loop8();
        if (_ret5 === 0) continue;
        if (_ret5 === 1) break;
      }
    }
    var boardToken = 0;
    function renderBoard() {
      var myBoard = ++boardToken;
      var alive = function alive() {
        return myBoard === boardToken && loadedBoard;
      };
      loadedBoard = true;
      pending2 = [];
      clear(rows2);
      rows2.appendChild(spinnerLine(t("Carregando catálogos...")));
      load().then(function () {
        clear(rows2);
        var layout = settings().homeLayout || "collections";
        if (layout !== "addons") {
          var box = h("div.nc-box");
          rows2.appendChild(box);
          if (!hasTmdb()) box.appendChild(h("div.nc-hint", {
            text: t("Coloque sua chave TMDB (Ajustes → Integrações) para ver as coleções da tela inicial.")
          }));
          load6("home").then(function (data) {
            if (!alive()) return;
            var list2 = collectionRows(box, data).map(function (x) {
              return Object.assign(x, {
                state: "idle"
              });
            });
            pending2 = list2.concat(pending2);
            loadNearby();
          }).catch(function () {
            return box.appendChild(h("div.nc-hint", {
              text: t("Não foi possível carregar as coleções agora.")
            }));
          });
        }
        if (layout === "collections") return;
        var wl = watchlistEntry();
        var cats = visible((wl ? [wl] : []).concat(boardCatalogs(), boardEntries()));
        if (!cats.length) rows2.appendChild(h("div.row-empty", {
          text: t("Nenhum catálogo. Entre na sua conta em Ajustes.")
        }));
        pending2 = pending2.concat(cats.map(function (c) {
          return Object.assign(buildRow(c, rows2), {
            state: "idle"
          });
        }));
        loadNearby();
      }).catch(function (e) {
        clear(rows2);
        rows2.appendChild(h("div.row-empty", {
          text: t("Erro ao carregar addons: {msg}", {
            msg: e.message
          })
        }));
      });
    }
    heroUi.load();
    var view = {
      el: el,
      onShow: function onShow() {
        renderContinue();
        syncContinue();
        maybeSync();
        renderNew();
        loadNew(false);
        publishBrowse();
        if (!loadedBoard) renderBoard();
        heroUi.resume();
        loadVisibleImages(el);
      },
      onHide: function onHide() {
        return heroUi.pause();
      },
      onScroll: function onScroll() {
        return loadNearby();
      },
      // Chamado quando um vídeo começa: solta as fileiras (o catálogo volta do cache ao retornar).
      freeMemory: function freeMemory() {
        stop2();
        newLoadedAt = 0;
        pending2 = [];
        clear(rows2);
        loadedBoard = false;
      },
      onKey: function onKey(e) {
        return heroUi.onKey(e);
      },
      reload: function reload() {
        heroUi.load();
        renderBoard();
      },
      destroy: function destroy() {
        clearInterval(syncTimer);
        heroUi.pause();
        if (bar.__destroy) bar.__destroy();
      }
    };
    return view;
  }
  var CW_SORTS = [{
    id: "recent",
    label: "Assistidos por último"
  }, {
    id: "progress",
    label: "Quase terminados primeiro"
  }, {
    id: "name",
    label: "Nome (A–Z)"
  }];
  function sortContinue(list2) {
    var mode = settings().cwSort;
    var frac = function frac(it) {
      return it.state && it.state.duration ? it.state.timeOffset / it.state.duration : 0;
    };
    if (mode === "progress") return list2.slice().sort(function (a, b) {
      return frac(b) - frac(a);
    });
    if (mode === "name") return list2.slice().sort(function (a, b) {
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
    return list2;
  }
  function episodeLabel(videoId, metaId) {
    if (!videoId || videoId === metaId) return "";
    var m = String(videoId).match(/:(\d+):(\d+)$/);
    return m ? epLabel(m[1], m[2]) : "";
  }
  var ROW_LIMIT = 20;
  function buildRow(entry, parent) {
    var row = h("div.row", {
      "data-anchor": "30"
    });
    var sub = entry.fetch ? entry.addon.manifest.name : typeLabel(entry.catalog.type) + " · " + (entry.addon.manifest.name || "");
    var title = h("div.row-title", null, [entry.catalog.name || entry.catalog.id, h("small", {
      text: sub
    })]);
    var track = h("div.row-track.pending", {
      "data-scroll-x": "",
      "data-group": ""
    }, spinnerLine(t("Carregando...")));
    row.appendChild(title);
    row.appendChild(track);
    parent.appendChild(row);
    var load7 = function load7() {
      return (entry.fetch ? entry.fetch() : fetchCatalog(entry)).then(function (metas) {
        clear(track);
        track.classList.remove("pending");
        if (!metas.length) {
          if (row.parentNode) parent.removeChild(row);
          return;
        }
        metas.slice(0, ROW_LIMIT).forEach(function (m) {
          track.appendChild(card(m, {
            onSelect: function onSelect() {
              return openDetails(m.type || entry.catalog.type, m.id);
            }
          }));
        });
        if (!entry.fetch && (metas.length > ROW_LIMIT || canPage(entry))) {
          track.appendChild(h("div.card.see-all", {
            focusable: true,
            onSelect: function onSelect() {
              return push(CatalogView(entry));
            }
          }, [h("div.poster-wrap", null, h("div.see-all-label", null, [h("b", {
            text: "→"
          }), t("Ver tudo")])), h("div.name", {
            text: ""
          })]));
        }
        loadVisibleImages(row);
      }).catch(function () {
        if (row.parentNode) parent.removeChild(row);
      });
    };
    return {
      row: row,
      load: load7
    };
  }
  function perf() {
    return settings().perfMode !== false;
  }
  function typeLabel(type) {
    return {
      movie: t("Filmes"),
      series: t("Séries"),
      anime: t("Animes"),
      channel: t("Canais"),
      tv: "TV"
    }[type] || type;
  }
  function buildHero() {
    var bgA = h("div.hero-bg");
    var bgB = h("div.hero-bg");
    var logo2 = h("img.hero-logo", {
      alt: ""
    });
    var title = h("div.hero-title");
    var meta = h("div.hero-meta");
    var desc = h("div.hero-desc");
    var dots = h("div.hero-dots");
    var watchBtn = h("div.btn.primary", {
      focusable: true,
      html: '<span class="ico">▶</span>' + t("Assistir"),
      onSelect: function onSelect() {
        return open(true);
      }
    });
    var infoBtn = h("div.btn", {
      focusable: true,
      html: '<span class="ico">ⓘ</span>' + t("Detalhes"),
      onSelect: function onSelect() {
        return open(false);
      }
    });
    var buttons = h("div.hero-buttons", {
      "data-group": ""
    }, [watchBtn, infoBtn]);
    buttons.__last = watchBtn;
    var ambient = h("div.hero-ambient");
    var el = h("div.hero", {
      "data-anchor": "0"
    }, [bgA, bgB, ambient, h("div.hero-shade-left"), h("div.hero-shade-bottom"), h("div.hero-info", null, [logo2, title, meta, desc, buttons, dots])]);
    var items3 = [];
    var index2 = 0;
    var timer = null;
    var front = bgA;
    var paused = true;
    var bgToken = 0;
    var ambientTimer = null;
    var ambientOn = false;
    function stopAmbient() {
      clearTimeout(ambientTimer);
      ambientTimer = null;
      if (ambientOn) {
        ambientOn = false;
        ambient.classList.remove("show");
        var f = ambient.firstChild;
        if (f) f.src = "about:blank";
        clear(ambient);
      }
    }
    function queueAmbient() {
      stopAmbient();
      if (!settings().ambientMode || paused) return;
      var it = items3[index2];
      ambientTimer = setTimeout(function () {
        if (paused || items3[index2] !== it || el.getBoundingClientRect().bottom < 200) return;
        var ids2 = it.trailers && it.trailers.length ? Promise.resolve(it.trailers) : fetchMeta(it.type, it.id).then(function (m) {
          return it.trailers = trailerIds(m || {});
        });
        ids2.then(function (list2) {
          if (paused || items3[index2] !== it || !list2.length) return;
          clearTimeout(timer);
          ambientOn = true;
          var frame = h("iframe", {
            tabindex: "-1",
            allow: "autoplay; encrypted-media",
            referrerpolicy: "origin"
          });
          frame.onload = function () {
            return setTimeout(function () {
              return ambientOn && ambient.classList.add("show");
            }, 1500);
          };
          frame.src = "https://www.youtube-nocookie.com/embed/" + list2[0] + "?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&start=5";
          ambient.appendChild(frame);
          ambientTimer = setTimeout(function () {
            stopAmbient();
            schedule();
          }, 9e4);
        }).catch(function () {});
      }, 4e3);
    }
    function open(play) {
      var it = items3[index2];
      if (it) openDetails(it.type, it.id, {
        autoStreams: play
      });
    }
    function render() {
      var it = items3[index2];
      if (!it) {
        el.style.display = "none";
        return;
      }
      el.style.display = "";
      var back2 = front === bgA ? bgB : bgA;
      var pre = new Image();
      var token = ++bgToken;
      pre.onload = function () {
        if (token !== bgToken) return;
        back2.style.backgroundImage = 'url("' + it.background + '")';
        requestAnimationFrame(function () {
          return requestAnimationFrame(function () {
            back2.classList.add("show");
            front.classList.remove("show");
            front = back2;
          });
        });
      };
      pre.src = it.background;
      title.textContent = it.name;
      title.style.display = "none";
      logo2.style.display = "";
      logo2.onerror = function () {
        logo2.style.display = "none";
        title.style.display = "";
      };
      logo2.src = it.logo;
      var parts = [];
      if (it.year) parts.push(it.year);
      if (it.runtime) parts.push(it.runtime);
      if (it.genres && it.genres.length) parts.push(it.genres.slice(0, 3).join(", "));
      meta.innerHTML = (it.rating ? '<span class="imdb">★ ' + escapeHtml(it.rating) + "</span> · " : "") + escapeHtml(parts.join(" · "));
      desc.textContent = it.description || "";
      clear(dots);
      items3.forEach(function (_, i) {
        return dots.appendChild(h("span", {
          cls: i === index2 ? "on" : ""
        }));
      });
      var nx = items3[(index2 + 1) % items3.length];
      if (nx) new Image().src = nx.background;
      queueAmbient();
    }
    function schedule() {
      clearTimeout(timer);
      if (paused || ambientOn || items3.length < 2 || perf()) return;
      timer = setTimeout(function () {
        if (el.getBoundingClientRect().bottom > 0) {
          index2 = (index2 + 1) % items3.length;
          render();
        }
        schedule();
      }, ROTATE_MS);
    }
    function go(delta) {
      if (!items3.length) return;
      index2 = (index2 + delta + items3.length) % items3.length;
      render();
      schedule();
    }
    return {
      el: el,
      load: function load() {
        return load2().then(function (list2) {
          items3 = list2.slice(0, 12);
          index2 = 0;
          render();
          schedule();
        }).catch(function () {
          items3 = [];
          render();
        });
      },
      // Fora de vista, o banner solta os fundos (2 imagens 1920x1080 ≈ 16 MB na memória).
      pause: function pause() {
        paused = true;
        stopAmbient();
        clearTimeout(timer);
        bgToken++;
        bgA.style.backgroundImage = "";
        bgB.style.backgroundImage = "";
        bgA.classList.remove("show");
        bgB.classList.remove("show");
      },
      resume: function resume() {
        paused = false;
        if (items3.length) render();
        schedule();
      },
      // Esquerda no primeiro botão / direita no último: troca o destaque.
      onKey: function onKey(e) {
        var cur = current2();
        if (!cur || !buttons.contains(cur)) return false;
        if (e.keyCode === KEY.LEFT && cur === watchBtn) {
          go(-1);
          return true;
        }
        if (e.keyCode === KEY.RIGHT && cur === infoBtn) {
          go(1);
          return true;
        }
        return false;
      }
    };
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;"
      }[c];
    });
  }

  // src/js/views/search.js
  function SearchView() {
    var el = h("div.view");
    var scroller = h("div.scroll-y", {
      "data-scroll-y": ""
    });
    var bar = topbar("search", goTab);
    var input = h("input.input", {
      type: "text",
      placeholder: t("Buscar filmes e séries..."),
      focusable: true,
      "data-autofocus": ""
    });
    var results = h("div.rows");
    scroller.appendChild(bar);
    var history = h("div.filters.search-history", {
      "data-group": ""
    });
    scroller.appendChild(h("div.search-box", null, input));
    scroller.appendChild(history);
    scroller.appendChild(results);
    el.appendChild(scroller);
    var token = 0;
    input.__submit = function (q2) {
      return run3(q2);
    };
    var HIST = "searchHistory";
    function renderHistory() {
      clear(history);
      if (settings().searchHistory === false) return;
      var list2 = get(HIST, []) || [];
      if (!list2.length) return;
      history.appendChild(h("span.hist-label", {
        text: t("Buscas recentes:")
      }));
      list2.forEach(function (q2) {
        return history.appendChild(h("div.chip", {
          focusable: true,
          text: q2,
          onSelect: function onSelect() {
            input.value = q2;
            run3(q2);
          }
        }));
      });
      history.appendChild(h("div.chip", {
        focusable: true,
        text: "✕ " + t("Limpar"),
        onSelect: function onSelect() {
          set(HIST, []);
          renderHistory();
        }
      }));
    }
    function remember(q2) {
      if (settings().searchHistory === false) return;
      var list2 = (get(HIST, []) || []).filter(function (x) {
        return x.toLowerCase() !== q2.toLowerCase();
      });
      list2.unshift(q2);
      set(HIST, list2.slice(0, 8));
      renderHistory();
    }
    renderHistory();
    function run3(q2) {
      var query = (q2 || "").trim();
      clear(results);
      if (query.length < 2) {
        results.appendChild(h("div.hint", {
          text: t("Digite pelo menos 2 letras e confirme no teclado.")
        }));
        return;
      }
      var my = ++token;
      remember(query);
      results.appendChild(spinnerLine(t('Buscando "{q}"...', {
        q: query
      })));
      var people = h("div.row.people-row", {
        "data-anchor": "30"
      });
      searchPeople(query).then(function (list2) {
        if (my !== token || !list2.length) return;
        people.appendChild(h("div.row-title", {
          text: t("Pessoas")
        }));
        people.appendChild(h("div.row-track", {
          "data-scroll-x": "",
          "data-group": ""
        }, list2.map(function (p) {
          return h("div.cast.person-card", {
            focusable: true,
            onSelect: function onSelect() {
              return push(PersonView(p.id, p.name));
            }
          }, [h("div.ph", null, h("img", {
            src: p.photo,
            alt: ""
          })), h("div.nm", {
            text: p.name
          })]);
        })));
        results.insertBefore(people, results.firstChild);
      }).catch(function () {});
      load().then(function () {
        if (my !== token) return;
        clear(results);
        if (people.firstChild) results.appendChild(people);
        var cats = searchCatalogs();
        if (!cats.length) results.appendChild(h("div.hint", {
          text: t("Nenhum addon com busca instalado.")
        }));
        var found = 0;
        var pending2 = cats.length;
        cats.forEach(function (entry) {
          var row = h("div.row", {
            "data-anchor": "30"
          });
          var track = h("div.row-track", {
            "data-scroll-x": "",
            "data-group": ""
          });
          row.appendChild(h("div.row-title", null, [entry.catalog.name || entry.catalog.id, h("small", {
            text: catalogTitle(entry).split(" · ").pop()
          })]));
          row.appendChild(track);
          fetchCatalog(entry, {
            search: query
          }).then(function (metas) {
            if (my !== token || !metas.length) return;
            found++;
            metas.slice(0, 30).forEach(function (m) {
              return track.appendChild(card(m, {
                onSelect: function onSelect() {
                  return openDetails(m.type || entry.catalog.type, m.id);
                }
              }));
            });
            results.appendChild(row);
            loadVisibleImages(row);
          }).catch(function () {}).then(function () {
            pending2--;
            if (my === token && pending2 === 0 && !found) results.appendChild(h("div.hint", {
              text: t('Nada encontrado para "{q}".', {
                q: query
              })
            }));
          });
        });
      });
    }
    run3("");
    return {
      el: el,
      onShow: function onShow() {
        return loadVisibleImages(el);
      },
      destroy: function destroy() {
        return bar.__destroy && bar.__destroy();
      },
      focusInput: function focusInput() {
        return focus(input);
      },
      // From the phone remote: fill the box and run the search.
      search: function search(q2) {
        input.value = q2;
        run3(q2);
      }
    };
  }

  // src/js/views/library.js
  var FILTERS = [{
    id: "all",
    label: "Tudo"
  }, {
    id: "movie",
    label: "Filmes"
  }, {
    id: "series",
    label: "Séries"
  }];
  function LibraryView() {
    var el = h("div.view");
    var scroller = h("div.scroll-y", {
      "data-scroll-y": ""
    });
    var bar = topbar("library", goTab);
    var filters = h("div.filters", {
      "data-group": ""
    });
    var grid = h("div.grid");
    scroller.appendChild(bar);
    scroller.appendChild(filters);
    scroller.appendChild(grid);
    el.appendChild(scroller);
    var filter = "all";
    function renderFilters() {
      clear(filters);
      FILTERS.forEach(function (f) {
        return filters.appendChild(h("div.chip", {
          focusable: true,
          cls: f.id === filter ? "active" : "",
          text: t(f.label),
          onSelect: function onSelect() {
            filter = f.id;
            renderFilters();
            renderGrid();
            focus(filters.children[FILTERS.indexOf(f)]);
          }
        }));
      });
    }
    function renderGrid() {
      clear(grid);
      var items3 = cachedLibrary().filter(function (it) {
        return !it.removed && (filter === "all" || it.type === filter);
      }).sort(function (a, b) {
        return String(b._mtime || "").localeCompare(String(a._mtime || ""));
      });
      if (!items3.length) {
        grid.appendChild(h("div.hint", {
          text: isLoggedIn() ? t("Sua biblioteca está vazia.") : t("Entre na sua conta em Ajustes para ver a biblioteca.")
        }));
        return;
      }
      items3.forEach(function (it) {
        return grid.appendChild(card({
          name: it.name,
          poster: it.poster
        }, {
          onSelect: function onSelect() {
            return openDetails(it.type, it._id);
          }
        }));
      });
      loadVisibleImages(el, 400);
    }
    renderFilters();
    grid.appendChild(spinnerLine(t("Carregando biblioteca...")));
    return {
      el: el,
      onShow: function onShow() {
        renderGrid();
        getLibrary().then(function () {
          return renderGrid();
        }).catch(function () {});
      },
      destroy: function destroy() {
        return bar.__destroy && bar.__destroy();
      }
    };
  }

  // src/js/api/update.js
  var REPO = "moahmmed597/7M-Samsung";
  var REPO_URL = "https://github.com/" + REPO;
  var VERSION = "1.2.0";
  var BUILD = "2026-11-14T09:30:26.108Z";
  var RAW = "https://raw.githubusercontent.com/" + REPO + "/main/";
  var PURGE = "https://purge.jsdelivr.net/gh/" + REPO + "/";
  var FILES = ["package.json", "dist/index.html", "dist/loader.js", "dist/app.js", "dist/app.css", "dist/remote-service.js", "dist/build.json"];
  function latest() {
    var bust = "?t=" + Date.now();
    return Promise.all([getJSON(RAW + "dist/build.json" + bust, {
      timeout: 15e3,
      quiet: true
    }), getJSON("https://api.github.com/repos/" + REPO + "/commits?per_page=1", {
      timeout: 15e3,
      quiet: true
    }).catch(function () {
      return null;
    })]).then(function (r) {
      var b = r[0] || {};
      var c = r[1] && r[1][0] && r[1][0].commit;
      return {
        build: b.build,
        version: b.version || VERSION,
        message: c ? String(c.message).split("\n")[0] : "",
        date: c && c.committer && c.committer.date || b.build
      };
    });
  }
  function check2() {
    return latest().then(function (info2) {
      saveSettings({
        lastUpdateCheck: Date.now()
      });
      return info2.build && info2.build !== BUILD && Date.parse(info2.build) > Date.parse(BUILD) ? info2 : null;
    });
  }
  function apply2() {
    return Promise.all(FILES.map(function (f) {
      return getJSON(PURGE + f, {
        timeout: 8e3,
        quiet: true
      }).catch(function () {
        return null;
      });
    })).then(function () {
      window.location.reload();
      return true;
    });
  }
  function shouldAutoCheck() {
    var last2 = settings().lastUpdateCheck || 0;
    return Date.now() - last2 > 24 * 3600 * 1e3;
  }

  // src/js/views/login.js
  function openLogin(onDone) {
    push(LoginView(onDone));
  }
  function LoginView(onDone) {
    var el = h("div.view");
    var codeEl = h("div.code", {
      text: "····"
    });
    var qr = h("img.qr", {
      alt: ""
    });
    var codeStatus = h("p", {
      text: t("Gerando código...")
    });
    var email = h("input.input", {
      type: "email",
      placeholder: t("E-mail"),
      focusable: true
    });
    var pass = h("input.input", {
      type: "password",
      placeholder: t("Senha"),
      focusable: true
    });
    var err = h("div.err");
    var btn = h("div.btn.primary", {
      focusable: true,
      text: t("Entrar"),
      onSelect: function onSelect() {
        return doLogin();
      }
    });
    pass.__submit = function () {
      return doLogin();
    };
    email.__submit = function () {
      return focus(pass);
    };
    el.appendChild(h("div.login", null, h("div.login-card", null, [h("div.login-col", null, [h("h1", {
      text: t("Entrar com o celular")
    }), h("p", {
      html: t("No celular ou PC, abra <b>link.stremio.com</b> e digite o código:")
    }), codeEl, qr, codeStatus]), h("div.login-col", null, [h("h1", {
      text: t("Ou com e-mail")
    }), h("p", {
      text: t("Use a mesma conta do Stremio. Seus addons e a biblioteca vêm junto.")
    }), email, pass, err, h("div", {
      "data-group": ""
    }, [btn, h("div.btn", {
      focusable: true,
      text: t("Cancelar"),
      onSelect: function onSelect() {
        return pop();
      }
    })])])])));
    var alive = true;
    var pollTimer = null;
    var code = null;
    function newCode() {
      createLinkCode().then(function (r) {
        if (!alive) return;
        code = r.code;
        codeEl.textContent = r.code;
        qr.src = r.qrcode;
        codeStatus.textContent = t("Aguardando confirmação...");
        poll2(0);
      }).catch(function () {
        codeStatus.textContent = t("Não foi possível gerar o código. Use o e-mail ao lado.");
      });
    }
    function poll2(n) {
      clearTimeout(pollTimer);
      if (!alive) return;
      if (n > 100) {
        codeStatus.textContent = t("Código expirou. Gerando outro...");
        return newCode();
      }
      pollTimer = setTimeout(function () {
        readLinkCode(code).then(function (ok) {
          return ok ? done() : poll2(n + 1);
        }).catch(function () {
          return poll2(n + 1);
        });
      }, 3e3);
    }
    function doLogin() {
      clear(err);
      if (!email.value || !pass.value) {
        err.textContent = t("Preencha e-mail e senha.");
        return;
      }
      err.textContent = t("Entrando...");
      login(email.value.trim(), pass.value).then(function () {
        return done();
      }).catch(function (e) {
        return err.textContent = e.message || t("Falha no login");
      });
    }
    function done() {
      if (!alive) return;
      alive = false;
      toast(t("Conectado à conta Stremio"));
      pop();
      if (onDone) onDone();
    }
    newCode();
    return {
      el: el,
      destroy: function destroy() {
        alive = false;
        clearTimeout(pollTimer);
      }
    };
  }

  // src/js/lib/theme.js
  var THEMES2 = [{
    id: "purple",
    label: "Roxo",
    main: "#7b5bf5",
    light: "#9d85ff",
    pale: "#c9bbff"
  }, {
    id: "gold",
    label: "Dourado",
    main: "#c9961a",
    light: "#e0b54a",
    pale: "#f2dca0"
  }, {
    id: "teal",
    label: "Verde-água",
    main: "#14958c",
    light: "#3fc9bf",
    pale: "#a8ebe6"
  }, {
    id: "red",
    label: "Vermelho",
    main: "#d6334a",
    light: "#f0596c",
    pale: "#f7b8c1"
  }, {
    id: "blue",
    label: "Azul",
    main: "#2f6fe0",
    light: "#5b93f5",
    pale: "#b9d0fb"
  }, {
    id: "green",
    label: "Verde",
    main: "#2e9e57",
    light: "#4fc27a",
    pale: "#b6e8c8"
  }, {
    id: "pink",
    label: "Rosa",
    main: "#d43f8d",
    light: "#ec6aae",
    pale: "#f7bcdb"
  }, {
    id: "orange",
    label: "Laranja",
    main: "#e0661f",
    light: "#f58c4c",
    pale: "#fbcfae"
  }, {
    id: "cyan",
    label: "Ciano",
    main: "#1595b8",
    light: "#3ec0e0",
    pale: "#a9e5f4"
  }, {
    id: "indigo",
    label: "Índigo",
    main: "#4652d6",
    light: "#6f7af0",
    pale: "#c3c8fa"
  }, {
    id: "silver",
    label: "Prata",
    main: "#6f7a8c",
    light: "#9aa5b8",
    pale: "#d5dbe6"
  }];
  var SHAPES = [{
    id: "rounded",
    label: "Arredondado"
  }, {
    id: "square",
    label: "Reto"
  }, {
    id: "soft",
    label: "Bem redondo"
  }];
  var SIZES2 = [{
    id: "small",
    label: "Pequeno"
  }, {
    id: "medium",
    label: "Médio"
  }, {
    id: "large",
    label: "Grande"
  }];
  var FOCUS = [{
    id: "glow",
    label: "Contorno e aumento"
  }, {
    id: "outline",
    label: "Só contorno"
  }, {
    id: "lift",
    label: "Só aumento"
  }];
  var BACKGROUNDS = [{
    id: "default",
    label: "Escuro (padrão)"
  }, {
    id: "oled",
    label: "Preto puro (OLED)"
  }, {
    id: "glow",
    label: "Escuro com brilho da cor"
  }];
  var FONTS2 = [{
    id: "samsung",
    label: "Samsung (da TV)"
  }, {
    id: "montserrat",
    label: "Montserrat (Kai)"
  }];
  function applyLook(s) {
    document.body.classList.toggle("font-samsung", (s.appFont || "samsung") === "samsung");
    var b = document.body;
    var set2 = function set2(prefix, value, all2) {
      return all2.forEach(function (x) {
        return b.classList.toggle(prefix + x.id, x.id === value);
      });
    };
    set2("shape-", s.cardShape || "rounded", SHAPES);
    set2("cards-", s.cardSize || "medium", SIZES2);
    set2("focus-", s.focusStyle || "glow", FOCUS);
    var bg = s.bgStyle || (s.oled ? "oled" : "default");
    b.classList.toggle("oled", bg === "oled");
    b.classList.toggle("bg-glow", bg === "glow");
  }
  var BASE2 = THEMES2[0];
  function rgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255].join(",");
  }
  function recolor(css, th) {
    var swap = [[BASE2.main, th.main], [BASE2.light, th.light], [BASE2.pale, th.pale], ["rgba(" + rgb(BASE2.main) + ",", "rgba(" + rgb(th.main) + ","], ["rgba(" + rgb(BASE2.light) + ",", "rgba(" + rgb(th.light) + ","], ["#b9a8ff", th.pale]];
    swap.forEach(function (p) {
      css = css.split(p[0]).join(p[1]).split(p[0].toUpperCase()).join(p[1]);
    });
    return css;
  }
  function apply3(id) {
    var old = document.getElementById("theme-css");
    if (old) old.parentNode.removeChild(old);
    var th = THEMES2.find(function (x2) {
      return x2.id === id;
    });
    if (!th || th === BASE2) return;
    var x = new XMLHttpRequest();
    x.open("GET", (window.__KAI_BASE__ || "") + "app.css");
    x.onload = function () {
      if (x.status !== 200) return;
      var style = document.createElement("style");
      style.id = "theme-css";
      style.textContent = recolor(x.responseText, th);
      document.head.appendChild(style);
    };
    x.send();
  }

  // src/js/views/trackLink.js
  var NAMES = {
    trakt: "Trakt",
    simkl: "Simkl"
  };
  function openTrackLink(provider, onDone) {
    push(TrackLinkView(provider, onDone));
  }
  function TrackLinkView(provider, onDone) {
    var name = NAMES[provider];
    var el = h("div.view");
    var codeEl = h("div.code", {
      text: "····"
    });
    var qr = h("img.qr.qr-big", {
      alt: ""
    });
    var urlEl = h("p");
    var status2 = h("p", {
      text: t("Gerando código...")
    });
    el.appendChild(h("div.login", null, h("div.login-card", null, [h("div.login-col", null, [h("h1", {
      text: t("Conectar {name}", {
        name: name
      })
    }), urlEl, codeEl, status2, h("div", {
      "data-group": ""
    }, [h("div.btn", {
      focusable: true,
      text: t("Cancelar"),
      onSelect: function onSelect() {
        return pop();
      }
    })])]), h("div.login-col", null, [qr])])));
    var alive = true;
    var link = startLink(provider, function (user2) {
      if (!alive) return;
      toast(user2 ? t("{name} conectado: {user}", {
        name: name,
        user: user2
      }) : t("{name} conectado", {
        name: name
      }), 4e3);
      pop();
      if (onDone) onDone();
    }, function (why) {
      if (!alive) return;
      status2.textContent = why === "expired" ? t("Código expirou. Abra de novo.") : why === "denied" ? t("Acesso negado no site.") : t("Falhou: {msg}", {
        msg: why
      });
    });
    link.ready.then(function () {
      if (!alive) return;
      codeEl.textContent = link.code;
      urlEl.innerHTML = "";
      urlEl.appendChild(h("b", {
        text: t("Aponte a câmera do celular para o QR, entre na sua conta e pronto: conecta sozinho.")
      }));
      urlEl.appendChild(h("br"));
      urlEl.appendChild(document.createTextNode(t("Ou abra") + " "));
      urlEl.appendChild(h("b", {
        text: link.url.replace(/^https?:\/\//, "")
      }));
      urlEl.appendChild(document.createTextNode(" " + t("e digite o código:")));
      var direct = provider === "trakt" ? link.url.replace(/\/+$/, "") + "/" + encodeURIComponent(link.code) : "https://simkl.com/pin/" + encodeURIComponent(link.code);
      qr.src = qrImage(direct, 360);
      status2.textContent = t("Aguardando confirmação...");
    }).catch(function () {});
    return {
      el: el,
      destroy: function destroy() {
        alive = false;
        link.cancel();
      }
    };
  }

  // src/js/views/deviceLink.js
  function openDeviceLink(flow, onDone) {
    push(DeviceLinkView(flow, onDone));
  }
  function DeviceLinkView(flow, onDone) {
    var el = h("div.view");
    var codeEl = h("div.code", {
      text: "····"
    });
    var qr = h("img.qr.qr-big", {
      alt: ""
    });
    var urlEl = h("p");
    var status2 = h("p", {
      text: t("Gerando código...")
    });
    el.appendChild(h("div.login", null, h("div.login-card", null, [h("div.login-col", null, [h("h1", {
      text: t("Conectar {name}", {
        name: flow.name
      })
    }), urlEl, codeEl, status2, h("div", {
      "data-group": ""
    }, [h("div.btn", {
      focusable: true,
      text: t("Cancelar"),
      onSelect: function onSelect() {
        return pop();
      }
    })])]), h("div.login-col", null, [qr])])));
    var alive = true;
    var timer = null;
    flow.start().then(function (s) {
      if (!alive) return;
      codeEl.textContent = s.code || "";
      urlEl.appendChild(h("b", {
        text: flow.hint || t("Aponte a câmera do celular para o QR, entre na sua conta e pronto: conecta sozinho.")
      }));
      urlEl.appendChild(h("br"));
      urlEl.appendChild(document.createTextNode(t("Ou abra") + " "));
      urlEl.appendChild(h("b", {
        text: String(s.url || "").replace(/^https?:\/\//, "")
      }));
      if (s.code) urlEl.appendChild(document.createTextNode(" " + t("e digite o código:")));
      qr.src = qrImage(s.qrUrl || s.url, 360);
      status2.textContent = t("Aguardando confirmação...");
      var until = Date.now() + (s.expiresIn || 600) * 1e3;
      var _tick = function tick() {
        if (!alive) return;
        if (Date.now() > until) {
          status2.textContent = t("Código expirou. Abra de novo.");
          return;
        }
        s.poll().then(function (r) {
          if (!alive) return;
          if (r === "ok") {
            toast(t("{name} conectado", {
              name: flow.name
            }), 4e3);
            pop();
            if (onDone) onDone();
            return;
          }
          if (r === "expired") return status2.textContent = t("Código expirou. Abra de novo.");
          if (r === "denied") return status2.textContent = t("Acesso negado no site.");
          if (r !== "pending") status2.textContent = t("Falhou: {msg}", {
            msg: r
          });
          timer = setTimeout(_tick, Math.max(3, s.interval || 5) * 1e3);
        }).catch(function () {
          return alive && (timer = setTimeout(_tick, Math.max(3, s.interval || 5) * 1e3));
        });
      };
      timer = setTimeout(_tick, Math.max(3, s.interval || 5) * 1e3);
    }).catch(function (e) {
      return alive && (status2.textContent = t("Falhou: {msg}", {
        msg: e.message
      }));
    });
    return {
      el: el,
      destroy: function destroy() {
        alive = false;
        clearTimeout(timer);
      }
    };
  }

  // src/js/lib/speedtest.js
  var TRACE = "https://cloudflare.com/cdn-cgi/trace";
  var DOWN = "https://speed.cloudflare.com/__down?bytes=";
  function xhr(url2, binary, timeout) {
    return new Promise(function (resolve2, reject) {
      var x = new XMLHttpRequest();
      x.open("GET", url2 + (url2.indexOf("?") >= 0 ? "&" : "?") + "_=" + Date.now() + Math.random(), true);
      if (binary) x.responseType = "arraybuffer";
      x.timeout = timeout;
      var t0 = Date.now();
      x.onload = function () {
        return x.status >= 200 && x.status < 300 ? resolve2({
          ms: Date.now() - t0,
          bytes: binary && x.response ? x.response.byteLength : 0
        }) : reject(new Error("HTTP " + x.status));
      };
      x.onerror = function () {
        return reject(new Error("network"));
      };
      x.ontimeout = function () {
        return reject(new Error("timeout"));
      };
      x.send();
    });
  }
  function run2(onStep) {
    var pings = [];
    var ping = function ping() {
      return xhr(TRACE, false, 5e3).then(function (r) {
        return pings.push(r.ms);
      });
    };
    onStep && onStep("ping");
    return ping().then(ping).then(ping).then(function () {
      onStep && onStep("download");
      return xhr(DOWN + 2e6, true, 2e4);
    }).then(function (warm) {
      var firstMbps = warm.bytes * 8 / (warm.ms / 1e3) / 1e6;
      var size = firstMbps > 40 ? 5e7 : firstMbps > 10 ? 2e7 : 5e6;
      return xhr(DOWN + size, true, 45e3).then(function (r) {
        return r.bytes * 8 / (r.ms / 1e3) / 1e6;
      });
    }).then(function (mbps) {
      return {
        pingMs: Math.min.apply(null, pings),
        mbps: Math.round(mbps * 10) / 10
      };
    });
  }

  // src/js/views/settings.js
  var LANGS2 = [["Árabe", ["ara", "ar"]], ["Inglês", ["eng", "en"]], ["Francês", ["fre", "fra", "fr"]], ["Espanhol", ["spa", "es"]], ["Turco", ["tur", "tr"]], ["Persa", ["per", "fas", "fa"]], ["Urdu", ["urd", "ur"]], ["Hindi", ["hin", "hi"]], ["Russo", ["rus", "ru"]], ["Alemão", ["ger", "deu", "de"]], ["Italiano", ["ita", "it"]], ["Português", ["por", "pob", "pt"]], ["Japonês", ["jpn", "ja"]], ["Coreano", ["kor", "ko"]], ["Chinês", ["chi", "zho", "zh"]], ["Indonésio", ["ind", "id"]], ["Malaio", ["may", "msa", "ms"]]];
  var SUB_LANGS = LANGS2.map(function (l) {
    return {
      label: l[0],
      value: l[1]
    };
  }).concat([{
    label: "Nenhum (não ligar sozinho)",
    value: []
  }]);
  var AUDIO_LANGS = [{
    label: "Original do arquivo",
    value: []
  }].concat(LANGS2.map(function (l) {
    return {
      label: l[0],
      value: l[1]
    };
  }));
  var RECOMMENDED = [{
    id: "community.anime.kitsu",
    name: "Anime Kitsu",
    url: "https://anime-kitsu.strem.fun/manifest.json",
    desc: "Catálogos e detalhes de animes (usado pelo calendário)"
  }, {
    id: "org.stremio.opensubtitlesv3",
    name: "OpenSubtitles v3",
    url: "https://opensubtitles-v3.strem.io/manifest.json",
    desc: "Legendas em português para quase tudo"
  }];
  function SettingsView() {
    var el = h("div.view");
    var scroller = h("div.scroll-y", {
      "data-scroll-y": ""
    });
    var bar = topbar("settings", goTab);
    var body = h("div.settings");
    var rail = h("div.set-rail", {
      "data-group": ""
    });
    scroller.appendChild(bar);
    scroller.appendChild(body);
    el.appendChild(scroller);
    el.appendChild(rail);
    var device = "";
    deviceInfo().then(function (d) {
      device = [d.modelName, d.firmwareVersion, d.sdkVersion ? "webOS " + d.sdkVersion : ""].filter(Boolean).join(" · ");
    }).catch(function () {});
    function row(label, sub, value, onSelect, extra) {
      return h("div.set-row", {
        focusable: true,
        onSelect: onSelect
      }, [h("div.label", null, [label, sub ? h("small", {
        text: sub
      }) : null]), extra || h("div.value", {
        text: value || ""
      })]);
    }
    function checkForUpdate() {
      toast(t("Procurando atualização..."));
      check2().then(function (info2) {
        if (!info2) return toast(t("Você já tem a versão mais nova."));
        confirmDialog(t("Atualização disponível ({date}): {msg}", {
          date: shortDate(info2.date),
          msg: info2.message || ""
        }), t("Atualizar agora"), function () {
          toast(t("Atualizando... o app vai recarregar."), 6e4);
          apply2(info2).then(function (ok) {
            if (!ok) toast(t("A atualização ainda está chegando. Tente de novo em alguns minutos."), 6e3);
          });
        });
      }).catch(function (e) {
        return toast(t("Não foi possível verificar: {msg}", {
          msg: e.message
        }), 5e3);
      });
    }
    function shortDate(iso) {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    }
    function installFromUrl(url2, name) {
      if (!isLoggedIn()) return toast(t("Entre na conta primeiro"));
      confirmDialog(t("Instalar {name} na sua conta Stremio?", {
        name: name
      }), t("Instalar"), function () {
        toast(t("Instalando..."));
        installAddon(url2).then(function (m) {
          return load(true).then(function () {
            return m;
          });
        }).then(function (m) {
          dropTab("home");
          toast(t("{name} instalado na sua conta", {
            name: m.name || "Addon"
          }));
          render();
        }).catch(function (e) {
          return toast(t("Não foi possível instalar: {msg}", {
            msg: e.message
          }), 5e3);
        });
      });
    }
    function toggle(on) {
      return h("div.toggle", {
        cls: on ? "on" : ""
      }, h("i"));
    }
    var page2 = "c-account";
    var focusContent = false;
    function keyInput(title, sub, key3, placeholder) {
      var s = settings();
      var input = h("input.input", {
        type: "text",
        value: s[key3] || "",
        placeholder: placeholder
      });
      input.__submit = function (v) {
        var patch = {};
        patch[key3] = v.trim();
        saveSettings(patch);
        toast(v.trim() ? t("Chave salva") : t("Chave removida"));
        render();
      };
      return h("div.set-row", {
        focusable: true,
        onSelect: function onSelect() {
          return select(input);
        }
      }, [h("div.label", null, [title, h("small", {
        text: sub
      })]), input]);
    }
    var PARENT = {
      tracking: "c-integrations",
      skip: "c-integrations",
      debrid: "c-integrations",
      servers: "c-integrations",
      home: "c-appearance",
      badges: "c-playback"
    };
    function openPage(name, focus2) {
      page2 = name;
      focusContent = focus2 !== false;
      render();
      scroller.scrollTop = 0;
    }
    function goMain() {
      openPage(PARENT[page2] || page2);
    }
    function pageHeader(title) {
      if (PARENT[page2]) body.appendChild(row("‹ " + t("Voltar"), "", "", function () {
        return goMain();
      }));
      body.appendChild(h("div.set-title", {
        text: title
      }));
    }
    function phoneSetupBox() {
      var box = h("div.set-row.phone-remote", {
        focusable: true
      }, h("div.phone-sub", {
        text: t("Carregando...")
      }));
      info().then(function (i) {
        clear(box);
        var url2 = setupUrl(i);
        if (!url2) {
          box.appendChild(h("div.phone-sub", {
            text: t("O serviço da TV não está rodando. Feche o app e abra de novo.")
          }));
          return;
        }
        box.appendChild(h("img.phone-qr", {
          src: qrImage(url2, 300),
          alt: ""
        }));
        box.appendChild(h("div.phone-text", null, [h("div.phone-title", {
          text: t("Coloque as chaves pelo celular")
        }), h("div.phone-sub", {
          text: t("Aponte a câmera para o código, cole as chaves e toque em Enviar. Elas ficam só nesta TV.")
        }), h("div.phone-url", {
          text: "http://" + i.ip + ":" + i.port + "/setup"
        }), h("div.phone-sub", {
          text: t("PIN: {pin}", {
            pin: i.pin
          })
        })]));
      });
      return box;
    }
    function keyQr(key3, name) {
      info().then(function (i) {
        var url2 = setupUrl(i);
        if (!url2) return toast(t("O serviço da TV não está rodando. Feche o app e abra de novo."), 5e3);
        var close = h("div.btn.primary", {
          focusable: true,
          "data-autofocus": "",
          text: t("Fechar"),
          onSelect: function onSelect() {
            return done();
          }
        });
        var box = h("div.modal-box.center.qr-modal", null, [h("h3", {
          text: name
        }), h("img.phone-qr", {
          src: qrImage(url2 + "&only=" + key3, 320),
          alt: ""
        }), h("div.modal-text", {
          text: t("Aponte a câmera: abra a página da chave, copie, cole e envie.")
        }), h("div.modal-actions", null, close)]);
        var modal = h("div.modal", null, box);
        document.getElementById("app").appendChild(modal);
        var layer = pushLayer(modal, {
          onBack: function onBack() {
            return done();
          }
        });
        focusFirst(modal);
        var watch = setInterval(function () {
          return (settings()[key3] || "").trim() && done();
        }, 1500);
        function done() {
          clearInterval(watch);
          popLayer(layer);
          if (modal.parentNode) modal.parentNode.removeChild(modal);
          render();
        }
      });
    }
    function phoneKeyRow(key3, name) {
      return row("📱 " + t("{name} pelo celular", {
        name: name
      }), t("QR que abre direto a página da chave"), "", function () {
        return keyQr(key3, name);
      });
    }
    function accountCard(p) {
      var name = p === "trakt" ? "Trakt" : "Simkl";
      var acc = account(p);
      var on = isConnected(p);
      var state = on ? acc && acc.user ? t("Conectado: {user}", {
        user: acc.user
      }) : t("Conectado") : needsReconnect(p) ? t("Reconectar") : t("Desconectado");
      var sub = p === "trakt" ? t("Sincroniza assistidos, progresso e Continuar assistindo com o Trakt") : t("Sincroniza assistidos e progresso com o Simkl");
      var card2 = row(name, sub, state, function () {
        if (on) {
          menu(name, [{
            label: t("Sincronizar agora"),
            value: "sync"
          }, {
            label: t("Desconectar"),
            value: "off"
          }], {
            onPick: function onPick(v) {
              if (v === "sync") {
                toast(t("Sincronizando..."));
                syncNow().then(function () {
                  dropTab("home");
                  toast(t("Sincronizado"));
                });
              } else {
                disconnect2(p);
                toast(t("{name} desconectado", {
                  name: name
                }));
                render();
              }
            }
          });
          return;
        }
        if (!hasKeys(p)) return toast(t("Primeiro coloque as chaves pelo celular: aponte a câmera para o QR desta página."), 6e3);
        openTrackLink(p, function () {
          return render();
        });
      });
      card2.classList.add("acct-card", "acct-" + p);
      if (on) card2.classList.add("acct-on");
      return card2;
    }
    function renderTracking(s) {
      pageHeader(t("Rastreamento (Trakt e Simkl)"));
      body.appendChild(h("div.set-section", {
        text: t("Contas conectadas")
      }));
      PROVIDERS2.forEach(function (p) {
        return body.appendChild(accountCard(p));
      });
      if (!hasKeys("trakt") || !hasKeys("simkl")) {
        body.appendChild(h("div.set-section", {
          text: t("Chaves pelo celular")
        }));
        body.appendChild(phoneSetupBox());
      }
      var builtIn = hasBuiltInKeys("trakt") && hasBuiltInKeys("simkl");
      if (builtIn) body.appendChild(h("div.set-section", {
        text: t("Chaves próprias (opcional)")
      }));
      body.appendChild(keyInput(t("Trakt Client ID"), t("Crie um app grátis em trakt.tv/oauth/applications (Redirect: urn:ietf:wg:oauth:2.0:oob)"), "traktClientId", "Client ID"));
      body.appendChild(keyInput(t("Trakt Client Secret"), t("Opcional: só apps antigos do Trakt têm"), "traktClientSecret", "Client Secret"));
      body.appendChild(keyInput(t("Simkl Client ID"), t("Crie um app grátis em simkl.com/settings/developer"), "simklClientId", "Client ID"));
      body.appendChild(h("div.set-section", {
        text: t("Fontes")
      }));
      var SRC = [{
        id: "both",
        label: t("Trakt e Simkl")
      }, {
        id: "trakt",
        label: "Trakt"
      }, {
        id: "simkl",
        label: "Simkl"
      }];
      var srcRow = function srcRow(title, sub, key3) {
        var cur = SRC.find(function (x) {
          return x.id === s[key3];
        }) || SRC[0];
        body.appendChild(row(title, sub, cur.label, function () {
          return menu(title, SRC.map(function (x) {
            return {
              label: x.label,
              value: x.id,
              checked: x.id === cur.id
            };
          }), {
            onPick: function onPick(v) {
              var patch = {};
              patch[key3] = v;
              saveSettings(patch);
              render();
            }
          });
        }));
      };
      srcRow(t("Fonte da biblioteca"), t("De onde vêm os assistidos e o Continuar assistindo"), "librarySource");
      srcRow(t("Fonte do progresso"), t("Para onde o progresso de reprodução é enviado"), "progressSource");
      body.appendChild(h("div.set-section", {
        text: t("Recursos do Trakt")
      }));
      body.appendChild(row(t("Sincronizar agora"), t("Atualiza assistidos e Continuar assistindo"), "", function () {
        if (!connected().length) return toast(t("Conecte uma conta primeiro"));
        toast(t("Sincronizando..."));
        syncNow().then(function () {
          dropTab("home");
          toast(t("Sincronizado"));
        });
      }));
    }
    function renderSkip(s) {
      pageHeader(t("Pular trechos"));
      var flip = function flip(title, sub, on, apply4) {
        return body.appendChild(row(title, sub, "", function () {
          apply4(!on);
          render();
        }, toggle(on)));
      };
      var skipOn = s.skipMode !== "off";
      flip(t("Pular abertura"), t("IntroDB (séries e filmes) — introdb.app"), skipOn, function (v) {
        return saveSettings({
          skipMode: v ? s.skipAuto === false ? "prompt" : "auto" : "off"
        });
      });
      if (skipOn) {
        flip(t("Pular automaticamente"), t('Desligado: mostra o botão "Pular"'), s.skipMode === "auto", function (v) {
          return saveSettings({
            skipMode: v ? "auto" : "prompt",
            skipAuto: v
          });
        });
      }
      body.appendChild(h("div.set-section", {
        text: t("Animes")
      }));
      flip(t("Anime Skip"), t("Anime-Skip (anime-skip.com) e AniSkip: abertura e encerramento de animes"), s.animeSkip !== false, function (v) {
        return saveSettings({
          animeSkip: v
        });
      });
      body.appendChild(keyInput(t("AnimeSkip Client ID"), t("Sua chave do anime-skip.com (fica só nesta TV)"), "animeSkipClientId", "Client ID"));
      body.appendChild(phoneKeyRow("animeSkipClientId", "Anime-Skip"));
      body.appendChild(h("div.set-section", {
        text: t("Diagnóstico")
      }));
      var testRow = row(t("Testar o pulo de abertura"), t("Pede ao IntroDB a abertura de WandaVision T1E1 e diz por qual caminho funcionou"), "", function () {
        var v = testRow.querySelector(".value");
        v.textContent = t("Testando...");
        selfTest().then(function (how) {
          var msg = {
            direct: t("Funciona (direto)"),
            tv: t("Funciona (pelo serviço da TV)"),
            pc: t("Funciona (pelo servidor do PC)"),
            none: t("Não funciona: o serviço da TV não respondeu. Feche o app e abra de novo pelo TizenBrew.")
          }[how];
          v.textContent = how === "none" ? "✕" : "✓";
          toast(msg, 8e3);
        });
      });
      body.appendChild(testRow);
    }
    function renderDebrid(s) {
      pageHeader(t("Debrid"));
      body.appendChild(h("div.hint", {
        style: {
          padding: "0 4px 14px"
        },
        text: t("Toca fontes torrent pela sua conta debrid, sem o servidor do PC. Cada um usa a própria chave, que fica só nesta TV.")
      }));
      var act = active();
      var anyKey = PROVIDERS.some(function (p) {
        return (s[p.key] || "").trim();
      });
      body.appendChild(row(t("Usar debrid"), anyKey ? act ? t("Usando {name}", {
        name: act.name
      }) : t("Desligado") : t("Preencha uma chave abaixo"), "", function () {
        saveSettings({
          debridEnabled: s.debridEnabled === false
        });
        render();
      }, toggle(anyKey && s.debridEnabled !== false)));
      var cur = PROVIDERS.find(function (p) {
        return p.id === s.debridProvider;
      }) || PROVIDERS[0];
      body.appendChild(row(t("Serviço preferido"), t("Usado quando há mais de uma chave"), cur.name, function () {
        return menu(t("Serviço preferido"), PROVIDERS.map(function (p) {
          return {
            label: p.name,
            value: p.id,
            checked: p.id === cur.id
          };
        }), {
          onPick: function onPick(v) {
            saveSettings({
              debridProvider: v
            });
            render();
          }
        });
      }));
      body.appendChild(h("div.set-section", {
        text: t("Entrar com QR (sem chave)")
      }));
      PROVIDERS.filter(function (p) {
        return canSignIn(p.id);
      }).forEach(function (p) {
        return body.appendChild(row(t("Entrar no {name}", {
          name: p.name
        }), t("Aponte o celular para o QR e entre na sua conta"), (s[p.key] || "").trim() ? t("Conectado") : "", function () {
          return openDeviceLink(signInFlow(p.id), function () {
            return render();
          });
        }));
      });
      body.appendChild(h("div.set-section", {
        text: t("Ou cole a chave")
      }));
      PROVIDERS.forEach(function (p) {
        body.appendChild(keyInput(p.name, t("Sua chave de API em {site}", {
          site: p.site
        }), p.key, "API key"));
        if (!canSignIn(p.id)) body.appendChild(phoneKeyRow(p.key, p.name));
        if ((s[p.key] || "").trim()) body.appendChild(row(t("Testar {name}", {
          name: p.name
        }), "", "", function () {
          toast(t("Testando..."));
          testKey(p.id, s[p.key].trim()).then(function (who) {
            return toast(t("{name} OK: {user}", {
              name: p.name,
              user: who
            }), 5e3);
          }).catch(function (e) {
            return toast(t("{name} recusou a chave: {msg}", {
              name: p.name,
              msg: e.message
            }), 6e3);
          });
        }));
      });
    }
    function renderHomePage(s) {
      pageHeader(t("Tela inicial"));
      var LAYOUTS = [{
        id: "collections",
        label: "Coleções (Kaptain)"
      }, {
        id: "both",
        label: "Coleções e addons"
      }, {
        id: "addons",
        label: "Só os catálogos dos addons"
      }];
      var lay = LAYOUTS.find(function (x) {
        return x.id === (s.homeLayout || "collections");
      }) || LAYOUTS[0];
      body.appendChild(row(t("Conteúdo da tela inicial"), t("Coleções prontas (filmes, séries, atores, estúdios...) ou os catálogos dos seus addons"), t(lay.label), function () {
        return menu(t("Conteúdo da tela inicial"), LAYOUTS.map(function (x) {
          return {
            label: t(x.label),
            value: x.id,
            checked: x.id === lay.id
          };
        }), {
          onPick: function onPick(v) {
            saveSettings({
              homeLayout: v
            });
            dropTab("home");
            render();
          }
        });
      }));
      var cur = CW_SORTS.find(function (x) {
        return x.id === s.cwSort;
      }) || CW_SORTS[0];
      body.appendChild(row(t("Ordem do Continuar assistindo"), "", t(cur.label), function () {
        return menu(t("Ordem do Continuar assistindo"), CW_SORTS.map(function (x) {
          return {
            label: t(x.label),
            value: x.id,
            checked: x.id === cur.id
          };
        }), {
          onPick: function onPick(v) {
            saveSettings({
              cwSort: v
            });
            dropTab("home");
            render();
          }
        });
      }));
      body.appendChild(h("div.set-section", {
        text: t("Listas do MDBList")
      }));
      if (!hasKey()) {
        body.appendChild(h("div.hint", {
          style: {
            padding: "0 4px 10px"
          },
          text: t("Coloque sua chave MDBList em Ajustes → Metadados extras para usar listas.")
        }));
      } else {
        var saveRows = function saveRows(list2) {
          setRows(list2);
          dropTab("home");
          render();
        };
        body.appendChild(row(t("Minhas listas"), t("Escolha quais das suas listas aparecem na tela inicial"), "", function () {
          toast(t("Carregando..."));
          myLists().then(function (lists) {
            var chosen = rows();
            menu(t("Minhas listas"), lists.map(function (l) {
              return {
                label: l.name,
                sub: t("{n} títulos", {
                  n: l.items
                }),
                value: l,
                checked: chosen.some(function (c) {
                  return c.id === l.id;
                })
              };
            }), {
              empty: t("Você ainda não tem listas no MDBList."),
              onPick: function onPick(l) {
                var cur2 = rows();
                var on = cur2.some(function (c) {
                  return c.id === l.id;
                });
                saveRows(on ? cur2.filter(function (c) {
                  return c.id !== l.id;
                }) : cur2.concat([{
                  id: l.id,
                  name: l.name
                }]));
              }
            });
          }).catch(function (e) {
            return toast(t("Erro: {msg}", {
              msg: e.message
            }), 5e3);
          });
        }));
        body.appendChild(row(t("Adicionar lista pública"), t("Ex.: usuario/nome-da-lista ou o link do mdblist.com"), "", function () {
          return promptText(t("Adicionar lista pública"), "", "user/list", function (text) {
            return findList(text).then(function (l) {
              var cur2 = rows();
              if (!cur2.some(function (c) {
                return c.id === l.id;
              })) saveRows(cur2.concat([l]));
              toast(t('Lista "{name}" adicionada', {
                name: l.name
              }));
            }).catch(function () {
              return toast(t("Lista não encontrada"), 5e3);
            });
          });
        }));
      }
      body.appendChild(h("div.set-section", {
        text: t("Fileiras")
      }));
      body.appendChild(h("div.hint", {
        style: {
          padding: "0 4px 10px"
        },
        text: t("OK numa fileira: subir, descer ou esconder.")
      }));
      var wl = watchlistEntry();
      var all2 = (wl ? [wl] : []).concat(boardCatalogs(), boardEntries());
      sort(all2).forEach(function (e) {
        var hidden = isHidden(e);
        var name = e.catalog.name || e.catalog.id;
        var kind = e.fetch ? "" : ({
          movie: t("Filmes"),
          series: t("Séries"),
          anime: t("Animes")
        }[e.catalog.type] || e.catalog.type) + " · ";
        body.appendChild(row((hidden ? "⊘ " : "") + name, kind + (e.addon.manifest.name || ""), hidden ? t("Escondida") : t("Visível"), function () {
          return menu(name, [{
            label: "▲ " + t("Subir"),
            value: -1
          }, {
            label: "▼ " + t("Descer"),
            value: 1
          }, {
            label: hidden ? t("Mostrar") : t("Esconder"),
            value: 0
          }], {
            onPick: function onPick(v) {
              if (v === 0) toggleHidden(e);else move2(all2, e, v);
              dropTab("home");
              render();
            }
          });
        }));
      });
      body.appendChild(row(t("Restaurar ordem padrão"), "", "", function () {
        reset();
        dropTab("home");
        toast(t("Ordem padrão restaurada"));
        render();
      }));
    }
    function renderBadges(s) {
      pageHeader(t("Selos das fontes"));
      var cur = streamBadgeSettings();
      KINDS2.forEach(function (k) {
        return body.appendChild(row(t(k.label), "", "", function () {
          setBadge(k.id, !cur[k.id]);
          render();
        }, toggle(cur[k.id])));
      });
    }
    var msDraft = {
      providerId: "jellyfin",
      address: "",
      user: "",
      pass: ""
    };
    function draftInput(title, sub, field, placeholder, type) {
      var input = h("input.input", {
        type: type || "text",
        value: msDraft[field],
        placeholder: placeholder
      });
      input.__submit = function (v) {
        msDraft[field] = v.trim();
        render();
      };
      return h("div.set-row", {
        focusable: true,
        onSelect: function onSelect() {
          return select(input);
        }
      }, [h("div.label", null, [title, sub ? h("small", {
        text: sub
      }) : null]), input]);
    }
    function renderServers(s) {
      pageHeader(t("Servidores de mídia (Jellyfin e Emby)"));
      body.appendChild(h("div.hint", {
        style: {
          padding: "0 4px 14px"
        },
        text: t("Os filmes e séries do seu servidor aparecem como fonte, junto com os addons.")
      }));
      var c = connection();
      if (c) {
        var kindName = (KINDS.find(function (k) {
          return k.id === c.providerId;
        }) || {}).name || "";
        var card2 = row(c.name, kindName + " · " + c.address, t("Conectado: {user}", {
          user: c.user
        }), function () {
          return menu(c.name, [{
            label: t("Desconectar"),
            value: "off"
          }], {
            onPick: function onPick() {
              disconnect();
              dropTab("home");
              toast(t("{name} desconectado", {
                name: c.name
              }));
              render();
            }
          });
        });
        card2.classList.add("acct-card");
        if (s.mediaServerEnabled !== false) card2.classList.add("acct-on");
        body.appendChild(card2);
        body.appendChild(row(t("Mostrar como fonte"), t("Lista os arquivos do servidor nas fontes"), "", function () {
          saveSettings({
            mediaServerEnabled: s.mediaServerEnabled === false
          });
          render();
        }, toggle(s.mediaServerEnabled !== false)));
        return;
      }
      var kind = KINDS.find(function (k) {
        return k.id === msDraft.providerId;
      }) || KINDS[0];
      body.appendChild(row(t("Tipo de servidor"), "", kind.name, function () {
        return menu(t("Tipo de servidor"), KINDS.map(function (k) {
          return {
            label: k.name,
            value: k.id,
            checked: k.id === kind.id
          };
        }), {
          onPick: function onPick(v) {
            msDraft.providerId = v;
            render();
          }
        });
      }));
      body.appendChild(draftInput(t("Endereço do servidor"), t("Ex.: 192.168.0.20:8096"), "address", "http://IP:8096"));
      if (kind.id === "jellyfin") body.appendChild(row("⚡ " + t("Entrar com Quick Connect"), t("Sem senha: aprove um código no Jellyfin do celular"), "", function () {
        if (!msDraft.address) return toast(t("Preencha o endereço do servidor primeiro"));
        openDeviceLink(quickConnectFlow(msDraft.address), function () {
          dropTab("home");
          render();
        });
      }));
      body.appendChild(draftInput(t("Usuário"), "", "user", t("Usuário")));
      body.appendChild(draftInput(t("Senha"), t("Usada só para entrar; não fica salva"), "pass", "••••", "password"));
      body.appendChild(row(t("Conectar"), "", "", function () {
        if (!msDraft.address || !msDraft.user) return toast(t("Preencha o endereço e o usuário"));
        toast(t("Conectando..."));
        connect(msDraft.providerId, msDraft.address, msDraft.user, msDraft.pass).then(function (conn) {
          msDraft.pass = "";
          dropTab("home");
          toast(t("Conectado a {name}", {
            name: conn.name
          }));
          render();
        }).catch(function (e) {
          return toast(t("Não foi possível conectar: {msg}", {
            msg: e.message
          }), 6e3);
        });
      }));
    }
    var GROUPS = [{
      id: "c-account",
      icon: "👤",
      label: "Conta e perfis",
      sub: "Idioma, perfis, conta Stremio, controle pelo celular"
    }, {
      id: "c-playback",
      icon: "▶",
      label: "Reprodução",
      sub: "Servidor do PC, player, próximo episódio, selos das fontes"
    }, {
      id: "c-subs",
      icon: "💬",
      label: "Legendas e áudio",
      sub: "Idiomas, SubDL, aparência da legenda"
    }, {
      id: "c-appearance",
      icon: "🎨",
      label: "Aparência",
      sub: "Tema, tela inicial, modo ambiente, proteção de tela"
    }, {
      id: "c-integrations",
      icon: "🔗",
      label: "Integrações",
      sub: "Trakt, Simkl, pular trechos, debrid, Jellyfin, chaves, addons"
    }, {
      id: "c-about",
      icon: "ⓘ",
      label: "Sobre",
      sub: "Atualizações, teste de internet, log"
    }];
    var railTimer = null;
    var railItems = GROUPS.map(function (g) {
      var el2 = h("div.rail-item", {
        focusable: true,
        onSelect: function onSelect() {
          clearTimeout(railTimer);
          openPage(g.id, true);
        },
        // Resting on a category shows it; passing over quickly does nothing (keeps the TV fast).
        onFocus: function onFocus() {
          clearTimeout(railTimer);
          railTimer = setTimeout(function () {
            if (current2() === el2 && g.id !== (PARENT[page2] || page2)) openPage(g.id, false);
          }, 350);
        }
      }, [h("span.rail-ico", {
        text: g.icon
      }), h("span.rail-text", null, [t(g.label), h("small", {
        text: t(g.sub)
      })])]);
      el2.__group = g.id;
      rail.appendChild(el2);
      return el2;
    });
    function renderRail() {
      var current3 = PARENT[page2] || page2;
      railItems.forEach(function (el2) {
        var on = el2.__group === current3;
        el2.classList.toggle("active", on);
        if (on) rail.__last = el2;
      });
    }
    function render() {
      var s = settings();
      var keep = current2();
      var keepIndex = keep && body.contains(keep) ? Array.prototype.indexOf.call(body.querySelectorAll(".set-row"), keep) : -1;
      var wantFocus = focusContent;
      focusContent = false;
      applyLook(s);
      clear(body);
      renderRail();
      var placeFocus = function placeFocus() {
        var rows2 = body.querySelectorAll(".set-row");
        if (keepIndex >= 0 && rows2[keepIndex]) focus(rows2[keepIndex]);else if (wantFocus && rows2[0]) focus(rows2[PARENT[page2] ? 1 : 0] || rows2[0]);
      };
      if (page2.indexOf("c-") !== 0) {
        if (page2 === "tracking") renderTracking(s);else if (page2 === "debrid") renderDebrid(s);else if (page2 === "servers") renderServers(s);else if (page2 === "home") renderHomePage(s);else if (page2 === "badges") renderBadges(s);else renderSkip(s);
        placeFocus();
        return;
      }
      var GROUP = GROUPS.find(function (g) {
        return g.id === page2;
      });
      pageHeader(t(GROUP.label));
      var choose = function choose(title, sub, list2, key3, value, label) {
        return body.appendChild(row(title, sub, t(String(label)), function () {
          return menu(title, list2.map(function (x) {
            return {
              label: t(String(x.label)),
              value: x.id,
              checked: x.id === value
            };
          }), {
            onPick: function onPick(v) {
              var patch = {};
              patch[key3] = v;
              saveSettings(patch);
              render();
            }
          });
        }));
      };
      if (page2 === "c-account") {
        var LANGS3 = [{
          id: "auto",
          label: t("Automático (idioma da TV)")
        }, {
          id: "en",
          label: "English"
        }, {
          id: "ar",
          label: "العربية"
        }];
        body.appendChild(h("div.set-section", {
          text: "Language / اللغة"
        }));
        body.appendChild(row("Language / اللغة", "", (LANGS3.find(function (l) {
          return l.id === s.language;
        }) || LANGS3[0]).label, function () {
          return menu("Language / اللغة", LANGS3.map(function (l) {
            return {
              label: l.label,
              value: l.id,
              checked: l.id === s.language
            };
          }), {
            onPick: function onPick(v) {
              if (v === s.language) return;
              saveSettings({
                language: v
              });
              window.location.reload();
            }
          });
        }));
        var prof = activeProfile();
        var allProfiles = profiles();
        body.appendChild(h("div.set-section", {
          text: t("Perfil")
        }));
        var nameInput = h("input.input", {
          type: "text",
          value: prof.name
        });
        nameInput.__submit = function (v) {
          var name = v.trim();
          if (!name) return;
          updateProfile(prof.id, {
            name: name
          });
          refreshProfileChips();
          toast(t("Nome do perfil salvo"));
          render();
        };
        body.appendChild(h("div.set-row", {
          focusable: true,
          onSelect: function onSelect() {
            return select(nameInput);
          }
        }, [h("div.label", null, [avatar(prof, "small"), " " + t("Nome do perfil"), h("small", {
          text: t("Este perfil usa a conta Stremio abaixo")
        })]), nameInput]));
        body.appendChild(row(t("Cor do perfil"), "", "", function () {
          return menu(t("Cor do perfil"), COLORS.map(function (c, i) {
            return {
              label: [t("Roxo"), t("Rosa"), t("Verde-água"), t("Laranja"), t("Azul"), t("Vermelho"), t("Verde"), t("Cinza")][i],
              value: c,
              checked: c === prof.color
            };
          }), {
            onPick: function onPick(c) {
              updateProfile(prof.id, {
                color: c
              });
              refreshProfileChips();
              render();
            }
          });
        }, h("div.avatar.small", {
          style: {
            backgroundColor: prof.color
          },
          text: " "
        })));
        if (allProfiles.length > 1) {
          body.appendChild(row(t("Trocar de perfil"), t("{n} perfis nesta TV", {
            n: allProfiles.length
          }), "", function () {
            return menu(t("Trocar de perfil"), allProfiles.map(function (p) {
              return {
                label: p.name,
                value: p.id,
                checked: p.id === prof.id
              };
            }), {
              onPick: function onPick(id) {
                return id !== prof.id && switchProfile(id);
              }
            });
          }));
        }
        body.appendChild(row(t("Trancar com PIN"), prof.pin ? t("Pede o PIN para abrir este perfil") : t("Ex.: só os pais abrem este perfil"), prof.pin ? "🔒 " + t("Ligado") : t("Desligado"), function () {
          var setNew = function setNew() {
            return pinDialog(t("Novo PIN (4 a 8 números)"), function (pin) {
              if (!/^\d{4,8}$/.test(pin)) return false;
              updateProfile(prof.id, {
                pin: pin
              });
              toast(t("PIN salvo"));
              render();
              return true;
            }, t("Use de 4 a 8 números."));
          };
          if (!prof.pin) return setNew();
          menu(t("Trancar com PIN"), [{
            label: t("Trocar o PIN"),
            value: "change"
          }, {
            label: t("Tirar o PIN"),
            value: "off"
          }], {
            onPick: function onPick(v) {
              return checkPin(prof, function () {
                if (v === "change") return setNew();
                updateProfile(prof.id, {
                  pin: ""
                });
                toast(t("PIN removido"));
                render();
              });
            }
          });
        }));
        body.appendChild(row(t("Adicionar perfil"), t("Para outra pessoa, com outra conta Stremio"), "", function () {
          return createProfile();
        }));
        if (allProfiles.length > 1) {
          body.appendChild(row(t("Copiar ajustes de outro perfil"), t("Legendas, aparência, tela inicial e coleções (a conta não é copiada)"), "", function () {
            return menu(t("Copiar ajustes de"), allProfiles.filter(function (p) {
              return p.id !== prof.id;
            }).map(function (p) {
              return {
                label: p.name,
                value: p.id
              };
            }), {
              onPick: function onPick(id) {
                var from = allProfiles.find(function (p) {
                  return p.id === id;
                });
                confirmDialog(t('Trocar os ajustes de "{to}" pelos de "{from}"?', {
                  to: prof.name,
                  from: from.name
                }), t("Copiar"), function () {
                  copySettingsFrom(id);
                  apply3(settings().theme);
                  document.body.classList.toggle("oled", !!settings().oled);
                  dropTab("home");
                  toast(t("Ajustes copiados de {name}", {
                    name: from.name
                  }));
                  render();
                });
              }
            });
          }));
        }
        if (allProfiles.length > 1) {
          body.appendChild(row(t('Perguntar "Quem está assistindo?" ao abrir'), "", "", function () {
            saveSettings({
              askProfile: !settings().askProfile
            });
            render();
          }, toggle(s.askProfile)));
          body.appendChild(row(t("Apagar este perfil"), t("Remove deste aparelho a conta e as preferências do perfil (a conta Stremio continua existindo)"), "", function () {
            return confirmDialog(t('Apagar o perfil "{name}" desta TV?', {
              name: prof.name
            }), t("Apagar"), function () {
              removeProfile(prof.id);
              switchProfile(activeProfile().id);
            });
          }));
        }
        body.appendChild(h("div.set-section", {
          text: t("Conta Stremio")
        }));
        if (isLoggedIn()) {
          var u = user();
          body.appendChild(row(t("Conectado"), t("Addons e biblioteca sincronizados com a conta"), u && u.email || t("conta Stremio"), null));
          body.appendChild(row(t("Atualizar addons e biblioteca"), t("Busca de novo a lista de addons instalados"), "", function () {
            Promise.all([load(true), getLibrary()]).then(function () {
              toast(t("Atualizado"));
              dropTab("home");
            }).catch(function (e) {
              return toast(t("Erro: {msg}", {
                msg: e.message
              }));
            });
          }));
          body.appendChild(row(t("Sair da conta"), "", "", function () {
            return confirmDialog(t("Sair da conta Stremio?"), t("Sair"), function () {
              logout();
              load(true).then(function () {
                dropTab("home");
                render();
              });
            });
          }));
        } else {
          body.appendChild(row(t("Entrar na conta"), t("Traz seus addons (Torrentio, debrid...) e a biblioteca"), "", function () {
            return openLogin(function () {
              Promise.all([refreshUser().catch(function () {}), load(true), getLibrary()]).then(function () {
                dropTab("home");
                render();
              });
            });
          }));
        }
        body.appendChild(h("div.set-section", {
          text: t("Controle pelo celular")
        }));
        var phoneBox = h("div.set-row.phone-remote", {
          focusable: true
        }, h("div.phone-sub", {
          text: t("Carregando...")
        }));
        body.appendChild(phoneBox);
        info().then(function (i) {
          clear(phoneBox);
          if (!i) {
            phoneBox.appendChild(h("div.phone-sub", {
              text: t("O controle pelo celular não está rodando. Feche o app e abra de novo pelo TizenBrew.")
            }));
            return;
          }
          phoneBox.appendChild(h("img.phone-qr", {
            src: qrImage(i.url, 300),
            alt: ""
          }));
          phoneBox.appendChild(h("div.phone-text", null, [h("div.phone-title", {
            text: t("Aponte a câmera do celular para o código")
          }), h("div.phone-sub", {
            text: t("Ou abra no navegador do celular (mesmo Wi-Fi):")
          }), h("div.phone-url", {
            text: "http://" + i.ip + ":" + i.port
          }), h("div.phone-sub", {
            text: t("PIN: {pin}", {
              pin: i.pin
            })
          })]));
        });
      }
      if (page2 === "c-appearance") {
        body.appendChild(h("div.set-section", {
          text: t("Cores e formas")
        }));
        var curTheme = THEMES2.find(function (x) {
          return x.id === s.theme;
        }) || THEMES2[0];
        body.appendChild(row(t("Cor do app"), t("Cor de destaque de botões, foco e barras"), t(curTheme.label), function () {
          return menu(t("Cor do app"), THEMES2.map(function (x) {
            return {
              label: "● " + t(x.label),
              value: x.id,
              checked: x.id === curTheme.id
            };
          }), {
            onPick: function onPick(v) {
              saveSettings({
                theme: v
              });
              apply3(v);
              render();
            }
          });
        }, h("div.swatch", {
          style: {
            backgroundColor: curTheme.main
          }
        })));
        var lookChoose = function lookChoose(title, sub, list2, key3, dflt) {
          var cur = list2.find(function (x) {
            return x.id === s[key3];
          }) || list2.find(function (x) {
            return x.id === dflt;
          });
          choose(title, sub, list2, key3, cur.id, cur.label);
        };
        var bg = s.bgStyle || (s.oled ? "oled" : "default");
        body.appendChild(row(t("Fundo"), t("Escuro, preto puro ou com brilho da cor"), t((BACKGROUNDS.find(function (x) {
          return x.id === bg;
        }) || BACKGROUNDS[0]).label), function () {
          return menu(t("Fundo"), BACKGROUNDS.map(function (x) {
            return {
              label: t(x.label),
              value: x.id,
              checked: x.id === bg
            };
          }), {
            onPick: function onPick(v) {
              saveSettings({
                bgStyle: v,
                oled: v === "oled"
              });
              render();
            }
          });
        }));
        lookChoose(t("Formato dos cartões"), t("Cantos dos pôsteres e botões"), SHAPES, "cardShape", "rounded");
        lookChoose(t("Tamanho dos pôsteres"), t("Mais pôsteres por linha ou pôsteres maiores"), SIZES2, "cardSize", "medium");
        lookChoose(t("Estilo do foco"), t("Como o item selecionado aparece"), FOCUS, "focusStyle", "glow");
        lookChoose(t("Fonte do app"), t("Letra dos menus e textos"), FONTS2, "appFont", "samsung");
        body.appendChild(h("div.set-section", {
          text: t("Tela inicial")
        }));
        var heroName = t((SOURCES.find(function (x) {
          return x.id === s.heroSource;
        }) || SOURCES[0]).name);
        body.appendChild(row(t("Hero Banner"), t("Destaques no topo da tela inicial"), heroName, function () {
          return menu(t("Fonte do Hero Banner"), SOURCES.map(function (x) {
            return {
              label: t(x.name),
              value: x.id,
              checked: x.id === s.heroSource
            };
          }), {
            onPick: function onPick(v) {
              saveSettings({
                heroSource: v
              });
              dropTab("home");
              render();
            }
          });
        }));
        body.appendChild(row(t("Modo ambiente"), t("O trailer toca sem som atrás do Hero Banner (mais pesado na TV)"), "", function () {
          saveSettings({
            ambientMode: !settings().ambientMode
          });
          dropTab("home");
          render();
        }, toggle(!!s.ambientMode)));
        body.appendChild(row(t("Aba Animes"), t("Temporada, estúdios e gêneros de anime (AniList)"), "", function () {
          saveSettings({
            animeTab: settings().animeTab === false
          });
          window.location.reload();
        }, toggle(s.animeTab !== false)));
        body.appendChild(row(t("Fileiras e Continuar assistindo"), t("Ordem das fileiras, listas do MDBList e Continuar assistindo"), "›", function () {
          return openPage("home");
        }));
        body.appendChild(row(t("Buscas recentes"), t("Mostra as últimas buscas na tela de busca"), "", function () {
          saveSettings({
            searchHistory: settings().searchHistory === false
          });
          render();
        }, toggle(s.searchHistory !== false)));
        var SS = [0, 5, 10, 15, 30].map(function (m) {
          return {
            id: m,
            label: m ? t("Depois de {n} min", {
              n: m
            }) : t("Desligada")
          };
        });
        var ssCur = SS.find(function (x) {
          return x.id === (+s.screensaver || 0);
        }) || SS[0];
        body.appendChild(row(t("Proteção de tela"), t("Fundos de filmes e o relógio quando a TV fica parada"), ssCur.label, function () {
          return menu(t("Proteção de tela"), SS.map(function (x) {
            return {
              label: x.label,
              value: x.id,
              checked: x.id === ssCur.id
            };
          }), {
            onPick: function onPick(v) {
              saveSettings({
                screensaver: v
              });
              render();
            }
          });
        }));
        body.appendChild(h("div.set-section", {
          text: t("Desempenho")
        }));
        body.appendChild(row(t("Modo desempenho"), t("Mais rápido na TV: sem animações, sem Novos episódios e sem sincronizar em segundo plano"), "", function () {
          var on = settings().perfMode === false;
          saveSettings({
            perfMode: on
          });
          document.body.classList.toggle("perf", on);
          dropTab("home");
          render();
        }, toggle(settings().perfMode !== false)));
        body.appendChild(row(t("Rolagem animada"), t("Mais bonita, porém mais pesada na TV"), "", function () {
          var on = !settings().smoothScroll;
          saveSettings({
            smoothScroll: on
          });
          setSmooth(on);
          render();
        }, toggle(s.smoothScroll)));
      }
      if (page2 === "c-subs") {
        body.appendChild(h("div.set-section", {
          text: t("Legendas e áudio")
        }));
        body.appendChild(row(t("Lembrar por série"), t("A legenda e o áudio que você escolher valem para os outros episódios"), "", function () {
          saveSettings({
            rememberTracks: settings().rememberTracks === false
          });
          render();
        }, toggle(s.rememberTracks !== false)));
        body.appendChild(keyInput(t("Chave SubDL"), t("Legendas em árabe do subdl.com (crie a chave grátis em subdl.com/panel/api)"), "subdlKey", "API key"));
        body.appendChild(phoneKeyRow("subdlKey", "SubDL"));
        var subName = (SUB_LANGS.find(function (x) {
          return JSON.stringify(x.value) === JSON.stringify(s.subtitleLangs);
        }) || {
          label: (s.subtitleLangs || []).join(", ")
        }).label;
        body.appendChild(row(t("Idioma da legenda"), t("Escolhida sozinha ao abrir o vídeo"), t(subName), function () {
          return menu(t("Idioma da legenda"), SUB_LANGS.map(function (x) {
            return {
              label: t(x.label),
              value: x.value,
              checked: x.label === subName
            };
          }), {
            onPick: function onPick(v) {
              saveSettings({
                subtitleLangs: v
              });
              render();
            }
          });
        }));
        body.appendChild(row(t("Ligar legenda automaticamente"), t("Se o áudio não estiver no seu idioma"), "", function () {
          saveSettings({
            subtitlesAuto: !settings().subtitlesAuto
          });
          render();
        }, toggle(s.subtitlesAuto)));
        var audName = (AUDIO_LANGS.find(function (x) {
          return JSON.stringify(x.value) === JSON.stringify(s.audioLangs);
        }) || AUDIO_LANGS[0]).label;
        body.appendChild(row(t("Áudio preferido"), available() && s.playerEngine !== "html5" ? t("Escolhido sozinho ao abrir o vídeo") : t("Precisa do servidor do PC para ler as faixas"), t(audName), function () {
          return menu(t("Áudio preferido"), AUDIO_LANGS.map(function (x) {
            return {
              label: t(x.label),
              value: x.value,
              checked: x.label === audName
            };
          }), {
            onPick: function onPick(v) {
              saveSettings({
                audioLangs: v
              });
              render();
            }
          });
        }));
        body.appendChild(h("div.set-section", {
          text: t("Aparência da legenda")
        }));
        var preview = h("div.subs", null, h("span", {
          html: t("Oi. Meu nome é Peter Parker.") + "\n<i>" + t("Você não lembra de mim...") + "</i>"
        }));
        apply(preview, s);
        body.appendChild(h("div.sub-preview", null, preview));
        var lb = labels(s);
        choose(t("Fonte"), t("Vale para legendas de addons (OpenSubtitles etc.)"), FONTS, "subtitleFont", s.subtitleFont, lb.font);
        choose(t("Estilo"), t("Contorno, sombra ou caixa de fundo"), STYLES, "subtitleStyle", s.subtitleStyle, lb.style);
        choose(t("Cor do texto"), "", COLORS2, "subtitleColor", s.subtitleColor, lb.color);
        choose(t("Tamanho"), "", SIZES.map(function (v) {
          return {
            id: v,
            label: v + "%"
          };
        }), "subtitleSize", s.subtitleSize || 100, (s.subtitleSize || 100) + "%");
        choose(t("Posição"), t("Distância da borda de baixo"), POSITIONS, "subtitlePosition", s.subtitlePosition, lb.position);
        body.appendChild(row(t("Negrito"), t("O Kai usa negrito"), "", function () {
          saveSettings({
            subtitleBold: settings().subtitleBold === false
          });
          render();
        }, toggle(s.subtitleBold !== false)));
        body.appendChild(h("div.hint", {
          style: {
            padding: "6px 4px 0"
          },
          text: t("Legendas embutidas no arquivo são desenhadas pela própria TV: só cor, tamanho, posição e caixa se aplicam a elas.")
        }));
      }
      if (page2 === "c-playback") {
        body.appendChild(h("div.set-section", {
          text: t("Player")
        }));
        body.appendChild(row(t("Escolha inteligente"), t("Assistir já toca a melhor fonte; o botão Fontes mostra a lista"), "", function () {
          saveSettings({
            smartChoice: settings().smartChoice === false
          });
          render();
        }, toggle(s.smartChoice !== false)));
        body.appendChild(row(t("Próximo episódio automático"), t("Contagem regressiva nos créditos e toca o próximo"), "", function () {
          saveSettings({
            autoNext: settings().autoNext === false
          });
          render();
        }, toggle(s.autoNext !== false)));
        if (s.autoNext !== false) {
          var UN = [5, 10, 15, 20].map(function (n) {
            return {
              id: n,
              label: t("{n} segundos", {
                n: n
              })
            };
          });
          var unCur = UN.find(function (x) {
            return x.id === (+s.upNextSeconds || 10);
          }) || UN[1];
          choose(t("Contagem regressiva"), t("Quanto tempo o aviso do próximo episódio espera"), UN, "upNextSeconds", unCur.id, unCur.label);
        }
        choose(t("Player de vídeo"), t("O player da Samsung troca a faixa de áudio; o do navegador é o antigo"), [{
          id: "auto",
          label: available() ? t("Samsung (AVPlay)") : t("Samsung (AVPlay) · indisponível nesta TV")
        }, {
          id: "html5",
          label: t("Navegador (HTML5)")
        }], "playerEngine", s.playerEngine === "html5" ? "html5" : "auto", s.playerEngine === "html5" ? t("Navegador (HTML5)") : available() ? t("Samsung (AVPlay)") : t("Samsung (AVPlay) · indisponível nesta TV"));
        if (s.playerEngine !== "html5" && !available()) body.appendChild(h("div.hint.warn-hint", {
          text: t("O player da Samsung (AVPlay) não carregou nesta TV, então o app usa o do navegador e não consegue trocar o áudio. Feche o app e abra de novo pelo TizenBrew; se continuar, avise.")
        }));
        body.appendChild(row(t("Sugestões no fim"), t('Ao terminar um filme, mostra "Mais como este"'), "", function () {
          saveSettings({
            postPlay: settings().postPlay === false
          });
          render();
        }, toggle(s.postPlay !== false)));
        body.appendChild(row(t("Selos das fontes"), t("Qualidade, HDR, áudio, idioma, tamanho..."), "", function () {
          return openPage("badges");
        }));
      }
      if (page2 === "c-playback") {
        body.appendChild(h("div.set-section", {
          text: t("Servidor de streaming (PC)")
        }));
        var st = lastStatus();
        var stText = !s.serverUrl ? t("não configurado") : st.ok && st.url === baseUrl() ? t("conectado ✓") : t("sem resposta");
        var urlInput = h("input.input", {
          type: "text",
          value: s.serverUrl || "",
          placeholder: "ex.: 192.168.0.10"
        });
        urlInput.__submit = function (v) {
          saveSettings({
            serverUrl: v.trim()
          });
          check().then(function (r) {
            toast(r.ok ? t("Servidor conectado") : t("Servidor não respondeu em {url}", {
              url: baseUrl()
            }));
            render();
          });
        };
        body.appendChild(h("div.set-row", {
          focusable: true,
          onSelect: function onSelect() {
            return select(urlInput);
          }
        }, [h("div.label", null, [t("Endereço do PC"), h("small", {
          text: t("Rode o stremio-service no PC (porta 11470). Status: {s}", {
            s: stText
          })
        })]), urlInput]));
        body.appendChild(row(t("Procurar na rede"), t("Varre a rede local atrás do servidor"), "", function () {
          toast(t("Procurando servidor na rede..."), 2e4);
          scan().then(function (ip) {
            if (!ip) return toast(t("Nenhum servidor encontrado. Ele está aberto no PC?"));
            saveSettings({
              serverUrl: ip
            });
            return check().then(function () {
              toast(t("Servidor encontrado em {ip}", {
                ip: ip
              }));
              render();
            });
          }).catch(function (e) {
            return toast(t("Falha na busca: {msg}", {
              msg: e.message
            }));
          });
        }));
        body.appendChild(row(t("Testar conexão"), "", "", function () {
          return check().then(function (r) {
            toast(r.ok ? t("Servidor OK") + (r.version ? " (v" + r.version + ")" : "") : t("Sem resposta de {url}", {
              url: baseUrl() || "-"
            }));
            render();
          });
        }));
      }
      if (page2 === "c-integrations") {
        body.appendChild(h("div.set-section", {
          text: t("Chaves pelo celular")
        }));
        body.appendChild(phoneSetupBox());
        body.appendChild(h("div.set-section", {
          text: t("Integrações")
        }));
        body.appendChild(row(t("Rastreamento (Trakt e Simkl)"), t("Contas, fontes e recursos do Trakt"), connected().length ? t("Conectado") : t("Desconectado"), function () {
          return openPage("tracking");
        }));
        body.appendChild(row(t("Pular trechos"), t("Abertura, recapitulação e encerramento"), s.skipMode === "off" ? t("Desligado") : t("Ligado"), function () {
          return openPage("skip");
        }));
        body.appendChild(row(t("Debrid"), "Real-Debrid · TorBox · Premiumize", active() ? active().name : t("Desligado"), function () {
          return openPage("debrid");
        }));
        body.appendChild(row(t("Servidores de mídia (Jellyfin e Emby)"), t("Seu próprio servidor como fonte"), enabled() ? connection().name : t("Desconectado"), function () {
          return openPage("servers");
        }));
        body.appendChild(h("div.set-section", {
          text: t("Metadados extras (opcional)")
        }));
        var keyRow = function keyRow(title, sub, key3, placeholder) {
          var input = h("input.input", {
            type: "text",
            value: s[key3] || "",
            placeholder: placeholder
          });
          input.__submit = function (v) {
            var patch = {};
            patch[key3] = v.trim();
            saveSettings(patch);
            toast(v.trim() ? t("Chave salva") : t("Chave removida"));
            render();
          };
          body.appendChild(h("div.set-row", {
            focusable: true,
            onSelect: function onSelect() {
              return select(input);
            }
          }, [h("div.label", null, [title, h("small", {
            text: sub
          })]), input]));
        };
        keyRow(t("Chave TMDB"), t("Descrições em árabe, perfis de atores, calendário de filmes, logos e elenco com fotos (grátis em themoviedb.org)"), "tmdbKey", "API key (v3)");
        body.appendChild(phoneKeyRow("tmdbKey", "TMDB"));
        keyRow(t("Chave MDBList"), t("Notas do Rotten Tomatoes, Metacritic, Trakt e Letterboxd (grátis em mdblist.com)"), "mdblistKey", "API key");
        body.appendChild(phoneKeyRow("mdblistKey", "MDBList"));
        keyRow(t("Chave RPDB"), t("Pôsteres com as notas desenhadas (ratingposterdb.com)"), "rpdbKey", "API key");
        body.appendChild(phoneKeyRow("rpdbKey", "RPDB"));
        body.appendChild(row(t("Guia para os pais"), t("Violência, palavrões e cenas fortes na página do título (IMDb via tiffara.com)"), "", function () {
          saveSettings({
            parentalGuide: !settings().parentalGuide
          });
          render();
        }, toggle(!!s.parentalGuide)));
        body.appendChild(h("div.set-section", {
          text: t("Addons")
        }));
        var list2 = list();
        body.appendChild(row(t("Addons ativos"), isLoggedIn() ? t("Gerencie pela sua conta em web.stremio.com") : t("Sem conta: Cinemeta, OpenSubtitles e os adicionados aqui"), t("{n} addon(s)", {
          n: list2.length
        }), function () {
          return menu(t("Addons ativos"), list2.map(function (a) {
            return {
              label: a.manifest.name || a.manifest.id,
              sub: a.transportUrl
            };
          }), {});
        }));
        RECOMMENDED.filter(function (r) {
          return !list2.some(function (a) {
            return a.transportUrl === r.url || a.manifest && a.manifest.id === r.id;
          });
        }).forEach(function (r) {
          return body.appendChild(row(t("Instalar {name}", {
            name: r.name
          }), t(r.desc), "", function () {
            return installFromUrl(r.url, r.name);
          }));
        });
        var addInput = h("input.input", {
          type: "text",
          placeholder: "https://.../manifest.json"
        });
        addInput.__submit = function (v) {
          var u = v.trim();
          if (!/^https?:\/\/.+manifest\.json/.test(u)) return toast(t("Cole a URL do manifest.json do addon"));
          if (isLoggedIn()) return installFromUrl(u, t("o addon"));
          var cur = settings().localAddons || [];
          saveSettings({
            localAddons: cur.concat([u])
          });
          load(true).then(function () {
            dropTab("home");
            toast(t("Addon adicionado"));
            render();
          });
        };
        body.appendChild(h("div.set-row", {
          focusable: true,
          onSelect: function onSelect() {
            return select(addInput);
          }
        }, [h("div.label", null, [t("Adicionar addon por URL"), h("small", {
          text: isLoggedIn() ? t("Instala na sua conta Stremio") : t("Fica só nesta TV")
        })]), addInput]));
      }
      if (page2 === "c-about") {
        body.appendChild(h("div.set-section", {
          text: t("Sobre e depuração")
        }));
        var logInput = h("input.input", {
          type: "text",
          value: s.devlogUrl || "",
          placeholder: "http://IP-DO-PC:8099/log"
        });
        logInput.__submit = function (v) {
          saveSettings({
            devlogUrl: v.trim()
          });
          log.setRemote(v.trim());
          log.info(t("Log remoto ligado"));
          toast(v.trim() ? t("Enviando logs para o PC") : t("Log remoto desligado"));
        };
        body.appendChild(h("div.set-row", {
          focusable: true,
          onSelect: function onSelect() {
            return select(logInput);
          }
        }, [h("div.label", null, [t("Log remoto"), h("small", {
          text: t("npm run logs no PC")
        })]), logInput]));
        var netRow = row(t("Testar a internet"), t("Ping e velocidade de download (Cloudflare)"), "", function () {
          var v = netRow.querySelector(".value");
          v.textContent = t("Medindo o ping...");
          run2(function (step) {
            return v.textContent = step === "ping" ? t("Medindo o ping...") : t("Baixando arquivo de teste...");
          }).then(function (r) {
            var verdict = r.mbps >= 40 ? t("dá para 4K") : r.mbps >= 15 ? t("bom para 1080p") : r.mbps >= 6 ? t("só 720p com folga") : t("lenta para vídeo");
            v.textContent = r.mbps + " Mbps · " + r.pingMs + " ms";
            toast(t("Internet: {mbps} Mbps, ping {ms} ms ({verdict})", {
              mbps: r.mbps,
              ms: r.pingMs,
              verdict: verdict
            }), 8e3);
          }).catch(function (e) {
            v.textContent = "";
            toast(t("O teste falhou: {msg}", {
              msg: e.message
            }), 5e3);
          });
        });
        body.appendChild(netRow);
        body.appendChild(h("div.set-section", {
          text: t("Atualizações")
        }));
        body.appendChild(row(t("Versão instalada"), device || "Stremio Kai", shortDate(BUILD), null));
        var latestRow = row(t("Versão mais nova no GitHub"), REPO, t("Verificando..."), function () {
          return checkForUpdate();
        });
        body.appendChild(latestRow);
        latest().then(function (info2) {
          var v = latestRow.querySelector(".value");
          if (!v) return;
          var newer = info2.build && info2.build !== BUILD && Date.parse(info2.build) > Date.parse(BUILD);
          v.textContent = shortDate(info2.date) + (newer ? "  ·  " + t("nova!") : "  ·  " + t("em dia"));
          if (info2.message) latestRow.querySelector(".label small").textContent = info2.message;
        }).catch(function () {
          var v = latestRow.querySelector(".value");
          if (v) v.textContent = t("sem conexão");
        });
        body.appendChild(row(t("Procurar atualização"), t("Baixa a versão nova do GitHub ({repo})", {
          repo: REPO
        }), "", function () {
          return checkForUpdate();
        }));
      }
      placeFocus();
    }
    render();
    return {
      el: el,
      onBack: function onBack() {
        if (!PARENT[page2]) return false;
        goMain();
        return true;
      },
      onShow: function onShow() {
        check().then(function () {
          return render();
        });
      },
      destroy: function destroy() {
        clearTimeout(railTimer);
        if (bar.__destroy) bar.__destroy();
      }
    };
  }

  // src/js/views/calendar.js
  var WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  var MODES = [{
    id: "anime",
    label: "Animes"
  }, {
    id: "series",
    label: "Séries"
  }, {
    id: "movies",
    label: "Filmes"
  }];
  var MOVIE_REGION = "US";
  var NOT_SERIES = /^(Talk Show|News|Game Show|Variety|Sports|Award Show|Panel Show)$/;
  var COUNTRY_TAG = {
    CN: "CN",
    KR: "KR",
    TW: "TW"
  };
  var ANIME_QUERY = "query($from:Int,$to:Int,$page:Int){Page(page:$page,perPage:50){pageInfo{hasNextPage}airingSchedules(airingAt_greater:$from,airingAt_lesser:$to,sort:TIME){episode airingAt media{id idMal isAdult format countryOfOrigin title{romaji english} coverImage{large} averageScore}}}}";
  function dayStart(offset) {
    var d = /* @__PURE__ */new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + offset);
    return d;
  }
  function ymd(d) {
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }
  function animeDay(offset) {
    var from = Math.floor(dayStart(offset).getTime() / 1e3) - 1;
    var to = from + 86400 + 1;
    var all2 = [];
    var _page = function page2(p) {
      return postJSON("https://graphql.anilist.co", {
        query: ANIME_QUERY,
        variables: {
          from: from,
          to: to,
          page: p
        }
      }, {
        timeout: 15e3
      }).then(function (r) {
        var pg = r && r.data && r.data.Page;
        if (!pg) return all2;
        pg.airingSchedules.forEach(function (s) {
          if (s.media && !s.media.isAdult) all2.push(s);
        });
        return pg.pageInfo.hasNextPage && p < 10 ? _page(p + 1) : all2;
      });
    };
    return _page(1).then(function (list2) {
      return list2.map(function (s) {
        var m = s.media;
        var name = m.title && (m.title.english || m.title.romaji) || "";
        return {
          name: name,
          poster: m.coverImage && m.coverImage.large,
          at: s.airingAt * 1e3,
          slot: timeHM(new Date(s.airingAt * 1e3)) + " · Ep " + s.episode,
          score: m.averageScore,
          tag: COUNTRY_TAG[m.countryOfOrigin],
          open: function open() {
            return resolveAnime(m).then(function (r) {
              return r ? openDetails(r.type, r.id) : notFound(t("Esse anime não foi encontrado nos seus addons (instale o Anime Kitsu)."));
            });
          }
        };
      });
    });
  }
  function resolveAnime(media) {
    return getJSON("https://arm.haglund.dev/api/v2/ids?source=anilist&id=" + media.id, {
      quiet: true
    }).catch(function () {
      return null;
    }).then(function (ids2) {
      var movieFirst = media.format === "MOVIE" || ids2 && ids2.media === "MOVIE";
      var types = movieFirst ? ["movie", "series"] : ["series", "movie"];
      var cands = [];
      var add = function add(id) {
        return types.forEach(function (type) {
          return cands.push({
            type: type,
            id: id
          });
        });
      };
      if (ids2 && ids2.kitsu) add("kitsu:" + ids2.kitsu);
      if (ids2 && ids2.imdb) add(ids2.imdb);
      add("anilist:" + media.id);
      var usable = cands.filter(function (c) {
        return withResource("meta", c.type, c.id).length > 0;
      });
      var i = 0;
      var _next2 = function next() {
        if (i >= usable.length) return null;
        var c = usable[i++];
        return fetchMeta(c.type, c.id).then(function () {
          return c;
        }, _next2);
      };
      return _next2();
    });
  }
  function seriesDay(offset) {
    var date = ymd(dayStart(offset));
    var opt = {
      timeout: 15e3,
      quiet: true
    };
    return Promise.all([getJSON("https://api.tvmaze.com/schedule/web?date=" + date, opt).catch(function () {
      return [];
    }), getJSON("https://api.tvmaze.com/schedule?country=US&date=" + date, opt).catch(function () {
      return [];
    })]).then(function (lists) {
      var seen = {};
      var out = [];
      lists[0].concat(lists[1]).forEach(function (e) {
        var show3 = e.show || e._embedded && e._embedded.show;
        if (!show3 || !show3.externals || !show3.externals.imdb || NOT_SERIES.test(show3.type || "")) return;
        var key3 = show3.id + ":" + e.season + ":" + e.number;
        if (seen[key3]) return;
        seen[key3] = true;
        var network = show3.webChannel && show3.webChannel.name || show3.network && show3.network.name || "";
        var at = e.airstamp ? Date.parse(e.airstamp) : 0;
        out.push({
          name: show3.name,
          poster: show3.image && (show3.image.original || show3.image.medium),
          at: at,
          slot: (at ? timeHM(new Date(at)) + " · " : "") + "S" + e.season + " E" + (e.number || "?"),
          score: show3.rating && show3.rating.average ? Math.round(show3.rating.average * 10) : 0,
          tag: network,
          open: function open() {
            return openDetails("series", show3.externals.imdb);
          }
        });
      });
      return out.sort(function (a, b) {
        return a.at - b.at;
      });
    });
  }
  function moviesDay(offset) {
    return digitalReleases(ymd(dayStart(offset)), MOVIE_REGION).then(function (list2) {
      if (list2 === null) return null;
      return list2.map(function (m) {
        return {
          name: m.name,
          poster: m.poster,
          slot: t("Streaming"),
          score: m.score,
          open: function open() {
            return tmdbImdb("movie", m.tmdb).then(function (imdb) {
              return imdb ? openDetails("movie", imdb) : notFound(t("Esse filme ainda não tem página no Stremio."));
            });
          }
        };
      });
    });
  }
  function notFound(msg) {
    toast(msg, 5e3);
  }
  var FETCH = {
    anime: animeDay,
    series: seriesDay,
    movies: moviesDay
  };
  function CalendarView() {
    var el = h("div.view");
    var scroller = h("div.scroll-y", {
      "data-scroll-y": ""
    });
    var bar = topbar("calendar", goTab);
    var modes = h("div.cal-days.cal-modes", {
      "data-group": ""
    });
    var days = h("div.cal-days", {
      "data-group": "",
      "data-scroll-x": ""
    });
    var grid = h("div.grid");
    scroller.appendChild(bar);
    scroller.appendChild(modes);
    scroller.appendChild(days);
    scroller.appendChild(grid);
    el.appendChild(scroller);
    var mode = "anime";
    var current3 = 0;
    var token = 0;
    function label(offset) {
      if (offset === 0) return t("Hoje");
      if (offset === 1) return t("Amanhã");
      if (offset === -1) return t("Ontem");
      return t(WEEKDAYS[dayStart(offset).getDay()]);
    }
    function renderModes() {
      clear(modes);
      MODES.forEach(function (m, i) {
        return modes.appendChild(h("div.chip", {
          focusable: true,
          cls: m.id === mode ? "active" : "",
          text: t(m.label),
          onSelect: function onSelect() {
            mode = m.id;
            renderModes();
            focus(modes.children[i]);
            load7();
          }
        }));
      });
    }
    function renderDays() {
      clear(days);
      var _loop9 = function _loop9() {
        var off = o;
        var d = dayStart(off);
        days.appendChild(h("div.chip", {
          focusable: true,
          cls: off === current3 ? "active" : "",
          text: label(off) + " " + ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2),
          onSelect: function onSelect() {
            current3 = off;
            renderDays();
            focus(days.children[off + 1]);
            load7();
          }
        }));
      };
      for (var o = -1; o <= 6; o++) {
        _loop9();
      }
      days.__last = days.children[current3 + 1];
    }
    function load7() {
      var my = ++token;
      clear(grid);
      grid.appendChild(spinnerLine(t("Buscando lançamentos...")));
      FETCH[mode](current3).then(function (list2) {
        if (my !== token) return;
        clear(grid);
        if (list2 === null) {
          grid.appendChild(h("div.hint", {
            text: t("As datas de streaming dos filmes vêm do TMDB: coloque sua chave grátis do TMDB em Ajustes.")
          }));
          return;
        }
        if (!list2.length) {
          grid.appendChild(h("div.hint", {
            text: mode === "movies" ? t("Nenhum filme chega ao streaming neste dia.") : t("Nenhum episódio neste dia.")
          }));
          return;
        }
        var now = Date.now();
        list2.forEach(function (it) {
          var c = card({
            name: it.name,
            poster: it.poster
          }, {
            title: it.name,
            onSelect: function onSelect() {
              toast(t("Abrindo {name}...", {
                name: it.name
              }), 2e3);
              it.open();
            }
          });
          var wrap = c.querySelector(".poster-wrap");
          wrap.appendChild(h("div.cal-slot", {
            cls: it.at && it.at < now ? "aired" : "",
            text: it.slot
          }));
          if (it.score) wrap.appendChild(h("div.badge.cal-score", {
            text: it.score + "%"
          }));
          if (it.tag) wrap.appendChild(h("div.cal-tag", {
            text: it.tag
          }));
          grid.appendChild(c);
        });
        loadVisibleImages(el, 400);
      }).catch(function (e) {
        if (my !== token) return;
        clear(grid);
        grid.appendChild(h("div.hint", {
          text: t("Não foi possível carregar o calendário: {msg}", {
            msg: e.message
          })
        }));
      });
    }
    renderModes();
    renderDays();
    load7();
    return {
      el: el,
      onShow: function onShow() {
        return loadVisibleImages(el, 400);
      },
      destroy: function destroy() {
        return bar.__destroy && bar.__destroy();
      }
    };
  }

  // src/js/views/wizard.js
  function maybeShowWizard() {
    var s = settings();
    if (s.wizardDone) return;
    if (isLoggedIn() && s.serverUrl) {
      saveSettings({
        wizardDone: true
      });
      return;
    }
    push(WizardView());
  }
  function WizardView() {
    var el = h("div.view");
    var card2 = h("div.wizard-card");
    el.appendChild(h("div.wizard", null, card2));
    var step = 0;
    function finish() {
      saveSettings({
        wizardDone: true
      });
      pop();
      var home = currentView();
      if (home && home.reload) home.reload();
    }
    function btn(label, primary, fn) {
      return h("div.btn", {
        focusable: true,
        cls: primary ? "primary" : "",
        text: label,
        onSelect: fn
      });
    }
    var steps = (activeProfile().unnamed ? [stepName] : []).concat([stepAccount, stepServer, stepSubs]);
    function render() {
      clear(card2);
      card2.appendChild(h("div.wizard-step", {
        text: t("PASSO {n} DE {total}", {
          n: step + 1,
          total: steps.length
        })
      }));
      steps[step]();
      focusFirst(card2);
    }
    function next() {
      step++;
      if (step >= steps.length) finish();else render();
    }
    function stepName() {
      card2.appendChild(h("h1", {
        text: t("Bem-vindo! Quem vai usar este perfil?")
      }));
      card2.appendChild(h("p", {
        text: t("Dê um nome ao perfil. Depois você pode criar outros perfis, cada um com a própria conta Stremio e histórico.")
      }));
      var err = h("div.err-text");
      var input = h("input.input", {
        type: "text",
        placeholder: t("Ex.: Ana, Pedro, Sala"),
        maxlength: "20",
        focusable: true,
        "data-autofocus": ""
      });
      var save2 = function save2() {
        var name = String(input.value || "").trim();
        if (!name) {
          err.textContent = t("Digite um nome para o perfil.");
          return;
        }
        updateProfile(activeProfile().id, {
          name: name,
          unnamed: false
        });
        refreshProfileChips();
        next();
      };
      input.__submit = save2;
      card2.appendChild(input);
      card2.appendChild(err);
      card2.appendChild(h("div.actions", {
        "data-group": ""
      }, [btn(t("Continuar"), true, save2)]));
    }
    function stepAccount() {
      card2.appendChild(h("h1", {
        text: t("Bem-vindo ao Stremio Kai")
      }));
      if (isLoggedIn()) {
        card2.appendChild(h("p", {
          text: t("Você já está conectado à sua conta Stremio. Seus addons e sua biblioteca já estão aqui.")
        }));
        card2.appendChild(h("div.actions", {
          "data-group": ""
        }, [btn(t("Continuar"), true, next)]));
        return;
      }
      card2.appendChild(h("p", {
        text: t("Entre com a sua conta Stremio para trazer seus addons (Torrentio, debrid, Anime Kitsu...) e a biblioteca.")
      }));
      card2.appendChild(h("div.actions", {
        "data-group": ""
      }, [btn(t("Entrar na conta"), true, function () {
        return openLogin(function () {
          Promise.all([refreshUser().catch(function () {}), load(true), getLibrary()]).then(next, next);
        });
      }), btn(t("Pular"), false, next)]));
    }
    function stepServer() {
      card2.appendChild(h("h1", {
        text: t("Servidor de torrents no PC")
      }));
      var status2 = h("p", {
        text: isAvailable() ? t("Servidor conectado em {url}. Torrents liberados.", {
          url: baseUrl()
        }) : t("Para tocar torrents, deixe o stremio-service aberto num PC da rede. Links de debrid funcionam sem ele.")
      });
      card2.appendChild(status2);
      card2.appendChild(h("div.actions", {
        "data-group": ""
      }, [btn(t("Procurar na rede"), true, function () {
        status2.textContent = t("Procurando o servidor na rede...");
        scan(function (done, total) {
          return status2.textContent = t("Procurando o servidor na rede...") + " " + Math.round(done / total * 100) + "%";
        }).then(function (ip) {
          if (!ip) {
            status2.textContent = t("Nenhum servidor encontrado. Você pode configurar depois em Ajustes.");
            return;
          }
          saveSettings({
            serverUrl: ip
          });
          return check().then(function () {
            status2.textContent = t("Servidor encontrado em {ip}", {
              ip: ip
            }) + "!";
            toast(t("Servidor do PC conectado"));
          });
        }).catch(function () {
          return status2.textContent = t("Não foi possível procurar. Configure depois em Ajustes.");
        });
      }), btn(isAvailable() ? t("Continuar") : t("Pular"), false, next)]));
    }
    function stepSubs() {
      card2.appendChild(h("h1", {
        text: t("Legendas")
      }));
      card2.appendChild(h("p", {
        text: t("Em qual idioma o app deve ligar a legenda sozinho quando o áudio não for no seu idioma?")
      }));
      var ar = {
        label: t("Árabe"),
        value: ["ara", "ar"]
      };
      var en = {
        label: t("Inglês"),
        value: ["eng", "en"]
      };
      var choices = (current() === "ar" ? [ar, en] : [en, ar]).concat([{
        label: t("Não ligar sozinho"),
        value: []
      }]);
      card2.appendChild(h("div.opts", {
        "data-group": "",
        "data-vertical": ""
      }, choices.map(function (c) {
        return h("div.opt", {
          focusable: true,
          text: c.label,
          onSelect: function onSelect() {
            saveSettings({
              subtitleLangs: c.value,
              subtitlesAuto: c.value.length > 0
            });
            finish();
          }
        });
      })));
    }
    render();
    return {
      el: el,
      onBack: function onBack() {
        if (step > 0) {
          step--;
          render();
        } else finish();
        return true;
      }
    };
  }

  // src/js/lib/screensaver.js
  var SLIDE_MS = 12e3;
  var lastKey = Date.now();
  var overlay = null;
  var slideTimer = null;
  var items2 = [];
  var index = 0;
  function minutes() {
    return +settings().screensaver || 0;
  }
  function playing2() {
    return !!document.querySelector(".view.player:not(.hidden)") || document.documentElement.classList.contains("av-playing");
  }
  function show2() {
    if (overlay) return;
    var img = h("div.ss-bg");
    var title = h("div.ss-title");
    var clock = h("div.ss-clock");
    overlay = h("div.screensaver", null, [img, h("div.ss-shade"), h("div.ss-info", null, [clock, title])]);
    document.body.appendChild(overlay);
    var next = function next() {
      clock.textContent = timeHM(/* @__PURE__ */new Date());
      var it = items2.length ? items2[index++ % items2.length] : null;
      if (it) {
        img.classList.remove("show");
        setTimeout(function () {
          if (!overlay) return;
          img.style.backgroundImage = 'url("' + it.background + '")';
          title.textContent = it.name || "";
          img.classList.add("show");
        }, 900);
      }
    };
    var ready = items2.length ? Promise.resolve() : load2().then(function (l) {
      return items2 = (l || []).filter(function (x) {
        return x.background;
      });
    }).catch(function () {});
    ready.then(function () {
      if (!overlay) return;
      next();
      slideTimer = setInterval(next, SLIDE_MS);
    });
  }
  function hide2() {
    clearInterval(slideTimer);
    slideTimer = null;
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    if (overlay) clear(overlay);
    overlay = null;
  }
  function init2() {
    document.addEventListener("keydown", function (e) {
      lastKey = Date.now();
      if (overlay) {
        hide2();
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
    ["mousemove", "click"].forEach(function (ev) {
      return document.addEventListener(ev, function () {
        lastKey = Date.now();
        if (overlay) hide2();
      }, true);
    });
    setInterval(function () {
      var m = minutes();
      if (!m || overlay) return;
      if (playing2()) {
        lastKey = Date.now();
        return;
      }
      if (Date.now() - lastKey >= m * 6e4) show2();
    }, 15e3);
  }

  // src/js/main.js
  function boot() {
    var s = settings();
    init(s.language);
    if (s.devlogUrl) log.setRemote(s.devlogUrl);
    log.info("Iniciando", navigator.userAgent);
    registerTizenKeys();
    start();
    init2();
    onOpen(function (ev) {
      goTab("home");
      openDetails(ev.kind, ev.item, ev.video ? {
        videoId: ev.video,
        autoStreams: true
      } : {});
    });
    onKeys(function (keys2) {
      saveSettings(keys2);
      dropTab("settings");
      toast(t("Chaves recebidas do celular: {n}", {
        n: Object.keys(keys2).length
      }), 5e3);
      var want = keys2.traktClientId && !isConnected("trakt") ? "trakt" : keys2.simklClientId && !isConnected("simkl") ? "simkl" : null;
      if (want && hasKeys(want)) openTrackLink(want);
    });
    onSearch(function (q2) {
      goTab("search");
      var view = currentView();
      if (view && view.search) view.search(q2);
    });
    install();
    setSmooth(s.smoothScroll);
    var scrollTimer = null;
    onScroll(function (node) {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var v = currentView();
        loadVisibleImages(v ? v.el : node.closest(".view") || node);
        if (v && v.onScroll) v.onScroll();
      }, 120);
    });
    registerTab("home", HomeView);
    registerTab("search", SearchView);
    registerTab("library", LibraryView);
    registerTab("settings", SettingsView);
    registerTab("calendar", CalendarView);
    registerTab("collections", CollectionsView);
    registerTab("anime", AnimeView);
    if (needsPicker()) {
      var bootEl = document.getElementById("boot");
      if (bootEl) bootEl.style.display = "none";
      showPicker(function () {
        if (bootEl) bootEl.style.display = "";
        start2();
      });
    } else start2();
    document.addEventListener("webOSRelaunch", function () {
      check();
      devLaunch();
    });
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) check();
    });
  }
  function start2() {
    reloadProfile();
    var s = settings();
    applyLook(s);
    apply3(s.theme);
    document.body.classList.toggle("perf", s.perfMode !== false);
    log.info("Perfil", activeProfile().name);
    if (isLoggedIn()) {
      refreshUser().catch(function () {});
      getLibrary().catch(function () {});
    }
    Promise.all([check(), load().catch(function () {
      return null;
    })]).then(function () {
      var bootEl = document.getElementById("boot");
      if (bootEl) bootEl.parentNode.removeChild(bootEl);
      goTab("home");
      if (isNewProfilePendingLogin() && !isLoggedIn()) {
        clearNewProfileFlag();
        openLogin(function () {
          Promise.all([refreshUser().catch(function () {}), load(true), getLibrary()]).then(function () {
            var home = tabView("home");
            if (home && home.reload) home.reload();
          });
        });
      } else maybeShowWizard();
      devLaunch();
      if (shouldAutoCheck()) {
        setTimeout(function () {
          check2().then(function (info2) {
            return info2 && toast(t("Atualização disponível: Ajustes → Procurar atualização"), 7e3);
          }).catch(function () {});
        }, 8e3);
      }
    });
  }
  function devLaunch() {
    if (true) return;
    var params = {};
    try {
      params = JSON.parse(window.PalmSystem.launchParams || "{}") || {};
    } catch (e) {
      return;
    }
    if (params.devPlay64) params.devPlay = window.atob(params.devPlay64);
    if (!params.devPlay) return;
    log.info("devPlay", params.devPlay);
    openPlayer({
      meta: {
        id: "dev",
        type: "movie",
        name: params.devTitle || "Teste"
      },
      video: {
        id: "dev"
      },
      stream: {
        url: params.devPlay
      },
      streams: [],
      startTime: (params.devStart || 0) * 1e3,
      isSeries: false
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);else boot();
})();