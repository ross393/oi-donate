// Vercel serverless function: YouTube live check. Ported from netlify/functions/check-live.js.
const CHANNELS = [
  { id: 'UCnM6YVQIM0thPvHqzMkZdWw', label: 'Open Invitational Basel · Floor 1' },
  { id: 'UCUcxmi83Uz6_hYEz-79Eygw', label: 'Open Invitational Basel · Floor 2' },
  { id: 'UCIWfMf1Hucs5Jxr34jcc6mw', label: 'Open Invitational Basel · Panel Talks' },
  { id: 'UCvFDqxl31fIfw0D7K_uvNhQ', label: 'Open Invitational' }
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const API_KEY = process.env.YOUTUBE_API_KEY;
  try {
    const results = await Promise.all(
      CHANNELS.map(async (ch) => {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${ch.id}&eventType=live&type=video&key=${API_KEY}`;
        const r = await fetch(url);
        const data = await r.json();
        const videoId = data.items && data.items.length > 0 ? data.items[0].id.videoId : null;
        return { label: ch.label, live: !!videoId, videoId, debug: data.error || null };
      })
    );
    return res.status(200).json({ streams: results, hasKey: !!API_KEY });
  } catch (e) {
    return res.status(500).json({ streams: [], error: e.message });
  }
};
