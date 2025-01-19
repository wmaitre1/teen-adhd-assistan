import { useQuery } from '@apollo/client';
import { GET_SIMILAR_TASKS } from '../lib/graphql/queries';

export function useVectorSearch(taskId: string, limit: number = 5) {
  const { data, loading, error } = useQuery(GET_SIMILAR_TASKS, {
    variables: { taskId, limit },
    skip: !taskId,
  });

  return {
    similarTasks: data?.similarTasks || [],
    loading,
    error,
  };
}