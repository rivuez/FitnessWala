# Docker Setup for Fitness Wala Frontend

This project is now containerized with Docker for both development and production environments.

## 🐳 Quick Start

### Prerequisites
- Docker installed on your system
- Docker Compose installed

### Development Environment

1. **Start development server with hot reload:**
   ```bash
   ./docker-scripts.sh dev
   ```
   This will start the React development server on `http://localhost:3000`

2. **Start development server in background:**
   ```bash
   ./docker-scripts.sh dev_detached
   ```

3. **View development logs:**
   ```bash
   ./docker-scripts.sh logs_dev
   ```

### Production Environment

1. **Build and start production server:**
   ```bash
   ./docker-scripts.sh prod
   ```
   This will serve the optimized production build on `http://localhost:80`

2. **Start production server in background:**
   ```bash
   ./docker-scripts.sh prod_detached
   ```

3. **View production logs:**
   ```bash
   ./docker-scripts.sh logs_prod
   ```

## 📁 Docker Files Overview

### `Dockerfile`
Multi-stage Dockerfile with three targets:
- **base**: Common base image with Node.js dependencies
- **development**: Development environment with hot reload
- **production**: Optimized production build served by Nginx

### `docker-compose.yml`
Defines three services:
- `frontend-dev`: Development environment with volume mounting
- `frontend-prod`: Production environment with Nginx
- `frontend-hot`: Alternative development setup with enhanced hot reload

### `nginx.conf`
Nginx configuration for production with:
- React Router support
- Gzip compression
- Security headers
- Static asset caching
- Health check endpoint

### `.dockerignore`
Excludes unnecessary files from Docker build context for faster builds.

## 🛠️ Available Commands

Use the `docker-scripts.sh` script for easy management:

```bash
# Development
./docker-scripts.sh dev          # Start development environment
./docker-scripts.sh dev_detached # Start development in background
./docker-scripts.sh hot          # Start with enhanced hot reload

# Production
./docker-scripts.sh prod         # Start production environment
./docker-scripts.sh prod_detached # Start production in background

# Building
./docker-scripts.sh build_dev    # Build development image only
./docker-scripts.sh build_prod   # Build production image only

# Logs
./docker-scripts.sh logs         # Show all logs
./docker-scripts.sh logs_dev     # Show development logs
./docker-scripts.sh logs_prod    # Show production logs

# Maintenance
./docker-scripts.sh clean        # Clean up Docker resources
./docker-scripts.sh clean_all    # Complete cleanup (removes volumes)
./docker-scripts.sh shell        # Access development container shell

# Help
./docker-scripts.sh help         # Show all available commands
```

## 🔧 Manual Docker Commands

If you prefer to use Docker commands directly:

### Development
```bash
# Build and run development container
docker-compose --profile dev up --build

# Run in background
docker-compose --profile dev up --build -d

# View logs
docker-compose --profile dev logs -f
```

### Production
```bash
# Build and run production container
docker-compose --profile prod up --build

# Run in background
docker-compose --profile prod up --build -d

# View logs
docker-compose --profile prod logs -f
```

### Direct Docker Commands
```bash
# Build development image
docker build --target development -t fitness-wala-frontend:dev .

# Build production image
docker build --target production -t fitness-wala-frontend:prod .

# Run development container
docker run -p 3000:3000 -v $(pwd):/app fitness-wala-frontend:dev

# Run production container
docker run -p 80:80 fitness-wala-frontend:prod
```

## 🌐 Accessing the Application

- **Development**: http://localhost:3000
- **Production**: http://localhost:80 (or http://localhost)

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   lsof -i :3000
   lsof -i :80
   
   # Kill the process or change ports in docker-compose.yml
   ```

2. **Permission issues:**
   ```bash
   # Make script executable
   chmod +x docker-scripts.sh
   ```

3. **Docker daemon not running:**
   ```bash
   # Start Docker Desktop or Docker daemon
   sudo systemctl start docker  # Linux
   # Or start Docker Desktop on macOS/Windows
   ```

4. **Build cache issues:**
   ```bash
   # Clean build cache
   docker builder prune
   ./docker-scripts.sh clean_all
   ```

### Development Tips

1. **Hot reload not working:**
   - Ensure volume mounting is working correctly
   - Check if file watching is enabled in your OS
   - Try the `hot` profile for enhanced hot reload

2. **Performance optimization:**
   - Use `.dockerignore` to exclude unnecessary files
   - Leverage Docker layer caching by copying `package.json` first
   - Use multi-stage builds to reduce final image size

3. **Environment variables:**
   - Create `.env` files for different environments
   - Use Docker Compose environment section for configuration

## 📦 Production Deployment

For production deployment:

1. **Build the production image:**
   ```bash
   ./docker-scripts.sh build_prod
   ```

2. **Run with proper environment variables:**
   ```bash
   docker run -d -p 80:80 \
     -e NODE_ENV=production \
     fitness-wala-frontend:prod
   ```

3. **Use with reverse proxy (recommended):**
   - Configure Nginx or Apache as reverse proxy
   - Set up SSL certificates
   - Configure proper domain routing

## 🔒 Security Considerations

- The production Nginx configuration includes security headers
- Use environment variables for sensitive configuration
- Regularly update base images for security patches
- Consider using Docker secrets for production credentials

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [React Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/) 