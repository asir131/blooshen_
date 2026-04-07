import { Link } from "react-router-dom";

interface Article {
  id: number;
  category: string;
  title: string;
  excerpt?: string;
  author: string;
  date: string;
  readTime?: string;
  image: string;
}

const featured: Article = {
  id: 1,
  category: "Industry News",
  title: "Electric Trucks Are Reshaping the American Pickup Market",
  excerpt:
    "From the F-150 Lightning to the Cybertruck, electrification is rewriting the rules of America's most popular vehicle segment. Here's what buyers need to know heading into 2026.",
  author: "Marcus Chen",
  date: "Apr 2, 2026",
  readTime: "6 min read",
  image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=500&fit=crop",
};

const articles: Article[] = [
  { id: 2, category: "Car Culture", title: "JDM Legends: Why the R34 Skyline Is Still King", author: "Priya Sharma", date: "Mar 28, 2026", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=260&fit=crop" },
  { id: 3, category: "DIY", title: "5 Weekend Mods Under $200 That Transform Your Daily", author: "Tyler Brooks", date: "Mar 25, 2026", image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=260&fit=crop" },
  { id: 4, category: "Entertainment", title: "The Best Automotive Podcasts You Should Be Listening To", author: "Jade Williams", date: "Mar 22, 2026", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=260&fit=crop" },
  { id: 5, category: "Industry News", title: "New Emission Standards Could Change Used Car Pricing", author: "David Park", date: "Mar 19, 2026", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=260&fit=crop" },
];

const CategoryBadge = ({ label }: { label: string }) => (
  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-heading font-bold tracking-wider bg-cta/15 text-cta uppercase">
    {label}
  </span>
);

const NewsSection = () => {
  return (
    <section className="container py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-1 h-10 bg-cta rounded-full shrink-0 mt-0.5" />
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              Automotive News & Entertainment
            </h2>
            <p className="text-sm text-muted-foreground font-body mt-1">
              Stories, reviews, and culture for car enthusiasts
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured story — left column */}
        <Link
          to={`/news/${featured.id}`}
          className="group lg:col-span-1 rounded-lg border border-border bg-card overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-[0_0_24px_hsl(50_100%_50%/0.08)]"
        >
          <div className="relative h-52 lg:h-64 overflow-hidden">
            <img src={featured.image} alt={featured.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
          </div>
          <div className="p-5 space-y-3">
            <CategoryBadge label={featured.category} />
            <h3 className="font-heading text-lg font-bold text-foreground leading-snug line-clamp-2">
              {featured.title}
            </h3>
            <p className="text-sm text-muted-foreground font-body line-clamp-3">
              {featured.excerpt}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
              <span>{featured.author}</span>
              <span>·</span>
              <span>{featured.date}</span>
              <span>·</span>
              <span>{featured.readTime}</span>
            </div>
            <span className="inline-block text-sm font-heading font-bold text-cta">
              Read More →
            </span>
          </div>
        </Link>

        {/* Smaller articles — 2x2 grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {articles.map((a) => (
            <Link
              key={a.id}
              to={`/news/${a.id}`}
              className="group flex flex-col rounded-lg border border-border bg-card overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-[0_0_24px_hsl(50_100%_50%/0.08)] hover:-translate-y-0.5"
            >
              <div className="relative h-36 overflow-hidden">
                <img src={a.image} alt={a.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-4 flex-1 space-y-2">
                <CategoryBadge label={a.category} />
                <h3 className="font-heading text-sm font-bold text-foreground leading-snug line-clamp-2">
                  {a.title}
                </h3>
                <div className="text-xs text-muted-foreground font-body">
                  {a.author} · {a.date}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* See all link */}
      <div className="text-center mt-8">
        <Link to="/news" className="font-heading text-sm font-bold text-cta hover:underline tracking-wider">
          SEE ALL NEWS & ENTERTAINMENT →
        </Link>
      </div>
    </section>
  );
};

export default NewsSection;
