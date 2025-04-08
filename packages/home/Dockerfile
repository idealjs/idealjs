FROM node:22-alpine AS runner
WORKDIR /workspace

COPY .next ./.next
COPY .vercel ./.vercel
COPY node_modules ./node_modules
COPY .env ./.env
COPY package.json ./package.json
COPY public ./public

EXPOSE 3000
CMD ["yarn", "start"]
