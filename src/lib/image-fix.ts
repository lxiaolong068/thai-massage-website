'use client';

/**
 * Image URL processing and fixing utility
 * Handles common image URL error formats in the project
 */

// Ensure using absolute path without language prefix
const PLACEHOLDER_IMAGE = '/images/placeholder-therapist.jpg';
// List of supported language prefixes
const LOCALE_PREFIXES = ['/en/', '/zh/', '/th/', '/ko/'];

/**
 * Fix potential issues with image URLs
 * - Handle null/undefined cases
 * - Fix duplicate prefixes (like /http://)
 * - Ensure relative paths have correct leading slash
 * - Remove language prefixes
 * 
 * @param url Image URL to process
 * @returns Fixed URL or default image path
 */
export function fixImageUrl(url: string | null | undefined): string {
  // Handle empty values
  if (!url) {
    console.log('Empty URL provided, using placeholder');
    return PLACEHOLDER_IMAGE;
  }

  // If it's any type of placeholder image, return the standard path
  if (url.includes('placeholder-therapist.jpg') || 
      url.includes('placeholder-avatar.jpg') || 
      url.includes('placeholder-image.jpg')) {
    console.log('Using standard placeholder path for:', url);
    return PLACEHOLDER_IMAGE;
  }

  try {
    // Debug original URL
    console.log('Processing image URL:', url);
    
    // Detect dangerous pattern: URLs starting with /http
    if (url.match(/^\/https?:\/\//i) || url.includes('/http')) {
      console.warn('Detected incorrectly formatted URL:', url);
      return PLACEHOLDER_IMAGE;
    }

    // Other URL cleaning
    let processedUrl = url;
    
    // Keep only one leading slash
    processedUrl = processedUrl.replace(/^\/+/, '/');
    
    // Remove language prefixes (/en/, /zh/, /th/, /ko/)
    for (const prefix of LOCALE_PREFIXES) {
      if (processedUrl.startsWith(prefix)) {
        processedUrl = '/' + processedUrl.slice(prefix.length);
        console.log(`Removed URL language prefix: ${url} -> ${processedUrl}`);
        break;
      }
    }
    
    // Ensure URL format is correct
    if (!processedUrl.startsWith('/') && !processedUrl.startsWith('http')) {
      processedUrl = `/${processedUrl}`;
    }
    
    console.log('Final processed URL:', processedUrl);
    return processedUrl;
  } catch (e) {
    console.error('Error processing image URL:', e);
    return PLACEHOLDER_IMAGE;
  }
}

/**
 * Global image error handling function
 * Can be called on the window object
 */
export function handleGlobalImageError(event: Event): void {
  const img = event.target as HTMLImageElement;
  if (!img || !(img instanceof HTMLImageElement)) return;

  const src = img.src || '';
  
  // Check if it's a known problematic URL pattern
  const isErrorPattern = 
    src.includes('/_next/image') && 
    (src.includes('%2Fhttp') || src.includes('%2Fuploads'));
  
  if (isErrorPattern || img.naturalWidth === 0) {
    console.warn('Global image error handler: Fixing image', src);
    // Ensure using path without language prefix
    img.src = PLACEHOLDER_IMAGE;
    // Prevent error event from bubbling up
    event.stopPropagation();
  }
}

/**
 * Register global image error handler
 * Should be called in client components
 */
export function registerGlobalImageErrorHandler(): void {
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      // Only handle image loading errors
      if (event.target && event.target instanceof HTMLImageElement) {
        handleGlobalImageError(event);
      }
    }, true);
    
    console.log('Global image error handler registered');
  }
} 