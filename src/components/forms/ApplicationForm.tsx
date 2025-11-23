"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, CheckCircle} from "lucide-react";
import { ApplicationFormData } from "@/types";

export default function ApplicationForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type and size
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(selectedFile.type)) {
        alert("Please upload a PDF or DOCX file");
        return;
      }

      if (selectedFile.size > maxSize) {
        alert("File size must be less than 5MB");
        return;
      }

      setFile(selectedFile);
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!file) {
      alert("Please upload your resume");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("candidateName", data.candidateName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("position", data.position);
      if (data.linkedIn) formData.append("linkedIn", data.linkedIn);
      if (data.coverLetter) formData.append("coverLetter", data.coverLetter);

      // TODO: Replace with actual API endpoint
      const response = await fetch("/api/applications/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setTrackingCode(result.trackingCode || "ARS-" + Date.now());
        setSubmitSuccess(true);
        reset();
        setFile(null);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <CardTitle className="text-2xl">Application Submitted Successfully!</CardTitle>
          <CardDescription>
            Thank you for applying. Your resume is being analyzed by our AI system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">Your Tracking Code:</p>
            <p className="text-2xl font-bold text-blue-600 text-center">{trackingCode}</p>
            <p className="text-sm text-blue-700 mt-2 text-center">
              Save this code to check your application status
            </p>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>✓ Resume received and uploaded</p>
            <p>✓ AI analysis in progress (typically takes 2-3 minutes)</p>
            <p>✓ You&apos;ll receive an email confirmation shortly</p>
            <p>✓ Our HR team will review top candidates within 48 hours</p>
          </div>
          <Button 
            className="w-full" 
            onClick={() => setSubmitSuccess(false)}
          >
            Submit Another Application
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Submit Your Application</CardTitle>
        <CardDescription>
          Fill out the form below and upload your resume. Our AI will analyze it instantly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Position Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Position *</label>
            <select
              {...register("position", { required: "Position is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a position</option>
              <option value="Senior Software Engineer">Senior Software Engineer</option>
              <option value="Product Designer">Product Designer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Data Scientist">Data Scientist</option>
            </select>
            {errors.position && (
              <p className="text-sm text-red-600">{errors.position.message}</p>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Resume *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                id="resume"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="resume" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                {file ? (
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">
                      ✓ {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF or DOCX (Max 5MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name *</label>
              <Input
                {...register("candidateName", { required: "Name is required" })}
                placeholder="John Doe"
              />
              {errors.candidateName && (
                <p className="text-sm text-red-600">{errors.candidateName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email *</label>
              <Input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number *</label>
              <Input
                {...register("phone", { required: "Phone is required" })}
                placeholder="+1-555-0123"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">LinkedIn Profile</label>
              <Input
                {...register("linkedIn")}
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cover Letter (Optional)</label>
            <textarea
              {...register("coverLetter")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us why you're a great fit for this position..."
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By submitting, you agree to our privacy policy and terms of service
          </p>
        </form>
      </CardContent>
    </Card>
  );
}