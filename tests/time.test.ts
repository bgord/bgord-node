import { describe, it, expect } from 'vitest';
import * as Time from '../src/time';

describe('Time', () => {
  describe('Days', () => {
    it('should correctly convert days to hours, minutes, seconds, and ms', () => {
      const days = Time.Days(2);
      expect(days.value).toBe(2);
      expect(days.toHours()).toBe(48);
      expect(days.toMinutes()).toBe(2880);
      expect(days.toSeconds()).toBe(172800);
      expect(days.toMs()).toBe(172800000);
    });
  });

  describe('Hours', () => {
    it('should correctly convert hours to minutes, seconds, and ms', () => {
      const hours = Time.Hours(3);
      expect(hours.value).toBe(3);
      expect(hours.toMinutes()).toBe(180);
      expect(hours.toSeconds()).toBe(10800);
      expect(hours.toMs()).toBe(10800000);
    });
  });

  describe('Minutes', () => {
    it('should correctly convert minutes to seconds and ms', () => {
      const minutes = Time.Minutes(30);
      expect(minutes.value).toBe(30);
      expect(minutes.toSeconds()).toBe(1800);
      expect(minutes.toMs()).toBe(1800000);
    });
  });

  describe('Seconds', () => {
    it('should correctly convert seconds to ms', () => {
      const seconds = Time.Seconds(120);
      expect(seconds.value).toBe(120);
      expect(seconds.toMs()).toBe(120000);
    });
  });
});
