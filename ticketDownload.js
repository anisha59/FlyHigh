// ticketDownload.js

document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("download-icon-btn")) {
    const targetId = e.target.getAttribute("data-ticket-id");
    const original = document.getElementById(targetId);
    if (!original) {
      console.error("Ticket not found:", targetId);
      return;
    }

    const clone = original.cloneNode(true);
    clone.classList.add("ticket-pdf-style");

    // Remove unnecessary buttons
    clone.querySelector(".download-icon-btn")?.remove();
    clone.querySelector(".cancel-btn")?.remove();

    // Inject custom styles directly into the clone
    const style = document.createElement("style");
    style.textContent = `
      .ticket-pdf-style {
        font-family: 'Segoe UI', sans-serif;
        background: #fefefe;
        color: #333;
        border-radius: 16px;
        padding: 24px;
        border: 2px solid #b5d5ff;
        box-shadow: 0 0 14px rgba(0,0,0,0.08);
        max-width: 600px;
        width: 100%;
      }
      .ticket-pdf-style .ticket-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 8px;
        color: #1a73e8;
      }
      .ticket-pdf-style .ticket-traveler,
      .ticket-pdf-style .ticket-travelers-count,
      .ticket-pdf-style .ticket-type,
      .ticket-pdf-style .ticket-time,
      .ticket-pdf-style .ticket-date {
        font-size: 14px;
        color: #555;
        margin-bottom: 4px;
      }
      .ticket-pdf-style .ticket-type {
        font-weight: bold;
        color: #333;
      }
      .ticket-pdf-style .ticket-time {
        color: #00695c;
        font-weight: bold;
      }
    `;
    clone.prepend(style);

    // Put inside hidden container
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.appendChild(clone);
    document.body.appendChild(container);

    const dateText = clone.querySelector(".ticket-type")?.innerText || "Date";
    const safeDate = dateText.replace(/\W+/g, "_").substring(0, 15);

    const opt = {
      margin: 0.3,
      filename: `Ticket_${safeDate}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(clone).set(opt).save().then(() => {
      document.body.removeChild(container);
      const toast = document.getElementById("pdfToast");
      if (toast) {
        toast.style.display = "block";
        setTimeout(() => {
          toast.style.display = "none";
        }, 2200);
      }
    }).catch((err) => {
      console.error("PDF generation error:", err);
    });
  }
});
