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
        document.getElementById('generate-mart-bill-btn').addEventListener('click', () => {
            this.generateMartBill();
        });
        document.getElementById('close-modal-btn').addEventListener('click', () => {
            this.closeModal();
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

        // Listen for changes to Final Discount input
        document.getElementById('final-discount-input').addEventListener('input', () => {
            this.updateTotal();
        });

        // Mobile number validation
        const mobileInput = document.getElementById('customer-mobile');
        mobileInput.setAttribute('maxlength', '10');
        mobileInput.addEventListener('input', function() {
            // Remove non-digit characters
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 10) {
                this.value = this.value.slice(0, 10);
            }
        });
        // Validate on checkout
        document.getElementById('checkout-btn').addEventListener('click', () => {
            const mobile = mobileInput.value;
            if (mobile.length !== 10) {
                alert('Mobile Number must be exactly 10 digits.');
                return;
            }
            this.checkout();
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

        // Set default rateUnit based on unit
        let defaultRateUnit = cartItem.rateUnit;
        if (!defaultRateUnit) {
            if (cartItem.unit === 'L' || cartItem.unit === 'cc') {
                defaultRateUnit = 'L';
            } else {
                defaultRateUnit = 'kg';
            }
            cartItem.rateUnit = defaultRateUnit;
        }
        // Determine which Rate options should be disabled
        let rateKgDisabled = (cartItem.unit === 'L' || cartItem.unit === 'cc') ? 'disabled' : '';
        let rateLDisabled = (cartItem.unit === 'kg' || cartItem.unit === 'gm') ? 'disabled' : '';

        cartItemElement.innerHTML = `
            <input type="text" class="product-input" placeholder="Product" data-item-id="${cartItem.id}" autocomplete="off">
            <input type="number" class="quantity-input" min="0.1" step="0.1" max="100" value="${cartItem.quantity}" data-item-id="${cartItem.id}">
            <select class="unit-select" data-item-id="${cartItem.id}">
                <option value="kg" ${cartItem.unit === 'kg' ? 'selected' : ''}>Kg</option>
                <option value="gm" ${cartItem.unit === 'gm' ? 'selected' : ''}>gm</option>
                <option value="Pc" ${cartItem.unit === 'Pc' ? 'selected' : ''}>Pc</option>
                <option value="Carton" ${cartItem.unit === 'Carton' ? 'selected' : ''}>Carton</option>
            </select>
            <div class="rate-group">
                <input type="number" class="rate-input" min="0.01" step="0.01" value="${cartItem.rate || ''}" placeholder="Rate" data-item-id="${cartItem.id}">
                <select class="rate-unit-select" data-item-id="${cartItem.id}">
                    <option value="kg" ${defaultRateUnit === 'kg' ? 'selected' : ''} ${rateKgDisabled}>Rate (Kg)</option>
                </select>
            </div>
            <div class="price-display">
                <span class="price-value">₹0.00</span>
            </div>
            <button class="remove-btn" data-item-id="${cartItem.id}">×</button>
        `;

        cartItemsContainer.appendChild(cartItemElement);
        this.setupCartItemEventListeners(cartItem.id);
    }

    setupCartItemEventListeners(itemId) {
        const productInput = document.querySelector(`input.product-input[data-item-id="${itemId}"]`);
        const quantityInput = document.querySelector(`input.quantity-input[data-item-id="${itemId}"]`);
        const unitSelect = document.querySelector(`select.unit-select[data-item-id="${itemId}"]`);
        const rateInput = document.querySelector(`input.rate-input[data-item-id="${itemId}"]`);
        const rateUnitSelect = document.querySelector(`select.rate-unit-select[data-item-id="${itemId}"]`);
        const removeBtn = document.querySelector(`button[data-item-id="${itemId}"]`);

        productInput.addEventListener('input', (e) => {
            this.updateCartItem(itemId, 'productName', e.target.value);
        });
        quantityInput.addEventListener('input', (e) => {
            this.updateCartItem(itemId, 'quantity', parseFloat(e.target.value) || 0.1);
        });
        unitSelect.addEventListener('change', (e) => {
            this.updateCartItem(itemId, 'unit', e.target.value);
            // Dynamically update Rate dropdown disabling
            const rateUnitSelect = document.querySelector(`select.rate-unit-select[data-item-id="${itemId}"]`);
            if (e.target.value === 'L' || e.target.value === 'cc') {
                rateUnitSelect.querySelector('option[value="kg"]').disabled = true;
                rateUnitSelect.querySelector('option[value="L"]').disabled = false;
            } else if (e.target.value === 'kg' || e.target.value === 'gm') {
                rateUnitSelect.querySelector('option[value="kg"]').disabled = false;
                rateUnitSelect.querySelector('option[value="L"]').disabled = true;
            } else {
                rateUnitSelect.querySelector('option[value="kg"]').disabled = false;
                rateUnitSelect.querySelector('option[value="L"]').disabled = false;
            }
        });
        rateInput.addEventListener('input', (e) => {
            this.updateCartItem(itemId, 'rate', parseFloat(e.target.value) || 0);
        });
        rateUnitSelect.addEventListener('change', (e) => {
            this.handleRateUnitChange(itemId, e.target.value);
        });
        removeBtn.addEventListener('click', () => {
            this.removeCartItem(itemId);
        });
        // Initial disabling on render
        if (unitSelect.value === 'L' || unitSelect.value === 'cc') {
            rateUnitSelect.querySelector('option[value="kg"]').disabled = true;
            rateUnitSelect.querySelector('option[value="L"]').disabled = false;
        } else if (unitSelect.value === 'kg' || unitSelect.value === 'gm') {
            rateUnitSelect.querySelector('option[value="kg"]').disabled = false;
            rateUnitSelect.querySelector('option[value="L"]').disabled = true;
        } else {
            rateUnitSelect.querySelector('option[value="kg"]').disabled = false;
            rateUnitSelect.querySelector('option[value="L"]').disabled = false;
        }
    }

    handleRateUnitChange(itemId, newUnit) {
        const cartItem = this.cartItems.find(item => item.id === itemId);
        if (!cartItem) return;
        // Conversion logic
        let rate = cartItem.rate || 0;
        let oldUnit = cartItem.rateUnit || 'kg';
        if ((oldUnit === 'kg' && newUnit === 'gm') || (oldUnit === 'L' && newUnit === 'cc')) {
            rate = rate / 1000;
        } else if ((oldUnit === 'gm' && newUnit === 'kg') || (oldUnit === 'cc' && newUnit === 'L')) {
            rate = rate * 1000;
        }
        cartItem.rateUnit = newUnit;
        cartItem.rate = rate;
        this.updateCartItemDisplay(itemId);
        this.updateTotal();
        // Update input value in DOM
        const rateInput = document.querySelector(`input.rate-input[data-item-id="${itemId}"]`);
        if (rateInput) rateInput.value = rate;
    }

    updateCartItem(itemId, field, value) {
        const cartItem = this.cartItems.find(item => item.id === itemId);
        if (!cartItem) return;
        if (field === 'productName') {
            cartItem.productName = value;
        } else if (field === 'quantity') {
            cartItem.quantity = Math.max(0.1, value);
        } else if (field === 'unit') {
            cartItem.unit = value;
        } else if (field === 'rate') {
            cartItem.rate = Math.max(0, value);
        }
        if (!cartItem.rateUnit) cartItem.rateUnit = 'kg';
        this.updateCartItemDisplay(itemId);
        this.updateTotal();
    }

    updateCartItemDisplay(itemId) {
        const cartItem = this.cartItems.find(item => item.id === itemId);
        const cartItemElement = document.querySelector(`[data-item-id="${itemId}"]`);
        const priceElement = cartItemElement.querySelector('.price-value');
        let rate = cartItem.rate || 0;
        let itemUnit = cartItem.unit || 'kg';
        let price = 0;
        // Price calculation based on unit
        if (itemUnit === 'kg') {
            price = rate * (parseFloat(cartItem.quantity) || 0);
        } else if (itemUnit === 'gm') {
            price = (rate * (parseFloat(cartItem.quantity) || 0)) / 1000;
        } else if (itemUnit === 'Pc' || itemUnit === 'Carton') {
            price = cartItem.price || 0;
        }
        // Only show price
        priceElement.textContent = `₹${price.toFixed(2)}`;
        cartItem.price = price;

        // Set up price input for Pc/Carton, else display calculated price
        if (itemUnit === 'Pc' || itemUnit === 'Carton') {
            priceElement.innerHTML = `<input type="number" class="price-input" min="0" step="0.01" value="${cartItem.price || ''}" placeholder="Enter Price" data-item-id="${cartItem.id}">`;
            // Listen for price input changes
            const priceInput = cartItemElement.querySelector('.price-input');
            priceInput.addEventListener('input', (e) => {
                cartItem.price = parseFloat(e.target.value) || 0;
                this.updateTotal();
            });
        } else {
            priceElement.textContent = `₹${price.toFixed(2)}`;
            cartItem.price = price;
        }
    }

    calculateFinalPrice(cartItem, product) {
        // Calculate rate based on unit
        let adjustedRate = cartItem.rate;
        
        if (cartItem.unit === 'gm' || cartItem.unit === 'cc') {
            adjustedRate = cartItem.rate / 1000;
        }

        // Calculate base price using floating point quantity
        const basePrice = adjustedRate * parseFloat(cartItem.quantity);
        
        // Apply discount
        const discountAmount = (basePrice * cartItem.discount) / 100;
        
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
            let itemUnit = cartItem.unit || 'kg';
            let price = 0;
            if (itemUnit === 'Pc' || itemUnit === 'Carton') {
                price = cartItem.price || 0;
            } else if (itemUnit === 'kg') {
                price = (cartItem.rate || 0) * (parseFloat(cartItem.quantity) || 0);
            } else if (itemUnit === 'gm') {
                price = ((cartItem.rate || 0) * (parseFloat(cartItem.quantity) || 0) / 1000);
            }
            total += price;
        });
        document.getElementById('total-amount').textContent = `₹${total.toFixed(2)}`;
        const finalDiscountInput = document.getElementById('final-discount-input');
        const gstInput = document.getElementById('gst-input');
        const discountedTotalValue = document.getElementById('discounted-total-value');
        const finalAmountValue = document.getElementById('final-amount-value');
        let finalDiscount = parseFloat(finalDiscountInput.value) || 0;
        let gst = parseFloat(gstInput.value) || 0;
        let discountedTotal = total * (100 - finalDiscount) / 100;
        discountedTotalValue.textContent = `₹${discountedTotal.toFixed(2)}`;
        let finalAmount = discountedTotal * (100 + gst) / 100;
        finalAmountValue.textContent = `₹${finalAmount.toFixed(2)}`;
        finalDiscountInput.addEventListener('input', () => {
            let finalDiscount = parseFloat(finalDiscountInput.value) || 0;
            let gst = parseFloat(gstInput.value) || 0;
            let discountedTotal = total * (100 - finalDiscount) / 100;
            discountedTotalValue.textContent = `₹${discountedTotal.toFixed(2)}`;
            let finalAmount = discountedTotal * (100 + gst) / 100;
            finalAmountValue.textContent = `₹${finalAmount.toFixed(2)}`;
        });
        gstInput.addEventListener('input', () => {
            let finalDiscount = parseFloat(finalDiscountInput.value) || 0;
            let gst = parseFloat(gstInput.value) || 0;
            let discountedTotal = total * (100 - finalDiscount) / 100;
            discountedTotalValue.textContent = `₹${discountedTotal.toFixed(2)}`;
            let finalAmount = discountedTotal * (100 + gst) / 100;
            finalAmountValue.textContent = `₹${finalAmount.toFixed(2)}`;
        });
    }

    checkout() {
        // Only require productName and quantity > 0
        const validItems = this.cartItems.filter(item => item.productName && item.productName.trim() !== '' && item.quantity > 0);
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
            let rate = cartItem.rate || 0;
            if (cartItem.unit === 'gm' || cartItem.unit === 'cc') {
                rate = rate / 1000;
            }
            const price = rate * (parseFloat(cartItem.quantity) || 0);
            const discount = cartItem.discount || 0;
            const finalPrice = price * (1 - discount / 100);
            total += finalPrice;
            summaryHTML += `
                <div class="checkout-item">
                    <div class="item-details">
                        <div class="item-name">${cartItem.productId ? this.products.find(p => p.serialNumber === cartItem.productId).name : ''}</div>
                        <div class="item-specs">
                            ${cartItem.quantity} ${cartItem.unit} @ ₹${rate.toFixed(2)}/${cartItem.unit}
                            ${discount > 0 ? ` (${discount}% discount)` : ''}
                        </div>
                    </div>
                    <div class="item-price">₹${finalPrice.toFixed(2)}</div>
                </div>
            `;
        });

        summaryContainer.innerHTML = summaryHTML;
        modalTotal.textContent = `₹${total.toFixed(2)}`;
        this.currentCheckout = { validItems, total };
        modal.style.display = 'block';
    }

    closeModal() {
        const modal = document.getElementById('checkout-modal');
        modal.style.display = 'none';
    }

    // Helper to append customer profile to CSV
    async appendCustomerProfile({customerName, customerMobile, billNumber, date, time, itemsPurchased, finalAmount}) {
        // Read existing CSV
        let csvText = '';
        try {
            const response = await fetch('Customer_Profile.csv');
            csvText = await response.text();
        } catch (e) {
            csvText = 'Serial Number,Customer Name,Mobile Number,Bill Number,Date,Time,Items Purchased,Final Amount Paid\n';
        }
        let lines = csvText.trim().split('\n');
        let serial = lines.length;
        let newRow = `${serial},${customerName},${customerMobile},${billNumber},${date},${time},"${itemsPurchased}",${finalAmount}`;
        lines.push(newRow);
        // Save CSV (browser cannot write files directly, so this triggers a download)
        let blob = new Blob([lines.join('\n') + '\n'], {type: 'text/csv'});
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'Customer_Profile.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Helper to append customer profile to JSON
    async appendCustomerProfileJSON({customerName, customerMobile, billNumber, date, time, itemsPurchased, finalAmount}) {
        let jsonArr = [];
        try {
            const response = await fetch('Customer_Profile.json');
            jsonArr = await response.json();
        } catch (e) {
            jsonArr = [];
        }
        let serial = jsonArr.length + 1;
        jsonArr.push({
            "Serial Number": serial,
            "Customer Name": customerName,
            "Mobile Number": customerMobile,
            "Bill Number": billNumber,
            "Date": date,
            "Time": time,
            "Items Purchased": itemsPurchased,
            "Final Amount Paid": finalAmount
        });
        let blob = new Blob([JSON.stringify(jsonArr, null, 2)], {type: 'application/json'});
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'Customer_Profile.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    generateBill() {
        if (!this.currentCheckout) {
            alert('No checkout data available.');
            return;
        }
        // Get customer info
        const customerName = document.getElementById('customer-name').value || '';
        const customerMobile = document.getElementById('customer-mobile').value || '';
        // Recalculate total and final amount for PDF using same logic as updateTotal
        let total = 0;
        this.currentCheckout.validItems.forEach(cartItem => {
            let itemUnit = cartItem.unit || 'kg';
            let discountedPrice = 0;
            if (itemUnit === 'Pc' || itemUnit === 'Carton') {
                discountedPrice = (cartItem.price || 0) * (100 - (cartItem.discount || 0)) / 100;
            } else if (itemUnit === 'kg') {
                discountedPrice = (cartItem.rate || 0) * (parseFloat(cartItem.quantity) || 0) * (100 - (cartItem.discount || 0)) / 100;
            } else if (itemUnit === 'gm') {
                discountedPrice = ((cartItem.rate || 0) * (parseFloat(cartItem.quantity) || 0) / 1000) * (100 - (cartItem.discount || 0)) / 100;
            }
            total += discountedPrice;
        });
        const finalDiscountInput = document.getElementById('final-discount-input');
        const gstInput = document.getElementById('gst-input');
        let finalDiscount = parseFloat(finalDiscountInput.value) || 0;
        let gst = parseFloat(gstInput.value) || 0;
        let discountedTotal = total * (100 - finalDiscount) / 100;
        let finalAmount = discountedTotal * (100 + gst) / 100;
        this.createPDFBill(this.currentCheckout.validItems, total, finalDiscount, gst, discountedTotal, finalAmount, customerName, customerMobile);
    }

    createPDFBill(validItems, total, finalDiscount, gst, discountedTotal, finalAmount, customerName, customerMobile) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        // Bill header with logo
        if (typeof window.KalimataLogoBase64 === 'string') {
            doc.addImage(window.KalimataLogoBase64, 'PNG', 85, 5, 40, 20, undefined, 'FAST');
        }
        doc.setFont('times', 'bold');
        doc.setFontSize(28);
        doc.setTextColor(76, 175, 80);
        doc.text('KALIMATA ENTERPRISES', 105, 25, { align: 'center' });
        doc.setFont('times', 'italic');
        doc.setFontSize(14);
        doc.setTextColor(255, 87, 34);
        doc.text('_____________________________', 105, 30, { align: 'center' });
        doc.text('Fresh Products, Great Prices!', 105, 35, { align: 'center' });
        doc.setFont('times', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Ground Floor, 493 Nabajiban Colony (Near Shiv Mandir),', 105, 42, { align: 'center' });
        doc.text('Nabajiban School Road, Kolkata, North 24 Pgns, WB-700158', 105, 49, { align: 'center' });
        doc.text('Phone: +91 93303 53449 | Email: info@kalimatagrocery.com', 105, 56, { align: 'center' });
        doc.line(20, 61, 190, 61);
        const currentDate = new Date();
        const billNumber = 'Kalimata_' + Date.now().toString().slice(-6);
        // Bill No, Date, Time in one line
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.text(`Bill No: ${billNumber}    Date: ${currentDate.toLocaleDateString()}    Time: ${currentDate.toLocaleTimeString()}`,
            20, 68);
        doc.setFont('times', 'bold');
        const tableStartY = 80;
        // Adjusted X positions for better spacing
        const xPositions = {
            sno: 22,
            product: 38,
            qty: 60,
            unit: 75,
            rate: 90,
            price: 125,
            action: 145
        };
        doc.text('S.No', xPositions.sno, tableStartY);
        doc.text('Product', xPositions.product, tableStartY);
        doc.text('Qty', xPositions.qty, tableStartY);
        doc.text('Unit', xPositions.unit, tableStartY);
        doc.text('Rate', xPositions.rate, tableStartY);
        doc.text('Price', xPositions.price, tableStartY);
        doc.line(20, tableStartY + 3, 190, tableStartY + 3);
        doc.setFont('times', 'normal');
        let yPosition = tableStartY + 12;
        validItems.forEach((cartItem, index) => {
            let rate = cartItem.rate || 0;
            let itemUnit = cartItem.unit || 'kg';
            let price = 0;
            if (itemUnit === 'kg') {
                price = rate * (parseFloat(cartItem.quantity) || 0);
            } else if (itemUnit === 'gm') {
                price = (rate * (parseFloat(cartItem.quantity) || 0)) / 1000;
            } else if (itemUnit === 'Pc' || itemUnit === 'Carton') {
                price = cartItem.price || 0;
            }
            const productName = cartItem.productName || '';
            doc.text((index + 1).toString(), xPositions.sno, yPosition);
            doc.text(productName, xPositions.product, yPosition, { maxWidth: xPositions.qty - xPositions.product - 2 });
            doc.text(cartItem.quantity.toString(), xPositions.qty, yPosition);
            doc.text(itemUnit, xPositions.unit, yPosition);
            doc.text('Rs. ' + rate.toFixed(2), xPositions.rate, yPosition);
            doc.text('Rs. ' + price.toFixed(2), xPositions.price, yPosition);
            yPosition += 8;
        });
        const totalY = yPosition + 10;
        doc.line(20, totalY - 5, 190, totalY - 5);
        doc.setFont('times', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(0, 100, 0); // Deep green
        doc.text('TOTAL AMOUNT: Rs. ' + total.toFixed(2), 105, totalY + 8, { align: 'center' });
        doc.setFont('times', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(255, 87, 34); // Orange for final discount
        doc.text('Final Discount: ' + finalDiscount.toFixed(2) + '%', 105, totalY + 18, { align: 'center' });
        doc.setFont('times', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(0, 100, 0); // Green for discounted total
        doc.text('Discounted Total Amount: Rs. ' + discountedTotal.toFixed(2), 105, totalY + 28, { align: 'center' });
        doc.setFont('times', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(255, 87, 34); // Orange for GST
        doc.text('GST: ' + gst.toFixed(2) + '%', 105, totalY + 38, { align: 'center' });
        doc.setFont('times', 'bold');
        doc.setFontSize(20); // Increased size for final amount
        doc.setTextColor(255, 87, 34); // Orange for final amount
        doc.text('Final Amount to be Paid: Rs. ' + finalAmount.toFixed(2), 105, totalY + 55, { align: 'center' });
        doc.setTextColor(0, 0, 0); // Reset to black for footer
        const footerY = totalY + 60; // Increased vertical gap before footer
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        if (customerName || customerMobile) {
            doc.text(`Customer: ${customerName}`, 105, footerY, { align: 'center' });
            doc.text(`Mobile: ${customerMobile}`, 105, footerY + 7, { align: 'center' });
        }
        doc.setFontSize(8);
        doc.text('Thank you for shopping with Kalimata Grocery!', 105, footerY + 14, { align: 'center' });
        doc.text('Visit us again for fresh products and great deals.', 105, footerY + 21, { align: 'center' });
        doc.text('Terms: All sales are final. Exchange only with receipt within 24 hours.', 105, footerY + 34, { align: 'center' });
        const fileName = 'Kalimata_Grocery_Bill_' + billNumber + '.pdf';
        doc.save(fileName);
        alert('Bill generated successfully! File saved as: ' + fileName);
        // Remove CSV/JSON download functionality
        // this.appendCustomerProfile({
        //     customerName,
        //     customerMobile,
        //     billNumber,
        //     date: currentDate.toLocaleDateString(),
        //     time: currentDate.toLocaleTimeString(),
        //     itemsPurchased,
        //     finalAmount: finalAmount.toFixed(2)
        // });
        // this.appendCustomerProfileJSON({
        //     customerName,
        //     customerMobile,
        //     billNumber,
        //     date: currentDate.toLocaleDateString(),
        //     time: currentDate.toLocaleTimeString(),
        //     itemsPurchased,
        //     finalAmount: finalAmount.toFixed(2)
        // });
        this.closeModal();
    }

    generateMartBill() {
        if (!this.currentCheckout) {
            alert('No checkout data available.');
            return;
        }
        let total = 0;
        let validItems = this.currentCheckout.validItems;
        validItems.forEach(cartItem => {
            let itemUnit = cartItem.unit || 'kg';
            let discountedPrice = 0;
            if (itemUnit === 'Pc' || itemUnit === 'Carton') {
                discountedPrice = (cartItem.price || 0) * (100 - (cartItem.discount || 0)) / 100;
            } else if (itemUnit === 'kg') {
                discountedPrice = (cartItem.rate || 0) * (parseFloat(cartItem.quantity) || 0) * (100 - (cartItem.discount || 0)) / 100;
            } else if (itemUnit === 'gm') {
                discountedPrice = ((cartItem.rate || 0) * (parseFloat(cartItem.quantity) || 0) / 1000) * (100 - (cartItem.discount || 0)) / 100;
            }
            total += discountedPrice;
        });
        const finalDiscountInput = document.getElementById('final-discount-input');
        const gstInput = document.getElementById('gst-input');
        let finalDiscount = parseFloat(finalDiscountInput.value) || 0;
        let gst = parseFloat(gstInput.value) || 0;
        let discountedTotal = total * (100 - finalDiscount) / 100;
        let finalAmount = discountedTotal * (100 + gst) / 100;
        // Fetch customer info for Mart Bill
        const customerName = document.getElementById('customer-name').value || '';
        const customerMobile = document.getElementById('customer-mobile').value || '';
        this.createMartPDFBill(validItems, total, finalDiscount, gst, discountedTotal, finalAmount, customerName, customerMobile);
    }

    createMartPDFBill(validItems, total, finalDiscount, gst, discountedTotal, finalAmount, customerName, customerMobile) {
        const { jsPDF } = window.jspdf;
        const width = 76.2 * 2.83465; // 3 inches in points
        const height = 105 * 2.83465;
        const doc = new jsPDF({ unit: 'pt', format: [width, height] });
        doc.setFont('times', 'bold');
        doc.setFontSize(10);
        doc.text('KALI MATA ENTERPRISES', width/2, 20, { align: 'center' });
        doc.setFont('times', 'normal');
        doc.setFontSize(7);
        doc.text('Ground Floor, 493 Nabajiban Colony', width/2, 32, { align: 'center' });
        doc.text('Nabajiban School Road, Kolkata, WB-700158', width/2, 41, { align: 'center' });
        doc.text('Phone: +91 93303 53449', width/2, 50, { align: 'center' });
        doc.line(10, 56, width-10, 56);
        // Bill number, date & time
        const billNumber = 'Kalimata_' + Date.now().toString().slice(-6);
        const currentDate = new Date();
        const billInfo = `Bill No: ${billNumber}    Date: ${currentDate.toLocaleDateString()}    Time: ${currentDate.toLocaleTimeString()}`;
        doc.setFont('times', 'normal');
        doc.setFontSize(7);
        doc.text(billInfo, 12, 66, { align: 'left' });
        doc.line(10, 72, width-10, 72);
        // Table header
        const leftMargin = 12;
        const colWidths = [32, 18, 18, 28, 28];
        let headerX = [];
        let x = leftMargin;
        for (let w of colWidths) {
            headerX.push(x);
            x += w;
        }
        doc.setFont('times', 'bold');
        doc.setFontSize(7);
        doc.text('Product', headerX[0], 80, { maxWidth: colWidths[0] - 2 });
        doc.text('Qty', headerX[1], 80, { maxWidth: colWidths[1] - 2 });
        doc.text('Unit', headerX[2], 80, { maxWidth: colWidths[2] - 2 });
        doc.text('Rate', headerX[3], 80, { maxWidth: colWidths[3] - 2 });
        doc.text('Price', headerX[4], 80, { maxWidth: colWidths[4] - 2 });
        doc.line(10, 84, width-10, 84);
        doc.setFont('times', 'normal');
        doc.setFontSize(7);
        let yPosition = 96;
        validItems.forEach((cartItem, index) => {
            let itemUnit = cartItem.unit || 'kg';
            let price = 0;
            let rate = cartItem.rate || 0;
            if (itemUnit === 'kg') {
                price = rate * (parseFloat(cartItem.quantity) || 0);
            } else if (itemUnit === 'gm') {
                price = (rate * (parseFloat(cartItem.quantity) || 0)) / 1000;
            } else if (itemUnit === 'Pc' || itemUnit === 'Carton') {
                price = cartItem.price || 0;
            }
            const productName = cartItem.productName || '';
            doc.text(productName, headerX[0], yPosition, { maxWidth: colWidths[0] - 2 });
            doc.text((cartItem.quantity ? cartItem.quantity.toString() : ''), headerX[1], yPosition, { maxWidth: colWidths[1] - 2 });
            doc.text(itemUnit, headerX[2], yPosition, { maxWidth: colWidths[2] - 2 });
            doc.text('Rs.' + rate.toFixed(2), headerX[3], yPosition, { maxWidth: colWidths[3] - 2 });
            doc.text('Rs.' + price.toFixed(2), headerX[4], yPosition, { maxWidth: colWidths[4] - 2 });
            yPosition += 18;
        });
        doc.line(10, yPosition - 6, width-10, yPosition - 6);
        doc.setFont('times', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(0, 100, 0);
        doc.text('TOTAL: Rs. ' + total.toFixed(2), width/2, yPosition+18, { align: 'center' });
        doc.setFont('times', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(255, 87, 34);
        doc.text('Final Discount: ' + finalDiscount.toFixed(2) + '%', width/2, yPosition+26, { align: 'center' });
        doc.setFont('times', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(0, 100, 0);
        doc.text('Discounted Total: Rs. ' + discountedTotal.toFixed(2), width/2, yPosition+34, { align: 'center' });
        doc.setFont('times', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(255, 87, 34);
        doc.text('GST: ' + gst.toFixed(2) + '%', width/2, yPosition+42, { align: 'center' });
        doc.setFont('times', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(255, 87, 34);
        doc.text('Final Amount: Rs. ' + finalAmount.toFixed(2), width/2, yPosition+52, { align: 'center' });
        doc.setTextColor(0, 0, 0);
        doc.setFont('times', 'normal');
        doc.setFontSize(7);
        // Add customer info at the bottom of Mart Bill
        let customerInfoY = yPosition + 60;
        if (customerName || customerMobile) {
            doc.text(`Customer: ${customerName}`, width/2, customerInfoY, { align: 'center' });
            doc.text(`Mobile: ${customerMobile}`, width/2, customerInfoY + 10, { align: 'center' });
            customerInfoY += 20;
        }
        doc.text('Thank you for shopping!', width/2, customerInfoY, { align: 'center' });
        const fileName = billNumber + '.pdf';
        doc.save(fileName);
        alert('Mart Bill generated successfully! File saved as: ' + fileName);
        // Remove CSV/JSON download functionality
        // this.appendCustomerProfile({
        //     customerName,
        //     customerMobile,
        //     billNumber,
        //     date: currentDate.toLocaleDateString(),
        //     time: currentDate.toLocaleTimeString(),
        //     itemsPurchased,
        //     finalAmount: finalAmount.toFixed(2)
        // });
        // this.appendCustomerProfileJSON({
        //     customerName,
        //     customerMobile,
        //     billNumber,
        //     date: currentDate.toLocaleDateString(),
        //     time: currentDate.toLocaleTimeString(),
        //     itemsPurchased,
        //     finalAmount: finalAmount.toFixed(2)
        // });
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
