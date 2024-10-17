export default class Darkmode {
	private options: DarkmodeOptions;
	private localStorage: Storage;
	private button: HTMLButtonElement | null;

	constructor(options: Partial<DarkmodeOptions> = {}) {
		this.options = {
			enabled_switch: true,
			os_aware: true,
			color_scheme: 'default',
			colors: {
				default: {
					body: '#282c35',
					texts: '#d6d6d6',
					border: '#4a4a4a',
					links: '#45a29e',
				},
			},
			button_type: 'icon',
			button_text: 'Toggle Dark Mode',
			accessibility_buttons: false,
			auto_sunset: false,
			auto_time: null,
			keyboard_shortcut: true,
			...options,
		};
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

	public init(): void {
		const darkmodeActivated =
			this.localStorage.getItem('darkmode') === 'true';
		const darkmodeNeverActivated =
			this.localStorage.getItem('darkmode') === null;

		if (this.options.os_aware) {
			const osPrefersDark =
				window.matchMedia &&
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
	}

	private createButton(): HTMLButtonElement {
		const button: HTMLButtonElement = document.createElement('button');
		button.classList.add('darkmode-toggle');

		switch (this.options.button_type) {
			case 'icon':
				button.innerHTML = '🌓';
				break;
			case 'text':
				button.textContent = this.options.button_text;
				break;
			case 'both':
				button.innerHTML = `🌓 ${this.options.button_text}`;
				break;
		}

		button.setAttribute('aria-label', 'Toggle dark mode');
		document.body.appendChild(button);
		return button;
	}

	private createAccessibilityButtons(): void {
		const container: HTMLDivElement = document.createElement('div');
		container.classList.add('darkmode-accessibility');

		const increaseContrast: HTMLButtonElement =
			document.createElement('button');
		increaseContrast.textContent = 'Increase Contrast';
		increaseContrast.addEventListener('click', () =>
			this.adjustContrast(0.1)
		);

		const decreaseContrast: HTMLButtonElement =
			document.createElement('button');
		decreaseContrast.textContent = 'Decrease Contrast';
		decreaseContrast.addEventListener('click', () =>
			this.adjustContrast(-0.1)
		);

		container.appendChild(increaseContrast);
		container.appendChild(decreaseContrast);
		document.body.appendChild(container);
	}

	private adjustContrast(amount: number): void {
		const root: HTMLElement = document.documentElement;
		const currentContrast: number = parseFloat(
			getComputedStyle(root).getPropertyValue('--darkmode-contrast') ||
				'1'
		);
		const newContrast: number = Math.max(
			0.5,
			Math.min(2, currentContrast + amount)
		);
		root.style.setProperty('--darkmode-contrast', newContrast.toString());
	}

	private enableKeyboardShortcut(): void {
		document.addEventListener('keydown', (e: KeyboardEvent) => {
			if (e.ctrlKey && e.altKey && e.key === 'd') {
				this.toggle();
			}
		});
	}

	private enableAutoSunset(): void {
		const checkSunset = (): void => {
			if ('geolocation' in navigator) {
				navigator.geolocation.getCurrentPosition(
					(position: GeolocationPosition) => {
						const { latitude, longitude } = position.coords;
						const date: Date = new Date();
						const sunsetTime: Date = this.calculateSunset(
							date,
							latitude,
							longitude
						);

						if (date > sunsetTime && !this.isDarkMode()) {
							this.toggle();
						} else if (date < sunsetTime && this.isDarkMode()) {
							this.toggle();
						}
					}
				);
			}
		};

		checkSunset();
		setInterval(checkSunset, 60000); // Check every minute
	}

	private calculateSunset(date: Date, lat: number, lng: number): Date {
		const januaryFirst: Date = new Date(date.getFullYear(), 0, 1);
		const dayOfYear: number = Math.floor(
			(date.getTime() - januaryFirst.getTime()) / 86400000
		);
		const sunsetHour: number = 18 - lat / 10;
		return new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			sunsetHour,
			0,
			0
		);
	}

	private enableAutoTime(): void {
		const checkTime = (): void => {
			const now: Date = new Date();
			const [hours, minutes] = (this.options.auto_time as string)
				.split(':')
				.map(Number);
			const autoTime: Date = new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate(),
				hours,
				minutes
			);

			if (now >= autoTime && !this.isDarkMode()) {
				this.toggle();
			} else if (now < autoTime && this.isDarkMode()) {
				this.toggle();
			}
		};

		checkTime();
		setInterval(checkTime, 60000); // Check every minute
	}

	public isDarkMode(): boolean {
		return document.body.classList.contains('darkmode-active');
	}

	public toggle(): void {
		const isDarkmode: boolean =
			document.body.classList.toggle('darkmode-active');
		this.localStorage.setItem('darkmode', isDarkmode.toString());
		if (this.options.enabled_switch && this.button) {
			this.button.setAttribute(
				'aria-label',
				isDarkmode ? 'Deactivate dark mode' : 'Activate dark mode'
			);
		}
	}

	private applyDarkmodeCss(): void {
		const { body, texts, border, links } =
			this.options.colors[this.options.color_scheme];
		const css: string = `
			:root {
				--darkmode-contrast: 1;
			}
			body.darkmode-active {
				background-color: ${body};
				color: ${texts};
				filter: contrast(var(--darkmode-contrast));
			}
			body.darkmode-active :not(img):not(.darkmode-ignore) {
				border-color: ${border} !important;
			}
			body.darkmode-active a:not(.darkmode-ignore) {
				color: ${links};
			}
			.darkmode-accessibility {
				position: fixed;
				bottom: 20px;
				right: 20px;
				display: flex;
				flex-direction: column;
			}
			.darkmode-accessibility button {
				margin: 5px;
				padding: 5px 10px;
				background-color: #f0f0f0;
				border: 1px solid #ccc;
				border-radius: 4px;
				cursor: pointer;
			}
		`;
		const style: HTMLStyleElement = document.createElement('style');
		style.textContent = css;
		document.head.appendChild(style);
	}
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
