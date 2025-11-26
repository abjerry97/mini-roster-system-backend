import { Role } from 'src/enums/role.enum';

export type JwtUser = {
  userId: string;
  role: Role;
};
