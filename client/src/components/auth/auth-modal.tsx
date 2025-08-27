import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff, Chrome, Apple, ArrowLeft, CheckCircle, Users, Crown, Zap } from "lucide-react";
import PayPalButton from "@/components/PayPalButton";

// Auth schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  acceptTerms: z.boolean().refine(val => val === true, "You must accept the Terms of Service"),
});

const skinProfileSchema = z.object({
  skinType: z.enum(["oily", "dry", "combination", "sensitive", "normal"]).optional(),
  skinConcerns: z.array(z.string()).optional(),
  skinGoals: z.array(z.string()).optional(),
  fitzpatrickScale: z.number().min(1).max(6).optional(),
  monthlyBudget: z.number().min(0).optional(),
  routinePreference: z.enum(["minimal", "balanced", "maximal"]).optional(),
  allergies: z.array(z.string()).optional(),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;
type SkinProfileData = z.infer<typeof skinProfileSchema>;

interface RegistrationInfo {
  userCount: number;
  nextRegistrationNumber: number;
  tier: 'trial' | 'founding_member' | 'paid';
  message: string;
  requiresPayment: boolean;
  amount?: string;
  currency?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onAuthSuccess?: (user: any, token: string) => void;
}

export function AuthModal({ isOpen, onClose, initialMode = 'register', onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'onboarding' | 'payment'>(initialMode);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const [pendingRegistration, setPendingRegistration] = useState<RegisterData | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get registration info for subscription logic
  const { data: registrationInfo } = useQuery<RegistrationInfo>({
    queryKey: ['/api/user/registration-info'],
    enabled: isOpen && mode === 'register',
  });

  // Login form
  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      acceptTerms: false,
    },
  });

  // Skin profile form
  const profileForm = useForm<SkinProfileData>({
    resolver: zodResolver(skinProfileSchema),
    defaultValues: {
      skinConcerns: [],
      skinGoals: [],
      allergies: [],
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return response.json();
    },
    onSuccess: (data: any) => {
      localStorage.setItem('skynn_token', data.token);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: "Welcome back!",
        description: "You've been logged in successfully.",
      });
      onAuthSuccess?.(data.user, data.token);
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiRequest('POST', '/api/auth/register', data);
      return response.json();
    },
    onSuccess: (data: any) => {
      setRegisteredUser(data.user);
      setMode('onboarding');
      setStep(1);
      localStorage.setItem('skynn_token', data.token);
      toast({
        title: "Welcome to SKYNN!",
        description: data.user.isFoundingMember 
          ? "Congratulations! You're a founding member with lifetime free access!"
          : "Account created successfully. Let's set up your skin profile.",
      });
    },
    onError: (error: any) => {
      // Handle payment required error
      if (error.status === 402) {
        setPendingRegistration(registerForm.getValues());
        setMode('payment');
        return;
      }
      
      toast({
        title: "Registration failed",
        description: error.message || "Unable to create account",
        variant: "destructive",
      });
    },
  });

  // Register with payment mutation
  const registerWithPaymentMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; acceptTerms: boolean; paypalOrderId: string }) => {
      const response = await apiRequest('POST', '/api/auth/register-with-payment', data);
      return response.json();
    },
    onSuccess: (data: any) => {
      setRegisteredUser(data.user);
      setMode('onboarding');
      setStep(1);
      localStorage.setItem('skynn_token', data.token);
      toast({
        title: "Welcome to SKYNN!",
        description: "Payment successful! Your subscription is now active.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Payment failed",
        description: error.message || "Payment could not be processed",
        variant: "destructive",
      });
    },
  });

  // Skin profile mutation
  const profileMutation = useMutation({
    mutationFn: async (data: SkinProfileData) => {
      const response = await fetch('/api/user/skin-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('skynn_token')}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: "Profile completed!",
        description: "Your personalized skincare journey begins now.",
      });
      onAuthSuccess?.(registeredUser, localStorage.getItem('skynn_token') || '');
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Profile setup failed",
        description: error.message || "Unable to save your profile",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const handleRegister = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  const handleProfileSubmit = (data: SkinProfileData) => {
    profileMutation.mutate(data);
  };

  const handleGoogleAuth = () => {
    window.location.href = '/api/auth/google';
  };

  const handleAppleAuth = () => {
    window.location.href = '/api/auth/apple';
  };

  const resetModal = () => {
    setMode(initialMode);
    setStep(1);
    setRegisteredUser(null);
    loginForm.reset();
    registerForm.reset();
    profileForm.reset();
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const skinTypes = [
    { value: "oily", label: "Oily", description: "Shiny, large pores, prone to breakouts" },
    { value: "dry", label: "Dry", description: "Tight, flaky, sometimes itchy" },
    { value: "combination", label: "Combination", description: "Oily T-zone, dry cheeks" },
    { value: "sensitive", label: "Sensitive", description: "Easily irritated, reactive" },
    { value: "normal", label: "Normal", description: "Balanced, comfortable" },
  ];

  const skinConcerns = [
    "Acne", "Aging", "Dark spots", "Sensitivity", "Dryness", "Oiliness", 
    "Large pores", "Blackheads", "Dullness", "Uneven texture"
  ];

  const skinGoals = [
    "Clear skin", "Anti-aging", "Brightening", "Hydration", "Oil control",
    "Pore minimizing", "Even skin tone", "Smooth texture"
  ];

  const routinePreferences = [
    { value: "minimal", label: "Minimal", description: "3-4 products, simple routine" },
    { value: "balanced", label: "Balanced", description: "5-7 products, moderate routine" },
    { value: "maximal", label: "Maximal", description: "8+ products, comprehensive routine" },
  ];

  const budgetRanges = [
    { value: 500, label: "Under R500", description: "Budget-friendly options" },
    { value: 1000, label: "R500 - R1000", description: "Mid-range products" },
    { value: 2000, label: "R1000 - R2000", description: "Premium products" },
    { value: 3000, label: "Over R2000", description: "Luxury skincare" },
  ];

  const allergies = [
    "Fragrances", "Essential oils", "Sulfates", "Parabens", "Silicones",
    "Alcohol", "Retinoids", "AHA/BHA", "None"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {mode === 'login' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Welcome back to SKYNN
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* OAuth Buttons */}
              <div className="grid gap-3">
                <Button
                  variant="outline"
                  onClick={handleGoogleAuth}
                  className="w-full h-11 text-base"
                  data-testid="login-google-button"
                >
                  <Chrome className="w-5 h-5 mr-2" />
                  Continue with Google
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleAppleAuth}
                  className="w-full h-11 text-base"
                  data-testid="login-apple-button"
                >
                  <Apple className="w-5 h-5 mr-2" />
                  Continue with Apple
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...loginForm.register("email")}
                    data-testid="input-login-email"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Your password"
                      {...loginForm.register("password")}
                      data-testid="input-login-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => setShowPassword(!showPassword)}
                      data-testid="button-toggle-password"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base"
                  disabled={loginMutation.isPending}
                  data-testid="button-login-submit"
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="text-center">
                <span className="text-sm text-muted-foreground">Don't have an account? </span>
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm font-medium"
                  onClick={() => setMode('register')}
                  data-testid="link-switch-to-register"
                >
                  Sign up
                </Button>
              </div>
            </div>
          </>
        )}

        {mode === 'register' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Join SKYNN Community
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Subscription Tier Display */}
              {registrationInfo && (
                <Alert className={`border-primary/20 ${
                  registrationInfo.tier === 'founding_member' ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20' :
                  registrationInfo.tier === 'trial' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20' :
                  'bg-primary/5'
                }`}>
                  {registrationInfo.tier === 'founding_member' ? <Crown className="h-4 w-4 text-amber-600" /> :
                   registrationInfo.tier === 'trial' ? <Zap className="h-4 w-4 text-blue-600" /> :
                   <Users className="h-4 w-4 text-primary" />}
                  <AlertDescription>
                    <span className="font-medium">
                      {registrationInfo.tier === 'founding_member' ? 'Founding Member' :
                       registrationInfo.tier === 'trial' ? 'Free Trial' :
                       'Premium Subscription'}:
                    </span> 
                    {registrationInfo.message}
                  </AlertDescription>
                </Alert>
              )}

              {/* OAuth Buttons */}
              <div className="grid gap-3">
                <Button
                  variant="outline"
                  onClick={handleGoogleAuth}
                  className="w-full h-11 text-base"
                  data-testid="register-google-button"
                >
                  <Chrome className="w-5 h-5 mr-2" />
                  Continue with Google
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleAppleAuth}
                  className="w-full h-11 text-base"
                  data-testid="register-apple-button"
                >
                  <Apple className="w-5 h-5 mr-2" />
                  Continue with Apple
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or create account with email</span>
                </div>
              </div>

              {/* Register Form */}
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                <div>
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    {...registerForm.register("email")}
                    data-testid="input-register-email"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      {...registerForm.register("password")}
                      data-testid="input-register-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    {...registerForm.register("acceptTerms")}
                    data-testid="checkbox-accept-terms"
                  />
                  <div className="text-sm leading-5">
                    <label htmlFor="terms" className="text-muted-foreground">
                      I agree to the{" "}
                      <a href="/terms" className="text-primary hover:underline" target="_blank">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-primary hover:underline" target="_blank">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>
                {registerForm.formState.errors.acceptTerms && (
                  <p className="text-sm text-red-500">
                    {registerForm.formState.errors.acceptTerms.message}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 text-base"
                  disabled={registerMutation.isPending}
                  data-testid="button-register-submit"
                >
                  {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="text-center">
                <span className="text-sm text-muted-foreground">Already have an account? </span>
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm font-medium"
                  onClick={() => setMode('login')}
                  data-testid="link-switch-to-login"
                >
                  Sign in
                </Button>
              </div>
            </div>
          </>
        )}

        {mode === 'onboarding' && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                {step > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep(step - 1)}
                    data-testid="button-onboarding-back"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                )}
                <div className="flex-1" />
                <Badge variant="secondary" className="text-xs">
                  Step {step} of 5
                </Badge>
              </div>
              <DialogTitle className="text-xl font-bold text-center mt-4">
                Let's build your skin profile
              </DialogTitle>
              <Progress value={(step / 5) * 100} className="mt-2" />
            </DialogHeader>

            <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">What's your skin type?</h3>
                    <div className="grid gap-3">
                      {skinTypes.map((type) => (
                        <label
                          key={type.value}
                          className={`flex items-start p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                            profileForm.watch("skinType") === type.value ? "border-primary bg-primary/5" : ""
                          }`}
                          data-testid={`option-skin-type-${type.value}`}
                        >
                          <input
                            type="radio"
                            value={type.value}
                            {...profileForm.register("skinType")}
                            className="sr-only"
                          />
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-muted-foreground">{type.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">What are your main skin concerns?</h3>
                    <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
                    <div className="grid grid-cols-2 gap-2">
                      {skinConcerns.map((concern) => (
                        <label
                          key={concern}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                            profileForm.watch("skinConcerns")?.includes(concern) ? "border-primary bg-primary/5" : ""
                          }`}
                          data-testid={`option-skin-concern-${concern.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <input
                            type="checkbox"
                            value={concern}
                            {...profileForm.register("skinConcerns")}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium">{concern}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">What are your skincare goals?</h3>
                    <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
                    <div className="grid grid-cols-2 gap-2">
                      {skinGoals.map((goal) => (
                        <label
                          key={goal}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                            profileForm.watch("skinGoals")?.includes(goal) ? "border-primary bg-primary/5" : ""
                          }`}
                          data-testid={`option-skin-goal-${goal.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <input
                            type="checkbox"
                            value={goal}
                            {...profileForm.register("skinGoals")}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium">{goal}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">What's your monthly skincare budget?</h3>
                    <div className="grid gap-3">
                      {budgetRanges.map((range) => (
                        <label
                          key={range.value}
                          className={`flex items-start p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                            profileForm.watch("monthlyBudget") === range.value ? "border-primary bg-primary/5" : ""
                          }`}
                          data-testid={`option-budget-${range.value}`}
                        >
                          <input
                            type="radio"
                            value={range.value}
                            {...profileForm.register("monthlyBudget", { valueAsNumber: true })}
                            className="sr-only"
                          />
                          <div>
                            <div className="font-medium">{range.label}</div>
                            <div className="text-sm text-muted-foreground">{range.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">How complex do you like your routine?</h3>
                    <div className="grid gap-3">
                      {routinePreferences.map((pref) => (
                        <label
                          key={pref.value}
                          className={`flex items-start p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                            profileForm.watch("routinePreference") === pref.value ? "border-primary bg-primary/5" : ""
                          }`}
                          data-testid={`option-routine-${pref.value}`}
                        >
                          <input
                            type="radio"
                            value={pref.value}
                            {...profileForm.register("routinePreference")}
                            className="sr-only"
                          />
                          <div>
                            <div className="font-medium">{pref.label}</div>
                            <div className="text-sm text-muted-foreground">{pref.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Any known allergies or ingredients to avoid?</h3>
                    <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
                    <div className="grid grid-cols-2 gap-2">
                      {allergies.map((allergy) => (
                        <label
                          key={allergy}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                            profileForm.watch("allergies")?.includes(allergy) ? "border-primary bg-primary/5" : ""
                          }`}
                          data-testid={`option-allergy-${allergy.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <input
                            type="checkbox"
                            value={allergy}
                            {...profileForm.register("allergies")}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium">{allergy}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Fitzpatrick Scale</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This helps us recommend appropriate sun protection and treatments
                    </p>
                    <div className="grid gap-2">
                      {Array.from({ length: 6 }, (_, i) => i + 1).map((scale) => (
                        <label
                          key={scale}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                            profileForm.watch("fitzpatrickScale") === scale ? "border-primary bg-primary/5" : ""
                          }`}
                          data-testid={`option-fitzpatrick-${scale}`}
                        >
                          <input
                            type="radio"
                            value={scale}
                            {...profileForm.register("fitzpatrickScale", { valueAsNumber: true })}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium">Type {scale}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                {step < 5 ? (
                  <Button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="ml-auto"
                    data-testid="button-onboarding-next"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="ml-auto"
                    disabled={profileMutation.isPending}
                    data-testid="button-onboarding-complete"
                  >
                    {profileMutation.isPending ? "Completing Profile..." : "Complete Profile"}
                  </Button>
                )}
              </div>
            </form>
          </>
        )}

        {mode === 'payment' && pendingRegistration && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Complete Your Registration
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                <Users className="h-4 w-4 text-orange-600" />
                <AlertDescription>
                  <span className="font-medium">Annual Subscription Required:</span> 
                  You'll be user #{registrationInfo?.nextRegistrationNumber}. Complete your payment to activate your account.
                </AlertDescription>
              </Alert>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Subscription Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Annual Subscription</span>
                    <span className="font-medium">$9.99 USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Billing Period</span>
                    <span>12 months</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>$9.99 USD</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-center">Complete Payment with PayPal</h3>
                <div className="flex justify-center">
                  <PayPalButton 
                    amount="9.99" 
                    currency="USD" 
                    intent="CAPTURE"
                  />
                </div>
              </div>

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMode('register');
                    setPendingRegistration(null);
                  }}
                  data-testid="button-back-to-register"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Registration
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}