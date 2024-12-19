from firebase_admin import firestore, initialize_app, credentials

# Initialize Firebase Admin SDK
cred = credentials.Certificate("D:/code/nextjs/E-Commerce-Chatbot/firebase-admin-sdk.json")
initialize_app(cred)
db = firestore.client()

# Update all products
def update_name_lower_field():
    products_ref = db.collection('products')
    products = products_ref.stream()

    for doc in products:
        product_data = doc.to_dict()
        if 'name' in product_data:
            name_lower = product_data['name'].lower()
            products_ref.document(doc.id).update({'name_lower': name_lower})
            print(f"Updated {doc.id} with name_lower: {name_lower}")

if __name__ == "__main__":
    update_name_lower_field()
