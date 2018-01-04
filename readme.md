# Progressive Clock App

This simple clock app provides a local weather forecast for the next night or day, and is a great example of a progressive web app. It will appear as a native app in iOS when loaded at https://www.kevinleary.net/clock/, and can be saved as a shortcut with a custom icon.

## Get Started

This project uses `npm` for package management. To get started clone this repo to your system and then run `npm install` to install all dependencies.

## Build

A minimal build is handled by Gulp and will perform the following tasks:

* Compile a Nunjucks template (`index.njk`) to HTML (`index.html`), auto-versioning CSS and JS files in the process
* Concatenate and compress JS, respecting `=include` rules from `gulp-include`
* Compile SASS to CSS, with auto-prefixing support back to IE9
* Provide some helpful debugging tools

The following Gulp commands are available to do this:

1. `gulp` - Runs a watch/build process for development
2. `gulp build` - Builds everything, could be run on deployment to a server
3. `gulp js-debug` - Reports any JS errors with details for fast debugging and linting

## Localhost

I've packaged a copy of `http-server` with this project to provide a localhost HTTP server for easy testing. To run the localhost use the following command:

`npm run localhost`

A browser will open with `http://127.0.0.1:8081` or similar, the port may vary.
