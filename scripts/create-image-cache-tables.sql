-- Create image cache tables for storing API image URLs and reducing API calls

-- Table for caching property images from various APIs
CREATE TABLE IF NOT EXISTS public.property_image_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT NOT NULL,
  api_source TEXT NOT NULL, -- 'expedia', 'booking', etc.
  primary_image_url TEXT,
  secondary_images JSONB DEFAULT '[]'::jsonb,
  cdn_primary_url TEXT,
  cdn_secondary_urls JSONB DEFAULT '[]'::jsonb,
  image_metadata JSONB DEFAULT '{}'::jsonb,
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index for property_id + api_source combination
CREATE UNIQUE INDEX IF NOT EXISTS idx_property_image_cache_unique 
ON public.property_image_cache (property_id, api_source);

-- Create index for expiration cleanup
CREATE INDEX IF NOT EXISTS idx_property_image_cache_expires 
ON public.property_image_cache (expires_at);

-- Create index for API source queries
CREATE INDEX IF NOT EXISTS idx_property_image_cache_source 
ON public.property_image_cache (api_source);

-- Enable RLS (though this table doesn't need user-specific access)
ALTER TABLE public.property_image_cache ENABLE ROW LEVEL SECURITY;

-- Allow public read access for image cache (no user authentication needed)
CREATE POLICY "Allow public read access to image cache" 
ON public.property_image_cache FOR SELECT 
USING (true);

-- Allow service role to manage cache
CREATE POLICY "Allow service role to manage image cache" 
ON public.property_image_cache FOR ALL 
USING (true);

-- Function to clean up expired cache entries
CREATE OR REPLACE FUNCTION public.cleanup_expired_image_cache()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.property_image_cache 
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_image_cache_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_image_cache_timestamp ON public.property_image_cache;
CREATE TRIGGER update_image_cache_timestamp
  BEFORE UPDATE ON public.property_image_cache
  FOR EACH ROW
  EXECUTE FUNCTION public.update_image_cache_timestamp();
