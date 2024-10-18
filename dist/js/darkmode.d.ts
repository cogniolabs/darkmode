export default class Darkmode {
    private options;
    private localStorage;
    private button;
    constructor(options?: Partial<DarkmodeOptions>);
    init(): void;
    private createButton;
    private createAccessibilityButtons;
    private adjustContrast;
    private enableKeyboardShortcut;
    private enableAutoSunset;
    private calculateSunset;
    private enableAutoTime;
    isDarkMode(): boolean;
    toggle(): void;
    private applyDarkmodeCss;
}
interface DarkmodeOptions {
    enabled_switch: boolean;
    os_aware: boolean;
    color_scheme: string;
    colors: {
        [key: string]: {
            body: string;
            texts: string;
            border: string;
            links: string;
        };
    };
    button_type: 'icon' | 'text' | 'both';
    button_text: string;
    accessibility_buttons: boolean;
    auto_sunset: boolean;
    auto_time: string | null;
    keyboard_shortcut: boolean;
}
export {};
