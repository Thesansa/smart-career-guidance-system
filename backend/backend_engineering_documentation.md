# Backend Engineering Documentation

## Smart Career Guidance System — Backend Security, Testing, Containerisation and CI

> **Document purpose:** Record the engineering work carried out to review, improve, test, containerise and automate the Smart Career Guidance System backend.
>
> **Scope:** This document covers the API tracing review, security-risk prioritisation, baseline verification, requirement-based testing, implementation changes, Docker configuration and GitHub Actions CI workflow.
>
> **Evidence basis:** The reviewed API tracing workbook, the supplied backend source archive, the recorded test output and the CI workflow details discussed during implementation. Where a result is not evidenced by those materials, it is identified as a verification item rather than presented as a confirmed result.

---

## 1. Project Context and Objectives

The backend of the Smart Career Guidance System is implemented using Spring Boot and Java. It exposes REST APIs consumed by the React frontend and uses a relational database for application data. Authentication is implemented using JSON Web Tokens (JWT), with Spring Security responsible for protecting API resources.

The improvement work was undertaken to understand the existing backend behaviour and address security weaknesses identified during API tracing. The objective was not simply to modify individual endpoints. It was to establish a traceable engineering process in which findings were supported by source-code evidence, converted into requirements, tested, implemented and verified.

The work had the following objectives:

1. Establish an inventory of frontend-to-backend API interactions.
2. Trace important API requests through the backend layers.
3. Identify security weaknesses and prioritise the most urgent risks.
4. Validate the recorded behaviour against the source code and baseline tests.
5. Translate security findings into explicit, testable requirements.
6. Modify the backend implementation to satisfy those requirements.
7. Run automated tests to detect regressions.
8. Package the backend into a Docker image.
9. Automate backend build and test execution through GitHub Actions.

## 2. API Tracing and Existing-System Review

### 2.1 Purpose of API tracing

Before changing the backend, the existing request flow was reviewed to understand how the frontend interacted with the backend and how each request was processed.

The API tracing exercise was used to answer the following questions:

- Which frontend action triggers the request?
- Which API endpoint receives the request?
- Which controller method handles it?
- Which service method contains the business logic?
- Which repository and database entities are involved?
- What data is accepted from the client?
- What response is returned to the frontend?
- What authentication and authorization checks are applied?
- What security risks or missing controls are visible in the implementation?

This approach provided a view of the application beyond the endpoint declaration. An endpoint may appear protected at the controller or security-configuration level while still containing weaknesses in the service logic, such as trusting a client-supplied role or failing to verify resource ownership.

### 2.2 Tracing methodology

The review followed each selected request through the application layers:

**Frontend action → API request → Controller → Service → Repository → Database → Response**

For each endpoint, the tracing workbook recorded information such as:

- Frontend API call and associated action.
- HTTP method and endpoint.
- Controller and service methods.
- Repository and data entities.
- Request inputs and response information.
- Authentication and authorization observations.
- Identified risks.
- Suggested corrective actions.
- Source-code evidence and proposed test cases.

The workbook contains 59 endpoint entries and three additional cross-cutting flows. These cross-cutting flows include internal user lookup, frontend logout and JWT validation.

### 2.3 Why tracing multiple layers mattered

Reviewing only the controller would not have been sufficient. For example, an endpoint could require an authenticated user but still allow that user to access another user's record. Authentication establishes who is making a request; authorization determines whether that identity is allowed to perform the requested operation.

The service layer therefore needed to be examined for business-level authorization rules, while the security configuration needed to be reviewed for endpoint-level access restrictions.

The repository and entity layers were also relevant because they showed which records were retrieved or modified and whether sensitive entity data could be exposed through API responses.

### 2.4 Traceability of findings

The API tracing workbook served as the central review record. It connected each observation to the relevant source-code location and proposed corrective action.

The workbook's findings were based on inspection of the supplied source code. This is **static code-tracing evidence**. It should not be described as proof that every listed issue was individually reproduced by an executed test.

The later baseline tests supplied behavioural evidence for the scenarios covered by those tests. The two forms of evidence complement each other:

- **Static tracing:** confirms what the inspected implementation does or fails to enforce.
- **Baseline testing:** observes how the running application behaves for a defined test scenario.

## 3. Identification and Prioritisation of Critical APIs

### 3.1 Risk-assessment approach

The review prioritised findings according to the potential for unauthorised access or modification, the sensitivity of the affected operation and the ease with which an untrusted or lower-privileged user could reach it.

Particular attention was given to:

- Privilege escalation.
- Missing authentication or authorization.
- Missing ownership checks.
- Exposure of user information.
- Trusting security-sensitive values supplied by the client.
- JWT validation and authority handling.
- Sensitive information written to logs.

The most urgent issues were those that could allow a user to gain privileges, manipulate accounts or access operations beyond their assigned role.

### 3.2 High-priority findings

The following findings were identified in the API tracing review and were addressed by the subsequent backend work.

| Area | Observed concern | Security impact | Priority |
|---|---|---|---|
| User registration | The original registration flow accepted a role identifier supplied by the client | A caller could attempt to register with a privileged role rather than receiving the intended default role | Critical |
| User deletion | The original deletion logic did not adequately enforce the intended role and ownership boundaries | An authenticated user could attempt to delete another user's account | Critical |
| Role management | The security configuration permitted the `/api/roles/**` path pattern publicly | Role-management operations could be exposed without the required authorization | Critical |
| User listing | The complete user-list endpoint lacked the required ADMIN-only restriction | Authenticated users could potentially retrieve information about other accounts | High |
| Individual user retrieval | The endpoint did not adequately enforce record ownership | A user could attempt to retrieve another user's information | High |
| JWT authentication | The authentication filter relied on role information carried in the token rather than consistently loading current authorities from the database | A role change could remain ineffective until the old token expired | High |
| JWT error handling | Malformed or invalid token handling needed to be made robust | Invalid token input could cause avoidable authentication-processing failures | High |
| Sensitive logging | Sensitive authentication-related information was identified as a logging concern in the review | Logs could expose information that should not be recorded | High |

> **Interpretation:** Severity labels represent the prioritisation recorded during the review. They are not a claim that every possible exploit path was independently penetration-tested.

### 3.3 Why these APIs were selected for immediate attention

The registration, deletion and role-management issues affected security boundaries rather than merely application usability.

A role is an authorization attribute. It should be assigned or validated by trusted backend logic, not accepted as an unrestricted client decision. Similarly, deleting an account is a destructive operation and must be limited by role and ownership rules.

The user-list and individual-user endpoints were also prioritised because authenticated access alone is not sufficient protection for personal or account-related data. Access must be limited according to the requester's role and relationship to the requested resource.

JWT handling was included because the authentication filter is part of the security boundary for the entire API. Incorrectly trusting stale token claims can undermine otherwise correct endpoint-level authorization rules.

## 4. Baseline Review and Verification

### 4.1 Purpose of the baseline

The baseline stage was used to establish how the existing implementation behaved before or independently of the corrective implementation.

The baseline was important for two reasons:

1. It helped determine whether the API tracing workbook accurately represented the implementation.
2. It provided a behavioural reference for the security requirements and later regression tests.

### 4.2 How the API tracing was checked

The source-code review was used to follow the recorded endpoint flows and compare the workbook entries with the actual implementation.

The review checked whether:

- The documented controller method existed.
- The controller called the documented service method.
- The service used the recorded repository or related data access.
- The request fields matched the implementation.
- The response type and returned data matched the implementation.
- The described security checks were present or absent.
- The suggested risks were supported by the code path.

This established the workbook as a source-backed map of the reviewed implementation.

### 4.3 Baseline test evidence

The supplied CI log recorded a test run with the following summary:

| Result | Count |
|---|---:|
| Tests run | 38 |
| Failures | 0 |
| Errors | 1 |
| Skipped | 0 |

The log showed that the requirement and service/API test classes for user registration, user deletion, role creation and role deletion executed. The application-context test failed while creating the JWT service because Spring could not resolve the `app.jwt.secret` property.

The same log showed that the MySQL connection pool started successfully and connected to the MySQL 8.0.46 service. Therefore, the observed failure was a JWT configuration/property-resolution issue, not a database connection failure.

This result must be interpreted accurately: the run did **not** constitute a fully successful baseline suite because one test errored during application-context initialisation. It did, however, provide useful evidence about the test classes that executed and identified a configuration issue that needed correction.

### 4.4 Relationship between tracing and tests

The tracing workbook and tests served different purposes:

| Evidence | What it establishes |
|---|---|
| Source-code tracing | The recorded request flow and security observations match the inspected implementation |
| Baseline tests | The application exhibits the observed behaviour for the specific scenarios exercised |
| Requirement tests | The expected security rules are expressed as executable conditions |
| Post-change test run | The implementation satisfies the tested requirements and has not introduced failures in the executed suite |

The tests do not automatically validate all 59 endpoint entries. The documented test coverage should be limited to the endpoints and behaviours actually represented by the test classes.

## 5. Change Impact Analysis: Backend Files Modified

Security improvements required coordinated changes across configuration, controllers, services, DTOs, exceptions and authentication components. Updating only the endpoint declaration would not have been sufficient.

The following files are present in the supplied backend archive and are directly relevant to the reviewed implementation.

### 5.1 Security configuration

**`src/main/java/com/smartcareer/careerguidancebackend/config/SecurityConfig.java`**

Responsibility:

- Defines HTTP security rules.
- Determines which routes are public and which require authentication or specific roles.
- Configures the authentication filter chain.

Change significance:

- The user-list endpoint is restricted to ADMIN.
- Role-management access rules are configured so privileged operations require the intended authorization.
- The security configuration works with the JWT authentication filter to protect requests.

### 5.2 JWT service

**`src/main/java/com/smartcareer/careerguidancebackend/config/JwtService.java`**

Responsibility:

- Creates and validates JWTs.
- Handles signing-key configuration.
- Extracts token claims and manages token expiry.

Change significance:

- The signing secret is supplied through application configuration rather than being embedded directly in the service.
- The configured Base64 value is decoded to obtain the signing key.
- The implementation checks that the decoded key meets the minimum 32-byte requirement.
- Token expiry is configured in the service.

Operational implication:

- The application must receive a valid secret at runtime. The secret must not be committed to source control or placed in a shared archive.

### 5.3 JWT authentication filter

**`src/main/java/com/smartcareer/careerguidancebackend/config/JwtAuthenticationFilter.java`**

Responsibility:

- Reads the bearer token from incoming requests.
- Validates the token.
- Establishes the authenticated principal in Spring Security's context.

Change significance:

- The filter loads the current user details through the user-details service.
- Current database authorities are used for authorization rather than relying on a potentially stale role claim in the JWT.
- Invalid token handling is contained so malformed tokens do not unnecessarily break request processing.

### 5.4 User controller

**`src/main/java/com/smartcareer/careerguidancebackend/controller/UserController.java`**

Responsibility:

- Exposes user-related API endpoints.
- Receives request data and delegates business operations to the service layer.

Change significance:

- User-list and individual-user retrieval return `UserResponse` DTOs rather than exposing complete user entities.
- Individual-user retrieval passes the authenticated requester's identity to the service so ownership can be checked.
- The controller remains responsible for HTTP request/response handling rather than implementing the ownership rule itself.

### 5.5 User service

**`src/main/java/com/smartcareer/careerguidancebackend/service/UserService.java`**

Responsibility:

- Contains user-related business logic.
- Coordinates repository access and account operations.

Change significance:

- Registration assigns the permitted default STUDENT role through trusted backend logic instead of trusting a client-supplied role identifier.
- Individual-user retrieval checks whether the requester is an ADMIN or is requesting their own account.
- User deletion enforces the intended role and ownership policy.

### 5.6 User response DTO

**`src/main/java/com/smartcareer/careerguidancebackend/dto/response/UserResponse.java`**

Responsibility:

- Defines the user information returned by relevant API operations.

Change significance:

- Provides a controlled response structure.
- Avoids returning the complete persistence entity and fields that should not be exposed through the API.

### 5.7 User-details service

**`src/main/java/com/smartcareer/careerguidancebackend/service/CustomUserDetailsService.java`**

Responsibility:

- Loads a user by username for Spring Security.
- Supplies user credentials and authorities to the authentication framework.

Change significance:

- Supports loading current user and role information from the database during JWT authentication.

### 5.8 Exception classes and global exception handling

Relevant files:

- `exceptions/ForbiddenOperationException.java`
- `exceptions/ResourceNotFoundException.java`
- `config/GlobalExceptionHandler.java`
- `dto/response/ErrorResponse.java`

Responsibility:

- Represent application-level errors.
- Convert exceptions into structured HTTP responses.

Change significance:

- Forbidden operations can be represented separately from missing resources.
- A requester who is not permitted to access a resource receives an authorization-related response.
- Missing resources can be represented as not found rather than being confused with authorization failures.

### 5.9 Repository dependencies

Relevant repositories include:

- `repository/UserRepository.java`
- `repository/RoleRepository.java`

Responsibility:

- Retrieve user and role records from the database.

Change significance:

- The service layer can verify the requester and target user against persisted data.
- Registration can retrieve the trusted STUDENT role from the database.

## 6. Requirement-Based Test Design

### 6.1 Why requirement tests were introduced

After identifying the security weaknesses, the findings were converted into explicit requirements. This made the expected behaviour measurable and repeatable.

Instead of checking only whether an endpoint returned a successful response, the tests checked whether the correct user, with the correct role and ownership relationship, received the correct result.

The tests were organised around security behaviour at both API and service levels.

### 6.2 Main security requirements

The following requirements describe the intended behaviour represented by the reviewed implementation and test classes.

| ID | Requirement |
|---|---|
| SEC-REG-01 | Public registration must not allow the client to assign itself an arbitrary privileged role |
| SEC-REG-02 | Newly registered users must receive the permitted default STUDENT role |
| SEC-USER-DEL-01 | Only an ADMIN may delete any user account |
| SEC-USER-DEL-02 | A STUDENT may delete only their own account, subject to the implemented policy |
| SEC-USER-DEL-03 | A user must not delete another user's account |
| SEC-ROLE-01 | Role creation must require the intended privileged authorization |
| SEC-ROLE-02 | Role deletion must require the intended privileged authorization |
| SEC-USER-READ-01 | The complete user list must be restricted to ADMIN |
| SEC-USER-READ-02 | A non-admin user may retrieve only their own user record |
| SEC-JWT-01 | Authentication must use the current user authorities loaded from the database |
| SEC-JWT-02 | Invalid tokens must not establish an authenticated security context |

The test classes present in the supplied archive include:

- `UserRegistrationApiRequirementTest`
- `UserDeletionApiRequirementTest`
- `RoleCreationApiRequirementTest`
- `RoleDeletionApiRequirementTest`
- `UserRegistrationRequirementTest`
- `UserDeletionRequirementTest`
- `RoleCreationRequirementTest`
- `RoleDeletionRequirementTest`

The archive also contains related API and service test classes that exercise registration, deletion and role-management behaviour.

**Coverage note:** The test-class inventory above is based on the supplied ZIP. The presence of a requirement ID in this document does not imply that every listed requirement has a dedicated test unless the corresponding test method is present and executed. In particular, user-list and individual-user retrieval should be checked for explicit authorization tests before claiming complete test coverage.

### 6.3 API-level and service-level tests

API-level tests verify behaviour through the HTTP layer. They can validate status codes, endpoint access restrictions, request handling and response content.

Service-level tests verify business rules directly. They can validate role assignment, ownership checks and the handling of missing resources without requiring every scenario to pass through the full HTTP stack.

Using both levels helps separate failures in the security configuration or controller from failures in the underlying business logic.

## 7. Implementation and Verification

### 7.1 Registration security

The registration flow was changed so that the backend determines the role assigned to a newly registered user. The client should not be able to choose an arbitrary privileged role by supplying a role identifier.

The service retrieves the permitted STUDENT role from the role repository and assigns it during registration.

This moves responsibility for privilege assignment to trusted backend logic.

### 7.2 User deletion authorization

The deletion logic was strengthened to enforce role-based and ownership-based rules.

The intended policy is:

- ADMIN can delete user accounts according to the implemented administrative rule.
- STUDENT can delete their own account under the implemented policy.
- A STUDENT cannot delete another user's account.
- Other roles cannot perform deletion unless explicitly permitted by the policy.

The service layer is the appropriate place for this business rule because it protects the operation regardless of which controller or internal caller invokes it.

### 7.3 User retrieval and data exposure

The user-list endpoint was restricted to ADMIN. Individual-user retrieval was updated to receive the authenticated requester's username and enforce ownership.

The API returns `UserResponse` DTOs instead of exposing persistence entities directly. This gives the application control over which fields are included in the response.

### 7.4 JWT authority handling

The JWT authentication flow was updated to load the current user's details and authorities from the database. This avoids treating the role claim in an older token as the final source of authorization truth.

The JWT continues to serve as the bearer credential used to identify the user, while current authorities are resolved from trusted application data.

### 7.5 Externalised JWT configuration

The signing secret is configured externally using the `app.jwt.secret` property. Spring Boot can bind the environment variable `APP_JWT_SECRET` to that property.

The CI configuration must therefore supply the correctly named variable, or provide an explicit property mapping. A variable named `JWT_SECRET` by itself does not automatically satisfy `${app.jwt.secret}` unless the application configuration maps it.

The example configuration documents the expected runtime configuration. The actual secret must be generated and managed outside source control.

### 7.6 Verification results

The supplied CI log showed 38 tests, zero assertion failures and one error caused by the unresolved `app.jwt.secret` property during application-context initialisation. The database connection was successful.

The environment-variable mapping was subsequently corrected in the workflow configuration discussed during the implementation. The final successful rerun result should be recorded here from the latest GitHub Actions run:

| Verification item | Result |
|---|---|
| Local backend tests | Record the final local Maven result |
| GitHub Actions backend tests | Record the latest successful run and test count |
| JWT secret property resolution | Confirmed by the latest successful CI run |
| MySQL service connection | Successful in the supplied CI log |
| User-list and individual-user authorization tests | Confirm whether dedicated tests were added and executed |

Do not use the earlier 38-test log as evidence of a successful full suite; it contains one application-context error.

## 8. Backend Containerisation

### 8.1 Purpose

Docker was introduced to package the Spring Boot backend and its runtime dependencies into a reproducible container image.

Containerisation helps reduce differences between development and deployment environments. The backend can be built into an image and run with environment-specific configuration supplied at container startup.

### 8.2 Dockerfile

The supplied backend archive contains a multi-stage Dockerfile.

The build stage uses Maven and Eclipse Temurin Java 17 to compile and package the Spring Boot application. The runtime stage uses a Java 17 runtime image to execute the generated application artifact.

The runtime stage uses a non-root user with UID `10001`, reducing the privileges available to the application process inside the container.

The Docker build should not include local secrets or unnecessary project files. The `.dockerignore` file excludes selected files from the build context.

### 8.3 Runtime configuration

The backend requires database connection settings and a JWT signing secret. These values should be supplied at runtime through environment variables rather than embedded in the image.

The supplied PowerShell helper script, `run-docker.ps1`, assists with starting the container and passing runtime configuration.

The example configuration file, `application.properties.example`, documents the environment-based settings expected by the application.

**Security requirement:** Generate a fresh JWT signing secret for each appropriate environment. Never commit real credentials, include them in a Docker image, or share them in source archives. Any secret that has been included in a shared archive should be treated as exposed and rotated.

### 8.4 Docker files

| File | Purpose |
|---|---|
| `Dockerfile` | Defines the multi-stage backend image build |
| `.dockerignore` | Excludes unnecessary files from the Docker build context |
| `run-docker.ps1` | Helps run the backend container with runtime configuration |
| `application.properties.example` | Documents the required external application properties |

### 8.5 Reproducible build and run procedure

From the backend project directory, the image can be built using:

```bash
docker build -t career-guidance-backend .
```

The container should then be run with the database URL, database username, database password and JWT secret supplied through the environment. Use the project's `run-docker.ps1` helper or an equivalent secure runtime configuration.

The actual values must be supplied from the local environment or secret manager; they should not be written into this document.

## 9. GitHub Actions Continuous Integration

### 9.1 Purpose

A GitHub Actions workflow was introduced to automate backend verification when relevant changes are pushed or submitted through a pull request.

The pipeline provides repeatable build and test execution and helps detect regressions before changes are merged.

### 9.2 Workflow stages

The backend CI workflow discussed during implementation performs the following tasks:

1. Checks out the repository.
2. Sets up the configured Java distribution and version.
3. Uses Maven dependency caching.
4. Makes the Maven wrapper executable.
5. Starts a MySQL 8.0 service container.
6. Waits for the MySQL health check.
7. Supplies database and JWT configuration to the test process.
8. Executes `./mvnw -B clean test`.

### 9.3 MySQL service

The workflow provisions a MySQL service container for the test job. This allows integration and application-context tests to connect to a database without depending on a developer's local MySQL installation.

The workflow configures a database, credentials and a health check. The test step uses the service's exposed port and connection URL.

The supplied CI log confirmed that the MySQL connection pool started and established a connection.

### 9.4 JWT environment-variable correction

The application injects the property:

```properties
app.jwt.secret
```

The corresponding Spring Boot environment-variable name is:

```bash
APP_JWT_SECRET
```

The earlier CI failure occurred because the test process supplied `JWT_SECRET`, while Spring could not resolve `${app.jwt.secret}`. The workflow was corrected to use the property-compatible environment variable.

This is an example of why CI configuration is part of application configuration design: the application may compile correctly but fail during context initialisation if a required runtime property is missing.

### 9.5 Workflow triggers

The workflow was configured to run for pushes and pull requests targeting the `feature/critical-api-testing` branch when backend files or the workflow file itself changed. A manual `workflow_dispatch` trigger was also included.

This limits automatic execution to relevant changes while preserving the ability to run the workflow manually.

### 9.6 CI evidence

The earlier supplied log recorded the following:

- Maven compiled the backend source files.
- The MySQL service became available.
- Most of the test classes completed successfully.
- The full run ended with one application-context error because `app.jwt.secret` was unresolved.

After the environment-variable correction, the latest GitHub Actions run should be used as the final evidence. Record its run date, branch, commit and final test summary here.

## 10. Files and Components Involved

The following table consolidates the key files identified in the supplied backend archive.

| Component | File or location | Role in the work |
|---|---|---|
| Security configuration | `config/SecurityConfig.java` | Endpoint-level authorization |
| JWT service | `config/JwtService.java` | Token creation, validation and signing-key configuration |
| JWT filter | `config/JwtAuthenticationFilter.java` | Request authentication and security-context population |
| User controller | `controller/UserController.java` | User API request handling |
| User service | `service/UserService.java` | Registration, retrieval and deletion business rules |
| User details service | `service/CustomUserDetailsService.java` | Loading user credentials and authorities |
| User response DTO | `dto/response/UserResponse.java` | Controlled user API response |
| Exception handling | `config/GlobalExceptionHandler.java` | Consistent HTTP error mapping |
| Authorization exception | `exceptions/ForbiddenOperationException.java` | Represents forbidden operations |
| Not-found exception | `exceptions/ResourceNotFoundException.java` | Represents missing resources |
| User repository | `repository/UserRepository.java` | User data access |
| Role repository | `repository/RoleRepository.java` | Role data access |
| Application configuration | `src/main/resources/application.properties.example` | Documents external configuration |
| Maven configuration | `pom.xml` | Dependencies and build configuration |
| Test suite | `src/test/java/...` | Requirement, API and service tests |
| Container build | `Dockerfile` | Backend image construction |
| Docker build exclusions | `.dockerignore` | Build-context exclusions |
| Container run helper | `run-docker.ps1` | Local container startup |
| CI workflow | `.github/workflows/backend-ci.yml` | Automated backend test pipeline |

## 11. Engineering Decisions and Rationale

### 11.1 Enforce authorization in the service layer where appropriate

Endpoint-level security rules are useful, but they do not replace business-level authorization. Ownership rules belong in the service layer so that the operation remains protected even if it is called from another controller or internal application path.

### 11.2 Use DTOs instead of exposing persistence entities

DTOs provide an explicit API contract and reduce accidental exposure of internal entity fields. They also allow the database model to evolve without automatically changing the public response structure.

### 11.3 Resolve current authorities from trusted data

A JWT is a credential presented by the client. Current authorization decisions should use trusted, current application data when the system requires role changes to take effect before token expiry.

### 11.4 Convert security findings into executable requirements

A finding becomes more useful when it is expressed as an expected behaviour that can be tested. Requirement tests make the security policy repeatable and help prevent regressions.

### 11.5 Externalise environment-specific configuration

Database credentials and JWT signing keys vary between environments. Supplying them at runtime avoids coupling secrets to the source code or container image.

### 11.6 Automate repeatable verification

The CI pipeline runs the backend test suite in a controlled environment. This reduces reliance on manual testing and provides a consistent check for future changes.

## 12. Remaining Verification and Follow-up

The following items should be checked before treating the work as fully complete:

- Record the latest successful local Maven test summary.
- Record the latest successful GitHub Actions run, commit and test count.
- Confirm whether dedicated tests exist for GET `/api/users/all` and GET `/api/users/{id}` authorization rules.
- Confirm that the Docker runtime receives `APP_JWT_SECRET` or an equivalent explicit property mapping.
- Remove any real JWT secret from local configuration before sharing the project archive.
- Rotate any signing secret that was included in a shared archive.
- Confirm that real application secrets are excluded from Git and Docker build contexts.
- Review the allowed CORS origins before production deployment.
- Review login exception handling and ensure authentication failures are not returned as generic server errors.
- Review remaining API tracing findings that were not part of the immediate security scope.

These items are follow-up checks, not claims that all of them were completed as part of the current change set.

## 13. Conclusion

The backend improvement work followed a traceable engineering process: the existing API interactions were mapped, security weaknesses were identified through source-code tracing, high-priority risks were selected, and the findings were translated into testable requirements.

The backend was then improved across its security configuration, JWT authentication, user-management logic, response DTOs and exception handling. Automated tests were used to exercise the requirements, while Docker provided a repeatable packaging approach and GitHub Actions automated backend test execution.

The main outcome is not only a set of code changes. It is a more systematic development process in which security decisions are connected to evidence, requirements, implementation and verification.

---

## Appendix A — Evidence and Source References

The following project materials support this document:

1. **API tracing workbook:** `Career_recommendation_system_-_flow_tracing_reviewed(3).xlsx`
   - Summary and endpoint tracing sheet.
   - Records endpoint flows, source-code evidence, risks, suggested fixes and proposed test cases.

2. **Backend source archive:** `backend(9).zip`
   - Contains the reviewed Spring Boot source, test classes, Dockerfile, Docker helper script and application configuration examples.

3. **CI test log:** `Pasted text(20261114-132942).txt`
   - Records the earlier 38-test execution, MySQL connection and JWT property-resolution error.

4. **GitHub Actions workflow:** `.github/workflows/backend-ci.yml`
   - The workflow discussed during implementation. The workflow file was not present in the supplied backend ZIP.

## Appendix B — Suggested Commands for Reproducing Checks

Run from the backend project directory:

```bash
# Run the complete backend test suite
./mvnw -B clean test

# Build the backend Docker image
docker build -t career-guidance-backend .

# Inspect running containers
docker ps

# Inspect backend container logs
docker logs <container-name-or-id>
```

For PowerShell on Windows, use the Maven wrapper command:

```powershell
.\mvnw.cmd -B clean test
```

Supply all required database and JWT configuration through environment variables or the project's documented runtime configuration. Never place real credentials in command history, committed files or shared documentation.