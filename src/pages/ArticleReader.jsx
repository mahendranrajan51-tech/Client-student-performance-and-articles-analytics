import { Box, ExternalLink, Highlighter, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { http } from "../api/http";
import Layout from "../components/Layout";
import "@google/model-viewer";

const apiOrigin = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

const assetUrl = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${apiOrigin}${value}`;
};

function ContentBlock({ block }) {
  if (block.type === "image") {
    return <figure><img src={assetUrl(block.value)} alt={block.caption || "Article visual"} /><figcaption>{block.caption}</figcaption></figure>;
  }

  if (block.type === "video") {
    const source = assetUrl(block.value);
    const isLocalUpload = block.value?.startsWith("/uploads/");
    return (
      <figure>
        {isLocalUpload ? <video src={source} controls /> : <iframe title={block.caption || "Article video"} src={source} allowFullScreen />}
        <figcaption>{block.caption}</figcaption>
      </figure>
    );
  }

if (block.type === "3d") {
  return (
    <figure >
      <model-viewer
        src={assetUrl(block.value)}
        alt={block.caption || "3D Model"}
        auto-rotate
        camera-controls
        shadow-intensity="1"
        style={{
          width: "100%",
          height: "500px",
          background: "#111827",
          borderRadius: "12px"
        }}
      />
      
      <figcaption>
        {block.caption || "3D object"}
      </figcaption>
{/*   <a
        href={assetUrl(block.value)}
        target="_blank"
        rel="noreferrer"
      >
        Open file <ExternalLink size={15} />
      </a> */}
    </figure>
  );
}

  return <p>{block.value}</p>;
}

export default function ArticleReader() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const startRef = useRef(Date.now());
  const sentRef = useRef(false);

  useEffect(() => {
    http.get(`/articles/${id}`).then(({ data }) => setArticle(data));

    const viewKey = `article-viewed-${id}`;
    if (!sessionStorage.getItem(viewKey)) {
      sessionStorage.setItem(viewKey, "true");
      http.post("/tracking/view", { articleId: id });
    }

    startRef.current = Date.now();

    const sendDuration = () => {
      if (sentRef.current) return;
      sentRef.current = true;
      const duration = Math.max(1, (Date.now() - startRef.current) / 1000);
      http.put("/tracking/duration", { articleId: id, duration }).catch(() => {});
    };

    window.addEventListener("beforeunload", sendDuration);
    return () => {
      window.removeEventListener("beforeunload", sendDuration);
      sendDuration();
    };
  }, [id]);

  const captureSelection = () => {
    const text = window.getSelection()?.toString().trim();
    if (text) setSelectedText(text);
  };

  const saveHighlight = async () => {
    if (!selectedText) return;
    await http.post("/student/highlights", { articleId: id, text: selectedText, note });
    setMessage("Highlight saved");
    setSelectedText("");
    setNote("");
  };

  return (
    <Layout>
      <div className="reader-layout">
        <article className="reader panel" onMouseUp={captureSelection}>
          <span className="category-pill">{article?.category}</span>
          <h2>{article?.title}</h2>
          <p className="byline">By {article?.createdBy?.name}</p>
          <div className="article-content">
            {article?.contentBlocks.map((block) => <ContentBlock block={block} key={block._id} />)}
          </div>
        </article>

        <aside className="panel highlight-panel">
          <h2><Highlighter size={20} />Highlight</h2>
          <textarea value={selectedText} onChange={(e) => setSelectedText(e.target.value)} placeholder="Select text in the article or type a highlight" />
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Short note" />
          <button onClick={saveHighlight}><Save size={18} />Save Highlight</button>
          {message && <p className="success">{message}</p>}
        </aside>
      </div>
    </Layout>
  );
}
