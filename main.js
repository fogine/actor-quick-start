// This is the main Node.js source code file of your actor.
// It is referenced from the "scripts" section of the package.json file,
// so that it can be started by running "npm start".

const Apify = require('apify');

const puppeteer = require('puppeteer-extra');
// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

Apify.main(async () => {
    try {
        // Get input of the actor.
        // If you'd like to have your input checked and generate a user interface
        // for it, add INPUT_SCHEMA.json file to your actor.
        // For more information, see https://apify.com/docs/actor/input-schema
        const input = await Apify.getInput();
        console.log('Input:');
        console.dir(input);
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']} );
        const page = await browser.newPage();
        await page.goto('https://www.semrush.com/login/?src=header&redirect_to=%2F%3Fl%3Den%261603532792');
        //const bodyHandle = await page.$('body');
        //const html = await page.evaluate(body => body.innerHTML, bodyHandle);
        //console.log(html);

        // Login
        await page.type('input[type=\"email\"]', input.username);
        await page.type('input[type=\"password\"]', input.password);
        await page.click('button[data-ga-label=\"login\"]');
        //await page.screenshot({path: '/tmp/semrush.png'});
        console.log('logging in');
        await page.waitForNavigation();

        // Get cookies
        const cookies = await page.cookies();

        // Use cookies in other tab or browser
        //const page2 = await browser.newPage();
        //await page2.setCookie(...cookies);
        //await page2.goto('https://facebook.com'); // Opens page as logged user

        await browser.close();

        // Save output
        const output = {
            cookies: cookies
        };
        console.log('Output:');
        console.dir(output);
        console.log('Done.');
        await Apify.setValue('OUTPUT', output);
    } catch(e) {
        console.error(e);
    }
});
