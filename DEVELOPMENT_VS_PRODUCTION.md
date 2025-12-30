# Development vs Production Environment

## Quick Reference

| Service | Development (Local) | Production (AWS) |
|---------|-------------------|------------------|
| **File Storage** | Local filesystem or MinIO | AWS S3 + CloudFront CDN |
| **Email** | MailHog (test inbox) | SendGrid or AWS SES |
| **Database** | Local MongoDB container | MongoDB Atlas (managed) |
| **Cache** | Local Redis container | AWS ElastiCache for Redis |
| **Logs** | Console output | AWS CloudWatch Logs |
| **Secrets** | `.env` files | AWS Secrets Manager |
| **SSL/HTTPS** | Not needed (HTTP) | AWS Certificate Manager |
| **Load Balancer** | Not needed | AWS Application Load Balancer |
| **Containers** | Docker Compose | AWS ECS Fargate |
| **Cost** | **$0/month** 🎉 | ~$900-1200/month |

---

## Development Environment

### Prerequisites
- Docker Desktop
- Node.js 20+
- Code editor

### Start Everything
```bash
# One command starts everything!
docker-compose up -d

# API: http://localhost:3000
# Web: http://localhost:8080
# MailHog: http://localhost:8025
# MinIO: http://localhost:9001
# MongoDB Express: http://localhost:8081
# Redis Commander: http://localhost:8082
```

### Environment Variables (.env)
```bash
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/walkydoggy
REDIS_URL=redis://localhost:6379
STORAGE_TYPE=local
EMAIL_SERVICE=mailhog
```

### Development Workflow
1. Make code changes
2. Hot reload updates automatically
3. View emails at http://localhost:8025
4. Check files in `./uploads` folder
5. Debug with console logs
6. Reset data with `docker-compose down -v`

### Advantages
✅ Zero cloud costs
✅ Work offline
✅ Instant setup/teardown
✅ Fast iteration
✅ Easy debugging
✅ Complete control
✅ No AWS account needed

### File Upload Example (Dev)
```javascript
// Uploads go to local filesystem
POST /api/v1/pets/123/photo
→ Saved to ./uploads/1234567890-photo.jpg
→ URL: http://localhost:3000/uploads/1234567890-photo.jpg
```

### Email Example (Dev)
```javascript
// Email sent to MailHog
await emailService.send({
  to: 'user@example.com',
  subject: 'Booking Confirmed'
});
→ View at http://localhost:8025
```

---

## Production Environment

### Prerequisites
- AWS Account
- MongoDB Atlas account
- Stripe account
- Domain name
- SSL certificate

### Infrastructure
- **Containers**: AWS ECS Fargate (auto-scaling)
- **Database**: MongoDB Atlas M20+ cluster
- **Cache**: AWS ElastiCache for Redis
- **Storage**: AWS S3 with CloudFront CDN
- **Email**: SendGrid or AWS SES
- **DNS**: Route 53
- **SSL**: AWS Certificate Manager

### Environment Variables (AWS Secrets Manager)
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://prod-cluster.mongodb.net/walkydoggy
REDIS_URL=redis://production-cache.amazonaws.com:6379
STORAGE_TYPE=s3
S3_BUCKET=walkydoggy-prod-uploads
EMAIL_SERVICE=sendgrid
```

### Deployment Process
1. Push to `main` branch
2. GitHub Actions builds Docker image
3. Pushes to AWS ECR
4. Updates ECS service
5. Zero-downtime deployment
6. CloudWatch monitors health

### Advantages
✅ High availability (99.9%+)
✅ Auto-scaling
✅ Global CDN for fast delivery
✅ Automated backups
✅ Professional monitoring
✅ Handles production traffic

### File Upload Example (Prod)
```javascript
// Uploads go to S3 with CDN
POST /api/v1/pets/123/photo
→ Saved to S3: s3://bucket/uploads/1234567890-photo.jpg
→ URL: https://cdn.walkydoggy.com/uploads/1234567890-photo.jpg
```

### Email Example (Prod)
```javascript
// Email sent via SendGrid
await emailService.send({
  to: 'user@example.com',
  subject: 'Booking Confirmed'
});
→ Delivered to actual inbox
```

---

## Code Implementation

### Storage Abstraction

```javascript
// src/shared/services/storage.service.js

class StorageService {
  constructor() {
    this.provider = this.getProvider();
  }

  getProvider() {
    if (process.env.STORAGE_TYPE === 's3') {
      return new S3Storage();
    }
    return new LocalStorage();
  }

  async upload(file, options = {}) {
    return this.provider.upload(file, options);
  }

  async delete(path) {
    return this.provider.delete(path);
  }

  async getUrl(path) {
    return this.provider.getUrl(path);
  }
}

// Local filesystem storage (development)
class LocalStorage {
  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.baseUrl = process.env.API_URL || 'http://localhost:3000';
  }

  async upload(file, options = {}) {
    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(this.uploadDir, filename);
    
    await fs.promises.mkdir(this.uploadDir, { recursive: true });
    await fs.promises.writeFile(filepath, file.buffer);
    
    return {
      filename,
      path: `/uploads/${filename}`,
      url: `${this.baseUrl}/uploads/${filename}`
    };
  }

  async delete(filepath) {
    const fullPath = path.join(this.uploadDir, path.basename(filepath));
    await fs.promises.unlink(fullPath);
  }

  getUrl(filepath) {
    return `${this.baseUrl}${filepath}`;
  }
}

// S3 storage (production)
class S3Storage {
  constructor() {
    this.s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
    this.bucket = process.env.S3_BUCKET;
    this.cdnUrl = process.env.CDN_URL;
  }

  async upload(file, options = {}) {
    const filename = `${Date.now()}-${file.originalname}`;
    const key = `uploads/${filename}`;
    
    const params = {
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    };
    
    const result = await this.s3.upload(params).promise();
    
    return {
      filename,
      path: key,
      url: this.cdnUrl ? `${this.cdnUrl}/${key}` : result.Location
    };
  }

  async delete(key) {
    await this.s3.deleteObject({
      Bucket: this.bucket,
      Key: key.replace(/^\//, '') // Remove leading slash
    }).promise();
  }

  getUrl(key) {
    return this.cdnUrl 
      ? `${this.cdnUrl}/${key}`
      : `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }
}

module.exports = new StorageService();
```

### Email Abstraction

```javascript
// src/shared/services/email.service.js

class EmailService {
  constructor() {
    this.transporter = this.getTransporter();
  }

  getTransporter() {
    if (process.env.EMAIL_SERVICE === 'mailhog') {
      return nodemailer.createTransport({
        host: process.env.MAILHOG_HOST || 'localhost',
        port: process.env.MAILHOG_PORT || 1025,
        ignoreTLS: true
      });
    }

    if (process.env.EMAIL_SERVICE === 'sendgrid') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      });
    }

    throw new Error('EMAIL_SERVICE not configured');
  }

  async send({ to, subject, html, text }) {
    const info = await this.transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html,
      text
    });

    if (process.env.EMAIL_SERVICE === 'mailhog') {
      console.log('📧 Email sent to MailHog:', {
        to,
        subject,
        preview: `http://localhost:8025`
      });
    }

    return info;
  }
}

module.exports = new EmailService();
```

---

## Migration Path: Dev → Staging → Production

### 1. Development (Local)
```bash
# Everything runs locally
docker-compose up -d
npm run dev
```

### 2. Staging (AWS with test data)
```bash
# Smaller AWS instances, test mode Stripe
export NODE_ENV=staging
export MONGODB_URI=$STAGING_MONGODB_URI
export STRIPE_SECRET_KEY=sk_test_...
```

### 3. Production (AWS with real data)
```bash
# Full AWS setup, live Stripe
export NODE_ENV=production
export MONGODB_URI=$PRODUCTION_MONGODB_URI
export STRIPE_SECRET_KEY=sk_live_...
```

---

## Environment-Specific Features

| Feature | Development | Production |
|---------|------------|------------|
| **Hot Reload** | ✅ Yes | ❌ No |
| **Source Maps** | ✅ Yes | ❌ No (minified) |
| **Debug Logs** | ✅ Verbose | ⚠️ Errors only |
| **Email Sending** | 📨 MailHog | 📧 Real emails |
| **File Storage** | 💾 Local disk | ☁️ S3 + CDN |
| **HTTPS** | ❌ Not needed | ✅ Required |
| **Rate Limiting** | ⚠️ Relaxed | 🔒 Strict |
| **CORS** | 🌐 Permissive | 🔒 Specific origins |
| **Error Details** | 📝 Full stack | ⚠️ Generic messages |

---

## Cost Comparison

### Development
- Infrastructure: **$0**
- Developer time: Focus on building features
- Total: **$0/month** 💰

### Staging (Optional)
- Small AWS instances: ~$150/month
- Useful for QA testing

### Production
- AWS Services: ~$500-700
- MongoDB Atlas: ~$150-500
- Other services: ~$250
- Total: **~$900-1200/month**

---

## Quick Troubleshooting

### Development Issues

**"Cannot connect to MongoDB"**
```bash
docker-compose ps  # Check if mongo is running
docker-compose restart mongo
```

**"Redis connection failed"**
```bash
docker-compose restart redis
redis-cli ping  # Should return PONG
```

**"Cannot access uploaded files"**
```bash
# Check upload directory exists
ls -la uploads/

# Check permissions
chmod 755 uploads/

# Check environment variable
echo $UPLOAD_DIR
```

**"Emails not appearing in MailHog"**
```bash
# Check MailHog is running
curl http://localhost:8025

# Check environment
echo $EMAIL_SERVICE  # Should be "mailhog"
```

### Production Issues

**"Files not uploading to S3"**
- Check AWS credentials
- Verify S3 bucket exists
- Check IAM permissions
- Review CloudWatch logs

**"Emails not sending"**
- Check SendGrid API key
- Verify FROM_EMAIL is verified
- Check SendGrid dashboard for bounces

---

## Recommended Workflow

1. **Start Local Development**
   ```bash
   docker-compose up -d
   npm run dev
   ```

2. **Build Feature Locally**
   - Write code
   - Test with local services
   - Use MailHog for email testing
   - Check files in `./uploads`

3. **Test Before Production**
   - Write unit tests
   - Test API endpoints
   - Verify business logic

4. **Deploy to Staging** (optional)
   - Test with real AWS services
   - Verify integrations work
   - QA testing

5. **Deploy to Production**
   - Merge to main branch
   - GitHub Actions deploys automatically
   - Monitor CloudWatch

---

## Summary

**Development = Local, Free, Fast** 🚀
- Everything runs on your computer
- Zero cloud costs
- Perfect for building features

**Production = Cloud, Robust, Scalable** ☁️
- Everything runs on AWS
- Handles real traffic
- Production-ready infrastructure

**Start local, deploy to cloud when ready!** 🎯

