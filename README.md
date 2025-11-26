# KantinKu - Online Canteen Ordering System

Sistem pemesanan makanan kantin online yang memudahkan mahasiswa untuk memesan makanan tanpa harus mengantri.

## 📋 Problem Statement
Mahasiswa sering menghabiskan banyak waktu istirahat untuk mengantri di kantin, terutama pada jam-jam sibuk. Proses pemesanan manual yang lambat mengakibatkan:

Waktu istirahat terbuang untuk mengantri
Proses pemesanan tidak efisien
Kesalahan dalam pencatatan pesanan
Tidak ada tracking status pesanan

## 💡 Solution Overview
KantinKu adalah aplikasi web yang memungkinkan:

Untuk Mahasiswa/Customer:

Melihat menu makanan dengan foto dan harga
Memesan makanan secara online
Tracking status pesanan real-time
Menghindari antrian panjang


Untuk Admin Kantin:

Mengelola menu makanan (CRUD)
Melihat dan memproses semua pesanan
Update status pesanan (Pending → Preparing → Ready → Completed)
Upload foto menu



## 🛠 Tech Stack
### Backend

Node.js + Express.js - REST API Server
MongoDB + Mongoose - Database
JWT - Authentication
Bcrypt - Password Hashing
Multer - File Upload

### Frontend

React + Vite - UI Framework
React Router - Navigation
Axios - HTTP Client
CSS3 - Styling (Responsive)

## ✨ Fitur Utama
Authentication

✅ Register dengan role (Customer/Admin)
✅ Login dengan JWT token
✅ Password di-hash dengan bcrypt
✅ Token disimpan di localStorage

CRUD Menu (Admin)

✅ Tambah menu baru dengan upload foto
✅ Edit menu (nama, harga, kategori, ketersediaan)
✅ Delete menu
✅ View semua menu

Order Management

✅ Customer dapat memesan makanan (cart system)
✅ Customer dapat melihat history pesanan
✅ Admin dapat melihat semua pesanan
✅ Admin dapat update status pesanan
✅ Filter pesanan berdasarkan status

Upload File

✅ Upload foto menu (JPEG, JPG, PNG, GIF)
✅ Preview gambar sebelum upload
✅ Foto disimpan di folder uploads/

UI/UX

✅ Responsive design (mobile & desktop)
✅ Dashboard dengan statistik
✅ Real-time cart dengan badge counter
✅ Status pesanan dengan color coding
✅ Clean dan modern interface

## 📁 Project Structure
```kantinku/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Menu.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── menu.js
│   │   └── order.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── MenuCard.jsx
    │   │   └── OrderCard.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── MenuList.jsx
    │   │   ├── MenuForm.jsx
    │   │   ├── OrderList.jsx
    │   │   └── MyOrders.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 🚀 Cara Menjalankan Project
Prerequisites

Node.js (v16 atau lebih tinggi)
MongoDB (lokal atau MongoDB Atlas)
npm atau yarn


1. Setup Backend
bashcd backend
npm install
Buat file .env:
envPORT=5000
MONGODB_URI=mongodb://localhost:27017/kantinku
JWT_SECRET=your_jwt_secret_key_change_this
Buat folder uploads:
bashmkdir uploads
Jalankan server:
bashnpm run dev
Backend akan berjalan di http://localhost:5000

2. Setup Frontend
bashcd frontend
npm install
Update API_URL di src/utils/api.js jika perlu (default: http://localhost:5000/api)
Jalankan aplikasi:
bashnpm run dev
Frontend akan berjalan di http://localhost:5173

3. Testing Aplikasi
Cara 1: Register Baru

Buka http://localhost:5173
Klik "Register"
Pilih role (Customer atau Admin)
Isi form dan register


## 📱 Fitur per Role
Customer

Browse menu makanan
Add to cart
Place order
View order history
Track order status

Admin

Semua fitur Customer
Manage menu (Create, Read, Update, Delete)
View all orders
Update order status
Upload menu images

## 🎯 User Flow
Customer Flow:

Register/Login
Browse Menu
Add items to cart
Checkout with notes (optional)
View order status di "My Orders"
Wait for order status: Pending → Preparing → Ready
Pick up order when ready

Admin Flow:

Login sebagai admin
Manage menu (Add/Edit/Delete)
View all orders
Process orders:

Pending: Click "Start Preparing"
Preparing: Click "Mark as Ready"
Ready: Click "Complete Order"


Monitor statistics di dashboard

## 📊 Database Schema
```
Users
javascript{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (customer/admin),
  timestamps
}
Menu
javascript{
  name: String,
  description: String,
  price: Number,
  category: String (makanan/minuman/snack),
  image: String,
  available: Boolean,
  timestamps
}
Orders
javascript{
  user: ObjectId (ref: User),
  items: [{
    menu: ObjectId (ref: Menu),
    quantity: Number,
    price: Number
  }],
  totalPrice: Number,
  status: String (pending/preparing/ready/completed/cancelled),
  notes: String,
  timestamps
}
```
## 🔐 API Endpoints
Authentication

POST /api/auth/register - Register user baru
POST /api/auth/login - Login user

Menu

GET /api/menu - Get all menus
GET /api/menu/:id - Get menu by ID
POST /api/menu - Create menu (Admin only)
PUT /api/menu/:id - Update menu (Admin only)
DELETE /api/menu/:id - Delete menu (Admin only)

Orders

GET /api/orders - Get orders (All for admin, own for customer)
GET /api/orders/:id - Get order by ID
POST /api/orders - Create order
PUT /api/orders/:id - Update order
DELETE /api/orders/:id - Delete order

## 🌟 Screenshots & Demo
Dashboard
Show Image
Menu List
Show Image
Order Tracking
Show Image

## 🚀 Deployment
Backend (Render/Railway)

Push code ke GitHub
Connect repository di Render/Railway
Set environment variables
Deploy

Frontend (Vercel/Netlify)

Build production: npm run build
Deploy folder dist
Update API_URL ke backend production URL

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
📄 License
This project is open source and available under the MIT License.
👥 Author
Dibuat untuk memenuhi tugas Ujian Akhir Semester - Web Development

KantinKu - Solusi Modern untuk Pemesanan Kantin Digital 🍽️
