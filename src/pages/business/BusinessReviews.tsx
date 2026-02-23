import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Search, MessageSquare, Send, CheckCircle2, Loader2, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  id: string;
  name: string;
}

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  reply: string | null;
  replied_at: string | null;
  created_at: string;
  status: string;
  author_name: string;
  user_id: string;
}

export default function BusinessReviews() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    // Fetch company
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .select("id, name")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (companyError || !companyData) {
      console.error("Error fetching company:", companyError);
      setLoading(false);
      return;
    }

    setCompany(companyData);

    // Fetch reviews
    const { data: reviewsData, error: reviewsError } = await supabase
      .from("reviews")
      .select("id, rating, title, content, reply, replied_at, created_at, status, user_id")
      .eq("company_id", companyData.id)
      .order("created_at", { ascending: false });

    if (reviewsError) {
      console.error("Error fetching reviews:", reviewsError);
      setLoading(false);
      return;
    }

    // Fetch profile names
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

    setReviews(reviewsWithNames);
    setLoading(false);
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingReviews = filteredReviews.filter((r) => !r.reply);
  const repliedReviews = filteredReviews.filter((r) => r.reply);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedReview || !user) return;

    setIsReplying(true);
    
    const { error } = await supabase
      .from("reviews")
      .update({
        reply: replyText.trim(),
        replied_at: new Date().toISOString(),
        replied_by: user.id,
      })
      .eq("id", selectedReview.id);

    setIsReplying(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Reply Sent",
      description: "Your reply has been posted successfully.",
    });

    // Update local state
    setReviews(reviews.map(r => 
      r.id === selectedReview.id 
        ? { ...r, reply: replyText.trim(), replied_at: new Date().toISOString() }
        : r
    ));
    
    setReplyText("");
    setSelectedReview(null);
    setDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const ReviewCard = ({ review }: { review: Review }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary flex-shrink-0">
            {review.author_name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{review.author_name}</span>
                  {review.reply && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Replied
                    </Badge>
                  )}
                  <Badge variant={review.status === "approved" ? "default" : "secondary"}>
                    {review.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} size="sm" />
                  <span className="text-sm text-muted-foreground">{formatDate(review.created_at)}</span>
                </div>
              </div>
            </div>
            <h4 className="font-medium">{review.title}</h4>
            <p className="text-muted-foreground">{review.content}</p>
            
            {review.reply && (
              <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                <p className="text-sm font-medium mb-1">Your Reply:</p>
                <p className="text-sm text-muted-foreground">{review.reply}</p>
              </div>
            )}

            {!review.reply && (
              <Dialog open={dialogOpen && selectedReview?.id === review.id} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) {
                  setSelectedReview(null);
                  setReplyText("");
                }
              }}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => {
                      setSelectedReview(review);
                      setDialogOpen(true);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reply to {review.author_name}</DialogTitle>
                    <DialogDescription>
                      Your reply will be publicly visible on your company profile.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-sm text-muted-foreground">{formatDate(review.created_at)}</span>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{review.title}</h4>
                      <p className="text-sm text-muted-foreground">{review.content}</p>
                    </div>
                    <Textarea
                      placeholder="Write your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => {
                        setDialogOpen(false);
                        setSelectedReview(null);
                        setReplyText("");
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={handleSendReply} disabled={isReplying || !replyText.trim()}>
                        {isReplying && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        <Send className="h-4 w-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
            <p className="text-muted-foreground">
              You don't have a company profile yet.
            </p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="business">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Review Management</h1>
          <p className="text-muted-foreground">Manage and respond to customer reviews for {company.name}</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Reply ({pendingReviews.length})
            </TabsTrigger>
            <TabsTrigger value="replied">
              Replied ({repliedReviews.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All Reviews ({filteredReviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {pendingReviews.length > 0 ? (
              pendingReviews.map((review, index) => (
                <div key={review.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ReviewCard review={review} />
                </div>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-accent mb-4" />
                  <h3 className="font-semibold mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">
                    You've replied to all customer reviews.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="replied" className="space-y-4 mt-6">
            {repliedReviews.length > 0 ? (
              repliedReviews.map((review, index) => (
                <div key={review.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ReviewCard review={review} />
                </div>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No replied reviews yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4 mt-6">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review, index) => (
                <div key={review.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ReviewCard review={review} />
                </div>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No reviews yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
