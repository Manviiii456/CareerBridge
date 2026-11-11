
from pydantic import BaseModel, Field


class StudentCreate(BaseModel):
    full_name: str = Field(min_length=2)
    email: str
    college_name: str
    branch: str
    year_of_study: str
    skills: str
    password: str = Field(min_length=8)
class StudentLogin(BaseModel):
    email: str
    password: str

class StudentUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2)
    college_name: str | None = None
    branch: str | None = None
    year_of_study: str | None = None
    skills: str | None = None
