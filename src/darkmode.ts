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

class Darkmode {
	private options: Required<DarkmodeOptions>;
	private button: HTMLElement | null;

	constructor(options: DarkmodeOptions = {}) {
		this.options = {
			enabledSwitch: true,
			osAware: true,
			colorScheme: 'default',
			colors: {},
			autoSunset: false,
			autoTime: null,
			keyboardShortcut: true,
			...options,
		};

		this.button = null;
	}

	public init(): void {
		this.setupDarkmodeButton();
		if (this.options.keyboardShortcut) this.setupKeyboardShortcut();
		if (this.shouldEnableDarkMode()) this.enableDarkMode();
		if (this.options.autoSunset) this.setupAutoSunset();
		if (this.options.autoTime) this.setupAutoTime();
		this.applyDarkmodeCss();
		this.handleOSPreferenceChange();
	}

	private setupDarkmodeButton(): void {
		if (this.options.enabledSwitch) {
			this.button = document.querySelector('.darkmode-toggle');
			this.button?.addEventListener('click', () => {
				this.toggleDarkMode();
			});
		}
	}

	private setupKeyboardShortcut(): void {
		document.addEventListener('keydown', (e: KeyboardEvent) => {
			if (
				(e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd') ||
				(e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd')
			)
				this.toggleDarkMode();
		});
	}

	private setupAutoSunset(): void {
		const checkSunset = () => {
			if ('geolocation' in navigator) {
				navigator.geolocation.getCurrentPosition(({ coords }) => {
					const sunsetTime = this.calculateSunsetTime(
						coords.latitude,
						coords.longitude
					);
					this.toggleDarkModeBasedOnTime(new Date(), sunsetTime);
				});
			}
		};
		checkSunset();
		setInterval(checkSunset, 60000); // Check every minute
	}

	private setupAutoTime(): void {
		const checkTime = () => {
			const now = new Date();
			const [hours, minutes] = (this.options.autoTime as string)
				.split(':')
				.map(Number);
			const autoTime = new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate(),
				hours,
				minutes
			);
			this.toggleDarkModeBasedOnTime(now, autoTime);
		};
		checkTime();
		setInterval(checkTime, 60000); // Check every minute
	}

	private shouldEnableDarkMode(): boolean {
		const darkmodeSetting = this.getCookie('darkmode');
		const osPrefersDark = window.matchMedia(
			'(prefers-color-scheme: dark)'
		).matches;
		return (
			darkmodeSetting === 'true' ||
			(this.options.osAware && darkmodeSetting === null && osPrefersDark)
		);
	}

	public isDarkMode(): boolean {
		return document.body.classList.contains('darkmode-active');
	}

	public toggleDarkMode(): void {
		const isDarkmode = !this.isDarkMode();
		if (isDarkmode) {
			document.body.classList.add('darkmode-active');
			this.setCookie('darkmode', 'true', 365);
		} else {
			document.body.classList.remove('darkmode-active');
			this.setCookie('darkmode', 'false', 365);
		}
	}

	private enableDarkMode(): void {
		document.body.classList.add('darkmode-active');
		this.setCookie('darkmode', 'true', 365);
	}

	private toggleDarkModeBasedOnTime(now: Date, targetTime: Date): void {
		if (now >= targetTime && !this.isDarkMode()) {
			this.enableDarkMode();
		}
		if (now < targetTime && this.isDarkMode()) {
			this.toggleDarkMode();
		}
	}

	private calculateSunsetTime(lat: number, _lng: number): Date {
		const sunsetHour = 18 - lat / 10;
		return new Date(new Date().setHours(sunsetHour, 0, 0));
	}

	private applyDarkmodeCss(): void {
		const colorScheme =
			this.options.colors[this.options.colorScheme] ||
			this.options.colors.default;
		const { body, texts, border, links } = colorScheme;

		const css = `
			.darkmode-active {
			  background-color: ${body};
			  color: ${texts};
			}
			.darkmode-active a {
			  color: ${links};
			}
			.darkmode-active * {
			  border-color: ${border};
			}
		`;
		const style = document.createElement('style');
		style.textContent = css;
		document.head.appendChild(style);
	}

	private handleOSPreferenceChange(): void {
		if (this.options.osAware) {
			const mediaQuery = window.matchMedia(
				'(prefers-color-scheme: dark)'
			);
			mediaQuery.addEventListener('change', (e) => {
				if (this.getCookie('darkmode') === null) {
					if (e.matches) {
						this.enableDarkMode();
					} else {
						this.disableDarkMode();
					}
				}
			});
		}
	}

	private disableDarkMode(): void {
		document.body.classList.remove('darkmode-active');
		this.setCookie('darkmode', 'false', 365);
	}

	private setCookie(name: string, value: string, days: number): void {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		const expires = 'expires=' + date.toUTCString();
		document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
	}

	private getCookie(name: string): string | null {
		const nameEQ = name + '=';
		const ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			const c = ca[i].trim();
			if (c.indexOf(nameEQ) == 0) {
				return c.substring(nameEQ.length, c.length);
			}
		}
		return null;
	}
}

// CommonJS export
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = Darkmode;
}

// ES Module export
export default Darkmode;

// Browser global
interface CustomWindow extends Window {
	Darkmode?: typeof Darkmode;
}

if (typeof window !== 'undefined') {
	(window as CustomWindow).Darkmode = Darkmode;
}
