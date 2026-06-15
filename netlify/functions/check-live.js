exports.handler = async function(event, context) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  
  const CHANNELS = [
    { id: 'UCnM6YVQIM0thPvHqzMkZdWw', label: 'Open Invitational Basel · Floor 1' },
    { id: 'UCUcxmi83Uz6_hYEz-79Eygw', label: 'Open Invitational Basel · Floor 2' },
    { id: 'UCIWfMf1Hucs5Jxr34jcc6mw', label: 'Open Invitational Basel · Panel Talks' },
    { id: 'UCvFDqxl31fIfw0D7K_uvNhQ', label: 'Open Invitational' }
  ];

  try {
    const results = await Promise.all(
      CHANNELS.map(async (ch) => {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${ch.id}&eventType=live&type=video&key=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        const videoId = data.items && data.items.length > 0
          ? data.items[0].id.videoId
          : null;
        return { label: ch.label, live: !!videoId, videoId };
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ streams: results })
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ streams: [], error: e.message, apiKey: !!API_KEY })
    };
  }
};
