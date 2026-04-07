import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  alt: string;
}

const PhotoGallery = ({ images, alt }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const navigate = (dir: 1 | -1) => {
    setActiveIndex((prev) => (prev + dir + images.length) % images.length);
  };

  return (
    <>
      {/* Main image */}
      <div
        className="relative w-full aspect-[3/2] rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => setLightboxOpen(true)}
      >
        <img
          src={images[activeIndex]}
          alt={`${alt} - photo ${activeIndex + 1}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 mt-2">
        {images.slice(0, 5).map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative w-1/5 aspect-[3/2] rounded-md overflow-hidden border-2 transition-all ${
              i === activeIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <img src={img} alt={`${alt} thumb ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-md text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 p-2 rounded-md text-foreground hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <img
            src={images[activeIndex]}
            alt={`${alt} - full ${activeIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
          />
          <button
            onClick={() => navigate(1)}
            className="absolute right-4 p-2 rounded-md text-foreground hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <div className="absolute bottom-6 font-heading text-sm text-muted-foreground tracking-wider">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGallery;