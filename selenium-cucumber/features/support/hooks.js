// Hooks run around every scenario: open a fresh browser before, and close it after.
// When a scenario fails, a screenshot is attached to the HTML report, so the failure can be seen, not only read.
const { Before, After, Status } = require('@cucumber/cucumber');

Before(async function () {
  await this.openBrowser();
});

After(async function (scenario) {
  if (scenario.result.status === Status.FAILED && this.driver) {
    const png = await this.driver.takeScreenshot();               // a base64 text of the picture
    this.attach(Buffer.from(png, 'base64'), 'image/png');
  }
  await this.closeBrowser();
});
