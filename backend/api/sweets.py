from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from typing import Optional
from sqlalchemy import and_
from backend.database import get_db
from backend.models import Sweet
from backend.schemas import SweetCreate, SweetUpdate, SweetResponse
from backend.core.dependencies import get_current_user, admin_required


router = APIRouter(
    prefix="/api/sweets",
    tags=["Sweets"]
)

#  1. Get all sweets (Public)
@router.get("/", response_model=list[SweetResponse])
def get_all_sweets(db: Session = Depends(get_db)):
    return db.query(Sweet).all()


#  2. Add new sweet (ADMIN ONLY)
@router.post("/", response_model=SweetResponse)
def add_sweet(
    sweet: SweetCreate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required)
):
    new_sweet = Sweet(**sweet.model_dump())
    db.add(new_sweet)
    db.commit()
    db.refresh(new_sweet)
    return new_sweet


#  3. Update sweet (ADMIN ONLY)
@router.put("/{sweet_id}", response_model=SweetResponse)
def update_sweet(
    sweet_id: int,
    sweet: SweetUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required)
):
    db_sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    if not db_sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    update_data = sweet.model_dump(exclude_unset=True)
    for key, value in sweet.model_dump(exclude_unset=True).items():
        setattr(db_sweet, key, value)

    db.commit()
    db.refresh(db_sweet)
    return db_sweet


#  4. Delete sweet (ADMIN ONLY)
@router.delete("/{sweet_id}")
def delete_sweet(
    sweet_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required)
):
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    db.delete(sweet)
    db.commit()
    return {"message": "Sweet deleted successfully"}



@router.get("/search", response_model=list[SweetResponse])
def search_sweets(
    name: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Sweet)

    if name:
        query = query.filter(Sweet.name.ilike(f"%{name}%"))

    if category:
        query = query.filter(Sweet.category.ilike(f"%{category}%"))

    if min_price is not None:
        query = query.filter(Sweet.price >= min_price)

    if max_price is not None:
        query = query.filter(Sweet.price <= max_price)

    return query.all()
