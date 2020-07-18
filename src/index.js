"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.useVue = void 0;
var react_1 = require("react");
var runtime_dom_1 = require("@vue/runtime-dom");
var _id = 0;
var _vueState = {};
function useVue(Props, setupFunction) {
    var id = react_1.useState(function () { return _id++; })[0];
    var setTick = react_1.useState(0)[0];
    var _a = react_1.useState(function () {
        var props = runtime_dom_1.reactive(__assign({}, (Props || {})));
        // TODO: bind instance
        var data = runtime_dom_1.ref(setupFunction(props));
        _vueState[id] = {
            props: props,
            data: data
        };
        return data.value;
    }), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
        var props = _vueState[id].props;
        for (var _i = 0, _a = Object.keys(Props); _i < _a.length; _i++) {
            var key = _a[_i];
            props[key] = Props[key];
        }
    }, [Props]);
    react_1.useEffect(function () {
        var data = _vueState[id].data;
        runtime_dom_1.watch(data, function (v) {
            setState(v);
            // force update
            setTick(+new Date());
        }, { deep: true });
        return function () {
            delete _vueState[id];
            // TODO: call onMounted
        };
    }, []);
    return state;
}
exports.useVue = useVue;
