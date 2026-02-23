import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/StarRating";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Shield, TrendingUp, MessageSquare, Building2, Users, ArrowRight, CheckCircle2 } from "lucide-react";

const featuredCompanies = [
  {
    id: 1,
    name: "Urban Plumbing Co.",
    category: "Plumbing Services",
    rating: 4.8,
    reviewCount: 124,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Green Thumb Landscaping",
    category: "Landscaping",
    rating: 4.9,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Elite Auto Repair",
    category: "Auto Services",
    rating: 4.7,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&h=100&fit=crop",
  },
];

const stats = [
  { label: "Active Businesses", value: "2,500+", icon: Building2 },
  { label: "Verified Reviews", value: "50,000+", icon: MessageSquare },
  { label: "Happy Customers", value: "100,000+", icon: Users },
];

const features = [
  {
    icon: Search,
    title: "Discover Local Businesses",
    description: "Find trusted local service providers with verified reviews from real customers.",
  },
  {
    icon: Shield,
    title: "Verified Reviews Only",
    description: "All reviews are verified to ensure authenticity and help you make informed decisions.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Reputation",
    description: "Business owners can collect, manage, and showcase customer reviews to build trust.",
  },
];

const benefits = [
  "Collect reviews automatically via email & SMS",
  "Respond to reviews from one dashboard",
  "Showcase reviews on your website",
  "Get insights with analytics",
  "Improve your local SEO ranking",
];

export default function Index() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
              Build Trust with{" "}
              <span className="text-primary">Transparent Reviews</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              The platform that connects local businesses with customers through verified reviews. 
              Grow your reputation and find trusted service providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Button size="lg" asChild className="text-base">
                <Link to="/companies">
                  Browse Companies
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link to="/for-business">For Business Owners</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="flex items-center justify-center gap-4 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose RepuTrack?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're building a transparent ecosystem where businesses thrive and customers find services they can trust.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="card-hover animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Companies */}
      <section className="bg-secondary/30 py-20">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Top-Rated Businesses</h2>
              <p className="text-muted-foreground">Discover highly rated local service providers</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link to="/companies">View All</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredCompanies.map((company, index) => (
              <Link
                key={company.id}
                to={`/company/${company.id}`}
                className="block animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="card-hover h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={company.image}
                        alt={company.name}
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{company.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{company.category}</p>
                        <div className="flex items-center gap-2">
                          <StarRating rating={Math.round(company.rating)} size="sm" />
                          <span className="text-sm font-medium">{company.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({company.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link to="/companies">View All Companies</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* For Business Section */}
      <section className="container py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Grow Your Business with Customer Reviews
            </h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of local businesses using RepuTrack to collect, manage, and showcase 
              customer reviews. Turn happy customers into powerful advocates for your brand.
            </p>
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" asChild>
              <Link to="/auth/register?type=business">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="relative">
            <Card className="p-6 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Recent Reviews</h3>
                  <span className="text-sm text-muted-foreground">Today</span>
                </div>
                {[
                  { name: "Sarah M.", rating: 5, text: "Excellent service! Very professional and on time." },
                  { name: "John D.", rating: 5, text: "Best plumber in town. Highly recommend!" },
                  { name: "Lisa K.", rating: 4, text: "Great work, fair pricing. Will use again." },
                ].map((review, index) => (
                  <div key={index} className="p-4 bg-secondary/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{review.name}</span>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Whether you're looking for trusted local businesses or want to grow your company's reputation, 
            RepuTrack is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/companies">Find a Business</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/auth/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
