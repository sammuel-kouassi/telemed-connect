import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://pjwqyvcmwlvtwyuhnkww.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqd3F5dmNtd2x2dHd5dWhua3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MDMxNTIsImV4cCI6MjEwNjE3OTE1Mn0.PbFh2wDnOWoxPkFVVHOr0JQFnx3k5B3ZoakY675PRHw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const assetsDir = path.resolve('src/assets');
const files = fs.readdirSync(assetsDir);

console.log(`Found ${files.length} images to upload...`);

function getContentType(filename) {
  if (filename.endsWith('.webp')) return 'image/webp';
  if (filename.endsWith('.png')) return 'image/png';
  if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg';
  if (filename.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
}

async function uploadAll() {
  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    const filePath = path.join(assetsDir, file);
    const fileBuffer = fs.readFileSync(filePath);
    const contentType = getContentType(file);

    const { data, error } = await supabase.storage
      .from('images')
      .upload(file, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error(`Failed ${file}:`, error.message);
      failCount++;
    } else {
      console.log(`Uploaded ${file} -> public URL: ${SUPABASE_URL}/storage/v1/object/public/images/${file}`);
      successCount++;
    }
  }

  console.log(`\nFinished: ${successCount} uploaded successfully, ${failCount} failed.`);
}

uploadAll();
