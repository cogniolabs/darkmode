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
var Darkmode = /** @class */ (function () {
    function Darkmode(options) {
        if (options === void 0) { options = {}; }
        this.options = __assign({ enabled_switch: true, os_aware: true, color_scheme: 'default', colors: {
                default: {
                    body: '#282c35',
                    texts: '#d6d6d6',
                    border: '#4a4a4a',
                    links: '#45a29e',
                },
            }, button_type: 'icon', button_text: 'Toggle Dark Mode', accessibility_buttons: false, auto_sunset: false, auto_time: null, keyboard_shortcut: true }, options);
        this.localStorage = window.localStorage;
        this.button = null;
        if (this.options.enabled_switch) {
            this.button = this.createButton();
        }
        if (this.options.accessibility_buttons) {
            this.createAccessibilityButtons();
        }
        if (this.options.keyboard_shortcut) {
            this.enableKeyboardShortcut();
        }
    }
    Darkmode.prototype.init = function () {
        var darkmodeActivated = this.localStorage.getItem('darkmode') === 'true';
        var darkmodeNeverActivated = this.localStorage.getItem('darkmode') === null;
        if (this.options.os_aware) {
            var osPrefersDark = window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (osPrefersDark && darkmodeNeverActivated) {
                this.toggle();
            }
        }
        if (darkmodeActivated) {
            this.toggle();
        }
        if (this.options.enabled_switch && this.button) {
            this.button.addEventListener('click', this.toggle.bind(this));
        }
        if (this.options.auto_sunset) {
            this.enableAutoSunset();
        }
        if (this.options.auto_time) {
            this.enableAutoTime();
        }
        this.applyDarkmodeCss();
    };
    Darkmode.prototype.createButton = function () {
        var button = document.createElement('button');
        button.classList.add('darkmode-toggle');
        switch (this.options.button_type) {
            case 'icon':
                button.innerHTML = '🌓';
                break;
            case 'text':
                button.textContent = this.options.button_text;
                break;
            case 'both':
                button.innerHTML = "\uD83C\uDF13 ".concat(this.options.button_text);
                break;
        }
        button.setAttribute('aria-label', 'Toggle dark mode');
        document.body.appendChild(button);
        return button;
    };
    Darkmode.prototype.createAccessibilityButtons = function () {
        var _this = this;
        var container = document.createElement('div');
        container.classList.add('darkmode-accessibility');
        var increaseContrast = document.createElement('button');
        increaseContrast.textContent = 'Increase Contrast';
        increaseContrast.addEventListener('click', function () {
            return _this.adjustContrast(0.1);
        });
        var decreaseContrast = document.createElement('button');
        decreaseContrast.textContent = 'Decrease Contrast';
        decreaseContrast.addEventListener('click', function () {
            return _this.adjustContrast(-0.1);
        });
        container.appendChild(increaseContrast);
        container.appendChild(decreaseContrast);
        document.body.appendChild(container);
    };
    Darkmode.prototype.adjustContrast = function (amount) {
        var root = document.documentElement;
        var currentContrast = parseFloat(getComputedStyle(root).getPropertyValue('--darkmode-contrast') ||
            '1');
        var newContrast = Math.max(0.5, Math.min(2, currentContrast + amount));
        root.style.setProperty('--darkmode-contrast', newContrast.toString());
    };
    Darkmode.prototype.enableKeyboardShortcut = function () {
        var _this = this;
        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey && e.altKey && e.key === 'd') {
                _this.toggle();
            }
        });
    };
    Darkmode.prototype.enableAutoSunset = function () {
        var _this = this;
        var checkSunset = function () {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var _a = position.coords, latitude = _a.latitude, longitude = _a.longitude;
                    var date = new Date();
                    var sunsetTime = _this.calculateSunsetSunrise(latitude, longitude, date);
                    if (date > sunsetTime && !_this.isDarkMode()) {
                        _this.toggle();
                    }
                    else if (date < sunsetTime && _this.isDarkMode()) {
                        _this.toggle();
                    }
                });
            }
        };
        checkSunset();
        setInterval(checkSunset, 60000); // Check every minute
    };
    Darkmode.prototype.calculateSunsetSunrise = function (lat, _lng, date) {
        // const januaryFirst: Date = new Date(date.getFullYear(), 0, 1);
        // const _dayOfYear = Math.floor(
        // 	(date.getTime() - januaryFirst.getTime()) / 86400000
        // );
        var sunsetHour = 18 - lat / 10;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), sunsetHour, 0, 0);
    };
    Darkmode.prototype.enableAutoTime = function () {
        var _this = this;
        var checkTime = function () {
            var now = new Date();
            var _a = _this.options.auto_time
                .split(':')
                .map(Number), hours = _a[0], minutes = _a[1];
            var autoTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
            if (now >= autoTime && !_this.isDarkMode()) {
                _this.toggle();
            }
            else if (now < autoTime && _this.isDarkMode()) {
                _this.toggle();
            }
        };
        checkTime();
        setInterval(checkTime, 60000); // Check every minute
    };
    Darkmode.prototype.isDarkMode = function () {
        return document.body.classList.contains('darkmode-active');
    };
    Darkmode.prototype.toggle = function () {
        var isDarkmode = document.body.classList.toggle('darkmode-active');
        this.localStorage.setItem('darkmode', isDarkmode.toString());
        if (this.options.enabled_switch && this.button) {
            this.button.setAttribute('aria-label', isDarkmode ? 'Deactivate dark mode' : 'Activate dark mode');
        }
    };
    Darkmode.prototype.applyDarkmodeCss = function () {
        var _a = this.options.colors[this.options.color_scheme], body = _a.body, texts = _a.texts, border = _a.border, links = _a.links;
        var css = "\n\t\t\t:root {\n\t\t\t\t--darkmode-contrast: 1;\n\t\t\t}\n\t\t\tbody.darkmode-active {\n\t\t\t\tbackground-color: ".concat(body, ";\n\t\t\t\tcolor: ").concat(texts, ";\n\t\t\t\tfilter: contrast(var(--darkmode-contrast));\n\t\t\t}\n\t\t\tbody.darkmode-active :not(img):not(.darkmode-ignore) {\n\t\t\t\tborder-color: ").concat(border, " !important;\n\t\t\t}\n\t\t\tbody.darkmode-active a:not(.darkmode-ignore) {\n\t\t\t\tcolor: ").concat(links, ";\n\t\t\t}\n\t\t\t.darkmode-accessibility {\n\t\t\t\tposition: fixed;\n\t\t\t\tbottom: 20px;\n\t\t\t\tright: 20px;\n\t\t\t\tdisplay: flex;\n\t\t\t\tflex-direction: column;\n\t\t\t}\n\t\t\t.darkmode-accessibility button {\n\t\t\t\tmargin: 5px;\n\t\t\t\tpadding: 5px 10px;\n\t\t\t\tbackground-color: #f0f0f0;\n\t\t\t\tborder: 1px solid #ccc;\n\t\t\t\tborder-radius: 4px;\n\t\t\t\tcursor: pointer;\n\t\t\t}\n\t\t");
        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };
    return Darkmode;
}());
export default Darkmode;
