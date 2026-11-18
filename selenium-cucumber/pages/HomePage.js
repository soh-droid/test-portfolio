// The home page of the Toolshop: the product list, the search box and the sort list.
const { By, Key } = require('selenium-webdriver');
const { Select } = require('selenium-webdriver/lib/select');
const { BasePage, toNumber } = require('./BasePage');

class HomePage extends BasePage {
  async open() {
    await super.open('/');
    await this.waitForProducts();
  }

  // the list is loaded from the shop's API after the page opens: wait until at least one product name shows
  async waitForProducts() {
    await this.waitUntil(async () => (await this.driver.findElements(this.dt('product-name'))).length > 0,
      'No product appeared in the list');
  }

  // type the term and press Enter, as most people do (the button "Search" does the same thing)
  async search(term) {
    await this.type(this.dt('search-query'), term + Key.ENTER);
    // the page writes "Searched for: <term>" and adds a hidden marker when the search is finished
    await this.waitUntil(async () => (await this.isPresent(this.dt('search_completed'))) &&
      (await this.text(this.dt('search-term'))) === term, `The search for "${term}" did not finish`);
  }

  async searchCaption() {
    return this.text(this.dt('search-caption'));
  }

  async noResultsMessage() {
    return this.text(this.dt('no-results'));
  }

  async productNames() {
    return this.texts(this.dt('product-name'));
  }

  async productPrices() {
    return (await this.texts(this.dt('product-price'))).map(toNumber);
  }

  // choose a sort option by its value, for example "price,asc", then wait for the new order
  async sortBy(value) {
    const before = (await this.productNames()).join('|');
    const select = new Select(await this.find(this.dt('sort')));
    await select.selectByValue(value);
    await this.waitUntil(async () => {
      if (!(await this.isPresent(this.dt('sorting_completed')))) return false;
      const names = await this.productNames();
      return names.length > 0 && names.join('|') !== before;
    }, `The list was not sorted by ${value}`);
  }

  // click the card of a product in the list, remember the price shown on the card
  async openProduct(name) {
    const cards = await this.driver.findElements(By.css('a.card'));
    for (const card of cards) {
      const cardName = (await card.findElement(this.dt('product-name')).getText()).trim();
      if (cardName === name) {
        const price = toNumber(await card.findElement(this.dt('product-price')).getText());
        await card.click();
        return price;
      }
    }
    throw new Error(`No product called "${name}" in the list`);
  }
}

module.exports = { HomePage };
