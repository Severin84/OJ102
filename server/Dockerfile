FROM node:18-alpine
WORKDIR /app
RUN apk update && apk add --no-cache \
    g++ \
    gcc \
    openjdk11-jdk \
    python3 \
    py3-pip

RUN ln -sf /usr/bin/python3 /usr/bin/python
# RUN g++ --version && \
#     gcc --version && \
#     java -version && \
#     python --version && \
#     pip --version

COPY package.json .
RUN npm install
COPY . .
EXPOSE 8000
CMD ["npm","start"]