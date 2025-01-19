import { gql } from '@apollo/client';

export const ADD_CLASS = gql`
  mutation AddClass($input: ClassInput!) {
    addClass(input: $input) {
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

export const UPDATE_CLASS = gql`
  mutation UpdateClass($id: ID!, $input: ClassInput!) {
    updateClass(id: $id, input: $input) {
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

export const DELETE_CLASS = gql`
  mutation DeleteClass($id: ID!) {
    deleteClass(id: $id)
  }
`;

export const UPDATE_NOTIFICATION_SETTINGS = gql`
  mutation UpdateNotificationSettings($input: NotificationSettingsInput!) {
    updateNotificationSettings(input: $input) {
      classReminders
      hourBefore
      fifteenBefore
      dailySummary
      notificationStyle
    }
  }
`;