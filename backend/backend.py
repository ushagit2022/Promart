from flask import Flask, jsonify,request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)

# PostgreSQL connection URI: update username and host as needed
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:root@localhost/productsmart'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Example Product model
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    price = db.Column(db.Float)

# @app.route("/products", methods=['GET'])
# def get_products():
#     products = Product.query.all()
#     result = [{"id": p.id, "name": p.name, "price": p.price} for p in products]
#     return jsonify(result)

class User(db.Model):
    __tablename__ = 'users'  # Explicitly set table name
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String)
    # password = db.Column(db.String)
    is_admin = db.Column(db.Boolean)
    created_at = db.Column(db.TIMESTAMP)
    auth0_id = db.Column(db.String, unique=True) 

@app.route('/api/users', methods=['POST'])
def sync_user():
    # if request.method == 'OPTIONS':
    #     print(request.json(),"request for users")
    #     return '', 200
    print(request,"request for users")
    data = request.json
    email = data.get('email')
    name = data.get('name')
    auth0_id = data.get('auth0_id')
    is_admin= data.get('is_admin')
    created_at = data.get("created_at")


    if not auth0_id or not email:
        return jsonify({'status': 'error', 'message': 'Missing auth0_id or email'}), 400

    user = User.query.filter_by(auth0_id=auth0_id).first()
    if not user:
        user = User(email=email, name=name, auth0_id=auth0_id, is_admin = is_admin,created_at = created_at)
        db.session.add(user)
        db.session.commit()
        return jsonify({'status': 'created', 'user_id': user.id})
    
    
    else:
        # Optionally update user info
        user.name = name
        user.email = email
        db.session.commit()
        return jsonify({'status': 'updated', 'user_id': user.id})
    
@app.route('/api/validate-email', methods=['POST'])
def validate_email():
    data = request.json
    email = data.get('email')
    exists = False
    if email:
        user = User.query.filter_by(email=email).first()
        exists = user is not None
    return jsonify({'exists': exists})

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10,2), nullable=False)
    image_url = db.Column(db.Text)
    category_id = db.Column(db.Integer)
    stock = db.Column(db.Integer)

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
            'stock': p.stock
        }
        for p in products
    ]
    return jsonify(result)

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    

@app.route('/api/categorylist',methods=['GET'])
def get_categories():
    categories = Category.query.all()
    result = [{
        'id': c.id,
        'name':c.name
    } for c in categories
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

@app.route('/api/cart/checkout', methods=['POST'])
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
    return jsonify({"cart_id": new_cart.id})

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
def create_order():
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


if __name__ == '__main__': 
    app.run(debug=True)