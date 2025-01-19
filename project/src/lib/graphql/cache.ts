import { InMemoryCache } from '@apollo/client';
import { offsetLimitPagination } from '@apollo/client/utilities';

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        tasks: offsetLimitPagination(['status', 'priority']),
        homeworkSessions: offsetLimitPagination(),
        similarTasks: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    Task: {
      fields: {
        tags: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});