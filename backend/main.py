from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from backend.database import engine, SessionLocal
from backend import models
from backend.models import User
from backend.core.dependencies import get_current_user, admin_required

from backend.api.auth import router as auth_router
from backend.api.sweets import router as sweet_router
from backend.api.inventory import router as inventory_router

app = FastAPI(title="Sweet Shop Management System")

#  Add CORS middleware - IMPORTANT
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(sweet_router)
app.include_router(inventory_router)


@app.get("/")
def root():
    return {"message": "Sweet Shop API is running"}

@app.get("/protected", response_model=None)
def protected_route(current_user: User = Depends(get_current_user)):
    return {
        "message": "You are authorized",
        "username": current_user.username
    }

@app.get("/user/profile")
def user_profile(current_user: User = Depends(get_current_user)):
    return {
        "username": current_user.username,
        "email": current_user.email
    }

@app.get("/admin/dashboard")
def admin_dashboard(current_user: User = Depends(admin_required)):
    return {"message": "Welcome Admin!"}
