
# Stage 1: Build the Spring Boot application
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy Maven project configuration
COPY pom.xml .

# Download dependencies first for better build caching
RUN mvn dependency:go-offline

# Copy application source
COPY src ./src

# Package the application
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the packaged Spring Boot JAR
COPY --from=build /app/target/*.jar app.jar

# Application port
EXPOSE 8080

# Run as a non-root user
USER 10001

ENTRYPOINT ["java", "-jar", "app.jar"]