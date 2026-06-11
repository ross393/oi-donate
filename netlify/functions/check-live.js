exports.handler = async function(event, context) {
  const CHANNEL_ID = 'UCvFDqxl31fIfw0D7K_uvNhQ';
  const API_KEY = process.env.YOUTUBE_API_KEY;
  
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    const videoId = data.items && data.items.length > 0 
      ? data.items[0].id.videoId 
      : null;
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ live: !!videoId, videoId })
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ live: false, error: e.message })
    };
  }
};
