TRAIL-AR/
	public/ 
		3D_Demo/
			grill_white.glb
			wall.glb
			wall.usdz
		admin_booking.html
		admin.htmls
		book.html
		homepage_photos/
			gate1.jpg
			gate2.jpg
			grills1.jpg
			grills2.jpg
			gailings1.jpg
			gailings2.jpg	
			gelding.jpg
		index.html
		product_grills.html
		product_railings.html
		products.html
		qr.png
		style.css
	node_modules
	package-lock.json
	package.json
	server.js
	README.md

-------------------------------
admim_booking.html
-------------------------------
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Panel | IronLinks</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Iron <span>works</span> Admin Booking</h1>
    <nav>
      <a href="index.html">Home</a> |
      <a href="admin_booking.html">Bookings</a> |
      <a href="admin.html">Gallery</a>
    </nav>
</header>

  <section class="admin-section">
    <h2>Bookings</h2>
    <table id="bookings-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Date</th>
          <th>Time</th>
          <th>Request</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </section>

  <script>
    async function loadBookings() {
      const tbody = document.querySelector('#bookings-table tbody');
      tbody.innerHTML = '';

      try {
        const res = await fetch('/bookings');
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        data.forEach(b => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${b.id}</td>
            <td>${b.name}</td>
            <td>${b.email}</td>
            <td>${b.phone}</td>
            <td>${b.date}</td>
            <td>${b.time || ''}</td>
            <td>${b.request || ''}</td>
            <td>${b.created_at}</td>
          `;
          tbody.appendChild(tr);
        });

      } catch (err) {
        console.error("Error fetching bookings:", err);
        tbody.innerHTML = `<tr><td colspan="8">Failed to load bookings</td></tr>`;
      }
    }

    window.addEventListener('DOMContentLoaded', loadBookings);
  </script>
</body>
</html>

----------------------------
admin.html
----------------------------
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin | IronLinks</title>
<link rel="stylesheet" href="style.css">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Open+Sans&display=swap" rel="stylesheet">
</head>
<body>

<header>
    <h1>Iron <span>works</span> Admin</h1>
    <nav>
      <a href="index.html">Home</a> |
      <a href="admin_booking.html">Bookings</a> |
      <a href="admin.html">Gallery</a>
    </nav>
</header>

<section class="gallery" id="gallery-section">
    <h2>Gallery Management</h2>
    <form id="uploadForm" class="book-form" enctype="multipart/form-data">
        <input type="text" name="category" placeholder="Category (e.g., Gate, Railings)" required>
        <input type="file" name="image" accept="image/*" required>
        <button type="submit">Add Image</button>
    </form>
    <p id="statusMessage" style="color:green;"></p>
    <div id="galleryContainer">
        <h3>Existing Gallery</h3>
        <div class="gallery-grid" id="galleryGrid"></div>
    </div>
</section>

<script>
// -----------------------------
// Load Bookings from Supabase
// -----------------------------
async function loadBookings() {
    try {
        const res = await fetch('/bookings');
        const data = await res.json();
        const tbody = document.querySelector("#bookingsTable tbody");
        tbody.innerHTML = "";
        data.forEach(booking => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${booking.name}</td>
                <td>${booking.email}</td>
                <td>${booking.phone}</td>
                <td>${booking.date}</td>
                <td>${booking.time}</td>
                <td>${booking.request || ''}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
    }
}

// -----------------------------
// Gallery Upload
// -----------------------------
const uploadForm = document.getElementById('uploadForm');
const statusMessage = document.getElementById('statusMessage');
const galleryGrid = document.getElementById('galleryGrid');

async function loadGallery() {
    try {
        const res = await fetch('/gallery');
        const data = await res.json();
        galleryGrid.innerHTML = '';
        data.forEach(item => {
            const img = document.createElement('img');
            img.src = item.url;
            img.alt = item.category;
            galleryGrid.appendChild(img);
        });
    } catch (err) {
        console.error(err);
    }
}

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(uploadForm);
    try {
        const res = await fetch('/gallery', { method: 'POST', body: formData });
        const text = await res.text();
        if (!res.ok) throw new Error(text);
        statusMessage.textContent = 'Image added successfully!';
        uploadForm.reset();
        loadGallery();
    } catch (err) {
        statusMessage.style.color = 'red';
        statusMessage.textContent = err.message;
    }
});

// -----------------------------
// Initialize
// -----------------------------
loadBookings();
loadGallery();
</script>

</body>
</html>


----------------------------------
book.html
----------------------------------
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Book Consultation | IronLinks</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<header>
    <h1>Iron <span>works</span></h1>
    <nav>
      <a href="index.html">about us</a> |
      <a href="products.html">products</a> |
      <a href="book.html">book now</a> |
      <a href="#contact">contact</a>
    </nav>
</header>

<section class="book-section">
    <h2>Book a Consultation</h2>
    <form id="bookingForm" class="book-form" method="POST" action="/book">
        <!-- Name: letters only -->
        <input type="text" name="name" placeholder="Full Name" pattern="[A-Za-z\s]+" title="Letters only" required>

        <!-- Email: native validation -->
        <input type="email" name="email" placeholder="Email" required>

        <!-- Phone: 11 digits starting with 09 -->
        <input type="tel" name="phone" placeholder="Phone Number (09XXXXXXXXX)" pattern="09[0-9]{9}" title="11 digits starting with 09" required>

        <!-- Date: no past dates -->
        <input type="date" name="date" id="dateInput" required>

        <input type="time" name="time" required>
        <textarea name="request" placeholder="Additional Details"></textarea>
        <button type="submit">Submit Booking</button>
    </form>
    <p id="statusMessage" style="color:red;"></p>
</section>

<script>
  // Prevent past dates
  const dateInput = document.getElementById('dateInput');
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

  // Handle form submission
  const form = document.getElementById('bookingForm');
  const statusMessage = document.getElementById('statusMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    statusMessage.textContent = '';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const text = await res.text();

      if (!res.ok) throw new Error(text);

      alert("Booking successful!");
      form.reset();
    } catch (err) {
      statusMessage.textContent = err.message;
    }
  });
</script>

<footer id="contact">
  <div class="footer-container">
    <h2>Contact Us</h2>
    <p>📍 Address</p>
    <p>📱 Phone Number</p>
    <p>📧 email</p>
    <div class="social-links">
      <a href="#">Facebook</a> |
      <a href="#">Messenger</a>
    </div>
    <p class="footer-note">© 2025 IronLinks. All Rights Reserved.</p>
  </div>
</footer>
</body>
</html>


---------------------------------
index.html
---------------------------------
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IronLinks | Iron Works</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Open+Sans&display=swap" rel="stylesheet">
</head>
<body>

    <!-- Header -->
    <header>
        <h1>Iron <span>works</span></h1>
        <nav>
          <a href="#about">about us</a> |
          <a href="products.html">products</a> |
          <a href="book.html">book now</a> |
          <a href="#contact">contact</a>
        </nav>
    </header>      

    <!-- Hero Section -->
    <section class="hero">
        <img src="hompage_photos/welding.jpg" alt="Welding Work">
        <blockquote>
            “We combine traditional iron craftsmanship 
            with modern technology to bring your custom designs to life.”
        </blockquote>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <h2>About Us</h2>
        <p><strong>IronLinks</strong> is a modern platform that connects customers with skilled local iron workers.
        We combine traditional craftsmanship with new technology to make custom iron designs easier to plan, view, and order online.</p>

        <p>Our goal is to help small ironwork businesses grow through digital innovation while promoting sustainable and smart city development.</p>

        <h3>🌐 Our SDG Commitment</h3>
        <ul>
            <li><b>SDG 8:</b> Decent Work and Economic Growth – We support local ironworkers by giving them online opportunities to reach more customers.</li>
            <li><b>SDG 9:</b> Industry, Innovation, and Infrastructure – We use emerging technology like cloud systems and AR to modernize the iron works industry.</li>
            <li><b>SDG 11:</b> Sustainable Cities and Communities – Our iron designs help build durable, safe, and beautiful communities.</li>
        </ul>
    </section>

    <!-- Gallery Section -->
    <section class="gallery" id="products">
        <h2>Gallery</h2>

        <h3>Gate</h3>
        <div class="gallery-grid">
            <img src="hompage_photos/gate1.jpg" alt="Gate Design 1">
            <img src="hompage_photos/gate2.jpg" alt="Gate Design 2">
        </div>

        <h3>Railings</h3>
        <div class="gallery-grid">
            <img src="hompage_photos/railings1.jpg" alt="Railing Design 1">
            <img src="hompage_photos/railings2.jpg" alt="Railing Design 2">
        </div>

        <h3>Grills</h3>
        <div class="gallery-grid">
            <img src="hompage_photos/grills1.jpg" alt="Grill Design 1">
            <img src="hompage_photos/grills2.jpg" alt="Grill Design 2">
        </div>
    </section>
<!-- FOOTER -->
<footer id="contact">
    <div class="footer-container">
      <h2>Contact Us</h2>
      <p>📍 Address</p>
      <p>📱 Phone Number</p>
      <p>📧 email</p>
  
      <div class="social-links">
        <a href="#">Facebook</a> |
        <a href="#">Messenger</a>
      </div>
  
      <p class="footer-note">© 2025 IronLinks. All Rights Reserved.</p>
    </div>
  </footer>
  
</body>
</html>

-----------------------------
products_grills.html
-----------------------------
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Our Products | IronLinks</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Open+Sans&display=swap" rel="stylesheet">

  <!-- Google Model Viewer -->
  <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
</head>
<body>

  <!-- Header -->
  <header>
    <h1>Iron <span>works</span></h1>
    <nav>
      <a href="index.html">about us</a> |
      <a href="products.html">products</a> |
      <a href="book.html">book now</a> |
      <a href="#contact">contact</a>
    </nav>
  </header>

  <!-- Product Section -->
  <section class="product-section">
    <h2>Our Products</h2>
    <h3>Grills</h3>
    <div class="product-nav">
      <button onclick="location.href='products.html'">Gates</button>
      <button class="active" onclick="location.href='product_grills.html'">Grills</button>
      <button onclick="location.href='product_railings.html'">Railings</button>
    </div>    
    <div class="product-container">

      <!-- Product Image and 3D/AR View -->
      <div class="product-image">
        <!-- Static image (default view) -->
        <img src="hompage_photos/grills2.jpg" alt="Iron Grills" id="mainImage">

        <!-- 3D & AR viewer -->
        <model-viewer
          id="gate3D"
          src="3D_Demo/wall.glb"
          ios-src="3D_Demo/wall.usdz"
          alt="Iron Gate 3D Model"
          auto-rotate
          camera-controls
          ar
          ar-modes="webxr scene-viewer quick-look"
          style="display: none;"
        ></model-viewer>

        <div class="product-icons">
          <button id="view3d">3D View</button>
          <button id="viewQR">QR Code</button>
        </div>

        <p class="ar-notice">📱 Tap “View in AR” (on mobile) to place it in your space!</p>
      </div>

      <!-- Product Details -->
      <div class="product-details">
        <h3>Iron Window Grill Display</h3>
        <ul>
          <li>Wrought Iron (Standard)</li>
          <li>Powder-Coated (Matte Black)</li>
          <li>Fully Welded Joints</li>
        </ul>
    

        <div class="quote-box">
          <h4>Start Your Custom Project</h4>
          <p>Schedule a free consultation to discuss your custom gate, grill, or railing design.</p>
          <button class="quote-btn">Request a Quote</button>
        </div>
      </div>
    </div>
  </section>

  <!-- QR Code Modal -->
  <div id="qrModal" class="modal">
    <div class="modal-content">
      <h3>Scan to View in AR</h3>
      <img src="qr.png" alt="QR Code" id="qrImage">
      <br><br>
      <button id="closeQR">Close</button>
    </div>
  </div>

  <script>
    // 3D view toggle
    const view3dBtn = document.getElementById("view3d");
    const model3D = document.getElementById("gate3D");
    const mainImage = document.getElementById("mainImage");

    view3dBtn.addEventListener("click", () => {
      const isHidden = model3D.style.display === "none" || model3D.style.display === "";
      model3D.style.display = isHidden ? "block" : "none";
      mainImage.style.display = isHidden ? "none" : "block";
      view3dBtn.textContent = isHidden ? "Image View" : "3D View";
    });

    // QR Code modal
    const viewQRBtn = document.getElementById("viewQR");
    const qrModal = document.getElementById("qrModal");
    const closeQRBtn = document.getElementById("closeQR");

    viewQRBtn.addEventListener("click", () => {
      qrModal.style.display = "flex";
    });

    closeQRBtn.addEventListener("click", () => {
      qrModal.style.display = "none";
    });

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === qrModal) qrModal.style.display = "none";
    });
  </script>

<footer id="contact">
    <div class="footer-container">
      <h2>Contact Us</h2>
      <p>📍 Address</p>
      <p>📱 Phone Number</p>
      <p>📧 email</p>
  
      <div class="social-links">
        <a href="#">Facebook</a> |
        <a href="#">Messenger</a>
      </div>
  
      <p class="footer-note">© 2025 IronLinks. All Rights Reserved.</p>
    </div>
  </footer>
</body>
</html>


-------------------------------
products_railings.html
--------------------------------
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Our Products | IronLinks</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Open+Sans&display=swap" rel="stylesheet">

  <!-- Google Model Viewer -->
  <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
</head>
<body>

  <!-- Header -->
  <header>
    <h1>Iron <span>works</span></h1>
    <nav>
      <a href="index.html">about us</a> |
      <a href="products.html">products</a> |
      <a href="book.html">book now</a> |
      <a href="#contact">contact</a>
    </nav>
  </header>

  <!-- Product Section -->
  <section class="product-section">
    <h2>Our Products</h2>
    <h3>Railings</h3>
    <div class="product-nav">
        <button onclick="location.href='products.html'">Gates</button>
        <button onclick="location.href='product_grills.html'">Grills</button>
        <button class="active" onclick="location.href='product_railings.html'">Railings</button>
      </div>      
    <div class="product-container">

      <!-- Product Image and 3D/AR View -->
      <div class="product-image">
        <!-- Static image (default view) -->
        <img src="hompage_photos/railings1.jpg" alt="Iron Railings" id="mainImage">

        <!-- 3D & AR viewer -->
        <model-viewer
          id="gate3D"
          src="3D_Demo/wall.glb"
          ios-src="3D_Demo/wall.usdz"
          alt="Iron Gate 3D Model"
          auto-rotate
          camera-controls
          ar
          ar-modes="webxr scene-viewer quick-look"
          style="display: none;"
        ></model-viewer>

        <div class="product-icons">
          <button id="view3d">3D View</button>
          <button id="viewQR">QR Code</button>
        </div>

        <p class="ar-notice">📱 Tap “View in AR” (on mobile) to place it in your space!</p>
      </div>

      <!-- Product Details -->
      <div class="product-details">
        <h3>Balcony Railing Display</h3>
        <ul>
          <li>Wrought Iron (Standard)</li>
          <li>Powder-Coated (Matte Black)</li>
          <li>Fully Welded Joints</li>
        </ul>

        <div class="quote-box">
          <h4>Start Your Custom Project</h4>
          <p>Schedule a free consultation to discuss your custom gate, grill, or railing design.</p>
          <button class="quote-btn">Request a Quote</button>
        </div>
      </div>
    </div>
  </section>

  <!-- QR Code Modal -->
  <div id="qrModal" class="modal">
    <div class="modal-content">
      <h3>Scan to View in AR</h3>
      <img src="qr.png" alt="QR Code" id="qrImage">
      <br><br>
      <button id="closeQR">Close</button>
    </div>
  </div>

  <script>
    // 3D view toggle
    const view3dBtn = document.getElementById("view3d");
    const model3D = document.getElementById("gate3D");
    const mainImage = document.getElementById("mainImage");

    view3dBtn.addEventListener("click", () => {
      const isHidden = model3D.style.display === "none" || model3D.style.display === "";
      model3D.style.display = isHidden ? "block" : "none";
      mainImage.style.display = isHidden ? "none" : "block";
      view3dBtn.textContent = isHidden ? "Image View" : "3D View";
    });

    // QR Code modal
    const viewQRBtn = document.getElementById("viewQR");
    const qrModal = document.getElementById("qrModal");
    const closeQRBtn = document.getElementById("closeQR");

    viewQRBtn.addEventListener("click", () => {
      qrModal.style.display = "flex";
    });

    closeQRBtn.addEventListener("click", () => {
      qrModal.style.display = "none";
    });

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === qrModal) qrModal.style.display = "none";
    });
  </script>

<footer id="contact">
    <div class="footer-container">
      <h2>Contact Us</h2>
      <p>📍 Address</p>
      <p>📱 Phone Number</p>
      <p>📧 email</p>
  
      <div class="social-links">
        <a href="#">Facebook</a> |
        <a href="#">Messenger</a>
      </div>
  
      <p class="footer-note">© 2025 IronLinks. All Rights Reserved.</p>
    </div>
  </footer>
</body>
</html>


------------------------------
products.html
------------------------------
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Our Products | IronLinks</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Open+Sans&display=swap" rel="stylesheet">

  <!-- Google Model Viewer -->
  <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
</head>
<body>

  <!-- Header -->
  <header>
    <h1>Iron <span>works</span></h1>
    <nav>
      <a href="index.html">about us</a> |
      <a href="products.html">products</a> |
      <a href="book.html">book now</a> |
      <a href="#contact">contact</a>
    </nav>
  </header>

  <!-- Product Section -->
  <section class="product-section">
    <h2>Our Products</h2>
    <h3>Gates</h3>
    <div class="product-nav">
      <button class="active" onclick="location.href='products.html'">Gates</button>
      <button onclick="location.href='product_grills.html'">Grills</button>
      <button onclick="location.href='product_railings.html'">Railings</button>
    </div>    
    <div class="product-container">

      <!-- Product Image and 3D/AR View -->
      <div class="product-image">
        <!-- Static image (default view) -->
        <img src="hompage_photos/gate2.jpg" alt="Iron Gate" id="mainImage">

        <!-- 3D & AR viewer -->
        <model-viewer
          id="gate3D"
          src="3D_Demo/Grill_white.glb"
          ios-src="3D_Demo/wall.usdz"
          alt="Iron Gate 3D Model"
          auto-rotate
          camera-controls
          ar
          ar-modes="webxr scene-viewer quick-look"
          style="display: none;"
        ></model-viewer>

        <div class="product-icons">
          <button id="view3d">3D View</button>
          <button id="viewQR">QR Code</button>
        </div>

        <p class="ar-notice">📱 Tap “View in AR” (on mobile) to place it in your space!</p>
      </div>

      <!-- Product Details -->
      <div class="product-details">
        <h3>Modular Arc Gate Display (MAGD)</h3>
        <ul>
          <li>Wrought Iron (Standard)</li>
          <li>Powder-Coated (Matte Black)</li>
          <li>Fully Welded Joints</li>
        </ul>
        

        <div class="quote-box">
          <h4>Start Your Custom Project</h4>
          <p>Schedule a free consultation to discuss your custom gate, grill, or railing design.</p>
          <button class="quote-btn">Request a Quote</button>
        </div>
      </div>
    </div>
  </section>

  <!-- QR Code Modal -->
  <div id="qrModal" class="modal">
    <div class="modal-content">
      <h3>Scan to View in AR</h3>
      <img src="qr.png" alt="QR Code" id="qrImage">
      <br><br>
      <button id="closeQR">Close</button>
    </div>
  </div>

  <script>
    // 3D view toggle
    const view3dBtn = document.getElementById("view3d");
    const model3D = document.getElementById("gate3D");
    const mainImage = document.getElementById("mainImage");

    view3dBtn.addEventListener("click", () => {
      const isHidden = model3D.style.display === "none" || model3D.style.display === "";
      model3D.style.display = isHidden ? "block" : "none";
      mainImage.style.display = isHidden ? "none" : "block";
      view3dBtn.textContent = isHidden ? "Image View" : "3D View";
    });

    // QR Code modal
    const viewQRBtn = document.getElementById("viewQR");
    const qrModal = document.getElementById("qrModal");
    const closeQRBtn = document.getElementById("closeQR");

    viewQRBtn.addEventListener("click", () => {
      qrModal.style.display = "flex";
    });

    closeQRBtn.addEventListener("click", () => {
      qrModal.style.display = "none";
    });

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === qrModal) qrModal.style.display = "none";
    });
  </script>

<footer id="contact">
    <div class="footer-container">
      <h2>Contact Us</h2>
      <p>📍 Address</p>
      <p>📱 Phone Number</p>
      <p>📧 email</p>
  
      <div class="social-links">
        <a href="#">Facebook</a> |
        <a href="#">Messenger</a>
      </div>
  
      <p class="footer-note">© 2025 IronLinks. All Rights Reserved.</p>
    </div>
  </footer>
</body>
</html>

---------------------------------------
style.css
----------------------------------------
/* ===============================
   GLOBAL
================================ */
body {
    font-family: 'Open Sans', sans-serif;
    margin: 0;
    background-color: #f7f7f7;
    color: #333;
}

/* ===============================
   HEADER
================================ */
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 40px;
    background: #fff;
    border-bottom: 1px solid #ddd;
}

header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    letter-spacing: 2px;
}

header span {
    font-weight: 300;
}

header nav a {
    text-decoration: none;
    color: #333;
    margin: 0 8px;
    font-size: 14px;
}

header nav a:hover {
    text-decoration: underline;
}

/* ===============================
   HERO SECTION
================================ */
.hero {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: 40px 20px;
    background-color: #fff;
}

.hero img {
    width: 400px;
    max-width: 90%;
    border-radius: 5px;
}

.hero blockquote {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-style: italic;
    width: 300px;
    line-height: 1.6;
}

/* ===============================
   ABOUT SECTION
================================ */
.about {
    background-color: #e7e5e5;
    margin: 40px auto;
    padding: 30px 40px;
    max-width: 700px;
    border-radius: 5px;
    text-align: left;
}

.about h2 {
    font-family: 'Playfair Display', serif;
    text-align: center;
    font-size: 28px;
    margin-bottom: 15px;
}

.about h3 {
    margin-top: 20px;
    font-weight: bold;
}

.about ul {
    padding-left: 20px;
    line-height: 1.6;
}

/* ===============================
   GALLERY SECTION
================================ */
.gallery {
    text-align: center;
    background-color: #f0f0f0;
    padding: 50px 20px;
}

.gallery h2 {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    margin-bottom: 30px;
}

.gallery h3 {
    font-style: italic;
    color: #666;
    margin: 30px 0 15px;
}

.gallery-grid {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
}

.gallery-grid img {
    width: 280px;
    height: auto;
    border-radius: 5px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    transition: transform 0.3s ease;
}

.gallery-grid img:hover {
    transform: scale(1.03);
}

/* ===============================
   FOOTER
================================ */
footer {
    background-color: #222;
    color: white;
    padding: 40px 20px;
    text-align: center;
    margin-top: 50px;
}

.footer-container h2 {
    font-family: 'Playfair Display', serif;
    margin-bottom: 10px;
    font-size: 22px;
}

.footer-container p {
    margin: 5px 0;
    font-size: 14px;
}

.social-links {
    margin: 10px 0;
}

.social-links a {
    color: #ddd;
    text-decoration: none;
    font-size: 14px;
    margin: 0 5px;
}

.social-links a:hover {
    color: #fff;
    text-decoration: underline;
}

.footer-note {
    font-size: 12px;
    margin-top: 15px;
    color: #aaa;
}

/* ===============================
   PRODUCT PAGE
================================ */
.product-section {
    text-align: center;
    padding: 50px 20px;
    background-color: #f7f7f7;
}

.product-section h2 {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    margin-bottom: 20px;
    color: #444;
}

.product-section h3 {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    margin-bottom: 20px;
    color: #555;
}

/* ===============================
   PRODUCT NAV BUTTONS
================================ */
.product-nav {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 25px 0;
    flex-wrap: wrap;
}

.product-nav button {
    background-color: #fff;
    border: 1.5px solid #ccc; /* lighter border */
    border-radius: 20px;
    padding: 8px 20px;       /* smaller size */
    font-size: 14px;         /* smaller text */
    font-weight: 500;
    cursor: pointer;
    color: #333;
    transition: all 0.3s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.product-nav button:hover {
    background-color: #f0f0f0;
    color: #111;
    box-shadow: 0 3px 8px rgba(0,0,0,0.1);
}

.product-nav button.active {
    background-color: #e0e0e0;
    color: #111;
    box-shadow: 0 3px 8px rgba(0,0,0,0.1);
}

@media (max-width: 600px) {
    .product-nav {
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }

    .product-nav button {
        width: 70%;
        padding: 10px 0;
    }
}

/* ===============================
   PRODUCT CONTAINER
================================ */
.product-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    max-width: 1000px;
    margin: auto;
    overflow: hidden;
    padding: 20px;
}

/* ===============================
   PRODUCT IMAGE + VIEWER
================================ */
.product-image {
    position: relative;
    width: 400px;
    margin: 20px;
    background-color: #e6e6e6;
    border-radius: 25px;
    padding: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.product-image img,
.product-image model-viewer {
    width: 100%;
    height: 350px;
    border-radius: 15px;
    object-fit: cover;
    margin-bottom: 15px;
    display: block;
}

/* BUTTONS UNDER IMAGE */
.product-icons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 15px;
}

.product-icons button {
    background-color: #ddd;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease;
}

.product-icons button:hover {
    background-color: #bbb;
}

/* ===============================
   PRODUCT DETAILS
================================ */
.product-details {
    width: 400px;
    text-align: left;
    margin: 20px;
}

.product-details h3 {
    font-family: 'Playfair Display', serif;
    margin-bottom: 10px;
}

.product-details ul {
    list-style: none;
    padding-left: 0;
}

.product-details li::before {
    content: "✔ ";
    color: #4a90e2;
}

/* ===============================
   QUOTE BOX
================================ */
.quote-box {
    background: #f0f0f0;
    padding: 15px;
    border-radius: 8px;
    margin-top: 20px;
}

.quote-btn {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 8px 14px;
    cursor: pointer;
}

.quote-btn:hover {
    background-color: #0056b3;
}

/* ===============================
   QR MODAL
================================ */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0; 
    top: 0;
    width: 100%; 
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: #fff;
    padding: 30px 40px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.modal-content img {
    width: 200px;
    height: 200px;
}

.modal-content button {
    margin-top: 15px;
    padding: 10px 20px;
    background-color: #444;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.modal-content button:hover {
    background-color: #666;
}

/* ===============================
   BOOKING PAGE
================================ */
.book-section {
    max-width: 600px;
    margin: 50px auto;
    padding: 30px 20px;
    background-color: #f9f9f9;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    font-family: 'Open Sans', sans-serif;
}

.book-section h2 {
    text-align: center;
    font-family: 'Playfair Display', serif;
    color: #333;
    margin-bottom: 20px;
}

.book-form input,
.book-form textarea,
.book-form button {
    width: 100%;
    padding: 12px 15px;
    margin: 10px 0;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 14px;
    box-sizing: border-box;
}

.book-form textarea {
    resize: vertical;
    min-height: 100px;
}

.book-form button {
    background-color: #444;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 16px;
    transition: 0.3s;
}

.book-form button:hover {
    background-color: #666;
}

.book-form input:focus,
.book-form textarea:focus {
    outline: none;
    border-color: gray;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}


/* ===============================
   BOOKING MODAL
================================ */
#bookingModal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0; 
    top: 0;
    width: 100%; 
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    justify-content: center;
    align-items: center;
}

#bookingModalContent {
    background-color: #fff;
    padding: 30px 40px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

#bookingModalContent p {
    font-size: 18px;
    margin-bottom: 20px;
}

#bookingModalContent button {
    padding: 10px 20px;
    background-color: #444;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

#bookingModalContent button:hover {
    background-color: #666;
}

/* ===============================
   RESPONSIVE DESIGN
================================ */
@media (max-width: 900px) {
    .product-container {
        flex-direction: column;
        align-items: center;
    }
    .product-image, .product-details {
        width: 90%;
    }
}



---------------------------------
server.js
---------------------------------
import 'dotenv/config'; 
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Home route
app.get("/", (req, res) => 
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

// ============================
// CREATE BOOKING
// ============================
app.post("/book", async (req, res) => {
  const { name, email, phone, date, time, request } = req.body;

  if (!name || !email || !phone || !date || !time) {
    return res.status(400).send("Please fill in all required fields.");
  }

  // Check for duplicate booking
  const { data: existing = [], error: checkError } = await supabase
    .from("bookings")
    .select("*")
    .eq("date", date)
    .eq("time", time);

  if (checkError) {
    console.error(checkError);
    return res.status(500).send("Database error.");
  }

  if (existing.length > 0) {
    return res
      .status(400)
      .send("This date and time is already booked. Please choose another.");
  }

  // Insert new booking
  const { error } = await supabase.from("bookings").insert([
    { name, email, phone, date, time, request }
  ]);

  if (error) {
    console.error(error);
    return res.status(500).send("Database error.");
  }

  res.send("Booking successful!");
});

// ============================
// GET ALL BOOKINGS
// ============================
app.get("/bookings", async (req, res) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Database error" });
  }

  res.json(data);
});

// ============================
// SERVER RUN
// ============================
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
