export default function handler(req, res) {
  // Habilitar CORS para las analíticas
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      // Procesar el evento de analíticas
      const event = req.body;
      
      // Aquí puedes agregar lógica adicional para procesar los eventos
      console.log('Analytics event received:', event);
      
      // Responder con éxito
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error processing analytics event:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 