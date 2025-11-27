import { registerEnumType } from '@nestjs/graphql';

export enum RecurrenceType {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}
registerEnumType(RecurrenceType, {
  name: 'RecurrenceType',
});
