import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  User,
  MapPin,
  Mail,
  Phone,
  Link as LinkIcon,
  Save,
  Globe,
  Check,
  AlertCircle,
  ShieldCheck,
  Share2,
  FileText,
  Languages,
  Sparkles,
  Key,
  Plus,
  Trash2,
  Shield,
} from 'lucide-react';
import { mockSiteSettings } from '@/lib/mock-data';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import ImageUpload from '@/components/ui/ImageUpload';
import {
  getGoogleTranslateApiKey,
  setGoogleTranslateApiKey,
  translateText,
} from '@/lib/translation';
import {
  getPrivacyPageData,
  updatePrivacyPageData,
  type PrivacyPageData,
  type PrivacySectionItem,
} from '@/lib/api';
import { DEFAULT_PRIVACY_PAGE_DATA } from '@/lib/pageDataDefaults';

export const AdminSettings: React.FC = () => {
  // Section 1: Profile
  const [isTranslatingProfile, setIsTranslatingProfile] = useState(false);
  const [profile, setProfile] = useState({
    name_en: mockSiteSettings.profile.name_en,
    name_mr: mockSiteSettings.profile.name_mr,
    title_en: mockSiteSettings.profile.title_en,
    title_mr: mockSiteSettings.profile.title_mr,
    bio_en: mockSiteSettings.profile.bio_en,
    bio_mr: mockSiteSettings.profile.bio_mr,
    profile_image: mockSiteSettings.profile.profile_image,
  });

  // Section 2: Contact
  const [contact, setContact] = useState({
    office_address_en: mockSiteSettings.contact.office_address_en,
    office_address_mr: mockSiteSettings.contact.office_address_mr,
    phone: mockSiteSettings.contact.phone,
    email: mockSiteSettings.contact.email,
  });

  // Section 3: Social Links
  const [social, setSocial] = useState({
    instagram: mockSiteSettings.social.instagram || 'https://instagram.com/',
    twitter: mockSiteSettings.social.twitter || 'https://twitter.com/',
    facebook: mockSiteSettings.social.facebook || 'https://facebook.com/',
    youtube: mockSiteSettings.social.youtube || 'https://youtube.com/',
  });

  // Section 4: Footer
  const [footer, setFooter] = useState({
    copyright_en: '© 2026 Office of Bala Bhegade. All rights reserved.',
    copyright_mr: '© २०२६ मा. बाळा भेगडे कार्यालय. सर्व हक्क राखीव.',
    privacy_policy_link: '/privacy',
  });

  // Section 5: Translation Engine & API Key
  const [googleApiKey, setGoogleApiKey] = useState<string>(() => getGoogleTranslateApiKey());
  const [testInput, setTestInput] = useState('Sanjay Bala Bhegade inspected water infrastructure projects across Maval constituency.');
  const [testOutput, setTestOutput] = useState('');
  const [isTestingTranslate, setIsTestingTranslate] = useState(false);
  const [translateSuccess, setTranslateSuccess] = useState(false);

  // Section 6: Privacy Policy Page (/privacy)
  const [privacy, setPrivacy] = useState<PrivacyPageData>(DEFAULT_PRIVACY_PAGE_DATA);
  const [isTranslatingPrivacy, setIsTranslatingPrivacy] = useState(false);
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  // Saving states per section
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [successSection, setSuccessSection] = useState<string | null>(null);

  // Load existing settings on mount
  useEffect(() => {
    getPrivacyPageData().then((pData) => {
      if (pData && pData.sections && pData.sections.length > 0) {
        setPrivacy(pData);
      }
    });

    async function loadSettings() {
      if (!isSupabaseConfigured || !supabase) return;
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value');

        if (data && !error) {
          data.forEach((row) => {
            if (row.key === 'profile' && row.value) {
              setProfile((prev) => ({ ...prev, ...(row.value as Record<string, any>) }));
            } else if (row.key === 'contact' && row.value) {
              setContact((prev) => ({ ...prev, ...(row.value as Record<string, any>) }));
            } else if (row.key === 'social' && row.value) {
              setSocial((prev) => ({ ...prev, ...(row.value as Record<string, any>) }));
            } else if (row.key === 'footer' && row.value) {
              setFooter((prev) => ({ ...prev, ...(row.value as Record<string, any>) }));
            }
          });
        }

        // Also check if homepage_sections about_intro has an uploaded photo
        const { data: aboutIntro } = await supabase
          .from('homepage_sections')
          .select('image_url')
          .eq('section_key', 'about_intro')
          .maybeSingle();

        if (aboutIntro?.image_url && !aboutIntro.image_url.includes('placeholder-profile')) {
          setProfile((prev) => ({
            ...prev,
            profile_image: prev.profile_image && !prev.profile_image.includes('placeholder-profile')
              ? prev.profile_image
              : aboutIntro.image_url,
          }));
        }
      } catch (err) {
        console.error('Failed to load settings in AdminSettings:', err);
      }
    }

    loadSettings();
  }, []);

  const handleSaveSection = async (sectionName: string, data: Record<string, unknown>) => {
    setSavingSection(sectionName);
    setSuccessSection(null);

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase
          .from('site_settings')
          .upsert({
            key: sectionName,
            value: data,
            language: 'en',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'key,language' });

        // If saving profile, also sync profile_image to homepage_sections (about_intro)
        if (sectionName === 'profile' && typeof data.profile_image === 'string' && data.profile_image) {
          await supabase
            .from('homepage_sections')
            .update({
              image_url: data.profile_image,
              updated_at: new Date().toISOString(),
            })
            .eq('section_key', 'about_intro');
        }
      } else {
        // Dev mode simulation
        await new Promise((res) => setTimeout(res, 500));
      }
      setSuccessSection(sectionName);
      setTimeout(() => setSuccessSection(null), 3000);
    } catch (err) {
      console.error(`Failed to save ${sectionName}:`, err);
    } finally {
      setSavingSection(null);
    }
  };

  const handleSavePrivacy = async () => {
    setIsSavingPrivacy(true);
    setPrivacySaved(false);
    try {
      await updatePrivacyPageData(privacy);
      setPrivacySaved(true);
      setTimeout(() => setPrivacySaved(false), 2500);
    } catch (err) {
      console.error('Failed to save privacy page data:', err);
    } finally {
      setIsSavingPrivacy(false);
    }
  };

  const handleAutoTranslatePrivacy = async () => {
    setIsTranslatingPrivacy(true);
    try {
      const translatedTitle = privacy.title_en
        ? await translateText(privacy.title_en, 'mr')
        : privacy.title_mr;

      const updatedSections = await Promise.all(
        privacy.sections.map(async (sec) => {
          const titleMr = sec.title_en
            ? await translateText(sec.title_en, 'mr')
            : sec.title_mr;
          const contentMr = sec.content_en
            ? await translateText(sec.content_en, 'mr')
            : sec.content_mr;
          return { ...sec, title_mr: titleMr, content_mr: contentMr };
        })
      );

      setPrivacy((prev) => ({
        ...prev,
        title_mr: translatedTitle,
        sections: updatedSections,
      }));
    } catch (err) {
      console.error('Failed to auto-translate privacy:', err);
    } finally {
      setIsTranslatingPrivacy(false);
    }
  };

  const handleAddPrivacySection = () => {
    const newId = `sec_${Date.now()}`;
    const newSec: PrivacySectionItem = {
      id: newId,
      icon_name: 'FileText',
      title_en: 'New Policy Section',
      title_mr: 'नवीन धोरण विभाग',
      content_en: 'Detailed policy description for this section.',
      content_mr: 'या विभागासाठी सविस्तर गोपनीयता तपशील.',
    };
    setPrivacy((prev) => ({
      ...prev,
      sections: [...prev.sections, newSec],
    }));
  };

  const handleDeletePrivacySection = (id: string) => {
    setPrivacy((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== id),
    }));
  };

  const handleUpdatePrivacySection = (
    id: string,
    field: keyof PrivacySectionItem,
    value: string
  ) => {
    setPrivacy((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <Helmet>
        <title>Portal Settings | Admin Bala Bhegade</title>
      </Helmet>

      {/* Header */}
      <div className="border-b border-charcoal-200 pb-5">
        <h1 className="text-2xl font-heading font-semibold text-charcoal-900 flex items-center gap-2.5">
          <Globe className="w-6 h-6 text-saffron-600" />
          Site Configuration & Settings
        </h1>
        <p className="text-sm text-charcoal-500 mt-1">
          Update official leader profile details, contact office addresses, social channels, and portal metadata.
        </p>
      </div>

      {/* Dev Mode Banner */}
      {!isSupabaseConfigured && (
        <div className="rounded-lg bg-saffron-50 border border-saffron-200 p-4 flex items-center gap-3 text-saffron-900">
          <AlertCircle className="w-5 h-5 text-saffron-600 flex-shrink-0" />
          <div className="text-sm font-medium">
            Dev Mode — configuration changes are held in active memory during preview.
          </div>
        </div>
      )}

      {/* 1. Profile Section */}
      <div className="admin-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-charcoal-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-saffron-50 text-saffron-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-charcoal-900">Profile Information</h2>
              <p className="text-xs text-charcoal-500">Official names, designations, and biographies</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              disabled={isTranslatingProfile}
              onClick={async () => {
                setIsTranslatingProfile(true);
                try {
                  const [nMr, tMr, bMr] = await Promise.all([
                    profile.name_en ? translateText(profile.name_en, 'mr') : Promise.resolve(''),
                    profile.title_en ? translateText(profile.title_en, 'mr') : Promise.resolve(''),
                    profile.bio_en ? translateText(profile.bio_en, 'mr') : Promise.resolve(''),
                  ]);
                  setProfile((prev) => ({
                    ...prev,
                    name_mr: nMr || prev.name_mr,
                    title_mr: tMr || prev.title_mr,
                    bio_mr: bMr || prev.bio_mr,
                  }));
                } catch (err) {
                  console.error('Failed to auto-translate profile:', err);
                } finally {
                  setIsTranslatingProfile(false);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-saffron-50 hover:bg-saffron-100 text-saffron-700 border border-saffron-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              {isTranslatingProfile ? (
                <span className="w-3.5 h-3.5 border-2 border-saffron-600/30 border-t-saffron-600 rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
              )}
              <span>{isTranslatingProfile ? 'Translating...' : '⚡ Auto-Translate to Marathi'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveSection('profile', profile)}
              disabled={savingSection === 'profile'}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-2"
            >
              {savingSection === 'profile' ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : successSection === 'profile' ? (
                <Check className="w-4 h-4 text-emerald-300" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{successSection === 'profile' ? 'Profile Saved' : 'Save Profile'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Leader Name (English)</label>
            <input
              type="text"
              value={profile.name_en}
              onChange={(e) => setProfile({ ...profile, name_en: e.target.value })}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Leader Name (Marathi)</label>
            <input
              type="text"
              value={profile.name_mr}
              onChange={(e) => setProfile({ ...profile, name_mr: e.target.value })}
              className="admin-input font-marathi"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Official Title / Designation (English)</label>
            <input
              type="text"
              value={profile.title_en}
              onChange={(e) => setProfile({ ...profile, title_en: e.target.value })}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Official Title / Designation (Marathi)</label>
            <input
              type="text"
              value={profile.title_mr}
              onChange={(e) => setProfile({ ...profile, title_mr: e.target.value })}
              className="admin-input font-marathi"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Biography Summary (English)</label>
            <textarea
              rows={4}
              value={profile.bio_en}
              onChange={(e) => setProfile({ ...profile, bio_en: e.target.value })}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Biography Summary (Marathi)</label>
            <textarea
              rows={4}
              value={profile.bio_mr}
              onChange={(e) => setProfile({ ...profile, bio_mr: e.target.value })}
              className="admin-input font-marathi"
            />
          </div>
        </div>

        <div>
          <ImageUpload
            label="Official Portrait Image"
            description="High-resolution headshot photograph used across about pages"
            value={profile.profile_image}
            onChange={(url) => setProfile({ ...profile, profile_image: url })}
          />
        </div>
      </div>

      {/* 2. Contact Section */}
      <div className="admin-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-charcoal-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-saffron-50 text-saffron-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-charcoal-900">Office & Contact Details</h2>
              <p className="text-xs text-charcoal-500">Constituency liaison and public contact numbers</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveSection('contact', contact)}
            disabled={savingSection === 'contact'}
            className="btn-primary text-xs py-2 px-4 self-start sm:self-auto flex items-center gap-2"
          >
            {savingSection === 'contact' ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : successSection === 'contact' ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{successSection === 'contact' ? 'Contact Saved' : 'Save Contact'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Office Address (English)</label>
            <textarea
              rows={3}
              value={contact.office_address_en}
              onChange={(e) => setContact({ ...contact, office_address_en: e.target.value })}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Office Address (Marathi)</label>
            <textarea
              rows={3}
              value={contact.office_address_mr}
              onChange={(e) => setContact({ ...contact, office_address_mr: e.target.value })}
              className="admin-input font-marathi"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-charcoal-400" />
              <span>Office Phone Number</span>
            </label>
            <input
              type="text"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              placeholder="+91 (020) 2345 6789"
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-charcoal-400" />
              <span>Official Email Address</span>
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              placeholder="contact@balabhegade.org"
              className="admin-input"
            />
          </div>
        </div>
      </div>

      {/* 3. Social Media Section */}
      <div className="admin-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-charcoal-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-saffron-50 text-saffron-600">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-charcoal-900">Social Media Channels</h2>
              <p className="text-xs text-charcoal-500">Official handles linked in the navigation and footer</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveSection('social', social)}
            disabled={savingSection === 'social'}
            className="btn-primary text-xs py-2 px-4 self-start sm:self-auto flex items-center gap-2"
          >
            {savingSection === 'social' ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : successSection === 'social' ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{successSection === 'social' ? 'Social Saved' : 'Save Social Links'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-saffron-600" />
              <span>Instagram Profile URL</span>
            </label>
            <input
              type="url"
              value={social.instagram}
              onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
              placeholder="https://instagram.com/balabhegade"
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-saffron-600" />
              <span>X (Twitter) Profile URL</span>
            </label>
            <input
              type="url"
              value={social.twitter}
              onChange={(e) => setSocial({ ...social, twitter: e.target.value })}
              placeholder="https://x.com/balabhegade"
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-saffron-600" />
              <span>Facebook Page URL</span>
            </label>
            <input
              type="url"
              value={social.facebook}
              onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
              placeholder="https://facebook.com/balabhegade"
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-saffron-600" />
              <span>YouTube Channel URL</span>
            </label>
            <input
              type="url"
              value={social.youtube}
              onChange={(e) => setSocial({ ...social, youtube: e.target.value })}
              placeholder="https://youtube.com/@balabhegade"
              className="admin-input"
            />
          </div>
        </div>
      </div>

      {/* 4. Footer & Legal Section */}
      <div className="admin-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-charcoal-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-saffron-50 text-saffron-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-charcoal-900">Footer & Legal Notices</h2>
              <p className="text-xs text-charcoal-500">Copyright lines and privacy policy routing</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveSection('footer', footer)}
            disabled={savingSection === 'footer'}
            className="btn-primary text-xs py-2 px-4 self-start sm:self-auto flex items-center gap-2"
          >
            {savingSection === 'footer' ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : successSection === 'footer' ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{successSection === 'footer' ? 'Footer Saved' : 'Save Footer'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Copyright Notice (English)</label>
            <input
              type="text"
              value={footer.copyright_en}
              onChange={(e) => setFooter({ ...footer, copyright_en: e.target.value })}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Copyright Notice (Marathi)</label>
            <input
              type="text"
              value={footer.copyright_mr}
              onChange={(e) => setFooter({ ...footer, copyright_mr: e.target.value })}
              className="admin-input font-marathi"
            />
          </div>
        </div>

        <div>
          <label className="admin-label">Privacy Policy Path</label>
          <input
            type="text"
            value={footer.privacy_policy_link}
            onChange={(e) => setFooter({ ...footer, privacy_policy_link: e.target.value })}
            className="admin-input text-sm font-mono max-w-sm"
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: Translation Engine & Google Translate API Key    */}
      {/* ============================================================ */}
      <div className="admin-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-saffron-50 text-saffron-600 flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-charcoal-900">
                Automatic Translation (English → Marathi)
              </h2>
              <p className="text-xs text-charcoal-500">
                Google Translate API &amp; built-in free translation engine for news, posts, and descriptions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setGoogleTranslateApiKey(googleApiKey);
              setTranslateSuccess(true);
              setTimeout(() => setTranslateSuccess(false), 2500);
            }}
            className="btn-primary text-xs py-2 px-4 self-start sm:self-auto flex items-center gap-2"
          >
            {translateSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{translateSuccess ? 'API Key Saved' : 'Save Translation Key'}</span>
          </button>
        </div>

        <div className="p-4 bg-warm-50 border border-saffron-200 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-900">
            <Sparkles className="w-4 h-4 text-saffron-600" />
            <span>How Automatic Translation Works:</span>
          </div>
          <ul className="text-xs text-charcoal-600 space-y-1 list-disc pl-5">
            <li>
              <strong>Effortless Content Management:</strong> You only need to type the English version for articles, events, or posts. When a visitor toggles to Marathi, the system automatically translates it!
            </li>
            <li>
              <strong>Hero Section &amp; Slogans:</strong> Hero section slogans, badges, and dialogues still offer explicit Marathi fields so your official campaign wording (e.g. <em>“संकल्प मावळच्या सर्वांगीण विकासाचा”</em>) is never overridden.
            </li>
            <li>
              <strong>High-Speed Caching:</strong> All translated texts are cached in memory &amp; browser storage, providing instant 0ms response on repeat visits.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <label className="admin-label flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-4 h-4 text-saffron-600" />
                Google Cloud Translation API Key (Optional)
              </span>
              <span className="text-[11px] text-charcoal-500">
                {googleApiKey ? 'Active (Google Cloud API)' : 'Free Translation Engine Active'}
              </span>
            </label>
            <input
              type="password"
              value={googleApiKey}
              onChange={(e) => setGoogleApiKey(e.target.value)}
              placeholder="AIzaSy... (Leave empty to use built-in free translation engine)"
              className="admin-input font-mono text-xs"
            />
            <p className="text-[11px] text-charcoal-500 mt-1">
              If left blank, the system automatically uses the free text translation engine with zero setup required.
            </p>
          </div>

          {/* Live Translation Test Box */}
          <div className="p-4 bg-charcoal-50/70 border border-charcoal-200 rounded-lg space-y-3">
            <span className="text-xs font-bold text-charcoal-900 block">
              Live Translation Test:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-charcoal-600 font-medium block mb-1">
                  English Input:
                </label>
                <textarea
                  rows={2}
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="admin-input text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-charcoal-600 font-medium block mb-1">
                  Marathi Output:
                </label>
                <textarea
                  rows={2}
                  readOnly
                  value={testOutput}
                  placeholder="Click test below to generate Marathi translation..."
                  className="admin-input text-xs font-marathi bg-white"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={isTestingTranslate || !testInput.trim()}
              onClick={async () => {
                setIsTestingTranslate(true);
                try {
                  const res = await translateText(testInput, 'mr');
                  setTestOutput(res);
                } catch {
                  setTestOutput('Translation failed. Please check network.');
                } finally {
                  setIsTestingTranslate(false);
                }
              }}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              {isTestingTranslate ? (
                <span className="w-3.5 h-3.5 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
              )}
              <span>{isTestingTranslate ? 'Translating...' : 'Test Translation'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 6: Privacy Policy Page Editor (/privacy)             */}
      {/* ============================================================ */}
      <div className="admin-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-charcoal-900">
                Privacy Policy Page Editor (/privacy)
              </h2>
              <p className="text-xs text-charcoal-500">
                Modify legal clauses, citizen privacy commitments, and grievance security details
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
            <button
              type="button"
              disabled={isTranslatingPrivacy}
              onClick={handleAutoTranslatePrivacy}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
              <span>{isTranslatingPrivacy ? 'Translating...' : '⚡ Auto-Translate All'}</span>
            </button>

            <button
              type="button"
              onClick={handleAddPrivacySection}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Clause</span>
            </button>

            <button
              type="button"
              disabled={isSavingPrivacy}
              onClick={handleSavePrivacy}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-2"
            >
              {privacySaved ? (
                <Check className="w-4 h-4 text-emerald-300" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{privacySaved ? 'Saved!' : isSavingPrivacy ? 'Saving...' : 'Save Privacy Policy'}</span>
            </button>
          </div>
        </div>

        {/* Policy Header Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-warm-50/70 rounded-xl border border-charcoal-200">
          <div>
            <label className="admin-label">Last Updated Date</label>
            <input
              type="text"
              value={privacy.last_updated}
              onChange={(e) => setPrivacy({ ...privacy, last_updated: e.target.value })}
              placeholder="e.g., January 2026"
              className="admin-input text-xs"
            />
          </div>

          <div>
            <label className="admin-label">Policy Title (English)</label>
            <input
              type="text"
              value={privacy.title_en}
              onChange={(e) => setPrivacy({ ...privacy, title_en: e.target.value })}
              className="admin-input text-xs"
            />
          </div>

          <div>
            <label className="admin-label">Policy Title (Marathi)</label>
            <input
              type="text"
              value={privacy.title_mr}
              onChange={(e) => setPrivacy({ ...privacy, title_mr: e.target.value })}
              className="admin-input text-xs font-marathi"
            />
          </div>
        </div>

        {/* Section Clauses List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Policy Clauses &amp; Terms ({privacy.sections.length})
            </h3>
            <a
              href="/privacy"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-saffron-600 hover:underline flex items-center gap-1"
            >
              <span>Preview Live /privacy</span>
              <Globe className="w-3 h-3" />
            </a>
          </div>

          {privacy.sections.map((section, idx) => (
            <div
              key={section.id}
              className="p-5 rounded-xl border border-charcoal-200 bg-white space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-charcoal-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-saffron-100 text-saffron-700 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-charcoal-800">
                    {section.title_en || 'Untitled Clause'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      const tMr = section.title_en ? await translateText(section.title_en, 'mr') : section.title_mr;
                      const cMr = section.content_en ? await translateText(section.content_en, 'mr') : section.content_mr;
                      handleUpdatePrivacySection(section.id, 'title_mr', tMr);
                      handleUpdatePrivacySection(section.id, 'content_mr', cMr);
                    }}
                    className="text-[11px] text-saffron-600 hover:text-saffron-800 flex items-center gap-1 px-2 py-1 rounded bg-saffron-50 hover:bg-saffron-100 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Translate Clause</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletePrivacySection(section.id)}
                    className="text-charcoal-400 hover:text-red-600 p-1.5 rounded transition-colors"
                    title="Delete Clause"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Clause Title (English)</label>
                  <input
                    type="text"
                    value={section.title_en}
                    onChange={(e) => handleUpdatePrivacySection(section.id, 'title_en', e.target.value)}
                    className="admin-input text-xs"
                  />
                </div>

                <div>
                  <label className="admin-label">Clause Title (Marathi)</label>
                  <input
                    type="text"
                    value={section.title_mr}
                    onChange={(e) => handleUpdatePrivacySection(section.id, 'title_mr', e.target.value)}
                    className="admin-input text-xs font-marathi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Policy Content (English)</label>
                  <textarea
                    rows={3}
                    value={section.content_en}
                    onChange={(e) => handleUpdatePrivacySection(section.id, 'content_en', e.target.value)}
                    className="admin-input text-xs"
                  />
                </div>

                <div>
                  <label className="admin-label">Policy Content (Marathi)</label>
                  <textarea
                    rows={3}
                    value={section.content_mr}
                    onChange={(e) => handleUpdatePrivacySection(section.id, 'content_mr', e.target.value)}
                    className="admin-input text-xs font-marathi"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
