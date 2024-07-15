   // Initialize cart data from localStorage or an empty array
   let cart = JSON.parse(localStorage.getItem('cart')) || [];
   let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

   // Event listener when the DOM content is fully loaded
   document.addEventListener('DOMContentLoaded', () => {
       displayCart();
       toggleCheckout();
   });

   // Function to add an item to the cart
   function addToCart(item, price, id) {
       const cartItem = cart.find(cartItem => cartItem.id === id);
       if (cartItem) {
           cartItem.quantity += 1;
       } else {
           cart.push({ item, price, id, quantity: 1 });
       }
       updateTotal();
       localStorage.setItem('cart', JSON.stringify(cart));
       displayCart();
       toggleCheckout();
   }

   // Function to display cart items in the UI
   function displayCart() {
       const cartItems = document.getElementById('cartItems');
       cartItems.innerHTML = '';
       cart.forEach((cartItem, index) => {
           cartItems.innerHTML += `
               <li>
                   <input type="checkbox" onclick="removeFromCart(${index})">
                   ${cartItem.item} - ₹${cartItem.price} x ${cartItem.quantity}
                   <button onclick="decreaseQuantity(${index})">-</button>
                   <button onclick="increaseQuantity(${index})">+</button>
               </li>`;
       });
   }

   // Function to increase the quantity of an item in the cart
   function increaseQuantity(index) {
       cart[index].quantity += 1;
       updateTotal();
       localStorage.setItem('cart', JSON.stringify(cart));
       displayCart();
       toggleCheckout();
   }

   // Function to decrease the quantity of an item in the cart
   function decreaseQuantity(index) {
       if (cart[index].quantity > 1) {
           cart[index].quantity -= 1;
       } else {
           cart.splice(index, 1);
       }
       updateTotal();
       localStorage.setItem('cart', JSON.stringify(cart));
       displayCart();
       toggleCheckout();
   }

   // Function to remove an item from the cart
   function removeFromCart(index) {
       cart.splice(index, 1);
       updateTotal();
       localStorage.setItem('cart', JSON.stringify(cart));
       displayCart();
       toggleCheckout();
   }

   // Function to update the total cart value
   function updateTotal() {
       total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
   }

   // Function to toggle the checkout form based on cart total
   function toggleCheckout() {
       const checkoutForm = document.getElementById('checkoutForm');
       const cartMessage = document.getElementById('cartMessage');
       if (total > 499) {
           checkoutForm.style.display = 'block';
           cartMessage.innerHTML = 'Congratulations! Your cart total exceeds ₹499. Please proceed to checkout.';
       } else {
           checkoutForm.style.display = 'none';
           cartMessage.innerHTML = '';
       }
   }

// Function to handle continuing shopping (hide the invoice)
function continueShopping() {
    document.getElementById('invoice').style.display = 'none';
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
                    <h1>Jatayu copy House</h1>
                    <img src="/images/jatayupng.png" alt="Jatayu copy House Logo" width="100"><br>
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
                <td>${cartItem.item}</td>
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
<button onclick="sendOrderOnWhatsApp()">Send Order on WhatsApp</button>

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
        const message = \`Order Details:\\nName: ${name}\\nAddress: ${address}\\nContact: ${contact}\\nTotal: ₹${total}\\nItems: ${cart.map(item => item.item + ' - ₹' + item.price + ' Qty: ' + item.quantity).join(', ')}\\nPayment Method: \${paymentMethod}\\nPlease share the payment confirmation.\`;

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