import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, CheckCircle2, Loader2, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  "All Categories",
  "Plumbing",
  "Electrical",
  "Landscaping",
  "Auto Services",
  "Cleaning",
  "HVAC",
  "Roofing",
  "Painting",
  "Restaurant",
  "Retail",
  "Professional Services",
  "Healthcare",
  "Technology",
];

interface Company {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  description: string | null;
  logo_url: string | null;
  city: string | null;
  average_rating: number;
  total_reviews: number;
  status: string;
}

export default function Companies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("rating");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("status", "approved");

    if (error) {
      console.error("Error fetching companies:", error);
    } else {
      setCompanies(data || []);
    }
    setLoading(false);
  };

  const filteredCompanies = companies
    .filter((company) => {
      const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (company.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesCategory = selectedCategory === "All Categories" || company.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return (b.average_rating || 0) - (a.average_rating || 0);
      if (sortBy === "reviews") return (b.total_reviews || 0) - (a.total_reviews || 0);
      return a.name.localeCompare(b.name);
    });

  return (
    <PublicLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Companies</h1>
          <p className="text-muted-foreground">Find trusted local businesses with verified reviews</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Results */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
              <Link
                key={company.id}
                to={`/company/${company.slug}`}
                className="block animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Card className="h-full card-hover">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      {company.logo_url ? (
                        <img
                          src={company.logo_url}
                          alt={company.name}
                          className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-8 w-8 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          <h3 className="font-semibold truncate">{company.name}</h3>
                          <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        </div>
                        {company.category && (
                          <Badge variant="secondary" className="mb-2">
                            {company.category}
                          </Badge>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <StarRating rating={Math.round(company.average_rating || 0)} size="sm" />
                          <span className="text-sm font-medium">{company.average_rating?.toFixed(1) || "0.0"}</span>
                          <span className="text-sm text-muted-foreground">
                            ({company.total_reviews || 0})
                          </span>
                        </div>
                      </div>
                    </div>
                    {company.description && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                        {company.description}
                      </p>
                    )}
                    {company.city && (
                      <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {company.city}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No companies found</h3>
            <p className="text-muted-foreground mb-4">
              {companies.length === 0
                ? "No companies have been listed yet. Be the first to register your business!"
                : "No companies found matching your criteria."}
            </p>
            {companies.length > 0 && (
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
              }}>
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
