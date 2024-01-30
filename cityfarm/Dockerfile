FROM eclipse-temurin:21-jdk-alpine
VOLUME /tmp
COPY target/cityfarm-0.0.1-SNAPSHOT.jar app.jar
ENV SPRING_DATA_MONGODB_HOST=mongodb
LABEL org.opencontainers.image.source https://github.com/spe-uob/2023-CityFarm
CMD ["java","-jar","/app.jar"]