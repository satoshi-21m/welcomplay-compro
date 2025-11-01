# 🚀 Panduan Deploy Project ke Vercel

## 📋 Prerequisites

- ✅ Project sudah siap (build berhasil di local)
- ✅ Punya akun Vercel (gratis)
- ✅ Database MySQL sudah siap (production)
- ✅ Punya akses ke environment variables

## 📝 Step-by-Step Deployment

### STEP 1: Persiapkan Repository Git

```bash
# Pastikan semua perubahan sudah di-commit
git add .
git commit -m "Add realtime revalidation webhook system"

# Push ke repository (GitHub/GitLab/Bitbucket)
git push origin main
```

### STEP 2: Login ke Vercel

1. Buka https://vercel.com
2. Login dengan GitHub/GitLab/Bitbucket
3. Atau buat akun baru jika belum punya

### STEP 3: Import Project

1. Klik tombol **"Add New"** → **"Project"**
2. Pilih repository project Anda
3. Klik **"Import"**

### STEP 4: Configure Build Settings

Vercel biasanya auto-detect Next.js, tapi pastikan:

**Framework Preset**: Next.js
**Build Command**: `pnpm build` (sudah otomatis)
**Output Directory**: `.next` (sudah otomatis)
**Install Command**: `pnpm install` (sudah otomatis)
**Root Directory**: `.` (sudah otomatis)

### STEP 5: Set Environment Variables

**⚠️ PENTING**: Set semua environment variables sebelum deploy!

Klik **"Environment Variables"** dan tambahkan:

#### Database Configuration (REQUIRED)
```bash
DB_HOST=your-database-host.com
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_secure_password
DB_NAME=your_database_name
```

#### Security Configuration (REQUIRED)
```bash
JWT_SECRET=your-jwt-secret-min-32-chars-random
```

#### Revalidation Webhook (REQUIRED untuk realtime update)
```bash
REVALIDATE_SECRET=your-revalidate-secret-token
```

Generate secure token:
```bash
openssl rand -hex 32
```

#### Optional - Application Configuration
```bash
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
DEBUG=false
```

#### Optional - Custom URLs
```bash
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-api-domain.com  # Jika beda
```

#### Optional - External Services
```bash
PAYLOAD_CMS_URL=https://your-cms-url.com
PAYLOAD_CMS_API_KEY=your-cms-api-key
ENCRYPTION_KEY=your-encryption-key
```

### STEP 6: Deploy!

1. Scroll ke bawah
2. Klik tombol **"Deploy"**
3. Tunggu deployment selesai (biasanya 2-5 menit)

### STEP 7: Verify Deployment

Setelah deployment selesai:

1. **Test Homepage**: Buka URL yang diberikan Vercel
2. **Test Admin Login**: `/admin-g30spki/login`
3. **Test Blog**: `/blog`
4. **Test Portfolio**: `/portfolio`
5. **Test Revalidation API**: GET request ke `/api/revalidate` (harus return documentation)

### STEP 8: Setup Custom Domain (Opsional)

1. Masuk ke project di Vercel
2. Go to **Settings** → **Domains**
3. Tambahkan domain Anda
4. Ikuti instruksi setup DNS

## 🔍 Post-Deployment Checklist

### ✅ Database Connection
- [ ] Database accessible dari Vercel
- [ ] MySQL firewall allow Vercel IPs
- [ ] Connection pool working

### ✅ Authentication
- [ ] Admin login working
- [ ] JWT token generation working
- [ ] Session persistance working

### ✅ Content Management
- [ ] Create blog post working
- [ ] Create portfolio working
- [ ] Upload images working
- [ ] Realtime updates working

### ✅ Revalidation System
- [ ] Revalidation webhook accessible
- [ ] Create blog → immediate update visible
- [ ] Create portfolio → immediate update visible
- [ ] Check logs untuk success messages

### ✅ Performance
- [ ] Homepage load fast
- [ ] Blog page fast
- [ ] Portfolio page fast
- [ ] Admin panel responsive

## 🐛 Troubleshooting

### Build Failed

**Error**: Missing environment variables
**Solution**: Double check semua environment variables sudah di-set

**Error**: Database connection timeout
**Solution**: Pastikan DB_HOST accessible dari internet, firewall allowed

**Error**: Module not found
**Solution**: Check package.json dependencies, run `pnpm install` locally untuk test

### Deployment Success tapi Error 500

**Check Logs**:
```bash
# Di Vercel Dashboard → Deployments → View Function Logs
```

**Common Issues**:
1. Database connection failed → Check DB credentials
2. JWT_SECRET not set → Set environment variable
3. Missing env vars → Check all required variables

### Revalidation Not Working

**Symptoms**: Blog/Portfolio updates tidak muncul realtime

**Check**:
1. `REVALIDATE_SECRET` sudah di-set?
2. Check Vercel logs untuk webhook errors
3. Test manual webhook:
```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"type": "blog"}'
```

**Solution**: Jika webhook fail, pastikan:
- Secret token sesuai
- Base URL correct
- Function timeout cukup (sudah di-set 30s di vercel.json)

### Database Connection Issues

**Symptoms**: 500 errors pada pages yang butuh database

**Check**:
1. Database accessible dari Vercel IPs
2. Firewall rules allow connection
3. Database user punya permissions
4. Connection pooling tidak exceeded

**Solution**: 
- Whitelist Vercel IPs di database firewall
- Check connection pool settings
- Monitor database connection limits

### Images Not Loading

**Check**:
1. `/public/uploads/` folder ada di repo?
2. Images using correct path?
3. Next.js Image component configured?

**Solution**:
- Pastikan uploaded images di-commit ke repo untuk static assets
- Atau setup external file storage (AWS S3, Cloudinary, dll)

### Slow Performance

**Check**:
1. Database queries optimized?
2. Images optimized?
3. Caching working?
4. ISR revalidation time reasonable?

**Solution**:
- Monitor Vercel Analytics
- Check database query performance
- Optimize images
- Adjust revalidation times

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Enable Vercel Analytics di dashboard
2. Monitor page views, performance
3. Track user interactions

### Function Logs

1. Go to **Deployments** → Select deployment → **View Function Logs**
2. Monitor errors, warnings
3. Check webhook invocations

### Database Monitoring

Monitor:
- Query performance
- Connection pool usage
- Slow queries
- Error rates

## 🔄 Update Deployment

### Auto-Deploy dari Git

Setiap push ke `main` branch akan auto-deploy:

```bash
git add .
git commit -m "Update: description"
git push origin main
```

Vercel otomatis akan:
1. Trigger build
2. Run tests (jika ada)
3. Deploy production
4. Invalidate old cache

### Manual Deploy

Atau redeploy specific version:
1. Go to **Deployments**
2. Click **"..."** on specific deployment
3. Select **"Promote to Production"**

## 🎯 Production Best Practices

### Security
- ✅ Never commit `.env` files
- ✅ Use strong, random secrets
- ✅ Enable Vercel's DDoS protection
- ✅ Use HTTPS (otomatis di Vercel)
- ✅ Set secure headers

### Performance
- ✅ Enable Vercel Analytics
- ✅ Optimize images
- ✅ Use ISR dengan smart revalidation
- ✅ Monitor database queries
- ✅ Set appropriate cache headers

### Monitoring
- ✅ Set up error alerts
- ✅ Monitor function logs
- ✅ Track database performance
- ✅ Watch for slow queries

## 📞 Support

Jika ada masalah:
1. Check Vercel documentation: https://vercel.com/docs
2. Check Next.js documentation: https://nextjs.org/docs
3. Check project logs di Vercel dashboard
4. Review error messages carefully

## ✅ Success Criteria

Your deployment is successful if:
- ✅ Homepage loads fast
- ✅ Admin login working
- ✅ Can create/edit/delete blog posts
- ✅ Can create/edit/delete portfolio
- ✅ Changes visible immediately (realtime)
- ✅ No 500 errors
- ✅ Database queries fast
- ✅ Images loading properly

## 🎉 Congratulations!

Jika semua checklist ✅ selesai, deployment Anda berhasil!

Your site is now live dengan **realtime updates** untuk blog dan portfolio! 🚀


