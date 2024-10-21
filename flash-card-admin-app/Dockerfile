FROM node:alpine as build
WORKDIR /app
COPY ./package.json .
RUN npm install  -force
COPY . .
RUN npm run build
# CMD ["npm" "start"]


FROM nginx:alpine
COPY --from=build /app/conf /etc/nginx
COPY --from=build /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]