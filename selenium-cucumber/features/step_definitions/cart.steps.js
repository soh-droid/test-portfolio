// The steps of cart.feature.
const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');

// money is compared in cents, so that 14.15 x 2 is exactly 28.30 and not 28.299999999999997
const cents = (amount) => Math.round(amount * 100);

// One definition serves both "Given I open ..." and "When I open ...": Cucumber matches the sentence, not the keyword.
Given('I open the product {string} from the list', async function (name) {
  this.remembered.listPrice = await this.home.openProduct(name);
});

Given('I have added {int} {string} to the cart', async function (quantity, name) {
  await this.home.openProduct(name);
  await this.product.addToCart(quantity);
  await this.cart.open();
});

When('I add {int} items to the cart', async function (quantity) {
  this.remembered.unitPrice = await this.product.unitPrice();
  await this.product.addToCart(quantity);
});

When('I raise the quantity to {int} and lower it by {int}', async function (target, down) {
  await this.product.changeQuantity(target - 1, down);       // the box starts at 1
});

When('I add the chosen quantity to the cart', async function () {
  await this.product.addChosenQuantity();
});

Then('the product page shows the name {string}', async function (name) {
  assert.equal(await this.product.name(), name);
});

Then('the product page shows the same price as the list', async function () {
  const pagePrice = await this.product.unitPrice();
  assert.equal(cents(pagePrice), cents(this.remembered.listPrice),
    `The list showed ${this.remembered.listPrice}, the product page shows ${pagePrice}`);
});

Then('the cart badge shows {int}', async function (quantity) {
  assert.equal(await this.product.cartBadge(), String(quantity));
});

Then('the cart shows a line for {string} with quantity {int}', async function (name, quantity) {
  await this.cart.open();
  this.remembered.line = await this.cart.line(name);
  assert.equal(this.remembered.line.quantity, quantity);
});

Then('the line price is {int} times the unit price', async function (times) {
  const { unitPrice, linePrice } = this.remembered.line;
  assert.equal(cents(linePrice), cents(unitPrice) * times,
    `Unit price ${unitPrice} x ${times} should be ${(cents(unitPrice) * times) / 100}, the cart shows ${linePrice}`);
});

Then('the cart total equals the line price', async function () {
  assert.equal(cents(await this.cart.total()), cents(this.remembered.line.linePrice));
});

When('I remove {string} from the cart', async function (name) {
  await this.cart.remove(name);
});

Then('I see the message that the cart is empty', async function () {
  assert.match(await this.cart.emptyMessage(), /cart is empty/i);
});

Then('the cart badge is not shown', async function () {
  assert.equal(await this.cart.isPresent(this.cart.dt('cart-quantity')), false);
});
