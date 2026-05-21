FROM eclipse-temurin:21-jdk

RUN apt-get update && apt-get install -y maven git

WORKDIR /app

ARG BRANCH=dev

RUN git clone -b ${BRANCH} https://github.com/regisdesouza/FuTour-Sight.git

WORKDIR /app/FuTour-Sight/java

RUN mvn clean package -DskipTests

CMD ["java", "-jar", "target/futour-java-1.0.0.jar"]
