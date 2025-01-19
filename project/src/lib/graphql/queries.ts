import { gql } from '@apollo/client';

export const GET_SCHEDULE = gql`
  query GetSchedule {
    schedule {
      id
      name
      teacher
      startTime
      endTime
      days
      scheduleType
      room
    }
  }
`;

export const GET_SCHEDULE_BY_DAY = gql`
  query GetScheduleByDay($day: String!) {
    scheduleByDay(day: $day) {
      id
      name
      teacher
      startTime
      endTime
      scheduleType
      room
    }
  }
`;

export const GET_NOTIFICATION_SETTINGS = gql`
  query GetNotificationSettings {
    notificationSettings {
      classReminders
      hourBefore
      fifteenBefore
      dailySummary
      notificationStyle
    }
  }
`;