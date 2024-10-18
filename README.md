# Darkmode

Darkmode.js is a lightweight, flexible, and user-friendly JavaScript plugin built with TypeScript. It allows you to easily implement a dark mode toggle on your web pages, complete with customizable color schemes and multiple configuration options.

## Features

-   Easy to integrate
-   Customizable color schemes for both dark and light modes
-   OS-aware mode (can detect system preference for dark mode)
-   Configurable toggle switch styles (icon, text, or both)
-   Lightweight and performant
-   Smooth transition between light and dark modes
-   Persistent user preference storage
-   Accessibility features (contrast adjustment)
-   Keyboard shortcut support
-   Auto-switching based on sunset or specific time

## Installation

## Usage

### Basic Usage

To create a new instance of Darkmode with default options:

```javascript
const darkmode = new Darkmode();
darkmode.init();
```

This will add a dark mode toggle button to your page and enable dark mode functionality.

### Custom Options

You can customize the Darkmode behavior by passing an options object:

```javascript
const options = {
	enabled_switch: true,
	os_aware: true,
	color_scheme: 'custom',
	colors: {
		custom: {
			body: '#1a1a1a',
			texts: '#e0e0e0',
			border: '#333333',
			links: '#4da6ff',
		},
	},
	button_type: 'both',
	button_text: 'Switch Mode',
	accessibility_buttons: true,
	auto_sunset: true,
	auto_time: '20:00',
	keyboard_shortcut: true,
};

const darkmode = new Darkmode(options);
darkmode.init();
```

### Options Explained

-   `enabled_switch` (boolean): Enables the dark mode toggle button.
-   `os_aware` (boolean): Automatically switches to dark mode if the OS prefers it.
-   `color_scheme` (string): The name of the color scheme to use.
-   `colors` (object): Custom color schemes. Each scheme should include `body`, `texts`, `border`, and `links` colors.
-   `button_type` (string): Type of toggle button ('icon', 'text', or 'both').
-   `button_text` (string): Text to display on the toggle button if `button_type` is 'text' or 'both'.
-   `accessibility_buttons` (boolean): Adds buttons to increase/decrease contrast.
-   `auto_sunset` (boolean): Automatically switches to dark mode at sunset.
-   `auto_time` (string): Automatically switches to dark mode at a specific time (format: 'HH:MM').
-   `keyboard_shortcut` (boolean): Enables toggling dark mode with Ctrl+Alt+D.

### Methods

-   `init()`: Initializes the Darkmode functionality.
-   `toggle()`: Manually toggles dark mode on/off.
-   `isDarkMode()`: Returns `true` if dark mode is active.

## Examples

### Auto-enable at Sunset

```javascript
const darkmode = new Darkmode({ auto_sunset: true });
darkmode.init();
```

### Custom Color Scheme

```javascript
const darkmode = new Darkmode({
	color_scheme: 'blue',
	colors: {
		blue: {
			body: '#001f3f',
			texts: '#ffffff',
			border: '#003366',
			links: '#7fdbff',
		},
	},
});
darkmode.init();
```

### Accessibility Features

```javascript
const darkmode = new Darkmode({
	accessibility_buttons: true,
	keyboard_shortcut: true,
});
darkmode.init();
```

This setup will add contrast adjustment buttons and enable the Ctrl+Alt+D keyboard shortcut.
