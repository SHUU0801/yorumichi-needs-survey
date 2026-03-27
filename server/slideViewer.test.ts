import { describe, expect, it } from 'vitest';
// @ts-ignore - importing client-side const for testing
import { slides } from '../client/src/const/slides';

describe('Slide Viewer', () => {
  // Note: This test verifies the slide structure and content
  // The actual slide viewer component is tested through browser interactions
  it('should have exactly 5 slides', () => {
    expect(slides).toHaveLength(5);
  });

  it('should have correct slide types', () => {
    expect(slides[0].type).toBe('title');
    expect(slides[1].type).toBe('content');
    expect(slides[2].type).toBe('content');
    expect(slides[3].type).toBe('content');
    expect(slides[4].type).toBe('survey');
  });

  it('should have slide 1 as title slide', () => {
    const slide = slides[0];
    expect(slide.id).toBe(1);
    expect(slide.title).toContain('夜道');
    expect(slide.subtitle).toBe('YORUMICHI');
  });

  it('should have slide 2 about current app features', () => {
    const slide = slides[1];
    expect(slide.id).toBe(2);
    expect(slide.title).toContain('開発中のWebアプリ');
    expect(slide.title).toContain('ヨルミチ');
  });

  it('should have slide 3 about device with detailed explanation', () => {
    const slide = slides[2];
    expect(slide.id).toBe(3);
    expect(slide.title).toContain('デバイス');
    expect(slide.title).toContain('開発');
  });

  it('should have slide 4 about coupon map feature', () => {
    const slide = slides[3];
    expect(slide.id).toBe(4);
    expect(slide.title).toContain('クーポン連動マップ');
    expect(slide.title).toContain('安全');
  });

  it('should have slide 5 as survey slide', () => {
    const slide = slides[4];
    expect(slide.id).toBe(5);
    expect(slide.type).toBe('survey');
    expect(slide.title).toContain('未来');
  });

  it('should have all slides with required fields', () => {
    slides.forEach((slide: any) => {
      expect(slide).toHaveProperty('id');
      expect(slide).toHaveProperty('title');
      expect(slide).toHaveProperty('content');
      expect(slide).toHaveProperty('type');
      expect([1, 2, 3, 4, 5]).toContain(slide.id);
      expect(['title', 'content', 'survey']).toContain(slide.type);
    });
  });
});
