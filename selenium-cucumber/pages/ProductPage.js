// The page of one product: its name, its price, the quantity box and the "Add to cart" button.
const { BasePage, toNumber } = require('./BasePage');

class ProductPage extends BasePage {
  async name() {
    return this.text(this.dt('product-name'));
  }

  async unitPrice() {
    return toNumber(await this.text(this.dt('unit-price')));
  }

  // set the quantity with the + button (as a customer would), then add to the cart
  async addToCart(quantity) {
    await this.find(this.dt('add-to-cart'));
    for (let i = 1; i < quantity; i++) await this.click(this.dt('increase-quantity'));
    await this.waitUntil(async () => (await (await this.find(this.dt('quantity'))).getAttribute('value')) === String(quantity),
      `The quantity box did not reach ${quantity}`);
    await this.click(this.dt('add-to-cart'));
    // the badge on the cart icon in the menu shows the number of items once the shop has saved the cart
    await this.waitUntil(async () => (await this.isPresent(this.dt('cart-quantity'))) &&
      (await this.text(this.dt('cart-quantity'))) === String(quantity), 'The cart badge did not update');
  }

  async cartBadge() {
    return this.text(this.dt('cart-quantity'));
  }
}

module.exports = { ProductPage };
