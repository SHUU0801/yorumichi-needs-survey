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
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const slide = slides[currentSlide];
  const isSurveySlide = slide.type === 'survey';
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div
      ref={containerRef}
      className={`w-full bg-white flex flex-col touch-pan-y ${isSurveySlide ? 'min-h-screen' : 'h-screen overflow-hidden'}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main slide content */}
      <div
        className={`flex-1 flex items-start justify-center px-3 py-4 md:px-8 md:py-8 pb-24 md:pb-32 ${
          isSurveySlide ? '' : 'overflow-y-auto'
        }`}
      >
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
            <div className="flex min-h-full flex-col gap-4 md:gap-6 w-full">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2 break-words">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 break-words">{slide.subtitle}</p>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="px-4 py-4 md:px-6 md:py-6">
                  <SurveyForm onSubmitSuccess={() => setCurrentSlide(0)} />
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center">スワイプで前後のスライドに移動できます</p>
            </div>
          )}

        </div>
      </div>

      <div className="pointer-events-none fixed inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-2 md:hidden">
        <button
          onClick={goToPrevious}
          disabled={isFirstSlide}
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-md backdrop-blur transition-colors hover:bg-white disabled:opacity-0 disabled:pointer-events-none"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={goToNext}
          disabled={isLastSlide}
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-md backdrop-blur transition-colors hover:bg-white disabled:opacity-0 disabled:pointer-events-none"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation controls */}
      <div className="sticky bottom-0 z-20 border-t border-gray-200 bg-white/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 md:p-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          {/* Previous button */}
          <button
            onClick={goToPrevious}
            disabled={isFirstSlide}
            className="p-2 md:p-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
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
            disabled={isLastSlide}
            className="p-2 md:p-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
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
