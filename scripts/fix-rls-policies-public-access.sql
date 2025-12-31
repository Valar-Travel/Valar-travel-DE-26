-- Drop existing restrictive policies and create public read access policies
-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Public can read cities" ON public.cities;
DROP POLICY IF EXISTS "Public can read deals" ON public.deals;
DROP POLICY IF EXISTS "Authenticated users can manage contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Public can insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can manage subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Public can insert subscriptions" ON public.subscriptions;

-- Cities table - allow public read access (for travel site visitors)
CREATE POLICY "Allow public read access to cities" ON public.cities
    FOR SELECT USING (true);

-- Deals table - allow public read access (essential for travel deals site)
CREATE POLICY "Allow public read access to deals" ON public.deals
    FOR SELECT USING (true);

-- Contact messages - allow public insert, authenticated read/update/delete
CREATE POLICY "Allow public to submit contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read contact messages" ON public.contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update contact messages" ON public.contact_messages
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete contact messages" ON public.contact_messages
    FOR DELETE USING (auth.role() = 'authenticated');

-- Subscriptions - allow public insert, authenticated read/update/delete
CREATE POLICY "Allow public to create subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update subscriptions" ON public.subscriptions
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete subscriptions" ON public.subscriptions
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample deals data if table is empty
INSERT INTO public.deals (name, city, price, normal_price, discount_type, affiliate_link, start_date, end_date)
SELECT 
    'Luxury Hotel Paris', 'Paris', 299.99, 399.99, 'coupon', 'https://www.travelpayouts.com/hotels?marker=YOUR_MARKER&destination=paris', 
    CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days'
WHERE NOT EXISTS (SELECT 1 FROM public.deals WHERE city = 'Paris');

INSERT INTO public.deals (name, city, price, normal_price, discount_type, affiliate_link, start_date, end_date)
SELECT 
    'Tokyo Flight Deal', 'Tokyo', 599.99, 799.99, 'last-minute', 'https://www.travelpayouts.com/flights?marker=YOUR_MARKER&destination=tokyo', 
    CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days'
WHERE NOT EXISTS (SELECT 1 FROM public.deals WHERE city = 'Tokyo');

INSERT INTO public.deals (name, city, price, normal_price, discount_type, affiliate_link, start_date, end_date)
SELECT 
    'New York Mobile Special', 'New York', 199.99, 299.99, 'mobile', 'https://www.travelpayouts.com/hotels?marker=YOUR_MARKER&destination=newyork', 
    CURRENT_DATE, CURRENT_DATE + INTERVAL '21 days'
WHERE NOT EXISTS (SELECT 1 FROM public.deals WHERE city = 'New York');
