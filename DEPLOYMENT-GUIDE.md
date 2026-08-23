# uni5solution.in — Deployment & Hosting Guide

This is a **static website** (plain HTML/CSS/JS — no database, no server-side code), which makes it cheap and simple to host. You have two realistic paths depending on budget and how "hands-off" you want it to be.

---

## Option A — Free/near-free hosting (recommended to start)
**Best for:** getting live fast, zero ongoing hosting cost, automatic HTTPS.
**Providers:** Netlify, Vercel, or Cloudflare Pages (all have generous free tiers for a site this size).

### Steps (using Netlify as the example — Vercel/Cloudflare Pages are nearly identical)
1. **Create a free account** at netlify.com (or vercel.com / pages.cloudflare.com).
2. **Deploy the site folder:**
   - Easiest: drag-and-drop the whole `uni5site` folder onto the Netlify dashboard ("Deploys" → "drag and drop your site output folder here"). It goes live instantly on a temporary `*.netlify.app` URL.
   - Alternative (better long-term): push the folder to a GitHub repository and connect that repo to Netlify for automatic redeploys whenever you push changes.
3. **Connect your domain (uni5solution.in):**
   - In Netlify: Site settings → Domain management → Add custom domain → enter `uni5solution.in`.
   - Netlify will show you either **nameservers to switch to** (simplest — Netlify manages DNS for you) or **A/CNAME records to add** if you want to keep DNS at your current registrar (GoDaddy, Hostinger, BigRock, etc.).
   - If you keep DNS at your registrar, typically you add:
     - An **A record** for `@` pointing to Netlify's load balancer IP (shown in your dashboard).
     - A **CNAME record** for `www` pointing to your `*.netlify.app` address.
4. **SSL/HTTPS:** Netlify automatically issues a free SSL certificate (via Let's Encrypt) once DNS is pointed correctly — usually within a few minutes to an hour. No action needed beyond waiting.
5. **Done.** Every time you update the files and redeploy, the live site updates within seconds.

**Cost:** ₹0/month for hosting at this traffic level. You only pay for the domain (already purchased) and, optionally, a paid plan later if traffic grows significantly.

---

## Option B — Traditional shared hosting / cPanel (Hostinger, GoDaddy, BigRock, etc.)
**Best for:** if your client already has or prefers Indian shared hosting with cPanel, or wants everything (domain + hosting + email) under one provider/invoice.

### Steps
1. **Buy a hosting plan** from a provider such as Hostinger, GoDaddy, BigRock, or Bluehost India (a basic/shared plan is more than enough for a static site).
2. **Point the domain to the host:**
   - If the domain (`uni5solution.in`) was bought from a *different* registrar than the host, go to the registrar's DNS settings and update the **nameservers** to the ones your hosting provider gives you (e.g. `ns1.hostinger.com`, `ns2.hostinger.com`). This can take a few hours to propagate.
3. **Upload the files:**
   - Log in to **cPanel** → **File Manager** → open the `public_html` folder.
   - Upload all contents of the `uni5site` folder **directly into `public_html`** (not inside a subfolder) — so `index.html` sits at `public_html/index.html`, and the `assets` folder sits at `public_html/assets`.
   - Alternative: use an **FTP client** (FileZilla is free) with the FTP credentials from your hosting provider to upload the files — faster for larger uploads.
4. **Enable SSL:** In cPanel, look for "SSL/TLS Status" or "Let's Encrypt SSL" and enable it for your domain — most Indian hosts include this free. Then force HTTPS redirects (cPanel usually has a toggle, or add a redirect rule).
5. **Test:** visit `https://uni5solution.in` and click through every page and the contact form.

**Cost:** typically ₹1,500–₹4,000/year for basic shared hosting in India.

---

## Making the contact form actually send enquiries
Right now the contact form is a **working front-end demo** — it validates input and shows a confirmation message, but it doesn't send an email yet (a static site has no server to process form submissions). Pick one:

- **Formspree** or **Web3Forms** (easiest): free tier, no code — you get a form endpoint URL, and change one line in `contact.html` (the form's `action` attribute) to point to it. Submissions land in your inbox.
- **Netlify Forms** (if you host on Netlify): add `netlify` as an attribute on the `<form>` tag and Netlify captures submissions automatically — no external service needed.
- **Custom backend**: if you later want submissions to hit a CRM or database, this needs a small serverless function or backend — worth a separate small project once the site is live.

---

## Before going live — quick checklist
- [ ] Replace placeholder phone numbers, email addresses and office addresses in `contact.html` and the footer of every page with the real ones.
- [ ] Confirm the client is happy with the placeholder copy (services, case studies, stats) — these were written from competitor research and industry norms, not real client data, and should be reviewed/replaced with real figures before publishing.
- [ ] Add Google Analytics / Google Search Console once live (helps track enquiries and search visibility).
- [ ] Set up a Google Business Profile for both the Mumbai and Pune offices — very high-impact for a local B2B service like this.
- [ ] Wire up the contact form (see above) so enquiries actually reach an inbox.

---

## File structure reference
```
uni5site/
├── index.html          Home
├── about.html           About
├── services.html        Services
├── industries.html      Industries served
├── work.html             Case studies
├── contact.html          Contact + free survey form
├── 404.html               Custom error page
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/
        ├── logo-mark.svg        (icon, dark version)
        ├── logo-mark-light.svg  (icon, light version — for dark backgrounds)
        ├── logo-lockup.svg      (full logo with wordmark — for print/social)
        ├── favicon.ico
        └── favicon.png
```
