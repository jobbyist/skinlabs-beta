import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, ChevronRight, ChevronLeft, Sparkles, Check } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

const questions = [
  {
    id: "age",
    question: "What's your age range?",
    type: "single",
    options: [
      { value: "under-20", label: "Under 20" },
      { value: "20-29", label: "20-29" },
      { value: "30-39", label: "30-39" },
      { value: "40-49", label: "40-49" },
      { value: "50-plus", label: "50+" }
    ]
  },
  {
    id: "skin_type",
    question: "How would you describe your skin type?",
    type: "single",
    options: [
      { value: "dry", label: "Dry - Often feels tight or flaky" },
      { value: "oily", label: "Oily - Shiny, especially in T-zone" },
      { value: "combination", label: "Combination - Oily T-zone, dry cheeks" },
      { value: "normal", label: "Normal - Balanced, few issues" },
      { value: "sensitive", label: "Sensitive - Easily irritated or reactive" }
    ]
  },
  {
    id: "concerns",
    question: "What are your main skin concerns? (Select all that apply)",
    type: "multiple",
    options: [
      { value: "acne", label: "Acne & breakouts" },
      { value: "aging", label: "Fine lines & wrinkles" },
      { value: "dark-spots", label: "Dark spots & hyperpigmentation" },
      { value: "dullness", label: "Dull or uneven skin tone" },
      { value: "pores", label: "Large or clogged pores" },
      { value: "redness", label: "Redness & rosacea" },
      { value: "dehydration", label: "Dehydration" },
      { value: "texture", label: "Rough or bumpy texture" }
    ]
  },
  {
    id: "routine",
    question: "How would you describe your current skincare routine?",
    type: "single",
    options: [
      { value: "minimal", label: "Minimal - Just cleanse and moisturize" },
      { value: "basic", label: "Basic - Cleanse, tone, moisturize" },
      { value: "moderate", label: "Moderate - 4-6 products daily" },
      { value: "extensive", label: "Extensive - 7+ products daily" },
      { value: "none", label: "I don't have a routine yet" }
    ]
  },
  {
    id: "budget",
    question: "What's your monthly skincare budget?",
    type: "single",
    options: [
      { value: "under-500", label: "Under R500" },
      { value: "500-1000", label: "R500 - R1,000" },
      { value: "1000-2000", label: "R1,000 - R2,000" },
      { value: "2000-plus", label: "R2,000+" },
      { value: "flexible", label: "I'm flexible on budget" }
    ]
  },
  {
    id: "lifestyle",
    question: "Which lifestyle factors apply to you? (Select all that apply)",
    type: "multiple",
    options: [
      { value: "outdoor", label: "Spend lots of time outdoors" },
      { value: "stress", label: "High stress levels" },
      { value: "pollution", label: "Live in a polluted area" },
      { value: "makeup", label: "Wear makeup daily" },
      { value: "exercise", label: "Exercise regularly" },
      { value: "diet", label: "Health-conscious diet" }
    ]
  },
  {
    id: "goals",
    question: "What are your skincare goals?",
    type: "text",
    placeholder: "Tell us what you hope to achieve with your skincare routine..."
  },
  {
    id: "allergies",
    question: "Do you have any allergies or ingredients you avoid?",
    type: "text",
    placeholder: "List any ingredients you're allergic to or prefer to avoid..."
  }
];

interface QuizAnswers {
  [key: string]: string | string[];
}

export default function SkinQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const analyzeQuizMutation = useMutation({
    mutationFn: async (quizData: QuizAnswers) => {
      return await apiRequest("/api/ai/skin-quiz", "POST", { answers: quizData });
    },
    onSuccess: (data) => {
      setRecommendations(data);
      setShowResults(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to analyze your quiz. Please try again.",
        variant: "destructive",
      });
      console.error("Quiz analysis error:", error);
    },
  });

  const handleAnswer = (value: string | string[]) => {
    const currentQ = questions[currentQuestion];
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: value
    }));
  };

  const handleNext = () => {
    const currentQ = questions[currentQuestion];
    
    if (!answers[currentQ.id] || 
        (Array.isArray(answers[currentQ.id]) && (answers[currentQ.id] as string[]).length === 0) ||
        (currentQ.type === "text" && (answers[currentQ.id] as string).trim() === "")) {
      toast({
        title: "Please answer the question",
        description: "All questions are required for personalized recommendations.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit quiz
      analyzeQuizMutation.mutate(answers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = questions[currentQuestion];

  if (showResults && recommendations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-background dark:via-blue-950/10 dark:to-purple-950/10">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Your Personalized Skin Analysis</h1>
              <p className="text-muted-foreground">Based on your quiz responses, here are your recommendations</p>
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" />
                  Your Skin Profile
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap">{recommendations.profile}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Recommended Routine</h2>
                <div className="space-y-4">
                  {recommendations.routine && Object.entries(recommendations.routine).map(([step, description]) => (
                    <div key={step} className="border-l-2 border-primary pl-4">
                      <h3 className="font-semibold capitalize">{step}</h3>
                      <p className="text-sm text-muted-foreground">{description as string}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Product Recommendations</h2>
                <div className="grid gap-4">
                  {recommendations.products && recommendations.products.map((product: any, index: number) => (
                    <div key={index} className="flex justify-between items-start p-4 bg-secondary/10 rounded-lg">
                      <div>
                        <h3 className="font-semibold">{product.category}</h3>
                        <p className="text-sm text-muted-foreground">{product.product}</p>
                        <p className="text-xs text-primary mt-1">Key ingredients: {product.ingredients}</p>
                      </div>
                      <span className="text-sm font-medium">{product.price}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Lifestyle Tips</h2>
                <ul className="space-y-2">
                  {recommendations.tips && recommendations.tips.map((tip: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              {isAuthenticated ? (
                <Button size="lg" onClick={() => setLocation("/dashboard")}>
                  Save to Dashboard
                </Button>
              ) : (
                <Button size="lg" onClick={() => setLocation("/auth")}>
                  Sign Up to Save Results
                </Button>
              )}
              <Button size="lg" variant="outline" onClick={() => window.print()}>
                Download Results
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-background dark:via-blue-950/10 dark:to-purple-950/10">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">AI-Powered Skin Analysis</h1>
          <p className="text-center text-muted-foreground">Answer a few questions to get personalized recommendations</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</span>
                <span className="text-sm font-medium">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold mb-6">{currentQ.question}</h2>

                {currentQ.type === "single" && (
                  <RadioGroup 
                    value={answers[currentQ.id] as string || ""} 
                    onValueChange={handleAnswer}
                  >
                    <div className="space-y-3">
                      {currentQ.options?.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label 
                            htmlFor={option.value} 
                            className="flex-1 cursor-pointer p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {currentQ.type === "multiple" && (
                  <div className="space-y-3">
                    {currentQ.options?.map((option) => {
                      const selected = Array.isArray(answers[currentQ.id]) && 
                                      (answers[currentQ.id] as string[]).includes(option.value);
                      return (
                        <label
                          key={option.value}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selected ? 'bg-primary/10 border-primary' : 'hover:bg-secondary/50'
                          } border`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={(e) => {
                              const current = (answers[currentQ.id] as string[]) || [];
                              if (e.target.checked) {
                                handleAnswer([...current, option.value]);
                              } else {
                                handleAnswer(current.filter(v => v !== option.value));
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <span className="flex-1">{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {currentQ.type === "text" && (
                  <Textarea
                    value={answers[currentQ.id] as string || ""}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder={currentQ.placeholder}
                    className="min-h-[120px]"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={analyzeQuizMutation.isPending}
              >
                {analyzeQuizMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : currentQuestion === questions.length - 1 ? (
                  <>
                    Get Results
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}