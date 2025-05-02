-- Create the storage bucket if it doesn't exist
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('document-images', 'document-images', true)
    ON CONFLICT (id) DO UPDATE SET public = true;

    -- Remove any existing policies
    DROP POLICY IF EXISTS "Enable upload for authenticated users" ON storage.objects;
    DROP POLICY IF EXISTS "Enable download for authenticated users" ON storage.objects;
    DROP POLICY IF EXISTS "Enable delete for own files" ON storage.objects;

    -- Create policy to allow authenticated users to upload files
    CREATE POLICY "Enable upload for authenticated users"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'document-images' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

    -- Create policy to allow authenticated users to view files
    CREATE POLICY "Enable download for authenticated users"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'document-images'
    );

    -- Create policy to allow users to delete their own files
    CREATE POLICY "Enable delete for own files"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'document-images' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );
END $$; 