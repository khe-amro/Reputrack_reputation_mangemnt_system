import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Phone, Globe, CheckCircle2, PenLine, Building2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Company {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  average_rating: number;
  total_reviews: number;
  status: string;
}

interface Review {
  id: string;
  user_id: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  reply: string | null;
  replied_at: string | null;
  author_name?: string;
}

export default function CompanyProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingBreakdown, setRatingBreakdown] = useState<{ stars: number; percentage: number }[]>([]);

  useEffect(() => {
    if (slug) {
      fetchCompanyData();
    }
  }, [slug]);

  const fetchCompanyData = async () => {
    setLoading(true);

    // Fetch company
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (companyError || !companyData) {
      console.error("Error fetching company:", companyError);
      navigate("/companies");
      return;
    }

    setCompany(companyData);

    // Fetch reviews
    const { data: reviewsData, error: reviewsError } = await supabase
      .from("reviews")
      .select("id, user_id, rating, title, content, created_at, reply, replied_at")
      .eq("company_id", companyData.id)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (reviewsError) {
      console.error("Error fetching reviews:", reviewsError);
      setLoading(false);
      return;
    }

    // Fetch profile names for reviews
    const userIds = [...new Set((reviewsData || []).map(r => r.user_id))];
    let profilesMap: Record<string, string> = {};
    
    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);
      
      profilesData?.forEach(p => {
        profilesMap[p.user_id] = p.full_name || "Anonymous";
      });
    }

    const reviewsWithNames = (reviewsData || []).map(r => ({
      ...r,
      author_name: profilesMap[r.user_id] || "Anonymous"
    }));

    if (reviewsData) {
      setReviews(reviewsWithNames);
      calculateRatingBreakdown(reviewsWithNames);
    }

    setLoading(false);
  };

  const calculateRatingBreakdown = (reviewsData: Review[]) => {
    const counts = [0, 0, 0, 0, 0];
    reviewsData.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        counts[review.rating - 1]++;
      }
    });
    const total = reviewsData.length || 1;
    const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      percentage: Math.round((counts[stars - 1] / total) * 100),
    }));
    setRatingBreakdown(breakdown);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
      <div className="container py-8">
        {/* Company Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <Card className="flex-1 animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {company.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className="h-24 w-24 rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-primary" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold">{company.name}</h1>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </Badge>
                      </div>
                      {company.category && (
                        <p className="text-muted-foreground">{company.category}</p>
                      )}
                    </div>
                    <Button asChild>
                      <Link to={`/company/${slug}/review`}>
                        <PenLine className="h-4 w-4 mr-2" />
                        Write Review
                      </Link>
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <StarRating rating={Math.round(company.average_rating || 0)} size="md" />
                    <span className="text-lg font-semibold">{company.average_rating?.toFixed(1) || "0.0"}</span>
                    <span className="text-muted-foreground">
                      ({company.total_reviews || 0} reviews)
                    </span>
                  </div>
                  {company.description && (
                    <p className="text-muted-foreground">{company.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rating Breakdown */}
            <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <CardTitle>Rating Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ratingBreakdown.map((item) => (
                    <div key={item.stars} className="flex items-center gap-3">
                      <span className="w-12 text-sm text-muted-foreground">
                        {item.stars} star
                      </span>
                      <Progress value={item.percentage} className="flex-1 h-2" />
                      <span className="w-10 text-sm text-right text-muted-foreground">
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Customer Reviews</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/company/${slug}/review`}>Write a Review</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No reviews yet. Be the first to review!</p>
                    <Button asChild>
                      <Link to={`/company/${slug}/review`}>Write a Review</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">
                                {review.author_name || "Anonymous"}
                              </span>
                              <span className="text-sm text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(review.created_at)}
                              </span>
                            </div>
                            <StarRating rating={review.rating} size="sm" />
                          </div>
                        </div>
                        <h4 className="font-medium mt-2">{review.title}</h4>
                        <p className="text-muted-foreground mt-1">{review.content}</p>
                        {review.reply && (
                          <div className="mt-4 pl-4 border-l-2 border-primary/30">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{company.name}</span>
                              <Badge variant="secondary" className="text-xs">Owner</Badge>
                              {review.replied_at && (
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(review.replied_at)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{review.reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <span className="text-sm">
                      {company.address}
                      {company.city && `, ${company.city}`}
                      {company.country && `, ${company.country}`}
                    </span>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{company.phone}</span>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <a href={company.website.startsWith("http") ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      {company.website}
                    </a>
                  </div>
                )}
                {!company.address && !company.phone && !company.website && (
                  <p className="text-sm text-muted-foreground">No contact information available.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
