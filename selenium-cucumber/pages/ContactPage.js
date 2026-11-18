// The contact page: a form with first name, last name, e-mail, subject, message and an attachment.
// Each field has a message under it (data-test="<field>-error") that appears when the input is wrong.
const { BasePage } = require('./BasePage');

class ContactPage extends BasePage {
  async open() {
    await super.open('/contact');
    await this.find(this.dt('contact-submit'));
  }

  async typeEmail(email) {
    await this.type(this.dt('email'), email);
  }

  async send() {
    await this.click(this.dt('contact-submit'));
  }

  // the text under a field, or null when there is none
  async errorFor(field) {
    const locator = this.dt(`${field}-error`);
    try {
      await this.waitUntil(async () => this.isPresent(locator), `No message under ${field}`, 5000);
    } catch (e) {
      return null;
    }
    return this.text(locator);
  }
}

module.exports = { ContactPage };
