const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:52000/');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for JS to load
    await page.screenshot({ path: 'screenshot.png', fullPage: true });
    console.log('Screenshot taken: screenshot.png');
    await browser.close();
})();