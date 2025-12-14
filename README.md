#  Sweet Shop Management System

A full-stack web application for managing a sweet shop with user authentication, inventory management, and admin features.

##  Features

### Backend 
-  User Authentication (JWT)
-  Sweet CRUD Operations
-  Search & Filter Sweets
-  Purchase Management
-  Inventory Restock (Admin)
-  Role-based Access Control

### Frontend 
-  User Registration & Login
-  Dashboard with Sweet Display
-  Search by Name, Category, Price
-  Purchase Sweets
-  Admin Panel (Add/Edit/Delete)
-  Responsive Design


##  Prerequisites

- Python
- Node.js 
- pip
- npm

##  Setup & Installation
### Backend  Setup
```bash

cd sweet_shop_management_system

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn backend.main:app --reload
```

Backend will run on: `http://localhost:8000`

### Frontend Setup
```bash

cd frontend

npm instal

npm run dev
```
Frontend will run on: `http://localhost:5173`

##  Running Tests
```bash
# Run all tests
pytest -v

# Run specific test file
pytest backend/tests/test_auth.py -v

# Run with coverage
pytest --cov=backend --cov-report=html
```

##  API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Sweets (Protected)
- `GET /api/sweets/` - Get all sweets
- `POST /api/sweets/` - Add sweet (Admin)
- `GET /api/sweets/search` - Search sweets
- `PUT /api/sweets/{id}` - Update sweet (Admin)
- `DELETE /api/sweets/{id}` - Delete sweet (Admin)

### Inventory (Protected)
- `POST /api/sweets/{id}/purchase` - Purchase sweet
- `POST /api/sweets/{id}/restock` - Restock sweet (Admin)

##  Project Structure
```
sweet-shop-management-system/
├── .gitignore               
├── README.md              
│
├── backend/                 # Python/FastAPI Project
│   ├── main.py              # Application entry point
│   ├── database.py          # DB Engine & Session setup
│   ├── models.py            # SQLAlchemy ORM definitions (User, Sweet)
│   ├── schemas.py           # Pydantic Schemas (Request/Response validation)
│   ├── core/                # Security & dependencies
│   │   ├── security.py      # Password hashing, JWT creation
│   │   └── dependencies.py  # get_current_user, admin_required checks
│   ├── api/                 # FastAPI Routers (API Endpoints)
│   │   ├── auth.py          # /api/auth/register, /api/auth/login
│   │   ├── sweets.py        # /api/sweets (CRUD, search)
│   │   └── inventory.py     # /api/sweets/:id/purchase, /api/sweets/:id/restock
│   └── tests/               # Pytest tests for all backend logic
│       ├── conftest.py      # CRITICAL: Test DB setup, fixtures, dependency overrides
│       ├── test_auth.py     # Auth endpoint tests
│       ├── test_sweets.py   # CRUD and Search tests
│       └── test_inventory.py# Purchase and Restock tests
│
└── frontend/                # React/SPA Project
    ├── src/
    │   ├── components/      # SweetCard, Header, Footer
    │   ├── pages/           # Login, Register, Dashboard, AdminPanel
    │   └── App.jsx          # Main Router component
    └── package.json
```
## UI View
!(Images\AuthDashbordSearch.JPG)
!(Images\AuthDashbordSearch.JPG)
!(Images/AuthSweetADD - Copy.JPG)
!(Images/AuthSweetADD.JPG)
!(Images/RagistrationPage.JPG)
!(Images/LoginPage.JPG)
!(Images/AuthUpdate.JPG)


## AI and other Tools Used
  - FastAPI offical site use for JWT Tokesand Auth
  – Gemini Use for solved error of test writing
  – Claude helped generate  frontend

## Default Admin User
 Manually change the value 0 for User and 1 for Adim So change in SQLLITE DB Brower
``'

##  Author

Harsh Rathod - Sweet Shop Management System