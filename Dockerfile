FROM oven/bun:canary-alpine
WORKDIR /app/landgalleryApi
COPY . .
RUN bun install --production
EXPOSE 3000
CMD ["bun", "start"]