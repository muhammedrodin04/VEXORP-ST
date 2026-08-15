import dbConnect from '../../utils/dbConnect';
import Log from '../../models/Log';
import { sendReset } from '../../utils/instagram';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;
  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Kullanıcı adı, email veya telefon giriniz.' });
  }

  // İstemci bilgilerini al
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'Bilinmiyor';

  let result;
  try {
    result = await sendReset(query.trim());
  } catch (err) {
    result = { success: false, message: `Hata: ${err.message}`, raw: null };
  }

  // Log kaydı
  await dbConnect();
  const log = new Log({
    query: query.trim(),
    ip,
    userAgent,
    result
  });
  await log.save();

  return res.status(200).json(result);
}
