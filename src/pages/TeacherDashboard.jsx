import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../api/http";
import { BarChart, LineChart, PieChart } from "../components/Charts";
import Layout from "../components/Layout";

export default function TeacherDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    Promise.all([http.get("/analytics/teacher"), http.get("/articles?mine=true")]).then(([a, b]) => {
      setAnalytics(a.data);
      setArticles(b.data);
    });
  }, []);

  const categories = analytics?.categoryStats || [];
  const views = analytics?.articleViews || [];
  const days = analytics?.dailyEngagement || [];

  return (
    <Layout>
      <section className="stats-grid">
        <div className="stat"><span>Articles Created</span><strong>{analytics?.cards.articlesCreated || 0}</strong></div>
        <div className="stat"><span>Total Students Read</span><strong>{analytics?.cards.totalStudentsRead || 0}</strong></div>
        <div className="stat"><span>Total Views</span><strong>{analytics?.cards.totalViews || 0}</strong></div>
      </section>

      <section className="dashboard-grid">
        <article className="panel"><h2>Articles vs Views</h2><BarChart labels={views.map((x) => x.title)} values={views.map((x) => x.views)} label="Views" /></article>
        <article className="panel"><h2>Category Distribution</h2><PieChart labels={categories.map((x) => x._id)} values={categories.map((x) => x.views)} label="Views" /></article>
        <article className="panel wide"><h2>Daily Engagement</h2><LineChart labels={days.map((x) => x._id)} values={days.map((x) => x.duration)} label="Seconds read" /></article>
      </section>

      <section className="panel">
        <div className="section-title"><h2>Articles</h2><Link className="button-link" to="/teacher/articles/new">Create Article</Link></div>
        <div className="table">
          {articles.map((article) => (
            <div className="table-row" key={article._id}>
              <span>{article.title}</span><span>{article.category}</span>
              <Link to={`/teacher/articles/${article._id}/edit`}><Edit size={17} /> Edit</Link>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
