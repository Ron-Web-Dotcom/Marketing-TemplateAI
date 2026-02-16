# Security Headers Configuration

This document provides instructions for configuring security headers for your application. Proper security headers protect against common web vulnerabilities like XSS, clickjacking, and MIME-type sniffing attacks.

## Required Security Headers

### 1. Content Security Policy (CSP)

Prevents XSS attacks by controlling which resources can be loaded.

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co https://dns.google https://api.stripe.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';
```

**Note**: Adjust CSP directives based on your actual third-party dependencies.

### 2. X-Frame-Options

Prevents clickjacking attacks by controlling whether your site can be embedded in iframes.

```
X-Frame-Options: DENY
```

### 3. X-Content-Type-Options

Prevents MIME-type sniffing attacks.

```
X-Content-Type-Options: nosniff
```

### 4. Strict-Transport-Security (HSTS)

Forces HTTPS connections and prevents protocol downgrade attacks.

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### 5. X-XSS-Protection

Enables browser's built-in XSS filter (legacy browsers).

```
X-XSS-Protection: 1; mode=block
```

### 6. Referrer-Policy

Controls how much referrer information is sent with requests.

```
Referrer-Policy: strict-origin-when-cross-origin
```

### 7. Permissions-Policy

Controls which browser features and APIs can be used.

```
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
```

---

## Platform-Specific Configuration

### Vercel

Create `vercel.json` in your project root:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co https://dns.google https://api.stripe.com; frame-ancestors 'none';"
        }
      ]
    }
  ]
}
```

### Netlify

Create `netlify.toml` in your project root:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co https://dns.google https://api.stripe.com; frame-ancestors 'none';"
```

### Cloudflare Pages

1. Go to your site's dashboard
2. Navigate to **Rules** → **Transform Rules** → **Modify Response Header**
3. Add rules for each header listed above

Alternatively, use Cloudflare Workers for more control.

### Nginx

Add to your server block:

```nginx
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co https://dns.google https://api.stripe.com; frame-ancestors 'none';" always;
```

---

## Testing Security Headers

After configuration, test your headers using these tools:

1. **SecurityHeaders.com**: https://securityheaders.com
2. **Mozilla Observatory**: https://observatory.mozilla.org
3. **Chrome DevTools**: Network tab → Select any request → Headers

### Expected Scores

- **SecurityHeaders.com**: Grade A or higher
- **Mozilla Observatory**: Score 90+ / 100

---

## Troubleshooting

### Issue: CSP violations breaking functionality

**Solution**: Check browser console for CSP violation reports. Add necessary domains to appropriate directives.

Example console error:
```
Refused to load the script 'https://example.com/script.js' because it violates the Content-Security-Policy directive: "script-src 'self'".
```

Fix: Add `https://example.com` to `script-src` directive.

### Issue: Images not loading

**Solution**: Ensure `img-src` includes all image sources (CDNs, Pexels, etc.).

### Issue: Stripe not working

**Solution**: Verify `connect-src` includes:
- `https://api.stripe.com`
- `https://js.stripe.com`
- `https://checkout.stripe.com`

---

## Additional Resources

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN Web Docs - CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Content-Security-Policy.com](https://content-security-policy.com/)
