import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@lumen/uikit/components';
import { useGoogleLoginMutation } from '../hooks';
import { useAuthStore } from '@/store/auth.store';
import { Icons } from '@lumen/uikit/icons';
import { toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const loginMutation = useGoogleLoginMutation();

  const handleGoogleSuccess = (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      toast.error('Google Sign-In failed');
      return;
    }

    loginMutation.mutate(credentialResponse.credential, {
      onSuccess: (response) => {
        if (response.data?.accessToken) {
          setToken(response.data.accessToken);
          toast.success('Welcome back to Lumen Admin!');
          navigate('/dashboard');
        }
      },
      onError: () => {
        toast.error(
          'Google authentication failed. Please try again or use an authorized account.',
        );
      },
    });
  };

  const handleGoogleError = () => {
    toast.error('Google Sign-In failed. Please try again.');
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
            Please sign in with your corporate Google account
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
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="filled_black"
              shape="rectangular"
              text="continue_with"
            />
          )}
        </CardContent>
      </Card>

      <p className="mt-8 text-sm text-muted-foreground text-center">
        Protected area. Authorized personnel only.
      </p>
    </div>
  );
}
