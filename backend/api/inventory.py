from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import Sweet
from backend.schemas import SweetCreate, SweetUpdate, SweetResponse
from backend.core.dependencies import get_current_user, admin_required


router = APIRouter(
    prefix="/api/sweets",
    tags=["Inventory"]
)

# PURCHASE SWEET (USER)

@router.post("/{sweet_id}/purchase")
def purchase_sweet(
    sweet_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()

    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    if sweet.quantity <= 0:
        raise HTTPException(status_code=400, detail="Sweet is out of stock")

    sweet.quantity -= 1
    db.commit()

    return {
        "message": "Sweet purchased successfully",
        "sweet_id": sweet.id,
        "remaining_quantity": sweet.quantity
    }


# RESTOCK SWEET (ADMIN)
@router.post("/{sweet_id}/restock")
def restock_sweet(
    sweet_id: int,
    quantity: int,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required)
):
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Restock quantity must be greater than 0")

    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()

    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    sweet.quantity += quantity
    db.commit()

    return {
        "message": "Sweet restocked successfully",
        "sweet_id": sweet.id,
        "new_quantity": sweet.quantity
    }
