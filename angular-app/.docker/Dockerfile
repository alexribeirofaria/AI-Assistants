FROM node:24.16.0-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build -- --configuration production

FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/angularapp/browser /usr/share/nginx/html

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
