-- Storage bucket "uploads" for User Uploads (Labs). Path: {user_id}/{upload_id}/{filename}.
-- Create the bucket in Supabase Dashboard first: Storage → New bucket → id "uploads", Public.
-- Optional: set file size limit (e.g. 50MB) and allowed MIME types (audio/*).
-- These policies ensure users can only read/write their own folder.

-- Allow authenticated users to upload only to their own folder: uploads/{user_id}/...
CREATE POLICY "Users can upload to own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to read their own folder
CREATE POLICY "Users can read own uploads"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update own uploads"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own uploads"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
