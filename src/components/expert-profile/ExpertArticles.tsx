import { Badge } from "@/components/ui/badge";
import type { ExpertArticle, ExpertProfile } from "@/data/mockExpertProfile";

interface ExpertArticlesProps {
  articles: ExpertArticle[];
  expert: ExpertProfile;
}

export default function ExpertArticles({ articles, expert }: ExpertArticlesProps) {
  const [featured, ...rest] = articles;

  return (
    <section className="bg-background py-16 px-4">
      <div className="max-w-[900px] mx-auto">
        <p className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-primary mb-2">Content & Insights</p>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-1">
          From the Desk of {expert.display_name}
        </h2>
        <div className="w-12 h-1 bg-primary rounded mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured article */}
          {featured && (
            <a href={`/experts/${expert.username}/articles/${featured.id}`} className="group block">
              <img src={featured.thumbnail_url} alt={featured.title} className="w-full aspect-video object-cover rounded-xl mb-3" />
              <Badge variant="accent" className="mb-2 text-[10px]">{featured.category}</Badge>
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                {featured.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-2">{featured.excerpt}</p>
              <div className="flex items-center gap-2">
                <img src={expert.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                <span className="text-[11px] text-muted-foreground">{expert.display_name} · {featured.published_at} · {featured.read_time}</span>
              </div>
              <span className="text-xs text-primary hover:underline mt-2 inline-block">Read Full Article →</span>
            </a>
          )}

          {/* Side stack */}
          <div className="flex flex-col gap-4">
            {rest.slice(0, 3).map((article) => (
              <a
                key={article.id}
                href={`/experts/${expert.username}/articles/${article.id}`}
                className="flex gap-3 group hover:border-l-2 hover:border-primary hover:pl-2 transition-all"
              >
                <img src={article.thumbnail_url} alt={article.title} className="w-20 h-[60px] rounded-md object-cover shrink-0" />
                <div className="min-w-0">
                  <Badge variant="accent" className="mb-1 text-[9px] py-0">{article.category}</Badge>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <span className="text-[10px] text-muted-foreground">{article.published_at}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <p className="text-center mt-8">
          <a href={`/experts/${expert.username}/articles`} className="text-sm text-primary hover:underline">
            View All Articles by {expert.display_name} →
          </a>
        </p>
      </div>
    </section>
  );
}
