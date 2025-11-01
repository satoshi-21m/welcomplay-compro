"use client"

import { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

export function ImageCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    skipSnaps: false,
    dragFree: false
  })
  
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onSelect = () => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }

  const scrollTo = (index: number) => {
    if (!emblaApi) return
    emblaApi.scrollTo(index)
  }

  useEffect(() => {
    if (!emblaApi) return

    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi])

  // Auto-slide
  useEffect(() => {
    if (!emblaApi) return

    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [emblaApi])

  return (
    <div className="relative w-full overflow-hidden">
      {/* Carousel Container */}
      <div className="embla overflow-hidden w-full" ref={emblaRef}>
        <div className="embla__container flex w-full">
          {/* Slide 1 */}
          <div className="embla__slide flex-[0_0_100%] min-w-0 w-full">
            <img 
              src="/images/promo/spesial-promo-1.webp" 
              alt="Promo Spesial 1" 
              className="w-full aspect-[9/16] object-contain rounded-lg pointer-events-none scale-60 mx-auto"
              draggable={false}
            />
          </div>
          
          {/* Slide 2 */}
          <div className="embla__slide flex-[0_0_100%] min-w-0 w-full">
            <img 
              src="/images/promo/spesial-promo-2.webp" 
              alt="Promo Spesial 2" 
              className="w-full aspect-[9/16] object-contain rounded-lg pointer-events-none scale-60 mx-auto"
              draggable={false}
            />
          </div>
          
          {/* Slide 3 */}
          <div className="embla__slide flex-[0_0_100%] min-w-0 w-full">
            <img 
              src="/images/promo/spesial-promo-3.webp" 
              alt="Promo Spesial 3" 
              className="w-full aspect-[9/16] object-contain rounded-lg pointer-events-none scale-60 mx-auto"
              draggable={false}
            />
          </div>
          
          {/* Slide 4 */}
          <div className="embla__slide flex-[0_0_100%] min-w-0 w-full">
            <img 
              src="/images/promo/spesial-promo-4.webp" 
              alt="Promo Spesial 4" 
              className="w-full aspect-[9/16] object-contain rounded-lg pointer-events-none scale-60 mx-auto"
              draggable={false}
            />
          </div>
        </div>
        
        {/* Navigation Dots */}
        <div className="flex justify-center -mt-10 space-x-2">
          {scrollSnaps.map((_, index) => (
            <button 
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === selectedIndex
                  ? 'bg-custom-red w-6'
                  : 'bg-gray-300 hover:bg-gray-400 hover:scale-105'
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
