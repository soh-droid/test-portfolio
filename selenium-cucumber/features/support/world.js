// The "World" is the object Cucumber creates fresh for every scenario. Every step can reach it as `this`.
// Here it holds the browser (the Selenium driver), the page objects and what a step wants to remember for a later step.
const { setWorldConstructor, World, setDefaultTimeout } = require('@cucumber/cucumber');
const { Builder, Browser } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { HomePage } = require('../../pages/HomePage');
const { ProductPage } = require('../../pages/ProductPage');
const { CartPage } = require('../../pages/CartPage');

// A step may take up to 60 seconds (the shop is a public demo on the internet, it is sometimes slow).
setDefaultTimeout(60 * 1000);

class ToolshopWorld extends World {
  constructor(options) {
    super(options);
    this.baseUrl = process.env.BASE_URL || 'https://practicesoftwaretesting.com';
    this.remembered = {};   // values one step saves for a later step (for example the price seen in the list)
  }

  async openBrowser() {
    const options = new chrome.Options();
    if (process.env.HEADLESS !== 'false') options.addArguments('--headless=new');   // no window: needed on GitHub Actions
    options.addArguments('--window-size=1366,900', '--lang=en-US');
    options.setUserPreferences({ 'intl.accept_languages': 'en-US,en' });           // the shop follows the browser language
    // Selenium Manager (built into Selenium 4) finds or downloads the right chromedriver by itself.
    this.driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
    this.home = new HomePage(this.driver, this.baseUrl);
    this.product = new ProductPage(this.driver, this.baseUrl);
    this.cart = new CartPage(this.driver, this.baseUrl);
  }

  async closeBrowser() {
    if (this.driver) await this.driver.quit();
  }
}

setWorldConstructor(ToolshopWorld);
