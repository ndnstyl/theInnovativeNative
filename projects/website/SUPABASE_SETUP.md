# Supabase Setup Guide for Law Firm RAG

This guide walks you through setting up Supabase authentication for the Law Firm RAG application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up or log in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `law-firm-rag` (or your preferred name)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose the closest region to your users
5. Click "Create new project" and wait for setup to complete

## 2. Get Your API Keys

1. In your Supabase dashboard, go to **Project Settings** (gear icon in sidebar)
2. Click on **API** in the left menu
3. Copy the following values:
   - **Project URL** - `https://xxx.supabase.co`
   - **anon public** key - This is safe to use in the browser
   - **service_role** key - Keep this secret! Only use server-side

## 3. Configure Environment Variables

Create a `.env.local` file in the `websiteStuff` directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important**:
- Never commit `.env.local` to version control
- The `NEXT_PUBLIC_` prefix exposes variables to the browser (only use for public keys)
- The service role key should only be used in server-side code

## 4. Enable Email Authentication

1. In Supabase dashboard, go to **Authentication** (left sidebar)
2. Click on **Providers** tab
3. Find **Email** and click to configure
4. Enable the following settings:
   - ✅ Enable Email provider
   - ✅ Enable Magic Link (passwordless) sign in
   - You can optionally disable password sign-in if you only want magic links
5. Click **Save**

## 5. Configure Auth Email Templates (Optional)

1. Go to **Authentication** > **Email Templates**
2. Customize the **Magic Link** template to match your brand
3. Update the subject line and body as needed

Example subject:
```
Sign in to Law Firm RAG
```

Example body:
```html
<h2>Sign in to Law Firm RAG</h2>
<p>Click the link below to sign in to your account:</p>
<p><a href="{{ .ConfirmationURL }}">Sign In</a></p>
<p>This link will expire in 1 hour.</p>
```

## 6. Set Up Redirect URLs

1. Go to **Authentication** > **URL Configuration**
2. Add your redirect URLs:
   - **Site URL**: `https://yourdomain.com` (your production domain)
   - **Redirect URLs**: Add all allowed redirect destinations:
     - `http://localhost:3000/auth/callback` (development)
     - `https://yourdomain.com/auth/callback` (production)

## 7. Create the Profiles Table

1. Go to **SQL Editor** in the sidebar
2. Click **New Query**
3. Paste and run the following SQL:

```sql
-- Create the profiles table
create table public.profiles (
  id uuid references auth.users primary key,
  email text,
  stripe_customer_id text,
  pilot_status text default 'pending',
  pilot_started_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create policy for users to view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Create policy for users to update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create a trigger to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger the function every time a user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

4. Click **Run** to execute the SQL

## 8. Test the Setup

### Local Development

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:3000/law-firm-rag`

3. Click the sign-in button to test the auth modal

4. Enter your email to receive a magic link

5. Check your email and click the link

6. You should be redirected to `/dashboard`

### Production

1. Update your environment variables on your hosting provider
2. Ensure redirect URLs are configured for your production domain
3. Test the full flow on your live site

## 9. Security Best Practices

- **Never expose the service role key** in client-side code
- **Always use Row Level Security (RLS)** on your tables
- **Validate user input** on both client and server
- **Use HTTPS** in production
- **Regularly rotate** your service role key if you suspect it's been compromised

## 10. Troubleshooting

### Magic link not arriving
- Check spam/junk folder
- Verify email provider is enabled in Supabase
- Check Supabase logs for email delivery issues

### Redirect not working
- Verify the callback URL is in the allowed list
- Check browser console for errors
- Ensure environment variables are set correctly

### Session not persisting
- Clear browser cookies and try again
- Check that cookies are enabled
- Verify the Supabase URL matches your environment variable

### "Invalid API key" error
- Double-check your environment variables
- Ensure there are no extra spaces or quotes
- Restart your development server after changing env vars

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
