
from pymongo import MongoClient

# Connect to local MongoDB
MONGO_URL = "mongodb://localhost:27017"

client = MongoClient(MONGO_URL)

# Select CareerBridge database
db = client["careerbridge"]

# Select students registration collection
students_collection = db["students_registration"]
