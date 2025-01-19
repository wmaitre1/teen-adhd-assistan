import type { Schedule } from '../../types';

interface RawScheduleItem {
  className?: string;
  teacher?: string;
  time?: string;
  days?: string;
  room?: string;
}

export function parseScheduleText(text: string): Partial<Schedule>[] {
  const lines = text.split('\n').filter(line => line.trim());
  const scheduleItems: Partial<Schedule>[] = [];
  let currentItem: RawScheduleItem = {};

  for (const line of lines) {
    // Time pattern (e.g., "8:00 AM - 9:30 AM")
    const timePattern = /(\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i;
    
    // Days pattern (e.g., "MWF" or "TTH")
    const daysPattern = /^[MTWTHF]+$/i;
    
    // Room pattern (e.g., "Room 101" or "RM 101")
    const roomPattern = /(?:ROOM|RM)\s*([A-Z0-9-]+)/i;

    if (timePattern.test(line)) {
      if (Object.keys(currentItem).length > 0) {
        scheduleItems.push(processScheduleItem(currentItem));
        currentItem = {};
      }
      const [match, start, end] = line.match(timePattern) || [];
      currentItem.time = `${start}-${end}`;
    } else if (daysPattern.test(line.trim())) {
      currentItem.days = line.trim();
    } else if (roomPattern.test(line)) {
      const [, room] = line.match(roomPattern) || [];
      currentItem.room = room;
    } else if (line.includes(':')) {
      const [label, value] = line.split(':').map(s => s.trim());
      if (label.toLowerCase().includes('teacher')) {
        currentItem.teacher = value;
      } else {
        currentItem.className = value;
      }
    } else {
      currentItem.className = line.trim();
    }
  }

  if (Object.keys(currentItem).length > 0) {
    scheduleItems.push(processScheduleItem(currentItem));
  }

  return scheduleItems;
}

function processScheduleItem(item: RawScheduleItem): Partial<Schedule> {
  const [startTime, endTime] = (item.time?.split('-') || []).map(t => t?.trim());
  
  return {
    name: item.className,
    teacher: item.teacher,
    startTime,
    endTime,
    days: item.days?.match(/[MTWTHF]/gi) || [],
    room: item.room,
    scheduleType: 'Every Day', // Default value, can be updated based on additional parsing
  };
}