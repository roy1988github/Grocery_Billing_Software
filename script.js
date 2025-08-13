class ShoppingCart {
    constructor() {
        this.products = [];
        this.cartItems = [];
        this.nextItemId = 1;
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
        this.addFirstItem();
    }

    async loadProducts() {
        try {
            // In a real application, you would fetch the CSV file from a server
            // For this demo, we'll parse the embedded CSV data
            const csvData = await this.fetchCSVData();
            this.products = this.parseCSV(csvData);
            console.log('Products loaded:', this.products);
        } catch (error) {
            console.error('Error loading products:', error);
            // Fallback data in case CSV loading fails
            this.products = this.getFallbackProducts();
        }
    }

    async fetchCSVData() {
        // In a real application, you would use fetch() to get the CSV file
        // For this demo, we'll return the CSV data as a string
        return `Serial Number,Product Name,Product Type,Price Per Unit (INR),Unit,Discount
1,Basmati Rice,Grains,180.00,kg,5%
2,Brown Rice,Grains,120.00,kg,5%
3,Wheat Flour,Grains,45.00,kg,5%
4,Quinoa,Grains,450.00,kg,5%
5,Oats,Grains,85.00,kg,5%
6,Barley,Grains,65.00,kg,5%
7,Millets,Grains,95.00,kg,5%
8,Semolina,Grains,55.00,kg,5%
9,Chickpea Flour,Grains,70.00,kg,5%
10,Rice Flour,Grains,60.00,kg,5%
11,Chicken Breast,Meat,320.00,kg,0%
12,Mutton,Meat,650.00,kg,0%
13,Pork,Meat,480.00,kg,0%
14,Chicken Thighs,Meat,280.00,kg,0%
15,Beef,Meat,550.00,kg,0%
16,Chicken Wings,Meat,250.00,kg,0%
17,Ground Turkey,Meat,420.00,kg,0%
18,Lamb,Meat,720.00,kg,0%
19,Coconut Oil,Oil,180.00,litre,15%
20,Olive Oil,Oil,650.00,litre,15%
21,Sunflower Oil,Oil,140.00,litre,15%
22,Mustard Oil,Oil,160.00,litre,15%
23,Sesame Oil,Oil,320.00,litre,15%
24,Groundnut Oil,Oil,150.00,litre,15%
25,Avocado Oil,Oil,800.00,litre,15%
26,Turmeric Powder,Spices,280.00,kg,0%
27,Red Chili Powder,Spices,350.00,kg,0%
28,Coriander Powder,Spices,220.00,kg,0%
29,Cumin Powder,Spices,450.00,kg,0%
30,Garam Masala,Spices,380.00,kg,0%
31,Black Pepper,Spices,850.00,kg,0%
32,Cardamom,Spices,2500.00,kg,0%
33,Cinnamon,Spices,420.00,kg,0%
34,Fresh Salmon,Sea Food,750.00,kg,0%
35,Prawns,Sea Food,650.00,kg,0%
36,Tuna,Sea Food,580.00,kg,0%
37,Mackerel,Sea Food,380.00,kg,0%
38,Pomfret,Sea Food,850.00,kg,0%
39,Crab,Sea Food,720.00,kg,0%
40,Lobster,Sea Food,1200.00,kg,0%
41,Almonds,Dry Fruits,1100.00,kg,2%
42,Walnuts,Dry Fruits,1350.00,kg,2%
43,Cashews,Dry Fruits,950.00,kg,2%
44,Pistachios,Dry Fruits,1650.00,kg,2%
45,Dates,Dry Fruits,420.00,kg,2%
46,Raisins,Dry Fruits,380.00,kg,2%
47,Dried Apricots,Dry Fruits,850.00,kg,2%
48,Fresh Tomatoes,Vegetables,35.00,kg,0%
49,Onions,Vegetables,25.00,kg,0%
50,Potatoes,Vegetables,22.00,kg,0%`;
    }

    parseCSV(csvData) {
        const lines = csvData.trim().split('\n');
        const headers = lines[0].split(',');
        const products = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const product = {
                serialNumber: parseInt(values[0]),
                name: values[1],
                type: values[2],
                pricePerUnit: parseFloat(values[3]),
                unit: values[4],
                discount: parseInt(values[5].replace('%', ''))
            };
            products.push(product);
        }

        return products;
    }

    getFallbackProducts() {
        // Fallback products in case CSV loading fails
        return [
            { serialNumber: 1, name: 'Basmati Rice', type: 'Grains', pricePerUnit: 180.00, unit: 'kg', discount: 5 },
            { serialNumber: 2, name: 'Chicken Breast', type: 'Meat', pricePerUnit: 320.00, unit: 'kg', discount: 0 },
            { serialNumber: 3, name: 'Olive Oil', type: 'Oil', pricePerUnit: 650.00, unit: 'litre', discount: 15 },
            { serialNumber: 4, name: 'Turmeric Powder', type: 'Spices', pricePerUnit: 280.00, unit: 'kg', discount: 0 },
            { serialNumber: 5, name: 'Fresh Salmon', type: 'Sea Food', pricePerUnit: 750.00, unit: 'kg', discount: 0 },
            { serialNumber: 6, name: 'Almonds', type: 'Dry Fruits', pricePerUnit: 1100.00, unit: 'kg', discount: 2 }
        ];
    }

    setupEventListeners() {
        document.getElementById('add-item-btn').addEventListener('click', () => {
            this.addCartItem();
        });

        document.getElementById('checkout-btn').addEventListener('click', () => {
            this.checkout();
        });

        document.getElementById('clear-cart-btn').addEventListener('click', () => {
            this.clearCart();
        });

        // Modal event listeners
        document.getElementById('generate-bill-btn').addEventListener('click', () => {
            this.generateBill();
        });

        document.getElementById('close-modal-btn').addEventListener('click', () => {
            this.closeModal();
        });

        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('checkout-modal');
            if (event.target === modal) {
                this.closeModal();
            }
        });
    }

    addFirstItem() {
        this.addCartItem();
    }

    addCartItem() {
        const cartItem = {
            id: this.nextItemId++,
            productId: null,
            quantity: 1,
            unit: 'kg'
        };

        this.cartItems.push(cartItem);
        this.renderCartItem(cartItem);
    }

    renderCartItem(cartItem) {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.dataset.itemId = cartItem.id;

        cartItemElement.innerHTML = `
            <select class="product-select" data-item-id="${cartItem.id}">
                <option value="">Select a product...</option>
                ${this.products.map(product => 
                    `<option value="${product.serialNumber}" ${cartItem.productId === product.serialNumber ? 'selected' : ''}>
                        ${product.name}
                    </option>`
                ).join('')}
            </select>
            <input type="number" class="quantity-input" min="0.1" step="0.1" max="100" value="${cartItem.quantity}" data-item-id="${cartItem.id}">
            <select class="unit-select" data-item-id="${cartItem.id}">
                <option value="kg" ${cartItem.unit === 'kg' ? 'selected' : ''}>Kg</option>
                <option value="gm" ${cartItem.unit === 'gm' ? 'selected' : ''}>gm</option>
                <option value="L" ${cartItem.unit === 'L' ? 'selected' : ''}>L</option>
                <option value="cc" ${cartItem.unit === 'cc' ? 'selected' : ''}>cc</option>
            </select>
            <div class="price-display">
                <span class="rate-value">₹0.00</span>
            </div>
            <div class="discount-display">
                <span class="discount-value">0%</span>
            </div>
            <div class="price-display">
                <span class="item-total">₹0.00</span>
            </div>
            <button class="remove-btn" data-item-id="${cartItem.id}">×</button>
        `;

        cartItemsContainer.appendChild(cartItemElement);

        // Add event listeners for this cart item
        this.setupCartItemEventListeners(cartItem.id);
    }

    setupCartItemEventListeners(itemId) {
        const productSelect = document.querySelector(`select.product-select[data-item-id="${itemId}"]`);
        const quantityInput = document.querySelector(`input[data-item-id="${itemId}"]`);
        const unitSelect = document.querySelector(`select.unit-select[data-item-id="${itemId}"]`);
        const removeBtn = document.querySelector(`button[data-item-id="${itemId}"]`);

        productSelect.addEventListener('change', (e) => {
            this.updateCartItem(itemId, 'product', parseInt(e.target.value));
        });

        quantityInput.addEventListener('input', (e) => {
            this.updateCartItem(itemId, 'quantity', parseFloat(e.target.value) || 0.1);
        });

        unitSelect.addEventListener('change', (e) => {
            this.updateCartItem(itemId, 'unit', e.target.value);
        });

        removeBtn.addEventListener('click', () => {
            this.removeCartItem(itemId);
        });
    }

    updateCartItem(itemId, field, value) {
        const cartItem = this.cartItems.find(item => item.id === itemId);
        if (!cartItem) return;

        if (field === 'product') {
            cartItem.productId = value;
        } else if (field === 'quantity') {
            cartItem.quantity = Math.max(0.1, value);
        } else if (field === 'unit') {
            cartItem.unit = value;
        }

        this.updateCartItemDisplay(itemId);
        this.updateTotal();
    }

    updateCartItemDisplay(itemId) {
        const cartItem = this.cartItems.find(item => item.id === itemId);
        const product = this.products.find(p => p.serialNumber === cartItem.productId);
        
        if (!product) return;

        const cartItemElement = document.querySelector(`[data-item-id="${itemId}"]`);
        const rateElement = cartItemElement.querySelector('.rate-value');
        const discountElement = cartItemElement.querySelector('.discount-value');
        const itemTotalElement = cartItemElement.querySelector('.item-total');

        // Calculate rate based on unit
        const baseRate = product.pricePerUnit;
        let adjustedRate = baseRate;
        
        if (cartItem.unit === 'gm' || cartItem.unit === 'cc') {
            adjustedRate = baseRate / 1000;
        }

        // Update rate display
        rateElement.textContent = `₹${adjustedRate.toFixed(2)}`;
        
        // Update discount display
        discountElement.textContent = `${product.discount}%`;

        // Calculate item total with discount
        const itemTotal = this.calculateItemTotal(cartItem, product);
        itemTotalElement.textContent = `₹${itemTotal.toFixed(2)}`;
    }

    calculateItemTotal(cartItem, product) {
        // Calculate rate based on unit
        let adjustedRate = product.pricePerUnit;
        
        if (cartItem.unit === 'gm' || cartItem.unit === 'cc') {
            adjustedRate = product.pricePerUnit / 1000;
        }

        // Calculate base price using floating point quantity
        const basePrice = adjustedRate * parseFloat(cartItem.quantity);
        
        // Apply discount
        const discountAmount = (basePrice * product.discount) / 100;
        
        return basePrice - discountAmount;
    }

    removeCartItem(itemId) {
        // Remove from array
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        
        // Remove from DOM
        const cartItemElement = document.querySelector(`[data-item-id="${itemId}"]`);
        if (cartItemElement) {
            cartItemElement.remove();
        }

        // Ensure at least one item exists
        if (this.cartItems.length === 0) {
            this.addCartItem();
        }

        this.updateTotal();
    }

    updateTotal() {
        let total = 0;

        this.cartItems.forEach(cartItem => {
            if (cartItem.productId) {
                const product = this.products.find(p => p.serialNumber === cartItem.productId);
                if (product) {
                    total += this.calculateItemTotal(cartItem, product);
                }
            }
        });

        document.getElementById('total-amount').textContent = `₹${total.toFixed(2)}`;
    }

    checkout() {
        const validItems = this.cartItems.filter(item => item.productId && item.quantity > 0);
        
        if (validItems.length === 0) {
            alert('Please add at least one item to your cart before checkout.');
            return;
        }

        this.showCheckoutModal(validItems);
    }

    showCheckoutModal(validItems) {
        const modal = document.getElementById('checkout-modal');
        const summaryContainer = document.getElementById('checkout-summary');
        const modalTotal = document.getElementById('modal-total');

        let total = 0;
        let summaryHTML = '';

        validItems.forEach(cartItem => {
            const product = this.products.find(p => p.serialNumber === cartItem.productId);
            if (product) {
                const itemTotal = this.calculateItemTotal(cartItem, product);
                total += itemTotal;
                
                // Calculate rate for display
                let adjustedRate = product.pricePerUnit;
                if (cartItem.unit === 'gm' || cartItem.unit === 'cc') {
                    adjustedRate = product.pricePerUnit / 1000;
                }
                
                summaryHTML += `
                    <div class="checkout-item">
                        <div class="item-details">
                            <div class="item-name">${product.name}</div>
                            <div class="item-specs">
                                ${cartItem.quantity} ${cartItem.unit} @ ₹${adjustedRate.toFixed(2)}/${cartItem.unit}
                                ${product.discount > 0 ? ` (${product.discount}% discount)` : ''}
                            </div>
                        </div>
                        <div class="item-price">₹${itemTotal.toFixed(2)}</div>
                    </div>
                `;
            }
        });

        summaryContainer.innerHTML = summaryHTML;
        modalTotal.textContent = `₹${total.toFixed(2)}`;
        
        // Store current checkout data for bill generation
        this.currentCheckout = { validItems, total };
        
        modal.style.display = 'block';
    }

    closeModal() {
        const modal = document.getElementById('checkout-modal');
        modal.style.display = 'none';
    }

    generateBill() {
        if (!this.currentCheckout) {
            alert('No checkout data available.');
            return;
        }

        this.createPDFBill(this.currentCheckout.validItems, this.currentCheckout.total);
    }

    createPDFBill(validItems, total) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Bill header
        doc.setFontSize(24);
        doc.setTextColor(76, 175, 80);
        doc.text('KALIMATA GROCERY', 105, 25, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Fresh Products, Great Prices!', 105, 35, { align: 'center' });
        doc.text('Amra Kajan, Bisharpara- Nabajiban, North 24 Parganas - 700051', 105, 42, { align: 'center' });
        doc.text('Phone: +91 98765 43210 | Email: info@kalimatagrocery.com', 105, 49, { align: 'center' });

        // Horizontal line
        doc.line(20, 55, 190, 55);

        // Bill details
        const currentDate = new Date();
        const billNumber = 'KG' + Date.now().toString().slice(-6);
        
        doc.setFontSize(10);
        doc.text('Bill No: ' + billNumber, 20, 65);
        doc.text('Date: ' + currentDate.toLocaleDateString(), 20, 72);
        doc.text('Time: ' + currentDate.toLocaleTimeString(), 20, 79);

        // Table header with proper alignment
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        
        const tableStartY = 90;
        doc.text('S.No', 22, tableStartY);
        doc.text('Product Name', 37, tableStartY);
        doc.text('Qty', 107, tableStartY);
        doc.text('Unit', 122, tableStartY);
        doc.text('Rate', 137, tableStartY);
        doc.text('Discount', 157, tableStartY);
        doc.text('Amount', 177, tableStartY);

        // Table line
        doc.line(20, tableStartY + 3, 190, tableStartY + 3);

        // Table content with proper alignment
        doc.setFont(undefined, 'normal');
        let yPosition = tableStartY + 12;
        
        validItems.forEach((cartItem, index) => {
            const product = this.products.find(p => p.serialNumber === cartItem.productId);
            if (product) {
                const itemTotal = this.calculateItemTotal(cartItem, product);
                
                // Calculate rate for display
                let adjustedRate = product.pricePerUnit;
                if (cartItem.unit === 'gm' || cartItem.unit === 'cc') {
                    adjustedRate = product.pricePerUnit / 1000;
                }

                // Truncate product name if too long
                const productName = product.name.length > 25 ? 
                    product.name.substring(0, 22) + '...' : product.name;

                // Align values with headers
                doc.text((index + 1).toString(), 22, yPosition);
                doc.text(productName, 37, yPosition);
                doc.text(cartItem.quantity.toString(), 107, yPosition);
                doc.text(cartItem.unit, 122, yPosition);
                doc.text('Rs' + adjustedRate.toFixed(2), 137, yPosition);
                doc.text(product.discount.toString() + '%', 157, yPosition);
                doc.text('Rs' + itemTotal.toFixed(2), 177, yPosition);

                yPosition += 8;
            }
        });

        // Total section
        const totalY = yPosition + 10;
        doc.line(20, totalY - 5, 190, totalY - 5);
        
        doc.setFont(undefined, 'bold');
        doc.setFontSize(12);
        doc.text('TOTAL AMOUNT:', 140, totalY);
        doc.text('Rs' + total.toFixed(2), 177, totalY);

        // Footer
        const footerY = totalY + 20;
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.text('Thank you for shopping with Kalimata Grocery!', 105, footerY, { align: 'center' });
        doc.text('Visit us again for fresh products and great deals.', 105, footerY + 7, { align: 'center' });
        
        // Terms and conditions
        doc.text('Terms: All sales are final. Exchange only with receipt within 24 hours.', 105, footerY + 20, { align: 'center' });

        // Save the PDF
        const fileName = 'Kalimata_Grocery_Bill_' + billNumber + '.pdf';
        doc.save(fileName);

        // Show success message
        alert('Bill generated successfully! File saved as: ' + fileName);
        
        // Close modal after generating bill
        this.closeModal();
    }

    clearCart() {
        if (confirm('Are you sure you want to clear the cart?')) {
            this.cartItems = [];
            document.getElementById('cart-items').innerHTML = '';
            this.addCartItem();
            this.updateTotal();
        }
    }
}

// Initialize the shopping cart when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ShoppingCart();
});
