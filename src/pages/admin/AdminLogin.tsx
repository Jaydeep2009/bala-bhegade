import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, signIn, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated and is admin, redirect immediately
  if (!authLoading && user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFormErrors({});

    // Zod validation
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await signIn(email.trim(), password);
      if (error) {
        setErrorMessage(error);
      } else {
        navigate('/admin', { replace: true });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unexpected error occurred during sign in.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Helmet>
        <title>Administrator Login | Bala Bhegade</title>
      </Helmet>

      {/* Subtle background ornamentation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#F58220_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-saffron-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-charcoal-200 overflow-hidden">
          {/* Header area */}
          <div className="bg-white px-8 pt-8 pb-6 text-center border-b border-charcoal-200 relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saffron-500 via-warm-100 to-green-600" />
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-saffron-50 text-saffron-600 mb-3 border border-saffron-200 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="font-heading text-2xl font-bold tracking-wide text-charcoal-900">
              Bala Bhegade
            </div>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-saffron-500 to-transparent mx-auto mt-2 mb-2" />
            <h1 className="text-lg font-bold text-charcoal-800 tracking-tight">
              Administrator Login
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Sign in to manage portal content and settings
            </p>
          </div>

          {/* Form area */}
          <div className="p-8">
            {/* Global Error Banner */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                <div className="text-sm font-medium">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email Field */}
              <div>
                <label className="admin-label flex items-center justify-between" htmlFor="email">
                  <span>Email Address</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    disabled={isSubmitting}
                    className={`admin-input pl-10 pr-3 py-2.5 text-sm ${
                      formErrors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-400' : ''
                    }`}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="admin-label flex items-center justify-between" htmlFor="password">
                  <span>Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    className={`admin-input pl-10 pr-10 py-2.5 text-sm ${
                      formErrors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-400' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-charcoal-400 hover:text-charcoal-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {formErrors.password}
                  </p>
                )}
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 text-base font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Dev Mode Banner */}
            {!isSupabaseConfigured && (
              <div className="mt-6 pt-4 border-t border-charcoal-100 text-center">
                <div className="inline-block px-3 py-1.5 rounded-full bg-saffron-50 border border-saffron-200 text-xs text-saffron-900 font-medium">
                  Dev Mode: Use <code className="font-mono font-semibold">admin@example.com</code> /{' '}
                  <code className="font-mono font-semibold">admin123</code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-charcoal-500 mt-6">
          Authorized personnel only. Protected administrative dashboard.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
