import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/ui/StarRating";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  id: string;
  name: string;
  category: string | null;
  logo_url: string | null;
}

export default function WriteReview() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchCompany();
    }
  }, [slug]);

  const fetchCompany = async () => {
    const { data, error } = await supabase
      .from("companies")
      .select("id, name, category, logo_url")
      .eq("slug", slug)
      .eq("status", "approved")
      .maybeSingle();

    if (error || !data) {
      console.error("Error fetching company:", error);
      navigate("/companies");
      return;
    }

    setCompany(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to submit a review.",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (title.trim().length < 5) {
      toast({
        title: "Title Too Short",
        description: "Please provide a title with at least 5 characters.",
        variant: "destructive",
      });
      return;
    }

    if (review.trim().length < 20) {
      toast({
        title: "Review Too Short",
        description: "Please write at least 20 characters in your review.",
        variant: "destructive",
      });
      return;
    }

    if (!company) return;

    setIsSubmitting(true);
    
    const { error } = await supabase.from("reviews").insert({
      company_id: company.id,
      user_id: user.id,
      rating,
      title: title.trim(),
      content: review.trim(),
      status: "pending",
    });

    setIsSubmitting(false);

    if (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Review Submitted!",
      description: "Thank you for sharing your experience. Your review is pending approval.",
    });
    
    navigate(`/company/${slug}`);
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="container py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PublicLayout>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <PublicLayout>
      <div className="container py-8 max-w-2xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to={`/company/${slug}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Company
          </Link>
        </Button>

        {!user && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="py-4">
              <p className="text-sm text-amber-800">
                You need to{" "}
                <Link to="/auth/login" className="font-medium underline">
                  sign in
                </Link>{" "}
                to submit a review.
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
              )}
              <div>
                <CardTitle className="text-xl">{company.name}</CardTitle>
                {company.category && (
                  <CardDescription>{company.category}</CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">
                  How would you rate your experience?
                </label>
                <div className="flex items-center gap-4">
                  <StarRating
                    rating={rating}
                    size="lg"
                    interactive
                    onRatingChange={setRating}
                  />
                  <span className="text-lg font-medium">
                    {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : "Select rating"}
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="title" className="mb-2 block">
                  Review Title
                </Label>
                <Input
                  id="title"
                  placeholder="Summarize your experience"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={!user}
                />
              </div>

              <div>
                <Label htmlFor="review" className="mb-2 block">
                  Share your experience
                </Label>
                <Textarea
                  id="review"
                  placeholder="Tell others about your experience with this business. What did they do well? What could be improved?"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={6}
                  className="resize-none"
                  disabled={!user}
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  {review.length} characters (minimum 20)
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !user}
                  className="flex-1"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to={`/company/${slug}`}>Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
