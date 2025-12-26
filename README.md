# LuxeEstate - Frontend

Welcome to the frontend repository of **LuxeEstate**, a premium real estate platform designed to connect buyers, movers, and dreamers with their perfect properties.

This project showcases a modern, responsive, and interactive user interface built with the latest web technologies, focusing on providing a seamless experience for Users, Agents, and Administrators.

---

## 🚀 Key Features

### For Users (Buyers/Browsers)
*   **Stunning UI/UX**: Validated implementation of glassmorphism, responsive grids, and smooth animations (Framer Motion).
*   **Advanced Search**: Filter properties by location, price, type, and amenities.
*   **Interactive Maps**: View property locations directly on an integrated map.
*   **Real-Time Inquiries**: Send inquiries directly to agents and receive updates instantly via in-app notifications.

### For Agents (Sellers)
*   **Dedicated Dashboard**: Manage property listings, view stats, and handle inquiries in one place.
*   **Create Listings**: Easy-to-use form for adding new properties with image uploads.
*   **Status Tracking**: Track the approval status of listings (Pending, Approved, Rejected).
*   **Real-Time Alerts**: Get notified immediately when a user inquires about a property.

### For Administrators
*   **Complete Oversight**: Manage all users, properties, and inquiries from a robust Admin Panel.
*   **Approval Workflow**: Review and approve/reject new property submissions.
*   **Role Management**: Upgrade users to Agents or manage existing accounts.

---

## 🛠 Tech Stack

*   **Framework**: [React](https://reactjs.org/) (via Vite)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (RTK Query for API caching)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Notifications**: [Socket.io Client](https://socket.io/) & Web Push API & React Toastify
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚙️ Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
*   Node.js (v16 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Mathiyarasan2102/LuxeEstate-RealEstate-Website-Frontend.git
    cd LuxeEstate-RealEstate-Website-Frontend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your backend URL:
    ```env
    VITE_API_URL=http://localhost:5000
    ```
    *(Note: Ensure your backend server is running)*

4.  **Run the App**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

---

**Developed by Mathiyarasan P**
