# DarkMode Plugin

DarkMode is a simple and feature-rich dark mode plugin for your website. It allows you to easily implement a dark mode toggle on your web pages, with customizable color schemes and options.

## Features

-   Easy to integrate
-   Customizable color schemes for dark and light modes
-   OS-aware mode (can detect system preference for dark mode)
-   Configurable toggle switch styles
-   Lightweight and performant

## Installation

You can install the DarkMode plugin using npm: `bash npm install @cogniolabs/darkmode`

## Usage

```bash
import Nightly from 'nightly-darkmode';

const options = {
  enabled_switch: true,
  os_aware: '1',
  color_scheme: 'dark',
  colors: {
    dark: {
      body: '#1e1e1e',
      texts: '#ffffff',
      border: '#444444',
      links: '#ffffff',
    },
    light: {
      body: '#ffffff',
      texts: '#000000',
      border: '#cccccc',
      links: '#0000ff',
    },
  },
  switch_style: 'default-style',
};

const nightly = new Nightly(options);
nightly.init();
```
