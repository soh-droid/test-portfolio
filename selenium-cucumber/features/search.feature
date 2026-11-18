Feature: Search products
  As a customer of the Toolshop
  I want to search the catalogue by name
  So that I find the tool I need without browsing every page

  Background:
    Given I am on the Toolshop home page

  @smoke @regression
  Scenario Outline: A search shows only products that match the search term
    When I search for "<term>"
    Then the search caption shows "<term>"
    And I see at least <minimum> products
    And every product name contains "<term>"

    Examples:
      | term   | minimum |
      | pliers | 3       |
      | hammer | 3       |

  @regression
  Scenario: A search with no match tells the customer clearly
    When I search for "zzqx"
    Then I see the message that no products were found
    And I see no products
