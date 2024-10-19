(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Darkmode = factory());
})(this, (function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var Darkmode = /** @class */ (function () {
        function Darkmode(options) {
            if (options === void 0) { options = {}; }
            this.options = __assign({ enabledSwitch: true, osAware: true, colorScheme: 'default', colors: {}, autoSunset: false, autoTime: null, keyboardShortcut: true }, options);
            this.button = null;
        }
        Darkmode.prototype.init = function () {
            this.setupDarkmodeButton();
            if (this.options.keyboardShortcut)
                this.setupKeyboardShortcut();
            if (this.shouldEnableDarkMode())
                this.enableDarkMode();
            if (this.options.autoSunset)
                this.setupAutoSunset();
            if (this.options.autoTime)
                this.setupAutoTime();
            this.applyDarkmodeCss();
            this.handleOSPreferenceChange();
        };
        Darkmode.prototype.setupDarkmodeButton = function () {
            var _this = this;
            var _a;
            if (this.options.enabledSwitch) {
                this.button = document.querySelector('.darkmode-toggle');
                (_a = this.button) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
                    _this.toggleDarkMode();
                });
            }
        };
        Darkmode.prototype.setupKeyboardShortcut = function () {
            var _this = this;
            document.addEventListener('keydown', function (e) {
                if ((e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd') ||
                    (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd'))
                    _this.toggleDarkMode();
            });
        };
        Darkmode.prototype.setupAutoSunset = function () {
            var _this = this;
            var checkSunset = function () {
                if ('geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(function (_a) {
                        var coords = _a.coords;
                        var sunsetTime = _this.calculateSunsetTime(coords.latitude, coords.longitude);
                        _this.toggleDarkModeBasedOnTime(new Date(), sunsetTime);
                    });
                }
            };
            checkSunset();
            setInterval(checkSunset, 60000); // Check every minute
        };
        Darkmode.prototype.setupAutoTime = function () {
            var _this = this;
            var checkTime = function () {
                var now = new Date();
                var _a = _this.options.autoTime
                    .split(':')
                    .map(Number), hours = _a[0], minutes = _a[1];
                var autoTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
                _this.toggleDarkModeBasedOnTime(now, autoTime);
            };
            checkTime();
            setInterval(checkTime, 60000); // Check every minute
        };
        Darkmode.prototype.shouldEnableDarkMode = function () {
            var darkmodeSetting = this.getCookie('darkmode');
            var osPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return (darkmodeSetting === 'true' ||
                (this.options.osAware && darkmodeSetting === null && osPrefersDark));
        };
        Darkmode.prototype.isDarkMode = function () {
            return document.body.classList.contains('darkmode-active');
        };
        Darkmode.prototype.toggleDarkMode = function () {
            var isDarkmode = !this.isDarkMode();
            if (isDarkmode) {
                document.body.classList.add('darkmode-active');
                this.setCookie('darkmode', 'true', 365);
            }
            else {
                document.body.classList.remove('darkmode-active');
                this.setCookie('darkmode', 'false', 365);
            }
        };
        Darkmode.prototype.enableDarkMode = function () {
            document.body.classList.add('darkmode-active');
            this.setCookie('darkmode', 'true', 365);
        };
        Darkmode.prototype.toggleDarkModeBasedOnTime = function (now, targetTime) {
            if (now >= targetTime && !this.isDarkMode()) {
                this.enableDarkMode();
            }
            if (now < targetTime && this.isDarkMode()) {
                this.toggleDarkMode();
            }
        };
        Darkmode.prototype.calculateSunsetTime = function (lat, _lng) {
            var sunsetHour = 18 - lat / 10;
            return new Date(new Date().setHours(sunsetHour, 0, 0));
        };
        Darkmode.prototype.applyDarkmodeCss = function () {
            var colorScheme = this.options.colors[this.options.colorScheme] ||
                this.options.colors.default;
            var body = colorScheme.body, texts = colorScheme.texts, border = colorScheme.border, links = colorScheme.links;
            var css = "\n\t\t\t.darkmode-active {\n\t\t\t  background-color: ".concat(body, ";\n\t\t\t  color: ").concat(texts, ";\n\t\t\t}\n\t\t\t.darkmode-active a {\n\t\t\t  color: ").concat(links, ";\n\t\t\t}\n\t\t\t.darkmode-active * {\n\t\t\t  border-color: ").concat(border, ";\n\t\t\t}\n\t\t");
            var style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        };
        Darkmode.prototype.handleOSPreferenceChange = function () {
            var _this = this;
            if (this.options.osAware) {
                var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                mediaQuery.addEventListener('change', function (e) {
                    if (_this.getCookie('darkmode') === null) {
                        if (e.matches) {
                            _this.enableDarkMode();
                        }
                        else {
                            _this.disableDarkMode();
                        }
                    }
                });
            }
        };
        Darkmode.prototype.disableDarkMode = function () {
            document.body.classList.remove('darkmode-active');
            this.setCookie('darkmode', 'false', 365);
        };
        Darkmode.prototype.setCookie = function (name, value, days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            var expires = 'expires=' + date.toUTCString();
            document.cookie = "".concat(name, "=").concat(value, ";").concat(expires, ";path=/;SameSite=Strict");
        };
        Darkmode.prototype.getCookie = function (name) {
            var nameEQ = name + '=';
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(nameEQ) == 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
            return null;
        };
        return Darkmode;
    }());
    // CommonJS export
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = Darkmode;
    }
    if (typeof window !== 'undefined') {
        window.Darkmode = Darkmode;
    }

    return Darkmode;

}));
