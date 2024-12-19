import random
import uuid
from firebase_admin import firestore, initialize_app, credentials

# Initialize Firebase Admin SDK
cred = credentials.Certificate("D:/code/nextjs/E-Commerce-Chatbot/firebase-admin-sdk.json")
initialize_app(cred)
db = firestore.client()

# Categories and sample data for product generation
CATEGORIES = ["Electronics", "Clothing", "Home & Kitchen", "Sports", "Toys", "Books"]
SAMPLE_PRODUCTS = [
    "Wireless Mouse", "Gaming Keyboard", "Smartphone", "Laptop", "Headphones",
    "Bluetooth Speaker", "Smartwatch", "Vacuum Cleaner", "Air Fryer", "Electric Kettle",
    "Sneakers", "T-Shirt", "Jeans", "Jacket", "Backpack", "Sunglasses",
    "Camping Tent", "Hiking Boots", "Basketball", "Dumbbells", "Yoga Mat",
    "Lego Set", "Toy Car", "Board Game", "Puzzle", "Action Figure",
    "Fiction Book", "Cookbook", "Notebook", "Children's Storybook", "Educational Book"
]

def delete_products():
    """Deletes all documents in the 'products' collection."""
    products_ref = db.collection('products')
    docs = products_ref.stream()
    for doc in docs:
        print(f"Deleting product with ID: {doc.id}")
        doc.reference.delete()

def generate_product():
    """Generates a random product."""
    category = random.choice(CATEGORIES)
    name = random.choice(SAMPLE_PRODUCTS)
    return {
        "category": category,
        "name": name,
        "name_lower": name.lower(),
        "description": f"A high-quality {name.lower()} in the {category} category.",
        "price": round(random.uniform(10.0, 500.0), 2),
        "stock": random.randint(0, 100),
        "id": str(uuid.uuid4())
    }

def add_products(count=100):
    """Adds 'count' products to the 'products' collection."""
    products_ref = db.collection('products')
    for _ in range(count):
        product = generate_product()
        products_ref.document(product["id"]).set(product)
        print(f"Added product: {product['name']}")

if __name__ == "__main__":
    print("Deleting existing products...")
    delete_products()
    print("Adding new products...")
    add_products(100)
    print("Completed!")
