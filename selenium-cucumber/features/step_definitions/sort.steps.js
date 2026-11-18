// The steps of sort.feature.
const { When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');

When('I sort the products by {string}', async function (value) {
  await this.home.sortBy(value);
});

Then('the product prices are in ascending order', async function () {
  const prices = await this.home.productPrices();
  const sorted = [...prices].sort((a, b) => a - b);          // a copy of the list, sorted by the test itself
  assert.deepEqual(prices, sorted, `Prices are not in ascending order: ${prices.join(', ')}`);
});

Then('the product names are in alphabetical order', async function () {
  const names = await this.home.productNames();
  const sorted = [...names].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
  assert.deepEqual(names, sorted, `Names are not in alphabetical order: ${names.join(', ')}`);
});
