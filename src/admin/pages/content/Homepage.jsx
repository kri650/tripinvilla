import React, { useState, useEffect } from "react";

const SectionLabel = ({ text }) => (
  <div style={{ marginBottom: 24, marginTop: 12 }}>
    <span
      style={{
        padding: "6px 20px",
        border: "1px solid #58A429",
        color: "#58A429",
        borderRadius: "4px",
        fontSize: "13px",
        fontWeight: 500,
        display: "inline-block",
      }}
    >
      {text}
    </span>
  </div>
);

const FileUpload = ({ label, name, onChange, fileData }) => {
  const [preview, setPreview] = useState(false);
  const previewRef = React.useRef(null);
  const isIcon =
    label.toLowerCase().includes("icon") || label.toLowerCase().includes("svg");

  const isFile = fileData instanceof File;
  const filename = isFile
    ? fileData.name
    : fileData
      ? fileData.split("/").pop()
      : "";
  const previewUrl = isFile ? URL.createObjectURL(fileData) : fileData;

  const handleTogglePreview = () => {
    setPreview(!preview);
    if (!preview) {
      setTimeout(() => {
        previewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  };

  return (
    <div className="form-group" style={{ marginBottom: preview ? 24 : 0 }}>
      <label
        className="form-label"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{label}</span>
        <span style={{ color: "#9CA3AF", fontSize: 10, fontWeight: 400 }}>
          {isIcon
            ? "Supported File: .svg / max. 5mb"
            : "Supported File: .jpg / max. 5mb"}
        </span>
      </label>

      <div
        className="file-upload-wrapper"
        style={{
          display: "flex",
          background: "#F9FAFB",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <input
          type="text"
          className="form-input"
          value={filename || "Choose a file..."}
          readOnly
          style={{
            border: "none",
            background: "transparent",
            flex: 1,
            textOverflow: "ellipsis",
            overflow: "hidden",
            padding: "10px 14px",
          }}
        />

        <div style={{ position: "relative" }}>
          <input
            type="file"
            name={name}
            accept={isIcon ? ".svg,image/svg+xml" : "image/*"}
            onChange={onChange}
            style={{
              position: "absolute",
              opacity: 0,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              cursor: "pointer",
            }}
          />
          <button
            className="btn-browse"
            type="button"
            style={{
              border: "none",
              borderLeft: "1px solid #E5E7EB",
              background: "#F3F4F6",
              height: "100%",
              padding: "0 20px",
              cursor: "pointer",
              color: "#374151",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Browse
          </button>
        </div>

        {previewUrl && (
          <button
            type="button"
            onClick={handleTogglePreview}
            style={{
              border: "none",
              borderLeft: "1px solid #E5E7EB",
              background: preview ? "#E5E7EB" : "#F9FAFB",
              padding: "0 20px",
              cursor: "pointer",
              color: "#111827",
              fontSize: "13px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
          >
            {preview ? "Hide" : "View"}
          </button>
        )}
      </div>

      {preview && previewUrl && (
        <div
          ref={previewRef}
          style={{
            marginTop: "16px",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #E5E7EB",
            background: "#FAFAFA",
            padding: "16px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {previewUrl.endsWith(".mp4") || previewUrl.endsWith(".webm") ? (
            <video
              src={previewUrl}
              controls
              autoPlay
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
          ) : (
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                display: "block",
                objectFit: "contain",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default function Homepage() {
  const [formData, setFormData] = useState({
    banner: { title: "Find Your Perfect Stay", image: "" },
    section1: {
      title: "Best Villas around you",
      subText:
        "Choose from homestays, villas, apartments, resorts and more—stays that fit your travel style.",
    },
    section2: {
      title: "Curated properties",
      subText:
        "Carefully selected stays that meet our standards for comfort, quality, and location.",
    },
    section4: {
      title: "Popular Offers of Property",
      subText:
        "Exclusive deals on handpicked stays — limited-time offers you won't want to miss.",
    },
    section5: {
      title: "Why Choose Our *Services*",
      subText: "Choose the next destination for you",
      row1: {
        title: "Verified & Trusted Stays",
        subText: "Get genuine and good stays",
      },
      row1Desc:
        "Every property is carefully verified to ensure quality, safety, and comfort you can rely on.",
      row2: {
        title: "24/7 Support, Always There",
        subText: "All type of support",
      },
      row2Desc:
        "From booking to checkout, our support team is available anytime to help you.",
      features: [
        { title: "Secure Payments", image: "", icon: "" },
        { title: "Best Price Guarantee", image: "", icon: "" },
        { title: "Fast Booking", image: "", icon: "" },
      ],
      image3: "",
    },
  });

  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/content/homepage`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data && Object.keys(data.data).length > 0) {
          const { section3, section6, section7, ...rest } = data.data;
          setFormData((prev) => ({ ...prev, ...rest }));
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e, path) => {
    const value = e.target.value;
    setFormData((prev) => {
      const keys = path.split(".");
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleFileChange = (e, fieldname) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [fieldname]: e.target.files[0] }));
    }
  };

  const getFileDisplay = (fieldname) => {
    if (files[fieldname]) return files[fieldname];
    const keys = fieldname.split(".");
    let current = formData;
    for (const key of keys) {
      if (!current) break;
      current = current[key];
    }
    if (current && typeof current === "string" && current.startsWith("http")) {
      return current;
    }
    return "";
  };

  const buildPayload = () => {
    const { section3, section6, section7, ...payload } = formData;
    return payload;
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const payload = buildPayload();
      console.log("💾 Saving homepage content:", payload);
      const fd = new FormData();
      fd.append("contentData", JSON.stringify(payload));
      Object.keys(files).forEach((key) => {
        fd.append(key, files[key]);
      });
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/content/homepage`,
        {
          method: "PUT",
          body: fd,
        },
      );
      if (res.ok) {
        const result = await res.json();
        console.log("✅ Save response:", result);
        if (result?.data) {
          const { section3, section6, section7, ...rest } = result.data;
          setFormData((prev) => ({ ...prev, ...rest }));
        }
        setFiles({});
        alert("Homepage content updated successfully!");
      } else {
        alert("Failed to update homepage content.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating homepage content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="props-breadcrumb" style={{ margin: "0 39px 12px" }}>
        Content Management &gt; <span>Homepage</span>
      </div>

      <div className="dash-section" style={{ marginBottom: 24 }}>
        <div className="master-form-card" style={{ margin: 0 }}>
          <div className="master-form-header" style={{ marginBottom: 0 }}>
            <div className="master-form-title">Homepage</div>
            <div className="master-form-actions">
              <button
                className="btn-solid-green"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>



          {/* Banner */}
          <SectionLabel text="Banner" />
          <div className="form-grid-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Title*{" "}
                <span
                  style={{
                    fontSize: 10,
                    color: "#9CA3AF",
                    fontWeight: "normal",
                  }}
                >
                  (Wrap word in *asterisks* to highlight)
                </span>
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.banner.title}
                onChange={(e) => handleChange(e, "banner.title")}
              />
            </div>
            <FileUpload
              label="Upload Image*"
              name="banner.image"
              onChange={(e) => handleFileChange(e, "banner.image")}
              fileData={getFileDisplay("banner.image")}
            />
          </div>



          {/* Section 1 — Best Villas Around You */}
          <SectionLabel text="Section 1 — Best Villas Around You" />
          <div className="form-grid-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Title*{" "}
                <span
                  style={{
                    fontSize: 10,
                    color: "#9CA3AF",
                    fontWeight: "normal",
                  }}
                >
                  (Wrap word in *asterisks* to highlight)
                </span>
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.section1.title}
                onChange={(e) => handleChange(e, "section1.title")}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sub-Text*</label>
              <input
                type="text"
                className="form-input"
                value={formData.section1.subText}
                onChange={(e) => handleChange(e, "section1.subText")}
              />
            </div>
          </div>



          {/* Section 2 — Curated Propertie */}
          <SectionLabel text="Section 2 — Curated Properties" />
          <div className="form-grid-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Title*{" "}
                <span
                  style={{
                    fontSize: 10,
                    color: "#9CA3AF",
                    fontWeight: "normal",
                  }}
                >
                  (Wrap word in *asterisks* to highlight)
                </span>
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.section2.title}
                onChange={(e) => handleChange(e, "section2.title")}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sub-Text*</label>
              <input
                type="text"
                className="form-input"
                value={formData.section2.subText}
                onChange={(e) => handleChange(e, "section2.subText")}
              />
            </div>
          </div>



          {/* Section 4 — Popular Offers (homepage) */}
          <SectionLabel text="Section 3 — Popular Offers of Property" />
          <div className="form-grid-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Title*{" "}
                <span
                  style={{
                    fontSize: 10,
                    color: "#9CA3AF",
                    fontWeight: "normal",
                  }}
                >
                  (Wrap word in *asterisks* to highlight)
                </span>
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.section4.title}
                onChange={(e) => handleChange(e, "section4.title")}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sub-Text*</label>
              <input
                type="text"
                className="form-input"
                value={formData.section4.subText}
                onChange={(e) => handleChange(e, "section4.subText")}
              />
            </div>
          </div>



          {/* Section 5 — Why Choose Our Services */}
          <SectionLabel text="Section 4 — Why Choose Our Services" />
          <div className="form-grid-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Main Title*</label>
              <input
                type="text"
                className="form-input"
                value={formData.section5.title || ""}
                onChange={(e) => handleChange(e, "section5.title")}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Main Sub-Text*</label>
              <input
                type="text"
                className="form-input"
                value={formData.section5.subText || ""}
                onChange={(e) => handleChange(e, "section5.subText")}
              />
            </div>
          </div>
          <div className="form-grid-3">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Row 1 Title*</label>
              <input
                type="text"
                className="form-input"
                value={formData.section5.row1.title}
                onChange={(e) => handleChange(e, "section5.row1.title")}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Row 1 Sub-Text*</label>
              <input
                type="text"
                className="form-input"
                value={formData.section5.row1.subText}
                onChange={(e) => handleChange(e, "section5.row1.subText")}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Row 1 Description*</label>
              <input
                type="text"
                className="form-input"
                value={formData.section5.row1Desc || ""}
                onChange={(e) => handleChange(e, "section5.row1Desc")}
              />
            </div>
          </div>
          <div className="form-grid-3">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Row 2 Title*</label>
              <input
                type="text"
                className="form-input"
                value={formData.section5.row2.title}
                onChange={(e) => handleChange(e, "section5.row2.title")}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Row 2 Sub-Text*</label>
              <input
                type="text"
                className="form-input"
                value={formData.section5.row2.subText}
                onChange={(e) => handleChange(e, "section5.row2.subText")}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Row 2 Description*</label>
              <input
                type="text"
                className="form-input"
                value={formData.section5.row2Desc || ""}
                onChange={(e) => handleChange(e, "section5.row2Desc")}
              />
            </div>
          </div>

          <div className="form-grid-3" style={{ marginBottom: 24 }}>
            <FileUpload
              label="Image 1*"
              name="section5.features.0.image"
              onChange={(e) => handleFileChange(e, "section5.features.0.image")}
              fileData={getFileDisplay("section5.features.0.image")}
            />
            <FileUpload
              label="Upload SVG (Icon 1)*"
              name="section5.features.0.icon"
              onChange={(e) => handleFileChange(e, "section5.features.0.icon")}
              fileData={getFileDisplay("section5.features.0.icon")}
            />
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Feature 1 Title*</label>
              <input
                type="text"
                className="form-input"
                value={formData.section5.features[0].title}
                onChange={(e) => handleChange(e, "section5.features.0.title")}
              />
            </div>
          </div>

          <div className="form-grid-3" style={{ marginBottom: 24 }}>
            <div style={{ gridColumn: "span 2" }}>
              <FileUpload
                label="Image 3 (Center)*"
                name="section5.image3"
                onChange={(e) => handleFileChange(e, "section5.image3")}
                fileData={getFileDisplay("section5.image3")}
              />
            </div>
          </div>

          <div className="form-grid-3" style={{ marginBottom: 0 }}>
            <FileUpload
              label="Image 2*"
              name="section5.features.1.image"
              onChange={(e) => handleFileChange(e, "section5.features.1.image")}
              fileData={getFileDisplay("section5.features.1.image")}
            />
            <FileUpload
              label="Upload SVG (Icon 2)*"
              name="section5.features.1.icon"
              onChange={(e) => handleFileChange(e, "section5.features.1.icon")}
              fileData={getFileDisplay("section5.features.1.icon")}
            />
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Feature 2 Title*</label>
              <input
                type="text"
                className="form-input"
                value={formData.section5.features[1].title}
                onChange={(e) => handleChange(e, "section5.features.1.title")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
