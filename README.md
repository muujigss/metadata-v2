# Төрөлжсөн бүртгэлийн нэгдсэн сан

Байгууллага, өгөгдлийн сан, хүснэгт, үзүүлэлт, ангилал, маягтын бүртгэл.
Next.js 15, React 18, Prisma 6, PostgreSQL ашиглана.

Шинжилгээ, хийсэн өөрчлөлт, үлдсэн асуудал: [PROJECT_ANALYSIS.md](docs/PROJECT_ANALYSIS.md).

## Локал ажиллуулах

Node.js 22 LTS болон PostgreSQL шаардлагатай. PowerShell:

```powershell
npm ci --legacy-peer-deps
Copy-Item .env.example .env.local
# .env.local дотор DATABASE_URL, JWT_SECRET болон URL-уудыг тохируулна.
npm run schema
npm run dev
```

`JWT_SECRET`-д криптографийн санамсаргүй, урт утга ашиглана. Нууц тохиргоогоо
Git-д commit хийхгүй. `.env` зэрэг өмнө tracked болсон файлыг ignore дангаараа
хамгаалахгүй; тэдгээрийг шилжүүлж, шаардлагатай credential-уудыг солино.

Prisma generate нь client үүсгэнэ; хүснэгт, өгөгдөл өөрчлөхгүй.
Одоо байгаа DB дээр migration/db push ажиллуулахын өмнө schema-ийн нийцэл,
нөөцлөлт, migration төлөвлөгөөг баталгаажуулна. Репод migration түүх байхгүй.

## Шалгалтууд

```powershell
npm test
npm run lint
npm run typecheck
npx prisma validate
npm run build
```

Build болон typecheck нь `.next/types`-ийг ашигладаг тул зэрэг ажиллуулахгүй.
`typecheck`-д хуучин алдаанууд байгаа. Одоогоор Next build type алдааг үл
тоодог учир build амжилттай байх нь typecheck амжилттай гэсэн үг биш.
Тестүүд тусгаарласан mock ашигладаг; бодит DB/SMTP/Elasticsearch интеграцийн
туршилтыг орлохгүй. Нүүр болон chart хуудсууд DB-ээ request үед уншина.

## Тохиргоо

`.env.example` нь шаардлагатай хувьсагчдын загвар.

- `DATABASE_URL`, `JWT_SECRET`: PostgreSQL ба нэвтрэх токен.
- `BASE_URL`: development URL; dev default порт 3000.
- `HOST_BASE_URL`: production URL; `npm start` default порт 3001.
- `UPLOAD_DIR`: локал хадгалалтын директор, default `public/uploads`.
- `EMAIL_HOST`, `EMAIL_PORT`, `METADATA_INFO_EMAIL`, `METADATA_INFO_PASSWORD`: SMTP.
  `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD` нэрийг мөн дэмжинэ.
- `ELASTIC_URL`, `ELASTIC_USER`, `ELASTIC_PASSWORD`: хайлтын index үйлчилгээ.
- Cloudinary болон analytics нь холбогдох боломжуудын сонголтот тохиргоо.

Upload файл тус бүр 50 MB хүртэл. PDF, Word, Excel, JPG/PNG/GIF/WebP дэмжинэ.
Бүртгэлийн хүсэлт хоёр файлтай тул Next server action болон Kubernetes Nginx
Ingress-ийн request body limit 110 MB байна. Шинэ build-ээ deploy хийж,
`deployment.yaml` дахь Ingress-ийн өөрчлөлтийг бодит орчинд хэрэгжүүлнэ.
Тусдаа Nginx reverse proxy ашиглавал тухайн `server`/`location` хэсэгт
`client_max_body_size 110m;` тохируулж, тохиргоогоо шалгаад reload хийнэ.
Зөвхөн frontend-ийг шинэчлэхэд proxy-ийн 413 алдаа арилахгүй.
SVG, HTML болон script төрлийг upload хийхгүй.

## Production

```powershell
npm ci --legacy-peer-deps
npm run schema
npm run build
npm start
```

Серверт production DB, JWT, SMTP болон хадгалалтын runtime тохиргоо өгнө.
Public URL/analytics/Cloudinary-ийн нийтэд харагдах тохиргоо build-д шингэдэг.
Хост өөрчлөгдвөл тэдгээрийг дахин build хийнэ.

Dockerfile нь Node 22, standalone output ашиглана:

```powershell
docker build --build-arg HOST_BASE_URL=https://your-domain.example -t metadata:local .
```

Container-д runtime env болон upload-ийн persistent volume тохируулна.
Image-д `.env`, `.dockerconfigjson`, локал uploads болон node_modules орохгүй.
Runtime-ийн default порт 3000. Docker build/deployment-ийг энэ засварын үеэр
ажиллуулаагүй; тухайн орчинд нь шалгах шаардлагатай.

Kubernetes болон PM2-ийн файлуудад орчны placeholder-ууд байна.
Domain, image, secret, TLS termination/renewal болон proxy routing-ийг
баталгаажуулсны дараа ашиглана. Production deployment автоматаар хийгдээгүй.

## Бүтэц

- `src/app/(site)`: нийтийн каталог, хайлт, chart.
- `src/app/(admin)`: эрхтэй хэрэглэгчийн бүртгэл, хүсэлт, удирдлага.
- `src/app/api`: HTTP route handlers.
- `src/services`: fetch wrapper ба server action.
- `src/services/model`: Prisma query ба бизнес логик.
- `src/utils`: session, token, file, mail болон нийтлэг хэрэгсэл.
- `src/components`: UI component-ууд.
- `prisma/schema.prisma`: өгөгдлийн schema.
- `tests`: нэвтрэлт, эрх, SQL parameter, файл болон тохиргооны regression тест.
