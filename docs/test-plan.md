# Test plan: Toolshop web shop (automated acceptance tests)

## Scope
What a customer does before paying, on the web shop of Toolshop v5.0:
- **Search** by product name, including a search with no result.
- **Sort** the product list: price and name, both directions.
- **Product page**: name and price agree with the product list.
- **Cart**: quantity buttons, adding items, line price and total, removing a product.
- **Contact form**: what the form refuses (empty mandatory fields, badly formed e-mail addresses).

Out of scope for now: sign-in and accounts, checkout and payment, the admin pages, the API on its own,
performance, accessibility, other browsers than Chrome.

## Approach
- **Behaviour-driven:** every test is a Cucumber scenario in plain English (Given / When / Then), readable by
  someone who does not code. Selenium WebDriver plays the scenario in Chrome.
- **Test design:**
  - equivalence partitions for the search terms (a term with results, a term with no result);
  - one example per sort option (data-driven with Scenario Outline);
  - negative tests on the contact form: each mandatory field left empty, three badly formed e-mail addresses;
  - arithmetic checks on the cart (line price = quantity x unit price, total = sum of lines), compared in cents.
- **Every reported bug gets a scenario** tagged with its ticket number (`@BUG-001`), kept in the regression suite.

## Suites (tags)
| Tag | Content | When |
|---|---|---|
| `@smoke` | the most important paths: search, product page, add to cart | quick check after every change |
| `@regression` | all scenarios that protect existing behaviour | before every release |
| `@BUG-nnn` | the scenarios that reproduce a reported bug | to confirm a fix (confirmation testing) |

## Environments
| Environment | Address | Use |
|---|---|---|
| Public demo | https://practicesoftwaretesting.com | local runs |
| Local copy in Docker | http://localhost:4200 | GitHub Actions on every push and pull request |
| Version with planted bugs | https://with-bugs.practicesoftwaretesting.com | showing that the scenarios catch real bugs |

## Entry and exit criteria
- **Entry:** the shop answers and shows its product list.
- **Exit for a release:** every `@regression` scenario passes; every failure has a bug report in
  [docs/bug-reports](bug-reports) with steps, expected and actual result, environment and evidence.

## Results on 18 November 2026
| Environment | Scenarios | Passed | Failed |
|---|---|---|---|
| Public demo | 15 | 15 | 0 |
| Local copy in Docker (GitHub Actions) | 15 | 15 | 0 |
| Version with planted bugs | 15 | 7 | 8 |

(15 scenarios: the Scenario Outlines count once per example row.)

On the version with planted bugs, three cart scenarios fail on two real bugs:
[BUG-001](bug-reports/BUG-001-quantity-buttons.md) and [BUG-002](bug-reports/BUG-002-delete-button.md).
The four contact scenarios fail there because that version uses different page addresses (`/#/contact` instead of
`/contact`), which the contact page object does not support yet. The "no match" search failure there has not been
investigated yet. Neither is reported as a bug.
