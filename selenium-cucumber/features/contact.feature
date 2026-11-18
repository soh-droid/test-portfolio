Feature: Contact form checks what the customer typed
  As the support team of the Toolshop
  I want the contact form to refuse incomplete or wrong input
  So that every request we receive can be answered

  # Negative tests: the form is never complete, so nothing is ever sent.

  Background:
    Given I am on the contact page

  @regression
  Scenario: Sending an empty form shows a required message under every mandatory field
    When I send the contact form
    Then I see a "required" message for each of these fields:
      | first-name |
      | last-name  |
      | email      |
      | subject    |
      | message    |

  @regression
  Scenario Outline: An e-mail address without the right shape is refused
    When I type "<email>" as e-mail address
    And I send the contact form
    Then the e-mail field says the format is invalid

    Examples:
      | email           |
      | not-an-email    |
      | mia@            |
      | mia.slyce.test  |
