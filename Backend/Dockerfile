FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy Maven wrapper and pom first (for caching)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Copy source code
COPY src ./src

# Build the app
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Run the app
CMD ["java", "-jar", "target/catalog-backend-0.0.1-SNAPSHOT.jar"]
EXPOSE 8080