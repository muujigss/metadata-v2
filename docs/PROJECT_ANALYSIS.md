# Төслийн шинжилгээ ба хийсэн сайжруулалт

Огноо: 2026-10-20. Репо: `metadata-v2`, салбар: `main`.

## 2026-10-23 — login хуудас шилжих төлөв

AuthLogin хүсэлт хүлээх үед Formik-ийг unmount хийдэг, `router.push` дуусахаас
өмнө loading-ийг буцаадаг байсан. Формыг хадгалж, товчийг түр идэвхгүй болгосон.
Амжилттай login-ийн cookie хадгалагдсаны дараа эрхэд тохирох protected document
руу `window.location.replace` ашиглана; pending төлөвийг шинэ хуудас хүртэл хадгална.
1/2/3 эрхийн navigation болон буруу login-ийн төлөвийг regression тестээр шалгасан.
Нийт 30 тест амжилттай. Browser-т synthetic буруу login error харуулж, формын
утгууд хадгалагдахыг шалгасан; жинхэнэ хэрэглэгчийн амжилттай login-ийг browser-т
туршаагүй. Нэмээд Windows/Node 20-д ажиллах `node --test tests` команд ашиглав.

## 2026-10-23 — файл оруулах хязгаар

Хэрэглэгч тушаал 786,097 байт, лого 186,953 байт гэж тодруулсны дараа
`file_id`-г text field давталт болон explicit append-д давхар оруулдаг алдаа олдсон.
Давхардлыг арилгав: анхны нийт 973,050 байт файлууд multipart-тайгаа 1 MiB-аас
бага, харин хуучин serialization нь 1 MiB-аас их болж байсныг regression тестээр
баталсан. Бодит proxy-ийн 1 MB хязгаар болон live 413-ын эх үүсвэрийг шалгаагүй.

Хэрэглэгчийн хүсэлтээр өмнөх 10 MB хязгаарыг файл тус бүр 50 MB болгосон.
Форм, админы файл оруулах шалгалт болон сервер `src/utils/uploadLimits.ts` дахь
ижил утгыг ашиглана. Хоёр 50 MB файл, multipart талбарууд багтахаар Next server
action болон Kubernetes Nginx Ingress хүсэлтийн хязгаарыг 110 MB болгосон.
50 MB хүртэлх файлыг зөвшөөрч, түүнээс нэг байтаар том файлыг хориглох шалгалт,
нийт хүсэлтийн хязгаарын тест оролцуулан 27 тест амжилттай.

Бодит серверт шинэ build болон Ingress тохиргоог хэрэгжүүлээгүй. Тусдаа Nginx
байвал `client_max_body_size 110m;`-ийг мөн тохируулна. HTTP 413 гарсан үед
форм proxy-ийн хязгаарыг шалгуулах тухай зөв тайлбар харуулдаг болсон.

## Хамрах хүрээ

Кодын бүтэц, 73 API route, нэвтрэлт ба хэрэглэгчийн эрх, файл, мэйл,
хайлтын SQL, Prisma schema, UI provider, dependency, build болон deployment
тохиргоог судлав. Энэ нь бүх хэрэглэгчийн урсгалыг бодит өгөгдөл дээр туршсан
баталгаажуулалт биш. Өгөгдлийн сангийн одоогийн нэвтрэх мэдээлэл татгалзагдсан
тул DB/SMTP/Elasticsearch-тэй бүрэн интеграцийн туршилт хийгдээгүй.

## Архитектур

| Давхарга | Байршил | Үүрэг |
| --- | --- | --- |
| Next.js App Router | `src/app` | Нийтийн каталог, админ, нэвтрэлт, хүсэлт |
| API | `src/app/api` | Бүртгэл, хайлт, файл, тайлан, лавлах |
| Service | `src/services` | Browser fetch болон server action холилдсон |
| Model | `src/services/model` | Prisma query, бизнес логик, мэйл |
| Өгөгдөл | `prisma/schema.prisma` | PostgreSQL бүртгэл, лавлах, хүсэлт, лог |
| UI | `src/components` | MUI, Flowbite, HeroUI, React Query, Formik |
| Deployment | Dockerfile, deployment.yaml, ecosystem.config.js | Docker, Kubernetes, PM2 хувилбарууд |

Үндсэн өгөгдлийн холбоос нь байгууллага → өгөгдлийн сан → хүснэгт → үзүүлэлт.
Маягт, ангилал, файл, хүсэлтийн төлөв болон хэрэглэгчийн сангийн эрх тусдаа загвартай.
Нийтийн болон админы model-уудын хайлтын логик давхардсан байна.

## Зассан асуудлууд

| Асуудал | Өөрчлөлт |
| --- | --- |
| Нууц тохиргоо client build-д орох боломжтой | Next config-ийн public `env`-ээс DB URL, JWT secret, SMTP, Cloudinary secret, Elastic credential-ийг хассан |
| JWT-г зөвхөн decode хийдэг | `jose` ашиглан HS256 гарын үсэг, хугацаа, зайлшгүй claim-уудыг шалгадаг болсон |
| Админы эрх бодит route-тай таарахгүй | `/admin/...` болон дэд замд цэсний 1/2/3 түвшний эрхийг шалгадаг болсон |
| Хэрэглэгчийн хүсэлтээс эрх, байгууллага авдаг | Хэрэглэгчийн жагсаалт/үүсгэх/засах/устгах үйлдлийг баталгаажсан session, DB дахь одоогийн эрхээр хязгаарласан |
| Хэрэглэгчийн cookie хамгаалалтгүй | HttpOnly, production Secure, SameSite=Lax, нэг өдрийн хугацаа тохируулсан |
| Идэвхгүй хэрэглэгч нэвтэрч болдог | Login query-д `is_active: true` нэмсэн |
| ID > 44 хэрэглэгч хуучин нууц үггүй сольдог | Бүх хэрэглэгч өөрийн хуучин нууц үгийг шалгуулдаг; бусдын ID-гаар солихыг хориглосон |
| Урт нууц үгээр нэвтрэх боломжгүй | Login-ийн 8 тэмдэгтийн дээд хязгаарыг арилгасан; шинэ нууц үг 12+ тэмдэгт, bcrypt-ийн 72 байтын хязгаартай |
| Санамсаргүй нууц үг сул үүсгэдэг | `crypto.randomBytes` ашигладаг болсон |
| Хариунд password hash буцдаг | Зассан хэрэглэгчийн mutation болон бүртгэлийн хүсэлтийн хариунаас хассан |
| User DELETE буруу HTTP method-той | Method-ийг header дотроос request option руу шилжүүлсэн |
| Хайлтын SQL injection | Нийтийн/админы 10 model-ийн query-г `Prisma.sql` параметрт шилжүүлсэн |
| Dashboard cookie-оос scope авдаг | Баталгаажсан session ашиглаж, байгууллагын SQL утгыг параметр болгосон |
| Dashboard хоосон SQL ажиллуулдаг | Админд тохирохгүй хоосон query-г ажиллуулахгүй болсон |
| Файлын нэрээр директороос гарч болдог | Path validation, realpath шалгалт, Unicode download header нэмсэн |
| Ижил нэртэй upload дарж бичдэг | UUID нэр, `wx` бичилт, DB хадгалалт унавал файлыг цэвэрлэдэг болсон |
| Upload хэмжээ/төрлийн шалгалтгүй | 10 MB, өргөтгөл, MIME шалгалт нэмсэн; PDF/Office болон нийтлэг raster зураг зөвшөөрнө |
| Байгууллагын лого буруу замтай | DB-д бодитоор хадгалсан файлын нэрээр download холбоос үүсгэдэг болсон |
| Нэвтрээгүй хүн мэйл илгээж болдог | Ерөнхий мэйл API/action админд хязгаарлагдсан; бүртгэлийн мэдэгдлийг сервер өөрөө үүсгэдэг болсон |
| SMTP тохиргоогүй ч амжилттай гэж буцдаг | Алдаа буцаадаг; мэйлийн агуулга, түр нууц үгийг log-д хэвлэхийг арилгасан |
| Search index-ийг нийтэд нээлттэй устгаж болдог | Reindex API-г зөвхөн админд зөвшөөрсөн; TLS сертификат шалгах bypass-ийг хассан |
| Дурын Prisma model-д лавлахын API ханддаг | Админ session болон лавлах хүснэгтийн allowlist нэмсэн |
| SQL параметрийг log-д хэвлэдэг | Query/parameter logging-ийг арилгасан |
| QueryClient render бүрт дахин үүсдэг | Админ, нийтийн болон login layout-д state-д хадгалдаг болсон |
| Давхар html/body үүсдэг | Баримтын үндсэн html/body-г root layout-д үлдээж, metadata нэмсэн |
| Build нүүр хуудас үүсгэхдээ DB шаарддаг | Өөрчлөгдөж байдаг тоон мэдээллийг request-time render болгов |
| Docker хуучин runtime, syntax алдаатай | Node 22, OpenSSL, npm ci, нууц/локал файлын dockerignore, public directory-ийн ownership зассан |
| Хуучин lint команд | ESLint CLI, тусдаа `typecheck`, `test` script нэмсэн |

Нэмэлт хамаарал: `jose@5.10.0`. Lockfile-д Next.js 15.5.9 → 15.5.28,
Axios 1.7.7 → 1.20.0 шинэчлэлт орсон.

## Нээлттэй үлдсэн асуудлууд, эрэмбэ

### P0 — бодит орчинд гаргахаас өмнө

1. `.env`, `.env-development`, `.env-production`, `.dockerconfigjson` Git-д tracked байна.
   Ignore нэмэх нь түүхэнд орсон утгыг устгахгүй. Эзэмшигч нь ашиглагдсан credential-уудыг
   сольж, deployment secret store-д шилжүүлээд, шаардлагатай бол Git түүхээ цэвэрлэх хэрэгтэй.
   Өмнөх локал өөрчлөлтийг хадгалах үүднээс эдгээр файлыг устгаж, index-ээс хасаагүй.
2. Бусад metadata mutation API/model-уудад authentication, organization/resource ownership
   шалгалтыг бүрэн нэвтрүүлэх шаардлагатай. Жишээ: database/createAll, table, indicator,
   form, classification. Middleware-ийн хуудасны шалгалт дангаараа API-г хамгаалахгүй.
3. Production dependency audit-д 29 асуудал үлдсэн: 2 critical, 16 high, 10 moderate, 1 low.
   Critical нь `swiper`, `tar`. `xlsx`-д npm audit-аар шууд fix байхгүй.
   Major version өөрчлөх сангуудыг тусдаа compatibility туршилттай шинэчилнэ.

### P1 — найдвартай ажиллагаа

1. `npm run typecheck` амжилтгүй. Олон source type алдаа болон Next 15-ийн async params-т
   шилжээгүй route/page-ууд байна. `ignoreBuildErrors: true` хэвээр; build амжилттай байх
   нь typecheck амжилттай гэсэн үг биш. Түр `any` нэмэн нуух замаар цэвэрлээгүй.
2. Нууц үг сэргээх одоогийн урсгал хүсэлт ирмэгц password өөрчилж мэйлээр явуулдаг.
   Нэг удаагийн, хугацаатай reset token, хэрэглэгчийн баталгаажуулалт, rate limit хэрэгтэй.
   Login/request-access/upload-д distributed rate limit болон proxy body-size limit нэмнэ.
3. Бүртгэл үүсгэх, батлах, хэрэглэгч–сангийн холбоог солих олон DB бичилт transaction биш.
   Дундах үйлдэл унавал хагас төлөв үүсч болно. Мэйлд outbox/retry загвар хэрэгтэй.
4. `/api/elastic` хуучин placeholder URL, хоосон API key, `rejectUnauthorized: false`-той.
   Тохиргоотой TLS client, timeout, input validation, generic error хэрэгтэй.
5. Бодит DB-тай login → байгууллага → сан → хүснэгт → үзүүлэлт → батлах урсгал,
   файл, SMTP, Elasticsearch-ийг интеграцийн туршилтаар шалгах шаардлагатай.

### P2 — арчилгаа ба гүйцэтгэл

1. Model дахь нийтлэг filter, validation, authorization, HTTP response логикийг нэгтгэх.
2. Prisma schema-д migration түүх, query plan-д тулгуурласан FK/filter index,
   user email uniqueness, pagination-ийн дээд хязгаарыг төлөвлөх.
3. Dashboard-ийн дараалсан үл хамаарах query, том JSON/export болон бүх мөр татдаг
   query-г хэмжиж, шаардлагатай хэсэгт parallel query, pagination/streaming ашиглах.
   Build хэмжилтээр нүүр хуудасны First Load JS 803 kB, chart 614 kB байна.
   3D/animation/chart кодыг хэрэгтэй үед татах, bundle-ийг задлах ажил өндөр ач холбогдолтой.
4. MUI/Flowbite/HeroUI болон хуучин давхардсан component-уудыг цөөлөх; keyboard/focus,
   жижиг дэлгэц, loading/error/empty төлөвийг browser тестээр шалгах.
5. `package-lock.json`, `yarn.lock` зэрэгцэн байна. Одоогийн өөрчлөлтийг npm-аар баталсан;
   yarn.lock дахь хэрэглэгчийн өмнөх өөрчлөлтийг хадгалсан. CI-д нэг package manager сонгох.
6. Docker image build, Kubernetes manifest болон PM2 deployment-ийг тус тусад нь шалгах.
   Одоогийн deploy script image бүтээхгүйгээр push хийдэг; image URL/secret placeholder-ууд байна.

## SSL/TLS

Kubernetes Ingress-ийн host нь `metadata.app.nso.mn`. Manifest-д `spec.tls`,
certificate secret эсвэл issuer-ийн тохиргоо харагдахгүй. Энэ нь live домэйны
сертификат байхгүйг батлахгүй: гаднах reverse proxy дээр SSL дуусгаж байж болно.
Live орчинд өөрчлөлт хийгээгүй.

Deployment хариуцагчтай TLS хаана дуусдагийг тогтоож, тухайн host-ийн сертификат,
автомат renewal, HTTP→HTTPS redirect, expiry alert-ийг шалгана. Ingress-ийн
`rewrite-target: /` тохиргоо дэд замыг өөрчилж байгаа эсэхийг мөн integration тестээр шалгана.

## Баталгаажуулалтын хүрээ

- Regression тестүүд DB, SMTP, Elasticsearch рүү холбогдохгүй; request boundary болон
  бодит криптограф/Prisma SQL parameter binding-ийг тусгаарлан шалгадаг.
- `prisma validate` schema-г зөв гэж баталсан; fullTextSearch preview нэрийн warning гарсан.
- Эхний build код хөрвүүлсэн ч `/` prerender үеийн DB authentication-аас унасан.
  Нүүр хуудсыг dynamic болгосны дараах эцсийн үр дүнг доор тэмдэглэнэ.
- Docker/production deployment хийгээгүй; DB schema/migration/өгөгдөл өөрчлөөгүй.
- Өөрчлөлтүүд локал; commit/push хийгээгүй.

### Эцсийн шалгалт

| Шалгалт | Үр дүн |
| --- | --- |
| `npm test` | 26/26 амжилттай |
| `npm run lint` | 0 error, өмнөх 6 warning |
| `npx prisma validate` | Амжилттай; preview нэрийн warning |
| `npm run build` | Амжилттай; 75 static page үүссэн, DB-тай нүүр/chart нь dynamic |
| `npm run typecheck` | Амжилтгүй: 249 diagnostic, үүнээс 190 нь source; бусад нь generated route төрлийн шалгалт |
| `git diff --check` | Амжилттай |
| HTTP smoke | Login 200, admin redirect 307, хамгаалсан 6 API хүсэлт 401 |

Smoke шалгалтад хэрэглэгч үүсгэх, байгууллагын хүсэлтийн жагсаалт, reindex,
мэйл, upload, лавлах бичих API-ууд орсон. Login-ийн HTML-д нэг html/body,
`nosniff` header байгааг шалгасан. Түр локал серверийг шалгалтын дараа зогсоосон.

Бодит DB нэвтрэлт засагдаагүй; build амжилттай болсон нь runtime DB холболтыг
батлахгүй. Container image, эрхтэй хэрэглэгчийн бүрэн урсгал болон live SSL
гэрчилгээ энэ шалгалтад ороогүй.

## Эх сурвалж

- [Next config env нь client bundle-д ордог](https://nextjs.org/docs/13/app/api-reference/next-config-js/env)
- [jose: JWT signature болон claim verification](https://github.com/panva/jose)
- Dependency тоонууд нь 2026-10-20-ны `npm audit --omit=dev --json` үр дүн.
