// Steps used by several features.
const { Given } = require('@cucumber/cucumber');

Given('I am on the Toolshop home page', async function () {
  await this.home.open();
});
