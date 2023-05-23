const puppeteer = require('puppeteer');

var fs = require('fs');

async function scrape(command) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--start-maximized'
        ]
    })
    const page = await browser.newPage()
    //await page.setViewport({ width: 1280, height: 577 })
    await page.goto(`https://www.${command}`);

    /*
    await page.waitForSelector('.cookie-consent > #cookie-banner > .cookie-buttons > .text-btn:nth-child(1) > span')
    await page.click('.cookie-consent > #cookie-banner > .cookie-buttons > .text-btn:nth-child(1) > span')


    await page.waitForSelector('.header-item > .quick-search > .dropdown > .input-group > .form-control')
    await page.click('.header-item > .quick-search > .dropdown > .input-group > .form-control')


    const serach = '.header-item > .quick-search > .dropdown > .input-group > .form-control'
    await page.type(serach, 'grafikkort');
    await page.keyboard.type(String.fromCharCode(13));
    
    await page.waitForTimeout(1000);
    */

    const d = new Date();
    let time = d.getTime();

    await page.screenshot({
        path: `./screenshots/screenshot_webhallen_${time.toString()}.jpg`
    });

    fs.readFile('./screenshot_list.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data);
            obj.screenshots.push(`screenshot_webhallen_${time.toString()}.jpg`);
            fs.writeFile('./screenshot_list.json', JSON.stringify(obj), 'utf8', function (err, result) {
                if (err) console.log('error', err);
            });
        }
    });

    await browser.close()
}

module.exports = { scrape };
