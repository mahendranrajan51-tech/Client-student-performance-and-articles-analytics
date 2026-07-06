import { BookOpen, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../api/http";
import Layout from "../components/Layout";

const PAGE_SIZE = 6;

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith("article-viewed-"))
      .forEach((key) => sessionStorage.removeItem(key));

    http.get("/articles").then(({ data }) => setArticles(data));
  }, []);

  const categories = useMemo(() => [...new Set(articles.map((item) => item.category))], [articles]);
  const filtered = useMemo(() => articles.filter((article) => {
    const matchesCategory = !category || article.category === category;
    const term = query.toLowerCase();
    const matchesQuery = !term || article.title.toLowerCase().includes(term) || article.contentBlocks.some((block) => String(block.value || "").toLowerCase().includes(term));
    return matchesCategory && matchesQuery;
  }), [articles, category, query]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedArticles = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [query, category]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <Layout>
      <section className="article-list-header">
        <div>
          <span className="eyebrow">Student library</span>
          <h2>Explore articles</h2>
          <p>Find lessons by title, content, or category and continue reading at your own pace.</p>
        </div>
        {/* <div className="article-count">
          <BookOpen size={20} />
          <strong>{filtered.length}</strong>
          <span>{filtered.length === 1 ? "Article" : "Articles"}</span>
        </div> */}
      </section>

      <section className="panel article-toolbar">
        <div className="filters">
          <label className="search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles" /></label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <section className="article-grid">
        {paginatedArticles.map((article) => (
          <Link className="article-card" key={article._id} to={`/student/articles/${article._id}`}>
            <span>{article.category}</span>
            <h2>{article.title}</h2>
            <p>{article.contentBlocks.find((block) => block.type === "text")?.value.slice(0, 150) || "Open this lesson to view its media blocks."}</p>
            <strong>Start reading</strong>
          </Link>
        ))}
      </section>

      {filtered.length === 0 ? (
        <section className="empty-state">
          <BookOpen size={26} />
          <h3>No articles found</h3>
          <p>Try a different search term or category.</p>
        </section>
      ) : (
        <nav className="pagination" aria-label="Article pages">
          <button className="page-button" type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1}>
            <ChevronLeft size={18} /> Previous
          </button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
              <button className={item === page ? "page-number active" : "page-number"} key={item} type="button" onClick={() => setPage(item)}>
                {item}
              </button>
            ))}
          </div>
          <button className="page-button" type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages}>
            Next <ChevronRight size={18} />
          </button>
        </nav>
      )}
    </Layout>
  );
}
