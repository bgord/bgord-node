import { describe, it, expect } from 'vitest';
import { Time } from '../src/time';

describe('Time', () => {
  describe('Days', () => {
    it('should correctly convert days', () => {
      const days = Time.Days(2);
      expect(days.days).toBe(2);
      expect(days.hours).toBe(48);
      expect(days.minutes).toBe(2880);
      expect(days.seconds).toBe(172800);
      expect(days.ms).toBe(172800000);
    });
  });

  describe('Hours', () => {
    it('should correctly convert hours', () => {
      const hours = Time.Hours(3);
      expect(hours.days).toBe(0.13);
      expect(hours.hours).toBe(3);
      expect(hours.minutes).toBe(180);
      expect(hours.seconds).toBe(10800);
      expect(hours.ms).toBe(10800000);
    });
  });

  describe('Minutes', () => {
    it('should correctly convert minutes', () => {
      const minutes = Time.Minutes(30);
      expect(minutes.days).toBe(0.02);
      expect(minutes.hours).toBe(0.5);
      expect(minutes.minutes).toBe(30);
      expect(minutes.seconds).toBe(1800);
      expect(minutes.ms).toBe(1800000);
    });
  });

  describe('Seconds', () => {
    it('should correctly convert seconds', () => {
      const seconds = Time.Seconds(120);
      expect(seconds.days).toBe(0);
      expect(seconds.hours).toBe(0.03);
      expect(seconds.minutes).toBe(2);
      expect(seconds.seconds).toBe(120);
      expect(seconds.ms).toBe(120000);
    });
  });

  describe('Ms', () => {
    it('should correctly convert ms', () => {
      const ms = Time.Ms(500);
      expect(ms.days).toBe(0);
      expect(ms.hours).toBe(0);
      expect(ms.minutes).toBe(0.01);
      expect(ms.seconds).toBe(0.5);
      expect(ms.ms).toBe(500);
    });
  });

  describe('Now', () => {
    it('minus', () => {
      const result = Time.Now(1700000000000).Minus(Time.Ms(500));
      expect(result.ms).toEqual(1699999999500);
    });

    it('add', () => {
      const result = Time.Now(1700000000000).Add(Time.Ms(500));
      expect(result.ms).toEqual(1700000000500);
    });
  });
});
