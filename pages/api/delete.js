import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, file_path } = req.body;

  try {
    // Delete file from storage
    const { error: deleteFileError } = await supabase.storage.from('files').remove([file_path]);

    if (deleteFileError) {
      return res.status(500).json({ error: deleteFileError.message });
    }

    // Delete record from database
    const { error: deleteRecordError } = await supabase
      .from('FileSubmissions')
      .delete()
      .eq('id', id);

    if (deleteRecordError) {
      return res.status(500).json({ error: deleteRecordError.message });
    }

    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
