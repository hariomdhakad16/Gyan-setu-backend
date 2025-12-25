## Clarifications
### Session 2025-12-25
- Q: What specific functionality or features related to quizzes are explicitly out of scope for this initial implementation? → A: Analytics dashboards, gamification, and advanced question types (e.g., coding challenges)
- Q: Regarding Reliability & Availability, what is the target uptime for the Quiz API, and what is the expected recovery time objective (RTO) in case of a service outage? → A: Uptime: 99.9%, RTO: < 1 hour
- Q: Regarding Observability, what specific metrics should be emitted for quiz-related functionality, and what logging levels are expected for different events? → A: Metrics: Quiz creation count, attempt count, average score, error rate (per endpoint). Logging: INFO for successful operations, WARN for retries/slow responses, ERROR for failures.
- Q: Regarding Rate Limiting, what are the initial rate limits expected for quiz-related API endpoints to prevent abuse and ensure fair usage? → A: Global: 100 requests/minute/IP; User-specific (authenticated): 30 requests/minute/user.
- Q: Regarding Constraints & Tradeoffs, what explicit tradeoffs or rejected alternatives have been considered during the design of the Quiz Management feature? → A: Rejected: Separate microservice for quizzes due to increased operational complexity; Tradeoff: Prioritizing offline sync robustness over immediate consistency for certain operations.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and Manage Quizzes (Priority: P1)

Teachers can create, view, update, and delete quizzes. They can associate quizzes with lessons, define question types (multiple choice, true/false, fill-in-the-blank, image choice), set points, time limits, and publishing status.

**Why this priority**: Essential for teachers to onboard educational content and for the platform to offer interactive learning assessments.

**Independent Test**: A teacher can create a new quiz, add various question types, configure its settings (time limit, passing score, etc.), save it, and then successfully retrieve and modify its details.

**Acceptance Scenarios**:

1. **Given** a teacher is logged in, **When** they navigate to the "Create Quiz" section and fill out all required fields (title, subject, class, questions with options/answers), **Then** a new quiz is created with a unique ID and is visible in their quiz management interface.
2. **Given** an existing unpublished quiz, **When** a teacher edits its details (e.g., adds/removes questions, changes the time limit or publishing status), **Then** the quiz is updated successfully, reflecting the changes.
3. **Given** an existing quiz, **When** a teacher soft-deletes it, **Then** the quiz is marked as deleted in the database, is no longer accessible to students, but can be restored by an admin.

### User Story 2 - Student Takes a Quiz (Priority: P1)

Students can view quizzes associated with lessons, attempt quizzes, submit their answers, and receive immediate feedback including scores and explanations. Quiz attempts are tracked for progress.

**Why this priority**: Core student functionality for assessment and learning progress tracking. Direct interaction with educational content.

**Independent Test**: A student can successfully initiate a quiz attempt, provide answers to all questions, submit the quiz, and view their score along with detailed feedback (correct/incorrect answers, explanations).

**Acceptance Scenarios**:

1. **Given** a student is logged in and navigates to a lesson with an associated quiz, **When** they start the quiz and submit answers within the allowed attempts and time limit, **Then** their quiz attempt is recorded, and they receive an accurate score, pass/fail status, and per-question feedback.
2. **Given** a student is attempting a quiz with a defined time limit, **When** the time expires before they manually submit, **Then** the quiz is automatically submitted with the answers provided up to that point, and the student receives their score.
3. **Given** a student attempts an offline-enabled quiz, **When** they submit it while offline, **Then** the attempt is stored locally and successfully synchronized to the backend upon network reconnection.

### User Story 3 - View Quiz Progress and Analytics (Priority: P2)

Students can view their past quiz attempts, scores, and overall progress. Teachers can view student quiz results and class-level quiz analytics.

**Why this priority**: Provides valuable feedback to students and insights to teachers, supporting personalized learning and instructional improvements.

**Independent Test**: A user (student or teacher) can access their respective dashboards and successfully view a summary or detailed breakdown of quiz performance data relevant to their role.

**Acceptance Scenarios**:

1. **Given** a student has completed multiple quizzes, **When** they view their personal progress dashboard, **Then** they see a clear summary of their quiz performance, including best scores, average scores, and progress on specific topics.
2. **Given** a teacher is logged in and selects a specific quiz or class, **When** they request analytics for that quiz/class, **Then** they see aggregated scores, pass rates, and common areas of difficulty for the students.

### Edge Cases

- What happens when a student tries to submit a quiz attempt after the maximum allowed attempts have been reached? (Should be rejected with appropriate error)
- How does the system handle concurrent quiz attempts or submissions from the same user (e.g., from multiple devices or rapid clicks)? (Should ensure data integrity and avoid duplicate attempts)
- What if a quiz is deleted while students have pending attempts or progress recorded? (Soft-delete with appropriate integrity checks/archiving)
- What if a quiz has no questions defined but is published? (Should prevent publishing or handle gracefully)

#### Rate Limiting
- **RL-001**: Global endpoints will be limited to 100 requests per minute per IP address.
- **RL-002**: Authenticated user-specific endpoints will be limited to 30 requests per minute per user.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow teachers to create, read, update, and soft-delete quizzes.
- **FR-002**: System MUST support multilingual content for quiz titles, descriptions, questions, options, and explanations (Punjabi, Hindi, English).
- **FR-003**: System MUST support multiple question types: multiple choice, true/false, fill-in-the-blank, and image choice.
- **FR-004**: System MUST allow teachers to configure quiz parameters: time limit, passing score, maximum attempts, shuffling of questions and options, immediate feedback display, and correct answer revelation.
- **FR-005**: System MUST store comprehensive student quiz attempt data, including selected answers, score, duration, and metadata.
- **FR-006**: System MUST provide API endpoints for students to retrieve quiz details (excluding correct answers before submission), start an attempt, submit answers, and view results.
- **FR-007**: System MUST integrate quiz attempt submissions with the offline sync queue for robust data handling in low-connectivity environments.
- **FR-008**: System MUST enforce authentication and role-based authorization for all quiz-related API endpoints (e.g., only teachers/admins can create/edit quizzes; only students can attempt quizzes).
- **FR-009**: System MUST validate all incoming quiz creation, update, and submission data using Zod schemas.
- **FR-010**: System MUST provide API endpoints for students to view their historical quiz attempts and aggregated performance.
- **FR-011**: System MUST provide API endpoints for teachers/admins to view aggregated quiz analytics and individual student results.
- **FR-012**: System MUST support associating quizzes with specific lessons.

### Out of Scope
The following features are explicitly out of scope for this implementation:
- Detailed teacher-facing analytics dashboards for quiz performance.
- Gamification elements such as badges, leaderboards, or points for quiz activities.
- Advanced question types beyond multiple choice, true/false, fill-in-the-blank, and image choice (e.g., coding challenges, interactive simulations).

### Key Entities *(include if feature involves data)*

-   **Quiz**: Represents a set of questions for assessment. Attributes include multilingual title/description, subject, class, type, time limit, passing score, attempts allowed, question list (with question type, content, options/correct answers), associated lesson ID, createdBy, publishing status, and analytics.
-   **QuizAttempt**: Represents a student's single attempt at a quiz. Attributes include userId, quizId, attemptNumber, submitted answers, score, percentage, pass/fail status, startedAt, submittedAt, duration, and optionally sync metadata for offline support.

## Success Criteria *(mandatory)*

### Measurable Outcomes

-   **SC-001**: Teachers can create and publish a new quiz, including adding 10 questions, within 5 minutes.
-   **SC-002**: Students can successfully submit a quiz attempt, and their score is accurately calculated and recorded for 100% of valid attempts.
-   **SC-003**: Quiz attempt submissions from offline clients are successfully synchronized to the backend within 30 seconds of network reconnection for 99.9% of cases.
-   **SC-004**: All quiz API endpoints (GET, POST, PATCH, DELETE) respond within 100ms (p95) under typical load.
-   **SC-005**: User satisfaction for the quiz feature, as measured by in-app feedback or surveys, maintains an average rating of 4.5/5 or higher.

### Reliability & Availability
- **SC-006**: The Quiz API will maintain a target uptime of 99.9%.
- **SC-007**: The Recovery Time Objective (RTO) for the Quiz API, in case of a service outage, will be less than 1 hour.

### Observability
- **SC-008**: Key metrics for quiz-related functionality (quiz creation count, attempt count, average score, error rate per endpoint) will be emitted.
- **SC-009**: Logging levels will adhere to: INFO for successful operations, WARN for retries/slow responses, ERROR for failures.

## Constraints & Tradeoffs
- **CT-001**: Rejected a separate microservice for quizzes due to increased operational complexity.
- **CT-002**: Prioritizing offline sync robustness over immediate consistency for certain operations, accepting eventual consistency for offline quiz attempt submissions.