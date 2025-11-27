import { registerEnumType } from '@nestjs/graphql';

export enum AssignmentStatus {
  OPEN = 'OPEN',
  ASSIGNED = 'ASSIGNED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(AssignmentStatus, { name: 'AssignmentStatus' });
