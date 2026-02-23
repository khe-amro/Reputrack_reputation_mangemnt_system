import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, MessageSquare, Building2, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  status: string;
  reply: string | null;
  created_at: string;
  companies: {
    name: string;
    slug: string;
    logo_url: string | null;
  };
}

export default function MyReviews() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("reviews")
      .select(`
        id,
        rating,
        title,
        content,
        status,
        reply,
        created_at,
        companies:company_id (name, slug, logo_url)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (reviewId: string) => {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete review.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Review Deleted",
        description: "Your review has been removed.",
      });
      setReviews(reviews.filter((r) => r.id !== reviewId));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout userType="customer">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Reviews</h1>
            <p className="text-muted-foreground">Manage and view all your submitted reviews</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <Card key={review.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to={`/company/${review.companies.slug}`} className="flex-shrink-0">
                      {review.companies.logo_url ? (
                        <img
                          src={review.companies.logo_url}
                          alt={review.companies.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-8 w-8 text-primary" />
                        </div>
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <Link to={`/company/${review.companies.slug}`} className="font-semibold hover:text-primary transition-colors">
                            {review.companies.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={review.rating} size="sm" />
                            <span className="text-sm text-muted-foreground">{formatDate(review.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={review.status === "approved" ? "default" : "secondary"}>
                            {review.status}
                          </Badge>
                          {review.reply && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              Reply
                            </Badge>
                          )}
                        </div>
                      </div>
                      <h4 className="font-medium">{review.title}</h4>
                      <p className="text-muted-foreground line-clamp-2">{review.content}</p>
                      {review.reply && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium mb-1">Business Response:</p>
                          <p className="text-sm text-muted-foreground">{review.reply}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-4">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Review</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this review? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(review.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't written any reviews yet. Share your experiences with local businesses!
              </p>
              <Button asChild>
                <Link to="/companies">Browse Companies</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
