# Prisma ORM

## Memulai dengan prisma (Database Relational)
### PreRequest
 - Install node.js https://nodejs.org/en/
 - Database yang telah berjalan di host kita https://www.postgresql.org/

### Url Koneksi ke Database
Prisma memerlukan url koneksi untuk dapat terhibung ke database kita, misal saat mengirim query dengan Prisma Client (https://www.prisma.io/docs/concepts/components/prisma-client) atau saat mengubah skema database dengan prisma migrate (https://www.prisma.io/docs/concepts/components/prisma-migrate).

Komponen-komponen url koneksi (kecuali SQLite):

| Komponen          | Deskripsi                                                           |
|-------------------|---------------------------------------------------------------------|
| User              | Nama pengguna database Anda                                         |
| Kata Sandi        | Kata sandi untuk pengguna basis data Anda                           |
| Host              | IP atau nama domain dari mesin tempat server database Anda berjalan |
| Port              | Port tempat server database Anda berjalan                           |
| Nama basis data   | Nama basis data yang ingin Anda gunakan                             |

Contoh url koneksi database yang didukung prisma:
- PostgreSQL

    ```prisma
    // schema.prism
    datasource db {
      provider = "postgresql"
      url      = "postgresql://janedoe:mypassword@localhost:5432/mydb?schema=sample"
    }
    ```

- MySQL

    ```prisma
    // schema.prism
    datasource db {
      provider = "mysql"
      url      = "mysql://janedoe:mypassword@localhost:3306/mydb"
    }
    ```

- Microsoft SQLServer
    ```prisma
    //schema.prism
    datasource db {
      provider = "sqlserver"
      url      = "sqlserver://localhost:1433;initial catalog=sample;user=sa;password=mypassword;"
    }
    ```

- SQLite

    ```prisma
    // schema.prism
    datasource db {
      provider = "sqlite"
      url      = "file:./dev.db"
    }
    ```


- MongoDB

    ```prisma
    // schema.prism
    datasource db {
      provider = "mongodb"
      url      = "mongodb+srv://root:<password>@cluster0.ab1cd.mongodb.net/myDatabase?retryWrites=true&w=majority"
    }
    ```
- .env
    
    ```prisma
    // schema.prism
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    ```
    
    menggunakan file .env
    ```
    DATABASE_URL=postgresql://janedoe:mypassword@localhost:5432/mydb
    ```

Reference: https://www.prisma.io/docs/reference/database-reference/connection-urls


### Membuat Project

Langkah pertama, buat direktori project dan masuk ke dalam project:

```shell
mkdir "orm-prisma"

cd orm-prisma
```


Inisialisasi project menggunakan type-script dan tambahkan depedensi Prisma CLI:

```shell
npm init -y

npm install prisma typescript ts-node @types/node --save-dev
```

Proses ini akan melakukan pembuatan file package.json. 

```shell
# Output:
Wrote to ./orm-prisma/package.json:

{
  "name": "orm-prisma",
  "version": "1.0.0",
  "description": "## Memulai dengan prisma (Database Relational) ### PreRequest  - Install node.js https://nodejs.org/en/  - Database yang telah berjalan di host kita https://www.postgresql.org/",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}

```

Selanjutnya Inisialisasi typescript:

```shell
npx tsc --init
```

```shell
# Output:
Created a new tsconfig.json with:                                                       
                                                                                     TS 
  target: es2016
  module: commonjs
  strict: true
  esModuleInterop: true
  skipLibCheck: true
  forceConsistentCasingInFileNames: true


You can learn more at https://aka.ms/tsconfig
```

Sekarang kita dapat menjalankan Prisma CLI dengan menggunakan ```npx```:

```shell
npx prisma
```

```shell
# Output

◭  Prisma is a modern DB toolkit to query, migrate and model your database (https://prisma.io)

Usage

  $ prisma [command]

Commands

            init   Set up Prisma for your app
        generate   Generate artifacts (e.g. Prisma Client)
              db   Manage your database schema and lifecycle
         migrate   Migrate your database
          studio   Browse your data with Prisma Studio
        validate   Validate your Prisma schema
          format   Format your Prisma schema

Flags

     --preview-feature   Run Preview Prisma commands

Examples

  Set up a new Prisma project
  $ prisma init

  Generate artifacts (e.g. Prisma Client)
  $ prisma generate

  Browse your data
  $ prisma studio

  Create migrations from your Prisma schema, apply them to the database, generate artifacts (e.g. Prisma Client)
  $ prisma migrate dev
  
  Pull the schema from an existing database, updating the Prisma schema
  $ prisma db pull

  Push the Prisma schema state to the database
  $ prisma db push

  Validate your Prisma schema
  $ prisma validate

  Format your Prisma schema
  $ prisma format

```

Mengatur proyek pisma dengan membuat file skema prisma dengan perintah:

```shell
npx prisma init
```

```shell
# Output

✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

warn You already have a .gitignore file. Don't forget to add `.env` in it to not commit any private information.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can then start querying your database.

More information in our documentation:
https://pris.ly/d/getting-started

```

Nah, sekarang file skema prisma telah terbuat, di path ```prisma/schema.prisma``` dan membuat file .env .

Sekarang kita lihat file .env di direktori root proyek kita, untuk menentukan variabel lingkungan seperti koneksi database kita.

Isi file .env dengan contoh seperti ini:

```shell
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

Silakan sesuaikan dengan database yang kita gunakan.

### Menggunakan Prisma Migrasi

#### Membuat skema database

Skema mapping type data : https://www.prisma.io/docs/concepts/database-connectors/mysql#prisma-migrate

Disini kita akan menggunakan Prisma Migrate (https://www.prisma.io/docs/concepts/components/prisma-migrate) untuk membuat tabel di database kita. Mari kita tambahkan model data Prisma berikut ke skema prisma kita di ```prisma/schema.prisma```:

```shell
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

// url koneksi ke database
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// tabel post
model Post{
    id          Int         @id @default(autoincrement())
    createdAt   DateTime    @default(now())
    updatedAt   DateTime    @updatedAt
    title       String      @db.Varchar(255)
    content     String?
    published   Boolean     @default(false)
    author      User        @relation(fields:[authorId], references:[id])
    authorId    Int
}

// tabel profile
model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  user   User    @relation(fields: [userId], references: [id])
  userId Int     @unique
}

// tabel User
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  posts   Post[]
  profile Profile?
}
```


Untuk memetakan model data ini ke skema database, kita menggunakan prisma migrate perintah CLI:

```shell
npx prisma migrate dev --name init
```

```shell
# Output:

Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": MySQL database "my_db_orm_prisma" at "localhost:3306"

MySQL database my_db_orm_prisma created at localhost:3306

Applying migration `20230526231852_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20230526231852_init/
    └─ migration.sql

Your database is now in sync with your schema.

Running generate... (Use --skip-generate to skip the generators)

added 2 packages, and audited 24 packages in 18s

found 0 vulnerabilities

✔ Generated Prisma Client (4.14.1 | library) to ./node_modules/@prisma/client in 227ms

```

Perintah ini melakukan 2 hal:
- Membuat file migrasi SQL baru 
- Menjalankan file migrasi SQL terhadap database

**Catatan :generatedipanggil secara default, setelah menjalankan prisma migrate dev. Jika prisma-client-jsgenerator ditentukan dalam skema Anda, ini akan memeriksa apakah @prisma/clientsudah diinstal dan menginstalnya jika tidak ada**

Tabel kita sudah terbentuk, berikut deskripsinya:
- Tabel User
  
  | Field | Type           | Null | Key | Default | Extra           |
  |:------|:---------------|:-----|:----|:--------|:----------------|
  | id    | int\(11\)      | NO   | PRI | null    | auto\_increment |
  | email | varchar\(191\) | NO   | UNI | null    |                 |
  | name  | varchar\(191\) | YES  |     | null    |                 |
  
  | Table  | Create Table                                                                                                                                                                                                                                                                                                               |
  |:-------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  | User   | CREATE TABLE \`User\` \(<br/>  \`id\` int\(11\) NOT NULL AUTO\_INCREMENT,<br/>  \`email\` varchar\(191\) NOT NULL,<br/>  \`name\` varchar\(191\) DEFAULT NULL,<br/>  PRIMARY KEY \(\`id\`\),<br/>  UNIQUE KEY \`User\_email\_key\` \(\`email\`\)<br/>\) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4\_unicode\_ci |
  

- Tabel Post
  
  | Field     | Type           | Null | Key   | Default                 | Extra             |
  |:----------|:---------------|:-----|:------|:------------------------|:------------------|
  | id        | int\(11\)      | NO   | PRI   | null                    | auto\_increment   |
  | createdAt | datetime\(3\)  | NO   |       | current\_timestamp\(3\) |                   |
  | updatedAt | datetime\(3\)  | NO   |       | null                    |                   |
  | title     | varchar\(191\) | NO   |       | null                    |                   |
  | content   | varchar\(191\) | YES  |       | null                    |                   |
  | published | tinyint\(1\)   | NO   |       | 0                       |                   |
  | authorId  | int\(11\)      | NO   | MUL   | null                    |                   |
  
  | Table  | Create Table                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
  |:-------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  | Post   | CREATE TABLE \`Post\` \(<br/>  \`id\` int\(11\) NOT NULL AUTO\_INCREMENT,<br/>  \`createdAt\` datetime\(3\) NOT NULL DEFAULT current\_timestamp\(3\),<br/>  \`updatedAt\` datetime\(3\) NOT NULL,<br/>  \`title\` varchar\(191\) NOT NULL,<br/>  \`content\` varchar\(191\) DEFAULT NULL,<br/>  \`published\` tinyint\(1\) NOT NULL DEFAULT 0,<br/>  \`authorId\` int\(11\) NOT NULL,<br/>  PRIMARY KEY \(\`id\`\),<br/>  KEY \`Post\_authorId\_fkey\` \(\`authorId\`\),<br/>  CONSTRAINT \`Post\_authorId\_fkey\` FOREIGN KEY \(\`authorId\`\) REFERENCES \`User\` \(\`id\`\) ON UPDATE CASCADE<br/>\) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4\_unicode\_ci |


- Tabel Profile
  
  | Field  | Type           | Null | Key   | Default | Extra            |
  |:-------|:---------------|:-----|:------|:--------|:-----------------|
  | id     | int\(11\)      | NO   | PRI   | null    | auto\_increment  |
  | bio    | varchar\(191\) | YES  |       | null    |                  |
  | userId | int\(11\)      | NO   | UNI   | null    |                  |

  
  | Table   | Create Table                                                                                                                                                                                                                                                                                                                                                                                                                                          |
  |:--------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  | Profile | CREATE TABLE \`Profile\` \(<br/>  \`id\` int\(11\) NOT NULL AUTO\_INCREMENT,<br/>  \`bio\` varchar\(191\) DEFAULT NULL,<br/>  \`userId\` int\(11\) NOT NULL,<br/>  PRIMARY KEY \(\`id\`\),<br/>  UNIQUE KEY \`Profile\_userId\_key\` \(\`userId\`\),<br/>  CONSTRAINT \`Profile\_userId\_fkey\` FOREIGN KEY \(\`userId\`\) REFERENCES \`User\` \(\`id\`\) ON UPDATE CASCADE<br/>\) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4\_unicode\_ci |


#### Install Prisma Client

Untuk memulai dengan Prisma Client, Kita perlu menginstal paket ```@prisma/client```:

```shell
npm install @prisma/client
```

Perhatikan bahwa perintah instal secara otomatis memanggil prisma generateAnda yang membaca skema Prisma Anda dan menghasilkan versi Klien Prisma yang disesuaikan dengan model Anda.

![img.png](image/img.png)

Setiap kali memperbarui skema Prisma, Anda harus memperbarui skema basis data menggunakan salah satu ```prisma migrate dev``` atau ```prisma db push```. Ini akan membuat skema database Anda sinkron dengan skema Prisma Anda. Perintah juga akan meregenerasi Prisma Client.

### Query Database
#### Query dengan Prisma Client

Sekarang setelah Anda membuat Prisma Client, Anda dapat mulai menulis kueri untuk membaca dan menulis data di database Anda. Untuk tujuan panduan ini, Anda akan menggunakan skrip Node.js biasa untuk menjelajahi beberapa fitur dasar Prisma Client.

Buat file baru bernama ```index.ts``` dan tambahkan kode berikut ke dalamnya:


```ts
// index.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
        .then(async () => {
          await prisma.$disconnect()
        })
        .catch(async (e) => {
          console.error(e)
          await prisma.$disconnect()
          process.exit(1)
        })

```

Skrip index.ts

```ts
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

// Query Prisma Client
async function main(){
    const allUsers = await prisma.user.findMany()
    console.log("Get All Users: ", allUsers)
}

// tutup koneksi saat skrip berakhir

main().then(async ()=>{
    await prisma.$disconnect()
}).catch(async (e)=>{
    console.error(e)
    await prisma.$disconnect()
    process.exit()
})

```

Sekarang jalankan program kita dengan perintah ini:
```shell
npx ts-node index.ts
```
reference: https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/querying-the-database-typescript-postgresql

#### Menulis data ke database

Query ```findMany``` yang Anda gunakan pada bagian sebelumnya hanya membaca data dari database (walaupun masih kosong). Di bagian ini, Anda akan mempelajari cara menulis kueri untuk menulis rekaman baru ke dalam tabel ```Post``` dan ```User```.

Sesuaikan fungsi ```main``` untuk mengirim kueri ```create``` ke database:

```ts
async function main() {
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
      posts: {
        create: { title: 'Hello World' },
      },
      profile: {
        create: { bio: 'I like turtles' },
      },
    },
  })

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  })
  console.dir(allUsers, { depth: null })
}
```

Kode ini membuat record baru ```User```, ```Post``` dan ```Profile``` menggunakan kueri penulisan bersarang. Catatan ```User``` terhubung ke dua yang lain masing-masing melalui bidang relasi ```Post.author``` ↔ ```User.posts``` dan ```Profile.user``` ↔ ```User.profile``` .

Perhatikan bahwa Anda memberikan opsi ```include``` di ```findMany``` yang memberi tahu Prisma Klien untuk menyertakan relasi ```posts``` dan ```profile``` pada objek ```User``` yang dikembalikan.

Kemudian jalankan kode:

```shell
npx ts-node index.ts
```

Output:
```
[
  {
    email: 'alice@prisma.io',
    id: 1,
    name: 'Alice',
    posts: [
      {
        content: null,
        createdAt: 2020-03-21T16:45:01.246Z,
        updatedAt: 2020-03-21T16:45:01.246Z,
        id: 1,
        published: false,
        title: 'Hello World',
        authorId: 1,
      }
    ],
    profile: {
      bio: 'I like turtles',
      id: 1,
      userId: 1,
    }
  }
]
```

Tabel Posts

| id   | createdAt               | updatedAt               | title       | content   | published   | authorId   |
|:-----|:------------------------|:------------------------|:------------|:----------|:------------|:-----------|
| 1    | 2023-05-27 00:24:09.204 | 2023-05-27 00:24:09.204 | Hello world | null      | 0           | 1          |

Tabel Profile

| id   | bio            | userId   |
|:-----|:---------------|:---------|
| 1    | I like turtles | 1        |

Tabel User

| id   | email             | name   |
|:-----|:------------------|:-------|
| 1    | alice@example.com | Alisce |



Update query:
```ts
async function main() {
  const post = await prisma.post.update({
    where: { id: 1 },
    data: { published: true },
  })
  console.log(post)
}
```

