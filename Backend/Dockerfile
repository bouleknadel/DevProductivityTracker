# Use OpenJDK 17 as the base image
FROM eclipse-temurin:17-jdk-alpine as build

# Set working directory
WORKDIR /app

# Copy Maven configuration files
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make the Maven wrapper executable
RUN chmod +x ./mvnw

# Download Maven dependencies (this is done in a separate step to leverage Docker cache)
RUN ./mvnw dependency:go-offline -B

# Copy the source code
COPY src src

# Build the application
RUN ./mvnw package -DskipTests

# Create a lightweight runtime image
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8083

# Set the startup command
ENTRYPOINT ["java", "-jar", "app.jar"]