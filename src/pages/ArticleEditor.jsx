import { FileCheck2, Link as LinkIcon, Plus, Save, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { http } from "../api/http";
import Layout from "../components/Layout";

const apiOrigin = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
const categories = ["Science", "Math", "English", "Technology", "History", "General"];
const emptyBlock = { type: "text", value: "", caption: "", uploadName: "" };

const assetUrl = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${apiOrigin}${value}`;
};

const acceptedFiles = {
  image: "image/png,image/jpeg,image/webp,image/gif",
  video: "video/mp4,video/webm,video/ogg",
  "3d": ".glb,.gltf,.obj,.fbx,model/gltf+json,model/gltf-binary"
};

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { title: "", category: "Science" }
  });
  const [contentBlocks, setContentBlocks] = useState([{ ...emptyBlock }]);
  const [error, setError] = useState("");
  const [uploadingIndex, setUploadingIndex] = useState(null);

  useEffect(() => {
    if (id) {
      http.get(`/articles/${id}`).then(({ data }) => {
        reset({ title: data.title, category: data.category });
        setContentBlocks(data.contentBlocks?.length ? data.contentBlocks : [{ ...emptyBlock }]);
      });
    }
  }, [id, reset]);

  const updateBlock = (index, patch) => {
    setContentBlocks((current) => current.map((block, i) => (i === index ? { ...block, ...patch } : block)));
  };

  const addBlock = () => setContentBlocks((current) => [...current, { ...emptyBlock }]);

  const removeBlock = (index) => {
    setContentBlocks((current) => current.length === 1 ? current : current.filter((_, i) => i !== index));
  };

  const uploadFile = async (index, file) => {
    if (!file) return;
    setError("");
    setUploadingIndex(index);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await http.post("/articles/upload", formData);
      updateBlock(index, {
        value: data.url,
        caption: contentBlocks[index]?.caption || data.filename,
        uploadName: data.filename
      });
    } catch (err) {
      setError(err.response?.data?.message || "Could not upload this file");
    } finally {
      setUploadingIndex(null);
    }
  };

  const onDrop = (event, index) => {
    event.preventDefault();
    uploadFile(index, event.dataTransfer.files?.[0]);
  };

  const validateBlocks = () => {
    if (!contentBlocks.length) return "Add at least one content block";
    const invalidIndex = contentBlocks.findIndex((block) => !block.value?.trim());
    if (invalidIndex >= 0) return `Content block ${invalidIndex + 1} needs text, a URL, or an uploaded file`;
    return "";
  };

  const submit = async (values) => {
    setError("");
    const blockError = validateBlocks();
    if (blockError) {
      setError(blockError);
      return;
    }

    const payload = {
      ...values,
      contentBlocks: contentBlocks.map(({ type, value, caption }) => ({ type, value, caption }))
    };

    try {
      if (id) await http.put(`/articles/${id}`, payload);
      else await http.post("/articles", payload);
      navigate("/teacher");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save article");
    }
  };

  return (
    <Layout>
      <form className="panel form-panel article-form" onSubmit={handleSubmit(submit)}>
        <div className="form-header">
          <div>
            <span className="eyebrow">Teacher article</span>
            <h2>{id ? "Edit Article" : "Create Article"}</h2>
          </div>
          <button className="submit-button compact-submit"><Save size={18} />Save Article</button>
        </div>

        <div className="form-grid">
          <label>
            Title
            <input
              {...register("title", {
                required: "Title is required",
                minLength: { value: 4, message: "Title must be at least 4 characters" }
              })}
              placeholder="Enter a clear lesson title"
            />
            {errors.title && <span className="field-error">{errors.title.message}</span>}
          </label>
          <label>
            Category
            <select {...register("category", { required: "Category is required" })}>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            {errors.category && <span className="field-error">{errors.category.message}</span>}
          </label>
        </div>

        <div className="section-title">
          <h3>Content Blocks</h3>
          <button type="button" className="small-button" onClick={addBlock}><Plus size={16} />Add Block</button>
        </div>

        <div className="content-blocks">
          {contentBlocks.map((block, index) => (
            <div className="block-editor" key={block._id || index}>
              <div className="block-row">
                <span className="block-number">{index + 1}</span>
                <select value={block.type} onChange={(e) => updateBlock(index, { type: e.target.value, value: "", uploadName: "" })}>
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="3d">3D object</option>
                </select>
                <button type="button" className="icon-button danger-button" aria-label="Remove block" onClick={() => removeBlock(index)}>
                  <Trash2 size={17} />
                </button>
              </div>

              {block.type === "text" ? (
                <textarea
                  className="large-textarea"
                  value={block.value}
                  onChange={(e) => updateBlock(index, { value: e.target.value })}
                  placeholder="Write the article text for this section"
                />
              ) : (
                <div
                  className="upload-zone"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => onDrop(event, index)}
                >
                  <UploadCloud size={28} />
                  <div>
                    <strong>{uploadingIndex === index ? "Uploading..." : `Drop ${block.type} file here`}</strong>
                    <span>or choose a local file from your device</span>
                  </div>
                  <label className="file-picker">
                    Browse
                    <input
                      type="file"
                      accept={acceptedFiles[block.type]}
                      onChange={(event) => uploadFile(index, event.target.files?.[0])}
                    />
                  </label>
                </div>
              )}

              {block.type !== "text" && (
                <>
                  <label className="url-field">
                    <LinkIcon size={16} />
                    <input value={block.value} onChange={(e) => updateBlock(index, { value: e.target.value })} placeholder="Uploaded file path or external URL" />
                  </label>
                  {block.value && (
                    <div className="media-preview">
                      {block.type === "image" && <img src={assetUrl(block.value)} alt={block.caption || "Uploaded preview"} />}
                      {block.type === "video" && <video src={assetUrl(block.value)} controls />}
                      {block.type === "3d" && <span><FileCheck2 size={18} />3D file attached</span>}
                    </div>
                  )}
                </>
              )}

              <input value={block.caption || ""} onChange={(e) => updateBlock(index, { caption: e.target.value })} placeholder="Caption or short label" />
            </div>
          ))}
        </div>

        <div className="mobile-submit-row">
          <button className="submit-button"><Save size={18} />Save Article</button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </Layout>
  );
}
