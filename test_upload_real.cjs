const { createClient } = require('@supabase/supabase-js');

const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdWpiZ2VlZmZpeG9wcmZxZXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0ODQ5MjMsImV4cCI6MjEwODA2MDkyM30.BipQUPoetlQl6v7oR_2298B2TG2xUuXUvrgRUIHbqv0';
const supabase = createClient('https://yqujbgeeffixoprfqevq.supabase.co', anonKey);

async function testUpload() {
  const dummyBuffer = Buffer.from('GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;');
  
  console.log('Testing upload to "images" bucket...');
  const res1 = await supabase.storage.from('images').upload('test/test.gif', dummyBuffer, {
    contentType: 'image/gif',
    upsert: true
  });
  console.log('Images bucket upload result:', res1);

  console.log('Testing upload to "media" bucket...');
  const res2 = await supabase.storage.from('media').upload('test/test.gif', dummyBuffer, {
    contentType: 'image/gif',
    upsert: true
  });
  console.log('Media bucket upload result:', res2);
}

testUpload();
