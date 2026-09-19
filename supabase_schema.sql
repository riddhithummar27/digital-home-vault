-- Digital Home Vault: Master Database Schema
-- Run this in your Supabase Dashboard SQL Editor

-- 1. Create Tables
CREATE TABLE public.homes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    rooms_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    home_id UUID REFERENCES public.homes(id) ON DELETE SET NULL,
    full_name TEXT,
    role TEXT DEFAULT 'owner',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.appliances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_id UUID NOT NULL REFERENCES public.homes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    brand TEXT,
    price TEXT,
    purchase_date DATE,
    warranty_status TEXT DEFAULT 'active',
    warranty_expiry DATE,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_id UUID NOT NULL REFERENCES public.homes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'Vehicle',
    brand TEXT,
    price TEXT,
    purchase_date DATE,
    warranty_status TEXT DEFAULT 'active',
    warranty_expiry DATE,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_id UUID REFERENCES public.homes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    file_url TEXT,
    file_size TEXT,
    ai_tag TEXT,
    extracted_data JSONB,
    linked_entity_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Setup Row Level Security (RLS)
ALTER TABLE public.homes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Homes: Users can view and update their assigned home
CREATE POLICY "Users can view their home" 
ON public.homes FOR SELECT 
USING (id IN (SELECT home_id FROM public.profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can insert home during setup" 
ON public.homes FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their home" 
ON public.homes FOR UPDATE 
USING (id IN (SELECT home_id FROM public.profiles WHERE profiles.id = auth.uid()));

-- Appliances: Tied to home_id
CREATE POLICY "Users can view appliances in their home" 
ON public.appliances FOR SELECT 
USING (home_id IN (SELECT home_id FROM public.profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can insert appliances to their home" 
ON public.appliances FOR INSERT 
WITH CHECK (home_id IN (SELECT home_id FROM public.profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can update appliances in their home" 
ON public.appliances FOR UPDATE 
USING (home_id IN (SELECT home_id FROM public.profiles WHERE profiles.id = auth.uid()));

-- Vehicles: Tied to home_id
CREATE POLICY "Users can view vehicles in their home" 
ON public.vehicles FOR SELECT 
USING (home_id IN (SELECT home_id FROM public.profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can insert vehicles to their home" 
ON public.vehicles FOR INSERT 
WITH CHECK (home_id IN (SELECT home_id FROM public.profiles WHERE profiles.id = auth.uid()));

-- Documents: Tied to home_id
CREATE POLICY "Users can view documents in their home" 
ON public.documents FOR SELECT 
USING (home_id IN (SELECT home_id FROM public.profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can insert documents to their home" 
ON public.documents FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);


-- 3. Storage Bucket for Documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Auth Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');


-- 4. Auto-Profile Creation Trigger (When a new auth user signs up)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
