ARG BASEIMAGE=node:16-alpine3.12
FROM $BASEIMAGE AS base
RUN apk add --no-cache tzdata ca-certificates
WORKDIR /app
ADD index.js package.json package-lock.json .
RUN npm i

FROM scratch AS final-base
COPY --from=base /etc/group /etc/group
COPY --from=base /etc/passwd /etc/passwd
COPY --from=base /usr/lib /usr/lib
COPY --from=base /lib /lib
COPY --from=base /usr/local/bin/node /usr/local/bin/node
COPY --from=base /usr/local/lib /usr/local/lib
COPY --from=base /app /app
WORKDIR /app
USER node
ENV PATH=/usr/local/bin
ENTRYPOINT ["node", "/app/index.js"]
