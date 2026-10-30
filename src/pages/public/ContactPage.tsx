import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Sparkles,
  Info,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Building2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { mockSiteSettings } from '@/lib/mock-data';
import {
  getContactPageData,
  type ContactPageData,
  type OfficeLocation,
} from '@/lib/api';
import { DEFAULT_CONTACT_PAGE_DATA } from '@/lib/pageDataDefaults';

export default function ContactPage() {
  const { t, isMarathi } = useLanguage();
  const [pageData, setPageData] = useState<ContactPageData>(DEFAULT_CONTACT_PAGE_DATA);

  useEffect(() => {
    getContactPageData().then((res) => {
      if (res && res.offices && res.offices.length > 0) {
        setPageData(res);
      }
    });
  }, []);

  const offices = pageData.offices;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    subject: 'general',
    message: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-ivory-50 text-charcoal-900 pb-20">
      <Helmet>
        <title>
          {isMarathi
            ? 'संपर्क - बाळा भेगडे | जनसंपर्क कार्यालय'
            : 'Contact - Bala Bhegade | Public Relations Office'}
        </title>
        <meta
          name="description"
          content={
            isMarathi
              ? 'बाळा भेगडे यांच्या जनसंपर्क कार्यालयाशी संपर्क साधा. पत्ता, दूरध्वनी, ईमेल आणि निवेदन पाठवण्याची सुविधा.'
              : 'Contact the office of Bala Bhegade. Office address, phone numbers, email, citizen grievance desk, and visiting hours.'
          }
        />
      </Helmet>

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-warmWhite-200 via-white to-warmWhite-100 text-charcoal-900 py-16 sm:py-20 border-b border-charcoal-200/80">
        <div className="container-xl">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-700 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4">
              <MessageSquare className="w-3.5 h-3.5 text-saffron-500" />
              {t(pageData.header.badge_en, pageData.header.badge_mr)}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal-900 mb-4">
              {t(pageData.header.title_en, pageData.header.title_mr)}
            </h1>
            <p className="text-charcoal-700 text-base sm:text-lg leading-relaxed">
              {t(pageData.header.subtitle_en, pageData.header.subtitle_mr)}
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="container-xl mt-10 sm:mt-14">
        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          {/* Left Column: Contact Information & Offices List */}
          <div className="lg:col-span-5 space-y-6">
            {offices.map((office) => (
              <div key={office.id} className="bg-white rounded-2xl p-6 sm:p-7 border border-charcoal-200 shadow-xs space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-charcoal-100">
                  <div className="w-10 h-10 rounded-lg bg-saffron-50 text-saffron-600 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-charcoal-900">
                      {t(office.name_en, office.name_mr)}
                    </h2>
                    <p className="text-xs text-charcoal-500">
                      {t(office.role_en, office.role_mr)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-charcoal-700">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-saffron-50 text-saffron-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-900 text-xs uppercase tracking-wider mb-0.5">
                        {t('Office Address', 'कार्यालय पत्ता')}
                      </h3>
                      <p className="text-charcoal-600 text-xs sm:text-sm leading-relaxed">
                        {t(office.address_en, office.address_mr)}
                      </p>
                    </div>
                  </div>

                  {/* Visiting Hours */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-warmWhite-300 text-charcoal-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-900 text-xs uppercase tracking-wider mb-0.5">
                        {t('Office & Visiting Hours', 'भेटण्याची वेळ व कार्यालयीन वेळ')}
                      </h3>
                      <p className="text-charcoal-600 text-xs sm:text-sm leading-relaxed">
                        {t(office.hours_en, office.hours_mr)}
                      </p>
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-charcoal-100">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-700" />
                      <a
                        href={`tel:${office.phone}`}
                        className="text-saffron-600 hover:text-saffron-700 font-semibold text-xs"
                      >
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-saffron-600" />
                      <a
                        href={`mailto:${office.email}`}
                        className="text-charcoal-700 hover:text-saffron-600 text-xs truncate"
                      >
                        {office.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Emergency Hotline Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Phone className="w-4 h-4" />
                <span>{t(pageData.helpline.label_en, pageData.helpline.label_mr)}</span>
              </div>
              <a
                href={`tel:${pageData.helpline.phone}`}
                className="text-2xl font-bold tracking-tight block hover:underline"
              >
                {pageData.helpline.phone}
              </a>
              <p className="text-white/80 text-xs leading-relaxed pt-1 border-t border-white/20">
                {t(pageData.visiting_notice_en, pageData.visiting_notice_mr)}
              </p>
            </div>

            {/* Map Placeholder Card */}
            <div className="bg-white rounded-2xl p-6 border border-charcoal-200 shadow-sm overflow-hidden">
              <h3 className="font-heading text-lg font-bold text-charcoal-900 mb-2">
                {t('Office Location Map', 'कार्यालय स्थान नकाशा')}
              </h3>
              <p className="text-xs text-charcoal-500 mb-4">
                {t(
                  'Conveniently accessible from major highways and public transit stations.',
                  'महामार्ग व बस स्थानकापासून सहज पोहोचण्यायोग्य मध्यवर्ती ठिकाण.'
                )}
              </p>

              {/* Stylized Visual Map Placeholder */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-br from-saffron-50/70 via-warm-50 to-emerald-50/70 flex flex-col items-center justify-center p-6 text-center text-charcoal-900 border border-saffron-200">
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#F58220_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="w-12 h-12 rounded-full bg-saffron-100 border border-saffron-300 flex items-center justify-center mb-3 shadow-md relative z-10">
                  <MapPin className="w-6 h-6 text-saffron-600 animate-bounce" />
                </div>
                <div className="relative z-10 font-heading font-bold text-base text-charcoal-900">
                  {t('Office of Bala Bhegade', 'बाळा भेगडे जनसंपर्क कार्यालय')}
                </div>
                <div className="relative z-10 text-xs text-saffron-700 font-semibold mt-1">
                  {t('Taluka Center • Maval, Pune', 'तालुका केंद्र • मावळ, पुणे')}
                </div>
                <div className="mt-4 relative z-10">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-charcoal-700 bg-white/90 px-3.5 py-1.5 rounded-full border border-saffron-200 shadow-sm">
                    <ExternalLink className="w-3.5 h-3.5 text-saffron-600" />
                    <span>{t('Map Integration Placeholder', 'नकाशा एकत्रीकरण प्लेसहोल्डर')}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Message & Grievance Submission Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-charcoal-200 shadow-sm relative">
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-800 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
                  {t('Citizen Inquiries & Grievances', 'नागरिक निवेदन व तक्रार निवारण')}
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal-950">
                  {t('Send a Message to the Office', 'कार्यालयाला थेट संदेश पाठवा')}
                </h2>
                <p className="text-charcoal-600 text-sm mt-1 leading-relaxed">
                  {t(
                    'Fill in the form below with your inquiry, grievance, or appointment request. Our staff will get in touch.',
                    'आपली समस्या, विकासकामाची सूचना अथवा भेटण्याची विनंती नोंदवा. आमचे प्रतिनिधी आपल्याशी संपर्क साधतील.'
                  )}
                </p>
              </div>

              {/* Informational banner about preview mode */}
              <AnimatePresence>
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 mb-8"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-base text-emerald-950 mb-1">
                          {t('Notice: Preview Mode', 'सूचना: पूर्वावलोकन मोड')}
                        </h4>
                        <p className="text-sm text-emerald-800 leading-relaxed mb-3">
                          {t(
                            'Thank you for testing the contact form! Direct online grievance submission is currently in preview mode and will be connected to the official backend shortly. For immediate assistance, please call the office helpline directly.',
                            'संपर्क फॉर्मची चाचणी घेतल्याबद्दल धन्यवाद! थेट ऑनलाइन तक्रार निवारण प्रणाली लवकरच अधिकृत बॅकएंडशी जोडली जाईल. तातडीच्या कामांसाठी कृपया थेट कार्यालयीन दूरध्वनी क्रमांकावर संपर्क साधावा.'
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={() => setFormSubmitted(false)}
                          className="btn-primary text-xs py-1.5 px-4"
                        >
                          {t('Submit Another Note', 'दुसरी नोंद करा')}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="mb-6 p-3.5 rounded-lg bg-warm-100 border border-saffron-200 text-xs text-charcoal-700 flex items-center gap-2">
                    <Info className="w-4 h-4 text-saffron-600 flex-shrink-0" />
                    <span>
                      {t(
                        'Form submissions are currently for layout preview. Direct backend integration is coming soon.',
                        'सध्या हा फॉर्म मांडणी चाचणीसाठी आहे. प्रत्यक्ष संदेश प्रणाली लवकरच सुरू केली जाईल.'
                      )}
                    </span>
                  </div>
                )}
              </AnimatePresence>

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                      {t('Full Name', 'पूर्ण नाव')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t('Enter your full name', 'आपले पूर्ण नाव प्रविष्ट करा')}
                      className="w-full px-4 py-2.5 rounded-lg border border-charcoal-300 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                      {t('Mobile Number', 'मोबाईल क्रमांक')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={t('+91 98XXX XXXXX', '+९१ ९८XXX XXXXX')}
                      className="w-full px-4 py-2.5 rounded-lg border border-charcoal-300 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                      {t('Email Address', 'ईमेल पत्ता')}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t('name@example.com', 'नाव@example.com')}
                      className="w-full px-4 py-2.5 rounded-lg border border-charcoal-300 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-colors"
                    />
                  </div>

                  {/* Village / Area */}
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                      {t('Village / Ward / Area', 'गाव / प्रभाग / परिसर')}
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder={t('e.g., Maval Taluka', 'उदा. मावळ तालुका')}
                      className="w-full px-4 py-2.5 rounded-lg border border-charcoal-300 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Subject / Category */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    {t('Subject / Inquiry Category', 'विषय / निवेदनाचा प्रकार')}
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-charcoal-300 text-sm text-charcoal-900 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-colors bg-white"
                  >
                    <option value="general">{t('General Public Inquiry', 'सामान्य चौकशी / विचारणा')}</option>
                    <option value="grievance">{t('Public Grievance / Civic Issue', 'नागरी समस्या / तक्रार निवारण')}</option>
                    <option value="development">{t('Development Work Proposal', 'विकासकामाचा प्रस्ताव / मागणी')}</option>
                    <option value="appointment">{t('Appointment / Delegation Request', 'भेटण्याची वेळ / शिष्टमंडळ भेट')}</option>
                    <option value="congratulations">{t('Greetings / Appreciation', 'सदिच्छा / अभिनंदन')}</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    {t('Detailed Message or Request', 'सविस्तर मजकूर अथवा निवेदन')}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t(
                      'Please elaborate on your request, village requirements, or contact needs...',
                      'कृपया आपली समस्या किंवा कामाचे स्वरूप थोडक्यात नमूद करा...'
                    )}
                    className="w-full px-4 py-3 rounded-lg border border-charcoal-300 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-colors"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn-primary w-full py-3 inline-flex items-center justify-center gap-2 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t('Submit Message', 'संदेश सादर करा')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
