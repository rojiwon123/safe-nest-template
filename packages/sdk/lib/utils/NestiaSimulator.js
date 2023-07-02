"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestiaSimulator = void 0;
const fetcher_1 = require("@nestia/fetcher");
const typia_1 = __importDefault(require("typia"));
var NestiaSimulator;
(function (NestiaSimulator) {
    NestiaSimulator.assert = (props) => {
        return {
            param: param(props),
            query: query(props),
            body: body(props),
        };
    };
    const param = (props) => (name) => (type) => (task) => {
        validate((exp) => `URL parameter "${name}" is not ${exp.expected} type.`)(props)(type === "uuid"
            ? uuid(task)
            : type === "date"
                ? date(task)
                : task);
    };
    const query = (props) => (task) => validate(() => "Request query parameters are not following the promised type.")(props)(task);
    const body = (props) => (task) => validate(() => "Request body is not following the promised type.")(props)(task);
    const uuid = (task) => () => {
        const value = task();
        return (input => {
            const __is = input => {
                const $is_uuid = typia_1.default.assert.is_uuid;
                const $io0 = input => null === input.value || "string" === typeof input.value && $is_uuid(input.value);
                return "object" === typeof input && null !== input && $io0(input);
            };
            if (false === __is(input))
                ((input, _path, _exceptionable = true) => {
                    const $guard = typia_1.default.assert.guard;
                    const $is_uuid = typia_1.default.assert.is_uuid;
                    const $ao0 = (input, _path, _exceptionable = true) => null === input.value || "string" === typeof input.value && ($is_uuid(input.value) || $guard(_exceptionable, {
                        path: _path + ".value",
                        expected: "string (@format uuid)",
                        value: input.value
                    })) || $guard(_exceptionable, {
                        path: _path + ".value",
                        expected: "(null | string)",
                        value: input.value
                    });
                    return ("object" === typeof input && null !== input || $guard(true, {
                        path: _path + "",
                        expected: "IUuid",
                        value: input
                    })) && $ao0(input, _path + "", true) || $guard(true, {
                        path: _path + "",
                        expected: "IUuid",
                        value: input
                    });
                })(input, "$input", true);
            return input;
        })({ value }).value;
    };
    const date = (task) => () => {
        const value = task();
        return (input => {
            const __is = input => {
                const $is_date = typia_1.default.assert.is_date;
                const $io0 = input => null === input.value || "string" === typeof input.value && $is_date(input.value);
                return "object" === typeof input && null !== input && $io0(input);
            };
            if (false === __is(input))
                ((input, _path, _exceptionable = true) => {
                    const $guard = typia_1.default.assert.guard;
                    const $is_date = typia_1.default.assert.is_date;
                    const $ao0 = (input, _path, _exceptionable = true) => null === input.value || "string" === typeof input.value && ($is_date(input.value) || $guard(_exceptionable, {
                        path: _path + ".value",
                        expected: "string (@format date)",
                        value: input.value
                    })) || $guard(_exceptionable, {
                        path: _path + ".value",
                        expected: "(null | string)",
                        value: input.value
                    });
                    return ("object" === typeof input && null !== input || $guard(true, {
                        path: _path + "",
                        expected: "IDate",
                        value: input
                    })) && $ao0(input, _path + "", true) || $guard(true, {
                        path: _path + "",
                        expected: "IDate",
                        value: input
                    });
                })(input, "$input", true);
            return input;
        })({ value }).value;
    };
    const validate = (message, path) => (props) => (task) => {
        try {
            task();
        }
        catch (exp) {
            if ((input => {
                const $io0 = input => "string" === typeof input.method && (undefined === input.path || "string" === typeof input.path) && "string" === typeof input.expected && true && "string" === typeof input.name && "string" === typeof input.message && (undefined === input.stack || "string" === typeof input.stack);
                return "object" === typeof input && null !== input && $io0(input);
            })(exp))
                throw new fetcher_1.HttpError(props.method, props.host + props.path, 400, JSON.stringify({
                    method: exp.method,
                    path: path !== null && path !== void 0 ? path : exp.path,
                    expected: exp.expected,
                    value: exp.value,
                    message: message(exp),
                }));
            throw exp;
        }
    };
})(NestiaSimulator || (exports.NestiaSimulator = NestiaSimulator = {}));
