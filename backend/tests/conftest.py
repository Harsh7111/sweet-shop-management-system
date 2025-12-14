import os, sys, pytest #type:ignore
from fastapi.testclient import TestClient

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.insert(0, PROJECT_ROOT)


from backend.main import app
from backend.database import Base, get_db
from backend.models import User, Sweet
from backend.core.security import hash_password, create_access_token

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

TEST_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_DB_PATH = os.path.join(TEST_DIR, "test.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{TEST_DB_PATH}"


engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False,bind=engine)

@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(db):
    def override_get_db():
        yield db
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

@pytest.fixture
def normal_user(db):
    user = User(
        username="user1",
        email="user@test.com",
        password=hash_password("1234"),
        is_admin=0
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture
def admin_user(db):
    admin = User(
        username="admin1",
        email="admin@test.com",
        password=hash_password("1234"),
        is_admin=1
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin

@pytest.fixture
def normal_user_token(normal_user):
    return f"Bearer {create_access_token({'sub': normal_user.username})}"

@pytest.fixture
def admin_user_token(admin_user):
    return f"Bearer {create_access_token({'sub': admin_user.username})}"

@pytest.fixture
def sample_sweet(db):
    sweet = Sweet(
        name="Ladoo",
        category="Milk",
        price=50,
        quantity=10
    )
    db.add(sweet)
    db.commit()
    return sweet
