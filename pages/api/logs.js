import dbConnect from '../../utils/dbConnect';
import Log from '../../models/Log';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basit admin doğrulama (query parametresi ile)
  const { password } = req.query;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Yetkisiz erişim' });
  }

  await dbConnect();
  const logs = await Log.find().sort({ timestamp: -1 }).limit(200);
  return res.status(200).json(logs);
}
