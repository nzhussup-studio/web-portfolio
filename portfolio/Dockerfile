# Build Stage
FROM --platform=$BUILDPLATFORM node:18 AS build

ARG VITE_GITHUB_TOKEN
ENV VITE_GITHUB_TOKEN=${VITE_GITHUB_TOKEN}

WORKDIR /app

COPY package*.json ./

ARG NODE_OPTIONS=--max_old_space_size=4096
ENV NODE_OPTIONS=$NODE_OPTIONS

RUN npm install

COPY . .

RUN npm run build

# Nginx Stage
FROM --platform=$TARGETPLATFORM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]
