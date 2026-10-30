const https = require('https');

const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdWpiZ2VlZmZpeG9wcmZxZXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0ODQ5MjMsImV4cCI6MjEwODA2MDkyM30.BipQUPoetlQl6v7oR_2298B2TG2xUuXUvrgRUIHbqv0';
const tables = ['homepage_sections', 'news_articles', 'events', 'site_settings', 'admin_profiles', 'gallery_items', 'social_posts'];

async function checkTable(table) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'yqujbgeeffixoprfqevq.supabase.co',
      path: `/rest/v1/${table}?select=*`,
      method: 'GET',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ table, status: res.statusCode, count: Array.isArray(json) ? json.length : 0, data: json });
        } catch (e) {
          resolve({ table, status: res.statusCode, error: data });
        }
      });
    });
    req.on('error', (err) => resolve({ table, error: err.message }));
    req.end();
  });
}

async function run() {
  for (const t of tables) {
    const res = await checkTable(t);
    console.log(`${res.table}: status ${res.status}, count: ${res.count}`);
    if (res.error) console.log(`  error: ${res.error}`);
  }
}

run();
