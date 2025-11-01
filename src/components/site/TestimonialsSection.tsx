"use client"

import { motion } from "framer-motion"
import { Star, User } from "lucide-react"
import { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } from "react"
import { TESTIMONIALS } from "../../lib/data"
import throttle from 'lodash.throttle'

export const TestimonialsSection = ({
  title = "Apa Kata Klien Kami",
  subtitle = "Testimoni dari klien yang telah mempercayai layanan kami",
  testimonials = TESTIMONIALS
}: any) => {
  // Array warna pastel yang berbeda untuk setiap user
  const pastelColors = [
    'bg-pink-200',
    'bg-blue-200',
    'bg-green-200',
    'bg-yellow-200',
    'bg-purple-200',
    'bg-indigo-200',
    'bg-teal-200',
    'bg-orange-200',
    'bg-red-200',
    'bg-cyan-200'
  ]

  // Array warna text yang lebih gelap untuk setiap user
  const textColors = [
    'text-pink-700',
    'text-blue-700',
    'text-green-700',
    'text-yellow-700',
    'text-purple-700',
    'text-indigo-700',
    'text-teal-700',
    'text-orange-700',
    'text-red-700',
    'text-cyan-700'
  ]

  // Optimasi: Gunakan useMemo untuk extendedTestimonials
  const extendedTestimonials = useMemo(() => [
    testimonials[testimonials.length - 1],
    ...testimonials,
    testimonials[0],
  ], [testimonials])

  // Optimasi: Gunakan useMemo untuk color functions
  const getPastelColor = useCallback((index: number) => {
    return pastelColors[index % pastelColors.length]
  }, [pastelColors])

  const getTextColor = useCallback((index: number) => {
    return textColors[index % textColors.length]
  }, [textColors])

  const [currentSlide, setCurrentSlide] = useState(1) // Start at first real slide
  const carouselWrapperRef = useRef<HTMLDivElement>(null)
  const carouselInnerRef = useRef<HTMLDivElement>(null)
  const [itemFullWidth, setItemFullWidth] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)

  const autoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Optimasi: Gunakan useCallback untuk updateMeasurements
  const updateMeasurements = useCallback(() => {
    if (carouselWrapperRef.current && carouselInnerRef.current && extendedTestimonials.length > 0) {
      const wrapperWidth = carouselWrapperRef.current.offsetWidth
      const innerContentWidth = carouselInnerRef.current.scrollWidth
      const firstItem = carouselInnerRef.current.children[0] as HTMLElement
      if (firstItem) {
        const cardWidth = firstItem.offsetWidth
        const computedStyle = window.getComputedStyle(carouselInnerRef.current)
        const gapValue = Number.parseFloat(computedStyle.gap || "0")
        setItemFullWidth(cardWidth + gapValue)
      }
    }
  }, [extendedTestimonials.length])

  useLayoutEffect(() => {
    updateMeasurements()
    window.addEventListener("resize", updateMeasurements)
    return () => window.removeEventListener("resize", updateMeasurements)
  }, [updateMeasurements])

  // Infinite auto-slide
  useEffect(() => {
    const startAutoSlide = () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current)
        autoSlideIntervalRef.current = null
      }
      autoSlideIntervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => prev + 1)
      }, 5000)
    }
    startAutoSlide()
    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current)
        autoSlideIntervalRef.current = null
      }
    }
  }, [extendedTestimonials.length])

  // Handle mouse/touch events for drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStartX(e.clientX)
    setDragOffset(0)
    
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current)
      autoSlideIntervalRef.current = null
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    const currentX = e.clientX
    const offset = currentX - dragStartX
    setDragOffset(offset)
  }, [isDragging, dragStartX])

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    
    const threshold = itemFullWidth * 0.3 // 30% of card width
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        // Dragged right - go to previous
        setCurrentSlide(prev => Math.max(0, prev - 1))
      } else {
        // Dragged left - go to next
        setCurrentSlide(prev => Math.min(extendedTestimonials.length - 1, prev + 1))
      }
    }
    
    setDragOffset(0)
    
    // Resume auto-slide tanpa delay
    const startAutoSlide = () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current)
        autoSlideIntervalRef.current = null
      }
      autoSlideIntervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => prev + 1)
      }, 5000)
    }
    startAutoSlide()
  }, [isDragging, dragOffset, extendedTestimonials.length, itemFullWidth])

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      handleMouseUp()
    }
  }, [isDragging, handleMouseUp])

  // Touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true)
    setDragStartX(e.touches[0].clientX)
    setDragOffset(0)
    
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current)
      autoSlideIntervalRef.current = null
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return
    const currentX = e.touches[0].clientX
    const offset = currentX - dragStartX
    setDragOffset(offset)
  }, [isDragging, dragStartX])

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    
    const threshold = itemFullWidth * 0.3 // 30% of card width
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        // Dragged right - go to previous
        setCurrentSlide(prev => Math.max(0, prev - 1))
      } else {
        // Dragged left - go to next
        setCurrentSlide(prev => Math.min(extendedTestimonials.length - 1, prev + 1))
      }
    }
    
    setDragOffset(0)
    
    // Resume auto-slide tanpa delay
    const startAutoSlide = () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current)
        autoSlideIntervalRef.current = null
      }
      autoSlideIntervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => prev + 1)
      }, 5000)
    }
    startAutoSlide()
  }, [isDragging, dragOffset, extendedTestimonials.length, itemFullWidth])

  // Handle true endless loop (no animation on jump)
  useEffect(() => {
    if (currentSlide === 0) {
      // Langsung update tanpa delay
      setIsTransitioning(false)
      setCurrentSlide(testimonials.length)
      setIsTransitioning(true)
    } else if (currentSlide === extendedTestimonials.length - 1) {
      // Langsung update tanpa delay
      setIsTransitioning(false)
      setCurrentSlide(1)
      setIsTransitioning(true)
    } else {
      setIsTransitioning(true)
    }
  }, [currentSlide, extendedTestimonials.length, testimonials.length])

  // Calculate x position with drag offset
  const xPosition = -currentSlide * itemFullWidth + dragOffset

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 xl:px-0 bg-muted/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-8 sm:mb-12"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            {title.split(" ").map((word: string, index: number) => 
              word === "Klien" ? (
                <span key={index} className="bg-gradient-to-r from-[#f02028] to-[#d01c22] bg-clip-text text-transparent">
                  {word}{" "}
                </span>
              ) : (
                <span key={index}>{word}{" "}</span>
              )
            )}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>
        <div ref={carouselWrapperRef} className="relative overflow-hidden">
          <motion.div
            ref={carouselInnerRef}
            className="flex gap-4 sm:gap-6 md:gap-8 pl-0 xl:pl-0 cursor-grab active:cursor-grabbing select-none"
            animate={{ x: xPosition }}
            transition={isTransitioning ? { type: "spring", stiffness: 100, damping: 20 } : { duration: 0 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'pan-y' }}
          >
            {extendedTestimonials.map((testimonial: any, index: number) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-full md:w-[calc(50%-16px)] lg:w-[calc(33.33%-21.33px)]"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % testimonials.length) * 0.1 }}
              >
                <div className="h-full rounded-xl sm:rounded-2xl transition-all duration-300 bg-white p-4 sm:p-6 border border-gray-200 hover:border-red-300">
                  <div className="flex items-center mb-3 sm:mb-4 relative">
                    <div className={`relative w-10 h-10 sm:w-14 sm:h-14 mr-3 sm:mr-4 flex items-center justify-center rounded-full ${getPastelColor(index)}`}>
                      <span className={`text-sm sm:text-base md:text-xl font-bold ${getTextColor(index)}`}>
                        {testimonial.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base">{testimonial.name}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex mb-3 sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground italic">"{testimonial.content}"</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        {/* Navigation Dots */}
        <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
          {testimonials.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index + 1)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index + 1 === currentSlide ? "bg-[#f02028] w-6" : "bg-muted-foreground"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
} 