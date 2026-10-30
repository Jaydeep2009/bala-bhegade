const { createClient } = require('@supabase/supabase-js');

const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdWpiZ2VlZmZpeG9wcmZxZXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0ODQ5MjMsImV4cCI6MjEwODA2MDkyM30.BipQUPoetlQl6v7oR_2298B2TG2xUuXUvrgRUIHbqv0';
const supabase = createClient('https://yqujbgeeffixoprfqevq.supabase.co', anonKey);

async function test() {
  const insertRes = await supabase.from('gallery_items').insert({
    id: 'e499d255-758e-49b8-b4b1-460d3d517c5b',
    image_url: 'https://example.com/test.jpg',
    category: 'events',
    alt_text_en: 'Test',
    alt_text_mr: 'Test'
  });
  console.log('Insert result:', insertRes.error ? insertRes.error : 'SUCCESS');

  const deleteRes = await supabase.from('gallery_items').delete().eq('id', 'e499d255-758e-49b8-b4b1-460d3d517c5b');
  console.log('Delete result:', deleteRes.error ? deleteRes.error : 'SUCCESS');
}

test();
