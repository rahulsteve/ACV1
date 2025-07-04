export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { phone } = req.body;
  const apiKey = process.env.DATASOAP_API_KEY;

  console.log('Received phone:', phone);
  console.log('Using API key:', apiKey);

  if (!apiKey || !phone) {
    return res.status(400).json({ error: 'Missing API key or phone number' });
  }

  try {
    const url = `https://api.datasoap.co.uk/v2/?number=${encodeURIComponent(phone)}&type=HLR&output=json&key=${encodeURIComponent(apiKey)}`;
    console.log('Requesting URL:', url);
    const response = await fetch(url);

    const text = await response.text();
    console.log('Raw response:', text);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${text}`);
    }

    const data = JSON.parse(text);
    return res.status(200).json(data);

  } catch (err) {
    console.error('Error in API route:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
} 