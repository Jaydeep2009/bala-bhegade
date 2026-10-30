import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ArrowRight, Instagram, Twitter, Facebook, Youtube, ExternalLink, Navigation } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { mockSiteSettings } from '@/lib/mock-data';
import { getContactPageData, type ContactPageData } from '@/lib/api';
import SectionHeading from '@/components/ui/SectionHeading';

export function ContactSection() {
  const { isMarathi } = useLanguage();
  const [contactData, setContactData] = useState<ContactPageData | null>(null);

  useEffect(() => {
    getContactPageData().then((res) => {
      if (res) setContactData(res);
    });
  }, []);

  const primaryOffice = contactData?.offices?.find((o) => o.is_primary) || contactData?.offices?.[0];
  const address = isMarathi
    ? (primaryOffice?.address_mr || mockSiteSettings.contact.office_address_mr)
    : (primaryOffice?.address_en || mockSiteSettings.contact.office_address_en);
  const phone = primaryOffice?.phone || contactData?.helpline?.phone || mockSiteSettings.contact.phone;
  const email = primaryOffice?.email || mockSiteSettings.contact.email;
  const hours = isMarathi
    ? (primaryOffice?.hours_mr || 'सकाळी १०:०० ते संध्याकाळी ६:००')
    : (primaryOffice?.hours_en || 'Mon - Sat: 10:00 AM - 6:00 PM');

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: mockSiteSettings.social.instagram || '#' },
    { name: 'Twitter / X', icon: Twitter, href: mockSiteSettings.social.twitter || '#' },
    { name: 'Facebook', icon: Facebook, href: mockSiteSettings.social.facebook || '#' },
    { name: 'YouTube', icon: Youtube, href: mockSiteSettings.social.youtube || '#' },
  ];

  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="py-20 lg:py-28 bg-warmWhite-200/50 border-t border-charcoal-200/80 relative">
      <div className="container-xl">
        {/* Section Heading */}
        <SectionHeading
          badge={isMarathi ? 'संपर्क कक्ष' : 'Contact Office'}
          title={isMarathi ? 'थेट संपर्क आणि जनसंपर्क कार्यालय' : 'Get in Touch with the Office'}
          subtitle={
            isMarathi
              ? 'आपल्या समस्या, विकासात्मक सूचना आणि मदतीसाठी आमच्या मध्यवर्ती कार्यालयाशी संपर्क साधा'
              : 'Reach out for inquiries, public grievances, developmental suggestions, or assistance'
          }
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Left Column: Contact Info Cards with Domino Wave & Magnetic Lift */}
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="lg:col-span-5 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              {/* Address Card */}
              <motion.div
                variants={itemVariants}
                className="group bg-white rounded-2xl p-5 sm:p-6 border border-charcoal-200/90 shadow-xs hover:shadow-xl hover:border-saffron-300 hover:-translate-y-1 transition-all duration-300 ease-out flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-saffron-100 transition-all duration-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-charcoal-900 text-base mb-1 group-hover:text-saffron-600 transition-colors">
                    {isMarathi ? 'कार्यालय पत्ता' : 'Central Office Address'}
                  </h4>
                  <p className="text-charcoal-600 text-sm leading-relaxed">
                    {address}
                  </p>
                </div>
              </motion.div>

              {/* Phone Card */}
              <motion.div
                variants={itemVariants}
                className="group bg-white rounded-2xl p-5 sm:p-6 border border-charcoal-200/90 shadow-xs hover:shadow-xl hover:border-green-300 hover:-translate-y-1 transition-all duration-300 ease-out flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-green-100 transition-all duration-300">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-charcoal-900 text-base mb-1 group-hover:text-green-700 transition-colors">
                    {isMarathi ? 'दूरध्वनी' : 'Phone Numbers'}
                  </h4>
                  <p className="text-charcoal-600 text-sm font-mono font-medium">
                    {phone}
                  </p>
                  <p className="text-charcoal-400 text-xs mt-1">
                    {hours}
                  </p>
                </div>
              </motion.div>

              {/* Email Card */}
              <motion.div
                variants={itemVariants}
                className="group bg-white rounded-2xl p-5 sm:p-6 border border-charcoal-200/90 shadow-xs hover:shadow-xl hover:border-saffron-300 hover:-translate-y-1 transition-all duration-300 ease-out flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-saffron-100 transition-all duration-300">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-charcoal-900 text-base mb-1 group-hover:text-saffron-600 transition-colors">
                    {isMarathi ? 'ईमेल संपर्क' : 'Email Inquiries'}
                  </h4>
                  <a
                    href={`mailto:${email}`}
                    className="text-saffron-600 hover:text-saffron-700 text-sm font-medium hover:underline transition-colors block"
                  >
                    {email}
                  </a>
                </div>
              </motion.div>

              {/* Office Hours */}
              <motion.div
                variants={itemVariants}
                className="group bg-white rounded-2xl p-5 sm:p-6 border border-charcoal-200/90 shadow-xs hover:shadow-xl hover:border-charcoal-300 hover:-translate-y-1 transition-all duration-300 ease-out flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-warmWhite-300 text-charcoal-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-charcoal-900 text-base mb-1">
                    {isMarathi ? 'जनसंवाद वेळ' : 'Public Consultation Hours'}
                  </h4>
                  <p className="text-charcoal-600 text-sm">
                    {isMarathi
                      ? 'सोमवार ते शनिवार: सकाळी १०:०० ते दुपारी २:०० (थेट भेट)'
                      : 'Monday to Saturday: 10:00 AM – 2:00 PM (Direct Meeting)'}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Social Media Links & Send Message CTA */}
            <motion.div variants={itemVariants} className="pt-2">
              <p className="text-xs uppercase tracking-wider text-charcoal-500 font-semibold mb-3">
                {isMarathi ? 'सोशल मीडियावर जोडले जा' : 'Connect on Social Media'}
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white border border-charcoal-200 text-charcoal-700 hover:bg-saffron-500 hover:text-white hover:border-saffron-500 hover:scale-105 flex items-center justify-center shadow-xs transition-all duration-200"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>

              <div className="mt-6">
                <Link
                  to="/contact"
                  className="btn-primary"
                >
                  <span>{isMarathi ? 'सविस्तर संपर्क फॉर्म भरा' : 'Send an Inquiry / Grievance'}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Decorative Map Section with Elegant Motion */}
          <motion.div
            initial={{ opacity: 0, x: 25, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col"
          >
            <div className="relative w-full h-full min-h-[420px] rounded-3xl overflow-hidden border border-charcoal-200 shadow-sm bg-warmWhite-100 flex flex-col justify-between">
              {/* Decorative Map Grid / Stylized Graphic */}
              <div className="absolute inset-0 bg-[radial-gradient(#f58220_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
              
              {/* Stylized Map Roads and Geography mockup */}
              <div className="absolute inset-0 opacity-25 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M-50,150 Q200,80 400,220 T900,180" fill="none" stroke="#f58220" strokeWidth="4" />
                  <path d="M100,500 Q300,300 500,380 T800,100" fill="none" stroke="#138808" strokeWidth="3" />
                  <path d="M250,-50 Q280,200 350,550" fill="none" stroke="#d96a10" strokeWidth="2.5" strokeDasharray="6 4" />
                  <circle cx="350" cy="230" r="120" fill="#f58220" fillOpacity="0.05" />
                  <circle cx="350" cy="230" r="60" fill="#138808" fillOpacity="0.06" />
                </svg>
              </div>

              {/* Top Map Card Overlay */}
              <div className="relative z-10 m-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-charcoal-200 max-w-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-saffron-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-heading font-bold text-charcoal-900 text-sm">
                      {isMarathi ? 'मावळ विधानसभा मतदारसंघ' : 'Maval Constituency Office'}
                    </h5>
                    <p className="text-xs text-charcoal-500">
                      Pune District, Maharashtra
                    </p>
                  </div>
                </div>
              </div>

              {/* Center Pin Marker with Graceful Floating Motion */}
              <div className="relative z-10 flex flex-col items-center justify-center self-center my-auto">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                >
                  <div className="w-13 h-13 rounded-full bg-saffron-500 text-white flex items-center justify-center shadow-2xl border-4 border-white p-3">
                    <MapPin className="w-6 h-6 fill-white" />
                  </div>
                  <div className="absolute -inset-2 rounded-full bg-saffron-400/30 animate-ping -z-10" />
                </motion.div>
                <div className="mt-3 bg-charcoal-900 text-white px-3.5 py-1 rounded-full text-xs font-semibold shadow-lg">
                  {isMarathi ? 'मुख्य जनसंपर्क कार्यालय' : 'Main Constituency Office'}
                </div>
              </div>

              {/* Bottom Bar in Map */}
              <div className="relative z-10 m-6 flex items-center justify-between bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-charcoal-200">
                <div className="text-xs text-charcoal-600">
                  <span className="font-semibold text-charcoal-900 block">
                    {isMarathi ? 'कार्यालय भेट मार्गदर्शन' : 'Office Location Guide'}
                  </span>
                  <span>{isMarathi ? 'सोयीस्कर पार्किंग व सुलभ प्रवेश व्यवस्था उपलब्ध' : 'Convenient visitor parking & citizen reception desk'}</span>
                </div>
                <a
                  href={(primaryOffice as any)?.map_url || mockSiteSettings.contact.map_url || 'https://maps.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs py-2 px-3.5"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
