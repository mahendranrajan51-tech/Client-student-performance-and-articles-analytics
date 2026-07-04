import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { http } from "../api/http";
import Layout from "../components/Layout";

const emptyBlock = { type: "text", value: "", caption: "" };

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", category: "Science", contentBlocks: [{ ...emptyBlock }] });
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) http.get(`/articles/${id}`).then(({ data }) => setForm({ title: data.title, category: data.category, contentBlocks: data.contentBlocks }));
  }, [id]);

  const updateBlock = (index, patch) => {
    setForm((current) => ({
      ...current,
      contentBlocks: current.contentBlocks.map((block, i) => (i === index ? { ...block, ...patch } : block))
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (id) await http.put(`/articles/${id}`, form);
      else await http.post("/articles", form);
      navigate("/teacher");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save article");
    }
  };

  return (
    <Layout>
      <form className="panel form-panel" onSubmit={submit}>
        <h2>{id ? "Edit Article" : "Create Article"}</h2>
        <div className="form-grid">
          <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
          <label>Category<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></label>
        </div>

        <div className="section-title"><h3>Content Blocks</h3><button type="button" className="small-button" onClick={() => setForm({ ...form, contentBlocks: [...form.contentBlocks, { ...emptyBlock }] })}><Plus size={16} /> Add</button></div>
        {form.contentBlocks.map((block, index) => (
          <div className="block-editor" key={block._id || index}>
            <select value={block.type} onChange={(e) => updateBlock(index, { type: e.target.value })}>
              <option value="text">Text</option><option value="image">Image URL</option><option value="video">Video embed URL</option><option value="3d">3D object URL</option>
            </select>
            <textarea value={block.value} onChange={(e) => updateBlock(index, { value: e.target.value })} placeholder="Text content or URL" required />
            <input value={block.caption || ""} onChange={(e) => updateBlock(index, { caption: e.target.value })} placeholder="Caption" />
            <button type="button" className="icon-button" onClick={() => setForm({ ...form, contentBlocks: form.contentBlocks.filter((_, i) => i !== index) })}><Trash2 size={17} /></button>
          </div>
        ))}
        {error && <p className="error">{error}</p>}
        <button className="submit-button"><Save size={18} />Save Article</button>
      </form>
    </Layout>
  );
}
