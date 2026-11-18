// The cart, first step of the checkout page: one line per product, with its quantity, its price and the total.
const { By } = require('selenium-webdriver');
const { BasePage, toNumber } = require('./BasePage');

class CartPage extends BasePage {
  async open() {
    await this.click(this.dt('nav-cart'));
    await this.find(this.dt('cart-total'));
  }

  // find the table row of a product by its title
  async row(name) {
    await this.find(this.dt('product-title'));
    const rows = await this.driver.findElements(By.css('tr'));
    for (const row of rows) {
      const titles = await row.findElements(this.dt('product-title'));
      if (titles.length && (await titles[0].getText()).trim() === name) return row;
    }
    throw new Error(`No line for "${name}" in the cart`);
  }

  async line(name) {
    const row = await this.row(name);
    return {
      quantity: Number(await row.findElement(this.dt('product-quantity')).getAttribute('value')),
      unitPrice: toNumber(await row.findElement(this.dt('product-price')).getText()),
      linePrice: toNumber(await row.findElement(this.dt('line-price')).getText())
    };
  }

  async total() {
    return toNumber(await this.text(this.dt('cart-total')));
  }

  // the red button with a cross at the end of the line has no data-test: we find it inside the row
  async remove(name) {
    const row = await this.row(name);
    await row.findElement(By.css('a.btn-danger')).click();
    await this.waitUntil(async () => !(await this.isPresent(this.dt('product-title'))), 'The line was not removed');
  }

  async emptyMessage() {
    const cart = await this.find(By.css('app-cart'));
    return (await cart.getText()).trim();
  }
}

module.exports = { CartPage };
