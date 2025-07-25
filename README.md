# ✈️ FlyHigh Travel Agency Website

**FlyHigh** is a sleek, responsive travel booking platform where users can browse, book, and manage their dream trips — from exotic tours to luxury villas, stylish cars to peaceful hotels — all in one place.

---

## 🌟 Features

- 🔒 **Login & Signup Modal**  
  Secure, modal-based login system with session handling and profile sync across pages.

- 🏝️ **Tours, Hotels, Vehicles & Villas**  
  Beautifully displayed listings with real-time filters for continent, country, and budget.

- 📄 **Detail Pages with Booking**  
  Each item has a detail view with full descriptions, amenities, and a booking button.

- 🧾 **PDF Ticket Generation**  
  Booked tickets can be downloaded as professional PDF files using jsPDF and html2pdf.

- 🧍‍♂️ **User Dashboard**  
  A collapsible profile sidebar showing booked tickets, cancellations, and logout.

- 💱 **Currency Conversion**  
  Switch between USD, INR, and EUR — all listings update in real time.

---

## 🗂️ Pages & Files

```bash
FlyHigh/
├── index.html                # Homepage
├── tours.html                # All tours
├── tour-info.html            # Single tour detail
├── vehicles.html             # Cars & transport
├── hotels.html               # Hotel listings
├── houses_villas.html        # Houses & villas page
├── houses_villas-info.html   # Villa info detail page
│
├── booking.html              # Booking form modal
├── login.html                # Login/signup modal
├── profileSidebar.html       # Sidebar with bookings
│
├── auth.js                   # Handles auth logic
├── profileSidebar.js         # Populates sidebar
├── ticketDownload.js         # PDF ticket download
│
├── style.css                 # Main styling
├── country.css               # Country tour detail info styling
