Feature: Sort the product list
  As a customer of the Toolshop
  I want to sort the products
  So that I can compare them by price or find them by name

  Background:
    Given I am on the Toolshop home page

  Scenario: Sorting by price from low to high puts the cheapest product first
    When I sort the products by "price,asc"
    Then the product prices are in ascending order

  Scenario: Sorting by name from A to Z puts the names in alphabetical order
    When I sort the products by "name,asc"
    Then the product names are in alphabetical order
