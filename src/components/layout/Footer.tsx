import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-semibold text-xl mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Star className="h-5 w-5 fill-primary-foreground text-primary-foreground" />
              </div>
              <span>RepuTrack</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Building trust between local businesses and their customers through transparent reviews.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/companies" className="hover:text-foreground transition-colors">
                  Browse Companies
                </Link>
              </li>
              <li>
                <Link to="/for-business" className="hover:text-foreground transition-colors">
                  For Business
                </Link>
              </li>
              <li>
                <Link to="/auth/register" className="hover:text-foreground transition-colors">
                  Write a Review
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} RepuTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
