const pptr = require('puppeteer');
const request_client = require('request-promise-native');


(async() => {
  const browser = await pptr.launch();
  const page = await browser.newPage();
  const urls = [];
  const result = [];
  await page.setRequestInterception(true);
  /*
  page.on('request', request => {
    urls.push(request.url());
    console.log(request.url())
    request.continue();
  });
  */

  page.on('request', request => {
    request_client({
      uri: request.url(),
      resolveWithFullResponse: true,
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

  await page.goto('https://textnow.com/login', {waitUntil: 'networkidle2'});
// Trying to intercept requests
  await page.goto("https://textnow.com/login")

  await page.type('input[name=username]', 'etanyacatori@gmail.com', {delay: 5})
  await page.type('input[name=password]', 'enaxup12', {delay: 5})

  await page.waitFor(1000);
  //await page.keyboard.press('Enter');

  await page.click('[id="btn-login"]');

  //await page.evaluate( () => document.getElementById("txt-password").value = "enaxup12")

  await page.waitFor(5000)
  await browser.close();
})();
