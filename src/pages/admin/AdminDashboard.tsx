import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  MessageSquare, 
  AlertTriangle,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Stats {
  totalCompanies: number;
  totalUsers: number;
  totalReviews: number;
  pendingCompanies: number;
  pendingReviews: number;
}

interface PendingCompany {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

interface PendingReview {
  id: string;
  title: string;
  rating: number;
  created_at: string;
  company_name: string;
}

export default function AdminDashboard() {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats>({
    totalCompanies: 0,
    totalUsers: 0,
    totalReviews: 0,
    pendingCompanies: 0,
    pendingReviews: 0,
  });
  const [pendingCompanies, setPendingCompanies] = useState<PendingCompany[]>([]);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && role === "admin") {
      fetchData();
    }
  }, [user, role]);

  const fetchData = async () => {
    setLoading(true);

    // Fetch counts
    const [companiesRes, reviewsRes, profilesRes, pendingCompaniesRes, pendingReviewsRes] = await Promise.all([
      supabase.from("companies").select("id", { count: "exact", head: true }),
      supabase.from("reviews").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("companies").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("reviews").select("id", { count: "exact", head: true }).eq("status", "pending"),
    ]);

    setStats({
      totalCompanies: companiesRes.count || 0,
      totalUsers: profilesRes.count || 0,
      totalReviews: reviewsRes.count || 0,
      pendingCompanies: pendingCompaniesRes.count || 0,
      pendingReviews: pendingReviewsRes.count || 0,
    });

    // Fetch pending companies
    const { data: pendingCompaniesData } = await supabase
      .from("companies")
      .select("id, name, slug, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(5);

    setPendingCompanies(pendingCompaniesData || []);

    // Fetch pending reviews
    const { data: pendingReviewsData } = await supabase
      .from("reviews")
      .select("id, title, rating, created_at, company_id")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(5);

    if (pendingReviewsData && pendingReviewsData.length > 0) {
      const companyIds = [...new Set(pendingReviewsData.map(r => r.company_id))];
      const { data: companiesData } = await supabase
        .from("companies")
        .select("id, name")
        .in("id", companyIds);

      const companiesMap: Record<string, string> = {};
      companiesData?.forEach(c => {
        companiesMap[c.id] = c.name;
      });

      const reviewsWithCompanyNames = pendingReviewsData.map(r => ({
        ...r,
        company_name: companiesMap[r.company_id] || "Unknown"
      }));

      setPendingReviews(reviewsWithCompanyNames);
    }

    setLoading(false);
  };

  const approveCompany = async (companyId: string) => {
    const { error } = await supabase
      .from("companies")
      .update({ status: "approved" })
      .eq("id", companyId);

    if (error) {
      toast({ title: "Error", description: "Failed to approve company.", variant: "destructive" });
    } else {
      toast({ title: "Approved", description: "Company has been approved." });
      fetchData();
    }
  };

  const rejectCompany = async (companyId: string) => {
    const { error } = await supabase
      .from("companies")
      .update({ status: "rejected" })
      .eq("id", companyId);

    if (error) {
      toast({ title: "Error", description: "Failed to reject company.", variant: "destructive" });
    } else {
      toast({ title: "Rejected", description: "Company has been rejected." });
      fetchData();
    }
  };

  const approveReview = async (reviewId: string) => {
    const { error } = await supabase
      .from("reviews")
      .update({ status: "approved" })
      .eq("id", reviewId);

    if (error) {
      toast({ title: "Error", description: "Failed to approve review.", variant: "destructive" });
    } else {
      toast({ title: "Approved", description: "Review has been approved." });
      fetchData();
    }
  };

  const rejectReview = async (reviewId: string) => {
    const { error } = await supabase
      .from("reviews")
      .update({ status: "rejected" })
      .eq("id", reviewId);

    if (error) {
      toast({ title: "Error", description: "Failed to reject review.", variant: "destructive" });
    } else {
      toast({ title: "Rejected", description: "Review has been rejected." });
      fetchData();
    }
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
      <DashboardLayout userType="admin">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const statsList = [
    { name: "Total Companies", value: String(stats.totalCompanies), icon: Building2 },
    { name: "Total Users", value: String(stats.totalUsers), icon: Users },
    { name: "Total Reviews", value: String(stats.totalReviews), icon: MessageSquare },
    { name: "Pending Items", value: String(stats.pendingCompanies + stats.pendingReviews), icon: AlertTriangle },
  ];

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsList.map((stat, index) => (
            <Card key={stat.name} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.name}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Companies */}
          <Card className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Pending Companies
                {stats.pendingCompanies > 0 && (
                  <Badge variant="secondary">{stats.pendingCompanies}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingCompanies.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-accent mb-4" />
                  <p className="text-muted-foreground">No pending companies</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingCompanies.map((company) => (
                    <div key={company.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div>
                        <p className="font-medium">{company.name}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(company.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => approveCompany(company.id)}>
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => rejectCompany(company.id)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Reviews */}
          <Card className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Pending Reviews
                {stats.pendingReviews > 0 && (
                  <Badge variant="secondary">{stats.pendingReviews}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingReviews.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-accent mb-4" />
                  <p className="text-muted-foreground">No pending reviews</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingReviews.map((review) => (
                    <div key={review.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{review.title}</p>
                        <p className="text-sm text-muted-foreground">{review.company_name} • ⭐ {review.rating}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => approveReview(review.id)}>
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => rejectReview(review.id)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
