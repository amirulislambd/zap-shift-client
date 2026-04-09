# ZapShift - Online Parcel Delivery Service

![ZapShift - Homepage Hero Section](https://i.ibb.co.com/TMFsb1xv/Screenshot-35.png)

**Fastest Delivery & Easy Pickup** — A full-stack parcel delivery platform.

## 📋 Project Overview

**ZapShift** is a complete full-stack web application for online courier and parcel delivery services, inspired by real-world platforms like Pathao or Uber Eats for deliveries.

Users can send parcels easily, Riders can accept and deliver them, and Admins can manage the entire system. The project features three distinct roles with separate dashboards.

Built with **ReactJS + ExpressJS + Firebase Authentication + MongoDB Atlas**.

## ✨ Key Features

- **Role-based Dashboards**:
  - **User Dashboard**: Send parcels, track orders, manage payments and profile
  - **Rider Dashboard**: View delivery requests, accept jobs, and dedicated Rider form
  - **Admin Dashboard**: Full system control — manage users, riders, parcels, and analytics

- **Parcel Sending System**:
  - Complete "Send a Parcel" form with pickup & delivery address, parcel details, weight, and price calculation

- **Authentication**:
  - Secure Login & Sign Up using **Firebase Authentication**
  - Role-based protected routes

- **Payment System**:
  - Virtual/Demo payment method (no real money involved — perfect for testing and demo)

- **Other Features**:
  - Fully Responsive Design (Mobile + Desktop)
  - RESTful API built with ExpressJS
  - MongoDB Atlas for database management
  - Clean and modern UI

## 🛠️ Tech Stack

| Layer            | Technology                      |
|------------------|---------------------------------|
| Frontend         | ReactJS                         |
| Backend          | ExpressJS + Node.js             |
| Database         | MongoDB Atlas                   |
| Authentication   | Firebase Authentication         |
| Styling          | CSS / Tailwind CSS              |

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Firebase Project

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/zapshift.git
cd zapshift

# 2. Backend Setup
cd server
npm install

# Create .env file and add:
# MONGO_URI=your_mongodb_atlas_connection_string
# Add your Firebase config

npm run dev

# 3. Frontend Setup (in a new terminal)
cd ../client
npm install
npm start
