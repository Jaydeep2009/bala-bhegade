import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink, Heart, MessageCircle } from 'lucide-react';
import { useLanguage, useAutoTranslate } from '@/lib/i18n/LanguageContext';
import { mockSocialPosts, mockSiteSettings } from '@/lib/mock-data';
import { getFeaturedSocialPosts } from '@/lib/api';
import type { SocialPost } from '@/types/database';
import SectionHeading from '@/components/ui/SectionHeading';

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

function InstagramCardItem({ post, instagramUrl }: { post: SocialPost; instagramUrl: string }) {
  const caption = useAutoTranslate(post.caption_en, post.caption_mr);
  const hasThumbnail = Boolean(post.thumbnail_url);

  return (
    <motion.a
      href={post.post_url || instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      variants={cardVariants}
      className="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-charcoal-200/90 shadow-xs hover:shadow-2xl hover:border-saffron-400 hover:-translate-y-2 transition-all duration-400 ease-out block"
    >
      {/* Image or Styled Placeholder Card with Micro-Zoom */}
      {hasThumbnail ? (
        <div className="w-full h-full bg-charcoal-100 overflow-hidden">
          <img
            src={post.thumbnail_url || ''}
            alt={caption || 'Instagram post'}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              if (target.parentElement) {
                target.parentElement.className =
                  'w-full h-full bg-gradient-to-tr from-amber-700/80 via-pink-700/80 to-purple-800/80 flex flex-col items-center justify-center p-6 text-white text-center';
                target.parentElement.innerHTML = `
                  <svg class="w-10 h-10 mb-3 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  <span class="font-heading font-semibold text-sm line-clamp-3">Instagram Post</span>
                `;
              }
            }}
          />
        </div>
      ) : (
        <div className="w-full h-full bg-gradient-to-tr from-amber-600 via-pink-600 to-purple-700 flex flex-col items-center justify-center p-6 text-white text-center">
          <Instagram className="w-10 h-10 mb-3 opacity-90 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-heading font-semibold text-sm line-clamp-3">
            {caption || 'View post on Instagram'}
          </span>
        </div>
      )}

      {/* Saffron/Green gradient accent top bar on hover */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 via-saffron-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      {/* Hover Overlay with Caption & Stats Glide */}
      <div className="absolute inset-0 bg-charcoal-950/85 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-white z-10">
        <div className="flex items-center justify-between transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <span className="flex items-center gap-1.5 text-xs text-saffron-400 font-medium">
            <Instagram className="w-4 h-4" />
            <span>@balabhegade</span>
          </span>
          <ExternalLink className="w-4 h-4 text-white/80 group-hover:text-saffron-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>

        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {caption && (
            <p className="text-xs text-warmWhite-100 line-clamp-3 leading-relaxed mb-3">
              {caption}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-white/80 pt-2 border-t border-charcoal-800">
            <span className="flex items-center gap-1 hover:text-pink-400 transition-colors">
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
              <span>Like</span>
            </span>
            <span className="flex items-center gap-1 hover:text-saffron-400 transition-colors">
              <MessageCircle className="w-3.5 h-3.5 text-white/80" />
              <span>Comment</span>
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export function InstagramSection() {
  const { isMarathi } = useLanguage();
  const [posts, setPosts] = useState<SocialPost[]>(() => mockSocialPosts.slice(0, 4));

  useEffect(() => {
    let isMounted = true;
    getFeaturedSocialPosts().then((data) => {
      if (isMounted && data && data.length > 0) {
        setPosts(data.slice(0, 4));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const instagramUrl = mockSiteSettings.social.instagram || 'https://instagram.com';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="py-20 lg:py-28 bg-warmWhite-100/50 border-b border-charcoal-200/80 relative overflow-hidden">
      <div className="container-xl">
        {/* Section Heading with Instagram Icon & Cinematic Masked Reveal */}
        <div className="text-center mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 text-pink-700 border border-pink-300/40"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-600" />
            <span>{isMarathi ? 'सोशल मीडिया' : 'Social Feed'}</span>
          </motion.div>

          {/* Masked reveal container */}
          <div className="overflow-hidden py-1">
            <motion.h2
              initial={{ y: '115%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal-900 text-balance"
            >
              {isMarathi ? 'इन्स्टाग्रामवर फॉलो करा' : 'Connect on Instagram'}
            </motion.h2>
          </div>

          {/* Tri-color Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-1.5 mt-4"
          >
            <div className="w-12 h-1 rounded-full bg-saffron-500" />
            <div className="w-3 h-1 rounded-full bg-charcoal-300" />
            <div className="w-3 h-1 rounded-full bg-green-600" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-charcoal-600 mx-auto"
          >
            {isMarathi
              ? 'दौरे, सामाजिक उपक्रम आणि युवा संवादाच्या ताज्या रील्स व पोस्ट्स पहा'
              : 'Follow along for behind-the-scenes moments, constituency tours, updates, and community engagements'}
          </motion.p>
        </div>

        {/* 4-Column Grid with Staggered Domino Wave & Magnetic Lift */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {posts.map((post) => (
            <InstagramCardItem key={post.id} post={post} instagramUrl={instagramUrl} />
          ))}
        </motion.div>

        {/* Profile Link Button */}
        <div className="text-center">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-md bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 group"
          >
            <Instagram className="w-4 h-4" />
            <span>{isMarathi ? 'इन्स्टाग्राम प्रोफाईल पहा (@balabhegade)' : 'Follow on Instagram (@balabhegade)'}</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default InstagramSection;
