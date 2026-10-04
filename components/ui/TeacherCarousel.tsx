"use client";
import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronsLeft, ChevronRight } from "lucide-react";
import TutorCard from "../cards/TutorCard";

interface Teacher {
  id: number;
  name: string;
  bio: string | null;
  expertise: string;
  qualification: string;
  years_of_exp: number;
  image: string;
  intro_video: string;
  image_url: string;
  intro_video_url: string;
  is_top: number;
}

interface TeachersCarouselProps {
  tutors: Teacher[];
}

const TeacherCarousel: React.FC<TeachersCarouselProps> = ({ tutors }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: tutors.length > 3,
      align: "start",
      slidesToScroll: 1,
      breakpoints: {
        "(min-width: 768px)": { slidesToScroll: 1 },
        "(min-width: 1024px)": { slidesToScroll: 1 },
      },
    },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    ],
  );

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setPrevBtnDisabled(!emblaApi.canScrollPrev());
      setNextBtnDisabled(!emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("init", onSelect);
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("init", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();
  const scrollTo = (index: number) => emblaApi && emblaApi.scrollTo(index);

  if (tutors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No tutors available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-3 py-4"
            >
              <TutorCard tutor={tutor} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons - Only show if more than slidesToShow */}
      {tutors.length > 3 && (
        <>
          <button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all hover:bg-gray-50 dark:hover:bg-gray-700 z-10 ${
              prevBtnDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-110"
            }`}
            aria-label="Previous slide"
          >
            <ChevronsLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all hover:bg-gray-50 dark:hover:bg-gray-700 z-10 ${
              nextBtnDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-110"
            }`}
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </>
      )}

      {/* Dots Navigation - Only show if more than 1 slide */}
      {scrollSnaps.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherCarousel;
