import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/StarRating";
import { 
  Star, 
  MessageSquare, 
  TrendingUp, 
  ArrowRight,
  Send,
  Building2,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  id: string;
  name: string;
  slug: string;
  average_rating: number;
  total_reviews: number;
  status: string;
}

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  reply: string | null;
  created_at: string;
  author_name?: string;
}

export default function BusinessDashboard() {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchCompanyData();
    }
  }, [user]);

  const fetchCompanyData = async () => {
    if (!user) return;

    // Fetch company
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (companyError) {
      console.error("Error fetching company:", companyError);
      setLoading(false);
      return;
    }

    setCompany(companyData);

    if (companyData) {
      // Fetch recent reviews
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("id, rating, title, content, reply, created_at, user_id")
        .eq("company_id", companyData.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (reviewsData) {
        // Fetch profile names
        const userIds = [...new Set(reviewsData.map(r => r.user_id))];
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

        const reviewsWithNames = reviewsData.map(r => ({
          ...r,
          author_name: profilesMap[r.user_id] || "Anonymous"
        }));

        setRecentReviews(reviewsWithNames);
        setPendingCount(reviewsData.filter(r => !r.reply).length);
      }
    }

    setLoading(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <DashboardLayout userType="business">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!company) {
    return (
      <DashboardLayout userType="business">
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No Company Found</h3>
            <p className="text-muted-foreground mb-4">
              You don't have a company profile yet. Please register as a business owner.
            </p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const stats = [
    { name: "Average Rating", value: company.average_rating?.toFixed(1) || "0.0", icon: Star },
    { name: "Total Reviews", value: String(company.total_reviews || 0), icon: MessageSquare },
    { name: "Pending Replies", value: String(pendingCount), icon: TrendingUp },
    { name: "Status", value: company.status, icon: Building2 },
  ];

  return (
    <DashboardLayout userType="business">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Managing <span className="font-medium text-foreground">{company.name}</span>
          </p>
        </div>

        {company.status === "pending" && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="py-4">
              <p className="text-sm text-amber-800">
                Your company profile is pending approval. Once approved, it will be visible to customers.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={stat.name} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.name}</p>
                    <p className="text-2xl font-bold mt-1 capitalize">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link to="/business/reviews">
                View All Reviews
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/company/${company.slug}`}>View Public Profile</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Reviews</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/business/reviews">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentReviews.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No reviews yet. Share your profile to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="flex items-start gap-4 p-4 bg-secondary/30 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {review.author_name?.charAt(0) || "A"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.author_name}</span>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                        <span className="text-sm text-muted-foreground">{formatTimeAgo(review.created_at)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{review.content}</p>
                      {!review.reply && (
                        <Button variant="ghost" size="sm" className="mt-2 -ml-2 text-primary" asChild>
                          <Link to="/business/reviews">Reply to Review</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
