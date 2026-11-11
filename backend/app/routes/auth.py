import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.db import get_connection, row_to_dict
from app.schemas import UserCreate, UserLogin
from app.auth import get_password_hash, verify_password, create_access_token, get_current_user
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
def register_user(user_in: UserCreate):
    conn = get_connection()
    existing = conn.execute("SELECT id FROM users WHERE email = ?", (user_in.email,)).fetchone()
    if existing:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
    
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user_in.password)
    now_str = datetime.utcnow().isoformat()

    conn.execute("""
        INSERT INTO users (id, email, password_hash, full_name, role, phone, address, organization_id, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    """, (user_id, user_in.email, hashed_password, user_in.full_name, user_in.role, user_in.phone, user_in.address, user_in.organization_id, now_str))
    conn.commit()
    
    row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    user_data = row_to_dict(row)
    user_data.pop("password_hash", None)
    conn.close()
    return user_data

@router.post("/login")
def login_user(login_in: UserLogin):
    conn = get_connection()
    row = conn.execute("SELECT * FROM users WHERE email = ?", (login_in.email,)).fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    user = row_to_dict(row)
    if not verify_password(login_in.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": user["id"], "role": user["role"], "email": user["email"]},
        expires_delta=access_token_expires
    )
    user.pop("password_hash", None)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    conn = get_connection()
    row = conn.execute("SELECT * FROM users WHERE email = ?", (form_data.username,)).fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    user = row_to_dict(row)
    if not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": user["id"], "role": user["role"], "email": user["email"]},
        expires_delta=access_token_expires
    )
    user.pop("password_hash", None)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me")
def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    user = dict(current_user)
    user.pop("password_hash", None)
    return user
