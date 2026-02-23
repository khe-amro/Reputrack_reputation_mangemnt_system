import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, User, Building2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const businessSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
});

export default function Register() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("type") === "business" ? "business" : "customer";
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [customerErrors, setCustomerErrors] = useState<Record<string, string>>({});
  const [businessErrors, setBusinessErrors] = useState<Record<string, string>>({});

  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [businessForm, setBusinessForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerErrors({});

    const result = customerSchema.safeParse(customerForm);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setCustomerErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(
      customerForm.email,
      customerForm.password,
      customerForm.name,
      "customer"
    );
    setIsLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message.includes("already registered")
          ? "This email is already registered. Please sign in instead."
          : error.message,
      });
      return;
    }

    toast({
      title: "Account created!",
      description: "Welcome to RepuTrack. You can now start writing reviews.",
    });
    navigate("/");
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusinessErrors({});

    const result = businessSchema.safeParse(businessForm);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setBusinessErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(
      businessForm.email,
      businessForm.password,
      businessForm.name,
      "business_owner",
      businessForm.companyName
    );
    setIsLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message.includes("already registered")
          ? "This email is already registered. Please sign in instead."
          : error.message,
      });
      return;
    }

    toast({
      title: "Business account created!",
      description: "Your company profile is pending approval. You can start setting it up.",
    });
    navigate("/business");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-semibold text-xl mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Star className="h-6 w-6 fill-primary-foreground text-primary-foreground" />
            </div>
            <span>RepuTrack</span>
          </Link>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        <Card className="animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Choose your account type to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={defaultTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="customer" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer
                </TabsTrigger>
                <TabsTrigger value="business" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Business
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customer">
                <form onSubmit={handleCustomerSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Full Name</Label>
                    <Input
                      id="customer-name"
                      placeholder="John Doe"
                      value={customerForm.name}
                      onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                    {customerErrors.name && (
                      <p className="text-sm text-destructive">{customerErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Email</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      placeholder="you@example.com"
                      value={customerForm.email}
                      onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                    {customerErrors.email && (
                      <p className="text-sm text-destructive">{customerErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-password">Password</Label>
                    <Input
                      id="customer-password"
                      type="password"
                      placeholder="••••••••"
                      value={customerForm.password}
                      onChange={(e) => setCustomerForm({ ...customerForm, password: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                    {customerErrors.password && (
                      <p className="text-sm text-destructive">{customerErrors.password}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="business">
                <form onSubmit={handleBusinessSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="business-company">Company Name</Label>
                    <Input
                      id="business-company"
                      placeholder="Your Company LLC"
                      value={businessForm.companyName}
                      onChange={(e) => setBusinessForm({ ...businessForm, companyName: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                    {businessErrors.companyName && (
                      <p className="text-sm text-destructive">{businessErrors.companyName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-name">Your Name</Label>
                    <Input
                      id="business-name"
                      placeholder="John Doe"
                      value={businessForm.name}
                      onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                    {businessErrors.name && (
                      <p className="text-sm text-destructive">{businessErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-email">Business Email</Label>
                    <Input
                      id="business-email"
                      type="email"
                      placeholder="you@company.com"
                      value={businessForm.email}
                      onChange={(e) => setBusinessForm({ ...businessForm, email: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                    {businessErrors.email && (
                      <p className="text-sm text-destructive">{businessErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-password">Password</Label>
                    <Input
                      id="business-password"
                      type="password"
                      placeholder="••••••••"
                      value={businessForm.password}
                      onChange={(e) => setBusinessForm({ ...businessForm, password: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                    {businessErrors.password && (
                      <p className="text-sm text-destructive">{businessErrors.password}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Start Free Trial
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/auth/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
