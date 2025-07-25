function initializeProfileSidebar() {
  const userEmail = localStorage.getItem("userEmail");
  if (!userEmail) return;

  const shortName = localStorage.getItem("username") || userEmail.split("@")[0];
  document.getElementById("usernameShort").textContent = shortName;

  const allTickets = JSON.parse(localStorage.getItem("bookedTickets") || "{}");
  const tickets = allTickets[userEmail] || [];

  const currency = localStorage.getItem("selectedCurrency") || "USD";
  const currencySymbols = { USD: "$", INR: "₹", EUR: "€" };

 document.getElementById("viewAllBooked")?.addEventListener("click", () => {
  const allTickets = JSON.parse(localStorage.getItem("bookedTickets") || "{}");
  const tickets = allTickets[userEmail] || [];

  const list = document.getElementById("allBookedList");
  list.innerHTML = tickets.length
    ? tickets.map((ticket, index) => `
      <li>
        <div class="ticket-flex-row" id="ticket-${index}">
          <div class="ticket-left">
            <div class="ticket-title">${ticket.title}</div>
            <div class="ticket-traveler">👤 ${ticket.travelerName}</div>
            <div class="ticket-travelers-count">👥 ${ticket.travelers} Traveler${ticket.travelers > 1 ? "s" : ""}</div>
            <div class="ticket-type">${ticket.type.toUpperCase()} | ${ticket.date}</div>
            <div class="ticket-time">${currencySymbols[ticket.currency] || "$"}${ticket.price.toLocaleString()} | ${ticket.paymentMethod}</div>
            <div class="ticket-date">Booked On: ${ticket.bookedAt}</div>
          </div>
          <div class="ticket-center">
            <button class="download-icon-btn" data-target="ticket-${index}" title="Download Ticket PDF">
              <img src="icon.svg" alt="Download" class="custom-download-icon" />
            </button>
          </div>
          <div class="ticket-right">
            <button class="cancel-btn" data-title="${ticket.title}">❌ Cancel Ticket</button>
          </div>
        </div>
      </li>
    `).join('')
    : "<li>No booked tickets found.</li>";

    document.querySelectorAll(".cancel-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const titleToCancel = btn.getAttribute("data-title");
        if (!userEmail) return;

        const allBooked = JSON.parse(localStorage.getItem("bookedTickets") || "{}");
        const bookedList = allBooked[userEmail] || [];

        const cancelled = JSON.parse(localStorage.getItem("cancelledTickets") || "{}");
        const cancelledList = cancelled[userEmail] || [];

        const index = bookedList.findIndex(t => t.title === titleToCancel);
        if (index !== -1) {
          const ticket = bookedList.splice(index, 1)[0];
          ticket.cancelledAt = new Date().toLocaleDateString(); // ✅ add cancel date
          cancelledList.push(ticket);

          allBooked[userEmail] = bookedList;
          cancelled[userEmail] = cancelledList;

          localStorage.setItem("bookedTickets", JSON.stringify(allBooked));
          localStorage.setItem("cancelledTickets", JSON.stringify(cancelled));

          alert(`Tour "${titleToCancel}" has been cancelled.`);
          document.getElementById("viewAllBooked").click(); // Refresh booked list
        }
      });
    });

    setTimeout(() => {
      document.querySelectorAll(".download-icon-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const targetId = btn.getAttribute("data-target");
          const original = document.getElementById(targetId);
          if (!original) return;

          const clone = original.cloneNode(true);
          clone.style.padding = "20px";
          clone.style.border = "1px solid #ccc";
          clone.style.fontFamily = "Arial, sans-serif";
          clone.style.width = "600px";
          clone.style.background = "#ffffff";
          clone.style.color = "#000";

          const wrapper = document.createElement("div");
wrapper.className = "ticket-pdf-style";
wrapper.appendChild(clone);

// Apply styles directly
wrapper.style.padding = "20px";
wrapper.style.border = "1px solid #ccc";
wrapper.style.fontFamily = "Arial, sans-serif";
wrapper.style.width = "600px";
wrapper.style.background = "#ffffff";
wrapper.style.color = "#000";

const container = document.createElement("div");
container.style.position = "fixed";
container.style.top = "-9999px";
container.appendChild(wrapper);
document.body.appendChild(container);


          const title = clone.querySelector(".ticket-title")?.innerText || "Ticket";
          const date = clone.querySelector(".ticket-type")?.innerText.split("|")[1]?.trim() || "Date";
          const filename = `Tour_${title.replace(/\s+/g, '_')}_${date}.pdf`;

          const opt = {
            margin: 0.5,
            filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
          };

          html2pdf().from(clone).set(opt).save().then(() => {
            document.body.removeChild(container);
            const toast = document.getElementById("pdfToast");
            toast.style.display = "block";
            setTimeout(() => { toast.style.display = "none"; }, 2200);
          });
        });
      });
    }, 0);

    document.getElementById("fullBookedModal").classList.add("show");
    document.body.classList.add("modal-open");
  });

  // ✅ Show Cancelled Tickets
  document.getElementById("viewAllCancelled")?.addEventListener("click", () => {
    const cancelledListElement = document.getElementById("allCancelledList");
    const cancelled = JSON.parse(localStorage.getItem("cancelledTickets") || "{}");
    const cancelledTickets = cancelled[userEmail] || [];

    cancelledListElement.innerHTML = cancelledTickets.length
  ? cancelledTickets.map((ticket, index) => `
    <li>
  <div class="ticket-flex-row cancelled-ticket-card" data-index="${index}">
    <button class="remove-cancelled-btn" title="Remove Ticket">❌</button>
    <div class="ticket-left">
      <div class="ticket-title">${ticket.title}</div>
      <div class="ticket-traveler">👤 ${ticket.travelerName}</div>
      <div class="ticket-travelers-count">👥 ${ticket.travelers} Traveler${ticket.travelers > 1 ? "s" : ""}</div>
      <div class="ticket-type">${ticket.type.toUpperCase()} | ${ticket.date}</div>
      <div class="ticket-time">${currencySymbols[ticket.currency] || "$"}${ticket.price.toLocaleString()} | ${ticket.paymentMethod}</div>
      <div class="ticket-date">Cancelled On: ${ticket.cancelledAt || "N/A"}</div>
    </div>
  </div>
</li>
  `).join('')
  : "<li>No cancelled tickets yet.</li>";
document.querySelectorAll(".remove-cancelled-btn").forEach(btn => {
  btn.addEventListener("click", function () {
    const parent = this.closest(".cancelled-ticket-card");
    const index = parseInt(parent.dataset.index);

    const userEmail = localStorage.getItem("userEmail");
    const cancelledData = JSON.parse(localStorage.getItem("cancelledTickets") || "{}");
    const cancelledTickets = cancelledData[userEmail] || [];

    if (!isNaN(index) && index >= 0 && index < cancelledTickets.length) {
      cancelledTickets.splice(index, 1);
      cancelledData[userEmail] = cancelledTickets;
      localStorage.setItem("cancelledTickets", JSON.stringify(cancelledData));

      parent.remove();

      // ✅ After removal, check if list is empty
      const remainingCards = document.querySelectorAll(".cancelled-ticket-card");
      if (remainingCards.length === 0) {
        const cancelledListElement = document.getElementById("allCancelledList");
        cancelledListElement.innerHTML = `<li>No cancelled tickets yet.</li>`;
      }
    }
  });
});
    document.getElementById("fullCancelledModal").classList.add("show");
    document.body.classList.add("modal-open");
  });

  document.getElementById("closeFullBooked")?.addEventListener("click", () => {
    document.getElementById("fullBookedModal").classList.remove("show");
    document.body.classList.remove("modal-open");
  });

  document.getElementById("closeFullCancelled")?.addEventListener("click", () => {
    document.getElementById("fullCancelledModal").classList.remove("show");
    document.body.classList.remove("modal-open");
  });

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
  });
}function renderCancelledTickets() {
  const userEmail = localStorage.getItem("userEmail");
  if (!userEmail) return;

  const cancelledData = JSON.parse(localStorage.getItem("cancelledTickets") || "{}");
  const cancelledTickets = cancelledData[userEmail] || [];

  const cancelledContainer = document.getElementById("cancelledTicketsList");
  cancelledContainer.innerHTML = ""; // Clear previous

  cancelledTickets.forEach((ticket, index) => {
    const ticketDiv = document.createElement("div");
    ticketDiv.className = "cancelled-ticket-item";
    ticketDiv.innerHTML = `
      <span>${ticket.title}</span>
      <span class="remove-cancelled" data-index="${index}">❌</span>
    `;
    cancelledContainer.appendChild(ticketDiv);
  });

  // Attach delete events
  document.querySelectorAll(".remove-cancelled").forEach(icon => {
    icon.addEventListener("click", function () {
      const index = this.dataset.index;
      removeCancelledTicket(index);
    });
  });
}
function removeCancelledTicket(index) {
  const userEmail = localStorage.getItem("userEmail");
  if (!userEmail) return;

  const cancelledData = JSON.parse(localStorage.getItem("cancelledTickets") || "{}");
  const cancelledTickets = cancelledData[userEmail] || [];

  cancelledTickets.splice(index, 1); // Remove selected

  cancelledData[userEmail] = cancelledTickets;
  localStorage.setItem("cancelledTickets", JSON.stringify(cancelledData));

  renderCancelledTickets(); // Refresh UI
}

window.initializeProfileSidebar = initializeProfileSidebar;
