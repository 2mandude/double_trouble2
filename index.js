// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra")
const request_client = require('request-promise-native');

// add stealth plugin and use defaults (all evasion techniques)
const pluginStealth = require("puppeteer-extra-plugin-stealth")
puppeteer.use(pluginStealth())

// puppeteer usage as normal
puppeteer.launch({ headless: false }).then(async browser => {
  const page = await browser.newPage()
  await page.setViewport({ width: 800, height: 600 })
  const result = [];

  await page.setRequestInterception(true);

  page.on('request', request => {
    request_client({
      uri: request.url(),
      resolveWithFullResponse: false,
    }).then(response => {
      const request_url = request.url();
      const request_headers = request.headers();
      const request_post_data = request.postData();
      const response_headers = response.headers;
      const response_size = response_headers['content-length'];
      const response_body = response.body;

      result.push({
        request_url,
        request_headers,
        request_post_data,
        response_headers,
        response_size,
        response_body,
      });

      console.log(result);
      request.continue();
    }).catch(error => {
      //console.error(error);
      request.abort();
    });
  });

  // Trying to intercept requests
  await page.goto("https://textnow.com/login")

  await page.type('input[name=username]', 'etanyacatori@gmail.com', {delay: 5})
  await page.type('input[name=password]', 'enaxup12', {delay: 5})

  await page.waitFor(1000);
  //await page.keyboard.press('Enter');

  await page.click('[id="btn-login"]');

  //await page.evaluate( () => document.getElementById("txt-password").value = "enaxup12")

  await page.waitFor(5000)

  console.log("COOKIES!");
  console.log(urls.length);
  await page.waitFor(100000)
  //await page.screenshot({ path: "testresult.png", fullPage: true })
  await browser.close()
});
