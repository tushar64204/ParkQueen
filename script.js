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

    if (total >= 99) {
        checkoutForm.style.display = 'block';
        cartMessage.innerHTML = '<span style="color: green; background-color: white; padding: 2px;"> <b> Congratulations! Your cart total exceeds ₹99. Please proceed to checkout.</b> </span>';
    } else {
        checkoutForm.style.display = 'none';
        const amountNeeded = 99 - total;
        cartMessage.innerHTML = `<span style="color: green; background-color: white; padding: 2px;"> Add ₹${amountNeeded.toFixed(2)}  more to your cart to proceed to checkout.</span>`;
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
                /* Styles for the invoice */
                body { font-family: Arial, sans-serif; }
                .invoice-container { width: 80%; margin: auto; padding: 20px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                .invoice-header { text-align: center; }
                .invoice-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .invoice-table th, .invoice-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .invoice-footer { text-align: right; margin-top: 20px; }
                .invoice-buttons { text-align: center; margin-top: 20px; }
                .invoice-buttons button { margin: 5px; padding: 10px 20px; background-color: #007bff; color: #fff; border: none; cursor: pointer; }
                .invoice-buttons button:hover { background-color: #0056b3; }
                .payment-options { text-align: center; margin-top: 20px; }
                .payment-options button { margin: 5px; padding: 10px 20px; background-color: #28a745; color: #fff; border: none; cursor: pointer; }
                .payment-options button:hover { background-color: #218838; }
            </style>
            <!-- Include QR code library -->
            <script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
        </head>
        <body>
            <div class="invoice-container">
                <div class="invoice-header">
                    <h1>Shabari Delights Restaurant</h1>
                    <img src="/images/logo.png" alt="Shabari Delights Restaurant Logo" width="100"><br>
                    <h3>Invoice</h3>
                </div>
                   <h1>Customer Details</h1>
                <p>Name: ${name}</p>
                <p>Address: ${address}</p>
                <p>Contact Number: ${contact}</p>
                <p>Alternate Contact Number: ${alternateContact}</p>
                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>ID</th>
                            <th>Quantity</th>
                            <th>Price (₹)</th>
                            
                        </tr>
                    </thead>
                    <tbody>
    `;

    // Add cart items to the invoice content
    cart.forEach(cartItem => {
        invoiceContent += `
            <tr>
                <td>${cartItem.name}</td>
                <td>${cartItem.id}</td>
                <td>${cartItem.quantity}</td>
                <td>₹${cartItem.price}</td>
                
            </tr>
        `;
    });

    // Add total to the invoice content
    invoiceContent += `
                    <tr>
                        <th colspan="3">Total</th>
                        <td>₹${total}</td>
                    </tr>
                </tbody>
            </table>
            <div class="invoice-footer">
            <h1>Shop Details</h1>
                <p>Shop Owner: Tushar</p>
                <p>Address: Rohtak, Haryana</p>
                <p>Contact: 9817409607</p>
                <p>Alternate Contact: 9992659320</p>
            </div>
            <div class="invoice-buttons">
                <button onclick="window.print()">Print Invoice</button>
                <button onclick="backToShopping()">Back to Shopping</button>
               
            </div>
          <div class="payment-options">
    <button onclick="toggleContent()">Make Payment: ₹${total} (limited-time offer)</button>
    <div class="payment-content" style="display: none;">
        <h1>Choose Your Payment Method</h1>
        <div>
            <input type="radio" id="upi" name="paymentMethod" value="UPI">
            <label for="upi">Pay via UPI</label><br>
            <input type="radio" id="cod" name="paymentMethod" value="COD">
            <label for="cod">Pay via COD</label>
        </div>
        <div id="upiDetails" style="display: none;">
            <h2>Send Money via UPI</h2>
            <p>Scan the QR code below or click the button to make a payment of ₹${total}:</p>
            <div id="qrcode"></div>
            <a href="upi://pay?pa=9817409607@ybl&pn=PaperPalace&am=${total}&tn=Payment for Stationery" class="c5">Click here to pay via UPI</a>
            <p>📲 After Payment:</p>
            <p>💳 <strong>Please share a screenshot of your payment confirmation on WhatsApp.<br> Our team will contact you within 1 hour of payment receipt. Rest assured, your funds are secure with us.</strong></p>
        </div>
    </div>
</div>
<style>
button {
    background-color: #4CAF50; /* Green background */
    color: white; /* White text */
    border: 3px solid #4CAF50; /* Green border */
    padding: 10px 20px; /* Padding around text */
    font-size: 20px; /* Font size */
    cursor: pointer; /* Pointer cursor on hover */
    border-radius: 10px; /* Rounded corners */
}

button:hover {
    background-color: #45a049; /* Darker green on hover */
    border-color: #45a049; /* Darker green border on hover */
}
    .whatsapp-order-button {
    background-color: #25d366; /* WhatsApp green */
    color: white;
    font-size: 18px; /* Increase the font size */
    padding: 15px 30px; /* Increase the padding */
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.whatsapp-order-button:hover {
    background-color: #1ebc5a; /* Darker green on hover */
    transform: scale(1.05); /* Slightly increase size on hover */
}

.whatsapp-order-button:active {
    background-color: #128c4c; /* Even darker green when clicked */
    transform: scale(0.95); /* Slightly decrease size when clicked */
}

</style>
<button class="whatsapp-order-button" onclick="sendOrderOnWhatsApp()">Send Order on WhatsApp</button>



<script>
    // Function to toggle the hidden payment content
    function toggleContent() {
        const hiddenContent = document.querySelector('.payment-content');
        hiddenContent.style.display = hiddenContent.style.display === 'none' ? 'block' : 'none';
    }

    // Listen for changes in the payment method selection
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

    // Generate the QR code for UPI payment
    const upiId = '9817409607@ybl';
    const amount = '${total}';
    const transactionNote = 'Payment for Stationery';
    const qrData = \`upi://pay?pa=\${upiId}&pn=PaperPalace&am=\${amount}&tn=\${transactionNote}\`;
    new QRCode(document.getElementById('qrcode'), {
        text: qrData,
        width: 200,
        height: 200,
    });

  
    // Function to send order details on WhatsApp
    function sendOrderOnWhatsApp() {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        const message = \`Order Details:\\nName: ${name}\\nAddress: ${address}\\nContact: ${contact}\\nTotal: ₹${total}\\nItems: ${cart.map(item => item.name + ' - ₹' + item.price + ' Qty: ' + item.quantity).join(', ')}\\nPayment Method: \${paymentMethod}\\nPlease share the payment confirmation.\`;

        const url = \`https://wa.me/919817409607?text=\${encodeURIComponent(message)}\`;
        window.open(url, '_blank');
    }
    // Function to navigate back to shopping page
    function backToShopping() {
        window.location.href = 'index.html';
    }
        

</script>

        </body>
        </html>
    `;

    // Open a new window with the generated invoice content
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