# Ticketing System
**Fokus utama:** Ticket Management, Conversation (Chat), Multi-Tenancy, Authentication & Authorization.

---

## 📋 Daftar Isi

- [Cara Menjalankan Aplikasi](#cara-menjalankan-aplikasi)
- [Environment Variables](#environment-variables)
- [Daftar Endpoint API](#daftar-endpoint-api)
- [Asumsi dan Trade-Off](#asumsi-dan-trade-off)

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Clone Repository

```bash
git clone https://github.com/shafaadha/Sociomile-Mini-System.git
cd Sociomile-Mini-System
```

### 2. Install Dependencies

**Backend (Express.js)**
```bash
npm install
```

**Frontend (Vue.js)**
```bash
cd frontend
npm install
cd ..
```

### 3. Setup Database

```bash
npx prisma migrate dev --name init
```

### 4. Setup Environment Variables

```bash
cp .env.example .env
```

Edit file `.env` sesuai dengan konfigurasi environment Anda (lihat bagian [Environment Variables](#environment-variables)).

### 5. Jalankan Aplikasi

**Backend:**
```bash
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run serve
```

Aplikasi akan berjalan di:
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:8080`

---

## ⚙️ Environment Variables

Buat file `.env` di root folder dengan konfigurasi berikut:

```env
DATABASE_URL="mysql://root:@localhost:3306/db_sosiomite"
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=db_sosiomite
JWT_SECRET="your_secret_key"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

### Keterangan:

| Variable | Deskripsi |
|----------|-----------|
| `DATABASE_URL` | Koneksi database MySQL (format: `mysql://USER:PASSWORD@HOST:PORT/DATABASE`) |
| `DATABASE_HOST` | Host database (default: `localhost`) |
| `DATABASE_PORT` | Port database MySQL (default: `3306`) |
| `DATABASE_USER` | Username database MySQL |
| `DATABASE_PASSWORD` | Password database MySQL (kosongkan jika tidak ada) |
| `DATABASE_NAME` | Nama database |
| `JWT_SECRET` | Secret key untuk JWT authentication (**wajib ganti di production!**) |
| `PORT` | Port untuk backend server |
| `FRONTEND_URL` | Base URL frontend (untuk CORS) |

---

## 📡 Daftar Endpoint API

### Authentication

| Method | Endpoint | Role | Deskripsi |
|--------|----------|------|-----------|
| `POST` | `/auth/login` | `admin`, `agent`, `customer` | Login user, return JWT token |

### User Management

| Method | Endpoint | Role | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/users/lists` | `admin` | List semua user |
| `GET` | `/users/customers` | `admin`, `agent` | List user dengan role customer |
| `GET` | `/users/agents` | `admin` | List user dengan role agent |

### Ticket Management

| Method | Endpoint | Role | Deskripsi |
|--------|----------|------|-----------|
| `POST` | `/tickets/` | `customer` | Create ticket baru |
| `GET` | `/tickets/list` | `admin`, `agent`, `customer` | List semua ticket |
| `GET` | `/tickets/:ticketId` | `admin`, `agent` | Detail ticket berdasarkan ID |
| `POST` | `/tickets/:ticketId/assign` | `admin` | Assign ticket ke agent |
| `POST` | `/tickets/:ticketId/update` | `admin` | Update status ticket |

### Conversation (Chat)

| Method | Endpoint | Role | Deskripsi |
|--------|----------|------|-----------|
| `POST` | `/tickets/:ticketId/messages` | `agent`, `customer` | Kirim pesan di ticket |
| `GET` | `/tickets/:ticketId/messages` | `agent`, `customer` | Ambil conversation log |

---

## 📝 Asumsi dan Trade-Off

### Multi-Tenancy
- Data terisolasi menggunakan `tenant_id` di setiap tabel
- Admin & agent hanya bisa akses data tenant mereka sendiri

### Assign Ticket
- Hanya admin yang dapat assign ticket ke agent
- Agent hanya bisa handle ticket yang sudah di-assign ke mereka

### Conversation
- Pesan disimpan dan diurutkan berdasarkan waktu (timestamp)
- Chat realtime menggunakan WebSocket

### Security
- JWT digunakan untuk autentikasi & proteksi endpoint
- Role-based access control (RBAC) untuk autorisasi

### Trade-Off
- **User Management:** Fitur minimal (admin hanya bisa lihat user dalam tenant yang sama)
- **Performance:** Rate limiting dan caching (Redis) tidak diimplementasikan untuk fokus pada core requirement
- **Scalability:** Fokus pada MVP, belum dioptimasi untuk high-traffic production environment

---

## 🛠️ Tech Stack

- **Backend:** Express.js, Prisma ORM, MySQL
- **Frontend:** Vue.js
- **Authentication:** JWT (JSON Web Token)
- **Real-time:** WebSocket
