import { gql } from '@apollo/client';

export const typeDefs = gql`
  enum TaskStatus {
    PENDING
    COMPLETED
    OVERDUE
  }

  enum TaskPriority {
    HIGH
    MEDIUM
    LOW
  }

  type Task {
    id: ID!
    title: String!
    description: String
    dueDate: String!
    completed: Boolean!
    priority: TaskPriority!
    tags: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  type HomeworkSession {
    id: ID!
    subject: String!
    question: String!
    response: String
    attachments: [String!]
    createdAt: String!
  }

  type SimilarTask {
    id: ID!
    title: String!
    similarity: Float!
  }

  type VectorSearchResult {
    tasks: [SimilarTask!]!
    totalCount: Int!
  }

  input CreateTaskInput {
    title: String!
    description: String
    dueDate: String!
    priority: TaskPriority!
    tags: [String!]!
  }

  input UpdateTaskInput {
    title: String
    description: String
    dueDate: String
    completed: Boolean
    priority: TaskPriority
    tags: [String!]
  }

  type Query {
    tasks(status: TaskStatus, priority: TaskPriority): [Task!]!
    task(id: ID!): Task
    homeworkSessions: [HomeworkSession!]!
    similarTasks(taskId: ID!, limit: Int): VectorSearchResult!
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
    analyzeHomework(file: Upload!, subject: String!): HomeworkSession!
  }

  type Subscription {
    taskUpdated(id: ID!): Task!
    newHomeworkSession: HomeworkSession!
  }
`;