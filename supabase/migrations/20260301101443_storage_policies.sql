-- Storage policies for 'products' bucket
-- Allow public read access to product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('products', 'products', true, 5242880, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/*'];

-- Allow anyone to read objects in the products bucket (public)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'products public read'
  ) THEN
    CREATE POLICY "products public read"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'products');
  END IF;
END $$;

-- Allow anyone (anon/authenticated) to upload to products bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'products insert'
  ) THEN
    CREATE POLICY "products insert"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'products');
  END IF;
END $$;

-- Allow anyone to update objects in products bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'products update'
  ) THEN
    CREATE POLICY "products update"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'products');
  END IF;
END $$;

-- Allow anyone to delete objects in products bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'products delete'
  ) THEN
    CREATE POLICY "products delete"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'products');
  END IF;
END $$;
