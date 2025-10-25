# Copilot Instructions for jsgui3-simple-example

## Overview
This is a minimal example project demonstrating jsgui3, a JavaScript UI framework for server-client web apps. It showcases rendering UI controls on the server and activating them on the client.

## Architecture
- **Server (`server.js`)**: Node.js HTTP server using `jsgui3-server` to render HTML documents with controls like `Demo_UI`.
- **Client (`client.js`)**: Defines client-side controls (e.g., `Demo_UI` extending `Control`), bundled via Browserify into `public/js/app-bundle.js`.
- **Data Flow**: Server renders initial HTML with controls; client-side JS activates interactivity. Static assets (CSS from `jsgui3-html`, JS bundle) served directly.
- **Why**: Illustrates jsgui3's isomorphic approach—controls work on both server (for SSR) and client (for interactivity).

## Key Workflows
- **Build Client Bundle**: Run `npm run build` to browserify `client.js` into `public/js/app-bundle.js`.
- **Start Server**: Use `npm start` to launch on `http://localhost:3000`.
- **Screenshot**: Execute `node screenshot.js` (note: hardcoded to port 52000; adjust for 3000 if needed) using Puppeteer for visual testing.
- **No Tests**: Project lacks automated tests; verify manually by running server and checking UI.

## Project Conventions
- **Control Definition**: Extend `Control` from `jsgui3-client`, set `__type_name` (e.g., `'demo_ui'`), and add to `controls` object.
- **CSS in JS**: Define styles as `ClassName.css = \`` string within control classes.
- **Server Rendering**: Use `Server_Page_Context` and `Blank_HTML_Document` to build pages; include JS/CSS via custom methods like `hd.include_js()`.
- **Dependencies**: Relies on `jsgui3-server`, `jsgui3-client`, `jsgui3-html`; CSS served from `node_modules/jsgui3-html/css/basic.css`.
- **File Structure**: Keep client logic in `client.js`, server in `server.js`; bundle output in `public/js/`.

## Examples
- Add a new control: In `client.js`, create `class MyControl extends Control { ... }`, set `controls.MyControl = MyControl`.
- Server integration: In `server.js`, instantiate `new MyControl({ context: server_page_context })` and add to document body.
- Avoid mixing server/client code; use separate files for clarity.