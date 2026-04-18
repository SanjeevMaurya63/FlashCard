import { useState, useEffect, useRef } from 'react';

export default function StudentModal({ student, onClose, onSubmit, loading }) {
  const isEdit = !!student;
  const [form, setForm] = useState({
    name: student?.name || '',
    course: student?.course || '',
    city: student?.city || '',
    email: student?.email || '',
    phone: student?.phone || '',
    year: student?.year || 1,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(student?.image?.url || '');
  const fileRef = useRef();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append('image', image);
    onSubmit(fd);
  };

  const labelStyle = { fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: 500 };
  const fieldStyle = { marginBottom: '16px' };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '32px',
        width: '100%',
        maxWidth: '480px',
        animation: 'fadeUp 0.3s ease',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px' }}>
            {isEdit ? '✏️ Edit Student' : '➕ Add Student'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '22px', cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div style={{ ...fieldStyle, textAlign: 'center' }}>
            <div
              onClick={() => fileRef.current.click()}
              style={{
                width: '90px', height: '90px',
                borderRadius: '50%',
                margin: '0 auto 10px',
                border: '2px dashed var(--accent)',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg3)',
                transition: 'border-color 0.2s',
              }}>
              {preview
                ? <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '28px' }}>📷</span>}
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Click to upload photo</span>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          </div>

          {/* Fields */}
          {[
            { name: 'name', label: 'Full Name *', placeholder: 'e.g. Sanjeev Maurya' },
            { name: 'course', label: 'Course *', placeholder: 'e.g. B.Tech CSE' },
            { name: 'city', label: 'City *', placeholder: 'e.g. Delhi' },
            { name: 'email', label: 'Email', placeholder: 'student@email.com' },
            { name: 'phone', label: 'Phone', placeholder: '+91 63989 07211' },
          ].map(({ name, label, placeholder }) => (
            <div key={name} style={fieldStyle}>
              <label style={labelStyle}>{label}</label>
              <input className="input" name={name} value={form[name]} onChange={handleChange}
                placeholder={placeholder}
                required={['name', 'course', 'city'].includes(name)} />
            </div>
          ))}

          {/* Year */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Year</label>
            <select className="input" name="year" value={form.year} onChange={handleChange}>
              {[1, 2, 3, 4, 5, 6].map(y => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={loading}>
              {loading ? '⏳ Saving...' : isEdit ? '✅ Update' : '➕ Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
