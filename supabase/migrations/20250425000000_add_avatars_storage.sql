/*
  # Create storage bucket for avatars

  1. Create a new bucket called 'avatars'
  2. Enable public access (for profile pictures)
  3. Set up security policies:
    - Anyone can read avatars (they are public)
    - Only authenticated users can upload their own avatars
    - Users can update/delete their own avatars
  4. Configure CORS to allow access from the frontend
*/

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  false,
  2097152, -- 2MB size limit
  '{image/png,image/jpeg,image/jpg,image/gif}'
)
ON CONFLICT DO NOTHING;

-- Set up CORS configuration for the bucket
UPDATE storage.buckets
SET cors_origins = array['*'],
    cors_methods = array['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    cors_allowed_headers = array['*'],
    cors_exposed_headers = array['content-disposition', 'content-length', 'content-type'],
    cors_max_age = 3600
WHERE id = 'avatars';

-- Set up security policies for the avatars bucket

-- Allow public read access to all objects
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload avatars" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars" 
ON storage.objects FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars" 
ON storage.objects FOR DELETE 
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
); 