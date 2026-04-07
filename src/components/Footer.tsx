import autowurxLogo from "@/assets/autowurx-logo.png";

const categoryLinks = [
  "Cars for Sale",
  "Parts & Accessories",
  "Service Providers",
  "Rentals",
  "Reviews & Ratings",
  "Events & Meetups",
];

const companyLinks = ["About", "Contact", "Terms of Service", "Privacy Policy"];

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card pb-20 md:pb-0">
      <div className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <a href="/">
              <img src={autowurxLogo} alt="Autowurx" className="h-6" />
            </a>
            <p className="text-sm text-muted-foreground font-body">
              Driving Traffic Forward — the automotive marketplace built for enthusiasts, by enthusiasts.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading text-sm font-bold tracking-wider text-foreground mb-4">CATEGORIES</h4>
            <ul className="space-y-2">
              {categoryLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground font-body hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading text-sm font-bold tracking-wider text-foreground mb-4">COMPANY</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground font-body hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter placeholder */}
          <div>
            <h4 className="font-heading text-sm font-bold tracking-wider text-foreground mb-4">STAY CONNECTED</h4>
            <p className="text-sm text-muted-foreground font-body">
              Follow us for the latest listings, deals, and automotive news.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground font-body">
            © {new Date().getFullYear()} Autowurx. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;