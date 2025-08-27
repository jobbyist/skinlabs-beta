import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { apiRequest } from "@/lib/queryClient";
import { onboardingStepSchema, type OnboardingStep } from "@shared/schema";

import { ChevronLeft, ChevronRight, Target, X } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const form = useForm<OnboardingStep>({
    resolver: zodResolver(onboardingStepSchema),
    defaultValues: {
      skinType: undefined,
      skinConcerns: [],
      skinGoals: [],
      fitzpatrickScale: undefined,
      monthlyBudget: undefined,
      routinePreference: undefined,
      allergies: [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: OnboardingStep) => {
      const response = await apiRequest("POST", "/api/user/skin-profile", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/skin-profile"] });
      toast({
        title: "Profile updated!",
        description: "Your skin profile has been saved successfully.",
      });
      onClose();
      setCurrentStep(1);
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update skin profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const progress = (currentStep / totalSteps) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: OnboardingStep) => {
    mutation.mutate(data);
  };

  const skinConcernOptions = [
    "Acne", "Blackheads", "Large Pores", "Oiliness", "Dryness", 
    "Fine Lines", "Wrinkles", "Dark Spots", "Uneven Tone", "Sensitivity",
    "Redness", "Dullness", "Rough Texture", "Sagging"
  ];

  const skinGoalOptions = [
    "Clear Skin", "Anti-Aging", "Brightening", "Hydration", "Oil Control",
    "Pore Minimizing", "Even Skin Tone", "Texture Improvement", "Sensitive Skin Care",
    "Natural Glow", "Sun Protection", "Maintenance"
  ];

  const allergyOptions = [
    "Fragrance", "Essential Oils", "Parabens", "Sulfates", "Alcohol",
    "Retinoids", "Alpha Hydroxy Acids", "Beta Hydroxy Acids", "Benzoyl Peroxide",
    "Chemical Sunscreens", "Mineral Sunscreens", "Coconut Oil", "Lanolin"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-auto" data-testid="onboarding-modal">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-primary" />
              <div>
                <DialogTitle>Complete Your Skin Profile</DialogTitle>
                <DialogDescription className="mt-1">
                  Get personalized recommendations based on your skin needs
                </DialogDescription>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              data-testid="close-onboarding"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="mt-4">
            <Progress value={progress} className="h-2" data-testid="onboarding-progress" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Skin Type */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What's your skin type?</h3>
              <RadioGroup 
                value={form.watch("skinType")} 
                onValueChange={(value) => form.setValue("skinType", value as any)}
              >
                <div className="space-y-3">
                  {[
                    { value: "oily", label: "Oily", description: "Shiny, enlarged pores, prone to breakouts" },
                    { value: "dry", label: "Dry", description: "Tight, flaky, often feels uncomfortable" },
                    { value: "combination", label: "Combination", description: "Oily T-zone, normal to dry cheeks" },
                    { value: "sensitive", label: "Sensitive", description: "Easily irritated, reactive to products" },
                    { value: "normal", label: "Normal", description: "Balanced, rarely breaks out or feels tight" },
                  ].map((option) => (
                    <Label 
                      key={option.value}
                      className="flex items-start gap-3 p-3 border border-border rounded-lg hover:border-primary/30 transition-colors cursor-pointer"
                      data-testid={`skin-type-${option.value}`}
                    >
                      <RadioGroupItem value={option.value} className="mt-0.5" />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Skin Concerns */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What are your main skin concerns?</h3>
              <p className="text-sm text-muted-foreground">Select all that apply</p>
              <div className="grid grid-cols-2 gap-3">
                {skinConcernOptions.map((concern) => (
                  <Label 
                    key={concern}
                    className="flex items-center gap-2 p-2 border border-border rounded hover:border-primary/30 transition-colors cursor-pointer"
                    data-testid={`concern-${concern.toLowerCase().replace(' ', '-')}`}
                  >
                    <Checkbox
                      checked={form.watch("skinConcerns")?.includes(concern)}
                      onCheckedChange={(checked) => {
                        const current = form.watch("skinConcerns") || [];
                        if (checked) {
                          form.setValue("skinConcerns", [...current, concern]);
                        } else {
                          form.setValue("skinConcerns", current.filter(c => c !== concern));
                        }
                      }}
                    />
                    <span className="text-sm">{concern}</span>
                  </Label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Skin Goals */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What are your skincare goals?</h3>
              <p className="text-sm text-muted-foreground">Select your top priorities</p>
              <div className="grid grid-cols-2 gap-3">
                {skinGoalOptions.map((goal) => (
                  <Label 
                    key={goal}
                    className="flex items-center gap-2 p-2 border border-border rounded hover:border-primary/30 transition-colors cursor-pointer"
                    data-testid={`goal-${goal.toLowerCase().replace(' ', '-')}`}
                  >
                    <Checkbox
                      checked={form.watch("skinGoals")?.includes(goal)}
                      onCheckedChange={(checked) => {
                        const current = form.watch("skinGoals") || [];
                        if (checked) {
                          form.setValue("skinGoals", [...current, goal]);
                        } else {
                          form.setValue("skinGoals", current.filter(g => g !== goal));
                        }
                      }}
                    />
                    <span className="text-sm">{goal}</span>
                  </Label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Physical Details */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">A few more details</h3>
              
              <div>
                <Label htmlFor="fitzpatrick">Fitzpatrick Skin Type (1-6)</Label>
                <Select 
                  value={form.watch("fitzpatrickScale")?.toString()} 
                  onValueChange={(value) => form.setValue("fitzpatrickScale", parseInt(value))}
                >
                  <SelectTrigger data-testid="fitzpatrick-select">
                    <SelectValue placeholder="Select your skin tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Type I - Always burns, never tans</SelectItem>
                    <SelectItem value="2">Type II - Burns easily, tans minimally</SelectItem>
                    <SelectItem value="3">Type III - Burns moderately, tans gradually</SelectItem>
                    <SelectItem value="4">Type IV - Burns minimally, tans well</SelectItem>
                    <SelectItem value="5">Type V - Rarely burns, tans profusely</SelectItem>
                    <SelectItem value="6">Type VI - Never burns, deeply pigmented</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="budget">Monthly skincare budget (R)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="500"
                  min="0"
                  step="50"
                  value={form.watch("monthlyBudget") || ""}
                  onChange={(e) => form.setValue("monthlyBudget", e.target.value ? parseInt(e.target.value) : undefined)}
                  data-testid="budget-input"
                />
              </div>

              <div>
                <Label htmlFor="routine">Preferred routine complexity</Label>
                <Select 
                  value={form.watch("routinePreference")} 
                  onValueChange={(value) => form.setValue("routinePreference", value as any)}
                >
                  <SelectTrigger data-testid="routine-select">
                    <SelectValue placeholder="Select routine preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal (2-3 steps)</SelectItem>
                    <SelectItem value="balanced">Balanced (4-5 steps)</SelectItem>
                    <SelectItem value="maximal">Maximal (6+ steps)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 5: Allergies & Final */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Any known allergies or sensitivities?</h3>
              <p className="text-sm text-muted-foreground">Select ingredients you want to avoid</p>
              <div className="grid grid-cols-2 gap-3">
                {allergyOptions.map((allergy) => (
                  <Label 
                    key={allergy}
                    className="flex items-center gap-2 p-2 border border-border rounded hover:border-primary/30 transition-colors cursor-pointer"
                    data-testid={`allergy-${allergy.toLowerCase().replace(' ', '-')}`}
                  >
                    <Checkbox
                      checked={form.watch("allergies")?.includes(allergy)}
                      onCheckedChange={(checked) => {
                        const current = form.watch("allergies") || [];
                        if (checked) {
                          form.setValue("allergies", [...current, allergy]);
                        } else {
                          form.setValue("allergies", current.filter(a => a !== allergy));
                        }
                      }}
                    />
                    <span className="text-sm">{allergy}</span>
                  </Label>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4 mt-6">
                <h4 className="font-semibold mb-2">🎉 Almost done!</h4>
                <p className="text-sm text-muted-foreground">
                  Your personalized skin profile will unlock better recommendations and exclusive content tailored just for you.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button 
              type="button"
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 1}
              data-testid="prev-step"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button 
                type="button" 
                onClick={nextStep}
                data-testid="next-step"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                data-testid="complete-profile"
              >
                {mutation.isPending ? "Saving..." : "Complete Profile"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
