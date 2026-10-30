const { createClient } = require('@supabase/supabase-js');

const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdWpiZ2VlZmZpeG9wcmZxZXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0ODQ5MjMsImV4cCI6MjEwODA2MDkyM30.BipQUPoetlQl6v7oR_2298B2TG2xUuXUvrgRUIHbqv0';
const supabase = createClient('https://yqujbgeeffixoprfqevq.supabase.co', anonKey);

async function testAllTables() {
  const tables = ['gallery_items', 'news_articles', 'events', 'social_posts', 'homepage_sections', 'site_settings'];
  
  console.log('Testing SELECT:');
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    console.log(`  Table ${t}: count=${data ? data.length : 0}, error=${error ? error.message : 'none'}`);
  }

  console.log('\nTesting INSERT permission:');
  const dummyId = 'a0000000-0000-0000-0000-000000000001';
  
  // gallery_items
  const gRes = await supabase.from('gallery_items').insert({
    id: dummyId,
    image_url: 'https://example.com/test.jpg',
    category: 'test'
  });
  console.log(`  gallery_items INSERT: ${gRes.error ? gRes.error.message : 'ALLOWED'}`);

  // events
  const eRes = await supabase.from('events').insert({
    id: dummyId,
    title_en: 'Test',
    title_mr: 'Test',
    category: 'test',
    event_date: new Date().toISOString()
  });
  console.log(`  events INSERT: ${eRes.error ? eRes.error.message : 'ALLOWED'}`);

  // news_articles
  const nRes = await supabase.from('news_articles').insert({
    id: dummyId,
    title_en: 'Test',
    title_mr: 'Test',
    slug: 'test-slug',
    content_en: 'Test',
    content_mr: 'Test',
    category: 'test'
  });
  console.log(`  news_articles INSERT: ${nRes.error ? nRes.error.message : 'ALLOWED'}`);
}

testAllTables();
