// What every page object shares: finding elements by their data-test attribute and waiting for them.
// The shop's developers put a data-test="..." attribute on the elements tests need. Tests that use it
// do not break when the design, the text or the language of the page changes.
const { By, until } = require('selenium-webdriver');

const WAIT = 15 * 1000;   // how long to wait for an element before failing (15 seconds)

class BasePage {
  constructor(driver, baseUrl) {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  // a CSS selector for one data-test value: dt('search-query') -> [data-test="search-query"]
  dt(name) {
    return By.css(`[data-test="${name}"]`);
  }

  async open(path = '/') {
    await this.driver.get(this.baseUrl + path);
  }

  // wait until the element is in the page AND visible, then return it
  async find(locator) {
    const element = await this.driver.wait(until.elementLocated(locator), WAIT);
    await this.driver.wait(until.elementIsVisible(element), WAIT);
    return element;
  }

  // Click like a person would: bring the element to the middle of the window first. If something lies on top of it
  // (a pop-up message, a floating chat button), Selenium refuses the click with ElementClickInterceptedError:
  // then wait for the pop-up messages to go away and try again, up to three times.
  async click(locator) {
    for (let attempt = 1; ; attempt++) {
      const element = await this.find(locator);
      await this.driver.executeScript('arguments[0].scrollIntoView({ block: "center" });', element);
      try {
        await element.click();
        return;
      } catch (error) {
        if (error.name !== 'ElementClickInterceptedError' || attempt === 3) throw error;
        await this.waitForToastsToClose();
      }
    }
  }

  // the shop shows short messages ("Product added to shopping cart") in the top corner; they close by themselves
  async waitForToastsToClose() {
    await this.waitUntil(async () => {
      const toasts = await this.driver.findElements(By.css('.toast'));
      for (const toast of toasts) if (await toast.isDisplayed()) return false;
      return true;
    }, 'A message stayed on top of the page');
  }

  async type(locator, text) {
    const element = await this.find(locator);
    await element.clear();
    await element.sendKeys(text);
  }

  async text(locator) {
    const element = await this.find(locator);
    return (await element.getText()).trim();
  }

  // the visible texts of all elements that match, for example every product name of a list
  async texts(locator) {
    const elements = await this.driver.findElements(locator);
    return Promise.all(elements.map(async (e) => (await e.getText()).trim()));
  }

  async isPresent(locator) {
    return (await this.driver.findElements(locator)).length > 0;
  }

  // wait until a condition written as a function becomes true (polls every half second)
  async waitUntil(condition, message, timeout = WAIT) {
    await this.driver.wait(async () => {
      try { return await condition(); } catch (e) { return false; }
    }, timeout, message);
  }
}

// "$14.15" -> 14.15
function toNumber(price) {
  return Number(String(price).replace(/[^0-9.]/g, ''));
}

module.exports = { BasePage, toNumber, WAIT };
