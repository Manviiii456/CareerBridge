
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import DuplicateKeyError

from database import client, students_collection
from models.student import StudentCreate
from models.student import StudentLogin
from security import verify_password, create_access_token
from security import hash_password

app = FastAPI(
    title="CareerBridge API",
    description="Backend API for the CareerBridge student platform",
    version="1.0.0"
)

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
