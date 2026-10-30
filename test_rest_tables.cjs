const { createClient } = require('@supabase/supabase-js');

const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdWpiZ2VlZmZpeG9wcmZxZXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0ODQ5MjMsImV4cCI6MjEwODA2MDkyM30.BipQUPoetlQl6v7oR_2298B2TG2xUuXUvrgRUIHbqv0';
const supabase = createClient('https://yqujbgeeffixoprfqevq.supabase.co', anonKey);

async function testOtherTables() {
  const dummyId = 'a0000000-0000-0000-0000-000000000003';

  // social_posts
  const sRes = await supabase.from('social_posts').insert({
    id: dummyId,
    platform: 'instagram',
    post_url: 'https://instagram.com/p/test'
  });
  console.log('social_posts INSERT:', sRes.error ? sRes.error.message : 'SUCCESS');

  // homepage_sections UPDATE
  const hp = await supabase.from('homepage_sections').select('id').limit(1).single();
  if (hp.data) {
    const hpRes = await supabase.from('homepage_sections').update({ title_en: 'Test' }).eq('id', hp.data.id);
    console.log('homepage_sections UPDATE:', hpRes.error ? hpRes.error.message : 'SUCCESS');
  }

  // site_settings UPDATE
  const st = await supabase.from('site_settings').select('id').limit(1).single();
  if (st.data) {
    const stRes = await supabase.from('site_settings').update({ value: {} }).eq('id', st.data.id);
    console.log('site_settings UPDATE:', stRes.error ? stRes.error.message : 'SUCCESS');
  }
}

testOtherTables();
