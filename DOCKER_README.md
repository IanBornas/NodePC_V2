# NodePC Docker Setup Guide

## Project Overview

NodePC is a full-stack e-commerce application for PC components and peripherals. The application consists of:

- **Backend**: Spring Boot REST API with JWT authentication, MySQL database, and comprehensive product/order management
- **Frontend**: Angular single-page application with modern UI components and responsive design
- **Database**: MySQL 8.0 for data persistence

The application provides features like user authentication, product catalog, shopping cart, order management, and admin dashboard.

## Prerequisites

Before running the application, ensure you have the following installed:

- **Docker**: Version 20.10 or later
- **Docker Compose**: Version 2.0 or later

### Installation Commands

**Windows (using Chocolatey):**
```bash
choco install docker-desktop
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose
```

**macOS:**
```bash
brew install --cask docker
```

## Quick Start

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd NodePC_V2
   ```

2. **Start the application**:
   ```bash
   docker-compose up -d
   ```

3. **Wait for services to be healthy**:
   ```bash
   docker-compose ps
   ```
   Ensure all services show "healthy" status.

4. **Access the application**:
   - **Frontend**: http://localhost
   - **Backend API**: http://localhost:8080/nodepc-backend-0.0.1-SNAPSHOT/api
   - **Database**: localhost:3306 (accessible from host)

5. **Stop the application**:
   ```bash
   docker-compose down
   ```

## Architecture

The application uses a microservices architecture with three main services:

### Services Overview

- **mysql**: MySQL 8.0 database service
  - Stores user data, products, orders, and application state
  - Uses named volume `mysql_data` for persistence
  - Health check ensures database is ready before other services start

- **backend**: Spring Boot application
  - REST API built with Spring Boot 3.x and Java 21
  - JWT-based authentication and authorization
  - JPA/Hibernate for database operations
  - Health endpoint for container orchestration
  - Depends on MySQL service being healthy

- **frontend**: Angular application
  - Single-page application built with Angular 17+
  - Served by Nginx for production
  - Communicates with backend via HTTP API calls
  - Depends on backend service being healthy

### Service Interactions

```
Frontend (Port 80) <---HTTP---> Backend (Port 8080) <---JDBC---> MySQL (Port 3306)
```

- Frontend makes API calls to backend endpoints
- Backend connects to MySQL using JDBC driver
- All services communicate through Docker's internal network `nodepc_network`

## Configuration

### Environment Variables

The application uses environment variables for configuration. Key variables include:

#### Database Configuration
```yaml
MYSQL_ROOT_PASSWORD: admin          # MySQL root password
MYSQL_DATABASE: nodepcdb           # Database name
MYSQL_USER: nodepc_user           # Application user
MYSQL_PASSWORD: nodepc_pass       # Application user password
```

#### Backend Configuration
```yaml
SPRING_PROFILES_ACTIVE: docker     # Spring profile for Docker environment
SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/nodepcdb
SPRING_DATASOURCE_USERNAME: nodepc_user
SPRING_DATASOURCE_PASSWORD: nodepc_pass
JWT_SECRET: YourVeryLongAndSecureSecretKeyForJWTTokenGenerationMinimum256Bits123456789
```

#### Frontend Configuration
```yaml
API_URL: http://backend:8080/nodepc-backend-0.0.1-SNAPSHOT/api
```

### Customizing Configuration

1. **Database credentials**: Edit the environment variables in `docker-compose.yml`
2. **JWT secret**: Change the `JWT_SECRET` in `docker-compose.yml` for production
3. **API endpoints**: Modify `API_URL` if backend port changes
4. **CORS settings**: Update `cors.allowed-origins` in `backend/src/main/resources/application-docker.yml`

### Application Properties

The backend uses `application-docker.yml` for Docker-specific configuration:

```yaml
spring:
  application:
    name: nodepc-backend
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    defer-datasource-initialization: true
  sql:
    init:
      mode: always

server:
  port: 8080

jwt:
  secret: ${JWT_SECRET}
  expiration-ms: 3600000

logging:
  level:
    org.springframework: INFO
    com.nodepc: INFO

cors:
  allowed-origins:
    - "http://localhost"
```

## Development

### Building Custom Images

To rebuild images after code changes:

```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Rebuild and restart
docker-compose up --build -d
```

### Development Workflow

1. **Make backend changes**:
   - Edit files in `backend/src/`
   - Rebuild backend: `docker-compose build backend && docker-compose up -d backend`

2. **Make frontend changes**:
   - Edit files in `nodepc-frontend/src/`
   - Rebuild frontend: `docker-compose build frontend && docker-compose up -d frontend`

3. **Database changes**:
   - Modify `backend/src/main/resources/data.sql` for initial data
   - Restart services: `docker-compose restart`

### Viewing Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Accessing Containers

```bash
# Access backend container
docker-compose exec backend bash

# Access MySQL container
docker-compose exec mysql mysql -u nodepc_user -p nodepcdb
```

## Ports

The application exposes the following ports on the host machine:

| Port | Service | Purpose | Access URL |
|------|---------|---------|------------|
| 80 | Frontend | Angular application served by Nginx | http://localhost |
| 8080 | Backend | Spring Boot REST API | http://localhost:8080 |
| 3306 | MySQL | Database (host access only) | localhost:3306 |

### Port Configuration

To change default ports, modify the `ports` section in `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "8081:80"  # Change frontend port to 8081

  backend:
    ports:
      - "9090:8080"  # Change backend port to 9090

  mysql:
    ports:
      - "3307:3306"  # Change MySQL port to 3307
```

## Troubleshooting

### Common Issues

#### Services Won't Start
**Problem**: `docker-compose up` fails or services show unhealthy
**Solution**:
```bash
# Check service status
docker-compose ps

# View detailed logs
docker-compose logs

# Restart services
docker-compose restart

# Clean restart
docker-compose down
docker-compose up -d
```

#### Database Connection Issues
**Problem**: Backend can't connect to MySQL
**Solution**:
```bash
# Check MySQL health
docker-compose exec mysql mysqladmin ping -h localhost

# Verify environment variables
docker-compose exec backend env | grep SPRING_DATASOURCE

# Check MySQL logs
docker-compose logs mysql
```

#### Frontend Can't Reach Backend
**Problem**: API calls fail with network errors
**Solution**:
```bash
# Check backend health
curl http://localhost:8080/nodepc-backend-0.0.1-SNAPSHOT/api/health

# Verify API_URL in frontend container
docker-compose exec frontend env | grep API_URL

# Check network connectivity
docker-compose exec frontend curl http://backend:8080/nodepc-backend-0.0.1-SNAPSHOT/api/health
```

#### Port Already in Use
**Problem**: `bind: address already in use`
**Solution**:
```bash
# Find process using port
netstat -tulpn | grep :80
netstat -tulpn | grep :8080
netstat -tulpn | grep :3306

# Kill process or change ports in docker-compose.yml
```

#### Permission Issues (Linux)
**Problem**: Docker commands require sudo
**Solution**:
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Restart session or run:
newgrp docker
```

#### Out of Disk Space
**Problem**: Docker builds fail with disk space errors
**Solution**:
```bash
# Clean up Docker system
docker system prune -a

# Remove unused volumes
docker volume prune

# Check disk usage
docker system df
```

### Health Checks

The application includes health checks for services:

- **MySQL**: Uses `mysqladmin ping` every 20 seconds
- **Backend**: Uses `curl` to check `/api/health` endpoint every 30 seconds
- **Frontend**: Depends on backend health (no explicit health check)

### Debugging Commands

```bash
# View container resource usage
docker-compose stats

# Inspect networks
docker network ls
docker network inspect nodepc_nodepc_network

# Check volumes
docker volume ls
docker volume inspect nodepc_mysql_data

# Export logs for analysis
docker-compose logs > debug.log
```

### Resetting the Environment

To completely reset the application:

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: deletes database data)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Clean rebuild
docker-compose build --no-cache
docker-compose up -d
```

## API Endpoints

The backend provides RESTful API endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/register-admin` - Admin registration

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/{id}` - Update product (admin)
- `DELETE /api/products/{id}` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/customer/{customerId}` - Get orders by customer

### Users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create user (admin)
- `PUT /api/users/{id}` - Update user (admin)
- `DELETE /api/users/{id}` - Delete user (admin)

### Admin
- `GET /api/admin/dashboard` - Admin dashboard data
- `PUT /api/admin/products/{id}/stock` - Update product stock
- `POST /api/admin/products/{id}/image` - Upload product image

## Security Notes

- JWT tokens expire after 1 hour (3600000ms)
- CORS is configured to allow `http://localhost`
- Database credentials are set via environment variables
- Use strong passwords for production deployment
- Consider using Docker secrets for sensitive data in production

## Performance Optimization

- Multi-stage Docker builds reduce image size
- Dependencies are cached in separate layers
- Nginx serves static files efficiently
- Database connection pooling is handled by HikariCP (Spring Boot default)

## Contributing

1. Make changes to source code
2. Test locally with Docker
3. Rebuild affected services
4. Ensure all services are healthy before committing

## Support

For issues or questions:
- Check the troubleshooting section above
- Review Docker and Docker Compose documentation
- Check application logs for error details
- Verify all prerequisites are installed correctly