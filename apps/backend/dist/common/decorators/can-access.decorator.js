import { SetMetadata } from '@nestjs/common';
export const CAN_ACCESS_KEY = 'can-access';
export const CanAccess = (options = {}) => SetMetadata(CAN_ACCESS_KEY, options);
