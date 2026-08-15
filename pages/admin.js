import { useState, useEffect } from 'react';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState([]);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/logs?password=${encodeURIComponent(password)}`);
      if (res.status === 401) {
        alert('Şifre yanlış!');
        setAuth(false);
      } else {
        const data = await res.json();
        setLogs(data);
        setAuth(true);
      }
    } catch (err) {
      alert('Hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  if (!auth) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
        <h2>Admin Girişi</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Admin Şifresi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px' }}
          />
          <button type="submit" style={{ marginTop: '10px' }}>Giriş</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>📋 Tüm Loglar</h1>
      {loading && <p>Yükleniyor...</p>}
      {!loading && logs.length === 0 && <p>Henüz log yok.</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#333', color: '#fff' }}>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Tarih</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>IP</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>User-Agent</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Sorgu</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Başarılı</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Mesaj</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                {new Date(log.timestamp).toLocaleString('tr-TR')}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>{log.ip || '-'}</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', maxWidth: '200px', wordBreak: 'break-all' }}>
                {log.userAgent || '-'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>{log.query}</td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                {log.result?.success ? '✅' : '❌'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>{log.result?.message || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
    }
