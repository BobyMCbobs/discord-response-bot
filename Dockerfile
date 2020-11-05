FROM node:12.13.1-alpine3.10 AS fetchdeps
WORKDIR /app
ADD index.js package.json package-lock.json .
RUN npm i

FROM gcr.io/distroless/nodejs:14
COPY --from=fetchdeps /app /app
WORKDIR /app
CMD ["index.js"]
