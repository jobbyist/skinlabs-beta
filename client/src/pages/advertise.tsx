import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

import { 
  TrendingUp, 
  Users, 
  Target, 
  Calendar, 
  Video, 
  Image, 
  FileText,
  MapPin,
  Mail,
  Phone,
  Clock,
  CheckCircle
} from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().min(2, 'Company name is required'),
  phone: z.string().optional(),
  serviceType: z.enum(['content_creation', 'multimedia_ads', 'sponsored_content', 'brand_partnership', 'other'], {
    required_error: 'Please select a service type',
  }),
  budget: z.enum(['under_10k', '10k_25k', '25k_50k', '50k_100k', 'over_100k'], {
    required_error: 'Please select a budget range',
  }),
  campaignDetails: z.string().min(20, 'Please provide more details about your campaign'),
  preferredDate: z.string().min(1, 'Please select a preferred consultation date'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Advertise() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      campaignDetails: '',
      preferredDate: '',
      agreeToTerms: false,
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest('/api/advertising/consultation', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Consultation booked!",
        description: "We'll contact you within 24 hours to schedule your free consultation.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Booking failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    submitMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-background dark:via-blue-950/10 dark:to-purple-950/10">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-16">
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Consultation Booked!</h1>
              <p className="text-muted-foreground mb-6 text-lg">
                Thank you for your interest in advertising with SKYNN. We'll contact you within 24 hours to schedule your free 15-minute consultation.
              </p>
              <div className="space-y-2 mb-6">
                <p className="text-sm"><strong>What's next?</strong></p>
                <p className="text-sm text-muted-foreground">Our marketing team will review your requirements and reach out to discuss how we can help amplify your brand.</p>
              </div>
              <Button onClick={() => setLocation('/')}>
                Return to Homepage
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-background dark:via-blue-950/10 dark:to-purple-950/10">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Partner with SKYNN</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Advertise with South Africa's Leading Skincare Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Reach over 10,000+ engaged skincare enthusiasts with our content creation & marketing services. 
            Book a free 15-minute consultation to discuss your brand's growth strategy.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>10,000+ Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span>South African Focus</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Growing Community</span>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Services Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Services</h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-primary" />
                      Content Creation & Marketing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">
                      Expert-written articles, reviews, and guides featuring your products.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Product reviews and recommendations</li>
                      <li>• Educational skincare content</li>
                      <li>• SEO-optimized articles</li>
                      <li>• Social media content packages</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Image className="h-5 w-5 text-primary" />
                      Multimedia Ad Placements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">
                      Strategic ad placements across our platform for maximum visibility.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Banner advertisements</li>
                      <li>• Native content integration</li>
                      <li>• Newsletter sponsorships</li>
                      <li>• Featured brand spotlights</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Video className="h-5 w-5 text-primary" />
                      Video & Visual Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">
                      Professional video content and visual storytelling for your brand.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Product demonstration videos</li>
                      <li>• Brand story documentaries</li>
                      <li>• Tutorial and how-to content</li>
                      <li>• Social media video packages</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">partnerships@skinlabs.co.za</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">Available Mon-Fri, 9AM-5PM SAST</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">Cape Town, South Africa</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-sm text-muted-foreground">Within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Consultation Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Book Your Free 15-Minute Consultation
                </CardTitle>
                <p className="text-muted-foreground">
                  Let's discuss how we can help grow your skincare brand in South Africa.
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company *</FormLabel>
                            <FormControl>
                              <Input placeholder="Brand or company name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+27 123 456 789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Interest *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="What service are you interested in?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="content_creation">Content Creation & Marketing</SelectItem>
                              <SelectItem value="multimedia_ads">Multimedia Ad Placements</SelectItem>
                              <SelectItem value="sponsored_content">Sponsored Content</SelectItem>
                              <SelectItem value="brand_partnership">Brand Partnership</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget Range *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your budget range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="under_10k">Under R10,000</SelectItem>
                              <SelectItem value="10k_25k">R10,000 - R25,000</SelectItem>
                              <SelectItem value="25k_50k">R25,000 - R50,000</SelectItem>
                              <SelectItem value="50k_100k">R50,000 - R100,000</SelectItem>
                              <SelectItem value="over_100k">Over R100,000</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Consultation Date *</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              min={new Date().toISOString().split('T')[0]}
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            We'll contact you to confirm the exact time.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="campaignDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign Details *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your brand, target audience, campaign goals, and any specific requirements..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm">
                              I agree to the terms and conditions and privacy policy *
                            </FormLabel>
                            <FormDescription>
                              We'll only use your information to contact you about advertising opportunities.
                            </FormDescription>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={submitMutation.isPending}
                      data-testid="submit-consultation"
                    >
                      {submitMutation.isPending ? 'Booking...' : 'Book Free Consultation'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}