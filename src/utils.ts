import { nanoid } from 'nanoid';

export const createRoomID = (): string => {
  return nanoid(8);
};
