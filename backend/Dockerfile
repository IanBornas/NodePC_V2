# Multi-stage build for Spring Boot WAR application

# Build stage
FROM maven:3.9.5-eclipse-temurin-21 AS build

WORKDIR /app

# Copy Maven wrapper and pom.xml for dependency caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (cached if pom.xml unchanged)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built WAR file from build stage
COPY --from=build /app/target/*.war app.war

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.war"]