// The steps of contact.feature.
const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');

Given('I am on the contact page', async function () {
  await this.contact.open();
});

When('I send the contact form', async function () {
  await this.contact.send();
});

When('I type {string} as e-mail address', async function (email) {
  await this.contact.typeEmail(email);
});

// a table under the step arrives as a "data table": .raw() gives its rows, here one field name per row
Then('I see a {string} message for each of these fields:', async function (word, table) {
  const fields = table.raw().map((row) => row[0]);
  const missing = [];
  for (const field of fields) {
    const message = await this.contact.errorFor(field);
    if (!message || !message.toLowerCase().includes(word)) missing.push(`${field} (${message || 'no message'})`);
  }
  assert.deepEqual(missing, [], `These fields did not show a "${word}" message: ${missing.join(', ')}`);
});

Then('the e-mail field says the format is invalid', async function () {
  const message = await this.contact.errorFor('email');
  assert.match(message || '', /invalid|valid e-?mail/i, `Unexpected message under the e-mail field: "${message}"`);
});
