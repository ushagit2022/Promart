from flask import Flask, jsonify,request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import razorpay

app = Flask(__name__)
CORS(app)

# PostgreSQL connection URI: update username and host as needed
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:root@localhost/productsmart'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


# Razorpay usage
# Replace with your Razorpay API keys
RAZORPAY_KEY_ID = 4444
RAZORPAY_KEY_SECRET = 5555

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))


class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    # subcategory_id = db.Column(db.Integer, db.ForeignKey('subcategories.id'))
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10,2), nullable=False)
    image_url = db.Column(db.Text)
    category_id = db.Column(db.Integer)
    subcategory_id = db.Column(db.Integer)
    stock = db.Column(db.Integer)

@app.route("/product", methods=['POST'])
def set_product():
    data = request.json
    productDetails = data.get('product', {})
    name = productDetails.get('productName')
    description = productDetails.get('productDescription')
    price = productDetails.get('productPrice')
    stock = productDetails.get('productStock')
    image_url = productDetails.get("productImage")
    category_id = productDetails.get("productCategory")
    subcategory_id = productDetails.get("productSubcategory")

    
    # Basic validation
    if not name or not price or not stock or not category_id:
        return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400
    if not image_url or not (image_url.lower().endswith('.jpg') or image_url.lower().endswith('.jpeg')):
        return jsonify({'status': 'error', 'message': 'Image must be a .jpg or .jpeg file'}), 400

    productCreated = Product(
        name=name,
        description=description,
        image_url=image_url,
        price=price,
        stock=stock,
        category_id=category_id,
        subcategory_id=subcategory_id if subcategory_id else None,
        # created_at=datetime.utcnow()
    )
    db.session.add(productCreated)
    db.session.commit()
    return jsonify({'message': 'Successfully created new Product!', 'product_id': productCreated.id})

# Product Get

# to get the User details
@app.route('/product', methods=['GET'])
def get_product():
    products = Product.query.all()
    products_list = [
        {
            "id":p.id,
            "name":p.name,
            "description":p.description,
            "image_url":p.image_url,
            "price":p.price,
            "stock":p.stock,
            "category_id":p.category_id,
            "subcategory_id":p.subcategory_id

        }
        for p in products
    ]
    return jsonify(products_list)

# Product Put
# editing api
@app.route('/product/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.json
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'status': 'error', 'message': 'Product not found'}), 404

    product.name = data.get('name', product.name)
    product.description = data.get('email', product.description)
    product.price = data.get('mobile', product.price)
    
    product.stock = data.get('location', product.stock)
    product.category = data.get('pincode', product.category)
    # print(product.location,"product location",product.pincode,"Pincode")
    product.subcategory = data.get('address', product.subcategory)
    product.imimage_urlage = data.get('is_admin', product.image_url)
    # product.created_at =  datetime.utcnow()

    db.session.commit()

    product_data = {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "stock": product.stock,
        "category_id": product.category_id,
        "image_url": product.image_url,
        "subcategory_id": product.subcategory_id,
        # "created_at": created_at
    }
    return jsonify(product_data)

# Product Delete
# to delete product 
@app.route('/product/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'success': False, 'error': 'User not found'}), 404
      
      # Delete related cart_items first
    CartItem.query.filter_by(product_id=product_id).delete()
    db.session.delete(product)
    db.session.commit()

    product_data = {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "stock": product.stock,
        "category_id": product.category_id,
        "image_url": product.image_url,
        "subcategory_id": product.subcategory_id,
        # "created_at": created_at
    }
    return jsonify(product_data)
    # return jsonify({'success': True, 'message': f'User {user_id} deleted'})
# ---end of Product--

class User(db.Model):
    __tablename__ = 'users'  # Explicitly set table name
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String)
    mobile = db.Column(db.String, unique=True)  # <-- Add this line
    # password = db.Column(db.String)
    is_admin = db.Column(db.Boolean)
    created_at = db.Column(db.TIMESTAMP)
    auth0_id = db.Column(db.String, unique=True)
    location = db.Column(db.String) 
    pincode = db.Column(db.String)
    address =db.Column(db.String)

# Auth user Authentication
# @app.route('/api/users', methods=['POST'])
# def sync_user():
#     # if request.method == 'OPTIONS':
#     #     print(request.json(),"request for users")
#     #     return '', 200
#     print(request,"request for users")
#     data = request.json
#     email = data.get('email')
#     name = data.get('name')
#     auth0_id = data.get('auth0_id')
#     is_admin= data.get('is_admin')
#     created_at = data.get("created_at")


#     if not auth0_id or not email:
#         return jsonify({'status': 'error', 'message': 'Missing auth0_id or email'}), 400

#     user = User.query.filter_by(auth0_id=auth0_id).first()
#     if not user:
#         user = User(email=email, name=name, auth0_id=auth0_id, is_admin = is_admin,created_at = created_at)
#         db.session.add(user)
#         db.session.commit()
#         return jsonify({'status': 'created', 'user_id': user.id})
    
    
#     else:
#         # Optionally update user info
#         user.name = name
#         user.email = email
#         user.created_at = datetime.utcnow()
#         db.session.commit()
#         return jsonify({'status': 'updated', 'user_id': user.id})
    
# editing api
@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    user = User.query.get(user_id)
    if not user:
        return jsonify({'status': 'error', 'message': 'User not found'}), 404

    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    user.mobile = data.get('mobile', user.mobile)
    
    user.location = data.get('location', user.location)
    user.pincode = data.get('pincode', user.pincode)
    # print(user.location,"user location",user.pincode,"Pincode")
    user.address = data.get('address', user.address)
    user.is_admin = data.get('is_admin', user.is_admin)
    user.created_at =  datetime.utcnow()

    db.session.commit()

    user_data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "mobile": user.mobile,
        "location": user.location,
        "pincode": user.pincode,
        "address": user.address,
        "is_admin": user.is_admin,
        # "created_at": created_at
    }
    return jsonify(user_data)

# to delete user 

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404

    db.session.delete(user)
    db.session.commit()

    user_data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "mobile": user.mobile,
        "location": user.location,
        "pincode": user.pincode,
        "address": user.address,
        "is_admin": user.is_admin,
        # "created_at": created_at
    }
    return jsonify(user_data)
    # return jsonify({'success': True, 'message': f'User {user_id} deleted'})


# to get the User details
@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "mobile": u.mobile,
            "is_admin": u.is_admin,
            "location": u.location,
            "address" : u.address,
            "pincode": u.pincode,


            # "created_at": u.created_at,
            # add other fields as needed
        }
        for u in users
    ]
    return jsonify(users_list)

# checking the user email or mobile is exist then update the users table with that entry
@app.route('/api/users', methods=['POST'])
def sync_user():
    data = request.json
    email = data.get('email')
    name = data.get('name')
    mobile = data.get('mobile')
    # auth0_id = data.get('auth0_id')
    is_admin = data.get('is_admin')
    created_at = data.get("created_at")

    # Check if user exists by email or mobile
    user = None
    if email:
        user = User.query.filter_by(email=email).first()
    if not user and mobile:
        user = User.query.filter_by(mobile=mobile).first()

    if user:
        # Update existing user
        user.name = name or user.name
        # user.auth0_id = auth0_id or user.auth0_id
        user.is_admin = is_admin if is_admin is not None else user.is_admin
        user.created_at = created_at or user.created_at
        db.session.commit()
        return jsonify({'status': 'updated', 'user_id': user.id})
    else:
        # Create new user
        user = User(
            email=email,
            name=name,
            mobile=mobile,
            # auth0_id=auth0_id,
            is_admin=is_admin,
            created_at=created_at
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({'status': 'created', 'user_id': user.id})



# Inserting the login details to user table when user click on login for the first time with new data(mobile number)
# @app.route('/api/login', methods=['POST'])
# def login_user():
#     data = request.json
#     mobile = data.get('mobile')
#     email = data.get('email')
#     # name = data.get('name')
#     is_admin = data.get('is_admin', False)
#     # created_at = datetime.utcnow()

#     if not mobile:
#         return jsonify({'status': 'error', 'message': 'Mobile number is required'}), 400

#     # Check if user already exists by mobile
#     user = User.query.filter_by(mobile=mobile).first()
#     if user:
#         # Optionally update name or admin status if needed
#         # user.name = name or user.name
#         user.email = email
#         user.is_admin = is_admin if is_admin is not None else user.is_admin
#         db.session.commit()
#         return jsonify({'status': 'success', 'user_id': user.id, 'mobile': user.mobile, 'is_admin': user.is_admin})
#     else:
#         # Create new user
#         user = User(
#             mobile=mobile,
#             email : email,
#             # name=name,
#             is_admin=is_admin,
#             created_at=created_at
#         )
#         db.session.add(user)
#         db.session.commit()
#         return jsonify({'status': 'created', 'user_id': user.id, 'mobile': user.mobile, 'is_admin': user.is_admin})

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    print(data,"data from react with mobile")
    mobile = data.get('mobile')
    email = data.get('email')
    # name = data.get('name')
    is_admin = data.get('is_admin', False)
    created_at = datetime.utcnow()

    if not mobile and not email:
        return jsonify({'status': 'error', 'message': 'Mobile number or email is required'}), 400

    # Check if user already exists by mobile or email
    user = None
    if mobile:
        user = User.query.filter_by(mobile=mobile).first()
    if not user and email:
        user = User.query.filter_by(email=email).first()

    if user:
        # Optionally update name, email, or admin status if needed
        # user.name = name or user.name
        user.email = email or user.email
        user.mobile = mobile or user.mobile
        user.is_admin = is_admin if is_admin is not None else user.is_admin
        db.session.commit()
        return jsonify({'status': "success","messsage":'Successfully Updated the details !', 'user_id': user.id, 'mobile': user.mobile, 'email': user.email, 'is_admin': user.is_admin})
    else:
        # Create new user
        user = User(
            mobile=mobile,
            email=email,
            # name=name,
            is_admin=is_admin,
            created_at=created_at
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({'status': "created","message": 'Successfully Created new User Details!', 'user_id': user.id, 'mobile': user.mobile, 'email': user.email, 'is_admin': user.is_admin})

@app.route('/api/validate-email', methods=['POST'])
def validate_email():
    data = request.json
    email = data.get('email')
    exists = False
    if email:
        user = User.query.filter_by(email=email).first()
        exists = user is not None
    return jsonify({'exists': exists})

# class Product(db.Model):
#     __tablename__ = 'products'
#     id = db.Column(db.Integer, primary_key=True)
#     # subcategory_id = db.Column(db.Integer, db.ForeignKey('subcategories.id'))
#     name = db.Column(db.String, nullable=False)
#     description = db.Column(db.Text)
#     price = db.Column(db.Numeric(10,2), nullable=False)
#     image_url = db.Column(db.Text)
#     category_id = db.Column(db.Integer)
#     subcategory_id = db.Column(db.Integer)
#     stock = db.Column(db.Integer)

@app.route('/api/productslist', methods=['GET'])
def get_products():
    products = Product.query.all()
    result = [
        {
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': float(p.price),
            'image_url': p.image_url,
            'category_id': p.category_id,
            'subcategory_id':p.subcategory_id,
            'stock': p.stock
        }
        for p in products
    ]
    return jsonify(result)

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

@app.route('/category',methods=['POST'])
def send_category():
    data = request.get_json()
    name = data.get('name')

    categoryCreated = Category(
        name=name,
    )
    db.session.add(categoryCreated)
    db.session.commit()
    return jsonify({'message': 'New Category is created Successfully!', 'category_id': categoryCreated.id})
    

@app.route('/api/categorylist',methods=['GET'])
def get_categories():
    categories = Category.query.all()
    result = [{
        'id': c.id,
        'name':c.name
    } for c in categories
    ]
    return jsonify(result) 

class Subcategory(db.Model):
    __tablename__ = 'subcategories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    category_id = db.Column(db.String,foriegn_key =True )

@app.route('/subcategory',methods=['POST'])
def send_subcategory():
    data = request.get_json()
    name = data.get('name')
    category_id =data.get('category_id')

    subcategoryCreated = Subcategory(
        name=name,
        category_id = category_id
    )
    db.session.add(subcategoryCreated)
    db.session.commit()
    return jsonify({'message': 'New Sub Category is created Successfully!', 'category_id': subcategoryCreated.id})

@app.route('/api/subcategorylist',methods=['GET'])
def get_subcategories():
    subcategories = Subcategory.query.all()
    result = [{
        'id': c.id,
        'name':c.name,
        'category_id': c.category_id
    } for c in subcategories
    ]
    return jsonify(result) 

# class Cart(db.Model):
#     __tablename__ = 'cart'
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, nullable=True)  # or False if required
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    
# @app.route('/api/create_cart', methods=['POST'])
# def create_cart():
#     cart = Cart.query.all()
#     result = [
#         {
#             'id': c.id,
#             'user_id': c.user_id,
#             'created_at': c.created_at,
           
#         }
#         for c in cart
#     ]
#     data = request.get_json()
#     user_id = data.get('user_id')  # Get user_id from request if available
    
#     new_cart = Cart(user_id=user_id)
#     db.session.add(new_cart)
#     db.session.commit()
  

#     return jsonify({'cart_id': new_cart.id})

# to maintain quantity in the Cart table 
# class CartAction(db.Model):
#      __tablename__ = 'cart_items'
#      id = db.Column(db.Integer, primary_key=True)
#      cart_id = db.Column(db.Integer)
#      product_id=db.Column(db.Integer)
#      quantity = db.Column(db.Integer)

# cart_bp = Blueprint('cart', __name__)

# @app.route('/api/cart_items', methods=['POST'])
# def update_cart():
#     data = request.get_json()
#     cart_id = data.get('cartId')
#     product_id = data.get('productId')
#     quantity = data.get('quantity', 1)
#     action = data.get('action')

#     cart_item = CartAction.query.filter_by(cart_id=cart_id, product_id=product_id).first()

#     if action == 'increment':
#         if cart_item:
#             cart_item.quantity += 1
#         else:
#             cart_item = CartAction(cart_id=cart_id, product_id=product_id, quantity=1)
#             db.session.add(cart_item)
#     elif action == 'decrement':
#         if cart_item and cart_item.quantity > 1:
#             cart_item.quantity -= 1
#         elif cart_item:
#             db.session.delete(cart_item)
#     elif action == 'add':
#         if cart_item:
#             cart_item.quantity = quantity
#         else:
#             cart_item = CartAction(cart_id=cart_id, product_id=product_id, quantity=quantity)
#             db.session.add(cart_item)
#     elif action == 'remove':
#         if cart_item:
#             db.session.delete(cart_item)
#     else:
#         return jsonify({'success': False, 'error': 'Invalid action'}), 400

#     try:
#         cart = Cart.query.filter_by(id=cart_id).first()
#         if not cart:
#         # Create a new cart (add user_id or other fields as needed)
#             cart = Cart(id=cart_id)
#             db.session.add(cart)
#             db.session.commit()

#     except Exception as e:
#         db.session.rollback()
#         print("DB Commit Error:", e)
#         return jsonify({'success': False, 'error': str(e)}), 500

#     # Fetch and return the updated cart items for this cart_id
#     updated_cart = CartAction.query.filter_by(cart_id=cart_id).all()
#     cart_items = [
#         {
#             'id': item.id,
#             'cart_id': item.cart_id,
#             'product_id': item.product_id,
#             'quantity': item.quantity
#         }
#         for item in updated_cart
#     ]

#     return jsonify(cart_items)


# def place_order(session: Session, user_id, cart_items, shipping_info, payment_info):
#     try:
#         # 1. Create Order
#         new_order = Order(user_id=user_id, shipping_info=shipping_info, payment_info=payment_info)
#         session.add(new_order)
#         session.flush()  # Get new_order.id

#         # 2. Create Order Items
#         for item in cart_items:
#             order_item = OrderItem(
#                 order_id=new_order.id,
#                 product_id=item['product_id'],
#                 quantity=item['quantity'],
#                 price=item['price']
#             )
#             session.add(order_item)

#         # 3. Optionally update user info
#         # user = session.query(User).get(user_id)
#         # user.last_order_id = new_order.id

#         # 4. Clear cart
#         session.query(CartItem).filter_by(user_id=user_id).delete()
#         session.query(Cart).filter_by(user_id=user_id).delete()

#         session.commit()
#         return True
#     except Exception as e:
#         session.rollback()
#         raise e

class Cart(db.Model):
    __tablename__ = 'cart'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

class CartItem(db.Model):
    __tablename__ = 'cart_items'
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'), nullable=False)
    product_id = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    
# cart_bp = Blueprint('cart', __name__)

@app.route('/cart/checkout', methods=['POST'])
def checkout():
    data = request.get_json()
    user_id = data['user_id']
    items = data['items']  # List of dicts: [{product_id, quantity}, ...]

    # 1. Create a new cart
    new_cart = Cart(user_id=user_id, created_at=datetime.utcnow())
    db.session.add(new_cart)
    db.session.flush()  # Get new_cart.id before commit

    # 2. Add cart items
    for item in items:
        cart_item = CartItem(
            cart_id=new_cart.id,
            product_id=item['id'],
            quantity=item['cartQuantity']
        )
        db.session.add(cart_item)

    db.session.commit()
    return jsonify({"cart_id": new_cart.id,"message":"Cart Updated Successfully!"})

# After payment success (e.g., in your payment webhook or callback handler):
def handle_payment_success(user_id, cart_id, payment_id, total):
    # 1. Get cart items
    cart_items = db.session.execute(
        "SELECT product_id, quantity, price FROM cart_items WHERE cart_id = :cart_id",
        {"cart_id": cart_id}
    ).fetchall()

    # 2. Insert into orders table
    order = db.session.execute(
        """
        INSERT INTO orders (user_id, total, status, created_at, delivery_status, payment_status, payment_id)
        VALUES (:user_id, :total, :status, NOW(), :delivery_status, :payment_status, :payment_id)
        RETURNING id
        """,
        {
            "user_id": user_id,
            "total": total,
            "status": "Confirmed",
            "delivery_status": "Order Placed",
            "payment_status": "Paid",
            "payment_id": payment_id
        }
    ).fetchone()
    order_id = order.id

    # 3. Insert into order_items table
    for item in cart_items:
        db.session.execute(
            """
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES (:order_id, :product_id, :quantity, :price)
            """,
            {
                "order_id": order_id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": item.price
            }
        )

    db.session.commit()

# orders api 
@app.route('/api/orders', methods=['POST'])
def create_order_db():
    data = request.get_json()
    user_id = data['user_id']
    total = data['total']
    payment_id = data['payment_id']
    items = data['items']  # [{product_id, quantity, price}, ...]

    # 1. Create order
    order = Order(
        user_id=user_id,
        total=total,
        status="Confirmed",
        created_at=datetime.utcnow(),
        delivery_status="Order Placed",
        payment_status="Paid",
        payment_id=payment_id
    )
    db.session.add(order)
    db.session.flush()  # Get order.id before commit

    # 2. Create order items
    for item in items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item['product_id'],
            quantity=item['quantity'],
            price=item['price']
        )
        db.session.add(order_item)

    db.session.commit()
    return jsonify({"order_id": order.id})


@app.route('/api/razorpay_order', methods=['POST'])
def create_order():
    data = request.json
    amount = data.get('amount')
    razorpay_order = client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": 1
    })
    return jsonify(razorpay_order)


if __name__ == '__main__': 
    app.run(debug=True)