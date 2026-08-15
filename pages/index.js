import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ success: false, message: 'Bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
      <h1 style={{ color: '#e1306c' }}>VEXORPVİP-RESET</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Kullanıcı adı, email veya telefon"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" disabled={loading} style={{ marginTop: '10px', padding: '10px 20px' }}>
          {loading ? 'Gönderiliyor...' : 'Sıfırla'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#f1f1f1' }}>
          <p style={{ color: result.success ? 'green' : 'red', fontWeight: 'bold' }}>
            {result.message}
          </p>
        </div>
      )}
    </div>
  );
  }
