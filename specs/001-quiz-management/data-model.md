# Data Model: Quiz Management

## Entities

### Quiz

*   **Description**: Represents a quiz with its questions, configurations, and associated lesson. Based on `BackendPRD.md`'s Quiz Model.
*   **MongoDB Schema (`quizzes` collection)**:
    *   `_id`: `ObjectId` (Primary Key)
    *   `title`: `{ pa: String, hi: String, en: String }` (Multilingual, required)
    *   `description`: `{ pa: String, hi: String, en: String }` (Multilingual, optional)
    *   `lessonId`: `ObjectId` (Reference to `Lesson` model, optional)
    *   `subject`: `String` (Required, e.g., 'mathematics', 'science')
    *   `class`: `Number` (Required, 1-12)
    *   `type`: `String` (Enum: 'practice', 'assessment', 'certification', default: 'practice')
    *   `timeLimit`: `Number` (Minutes, optional)
    *   `passingScore`: `Number` (Percentage, default: 60)
    *   `attemptsAllowed`: `Number` (-1 for unlimited, default: -1)
    *   `shuffleQuestions`: `Boolean` (Default: false)
    *   `shuffleOptions`: `Boolean` (Default: true)
    *   `showCorrectAnswers`: `Boolean` (Default: true)
    *   `showScoreImmediately`: `Boolean` (Default: true)
    *   `questions`: `Array` of `Object` (Embedded)
        *   `_id`: `ObjectId`
        *   `type`: `String` (Enum: 'multiple_choice', 'true_false', 'fill_blank', 'image_choice', required)
        *   `question`: `{ pa: String, hi: String, en: String }` (Multilingual, required)
        *   `imageKey`: `String` (S3 key for image_choice questions, optional)
        *   `options`: `Array` of `Object` (For multiple_choice, image_choice)
            *   `_id`: `ObjectId`
            *   `text`: `{ pa: String, hi: String, en: String }`
            *   `imageKey`: `String` (For image_choice option)
            *   `isCorrect`: `Boolean`
        *   `correctAnswer`: `{ pa: String, hi: String, en: String }` (For fill_blank)
        *   `explanation`: `{ pa: String, hi: String, en: String }` (Multilingual, optional)
        *   `points`: `Number` (Default: 1)
        *   `order`: `Number`
    *   `totalPoints`: `Number` (Calculated, required)
    *   `createdBy`: `ObjectId` (Reference to `User` model, required)
    *   `isPublished`: `Boolean` (Default: false)
    *   `publishedAt`: `Date` (Optional)
    *   `analytics`: `Object` (Embedded, for cached stats)
        *   `attempts`: `Number` (Default: 0)
        *   `avgScore`: `Number` (Default: 0)
        *   `passRate`: `Number` (Default: 0)
    *   `isActive`: `Boolean` (Default: true)
    *   `isDeleted`: `Boolean` (Default: false)
    *   `createdAt`: `Date` (Default: Date.now)
    *   `updatedAt`: `Date` (Default: Date.now)

### QuizAttempt (Sub-document within Progress Model)

*   **Description**: Represents a student's single attempt at a quiz, including their answers, score, and metadata. Stored as a sub-document within the existing `Progress` model, following the `BackendPRD.md` structure.
*   **MongoDB Schema (Embedded in `progress.quizAttempts` array)**:
    *   `quizId`: `ObjectId` (Reference to `Quiz` model, required)
    *   `attemptNumber`: `Number` (Required, 1-N for a given user-quiz pair)
    *   `score`: `Number`
    *   `totalPoints`: `Number`
    *   `percentage`: `Number`
    *   `passed`: `Boolean`
    *   `answers`: `Array` of `Object` (Embedded)
        *   `questionId`: `ObjectId`
        *   `selectedOption`: `ObjectId` (For multiple_choice, image_choice; optional if fill_blank)
        *   `answer`: `String` (For fill_blank; optional if multiple_choice/image_choice)
        *   `isCorrect`: `Boolean`
        *   `points`: `Number` (Points earned for this question)
    *   `startedAt`: `Date`
    *   `submittedAt`: `Date`
    *   `duration`: `Number` (Seconds)
    *   `createdAt`: `Date` (Default: Date.now)
    *   `updatedAt`: `Date` (Default: Date.now)

## Relationships

*   `Quiz` 1:N `QuizAttempt` (One Quiz can have many attempts, stored within different `Progress` documents)
*   `User` 1:N `Progress` -> `QuizAttempt` (One User can have many quiz attempts, associated via their `Progress` document)
*   `Lesson` 1:1 `Quiz` (One Lesson can be associated with one Quiz)
*   `User` 1:N `Quiz` (One User (`Teacher`) can create many Quizzes)
