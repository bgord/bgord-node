import { describe, it, expect } from 'vitest';
import { Time } from '../src/time';

describe('Time', () => {
  describe('Days', () => {
    it('should correctly convert days to hours, minutes, seconds, and ms', () => {
      const days = Time.Days(2);
      expect(days.value).toBe(2);
      expect(days.hours).toBe(48);
      expect(days.minutes).toBe(2880);
      expect(days.seconds).toBe(172800);
      expect(days.ms).toBe(172800000);
    });
  });

  describe('Hours', () => {
    it('should correctly convert hours to minutes, seconds, and ms', () => {
      const hours = Time.Hours(3);
      expect(hours.days).toBe(0.13);
      expect(hours.value).toBe(3);
      expect(hours.minutes).toBe(180);
      expect(hours.seconds).toBe(10800);
      expect(hours.ms).toBe(10800000);
    });
  });

  describe('Minutes', () => {
    it('should correctly convert minutes to seconds and ms', () => {
      const minutes = Time.Minutes(30);
      expect(minutes.days).toBe(0.02);
      expect(minutes.hours).toBe(0.5);
      expect(minutes.value).toBe(30);
      expect(minutes.seconds).toBe(1800);
      expect(minutes.ms).toBe(1800000);
    });
  });

  describe('Seconds', () => {
    it('should correctly convert seconds to ms', () => {
      const seconds = Time.Seconds(120);
      expect(seconds.days).toBe(0);
      expect(seconds.hours).toBe(0.03);
      expect(seconds.minutes).toBe(2);
      expect(seconds.value).toBe(120);
      expect(seconds.ms).toBe(120000);
    });
  });
});
