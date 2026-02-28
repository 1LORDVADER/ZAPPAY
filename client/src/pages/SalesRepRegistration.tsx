import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { NavHeader } from "@/components/NavHeader";

export default function SalesRepRegistration() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
    linkedinUrl: "",
    resume: "",
    whyJoin: ""
  });

  const registerMutation = trpc.sales.register.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit application");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-2 border-orange-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl">Application Submitted!</CardTitle>
            <CardDescription className="text-lg">
              Thank you for your interest in joining ZAPPAY's sales team. We'll review your application and get back to you within 2-3 business days.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">
              Check your email ({formData.email}) for confirmation and next steps.
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-50">
      <NavHeader />
      <div className="max-w-3xl mx-auto py-12 px-4">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Card className="border-2 border-orange-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-3xl">Join ZAPPAY Sales Team</CardTitle>
            <CardDescription className="text-lg">
              Help cannabis businesses grow with America's premier marketplace platform
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location (City, State) *</Label>
                    <Input
                      id="location"
                      placeholder="Los Angeles, CA"
                      required
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Experience</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="experience">Years of Sales Experience *</Label>
                    <Select value={formData.experience} onValueChange={(value) => handleChange("experience", value)} required>
                      <SelectTrigger id="experience">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="linkedinUrl">LinkedIn Profile URL (Optional)</Label>
                    <Input
                      id="linkedinUrl"
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={formData.linkedinUrl}
                      onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="resume">Resume/CV Link (Optional)</Label>
                    <Input
                      id="resume"
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={formData.resume}
                      onChange={(e) => handleChange("resume", e.target.value)}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Upload your resume to Google Drive, Dropbox, or similar and paste the public link
                    </p>
                  </div>
                </div>
              </div>

              {/* Why Join */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Tell Us About Yourself</h3>
                <div>
                  <Label htmlFor="whyJoin">Why do you want to join ZAPPAY? *</Label>
                  <Textarea
                    id="whyJoin"
                    required
                    rows={5}
                    placeholder="Tell us about your sales experience, why you're interested in the cannabis industry, and what makes you a great fit for ZAPPAY..."
                    value={formData.whyJoin}
                    onChange={(e) => handleChange("whyJoin", e.target.value)}
                  />
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="font-semibold mb-3">What You'll Get</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Competitive Base + Commission:</strong> $60k-$120k+ depending on experience and performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Remote-First:</strong> Work from anywhere in the US</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Growth Industry:</strong> Be part of the booming legal cannabis market</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Training & Support:</strong> Comprehensive onboarding and ongoing coaching</span>
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-lg py-6"
              >
                {registerMutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
