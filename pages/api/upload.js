import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Required for formidable
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // FIX: In newer versions of formidable, use the function directly
  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Parsing error:', err);
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    // FIX: formidable v3 returns files as arrays. We need the first one.
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const fileBuffer = fs.readFileSync(file.filepath);
      const filePath = `${Date.now()}_${file.originalFilename}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, fileBuffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // FIX: fields also come back as arrays in v3
      const getField = (name) => {
        const val = fields[name];
        return Array.isArray(val) ? val[0] : val;
      };

      // Save metadata to Database
      const { data, error: dbError } = await supabase
        .from('FileSubmissions')
        .insert({
          filename: file.originalFilename,
          file_path: uploadData.path,
          file_size: file.size,
          st3: getField('st3') === 'true',
          exmust: getField('exmust') === 'true',
          exdect: getField('exdect') === 'true',
          cb: getField('cb') === 'true',
          vt: getField('vt') === 'true',
        })
        .select();

      if (dbError) throw dbError;

      // Cleanup temp file
      fs.unlinkSync(file.filepath);

      return res.status(200).json({ message: 'File uploaded successfully', data });
    } catch (error) {
      console.error('Server Error:', error);
      return res.status(500).json({ error: error.message });
    }
  });
}