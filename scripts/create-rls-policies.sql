-- Enable RLS and create policies for all tables

-- Cities table policies (public read access)
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cities are viewable by everyone" ON public.cities
    FOR SELECT USING (true);

CREATE POLICY "Cities can be inserted by authenticated users" ON public.cities
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Cities can be updated by authenticated users" ON public.cities
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Deals table policies (public read access)
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deals are viewable by everyone" ON public.deals
    FOR SELECT USING (true);

CREATE POLICY "Deals can be inserted by authenticated users" ON public.deals
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Deals can be updated by authenticated users" ON public.deals
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Contact messages policies (private - only accessible by authenticated users)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contact messages viewable by authenticated users only" ON public.contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Contact messages can be updated by authenticated users" ON public.contact_messages
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Contact messages can be deleted by authenticated users" ON public.contact_messages
    FOR DELETE USING (auth.role() = 'authenticated');

-- Subscriptions policies (public insert, private read)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe" ON public.subscriptions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Subscriptions viewable by authenticated users only" ON public.subscriptions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Subscriptions can be updated by authenticated users" ON public.subscriptions
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Subscriptions can be deleted by authenticated users" ON public.subscriptions
    FOR DELETE USING (auth.role() = 'authenticated');
