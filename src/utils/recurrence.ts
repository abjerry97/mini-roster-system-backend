import { addDays, addMonths, isAfter } from 'date-fns';
import { RecurrenceType } from 'src/enums/recurrence-types.enum';

function parseDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00.000Z');
}

export function generateOccurrencesForSchedule(
  schedule,
  windowStart: string,
  windowEnd: string,
) {
  const results: string[] = [];
  const start = parseDate(schedule.startDate);
  const rangeStart = parseDate(windowStart);
  const rangeEnd = parseDate(windowEnd);

  let current = start < rangeStart ? rangeStart : start;

  const endDate = schedule.endDate ? parseDate(schedule.endDate) : null;

  if (schedule.recurrenceType === RecurrenceType.WEEKLY) {
    for (let dt = new Date(current); dt <= rangeEnd; dt = addDays(dt, 1)) {
      if (endDate && isAfter(dt, endDate)) break;
      const day = dt.getUTCDay();
      if (schedule.daysOfWeek && schedule.daysOfWeek.includes(day)) {
        if (dt >= start) {
          results.push(dt.toISOString().slice(0, 10));
        }
      }
    }
  } else if (schedule.recurrenceType === RecurrenceType.DAILY) {
    for (
      let dt = new Date(current);
      dt <= rangeEnd;
      dt = addDays(dt, schedule.interval || 1)
    ) {
      if (endDate && isAfter(dt, endDate)) break;
      if (dt >= start) results.push(dt.toISOString().slice(0, 10));
    }
  } else if (schedule.recurrenceType === RecurrenceType.MONTHLY) {
    for (
      let dt = new Date(current);
      dt <= rangeEnd;
      dt = addMonths(dt, schedule.interval || 1)
    ) {
      if (endDate && isAfter(dt, endDate)) break;
      if (dt >= start) results.push(dt.toISOString().slice(0, 10));
    }
  } else {
    if (start >= rangeStart && start <= rangeEnd) {
      results.push(start.toISOString().slice(0, 10));
    }
  }

  return Array.from(new Set(results)).sort();
}
