from sqlalchemy import Column, Integer, String, Float
from backend.database import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True} 

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    password = Column(String)
    is_admin = Column(Integer, default=0)


class Sweet(Base):
    __tablename__ = "sweets"
    __table_args__ = {'extend_existing': True} 

    id = Column(Integer, primary_key=True)
    name = Column(String)
    category = Column(String)
    price = Column(Float)
    quantity = Column(Integer)