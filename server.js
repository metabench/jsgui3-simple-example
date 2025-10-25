const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const jsgui = require('./client');
const jsgui_server = require('jsgui3-server');
const { Blank_HTML_Document } = require('jsgui3-html');
const {Demo_UI} = jsgui.controls;

const server = http.createServer((req, res) => {
    const parsed = url.parse(req.url);
    if (parsed.pathname === '/') {
        const Server_Page_Context = jsgui_server.Server_Page_Context;
        const server_page_context = new Server_Page_Context({
            'req': req,
            'res': res,
            'resource_pool': {} // minimal
        });

        const hd = new Blank_HTML_Document({ context: server_page_context });

        // Add methods from Client_HTML_Document
        hd.include_js = function(url) {
            const body = this.get('body');
            const script = new (require('jsgui3-html')).script({
                context: this.context
            });
            const dom = script.dom;
            const domAttributes = dom.attributes;
            domAttributes.type = 'text/javascript';
            domAttributes.src = url;
            body.add(script);
        };

        hd.include_css = function(url) {
            const head = this.get('head');
            const link = new (require('jsgui3-html')).link({
                context: this.context
            });
            const dom = link.dom;
            const domAttributes = dom.attributes;
            domAttributes.rel = 'stylesheet';
            domAttributes.type = 'text/css';
            domAttributes.href = url;
            head.content.add(link);
        };

        hd.include_client_css = function() {
            const head = this.get('head');
            const link = new (require('jsgui3-html')).link({
                context: this.context
            });
            const dom = link.dom;
            const domAttributes = dom.attributes;
            domAttributes.rel = 'stylesheet';
            domAttributes.type = 'text/css';
            domAttributes.href = '/css/basic.css';
            head.content.add(link);
        };

        hd.include_client_css();
        hd.include_js('/js/app-bundle.js');

        const body = hd.body;

        const demo_ui = new Demo_UI({
            context: server_page_context
        });
        body.add(demo_ui);

        hd.all_html_render(function(err, deferred_html) {
            if (err) {
                console.error('Render error:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                console.log('Rendered HTML (first 500 chars):', deferred_html.substring(0, 500));
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end('<!DOCTYPE html>' + deferred_html);
            }
        });
    } else if (parsed.pathname === '/css/basic.css') {
        const cssPath = path.join(__dirname, 'node_modules', 'jsgui3-html', 'css', 'basic.css');
        fs.readFile(cssPath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data);
            }
        });
    } else if (parsed.pathname === '/js/app-bundle.js') {
        // Serve the browserified client-side JS bundle
        const fs = require('fs');
        const path = require('path');
        const bundlePath = path.join(__dirname, 'public', 'js', 'app-bundle.js');
        fs.readFile(bundlePath, (err, data) => {
            if (err) {
                console.error('Error reading bundle:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000/');
});
