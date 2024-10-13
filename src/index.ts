import 'easy-toggle-state';

export default class Darkmode {
    options: any;
    ls: Storage;
    button?: HTMLDivElement;
    linkTags: HTMLCollectionOf<HTMLAnchorElement>;
    inputTags: HTMLCollectionOf<HTMLInputElement>;
    buttons: HTMLCollectionOf<HTMLButtonElement>;

    constructor(options: any = {}) {
        this.options = options;
        this.ls = window.localStorage;

        // Generate Floating Button
        if (options.enabled_switch) {
            const button = document.createElement('div');
            this.createButton(button);
            this.button = button;
        }

        this.linkTags = document.getElementsByTagName('a');
        this.inputTags = document.getElementsByTagName('input');
        this.buttons = document.getElementsByTagName('button');
    }

    init = () => {
        const options = this.options;
        // Cache Saved
        const darkmodeActivated = this.ls.getItem('darkmode') === 'true';
        const darkmodeNeverActivatedByAction = this.ls.getItem('darkmode') === null;

        // OS-aware Darkmode
        const osAware = options.os_aware === '1' ? this.osAware() : '';
        if (darkmodeActivated || (osAware === 'dark' && darkmodeNeverActivatedByAction)) {
            this.toggle();
        }

        // Dark Mode CSS
        this.frontend_css();
    };

    osAware = () => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    };

    addStyle = (css: string, id: string, place: 'head' | 'body') => {
        const linkElement = document.createElement('link');

        linkElement.setAttribute('rel', 'stylesheet');
        linkElement.setAttribute('type', 'text/css');
        linkElement.setAttribute('id', id);
        linkElement.setAttribute('href', 'data:text/css;charset=UTF-8,' + encodeURIComponent(css));
        if (place === 'head') {
            document.head.appendChild(linkElement);
        } else {
            document.body.appendChild(linkElement);
        }
    };

    toggle = () => {
        const isdarkmode = this.isActivated();
        document.documentElement.classList.toggle('darkmode-activated');
        this.ls.setItem('darkmode', (!isdarkmode).toString());
    };

    createButton = (button: HTMLDivElement) => {
        const options = this.options;
        const css = `
            .darkmode-switch {
                --darkmode-primary-switch-color: #000000;
                --darkmode-secondary-switch-color: #ffffff;
            }
        `;

        this.addStyle(css, 'darkmode-toggle', 'head');

        // Add Class name
        button.classList.add('darkmode-switch');
        button.classList.add('darkmode-ignore-css');
        button.setAttribute('data-toggle-class', 'darkmode-activated');
        button.setAttribute('data-target', 'html');

        // Label Wrap
        const labelWrap = document.createElement('label');
        labelWrap.classList.add('darkmode-switch-label');
        labelWrap.classList.add('darkmode-ignore-css');
        labelWrap.classList.add(options.switch_style);

        if (this.ls.getItem('darkmode') === 'true') {
            labelWrap.classList.add('active');
        }

        // Input checkbox
        const checkBox = document.createElement('input');
        if (this.ls.getItem('darkmode') === 'true') {
            checkBox.setAttribute('checked', 'true');
        }

        checkBox.type = 'checkbox';
        checkBox.className = 'darkmode-switch-checkbox';
        checkBox.id = 'darkmode';

        // Span Handle
        const handle = document.createElement('span');
        handle.className = 'darkmode-switch-handle darkmode-ignore-css';

        // Append
        labelWrap.appendChild(checkBox);
        labelWrap.appendChild(handle);
        button.appendChild(labelWrap);

        document.body.insertBefore(button, document.body.firstChild);
    };

    isActivated = () => {
        return document.documentElement.classList.contains('darkmode-activated');
    };

    frontend_css = () => {
        const color_scheme = this.options.color_scheme;
        const colors = this.options.colors;
        const _color = colors[color_scheme];

        const frontend_css = `
            html.darkmode-activated :not(a):not(img):not(.darkmode-ignore-css) {
                background-color: ${_color.body} !important;
                color: ${_color.texts} !important;
                border-color: ${_color.border} !important;
            }

            html.darkmode-activated a:not(.darkmode-ignore-css),
            html.darkmode-activated a *:not(.darkmode-ignore-css) {
                color: ${_color.links} !important;
            }
        `;

        this.addStyle(frontend_css, color_scheme, 'head');
    };
}
