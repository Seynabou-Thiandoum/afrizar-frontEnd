import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ProductImageSliderProps {
  images: string[];
  productName: string;
  className?: string;
  showThumbnails?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showFullscreen?: boolean;
}

const ProductImageSlider: React.FC<ProductImageSliderProps> = ({
  images,
  productName,
  className = '',
  showThumbnails = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  showFullscreen = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, images.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const openFullscreen = () => {
    if (showFullscreen) {
      setIsFullscreen(true);
      setZoomLevel(1);
      setIsZoomed(false);
    }
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setZoomLevel(1);
    setIsZoomed(false);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
    if (zoomLevel <= 1) {
      setIsZoomed(false);
    }
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setIsZoomed(false);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullscreen) {
        switch (event.key) {
          case 'ArrowLeft':
            goToPrevious();
            break;
          case 'ArrowRight':
            goToNext();
            break;
          case 'Escape':
            closeFullscreen();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  if (!images || images.length === 0) {
    return (
      <div className={`w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-500">Aucune image disponible</span>
      </div>
    );
  }

  const renderSlider = (isFullscreenMode = false) => (
    <div className={`relative ${isFullscreenMode ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      {/* Main Image Container */}
      <div className={`relative overflow-hidden ${isFullscreenMode ? 'w-full h-full' : 'w-full h-96'} rounded-lg`}>
        <img
          src={images[currentIndex]}
          alt={`${productName} - Image ${currentIndex + 1}`}
          className={`w-full h-full transition-all duration-300 ${
            isFullscreenMode 
              ? 'object-contain cursor-zoom-out' 
              : 'object-cover cursor-zoom-in'
          }`}
          onClick={isFullscreenMode ? closeFullscreen : openFullscreen}
          style={{
            objectPosition: 'center center',
            transform: isFullscreenMode ? `scale(${zoomLevel})` : 'none',
            transition: 'transform 0.3s ease-in-out'
          }}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 ${
                isFullscreenMode ? 'text-2xl' : 'text-lg'
              }`}
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 ${
                isFullscreenMode ? 'text-2xl' : 'text-lg'
              }`}
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Product Details in Fullscreen */}
        {isFullscreenMode && (
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg max-w-md">
            <h3 className="font-bold text-lg mb-1">{productName}</h3>
            <p className="text-sm opacity-90">Image {currentIndex + 1} sur {images.length}</p>
            <p className="text-xs opacity-75 mt-1">
              Cliquez sur l'image pour fermer • Utilisez les flèches pour naviguer
            </p>
          </div>
        )}

        {/* Zoom Controls */}
        {isFullscreenMode && (
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={handleZoomIn}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
              aria-label="Zoom avant"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
              aria-label="Zoom arrière"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={resetZoom}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
              aria-label="Réinitialiser zoom"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={closeFullscreen}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className={`flex space-x-2 mt-4 ${isFullscreenMode ? 'justify-center' : ''} overflow-x-auto pb-2`}>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                currentIndex === index
                  ? 'border-orange-500 scale-105 shadow-lg'
                  : 'border-gray-300 hover:border-gray-400 hover:scale-105'
              }`}
            >
              <img
                src={image}
                alt={`${productName} - Miniature ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dots Indicator */}
      {!showThumbnails && images.length > 1 && (
        <div className={`flex justify-center space-x-2 mt-4 ${isFullscreenMode ? 'text-white' : ''}`}>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentIndex === index
                  ? 'bg-orange-500'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Main Slider */}
      <div className={className}>
        {renderSlider(false)}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          {renderSlider(true)}
        </div>
      )}
    </>
  );
};

export default ProductImageSlider;
