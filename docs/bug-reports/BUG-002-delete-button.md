# BUG-002: A product cannot be removed from the cart

| Field | Value |
|---|---|
| Status | Open (reproduced) |
| Severity | Major: a customer cannot correct the cart and has to pay for an item they do not want, or leave |
| Priority | High (suggested; set by the product owner) |
| Environment | Toolshop v5.0 "with bugs", https://with-bugs.practicesoftwaretesting.com, Chrome 157 on Windows 11 |
| Found by | automated scenario `@BUG-002` in [cart.feature](../../selenium-cucumber/features/cart.feature) |
| Date | 18 November 2026 |
| Reference | listed by the authors of Toolshop as bug 7, "Delete button is disabled" |

## Steps to reproduce
1. Open the product "Combination Pliers" and press "Add to cart".
2. Open the cart (cart icon in the menu).
3. Press the red delete button (x) at the end of the "Combination Pliers" line.

## Expected result
The line disappears and the cart shows "The cart is empty. Nothing to display."

## Actual result
Nothing happens: the line stays in the cart.

## Evidence
- Scenario "Removing the only product empties the cart": `TimeoutError: The line was not removed` after 15 seconds.
- Screenshot of the cart in the HTML report of the run.

## Notes
- The same scenario passes on the normal version, so the test is not the cause.
- Regression test: the `@BUG-002` scenario stays in the `@regression` suite.
