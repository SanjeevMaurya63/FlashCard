import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const PLACEHOLDER = 'https://ui-avatars.com/api/?background=6c63ff&color=fff&size=200&bold=true&name=';

export default function StudentCard({ student, onEdit, onDelete }) {
  const { user } = useAuth();
  const [imgErr, setImgErr] = useState(false);

  const imgSrc = (!imgErr && student.image?.url) ? student.image.url
    : `${PLACEHOLDER}${encodeURIComponent(student.name)}`;

  const yearColors = ['', '#6c63ff','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: '20px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      animation: 'fadeUp 0.4s ease forwards',
      cursor: 'default',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.borderColor = 'rgba(108,99,255,0.4)';
      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(108,99,255,0.1)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      {/* Top accent bar */}
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${yearColors[student.year] || '#6c63ff'}, transparent)` }} />

      <div style={{ padding: '24px', textAlign: 'center' }}>
        {/* Avatar */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
          <img
            src={imgSrc}
            alt={student.name}
            onError={() => setImgErr(true)}
            style={{
              width: '90px', height: '90px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid rgba(108,99,255,0.3)',
              display: 'block',
            }}
          />
          <span style={{
            position: 'absolute', bottom: 0, right: 0,
            background: yearColors[student.year] || '#6c63ff',
            color: '#fff', fontSize: '10px', fontWeight: 700,
            padding: '2px 6px', borderRadius: '8px',
          }}>
            Y{student.year || 1}
          </span>
        </div>

        {/* Info */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '17px', marginBottom: '6px' }}>
          {student.name}
        </h3>

        <span style={{
          display: 'inline-block',
          background: 'rgba(108,99,255,0.15)',
          color: 'var(--accent2)',
          fontSize: '12px', fontWeight: 500,
          padding: '3px 10px', borderRadius: '20px',
          marginBottom: '12px',
        }}>
          {student.course}
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <span>📍 {student.city}</span>
          {student.email && <span>✉️ {student.email}</span>}
          {student.phone && <span>📞 {student.phone}</span>}
        </div>

        {/* Added by */}
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px', opacity: 0.6 }}>
          by {student.addedBy?.username || 'admin'}
        </p>
      </div>

      {/* Actions (only if logged in) */}
      {user && (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          display: 'flex', gap: '8px',
        }}>
          <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: '13px', padding: '8px' }}
            onClick={() => onEdit(student)}>
            ✏️ Edit
          </button>
          <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center', fontSize: '13px', padding: '8px' }}
            onClick={() => onDelete(student._id)}>
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}
