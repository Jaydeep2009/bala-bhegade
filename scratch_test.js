const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdWpiZ2VlZmZpeG9wcmZxZXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0ODQ5MjMsImV4cCI6MjEwODA2MDkyM30.BipQUPoetlQl6v7oR_2298B2TG2xUuXUvrgRUIHbqv0';

async function testUpdateSiteSettings() {
  const res = await fetch(`https://yqujbgeeffixoprfqevq.supabase.co/rest/v1/site_settings?key=eq.social`, {
    method: 'PATCH',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      updated_at: new Date().toISOString()
    })
  });
  console.log('Update site_settings status:', res.status, res.statusText);
  const data = await res.json();
  console.log('Result:', data);
}
testUpdateSiteSettings();
