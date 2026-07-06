import { useEffect, useState } from "react";
import { http } from "../api/http";
import { PieChart } from "../components/Charts";
import Layout from "../components/Layout";
import { formatDuration } from "../utils/time";

export default function StudentDashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    http.get("/analytics/student").then(({ data }) => setAnalytics(data));
  }, []);

  const categoryTime = analytics?.timePerCategory || [];

  return (
    <Layout>
      <section className="stats-grid">
        <div className="stat"><span>Total Articles Read</span><strong>{analytics?.cards.totalArticlesRead || 0}</strong></div>
        <div className="stat"><span>Total Reading Time</span><strong>{formatDuration(analytics?.cards.totalReadingTime)}</strong></div>
      </section>

      <section className="dashboard-grid">
        <article className="panel"><h2>Reading Time per Category</h2><PieChart labels={categoryTime.map((x) => x._id)} values={categoryTime.map((x) => x.duration)} label="Reading Time" valueFormatter={formatDuration} /></article>
        <article className="panel">
          <h2>Read Articles</h2>
          <div className="table"> 
            {(analytics?.readArticles || []).map((item) => (
              <div className="table-row" key={item._id}>
                <span>{item.articleId?.title}</span><span>{item.articleId?.category}</span><span>{formatDuration(item.duration)}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="panel wide">
          <h2>Highlights</h2>
          <div className="table">
            {(analytics?.highlights || []).map((item) => (
              <div className="table-row" key={item._id}>
                <span>{item.text}</span><span>{item.note || "No note"}</span><span>{item.articleId?.title}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </Layout>
  );
}
