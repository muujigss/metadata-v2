# meta-data /Төрөлжсөн бүртгэлийн нэгдсэн сан/

## Node version 18


## Install Postgresql in Rocky linux

```sh
    sudo apt install -y postgresql16
    sudo systemctl enable postgresql
    sudo systemctl start postgresql
    sudo systemctl status postgresql
```

 ## DEV
 - npm install
 - npm run dev

 ## PROD
 - npm install
 - npm run build

## PM2
 - npm install -g pm2
 - pm2 start .next/standalone/server.js --name metadata --env PORT=3001
 - pm2 save && pm2 startup

 ## Технологиуд

 - Nextjs
 - Prisma ORM
 - Postgresql


## Prisma

Generate models
 - npx prisma generate

Postgres table update хийнэ.
 - npx prisma migrate dev


 ## Directory бүтэц

 ```sh
.
├── prisma/                 # Prisma ORM
├── src/
|     |
|     |- app/
│       ├── (routes)/       # Route groups to organize pages by section
│       ├── api/            # Serverless API route handlers
│       ├── layout.tsx      # Root layout shared across all pages
│       ├── page.tsx        # Main (/) page
│       └── globals.css     # Global styles
|     |
|     |-components/         # UI components
│
├── public/                 # Static files (images, icons, robots.txt, etc.)
│
├── next.config.js          # Next.js configuration
├── package.json
└── tsconfig.json

 ```