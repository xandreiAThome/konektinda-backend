import { pgEnum } from 'drizzle-orm/pg-core';

export const orderStatuses = pgEnum('OrderStatus', [
  'PENDING',
  'CANCELLED',
  'COMPLETE',
]);
export const paymentTypes = pgEnum('PaymentTypes', [
  'CARD',
  'GCASH',
  'BANK_TRANSFER',
  'COD',
]);
export const paymentStatuses = pgEnum('PaymentStatus', [
  'PENDING',
  'COMPLETED',
  'FAILED',
  'PARTIAL',
]);
export const userRoles = pgEnum('UserRole', ['CONSUMER', 'SUPPLIER']);
