import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Save,
  Check,
  ExternalLink,
  Sparkles,
  Plus,
  Trash2,
  Building2,
  Phone,
  Mail,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { translateText } from '@/lib/translation';
import {
  getContactPageData,
  updateContactPageData,
  type ContactPageData,
  type OfficeLocation,
} from '@/lib/api';
import { DEFAULT_CONTACT_PAGE_DATA } from '@/lib/pageDataDefaults';

export const AdminContact: React.FC = () => {
  const [data, setData] = useState<ContactPageData>(DEFAULT_CONTACT_PAGE_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    getContactPageData().then((res) => {
      setData(res);
      setIsLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateContactPageData(data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to save contact page:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddOffice = () => {
    const newOffice: OfficeLocation = {
      id: `off-${Date.now()}`,
      name_en: 'New Public Office',
      name_mr: 'नवीन जनसंपर्क कार्यालय',
      role_en: 'Constituency Liaison Unit',
      role_mr: 'मतदारसंघ जनसंपर्क कक्ष',
      address_en: 'Office Address, Taluka Maval, District Pune, Maharashtra 410506',
      address_mr: 'कार्यालय पत्ता, तालुका मावळ, जिल्हा पुणे, महाराष्ट्र ४१०५०६',
      phone: '+91 (020) 2500-0100',
      email: 'office@balabhegade.in',
      hours_en: 'Monday – Saturday: 9:30 AM – 6:30 PM',
      hours_mr: 'सोमवार ते शनिवार: स. ९:३० ते सायं. ६:३०',
      is_primary: false,
    };
    setData((prev) => ({
      ...prev,
      offices: [...prev.offices, newOffice],
    }));
  };

  const handleRemoveOffice = (id: string) => {
    if (confirm('Are you sure you want to delete this office listing?')) {
      setData((prev) => ({
        ...prev,
        offices: prev.offices.filter((o) => o.id !== id),
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <Helmet>
        <title>Contact Page & Offices Editor | Admin Bala Bhegade</title>
      </Helmet>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-charcoal-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-saffron-50 text-saffron-600">
              <MapPin className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-heading font-semibold text-charcoal-900">
              Contact Page & Office Locations Editor
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Manage public liaison offices, visiting hours, official contact phone numbers, email addresses, and 24/7 citizen grievance helplines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            target="_blank"
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <span>View Live Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-2"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saveSuccess ? 'Changes Saved!' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* 1. Header Banner */}
      <div className="admin-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-charcoal-100">
          <div>
            <h3 className="text-base font-semibold text-charcoal-900">Contact Header & Introductory Headline</h3>
            <p className="text-xs text-charcoal-500">Banner welcoming constituents and establishing open communication</p>
          </div>
          <button
            type="button"
            disabled={isTranslating}
            onClick={async () => {
              setIsTranslating(true);
              try {
                const [bMr, tMr, sMr] = await Promise.all([
                  data.header.badge_en ? translateText(data.header.badge_en, 'mr') : Promise.resolve(''),
                  data.header.title_en ? translateText(data.header.title_en, 'mr') : Promise.resolve(''),
                  data.header.subtitle_en ? translateText(data.header.subtitle_en, 'mr') : Promise.resolve(''),
                ]);
                setData((prev) => ({
                  ...prev,
                  header: {
                    ...prev.header,
                    badge_mr: bMr || prev.header.badge_mr,
                    title_mr: tMr || prev.header.title_mr,
                    subtitle_mr: sMr || prev.header.subtitle_mr,
                  },
                }));
              } finally {
                setIsTranslating(false);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-saffron-50 hover:bg-saffron-100 text-saffron-700 border border-saffron-200 rounded-lg text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
            <span>⚡ Auto-Translate Header</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Badge Label (English)</label>
            <input
              type="text"
              value={data.header.badge_en}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  header: { ...prev.header, badge_en: e.target.value },
                }))
              }
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Badge Label (Marathi)</label>
            <input
              type="text"
              value={data.header.badge_mr}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  header: { ...prev.header, badge_mr: e.target.value },
                }))
              }
              className="admin-input font-marathi"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Headline (English)</label>
            <input
              type="text"
              value={data.header.title_en}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  header: { ...prev.header, title_en: e.target.value },
                }))
              }
              className="admin-input font-medium"
            />
          </div>
          <div>
            <label className="admin-label">Headline (Marathi)</label>
            <input
              type="text"
              value={data.header.title_mr}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  header: { ...prev.header, title_mr: e.target.value },
                }))
              }
              className="admin-input font-marathi font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Description (English)</label>
            <textarea
              rows={2}
              value={data.header.subtitle_en}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  header: { ...prev.header, subtitle_en: e.target.value },
                }))
              }
              className="admin-input text-xs"
            />
          </div>
          <div>
            <label className="admin-label">Description (Marathi)</label>
            <textarea
              rows={2}
              value={data.header.subtitle_mr}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  header: { ...prev.header, subtitle_mr: e.target.value },
                }))
              }
              className="admin-input text-xs font-marathi"
            />
          </div>
        </div>
      </div>

      {/* 2. Public Liaison Offices */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-saffron-50 border border-saffron-200 rounded-xl text-xs text-saffron-950">
          <div>
            <span className="font-semibold text-sm text-saffron-900 block">Constituency Public Liaison Offices</span>
            <p className="text-xs text-saffron-800 mt-0.5">
              Add multiple offices (e.g. Talegaon Dabhade Central Office, Wadgaon Maval Tehsil Liaison Office).
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddOffice}
            className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Office</span>
          </button>
        </div>

        <div className="space-y-4">
          {data.offices.map((office, idx) => (
            <div key={office.id} className="admin-card p-5 space-y-4 border border-charcoal-200">
              <div className="flex items-center justify-between gap-2 border-b border-charcoal-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-saffron-100 text-saffron-700 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-heading font-semibold text-sm text-charcoal-900">
                    {office.name_en}
                  </span>
                  {office.is_primary && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Primary Headquarters
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      const [nMr, rMr, aMr, hMr] = await Promise.all([
                        office.name_en ? translateText(office.name_en, 'mr') : Promise.resolve(''),
                        office.role_en ? translateText(office.role_en, 'mr') : Promise.resolve(''),
                        office.address_en ? translateText(office.address_en, 'mr') : Promise.resolve(''),
                        office.hours_en ? translateText(office.hours_en, 'mr') : Promise.resolve(''),
                      ]);
                      setData((prev) => ({
                        ...prev,
                        offices: prev.offices.map((o) =>
                          o.id === office.id
                            ? {
                                ...o,
                                name_mr: nMr || o.name_mr,
                                role_mr: rMr || o.role_mr,
                                address_mr: aMr || o.address_mr,
                                hours_mr: hMr || o.hours_mr,
                              }
                            : o
                        ),
                      }));
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-saffron-100 hover:bg-saffron-200 text-saffron-800 rounded-md text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-saffron-600" />
                    <span>⚡ Auto-Translate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveOffice(office.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 cursor-pointer"
                    title="Delete Office"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label text-xs">Office Name (English)</label>
                  <input
                    type="text"
                    value={office.name_en}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        offices: prev.offices.map((o) =>
                          o.id === office.id ? { ...o, name_en: e.target.value } : o
                        ),
                      }))
                    }
                    className="admin-input text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="admin-label text-xs">Office Name (Marathi)</label>
                  <input
                    type="text"
                    value={office.name_mr}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        offices: prev.offices.map((o) =>
                          o.id === office.id ? { ...o, name_mr: e.target.value } : o
                        ),
                      }))
                    }
                    className="admin-input text-xs font-marathi font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label text-xs">Department / Subtitle (English)</label>
                  <input
                    type="text"
                    value={office.role_en}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        offices: prev.offices.map((o) =>
                          o.id === office.id ? { ...o, role_en: e.target.value } : o
                        ),
                      }))
                    }
                    className="admin-input text-xs"
                  />
                </div>
                <div>
                  <label className="admin-label text-xs">Department / Subtitle (Marathi)</label>
                  <input
                    type="text"
                    value={office.role_mr}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        offices: prev.offices.map((o) =>
                          o.id === office.id ? { ...o, role_mr: e.target.value } : o
                        ),
                      }))
                    }
                    className="admin-input text-xs font-marathi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label text-xs">Office Address (English)</label>
                  <textarea
                    rows={2}
                    value={office.address_en}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        offices: prev.offices.map((o) =>
                          o.id === office.id ? { ...o, address_en: e.target.value } : o
                        ),
                      }))
                    }
                    className="admin-input text-xs"
                  />
                </div>
                <div>
                  <label className="admin-label text-xs">Office Address (Marathi)</label>
                  <textarea
                    rows={2}
                    value={office.address_mr}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        offices: prev.offices.map((o) =>
                          o.id === office.id ? { ...o, address_mr: e.target.value } : o
                        ),
                      }))
                    }
                    className="admin-input text-xs font-marathi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="admin-label text-xs">Direct Phone</label>
                  <input
                    type="text"
                    value={office.phone}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        offices: prev.offices.map((o) =>
                          o.id === office.id ? { ...o, phone: e.target.value } : o
                        ),
                      }))
                    }
                    className="admin-input text-xs"
                  />
                </div>
                <div>
                  <label className="admin-label text-xs">Direct Email</label>
                  <input
                    type="text"
                    value={office.email}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        offices: prev.offices.map((o) =>
                          o.id === office.id ? { ...o, email: e.target.value } : o
                        ),
                      }))
                    }
                    className="admin-input text-xs"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-charcoal-800">
                    <input
                      type="checkbox"
                      checked={office.is_primary}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          offices: prev.offices.map((o) => ({
                            ...o,
                            is_primary: o.id === office.id ? e.target.checked : false,
                          })),
                        }))
                      }
                      className="rounded border-charcoal-300 text-saffron-600 focus:ring-saffron-500"
                    />
                    <span>Set as Primary Headquarters</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label text-xs">Visiting Hours (English)</label>
                  <input
                    type="text"
                    value={office.hours_en}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        offices: prev.offices.map((o) =>
                          o.id === office.id ? { ...o, hours_en: e.target.value } : o
                        ),
                      }))
                    }
                    className="admin-input text-xs"
                  />
                </div>
                <div>
                  <label className="admin-label text-xs">Visiting Hours (Marathi)</label>
                  <input
                    type="text"
                    value={office.hours_mr}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        offices: prev.offices.map((o) =>
                          o.id === office.id ? { ...o, hours_mr: e.target.value } : o
                        ),
                      }))
                    }
                    className="admin-input text-xs font-marathi"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Emergency Helpline & Grievance Coordination */}
      <div className="admin-card p-6 space-y-5">
        <h3 className="text-base font-semibold text-charcoal-900 border-b border-charcoal-100 pb-3">
          Emergency Hotline & Grievance Escalation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">24/7 Helpline Phone</label>
            <input
              type="text"
              value={data.helpline.phone}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  helpline: { ...prev.helpline, phone: e.target.value },
                }))
              }
              className="admin-input font-medium"
            />
          </div>
          <div>
            <label className="admin-label">Public Grievance Email</label>
            <input
              type="email"
              value={data.grievance_email}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  grievance_email: e.target.value,
                }))
              }
              className="admin-input font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Helpline Label (English)</label>
            <input
              type="text"
              value={data.helpline.label_en}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  helpline: { ...prev.helpline, label_en: e.target.value },
                }))
              }
              className="admin-input text-xs"
            />
          </div>
          <div>
            <label className="admin-label">Helpline Label (Marathi)</label>
            <input
              type="text"
              value={data.helpline.label_mr}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  helpline: { ...prev.helpline, label_mr: e.target.value },
                }))
              }
              className="admin-input text-xs font-marathi"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Public Delegation / Appointment Notice (English)</label>
            <textarea
              rows={2}
              value={data.visiting_notice_en}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  visiting_notice_en: e.target.value,
                }))
              }
              className="admin-input text-xs"
            />
          </div>
          <div>
            <label className="admin-label">Public Delegation / Appointment Notice (Marathi)</label>
            <textarea
              rows={2}
              value={data.visiting_notice_mr}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  visiting_notice_mr: e.target.value,
                }))
              }
              className="admin-input text-xs font-marathi"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContact;
