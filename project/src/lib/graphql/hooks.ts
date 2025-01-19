import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_TASKS, GET_HOMEWORK_SESSIONS, GET_SIMILAR_TASKS } from './queries';
import { CREATE_TASK, UPDATE_TASK, ANALYZE_HOMEWORK } from './mutations';
import type { Task, HomeworkSession, SimilarTask } from '../types';

export function useTasks(status?: string, priority?: string) {
  return useQuery(GET_USER_TASKS, {
    variables: { status, priority },
  });
}

export function useHomeworkSessions() {
  return useQuery(GET_HOMEWORK_SESSIONS);
}

export function useSimilarTasks(taskId: string, limit: number = 5) {
  return useQuery(GET_SIMILAR_TASKS, {
    variables: { taskId, limit },
    skip: !taskId,
  });
}

export function useCreateTask() {
  return useMutation(CREATE_TASK, {
    update(cache, { data: { createTask } }) {
      cache.modify({
        fields: {
          tasks(existingTasks = []) {
            const newTaskRef = cache.writeFragment({
              data: createTask,
              fragment: gql`
                fragment NewTask on Task {
                  id
                  title
                  description
                  dueDate
                  completed
                  priority
                  tags
                }
              `,
            });
            return [...existingTasks, newTaskRef];
          },
        },
      });
    },
  });
}

export function useUpdateTask() {
  return useMutation(UPDATE_TASK);
}

export function useAnalyzeHomework() {
  return useMutation(ANALYZE_HOMEWORK);
}