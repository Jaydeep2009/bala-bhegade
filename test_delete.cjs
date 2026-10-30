const { createClient } = require('@supabase/supabase-js');

const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdWpiZ2VlZmZpeG9wcmZxZXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0ODQ5MjMsImV4cCI6MjEwODA2MDkyM30.BipQUPoetlQl6v7oR_2298B2TG2xUuXUvrgRUIHbqv0';
const supabase = createClient('https://yqujbgeeffixoprfqevq.supabase.co', anonKey);

async function testDelete() {
  const { data, error } = await supabase
    .from('gallery_items')
    .delete()
    .eq('id', '6db3f42e-46de-46d0-af04-84422103b59a')
    .select();
  
  console.log('Delete result:', { data, error });
}

testDelete();
