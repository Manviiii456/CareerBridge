
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from pymongo.errors import DuplicateKeyError
from jose import JWTError, jwt

from database import client, students_collection
from models.student import StudentCreate, StudentLogin, StudentUpdate

from security import (
    hash_password,
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM
)


app = FastAPI(
    title="CareerBridge API",
    description="Backend API for the CareerBridge student platform",
    version="1.0.0"
)


# Read JWT token from Authorization header
bearer_scheme = HTTPBearer()


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Ensure every student has a unique email
students_collection.create_index("email", unique=True)


@app.get("/")
def home():
    return {
        "message": "Welcome to CareerBridge Backend!",
        "status": "Running successfully"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/db-health")
def database_health():
    try:
        client.admin.command("ping")

        return {
            "status": "success",
            "message": "MongoDB connected successfully!"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@app.post("/register")
def register_student(student: StudentCreate):

    existing_student = students_collection.find_one(
        {"email": student.email}
    )

    if existing_student:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    student_data = student.model_dump()

    # Hash the password before storing it
    student_data["password"] = hash_password(
        student_data["password"]
    )

    try:
        result = students_collection.insert_one(student_data)

    except DuplicateKeyError:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    return {
        "message": "Student registered successfully!",
        "student_id": str(result.inserted_id)
    }


@app.post("/login")
def login_student(student: StudentLogin):

    # Find student using email
    existing_student = students_collection.find_one(
        {"email": student.email}
    )

    # Check whether student exists
    if not existing_student:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify entered password
    password_correct = verify_password(
        student.password,
        existing_student["password"]
    )

    if not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Generate login token
    access_token = create_access_token(student.email)

    return {
        "message": "Login successful!",
        "access_token": access_token,
        "token_type": "bearer"
    }


# Verify JWT token and identify logged-in student
def get_current_student(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        student_email = payload.get("sub")

        if student_email is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    # Find the student using the email from the token
    current_student = students_collection.find_one(
        {"email": student_email}
    )

    if current_student is None:
        raise HTTPException(
            status_code=401,
            detail="Student not found"
        )

    return current_student


# Get logged-in student's profile
@app.get("/profile")
def get_student_profile(
    current_student: dict = Depends(get_current_student)
):

    return {
        "message": "Student profile fetched successfully!",
        "student": {
            "id": str(current_student["_id"]),
            "full_name": current_student.get("full_name"),
            "email": current_student.get("email"),
            "college_name": current_student.get("college_name"),
            "branch": current_student.get("branch"),
            "year_of_study": current_student.get("year_of_study"),
            "skills": current_student.get("skills")
        }
    }

@app.put("/profile")
def update_student_profile(
    student: StudentUpdate,
    current_student: dict = Depends(get_current_student)
):
    update_data = {
        key: value
        for key, value in student.model_dump(exclude_unset=True).items()
        if value is not None
    }

    if not update_data:
        raise HTTPException(
            status_code=400,
            detail="No profile details provided to update"
        )

    students_collection.update_one(
        {"_id": current_student["_id"]},
        {"$set": update_data}
    )

    updated_student = students_collection.find_one(
        {"_id": current_student["_id"]}
    )

    return {
        "message": "Profile updated successfully!",
        "student": {
            "id": str(updated_student["_id"]),
            "full_name": updated_student.get("full_name"),
            "email": updated_student.get("email"),
            "college_name": updated_student.get("college_name"),
            "branch": updated_student.get("branch"),
            "year_of_study": updated_student.get("year_of_study"),
            "skills": updated_student.get("skills")
        }
    }

