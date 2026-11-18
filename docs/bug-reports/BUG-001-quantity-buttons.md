# BUG-001: The + and - buttons on the product page do not change the quantity

| Field | Value |
|---|---|
| Status | Open (reproduced) |
| Severity | Major: a customer cannot order more than one item from the product page |
| Priority | High (suggested; set by the product owner) |
| Environment | Toolshop v5.0 "with bugs", https://with-bugs.practicesoftwaretesting.com, Chrome 157 on Windows 11 and headless Chrome on Ubuntu |
| Found by | automated scenarios `@BUG-001` in [cart.feature](../../selenium-cucumber/features/cart.feature) |
| Date | 18 November 2026 |
| Reference | listed by the authors of Toolshop as bug 40, "Plus / minus buttons do not change quantity" |

## Steps to reproduce
1. Open the home page.
2. Open the product "Combination Pliers".
3. Press the **+** button next to the quantity box twice.

## Expected result
The quantity box shows 3. Pressing **-** once then shows 2.

## Actual result
The quantity box stays at 1 whatever button is pressed. "Add to cart" then adds 1 item.

## Evidence
- Scenario "Adding two items puts two items in the cart and doubles the line price":
  `TimeoutError: The quantity box did not reach 2` after 15 seconds.
- Scenario "The minus button lowers the quantity before adding to the cart":
  `TimeoutError: The quantity box should show 2 after 2 x + and 1 x -`.
- The HTML report of the run holds a screenshot of the product page at the moment of failure.

## Notes
- The same scenarios pass on the normal version (https://practicesoftwaretesting.com), so the test is not the cause.
- Regression test: the two `@BUG-001` scenarios stay in the `@regression` suite, so the bug is caught again if it comes back.
