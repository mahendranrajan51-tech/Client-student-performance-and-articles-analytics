import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../api/http";
import Layout from "../components/Layout";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith("article-viewed-"))
      .forEach((key) => sessionStorage.removeItem(key));

    http.get("/articles").then(({ data }) => setArticles(data));
  }, []);

  const categories = useMemo(() => [...new Set(articles.map((item) => item.category))], [articles]);
  const filtered = articles.filter((article) => {
    const matchesCategory = !category || article.category === category;
    const term = query.toLowerCase();
    const matchesQuery = !term || article.title.toLowerCase().includes(term) || article.contentBlocks.some((block) => block.value.toLowerCase().includes(term));
    return matchesCategory && matchesQuery;
  });

  return (
    <Layout>
      <section className="panel">
        <div className="filters">
          <label className="search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles" /></label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </section>
      <section className="article-grid">
        {filtered.map((article) => (
          <Link className="article-card" key={article._id} to={`/student/articles/${article._id}`}>
            <span>{article.category}</span>
            <h2>{article.title}</h2>
            <p>{article.contentBlocks.find((block) => block.type === "text")?.value.slice(0, 150) || "Open this lesson to view its media blocks."}</p>
          </Link>
        ))}
      </section>
    </Layout>
  );
}
