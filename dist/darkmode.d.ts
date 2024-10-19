interface DarkmodeOptions {
    enabledSwitch?: boolean;
    osAware?: boolean;
    colorScheme?: string;
    colors?: {
        [key: string]: {
            body: string;
            texts: string;
            border: string;
            links: string;
        };
    };
    autoSunset?: boolean;
    autoTime?: string | null;
    keyboardShortcut?: boolean;
}
declare class Darkmode {
    private options;
    private button;
    constructor(options?: DarkmodeOptions);
    init(): void;
    private setupDarkmodeButton;
    private setupKeyboardShortcut;
    private setupAutoSunset;
    private setupAutoTime;
    private shouldEnableDarkMode;
    isDarkMode(): boolean;
    toggleDarkMode(): void;
    private enableDarkMode;
    private toggleDarkModeBasedOnTime;
    private calculateSunsetTime;
    private applyDarkmodeCss;
    private handleOSPreferenceChange;
    private disableDarkMode;
    private setCookie;
    private getCookie;
}
export default Darkmode;
