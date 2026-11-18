# Test portfolio: Toolshop

Automated acceptance tests for **Toolshop**, the public practice web shop of
[practicesoftwaretesting.com](https://practicesoftwaretesting.com), written as **Cucumber** scenarios (Gherkin)
and run in Chrome with **Selenium WebDriver**.

This is a personal learning project. I come from IT support (incident and request handling, tickets, knowledge base
articles), and I am moving into software testing.

[![Selenium + Cucumber tests](https://github.com/soh-droid/test-portfolio/actions/workflows/selenium-cucumber.yml/badge.svg)](https://github.com/soh-droid/test-portfolio/actions/workflows/selenium-cucumber.yml)

## What is tested

| Feature | Scenarios | What they check |
|---|---|---|
| [Search](selenium-cucumber/features/search.feature) | 3 | a search shows only matching products; a search with no match says so clearly |
| [Sort](selenium-cucumber/features/sort.feature) | 2 | price low to high and name A to Z really come out in that order |
| [Cart](selenium-cucumber/features/cart.feature) | 3 | the product page agrees with the list; 2 items give 2 x the unit price and the right total; removing the only product empties the cart |

8 scenarios, 52 steps, about 15 seconds in headless Chrome.

## The same tests find real bugs

Toolshop also exists in a **version with planted bugs** (`with-bugs.practicesoftwaretesting.com`). Run against it
(`npm run test:with-bugs`), the cart scenarios fail exactly where the authors of the shop documented bugs in
[their list](https://github.com/testsmith-io/practice-software-testing/blob/main/docs/sprints/sprint5-with-bugs.md):

| Failing scenario | What the test saw | Documented bug |
|---|---|---|
| Adding two items ... | the quantity box stays at 1 after pressing + | #40: plus / minus buttons do not change quantity |
| Removing the only product ... | the line stays in the cart after pressing delete | #7: delete button is disabled |

A test that can never fail proves nothing; these two show that the checks are real.

## How it is built

```
selenium-cucumber/
  features/                 the scenarios, in plain English (Gherkin): what the shop must do
    step_definitions/       the code behind each sentence of the scenarios
    support/world.js        starts Chrome for each scenario and gives every step access to it
    support/hooks.js        opens and closes the browser, adds a screenshot to the report when a scenario fails
  pages/                    Page Object Model: one class per page of the shop (home, product, cart)
  cucumber.js               where the scenarios are and which reports to write
ci/toolshop.override.yml    two changes to Toolshop's Docker setup so it runs on GitHub's machines
.github/workflows/          the GitHub Actions workflow
```

Choices worth knowing:

- **Locators on `data-test` attributes** that the shop provides for testing, never on texts or layout, so the
  tests do not break when the design or the language changes.
- **Explicit waits, no fixed pauses**: every step waits for a precise condition (the search marker, the cart badge,
  the new sort order), up to 15 seconds.
- **Page Object Model**: the steps say *what* happens (`this.home.search(term)`), the page classes know *how*
  (which field, which button). When the shop changes a screen, one class changes, not every test.
- **Money compared in cents**, so 14.15 x 2 is exactly 28.30.
- **Readable failures**: each assertion says what it expected and what it found; the HTML report holds a screenshot
  of every failed scenario.

## Run it

Requirements: Node.js 22 or 24 and Google Chrome. Selenium Manager downloads the matching chromedriver.

```bash
cd selenium-cucumber
npm ci
npm test                 # all scenarios, headless
npm run test:headed      # watch Chrome do it
npm run test:smoke       # only the scenarios tagged @smoke
npm run test:with-bugs   # the same scenarios against the version with planted bugs
```

The report is written to `selenium-cucumber/reports/cucumber-report.html`.

## Continuous integration

[GitHub Actions](.github/workflows/selenium-cucumber.yml) runs the scenarios on every push and pull request
(Ubuntu, Node.js 24, headless Chrome) and keeps the HTML report as a downloadable artifact for 14 days.

The public demo site protects itself against bots, and it blocks traffic from cloud servers such as GitHub's. So the
workflow does not test the public site: it **starts its own copy of Toolshop with Docker** on the runner, from the
project's official compose file and images, fills the database with the demo data, waits until the API and the shop
answer, then runs the scenarios against `http://localhost:4200`. Two of the official images do not start on GitHub's
machines ("exec format error", built for another processor); [ci/toolshop.override.yml](ci/toolshop.override.yml)
replaces the web server with the official nginx image and the project's own settings, and leaves out the cron service.
A full run takes about 8 minutes, most of it starting the shop.

## Tools

Cucumber 13 (JavaScript), Selenium WebDriver 4, Node.js, Chrome, GitHub Actions.
