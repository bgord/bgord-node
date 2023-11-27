import express from 'express';
import { describe, test, expect } from 'vitest';
import request from 'supertest';

import { TimeZoneOffset } from '../src/time-zone-offset';
import { Time } from '../src/time';

describe('TimeZoneOffset middleware', () => {
  test('sets timeZoneOffset for valid header', async () => {
    const app = express();

    TimeZoneOffset.applyTo(app);

    app.get('/ping', (request, response) =>
      response.status(200).json({ timeZoneOffset: request.timeZoneOffset })
    );

    const result = await request(app)
      .get('/ping')
      .set('time-zone-offset', '120')
      .expect(200);

    expect(result.body.timeZoneOffset).toEqual({
      minutes: Time.Minutes(120).value,
      seconds: Time.Minutes(120).seconds,
      miliseconds: Time.Minutes(120).ms,
    });
  });

  test('handles missing time-zone-offset header gracefully', async () => {
    const app = express();

    TimeZoneOffset.applyTo(app);

    app.get('/ping', (request, response) =>
      response.status(200).json({ timeZoneOffset: request.timeZoneOffset })
    );

    const result = await request(app)
      .get('/ping')
      .expect(200);

    expect(result.body.timeZoneOffset).toEqual({
      minutes: 0,
      seconds: 0,
      miliseconds: 0,
    });
  });

  test('handles invalid time-zone-offset header gracefully', async () => {
    const app = express();

    TimeZoneOffset.applyTo(app);

    app.get('/ping', (request, response) =>
      response.status(200).json({ timeZoneOffset: request.timeZoneOffset })
    );

    const result = await request(app)
      .get('/ping')
      .set('time-zone-offset', 'invalid-offset')
      .expect(200);

    expect(result.body.timeZoneOffset).toEqual({
      minutes: 0,
      seconds: 0,
      miliseconds: 0,
    });
  });

  test('adjusts timestamp with positive timeZoneOffset', () => {
    const timestamp = 0;
    const timeZoneOffsetMs = Time.Seconds(60).ms;

    const adjustedTimestamp = TimeZoneOffset.adjustTimestamp(
      timestamp,
      timeZoneOffsetMs
    );

    expect(adjustedTimestamp).toBe(-60000);
  });

  test('adjusts timestamp with negative timeZoneOffset', () => {
    const timestamp = 0;
    const timeZoneOffsetMs = -Time.Seconds(60).ms;

    const adjustedTimestamp = TimeZoneOffset.adjustTimestamp(
      timestamp,
      timeZoneOffsetMs
    );

    expect(adjustedTimestamp).toBe(60000);
  });

  test('adjusts date with positive timeZoneOffset', () => {
    const timestamp = 0;
    const timeZoneOffsetMs = Time.Seconds(60).ms;

    const adjustedDate = TimeZoneOffset.adjustDate(timestamp, timeZoneOffsetMs);

    expect(adjustedDate).toEqual(new Date(-timeZoneOffsetMs));
  });

  test('adjusts date with negative timeZoneOffset', () => {
    const timestamp = 0;
    const timeZoneOffsetMs = -Time.Seconds(60).ms;

    const adjustedDate = TimeZoneOffset.adjustDate(timestamp, timeZoneOffsetMs);

    expect(adjustedDate).toEqual(new Date(adjustedDate));
  });
});
