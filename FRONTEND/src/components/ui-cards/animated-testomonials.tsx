"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion } from "framer-motion";
// import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { cn } from "../../utils/utils-home";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  className,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
  className?: string;
}) => {
  const [active, setActive] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Start or reset autoplay timer
  const resetAutoplayTimer = () => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
    }
    
    if (autoplay) {
      autoplayTimerRef.current = setTimeout(() => {
        handleNext();
      }, 5000);
    }
  };

  // Handle navigating to next testimonial
  const handleNext = () => {
    if (isAnimating) return; // Prevent simultaneous animations
    
    setIsAnimating(true);
    // Always smoothly advance to next index (will loop back automatically)
    setActive((prev) => (prev + 1) % testimonials.length);
    
    // Reset animation lock after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
    
    resetAutoplayTimer();
  };

  // Handle navigating to previous testimonial
  const handlePrev = () => {
    if (isAnimating) return; // Prevent simultaneous animations
    
    setIsAnimating(true);
    // Always smoothly go to previous index (will loop back automatically)
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    
    // Reset animation lock after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
    
    resetAutoplayTimer();
  };

  // Set up autoplay when component mounts
  useEffect(() => {
    resetAutoplayTimer();
    
    // Clean up timer when component unmounts
    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [autoplay]);
  
  // Do a layout shift if we don't have at least 3 testimonials
  const visualTestimonials = testimonials.length < 3 
    ? [...testimonials, ...testimonials, ...testimonials].slice(0, Math.max(3, testimonials.length * 2))
    : testimonials;

  // Get all visible indices for carousel
  const getVisibleIndices = () => {
    const result = [];
    const totalCards = visualTestimonials.length;
    
    // Always show 5 cards (or all cards if less than 5)
    const halfVisible = Math.min(2, Math.floor(totalCards / 2));
    
    // Add cards before the active card
    for (let i = halfVisible; i > 0; i--) {
      let idx = (active - i + totalCards) % totalCards;
      result.push(idx);
    }
    
    // Add the active card
    result.push(active);
    
    // Add cards after the active card
    for (let i = 1; i <= halfVisible; i++) {
      let idx = (active + i) % totalCards;
      result.push(idx);
    }
    
    return result;
  };

  // Calculate card style based on its position relative to active
  const getCardStyle = (index: number) => {
    const visibleIndices = getVisibleIndices();
    const position = visibleIndices.indexOf(index);
    
    // Card is not currently visible
    if (position === -1) {
      return {
        zIndex: 0,
        x: 0,
        opacity: 0,
        scale: 0.8,
        rotate: 0,
      };
    }
    
    // Calculate central position (0=leftmost, 2=center, 4=rightmost for 5 cards)
    const centerPosition = Math.floor(visibleIndices.length / 2);
    const distanceFromCenter = position - centerPosition;
    
    // Constants for card positioning
    const xOffsetPerStep = 150;
    const rotationPerStep = 5;
    const scaleDecrement = 0.08;
    
    return {
      // Higher z-index for cards closer to center
      zIndex: 100 - Math.abs(distanceFromCenter) * 10,
      // X position based on distance from center
      x: distanceFromCenter * xOffsetPerStep,
      // Full opacity for center, slightly less for others
      opacity: 1 - Math.min(0.3, Math.abs(distanceFromCenter) * 0.15),
      // Scale down cards further from center
      scale: 1 - Math.abs(distanceFromCenter) * scaleDecrement,
      // Rotate cards based on position
      rotate: -distanceFromCenter * rotationPerStep,
    };
  };

  return (
    <div className={cn("max-w-sm md:max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-20", className)}>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <div className="relative h-80 w-full">
            {visualTestimonials.map((testimonial, index) => {
              const style = getCardStyle(index);
              
              return (
                <motion.div
                  key={`testimonial-${index}`}
                  initial={false}
                  animate={{
                    x: style.x,
                    opacity: style.opacity,
                    scale: style.scale,
                    rotate: style.rotate,
                    zIndex: style.zIndex,
                    y: index === active ? [0, -20, 0] : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    opacity: { duration: 0.4 },
                    y: { 
                      duration: 1, 
                      repeat: index === active ? Infinity : 0,
                      repeatType: "reverse"
                    },
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between flex-col py-4">
          <motion.div
            key={`content-${active}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-foreground">
              {visualTestimonials[active].name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {visualTestimonials[active].designation}
            </p>
            <motion.p className="text-lg text-muted-foreground mt-8">
              {visualTestimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              title="Previous testimonial"
              onClick={handlePrev}
              disabled={isAnimating}
              className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center group/button disabled:opacity-50"
            >
              <IconArrowLeft className="h-5 w-5 text-foreground group-hover/button:rotate-12 transition-transform duration-300" />
            </button>
            <button
              title="Next testimonial"
              onClick={handleNext}
              disabled={isAnimating}
              className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center group/button disabled:opacity-50"
            >
              <IconArrowRight className="h-5 w-5 text-foreground group-hover/button:-rotate-12 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};