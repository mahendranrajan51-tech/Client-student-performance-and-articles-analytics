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
          <div className="section-title">
            <h2>Read Articles</h2>
          </div>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Category</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {(analytics?.readArticles || []).map((item) => (
                  <tr key={item._id}>
                    <td>{item.articleId?.title}</td>
                    <td>{item.articleId?.category}</td>
                    <td>{formatDuration(item.duration)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
        <article className="panel wide">
          <h2>Highlights</h2>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>Highlight</th>
                  <th>Note</th>
                  <th>Article</th>
                </tr>
              </thead>
              <tbody>
                {(analytics?.highlights || []).map((item) => (
                  <tr key={item._id}>
                    <td>{item.text}</td>
                    <td>{item.note || "No note"}</td>
                    <td>{item.articleId?.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </Layout>
  );
}
