// The steps of search.feature. Each sentence of the feature file is matched to one function here.
// {string} catches a text between double quotes, {int} catches a whole number: they arrive as the function's arguments.
const { When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');

When('I search for {string}', async function (term) {
  await this.home.search(term);
});

Then('the search caption shows {string}', async function (term) {
  const caption = await this.home.searchCaption();
  assert.ok(caption.includes(term), `Expected the caption to show "${term}", it shows "${caption}"`);
});

Then('I see at least {int} products', async function (minimum) {
  const names = await this.home.productNames();
  assert.ok(names.length >= minimum, `Expected at least ${minimum} products, found ${names.length}: ${names.join(', ')}`);
});

Then('every product name contains {string}', async function (term) {
  const names = await this.home.productNames();
  const wrong = names.filter((name) => !name.toLowerCase().includes(term.toLowerCase()));
  assert.deepEqual(wrong, [], `These products do not match "${term}": ${wrong.join(', ')}`);
});

Then('I see the message that no products were found', async function () {
  const message = await this.home.noResultsMessage();
  assert.match(message, /no products found/i);
});

Then('I see no products', async function () {
  const names = await this.home.productNames();
  assert.equal(names.length, 0, `Expected no products, found: ${names.join(', ')}`);
});
