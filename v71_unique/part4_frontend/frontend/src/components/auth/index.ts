/**
 * CHE·NU™ Auth Components V72 - Barrel Exports
 * 
 * Complete authentication component suite:
 * - Core auth forms (Login, Register, 2FA)
 * - Email verification
 * - Password reset
 * - CAPTCHA integration
 * - Session management
 * 
 * @version V72.0
 * @phase Phase 2 - Authentication
 */

// ═══════════════════════════════════════════════════════════════════════════
// CORE AUTH COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export {
  LoginForm,
  RegisterForm,
  TwoFactorForm,
  PasswordStrengthMeter,
  OAuthButtons,
  SessionList,
  AuthGuard,
  AuthStyles,
} from './AuthComponents';

// ═══════════════════════════════════════════════════════════════════════════
// EMAIL VERIFICATION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export {
  EmailVerificationBanner,
  EmailVerificationPage,
  ForgotPasswordForm,
  ResetPasswordForm,
  EmailPreferencesSettings,
  emailAPI,
} from './EmailComponents';

// ═══════════════════════════════════════════════════════════════════════════
// CAPTCHA COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export {
  Captcha,
  ReCaptchaV2,
  ReCaptchaV3,
  HCaptcha,
  Turnstile,
  CaptchaForm,
  useCaptcha,
  useReCaptchaV3,
} from './CaptchaComponents';
