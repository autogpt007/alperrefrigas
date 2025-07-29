import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, Phone, Mail } from "lucide-react";
import SEOComponent from "@/components/seo/SEOComponent";
import EmailObfuscator from "@/components/seo/EmailObfuscator";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <SEOComponent
        title="Page Not Found - 404 Error"
        description="The page you're looking for doesn't exist. Find professional refrigerant products and HVAC solutions at Alper Refrigerants."
        canonicalUrl="/404"
      />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
              <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
              <p className="text-muted-foreground mb-6">
                Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Button asChild variant="default" className="h-12">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Return Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12">
                <Link to="/products">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Products
                </Link>
              </Button>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Popular Pages</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <Link to="/products/refrigerants" className="text-primary hover:underline">
                  Refrigerants
                </Link>
                <Link to="/products/hvac-equipment" className="text-primary hover:underline">
                  HVAC Equipment
                </Link>
                <Link to="/about" className="text-primary hover:underline">
                  About Us
                </Link>
                <Link to="/contact" className="text-primary hover:underline">
                  Contact
                </Link>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                Need help? Contact our support team:
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/contact">
                    <Phone className="mr-2 h-4 w-4" />
                    (210) 939-1115
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <EmailObfuscator 
                    email="support@alperrefrigas.com"
                    className="flex items-center"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email Support
                  </EmailObfuscator>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default NotFound;
