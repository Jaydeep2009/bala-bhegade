import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, ArrowRight, Expand } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { mockGalleryItems } from '@/lib/mock-data';
import { getVisibleGalleryItems } from '@/lib/api';
import type { GalleryItem } from '@/types/database';
import SectionHeading from '@/components/ui/SectionHeading';
import OptimizedImage from '@/components/ui/OptimizedImage';

export function GallerySection() {
  const { isMarathi } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>(mockGalleryItems);

  useEffect(() => {
    getVisibleGalleryItems().then((data) => {
      if (data && data.length > 0) {
        setItems(data);
      }
    });
  }, []);

  // First 6 images for asymmetric preview
  const displayItems = items.slice(0, 6);

  // Asymmetric grid spans for 6 items
  const layoutClasses = [
    'md:col-span-2 md:row-span-2 h-72 sm:h-96 md:h-full', // Item 0: Large feature
    'md:col-span-1 md:row-span-1 h-64 md:h-56',           // Item 1
    'md:col-span-1 md:row-span-1 h-64 md:h-56',           // Item 2
    'md:col-span-1 md:row-span-2 h-64 md:h-full',         // Item 3: Tall
    'md:col-span-1 md:row-span-1 h-64 md:h-56',           // Item 4
    'md:col-span-1 md:row-span-1 h-64 md:h-56',           // Item 5
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="py-20 lg:py-28 bg-warmWhite-100/70 text-charcoal-900 border-b border-charcoal-200/80 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-saffron-100/30 rounded-full blur-[140px] pointer-events-none -z-0" />

      <div className="container-xl relative z-10">
        {/* Section Heading */}
        <SectionHeading
          badge={isMarathi ? 'फोटो गॅलरी' : 'Photo Gallery'}
          title={isMarathi ? 'क्षणचित्रे आणि जनसंवाद' : 'Moments in Public Service'}
          subtitle={
            isMarathi
              ? 'जनतेशी संवाद, विविध विकासकामांची पाहणी आणि सामाजिक कार्यक्रमांतील स्मरणीय क्षण'
              : 'Glimpses of grassroots outreach, public gatherings, and community events across the constituency'
          }
          align="center"
        />

        {/* Asymmetric Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 mb-14 auto-rows-[200px] md:auto-rows-[160px]"
        >
          {displayItems.map((item, index) => {
            const caption = isMarathi ? item.caption_mr : item.caption_en;
            const altText = isMarathi ? item.alt_text_mr : item.alt_text_en;
            const spanClass = layoutClasses[index] || 'h-64';

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={`group relative overflow-hidden rounded-2xl bg-white border border-charcoal-200/90 shadow-xs hover:shadow-2xl hover:border-saffron-300 hover:-translate-y-1 transition-all duration-500 ease-out ${spanClass}`}
              >
                {/* Optimized Image with Micro-Zoom & Subtle Scale settling */}
                <div className="w-full h-full overflow-hidden">
                  <OptimizedImage
                    src={item.image_url}
                    alt={altText || caption || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Saffron accent top line on hover */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-saffron-500 via-white to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                {/* Hover Overlay with Caption & Glide-Up effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 z-10">
                  <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-saffron-500 text-white shadow-xs">
                        {item.category}
                      </span>
                      <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-saffron-500 transition-colors">
                        <Expand className="w-4 h-4" />
                      </span>
                    </div>
                    {caption && (
                      <p className="text-sm font-medium text-white line-clamp-2 leading-snug">
                        {caption}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Link to /gallery */}
        <div className="text-center">
          <Link
            to="/gallery"
            className="btn-primary"
          >
            <Camera className="w-4 h-4 mr-2" />
            <span>{isMarathi ? 'संपूर्ण फोटो गॅलरी पहा' : 'View Complete Photo Gallery'}</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GallerySection;
