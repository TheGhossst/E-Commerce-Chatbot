import os
from flask import Flask, request, jsonify, send_from_directory
from firebase_admin import credentials, firestore, initialize_app
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables
load_dotenv('../.env.local')

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Get the Firebase Admin SDK path
firebase_admin_sdk_path = os.getenv('FIREBASE_ADMIN_SDK_PATH')

if not firebase_admin_sdk_path:
    raise ValueError("FIREBASE_ADMIN_SDK_PATH is not set in the environment variables")

# Initialize Firebase
cred = credentials.Certificate(firebase_admin_sdk_path)
initialize_app(cred)
db = firestore.client()

@app.route('/')
def home():
    return "Welcome to the E-Commerce Chatbot API"

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/api/products/search', methods=['GET'])
def search_products():
    query = request.args.get('query', '').lower().strip()
    products_ref = db.collection('products')

    try:
        # Log the query for debugging
        print(f"Received query: {query}")

        # Perform case-insensitive search using name_lower field
        results = products_ref.where('name_lower', '>=', query).where('name_lower', '<=', query + '\uf8ff').limit(10).stream()

        products = []
        for doc in results:
            product = doc.to_dict()
            product['id'] = doc.id
            products.append(product)

        # If no products found, log an empty result
        if not products:
            print("No products found for the query.")

        # Return the products
        print(f"Found products: {products}")
        return jsonify(products)

    except Exception as e:
        # Log the error and return a 500 response
        print("Error occurred:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/api/products/<string:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    products_ref = db.collection('products')

    try:
        # Log the product_id for debugging
        print(f"Received product_id: {product_id}")

        # Query Firestore for the product with the given ID
        product_doc = products_ref.document(product_id).get()

        if product_doc.exists:
            product = product_doc.to_dict()
            product['id'] = product_doc.id
            print(f"Found product: {product}")
            return jsonify(product)
        else:
            print(f"No product found with ID: {product_id}")
            return jsonify({"error": "Product not found"}), 404

    except Exception as e:
        # Log the error and return a 500 response
        print("Error occurred:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
