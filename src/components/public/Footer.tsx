import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { useLanguage, useTranslation } from '@/lib/i18n/LanguageContext';
import { mockSiteSettings } from '@/lib/mock-data';
import { getLeaderProfile, getContactPageData, type LeaderProfile, type ContactPageData } from '@/lib/api';

export function Footer() {
  const { isMarathi } = useLanguage();
  const tr = useTranslation();
  const [leader, setLeader] = useState<LeaderProfile>(mockSiteSettings.profile);
  const [contactInfo, setContactInfo] = useState<ContactPageData | null>(null);

  useEffect(() => {
    getLeaderProfile().then((data) => {
      if (data) {
        setLeader(data);
      }
    });

    getContactPageData().then((data) => {
      if (data) {
        setContactInfo(data);
      }
    });
  }, []);

  const primaryOffice = contactInfo?.offices?.find((o) => o.is_primary) || contactInfo?.offices?.[0];
  const footerAddress = isMarathi
    ? (primaryOffice?.address_mr || mockSiteSettings.contact.office_address_mr)
    : (primaryOffice?.address_en || mockSiteSettings.contact.office_address_en);
  const footerPhone = primaryOffice?.phone || contactInfo?.helpline?.phone || mockSiteSettings.contact.phone;
  const footerEmail = primaryOffice?.email || mockSiteSettings.contact.email;

  const quickLinks = [
    { label: tr('nav.home'), to: '/' },
    { label: tr('nav.about'), to: '/about' },
    { label: tr('nav.publicWork'), to: '/public-work' },
    { label: tr('nav.news'), to: '/news' },
    { label: tr('nav.gallery'), to: '/gallery' },
    { label: tr('nav.events'), to: '/events' },
    { label: tr('nav.contact'), to: '/contact' },
  ];

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: mockSiteSettings.social.instagram || '#' },
    { name: 'Twitter / X', icon: Twitter, href: mockSiteSettings.social.twitter || '#' },
    { name: 'Facebook', icon: Facebook, href: mockSiteSettings.social.facebook || '#' },
    { name: 'YouTube', icon: Youtube, href: mockSiteSettings.social.youtube || '#' },
  ];

  return (
    <footer className="bg-charcoal-950 text-charcoal-300 pt-16 pb-12 border-t-2 border-t-saffron-500 relative">
      {/* Subtle Tri-Color Accent Line at Top of Footer */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="w-1/3 bg-saffron-500" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-green-600" />
      </div>

      <div className="container-xl">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14">
          {/* Column 1: Profile & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-charcoal-900 border-2 border-saffron-500 flex-shrink-0 flex items-center justify-center shadow-md">
                <img
                  src={leader.profile_image || mockSiteSettings.profile.profile_image}
                  alt="Bala Bhegade"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.innerHTML = '<span class="font-heading font-bold text-lg text-saffron-400">BB</span>';
                    }
                  }}
                />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-white tracking-wide">
                  {isMarathi ? leader.name_mr || mockSiteSettings.profile.name_mr : leader.name_en || mockSiteSettings.profile.name_en}
                </h3>
                <p className="text-xs text-saffron-400 font-medium">
                  {isMarathi ? leader.title_mr || mockSiteSettings.profile.title_mr : leader.title_en || mockSiteSettings.profile.title_en}
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-charcoal-300 pr-2">
              {isMarathi
                ? 'जनसेवेसाठी समर्पित नेतृत्व. विकास, पारदर्शकता आणि जनकल्याणासाठी अविरत प्रयत्नशील.'
                : 'Dedicated to public service, community empowerment, sustainable development, and transparent leadership.'}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>{tr('footer.quickLinks')}</span>
              <span className="w-8 h-0.5 bg-saffron-500 rounded-full inline-block" />
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-charcoal-300 hover:text-saffron-400 transition-colors duration-200 inline-flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron-500 mr-2 group-hover:bg-green-500 transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Connect / Social */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>{tr('footer.connect')}</span>
              <span className="w-8 h-0.5 bg-saffron-500 rounded-full inline-block" />
            </h4>
            <p className="text-xs text-charcoal-400 mb-4">
              {isMarathi ? 'सोशल मीडियावर जोडले जा आणि ताज्या घडामोडी जाणून घ्या.' : 'Connect on social media and stay updated with the latest community initiatives.'}
            </p>
            <div className="space-y-2.5">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 border border-charcoal-800 text-sm text-charcoal-200 hover:text-saffron-400 transition-all duration-200 group"
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-saffron-400 group-hover:scale-110 transition-transform" />
                      <span>{social.name}</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-saffron-400" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 4: Office Info */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>{tr('footer.office')}</span>
              <span className="w-8 h-0.5 bg-saffron-500 rounded-full inline-block" />
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-saffron-400 mt-1 flex-shrink-0" />
                <span className="text-charcoal-300">
                  {footerAddress}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-saffron-400 flex-shrink-0" />
                <span className="text-charcoal-300 font-mono text-xs sm:text-sm">
                  {footerPhone}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-saffron-400 flex-shrink-0" />
                <span className="text-charcoal-300">
                  {footerEmail}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider line in charcoal-800 */}
        <div className="border-t border-charcoal-800" />

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-400 gap-4">
          <p>
            © 2026 Bala Bhegade. {tr('footer.rights')}
          </p>
          <div className="flex items-center space-x-6">
            <Link
              to="/privacy"
              className="hover:text-saffron-400 transition-colors underline-offset-4 hover:underline"
            >
              {tr('footer.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
