import { useQuery, useMutation } from '@apollo/client';
import { useCallback } from 'react';
import {
  GET_SCHEDULE,
  GET_SCHEDULE_BY_DAY,
  GET_NOTIFICATION_SETTINGS,
} from '../lib/graphql/queries';
import {
  ADD_CLASS,
  UPDATE_CLASS,
  DELETE_CLASS,
  UPDATE_NOTIFICATION_SETTINGS,
} from '../lib/graphql/mutations';
import { ScheduleProcessor } from '../lib/ocr/scheduleProcessor';
import { ScheduleNotifications } from '../lib/notifications/scheduleNotifications';
import type { Schedule } from '../types';

export function useSchedule() {
  const { data, loading, error } = useQuery(GET_SCHEDULE);
  const [addClass] = useMutation(ADD_CLASS);
  const [updateClass] = useMutation(UPDATE_CLASS);
  const [deleteClass] = useMutation(DELETE_CLASS);
  const [updateNotificationSettings] = useMutation(UPDATE_NOTIFICATION_SETTINGS);

  const processScheduleImage = useCallback(async (file: File) => {
    try {
      const scheduleItems = await ScheduleProcessor.processImage(file);
      
      // Add each extracted class to the schedule
      for (const item of scheduleItems) {
        await addClass({
          variables: {
            input: item,
          },
          update: (cache, { data: { addClass } }) => {
            const existingData = cache.readQuery({ query: GET_SCHEDULE });
            cache.writeQuery({
              query: GET_SCHEDULE,
              data: {
                schedule: [...existingData.schedule, addClass],
              },
            });
          },
        });
      }

      // Schedule notifications for new classes
      for (const item of scheduleItems) {
        await ScheduleNotifications.scheduleReminders(item as Schedule);
      }

      return scheduleItems;
    } catch (error) {
      console.error('Failed to process schedule image:', error);
      throw error;
    }
  }, [addClass]);

  const addClassToSchedule = useCallback(async (classData: Omit<Schedule, 'id'>) => {
    try {
      const { data } = await addClass({
        variables: {
          input: classData,
        },
        update: (cache, { data: { addClass } }) => {
          const existingData = cache.readQuery({ query: GET_SCHEDULE });
          cache.writeQuery({
            query: GET_SCHEDULE,
            data: {
              schedule: [...existingData.schedule, addClass],
            },
          });
        },
      });

      await ScheduleNotifications.scheduleReminders(data.addClass);
      return data.addClass;
    } catch (error) {
      console.error('Failed to add class:', error);
      throw error;
    }
  }, [addClass]);

  const updateClassInSchedule = useCallback(async (id: string, updates: Partial<Schedule>) => {
    try {
      const { data } = await updateClass({
        variables: {
          id,
          input: updates,
        },
      });

      await ScheduleNotifications.scheduleReminders(data.updateClass);
      return data.updateClass;
    } catch (error) {
      console.error('Failed to update class:', error);
      throw error;
    }
  }, [updateClass]);

  const deleteClassFromSchedule = useCallback(async (id: string) => {
    try {
      await deleteClass({
        variables: { id },
        update: (cache) => {
          const existingData = cache.readQuery({ query: GET_SCHEDULE });
          cache.writeQuery({
            query: GET_SCHEDULE,
            data: {
              schedule: existingData.schedule.filter(
                (item: Schedule) => item.id !== id
              ),
            },
          });
        },
      });
    } catch (error) {
      console.error('Failed to delete class:', error);
      throw error;
    }
  }, [deleteClass]);

  return {
    schedule: data?.schedule || [],
    loading,
    error,
    processScheduleImage,
    addClassToSchedule,
    updateClassInSchedule,
    deleteClassFromSchedule,
  };
}