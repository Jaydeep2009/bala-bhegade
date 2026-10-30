const { createClient } = require('@supabase/supabase-js');

const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdWpiZ2VlZmZpeG9wcmZxZXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0ODQ5MjMsImV4cCI6MjEwODA2MDkyM30.BipQUPoetlQl6v7oR_2298B2TG2xUuXUvrgRUIHbqv0';
const supabase = createClient('https://yqujbgeeffixoprfqevq.supabase.co', anonKey);

async function testInserts() {
  const dummyId = 'a0000000-0000-0000-0000-000000000002';

  // 1. events
  const eRes = await supabase.from('events').insert({
    id: dummyId,
    title_en: 'Test Event',
    title_mr: 'चाचणी कार्यक्रम',
    event_date: '2026-11-01',
    status: 'upcoming'
  });
  console.log('Events INSERT:', eRes.error ? eRes.error : 'SUCCESS');

  // 2. news_articles
  const nRes = await supabase.from('news_articles').insert({
    id: dummyId,
    title_en: 'Test News',
    title_mr: 'चाचणी बातमी',
    slug: 'test-news-slug-' + Date.now(),
    category: 'general',
    status: 'draft'
  });
  console.log('News INSERT:', nRes.error ? nRes.error : 'SUCCESS');

  // 3. gallery_items
  const gRes = await supabase.from('gallery_items').insert({
    id: dummyId,
    image_url: 'https://example.com/test.jpg',
    category: 'general'
  });
  console.log('Gallery INSERT:', gRes.error ? gRes.error : 'SUCCESS');

  // 4. delete them if inserted
  await supabase.from('events').delete().eq('id', dummyId);
  await supabase.from('news_articles').delete().eq('id', dummyId);
  await supabase.from('gallery_items').delete().eq('id', dummyId);
}

testInserts();
