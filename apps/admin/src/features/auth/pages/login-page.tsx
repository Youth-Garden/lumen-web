import { RouteEnum } from '@/shared/constants/route';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useGoogleLogin } from '../hooks';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

enum AuthStepEnum {
  EMAIL = 'email',
  OTP = 'otp',
}

export default function LoginPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const loginMutation = useGoogleLogin();
  const [step, setStep] = useState<AuthStepEnum>(AuthStepEnum.EMAIL);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resendIn, setResendIn] = useState(0);

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('Google Sign-In failed');
      return;
    }

    loginMutation.mutate(credentialResponse.credential, {
      onSuccess: (response) => {
        if (response.data?.accessToken) {
          setToken(response.data.accessToken);
          navigate(RouteEnum.DASHBOARD);
        }
      },
      onError: () => {
        toast.error(
          'Google authentication failed. Please try again or use an authorized account.',
        );
      },
    });
  };

  const handleSendOtp = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    // Mock for now since OTP is not in AuthService yet
    setStep(AuthStepEnum.OTP);
    setResendIn(30);
    const interval = setInterval(() => {
      setResendIn((currentValue) => {
        if (currentValue <= 1) {
          clearInterval(interval);
          return 0;
        }
        return currentValue - 1;
      });
    }, 1000);
    toast.success('Verification code sent');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the verification code');
      return;
    }
    try {
      const { authService } = await import('@/services/auth');
      // Mock login since OTP is not supported
      const res = await authService.login({ email, password: otp });
      if (res.data?.accessToken) {
        setToken(res.data.accessToken);
        navigate(RouteEnum.DASHBOARD);
      }
    } catch {
      toast.error('Invalid verification code');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Icons name="shield-check" className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Lumen Admin
        </h1>
        <p className="text-muted-foreground mt-2">
          Sign in to access the control panel
        </p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-0 ring-1 ring-slate-200 dark:ring-slate-800">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-semibold text-center">
            Authorized Access
          </CardTitle>
          <CardDescription className="text-center">
            Sign in with your corporate Google account or via email OTP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-center pb-8 pt-4">
          {loginMutation.isPending ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <Icons
                name="loader-2"
                className="h-8 w-8 animate-spin text-primary"
              />
              <p className="text-sm text-muted-foreground">Authenticating...</p>
            </div>
          ) : (
            <>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google Sign-In failed')}
                useOneTap
                theme="filled_black"
                shape="rectangular"
                text="continue_with"
              />
              <div className="relative my-4 w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-50 dark:bg-slate-950 px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>
              <div className="w-full">
                <form onSubmit={handleVerifyOtp} className="w-full space-y-3">
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    value={email}
                    disabled={step === AuthStepEnum.OTP}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  {step === AuthStepEnum.OTP ? (
                    <>
                      <Input
                        placeholder="6-digit code"
                        value={otp}
                        maxLength={6}
                        onChange={(event) => setOtp(event.target.value)}
                      />
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-sm"
                        disabled={resendIn > 0}
                        onClick={handleSendOtp}
                      >
                        {resendIn > 0
                          ? `Resend in ${resendIn}s`
                          : 'Resend code'}
                      </Button>
                    </>
                  ) : null}
                  <Button
                    type={step === AuthStepEnum.OTP ? 'button' : 'submit'}
                    className="w-full"
                    disabled={loginMutation.isPending}
                    onClick={
                      step === AuthStepEnum.EMAIL ? handleSendOtp : undefined
                    }
                  >
                    {step === AuthStepEnum.EMAIL ? 'Continue' : 'Sign in'}
                  </Button>
                </form>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <p className="mt-8 text-sm text-muted-foreground text-center">
        Protected area. Authorized personnel only.
      </p>
    </div>
  );
}
