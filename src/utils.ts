import convert from 'color-convert';
import { LAB } from 'color-convert/conversions';

import { nanoid } from 'nanoid';

export const createRoomID = (): string => {
  return nanoid(8);
};

export const createColor = () => {
  const a = Math.random() * 2 - 1;
  const b = Math.random() * 2 - 1;
  const k = 90 / Math.sqrt(a * a + b * b);
  const lab: LAB = [40, a * k, b * k];
  console.log(lab);
  return '#' + convert.lab.hex(lab);
};
