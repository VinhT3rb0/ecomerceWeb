#FROM eclipse-temurin:17-jdk-focal as build
#VOLUME /tmp
#COPY target/*.jar app.jar
#EXPOSE 8080
#ENTRYPOINT ["java", "-jar", "/app/run.jar"]
#WORKDIR /build
#
#COPY .mvn/ ./.mvn
#COPY mvnw pom.xml  ./
#RUN sed -i 's/\r$//' mvnw
#RUN ./mvnw dependency:go-offline
#
#COPY . .
#RUN sed -i 's/\r$//' mvnw
#RUN ./mvnw package -DskipTests
#
#FROM eclipse-temurin:17-jdk-alpine
#WORKDIR /app
#COPY --from=build /build/target/*.jar run.jar
#ENTRYPOINT ["java", "-jar", "/app/run.jar"]
# Stage 1: Build stage
FROM eclipse-temurin:17-jdk-focal as build
VOLUME /tmp
COPY target/*.jar app.jar

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jdk-focal
COPY --from=build /app.jar /app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]

# Stage 3: Cloudflare Tunnel stage
FROM cloudflare/cloudflared:latest as cloudflared
COPY --from=build /app.jar /app.jar
EXPOSE 8081
CMD ["tunnel", "--no-autoupdate", "run", "--token", "eyJhIjoiMTljZTYyZDZjZjI1NmZlNTExZDJlYmZmMjhlN2I1NjgiLCJ0IjoiNWZiZDM2MjAtNjc1NC00OWYxLWFlNmQtMWU5OWNiOGZhMzJhIiwicyI6Ik5qaGpNbVpqT1RVdFpqSmlOeTAwTmpjNExXSTBOell0Tm1RMVptUTJOR1k0TnpNMiJ9"]
