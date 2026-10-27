# Smart Career Guidance System — Backend

## 1. Overview

The backend of the Smart Career Guidance System is built using Spring Boot. It provides REST APIs that support user management, authentication, and role management for the application.

This directory contains the backend implementation and its related testing documentation.

## 2. Technology Stack

* **Language:** Java
* **Framework:** Spring Boot
* **Build Tool:** Maven
* **Testing:** JUnit 5, Mockito, Spring Boot Test, MockMvc
* **Security:** Spring Security and JWT-based authentication
* **Database Access:** Spring Data JPA

## 3. Current Development Focus

### Critical API Testing

The `feature/critical-api-testing` branch focuses on establishing baseline tests for four critical APIs before introducing requirement-based changes and improvements.

The current phase records selected behaviours of the existing implementation. Passing baseline tests does not establish that an API is secure or that all its requirements are satisfied.

### APIs Under Test

| HTTP Method | Endpoint          | Purpose         |
| ----------- | ----------------- | --------------- |
| POST        | `/api/users/add`  | Register a user |
| DELETE      | `/api/users/{id}` | Delete a user   |
| POST        | `/api/roles/add`  | Create a role   |
| DELETE      | `/api/roles/{id}` | Delete a role   |

## 4. Test Structure

Tests are located under:

`src/test/java/com/smartcareer/careerguidancebackend/`

### Controller / API Tests

Located in `controller/`.

* `UserRegistrationApiTest`
* `UserDeletionApiTest`
* `RoleCreationApiTest`
* `RoleDeletionApiTest`

These tests use MockMvc to exercise controller endpoints and verify selected HTTP responses and service interactions.

**Note:** The current controller tests disable security filters. They do not verify authentication or authorization behaviour.

### Service Tests

Located in `service/`.

* `UserRegistrationServiceTest`
* `UserDeletionServiceTest`
* `RoleServiceTest`
* `RoleDeletionServiceTest`

These tests verify selected service behaviours, including repository interactions, registration validation, and exception propagation.

Repository interactions are mocked in these service unit tests, so they do not establish actual database persistence or deletion.

## 5. Running the Tests

Run the complete backend test suite from the backend project directory:

```powershell
.\mvnw.cmd test
```

Run an individual test class using:

```powershell
.\mvnw.cmd -Dtest=UserRegistrationServiceTest test
```

Replace `UserRegistrationServiceTest` with the test class you want to execute.

## 6. Current Baseline Status

The initial baseline suite has been executed successfully, with 18 tests reported by the complete Maven test run.

The baseline tests cover selected successful and exceptional execution paths. They are an initial testing foundation, not comprehensive API, integration, or security coverage.

## 7. Known Areas for Investigation

The following areas remain to be assessed and addressed during subsequent testing and development:

* Registration role restrictions and input validation.
* Authentication and authorization for sensitive operations.
* Authorization checks for user deletion and role management.
* Handling of missing records and database constraint violations.
* API error-response consistency.
* Security-sensitive logging and credential exposure.
* Integration testing against a database.
* Automated test execution through GitHub Actions.

These are investigation targets; their final requirements and implementation decisions will be documented as the project progresses.

## 8. Planned Workflow

1. Establish baseline tests for the four critical APIs.
2. Define intended behaviour and acceptance criteria.
3. Add requirement-based tests to identify gaps in the existing implementation.
4. Implement and verify improvements.
5. Expand integration and security testing.
6. Configure GitHub Actions to run automated tests.

## 9. Related Documentation

The API-tracing spreadsheet will document the selected critical APIs and the reasoning behind their prioritisation. It will be maintained alongside this testing work.
