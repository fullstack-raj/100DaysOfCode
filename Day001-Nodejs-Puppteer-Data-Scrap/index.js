const puppeteer = require('puppeteer');
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5501/data.html', {
    waitUntil: 'load'
  });
  await page.screenshot({ path: 'dataScreen.png' });
  const dataHandler = await page.$$(
    "table tr"
  );
  for (const dataItem of dataHandler) { 
    let phonenum  = "Null", cname  = "Null", fname = "Null";  
    try {
      phonenum = await page.evaluate(
        (el) => el.querySelector("td:nth-child(2)").textContent,
        dataItem
      );
    } catch (error) {}

    try {
      cname = await page.evaluate(
        (el) => el.querySelector("td:nth-child(5)").textContent,
        dataItem
      );
    } catch (error) {}
    try {
      fname = await page.evaluate(
        (el) => el.querySelector("td:nth-child(6)").textContent,
        dataItem
      );
    } catch (error) {}
 
    if (phonenum !== "Null") {
      fs.appendFile(
        "results.csv",
        `${phonenum.replace(/,/g, ".")},${cname},${fname}\n`,
        function (err) {
          if (err) throw err;
        }
      );
    }
  }  
  await browser.close();
})();