let puppeteer = require("puppeteer");
let cFile = process.argv[2];
let pUrl = process.argv[3];

let fs = require("fs");
(async function () {
  let data = await fs.promises.readFile(cFile);
  let { url, pwd, user,msg } = JSON.parse(data);
  let browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized", "--disable-notifications"]
  });
  let tabs = await browser.pages();
  let tab = tabs[0];

  await tab.goto(url, { waitUntil: "networkidle2" });
  await tab.waitForSelector("input[type=email]");
  await tab.type("input[type=email]", user, { delay: 100 });
  await tab.type("input[type=password]", pwd, { delay: 100 });
  await Promise.all([
    tab.click(".login_form_login_button"), tab.waitForNavigation({
      waitUntil: "networkidle2"
    })]);

  console.log("Login Successfully..");

  await tab.goto(pUrl, { waitUntil: "networkidle2" });
    await tab.waitForSelector("textarea.enter_submit.uiTextareaNoResize.uiTextareaAutogrow.uiStreamInlineTextarea.inlineReplyTextArea.mentionsTextarea.textInput")
    let elements= await tab.$$("textarea.enter_submit.uiTextareaNoResize.uiTextareaAutogrow.uiStreamInlineTextarea.inlineReplyTextArea.mentionsTextarea.textInput")
  let cnt = 0;
  for (let el = 0; el < elements.length; el++) {
    let wish = elements[cnt];
 await wish.type(msg);
 tab.keyboard.down('Enter');
    await tab.waitFor(5000)
    console.log("Birthday Wish posted for friend");
    cnt += 1;
  }
  await browser.close();

})();