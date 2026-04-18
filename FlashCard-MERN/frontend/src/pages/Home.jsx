import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StudentCard from '../components/StudentCard';
import StudentModal from '../components/StudentModal';
import Pagination from '../components/Pagination';

export default function Home() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 9 });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/students/stats');
      setStats(data.data);
    } catch {}
  };

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (search) params.set('search', search);
      if (filterCourse) params.set('course', filterCourse);
      if (filterCity) params.set('city', filterCity);

      const { data } = await api.get(`/students?${params}`);
      setStudents(data.data.students);
      setPagination(data.data.pagination);
    } catch (err) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [search, filterCourse, filterCity, page]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);
  useEffect(() => { fetchStats(); }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleAdd = () => { setEditStudent(null); setShowModal(true); };
  const handleEdit = (student) => { setEditStudent(student); setShowModal(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      toast.success('Student deleted');
      fetchStudents();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editStudent) {
        await api.put(`/students/${editStudent._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Student updated!');
      } else {
        await api.post('/students', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Student added!');
      }
      setShowModal(false);
      fetchStudents();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const statCard = (label, value, icon) => (
    <div style={{
      background: 'var(--card-bg)', border: '1px solid var(--border)',
      borderRadius: '14px', padding: '20px 24px',
      display: 'flex', alignItems: 'center', gap: '16px',
    }}>
      <span style={{ fontSize: '28px' }}>{icon}</span>
      <div>
        <p style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{value ?? '—'}</p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{label}</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(32px,5vw,52px)',
          lineHeight: 1.1, marginBottom: '12px',
          background: 'linear-gradient(135deg, #fff 30%, var(--accent2))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Student Flashcards
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
          Manage and browse student profiles with ease
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {statCard('Total Students', stats.total, '🎓')}
          {statCard('Unique Courses', stats.uniqueCourses, '📚')}
          {statCard('Cities', stats.uniqueCities, '🌆')}
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '32px', alignItems: 'center' }}>
        <input
          className="input" placeholder="🔍 Search by name, course, city..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          style={{ flex: '1', minWidth: '220px' }}
        />
        <input
          className="input" placeholder="Filter course..."
          value={filterCourse}
          onChange={e => { setFilterCourse(e.target.value); setPage(1); }}
          style={{ width: '160px' }}
        />
        <input
          className="input" placeholder="Filter city..."
          value={filterCity}
          onChange={e => { setFilterCity(e.target.value); setPage(1); }}
          style={{ width: '140px' }}
        />
        {(search || filterCourse || filterCity) && (
          <button className="btn btn-ghost" onClick={() => { setSearchInput(''); setFilterCourse(''); setFilterCity(''); setPage(1); }}>
            ✕ Clear
          </button>
        )}
        {user && (
          <button className="btn btn-primary" onClick={handleAdd}>
            ➕ Add Student
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div className="spinner" />
          <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '14px' }}>Loading students...</p>
        </div>
      ) : students.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</p>
          <p style={{ fontSize: '18px', fontWeight: 600 }}>No students found</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            {user ? 'Click "Add Student" to get started' : 'Login to add students'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px',
        }}>
          {students.map((s, i) => (
            <div key={s._id} style={{ animationDelay: `${i * 0.05}s` }}>
              <StudentCard student={s} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}

      <Pagination pagination={{ ...pagination, page }} onPageChange={setPage} />

      {showModal && (
        <StudentModal
          student={editStudent}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          loading={saving}
        />
      )}
    </div>
  );
}
