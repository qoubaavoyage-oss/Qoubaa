/************** INIT EMAILJS **************/
emailjs.init("m4OOSl-v3Fry9GtES");

/************** ELEMENTS **************/
const serviceType = document.getElementById("serviceType");
const fieldDestination = document.getElementById("field-destination");
const destinationSelect = document.getElementById("destinationSelect");

const fieldFrom = document.getElementById("field-from");
const fieldTo = document.getElementById("field-to");
const fieldFlightClass = document.getElementById("field-flightclass");
const fieldNights = document.getElementById("field-nights");
const fieldReturn = document.getElementById("field-return");

const depart = document.getElementById("depart");
const returnDate = document.getElementById("return");

const guestInput = document.getElementById("guestInput");
const dropdown = document.getElementById("guestDropdown");

const counts = { adults: 1, children: 0, infants: 0 };

/************** DATA **************/
const tunisGovernors = [
  "تونس","أريانة","بن عروس","منوبة","نابل","زغوان","بنزرت","سوسة","المنستير",
  "المهدية","صفاقس","القيروان","القصرين","سيدي بوزيد","قفصة","توزر","قبلي",
  "تطاوين","مدنين","قابس","جندوبة","الكاف","باجة","سليانة"
];

const popularCountries = [
  "السعودية","تركيا","الإمارات","فرنسا","إسبانيا","مصر",
  "تونس","المغرب","قطر","البحرين","إيطاليا",
  "ألمانيا","هولندا","ماليزيا","إندونيسيا"
];

/************** SERVICE TYPE LOGIC **************/
function updateServiceFields() {
  const val = serviceType.value;

  // reset
  fieldDestination.style.display = "block";
  fieldFrom.style.display = "none";
  fieldTo.style.display = "none";
  fieldFlightClass.style.display = "none";
  fieldNights.style.display = "block";
  fieldReturn.style.display = "block";

  destinationSelect.innerHTML = "";

  // OMRA
  if (val === "umrah") {
    fieldDestination.style.display = "none";
    fieldFrom.style.display = "none";
    fieldTo.style.display = "none";
    fieldFlightClass.style.display = "none";
    fieldNights.style.display = "block";
    return;
  }

  // HOTEL
  if (val === "hotel") {
    destinationSelect.innerHTML = `<option value="">اختر الولاية</option>`;
    tunisGovernors.forEach(g => {
      destinationSelect.innerHTML += `<option>${g}</option>`;
    });
    return;
  }

  // FLIGHT
  if (val === "flight") {
    destinationSelect.innerHTML = `<option value="">اختر الوجهة</option>`;
    popularCountries.forEach(c => {
      destinationSelect.innerHTML += `<option>${c}</option>`;
    });

    fieldFrom.style.display = "block";
    fieldTo.style.display = "block";
    fieldFlightClass.style.display = "block";
    fieldNights.style.display = "none";
  }
}
serviceType.addEventListener("change", updateServiceFields);
updateServiceFields();

/************** DATE RULES **************/
depart.addEventListener("change", () => {
  returnDate.min = depart.value;
  if (returnDate.value < depart.value) returnDate.value = depart.value;
});

returnDate.addEventListener("change", () => {
  if (returnDate.value < depart.value) returnDate.value = depart.value;
});

/************** GUESTS DROPDOWN **************/
function updateGuestInput() {
  guestInput.value =
    counts.adults +
    " بالغ" +
    (counts.children > 0 ? `، ${counts.children} طفل` : "") +
    (counts.infants > 0 ? `، ${counts.infants} رضيع` : "");
}
updateGuestInput();

guestInput.onclick = e => {
  e.stopPropagation();
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
};

document.querySelectorAll(".plus").forEach(btn => {
  btn.onclick = () => {
    const t = btn.dataset.type;
    counts[t]++;
    document.getElementById(t+"Count").textContent = counts[t];
    updateGuestInput();
  };
});

document.querySelectorAll(".minus").forEach(btn => {
  btn.onclick = () => {
    const t = btn.dataset.type;
    if (t === "adults" && counts.adults <= 1) return;
    counts[t] = Math.max(0, counts[t] - 1);
    document.getElementById(t+"Count").textContent = counts[t];
    updateGuestInput();
  };
});

document.getElementById("doneGuests").onclick = () => dropdown.style.display = "none";

document.onclick = e => {
  if (!document.getElementById("guestSelector").contains(e.target))
    dropdown.style.display = "none";
};

/************** MODAL SEARCH **************/
document.getElementById("searchBtn").addEventListener("click", (e) => {
  e.preventDefault();

  const modal = document.getElementById("searchModal");

  document.getElementById("modalService").value =
    serviceType.options[serviceType.selectedIndex].text;

  let destText = "";

  if (serviceType.value === "flight") {
    destText =
      (document.getElementById("flightFrom").value || "---") +
      " → " +
      (document.getElementById("flightTo").value || "---");
  } else {
    destText = destinationSelect.value || "";
  }

  document.getElementById("modalDestination").value = destText;

  const d1 = depart.value || "";
  const d2 = returnDate.value || "";
  document.getElementById("modalDates").value = d1 + (d2 ? " — " + d2 : "");

  document.getElementById("modalGuests").value = guestInput.value;

  let extras = "";
  if (serviceType.value === "hotel")
    extras = "ليالي: " + (document.getElementById("nights").value || "1");
  if (serviceType.value === "flight")
    extras = "درجة: " + document.getElementById("flightClass").value;

  document.getElementById("modalExtras").value = extras;

  modal.style.display = "flex";
});

/************** MODAL CLOSE **************/
const modal = document.getElementById("searchModal");
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
document.onkeydown = e => { if (e.key === "Escape") modal.style.display = "none"; };

/************** SEND EMAIL **************/
document.getElementById("modalForm").addEventListener("submit", e => {
  e.preventDefault();

  const params = {
    service: document.getElementById("modalService").value,
    destination: document.getElementById("modalDestination").value,
    dates: document.getElementById("modalDates").value,
    name: document.getElementById("nom").value,
    email: document.getElementById("to_emailClient").value,
    phone: document.getElementById("to_telephone").value,
    guests: document.getElementById("modalGuests").value,
    extras: document.getElementById("modalExtras").value,
    to_email: "resarvationqoubaa@outlook.fr"
  };

  console.log("إرسال:", params);

  emailjs.send("service_9kew0hd", "template_t76cigt", params)
    .then(() => {
      alert("تم إرسال طلبك بنجاح!");
      modal.style.display = "none";
    })
    .catch(() => alert("خطأ أثناء الإرسال"));
});
