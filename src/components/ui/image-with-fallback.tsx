'use client';

import React, { useState, useRef } from 'react';
import Image, { ImageProps } from 'next/image';
import { fixImageUrl } from '@/lib/image-fix';

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string;
}

/**
 * Image component with fallback mechanism
 * Automatically handles image loading errors and unsafe URL formats
 */
export default function ImageWithFallback({
  fallbackSrc = '/images/placeholder-therapist.jpg',
  alt,
  src,
  ...props
}: ImageWithFallbackProps) {
  // Debug original source
  console.log('ImageWithFallback - Original src:', src);
  
  // Use safely processed image URL
  const safeSrc = typeof src === 'string' ? fixImageUrl(src) : fallbackSrc;
  console.log('ImageWithFallback - Processed safeSrc:', safeSrc);
  
  // Safe path for fallback image
  const safeFallbackSrc = fixImageUrl(fallbackSrc);
  console.log('ImageWithFallback - Fallback src:', safeFallbackSrc);
  
  // Simplified error handling state
  const [error, setError] = useState(false);
  const errorsRef = useRef(0);
  
  // Handle image loading error - immediately use placeholder
  const handleError = () => {
    // Limit retry attempts to avoid infinite loops
    if (errorsRef.current > 0) {
      console.log('ImageWithFallback - Already tried once, using fallback image');
      setError(true);
      return;
    }
    
    errorsRef.current += 1;
    console.warn('Image loading failed, using placeholder:', safeSrc);
    setError(true);
  };
  
  return (
    <Image
      alt={alt || 'Image'}
      src={error ? safeFallbackSrc : safeSrc}
      {...props}
      onError={handleError}
      priority={props.priority}
    />
  );
} 