Sociomile Mini System

Versi mini dari Sociomile System (Take-Home Assignment).
Fokus pada: Ticket Management, Conversation (Chat), Multi-Tenancy, Authentication & Authorization.

a. Cara Menjalankan Aplikasi

Clone repository

git clone https://github.com/username/sociomile-mini.git
cd sociomile-mini


Install dependencies

Backend (Express.js)
npm install

Frontend (Vue.js)
cd frontend
npm install

Setup database
npx prisma migrate dev --name init


Setup environment variables
cp .env.example .env
# Edit .env sesuai environment Anda

Jalankan aplikasi

Backend:
npm run dev

Frontend:
cd frontend
npm run serve


b. Environment Variables

Contoh .env:

DATABASE_URL="postgresql://user:password@localhost:5432/sociomile"
JWT_SECRET="your_secret_key"
PORT=3000
FRONTEND_URL=http://localhost:8080

Keterangan:
DATABASE_URL → koneksi database PostgreSQL
JWT_SECRET → secret key untuk JWT
PORT → port backend
FRONTEND_URL → base URL frontend (untuk CORS)

c. Daftar Endpoint API
| Method | Endpoint | Role | Deskripsi |
|--------|---------|------|-----------|
| POST   | /auth/login | admin, agent, customer | Login user, return JWT token |
| GET    | /users/lists | admin | List semua user |
| GET    | /users/customers | admin, agent | List user dengan role customer |
| GET    | /users/agents | admin | List user dengan role agent |
| POST   | /tickets/ | customer | Create ticket |
| GET    | /tickets/list | admin, agent, customer | List semua ticket |
| GET    | /tickets/:ticketId | admin, agent | Detail ticket |
| POST   | /tickets/:ticketId/assign | admin | Assign ticket ke agent |
| POST   | /tickets/:ticketId/update | admin | Update status ticket |
| POST   | /tickets/:ticketId/messages | agent, customer | Send message di ticket |
| GET    | /tickets/:ticketId/messages | agent, customer | Get conversation log |

d. Asumsi dan Trade-Off

Multi-Tenancy
Data terisolasi menggunakan tenant_id di setiap tabel
Admin & agent hanya bisa akses tenant-nya sendiri

Assign Ticket

Admin assign ticket ke agent
Agent hanya bisa handle ticket yang assigned

Conversation
Pesan disimpan urut berdasarkan waktu
Chat realtime menggunakan WebSocket

Security
JWT untuk autentikasi & proteksi endpoint

Trade-Off
User management minimal (admin hanya bisa lihat user tenant)
Rate limiting / caching Redis tidak diimplementasikan untuk fokus core requirement