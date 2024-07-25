let cart = [];
let total = 0;

function addToCart(name, price, id) {
    const quantityInput = document.querySelector(`tr[data-id="${id}"] .quantity input`);
    const quantity = parseInt(quantityInput.value);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name, price, id, quantity });
    }
    
    updateCart();
    updateCartStatus(id);
    toggleCheckout();
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${item.name} - ₹${item.price} x ${item.quantity}
            <button onclick="decreaseQuantity(${index})">-</button>
            <button onclick="increaseQuantity(${index})">+</button>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(listItem);
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    toggleCheckout();
}

function updateCartStatus(id) {
    const statusElement = document.getElementById(`status-${id}`);
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        statusElement.textContent = `In cart: ${existingItem.quantity}`;
    } else {
        statusElement.textContent = '';
    }
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    updateCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function toggleCheckout() {
    const checkoutForm = document.getElementById('checkoutForm');
    const cartMessage = document.getElementById('cartMessage');

    if (total >= 9) {
        checkoutForm.style.display = 'block';
        cartMessage.innerHTML = '<span style="color: green; background-color: white; padding: 2px;"> <b>Thank you for choosing our digital menu card! Going digital helps save trees. Please proceed to checkout; your cart is ready.</b> </span>';
    } else {
        checkoutForm.style.display = 'none';
        const amountNeeded = 99 - total;
        cartMessage.innerHTML = `<span style="color: green; background-color: white; padding: 2px;"> Fill your cart, taste the magic—delight awaits!</span>`;
    }
}

function continueShopping() {
    document.getElementById('invoice').style.display = 'none';
}

function filterItems() {
    const searchValue = document.getElementById('searchBar').value.toLowerCase();
    const items = document.querySelectorAll('.product-item');

    items.forEach(item => {
        const itemName = item.getAttribute('data-name').toLowerCase();
        if (itemName.includes(searchValue)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Function to generate the invoice
function generateInvoice() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const contact = document.getElementById('contact').value;
    const alternateContact = document.getElementById('alternateContact').value;

    // Validate required fields
    if (!name || !address || !contact) {
        alert('Please fill in all required fields.');
        return;
    }

    // Generate the HTML content for the invoice
    let invoiceContent = `
        <html>
        <head>
            <title>Invoice</title>
            <style>
                  body { font-family: Arial, sans-serif; }

        .outsideinvoice-container { width: 85%; margin: auto; padding: 10px; background-color: #fff; box-shadow: 0 0 0px rgba(0, 0, 0, 0); }

        .invoice-container { width: 80%; margin: auto; padding: 20px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
        .invoice-header { text-align: center; background-color: #4b23a0; color: white; padding: 10px 0; position: relative; }
        .invoice-header h1 { margin: 0; }
        .invoice-header img { width: 100px; position: absolute; top: 10px; right: 20px; }
        .invoice-info { display: flex; justify-content: space-between; margin-top: 20px; }
        .bill-to { background-color: #4b23a0; color: white; padding: 5px; margin-top: 20px; }
        .bill-to p { margin: 0; }
        .invoice-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .invoice-table th, .invoice-table td { border: 1px solid #4b23a0; padding: 8px; text-align: left; }
        .invoice-table th { background-color: #4b23a0; color: white; }
        .invoice-footer { text-align: right; margin-top: 20px; }
        .invoice-footer p { margin: 0; }
        .invoice-buttons { text-align: center; margin-top: 20px; }
        .invoice-buttons button { margin: 5px; padding: 10px 20px; background-color: #007bff; color: #fff; border: none; cursor: pointer; }
        .invoice-buttons button:hover { background-color: #0056b3; }
        .payment-options { text-align: center; margin-top: 20px; }
        .payment-options button { margin: 5px; padding: 10px 20px; background-color: #28a745; color: #fff; border: none; cursor: pointer; }
        .payment-options button:hover { background-color: #218838; }
        @media print {
            body * {
                visibility: hidden;
            }
            .invoice-container, .invoice-container * {
                visibility: visible;
            }
            .invoice-container {
                position: absolute;
                left: 0;
                top: 0;
            }
        }
        .invoice-logo img { 
    width: 200px; 
    position: absolute; 
    top: 2px; 
    left: 12%; 
    transform: translateX(-50%); 
}

/* Styles for the payment method */
.payment-method {
    margin-top: 10px;
    font-size: 14px;
    color: #555;
}

/* Styles for the notes */
.notes {
    font-size: 12px;
    color: #666;
    margin-top: 10px;
    text-align: left;
}
      /* General styles for the bell icon */
        .notification-icon {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #FFD700; /* Yellow background */
            color: #333;
            border: none;
            border-radius: 50%;
            padding: 15px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            z-index: 1000;
            transition: background-color 0.3s, transform 0.3s;
        }

        /* Red dot on the bell icon */
        .notification-icon::after {
            content: '';
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: red;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }

        /* Bell icon */
        .notification-icon::before {
            content: url('./images/waiter.png');
            display: block;
            width: 24px;
            height: 24px;
            margin: 0 auto;
        }

        /* General styles for the message container */
        .order-completion-message {
            position: fixed;
            bottom: 90px; /* Above the button */
            right: 40px;
            background-color: #f9f9f9;
            color: #333;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            font-size: 16px;
            font-family: Arial, sans-serif;
            z-index: 999;
            max-width: 250px;
            text-align: center;
            display: none; /* Initially hidden */
        }

     /* Container for the button */
        .whatsapp-order-button {
            position: relative;
            bottom: 20px;
            right: 20px;
            background-color: #25D366; /* WhatsApp green color */
            color: white;
            border: none;
            border-radius: 20%;
            padding: 15px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            font-size: 18px;
            cursor: pointer;
            z-index: 1000;
            transition: background-color 0.3s, transform 0.3s;
        }

        /* Hover effect */
        .whatsapp-order-button:hover {
            background-color: #128C7E; /* Darker green for hover */
            transform: scale(1.1);
        }

                 </style>
            <script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
        </head>
        <body>
         <div class="outsideinvoice-container">
            <div class="invoice-container">
                <div class="invoice-header">
                    <h1>Restaurant Bill</h1>
                    
                   
                </div>
                <div class="invoice-logo">
                 
                 <img src="/images/logo2.png" width="100" height="auto" style="position: relative;" alt="Park Queen Hotel & Resorts Logo">
                 </div>   
                 <div class="invoice-info">
                
                <p>Park Queen Hotel & Resorts</p>
              
                <p>🏠 Opp Devi Lal Park, <br> Delhi by Pass Road, <br>Rohtak, Haryana</p>
                <p>📞 +91-1262-469242 </p>
                <p>📧 fom@parkqueenhotels.com</p>
            </div>
                  <div class="invoice-info">
                  <p>GSTIN No: </p>
                        <p>Invoice No: ${Math.floor(Math.random() * 100000)}</p>
                        <p>Date: ${new Date().toLocaleDateString()}</p>
                        <p>Time: ${new Date().toLocaleTimeString()}</p>
                    </div>
            <div class="bill-to">
                <h3>Bill To:</h3>
                <p>Name: ${name}</p>
                <p>Room number.: ${address}</p>
                <p>📞 ${contact}</p>
                <p> ${alternateContact}</p>
             </div>   
  
                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>Goods Description</th>
                            <th>ID</th>
                            <th>Quantity</th>
                            <th>Price (₹)</th>
                            <th>Tax (5%) (₹)</th>
                            <th>Total (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    let subtotal = 0;
    cart.forEach(cartItem => {
        const itemTotal = cartItem.price * cartItem.quantity;
        const tax = cartItem.price * 0.05;
        const totalWithTax = itemTotal + (tax * cartItem.quantity);
        subtotal += itemTotal;

        invoiceContent += `
            <tr>
                <td>${cartItem.name}</td>
                <td>${cartItem.id}</td>
                <td>${cartItem.quantity}</td>
                <td>₹${cartItem.price.toFixed(2)}</td>
                <td>₹${(tax * cartItem.quantity).toFixed(2)}</td>
                <td>₹${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    const taxAmount = subtotal * 0.05;
    const grandTotal = subtotal + taxAmount;

    invoiceContent += `
                    <tr>
                        <th colspan="5">Subtotal</th>
                        <td>₹${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th colspan="5">Tax (5%)</th>
                        <td>₹${taxAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th colspan="5"><b>Grand Total</b></th>
                        <td><b>₹${grandTotal.toFixed(2)}</b></td>
                    </tr>
                </tbody>
            </table>
           
            </div>
            <div class="invoice-buttons">
                <button onclick="window.print()">Print Invoice</button>
                
                <button onclick="backToShopping()">Back to Shopping</button>
            </div>
            <div class="payment-options">
                <button onclick="toggleContent()">Make Payment: ₹${grandTotal} (limited-time offer)</button>
                <div class="payment-content" style="display: none;">
                    <h3>Choose Your Payment Method</h3>
                    <div>
                        <input type="radio" id="upi" name="paymentMethod" value="UPI">
                        <label for="upi">Pay via UPI</label><br>
                        <input type="radio" id="cod" name="paymentMethod" value="COD">
                        <label for="cod">Pay via COD</label>
                    </div>
                    <div id="upiDetails" style="display: none;">
                        <h4>Send Money via UPI</h4>
                        <p>Scan the QR code below or click the button to make a payment of ₹${grandTotal}:</p>
                        <div id="qrcode"></div>
                        <a href="upi://pay?pa=9817409607@ybl&pn=ShabariDelights&am=${grandTotal}&tn=Payment for Food" class="c5">Click here to pay via UPI</a>
                        <p>📲 After Payment:</p>
                        <p>💳 <strong>Please share a screenshot of your payment confirmation on WhatsApp.<br> Our team will contact you within 1 hour of payment receipt. Rest assured, your funds are secure with us.</strong></p>
                    </div>
                </div>
            </div>
             <script>
        // JavaScript to toggle the visibility of the message
        function toggleMessage() {
            var message = document.getElementById('order-message');
            if (message.style.display === 'none' || message.style.display === '') {
                message.style.display = 'block';
            } else {
                message.style.display = 'none';
            }
        }
    </script>
    <!-- Notification Icon -->
    <button class="notification-icon" onclick="toggleMessage()"></button>
           
    <!-- Order completion message -->
    <div class="order-completion-message" id="order-message">
        <p>This is the last step to complete your order! <br>
        For convenience, we take orders via WhatsApp. Click the button below to proceed.</p>
        
        <!-- Payment method instruction -->
        <p class="payment-method">Please select a payment method to proceed.</p>

        <!-- Additional notes -->
        <p class="notes">
            * Government taxes extra as per actual<br>
            * In case of any allergies, kindly inform your server before.<br>
            * Good things come to those who wait! Kindly allow us 15-20 minutes to serve your food fresh!
        </p>
    </div>
            <button class="whatsapp-order-button" onclick="sendOrderOnWhatsApp()"><span>Send Order on WhatsApp</span></button>
            <script>
                function toggleContent() {
                    const hiddenContent = document.querySelector('.payment-content');
                    hiddenContent.style.display = hiddenContent.style.display === 'none' ? 'block' : 'none';
                }

                document.querySelectorAll('input[name="paymentMethod"]').forEach((elem) => {
                    elem.addEventListener("change", function(event) {
                        const upiDetails = document.getElementById('upiDetails');
                        if (event.target.value === 'UPI') {
                            upiDetails.style.display = 'block';
                        } else {
                            upiDetails.style.display = 'none';
                        }
                    });
                });

                const qrData = \`upi://pay?pa=9817409607@ybl&pn=ShabariDelights&am=${grandTotal}&tn=Payment for Food\`;
                new QRCode(document.getElementById('qrcode'), {
                    text: qrData,
                    width: 200,
                    height: 200,
                });

                function sendOrderOnWhatsApp() {
                    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
                    const message = \`Order Details:\\nName: ${name}\\nRoom Number: ${address}\\nContact: ${contact}\\nTotal: ₹${grandTotal}\\nItems: ${cart.map(item => item.name + ' - ₹' + item.price + ' Qty: ' + item.quantity).join(', ')}\\nPayment Method: \${paymentMethod}\\nPlease share the payment confirmation.\`;

                    const url = \`https://wa.me/919817409607?text=\${encodeURIComponent(message)}\`;
                    window.open(url, '_blank');
                }

                function backToShopping() {
                    window.location.href = 'index.html';
                }
            </script>
            </div>
        </body>
        </html>
    `;

    const newWindow = window.open();
    newWindow.document.write(invoiceContent);
    newWindow.document.close();
}

function openModal(imageSrc) {
    var modal = document.getElementById('zoomModal');
    var modalImg = document.getElementById('img01');
    modal.style.display = "block";
    modalImg.src = imageSrc;
}

function closeModal() {
    var modal = document.getElementById('zoomModal');
    modal.style.display = "none";
}

function showInputField() {
    const diningOption = document.getElementById('diningOption').value;
    const responseGroup = document.getElementById('responseGroup');
    const responseLabel = document.getElementById('responseLabel');
    const address = document.getElementById('address');

    responseGroup.classList.add('hidden');

    if (diningOption) {
        responseGroup.classList.remove('hidden');

        if (diningOption === 'package') {
            responseLabel.innerText = 'Enter your room number:';
            address.setAttribute('name', 'address');
            address.setAttribute('placeholder', 'Enter your room number');
        } else if (diningOption === 'eat') {
            responseLabel.innerText = 'Enter your room number:';
            address.setAttribute('name', 'tableNumber');
            address.setAttribute('placeholder', 'Enter your room number');
        }
    }
}
