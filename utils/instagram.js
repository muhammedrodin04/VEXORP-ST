import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Rastgele cihaz kimliği oluşturur
function generateDeviceId() {
  return `android-${crypto.randomBytes(8).toString('hex')}`;
}

export async function sendReset(query) {
  // 1. CSRF token ve mid al
  const session = axios.create({
    headers: {
      'User-Agent': 'Instagram 368.0.0.45.96 Android (30/11; 440dpi; 1080x2220; Xiaomi/Redmi; 23127PN0CC; begonia; mt6785; ar_EG; 700073482)',
      'Accept': '*/*',
      'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8'
    }
  });

  const getResp = await session.get('https://www.instagram.com/');
  const csrfToken = getResp.headers['set-cookie']?.find(c => c.startsWith('csrftoken='))?.split(';')[0]?.split('=')[1];
  const mid = getResp.headers['set-cookie']?.find(c => c.startsWith('mid='))?.split(';')[0]?.split('=')[1];

  if (!csrfToken || !mid) {
    throw new Error('CSRF veya MID alınamadı');
  }

  // 2. Şifre sıfırlama isteğini gönder
  const payload = {
    search_query: query,
    bloks_versioning_id: 'dbfb0f84b6481f4ec0a033d7947fb45db546b8cee18dde220c4c1eefd3bb3dcb'
  };

  const headers = {
    'User-Agent': 'Instagram 368.0.0.45.96 Android',
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-bloks-version-id': 'dbfb0f84b6481f4ec0a033d7947fb45db546b8cee18dde220c4c1eefd3bb3dcb',
    'x-ig-app-id': '567067343352427',
    'x-csrftoken': csrfToken
  };

  const cookies = {
    csrftoken: csrfToken,
    mid: mid,
    ig_did: uuidv4().toUpperCase()
  };

  const postResp = await axios.post(
    'https://i.instagram.com/api/v1/bloks/async_action/com.bloks.www.caa.ar.search.async/',
    new URLSearchParams(payload).toString(),
    { headers, withCredentials: true, cookies }
  );

  const data = postResp.data;
  const dataStr = JSON.stringify(data);

  // 3. Yanıtı analiz et
  let success = false;
  let message = 'Bilinmeyen yanıt';
  if (dataStr.includes('account_recovery_lookup_success')) {
    success = true;
    message = 'Şifre sıfırlama bağlantısı gönderildi!';
  } else if (dataStr.includes('search_success_client')) {
    success = true;
    message = 'Hesap bulundu, şifre sıfırlama başlatıldı!';
  } else if (dataStr.includes('account_not_found') || dataStr.toLowerCase().includes('not found')) {
    success = false;
    message = 'Hesap bulunamadı!';
  } else {
    success = false;
    message = 'Bilinmeyen yanıt';
  }

  return { success, message, raw: data };
}
