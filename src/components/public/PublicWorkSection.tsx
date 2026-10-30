import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Users, Heart, ArrowRight, HeartPulse, Droplets, Trophy, Sprout, SunMedium } from 'lucide-react';
import type { HomepageSection } from '@/types/database';
import { useLanguage, AutoTranslate } from '@/lib/i18n/LanguageContext';
import { mockHomepageSections } from '@/lib/mock-data';
import { getPublicWorkPageData, type PublicWorkItem } from '@/lib/api';
import SectionHeading from '@/components/ui/SectionHeading';

const CATEGORY_ICONS: Record<string, typeof Building2> = {
  infrastructure: Building2,
  agriculture: Sprout,
  administration: Building2,
  welfare: Users,
  education: GraduationCap,
  healthcare: HeartPulse,
  water: Droplets,
  youth: Trophy,
  women: Users,
  energy: SunMedium,
};

export interface PublicWorkSectionProps {
  section?: HomepageSection | null;
}

const defaultSection = mockHomepageSections.find((s) => s.section_key === 'public_work');

interface InitiativeItem {
  id: string;
  icon: typeof Building2;
  title_en: string;
  title_mr: string;
  desc_en: string;
  desc_mr: string;
  stats_en: string;
  stats_mr: string;
}

const INITIATIVES: InitiativeItem[] = [
  {
    id: 'infrastructure',
    icon: Building2,
    title_en: 'Infrastructure & Rural Development',
    title_mr: 'पायाभूत सुविधा व ग्रामीण विकास',
    desc_en:
      'Expanding village roads, improving irrigation infrastructure, clean drinking water projects, and reliable electricity grids across rural areas.',
    desc_mr:
      'ग्रामीण रस्ते, सिंचन प्रकल्प, शुद्ध पिण्याच्या पाण्याचे नियोजन आणि गावागावांत अखंड वीजपुरवठा उपलब्ध करून देण्यासाठी भरीव पायाभूत विकास.',
    stats_en: 'Key Roads & Water Projects',
    stats_mr: 'प्रमुख रस्ते आणि जल प्रकल्प',
  },
  {
    id: 'education',
    icon: GraduationCap,
    title_en: 'Education & Youth Skill Training',
    title_mr: 'शिक्षण आणि युवा कौशल्य विकास',
    desc_en:
      'Modernizing public school infrastructure, providing digital classrooms, scholarship support for meritorious students, and vocational training centers.',
    desc_mr:
      'शाळांचे आधुनिकीकरण, डिजिटल वर्गखोल्यांची निर्मिती, गुणवंत विद्यार्थ्यांना शिष्यवृत्ती आणि युवकांसाठी रोजगारभिमुख कौशल्य प्रशिक्षण केंद्रे.',
    stats_en: 'Schools & Student Aid',
    stats_mr: 'शाळा आणि विद्यार्थी सहाय्य',
  },
  {
    id: 'welfare',
    icon: Users,
    title_en: 'Community Welfare & Healthcare',
    title_mr: 'समाजकल्याण आणि आरोग्य सेवा',
    desc_en:
      'Organizing periodic free medical camps, primary healthcare center upgrades, women self-help group financing, and senior citizen assistance.',
    desc_mr:
      'मोफत आरोग्य तपासणी शिबिरे, प्राथमिक आरोग्य केंद्रांचे सक्षमीकरण, महिला बचत गटांना आर्थिक पाठबळ आणि ज्येष्ठ नागरिकांसाठी सहाय्यता योजना.',
    stats_en: 'Healthcare Camps & SHGs',
    stats_mr: 'आरोग्य शिबिरे आणि बचत गट',
  },
];

export function PublicWorkSection({ section }: PublicWorkSectionProps) {
  const { isMarathi } = useLanguage();
  const current = section || defaultSection;

  const [items, setItems] = useState<Array<{
    id: string;
    icon: typeof Building2;
    title_en: string;
    title_mr: string;
    desc_en: string;
    desc_mr: string;
    stats_en: string;
    stats_mr: string;
  }>>(INITIATIVES);

  useEffect(() => {
    getPublicWorkPageData().then((res) => {
      if (res && res.initiatives && res.initiatives.length > 0) {
        const top3 = res.initiatives.slice(0, 3).map((init) => ({
          id: init.id,
          icon: CATEGORY_ICONS[init.category] || Building2,
          title_en: init.title_en,
          title_mr: init.title_mr,
          desc_en: init.description_en,
          desc_mr: init.description_mr,
          stats_en: init.metrics_en || init.highlight_tag_en,
          stats_mr: init.metrics_mr || init.highlight_tag_mr,
        }));
        setItems(top3);
      }
    });
  }, []);

  const title = (isMarathi ? current?.title_mr : current?.title_en) ||
    (isMarathi ? 'सार्वजनिक कार्य आणि उपक्रम' : 'Public Work & Initiatives');
  const subtitle = (isMarathi ? current?.subtitle_mr : current?.subtitle_en) ||
    (isMarathi
      ? 'समाजातील प्रत्येक घटकाच्या उन्नतीसाठी राबविलेले शाश्वत विकासाचे प्रकल्प'
      : 'Key focus areas driving inclusive growth, rural empowerment, and sustainable infrastructure');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="py-20 lg:py-28 bg-warmWhite-200/40 border-y border-charcoal-200/80 relative">
      <div className="container-xl">
        {/* Section Heading */}
        <SectionHeading
          badge={isMarathi ? 'विकास कार्य' : 'Initiatives & Works'}
          title={title}
          subtitle={subtitle}
          align="center"
        />

        {/* 3-Column Initiative Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const itemTitle = isMarathi ? item.title_mr : item.title_en;
            const itemDesc = isMarathi ? item.desc_mr : item.desc_en;
            const itemStats = isMarathi ? item.stats_mr : item.stats_en;

            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                className="h-full"
              >
                <Link
                  to="/public-work"
                  className="group relative bg-white rounded-2xl border border-charcoal-200/90 border-t-4 border-t-saffron-500 p-8 shadow-sm hover:shadow-2xl hover:border-saffron-400/80 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between h-full block"
                >
                  <div>
                    {/* Icon Area */}
                    <div className="w-14 h-14 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center mb-6 group-hover:bg-saffron-500 group-hover:text-white transition-all duration-300 shadow-xs group-hover:scale-110 group-hover:shadow-md group-hover:shadow-saffron-500/25">
                      <Icon className="w-7 h-7 transition-transform duration-300" />
                    </div>

                    {/* Tag / Category (Indian Green Accent) */}
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-green-700 block mb-2 font-mono">
                      {itemStats}
                    </span>

                    {/* Title */}
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-charcoal-900 mb-3 group-hover:text-saffron-600 transition-colors">
                      <AutoTranslate en={item.title_en} mr={item.title_mr} />
                    </h3>

                    {/* Short Description */}
                    <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed">
                      <AutoTranslate en={item.desc_en} mr={item.desc_mr} />
                    </p>
                  </div>

                  {/* Card Footer Link */}
                  <div className="mt-8 pt-4 border-t border-charcoal-100 flex items-center justify-between text-saffron-600 font-semibold text-sm">
                    <span className="group-hover:text-saffron-700 transition-colors">
                      {isMarathi ? 'तपशील पहा' : 'Learn more'}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-2" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Button to /public-work */}
        <div className="text-center">
          <Link
            to="/public-work"
            className="btn-primary"
          >
            <span>{isMarathi ? 'सर्व सार्वजनिक कामे पहा' : 'View All Public Work & Initiatives'}</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PublicWorkSection;
