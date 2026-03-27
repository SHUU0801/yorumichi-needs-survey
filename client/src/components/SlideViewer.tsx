import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { slides } from '@/const/slides';
import SurveyForm from './SurveyForm';

interface TouchStart {
  x: number;
  y: number;
}

export default function SlideViewer() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<TouchStart | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = Math.abs(touchEnd.y - touchStart.y);

    // Only consider horizontal swipes (ignore vertical scrolling)
    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe right - go to previous slide
        goToPrevious();
      } else {
        // Swipe left - go to next slide
        goToNext();
      }
    }

    setTouchStart(null);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const slide = slides[currentSlide];

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-white flex flex-col overflow-hidden touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main slide content */}
      <div className="flex-1 overflow-y-auto flex items-start justify-center px-3 py-4 md:px-8 md:py-8 pb-24 md:pb-32">
        <div className="w-full max-w-3xl">
          {slide.type === 'title' && (
            <div className="text-center space-y-4 md:space-y-6 w-full">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-black leading-tight break-words">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-base sm:text-lg md:text-2xl text-gray-600 break-words">{slide.subtitle}</p>
              )}
              {slide.imageId === 'title-illustration' && (
                <div className="flex justify-center my-3 md:my-4">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480058341/LULJ4uwnQxBCxWD9Un2uTn/slide1-title-illustration-B9WJ23ZTTGc5Pj2Kdu259Z.webp"
                    alt="Title Illustration"
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto"
                  />
                </div>
              )}
              <p className="text-xs sm:text-sm md:text-lg text-gray-700 mt-4 md:mt-8 break-words">{slide.content}</p>
            </div>
          )}

          {slide.type === 'content' && (
            <div className="space-y-4 md:space-y-6 w-full">
              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-black break-words">
                {slide.title}
              </h2>
              {slide.imageId && (
                <div className="flex justify-center my-3 md:my-4">
                  {slide.imageId === 'app-illustration' && (
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480058341/LULJ4uwnQxBCxWD9Un2uTn/slide2-app-illustration-59pAiYpDTHYCmtdfob6v2g.webp"
                      alt="App Illustration"
                      className="w-full max-w-sm md:max-w-md h-auto"
                    />
                  )}
                  {slide.imageId === 'device-illustration' && (
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480058341/LULJ4uwnQxBCxWD9Un2uTn/slide3-device-illustration-V64fbGbcTZHVr2ZT2W5uFj.webp"
                      alt="Device Illustration"
                      className="w-full max-w-sm md:max-w-md h-auto"
                    />
                  )}
                  {slide.imageId === 'title-illustration' && (
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480058341/LULJ4uwnQxBCxWD9Un2uTn/slide1-title-illustration-B9WJ23ZTTGc5Pj2Kdu259Z.webp"
                      alt="Title Illustration"
                      className="w-full max-w-sm md:max-w-md h-auto"
                    />
                  )}
                  {slide.imageId === 'coupon-illustration' && (
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480058341/LULJ4uwnQxBCxWD9Un2uTn/slide4-coupon-illustration-nFSZy6KvnNCup3mzBJz5Mv.webp"
                      alt="Coupon Illustration"
                      className="w-full max-w-sm md:max-w-md h-auto"
                    />
                  )}
                  {slide.imageId === 'survey-illustration' && (
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480058341/LULJ4uwnQxBCxWD9Un2uTn/slide5-survey-illustration-oPAUWrsNHq8xKMi3SJwoQu.webp"
                      alt="Survey Illustration"
                      className="w-full max-w-sm md:max-w-md h-auto"
                    />
                  )}
                </div>
              )}
              <div
                className="text-xs sm:text-sm md:text-lg text-gray-700 leading-relaxed break-words"
                dangerouslySetInnerHTML={{ __html: slide.content as string }}
              />
            </div>
          )}

          {slide.type === 'survey' && (
            <div className="space-y-4 md:space-y-6 w-full">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2 break-words">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 break-words">{slide.subtitle}</p>
                )}
              </div>
              <div className="max-h-80 md:max-h-96 overflow-y-auto px-2">
                <SurveyForm />
              </div>
              <p className="text-xs text-gray-400 text-center mt-3 md:mt-4">スワイプで前後のスライドに移動できます</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation controls */}
      <div className="border-t border-gray-200 bg-white p-4 md:p-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          {/* Previous button */}
          <button
            onClick={goToPrevious}
            className="p-2 md:p-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Slide indicators */}
          <div className="flex gap-2 flex-1 justify-center">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-black w-8'
                    : 'bg-gray-300 w-2 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={goToNext}
            className="p-2 md:p-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Slide counter */}
        <div className="text-center mt-4 text-sm text-gray-600">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </div>
  );
}
