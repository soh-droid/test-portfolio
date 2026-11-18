Feature: Shopping cart
  As a customer of the Toolshop
  I want to put products in my cart and change my mind
  So that I pay the right amount for what I really want

  Background:
    Given I am on the Toolshop home page

  @smoke
  Scenario: The product page shows the same name and price as the product list
    When I open the product "Combination Pliers" from the list
    Then the product page shows the name "Combination Pliers"
    And the product page shows the same price as the list

  @smoke
  Scenario: Adding two items puts two items in the cart and doubles the line price
    Given I open the product "Combination Pliers" from the list
    When I add 2 items to the cart
    Then the cart badge shows 2
    And the cart shows a line for "Combination Pliers" with quantity 2
    And the line price is 2 times the unit price
    And the cart total equals the line price

  Scenario: Removing the only product empties the cart
    Given I have added 1 "Combination Pliers" to the cart
    When I remove "Combination Pliers" from the cart
    Then I see the message that the cart is empty
    And the cart badge is not shown
