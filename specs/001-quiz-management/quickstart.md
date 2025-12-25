# Quickstart: Quiz Management API

This guide provides a quick overview of how to use the Quiz Management API endpoints.

**Base URL**: `/api/v1`

## 1. Creating a Quiz (Teacher/Admin)

To create a new quiz, send a `POST` request to `/quizzes`.

**Endpoint**: `POST /quizzes`  
**Authorization**: `Bearer <teacher_jwt>`

**Example Request Body**:
```json
{
  "title": {
    "en": "Introduction to Algebra Quiz"
  },
  "subject": "mathematics",
  "class": 8,
  "questions": [
    {
      "type": "multiple_choice",
      "question": {
        "en": "What is the value of x in 2x + 3 = 7?"
      },
      "options": [
        { "text": { "en": "x = 1" }, "isCorrect": false },
        { "text": { "en": "x = 2" }, "isCorrect": true },
        { "text": { "en": "x = 3" }, "isCorrect": false }
      ],
      "points": 10
    }
  ]
}
```

## 2. Retrieving a Quiz

To get the details of a specific quiz, send a `GET` request.

**Endpoint**: `GET /quizzes/{id}`  
**Authorization**: `Bearer <any_user_jwt>`

## 3. Submitting a Quiz Attempt (Student)

To submit answers for a quiz, send a `POST` request to `/quizzes/{id}/attempt`.

**Endpoint**: `POST /quizzes/{id}/attempt`  
**Authorization**: `Bearer <student_jwt>`

**Example Request Body**:
```json
{
  "answers": [
    {
      "questionId": "60d...a1",
      "selectedOption": "60d...b2"
    }
  ],
  "startedAt": "2025-12-25T10:00:00.000Z",
  "submittedAt": "2025-12-25T10:05:00.000Z"
}
```

**Example Success Response**:
```json
{
  "attemptId": "60e...c3",
  "score": 10,
  "totalPoints": 10,
  "percentage": 100,
  "passed": true,
  "results": [
    {
      "questionId": "60d...a1",
      "isCorrect": true,
      "correctAnswer": "60d...b2",
      "explanation": {
        "en": "The correct answer is x = 2 because 2(2) + 3 = 7."
      }
    }
  ]
}
```
