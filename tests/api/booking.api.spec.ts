import { test, expect } from '../../fixtures/TestFixture';
import { buildBooking } from '../../helpers/data';

// Each request uses data extracted from the previous one: token -> bookingid -> updated booking.
test.describe('Restful-Booker booking lifecycle', () => {
  test('creates, reads, updates and deletes a booking end to end', async ({ bookingApi }) => {
    const token = await bookingApi.createToken('admin', 'password123');
    expect(token).toEqual(expect.any(String));

    const payload = buildBooking();
    const createRes = await bookingApi.createBooking(payload);
    expect(createRes.status()).toBe(200);

    const created = await createRes.json();
    expect(created.booking).toMatchObject(payload);
    const bookingId = created.bookingid;
    expect(bookingId).toEqual(expect.any(Number));

    const readRes = await bookingApi.getBooking(bookingId);
    expect(readRes.status()).toBe(200);
    expect(await readRes.json()).toMatchObject(payload);

    const updatedPayload = buildBooking({
      ...payload,
      bookingdates: { ...payload.bookingdates, checkout: '2026-02-15' },
    });
    const updateRes = await bookingApi.updateBooking(bookingId, token, updatedPayload);
    expect(updateRes.status()).toBe(200);
    expect(await updateRes.json()).toMatchObject(updatedPayload);

    const deleteRes = await bookingApi.deleteBooking(bookingId, token);
    expect(deleteRes.status()).toBe(201);

    const confirmRes = await bookingApi.getBooking(bookingId);
    expect(confirmRes.status()).toBe(404);
  });

  test('GET /booking/:id with an unknown id returns 404 (negative)', async ({ bookingApi }) => {
    const res = await bookingApi.getBooking(999999999);
    expect(res.status()).toBe(404);
  });
});
