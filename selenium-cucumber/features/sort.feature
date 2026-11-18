Feature: Sort the product list
  As a customer of the Toolshop
  I want to sort the products
  So that I can compare them by price or find them by name

  Background:
    Given I am on the Toolshop home page

  @regression
  Scenario Outline: Each sort option puts the list in the order it promises
    When I sort the products by "<option>"
    Then the products are sorted by <field> in <direction> order

    Examples:
      | option     | field | direction  |
      | price,asc  | price | ascending  |
      | price,desc | price | descending |
      | name,asc   | name  | ascending  |
      | name,desc  | name  | descending |
