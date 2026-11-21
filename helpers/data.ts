// Small data factories so tests never hardcode payloads inline.

export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
};

export const buildBooking = (overrides: Partial<Booking> = {}): Booking => ({
  firstname: `QA-${Date.now()}`,
  lastname: 'Automation',
  totalprice: 150,
  depositpaid: true,
  bookingdates: { checkin: '2026-01-01', checkout: '2026-01-05' },
  additionalneeds: 'Breakfast',
  ...overrides,
});

export type CheckoutInfo = { firstName: string; lastName: string; postalCode: string };

export const buildCheckoutInfo = (overrides: Partial<CheckoutInfo> = {}): CheckoutInfo => ({
  firstName: 'Alexandra',
  lastName: 'Miranda',
  postalCode: `${Date.now()}`.slice(-5),
  ...overrides,
});
