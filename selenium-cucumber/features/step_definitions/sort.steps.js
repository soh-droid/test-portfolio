// The steps of sort.feature.
const { When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');

When('I sort the products by {string}', async function (option) {
  await this.home.sortBy(option);
});

// {word} catches one word without quotes: "price" or "name", "ascending" or "descending"
Then('the products are sorted by {word} in {word} order', async function (field, direction) {
  const values = field === 'price' ? await this.home.productPrices() : await this.home.productNames();
  const compare = field === 'price'
    ? (a, b) => a - b
    : (a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' });
  const expected = [...values].sort(compare);              // a copy of the list, sorted by the test itself
  if (direction === 'descending') expected.reverse();
  assert.deepEqual(values, expected, `The ${field}s are not in ${direction} order: ${values.join(', ')}`);
});
