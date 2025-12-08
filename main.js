    // emailjs init (احتفظ بالمفتاح لديك)
  emailjs.init("m4OOSl-v3Fry9GtES");  

    // عناصر
    const serviceType = document.getElementById("serviceType");
    const fieldFrom = document.getElementById("field-from");
    const fieldTo = document.getElementById("field-to");
    const fieldNights = document.getElementById("field-nights");
    const fieldFlightClass = document.getElementById("field-flightclass");
    const fieldDestination = document.getElementById("field-destination");
    const fieldReturn = document.getElementById("field-return");
    const guestInput = document.getElementById("guestInput");
    const dropdown = document.getElementById("guestDropdown");
    const counts = { adults:1, children:0, infants:0 };

    // ضبط الظهور حسب نوع الخدمة
    function updateServiceFields() {
      const val = serviceType.value;
      // إخفاء جميع الحقول المتخصصة
      fieldFrom.style.display = 'none';
      fieldTo.style.display = 'none';
      fieldNights.style.display = 'none';
      fieldFlightClass.style.display = 'none';
      // Destination default visible
      fieldDestination.style.display = 'block';
      fieldReturn.style.display = 'block';

      if(val === 'umrah') {
        // فقط الوجهة والتواريخ والركاب
      } else if(val === 'hotel') {
        fieldNights.style.display = 'block';
      } else if(val === 'flight') {
        fieldFrom.style.display = 'block';
        fieldTo.style.display = 'block';
        fieldFlightClass.style.display = 'block';
      }
    }
    serviceType.addEventListener('change', updateServiceFields);
    updateServiceFields();

    // Guest dropdown logic
    function updateGuestInput(){
      guestInput.value = counts.adults + " بالغ" + (counts.children>0 ? "، " + counts.children + " طفل" : "") + (counts.infants>0 ? "، " + counts.infants + " رضيع" : "");
    }
    updateGuestInput();

    guestInput.addEventListener("click", (e)=>{ e.stopPropagation(); dropdown.style.display = dropdown.style.display === "block" ? "none" : "block"; });

    document.querySelectorAll(".plus").forEach(btn=>{
      btn.addEventListener("click", ()=> {
        const t = btn.dataset.type;
        counts[t] = (counts[t] || 0) + 1;
        document.getElementById(t + "Count").textContent = counts[t];
        updateGuestInput();
      });
    });
    document.querySelectorAll(".minus").forEach(btn=>{
      btn.addEventListener("click", ()=> {
        const t = btn.dataset.type;
        if(t==='adults' && counts.adults<=1) return;
        counts[t] = Math.max(0, (counts[t]||0)-1);
        document.getElementById(t + "Count").textContent = counts[t];
        updateGuestInput();
      });
    });
    document.getElementById("doneGuests").addEventListener("click", ()=> dropdown.style.display='none');
    document.addEventListener("click", (e)=> { if(!document.getElementById("guestSelector").contains(e.target)) dropdown.style.display='none'; });

    // فتح المودال عند البحث وملئه بالمعلومات المناسبة
    document.getElementById("searchBtn").addEventListener("click", (e)=> {
      e.preventDefault();
      // ملء الحقول في المودال
      const modal = document.getElementById("searchModal");
      document.getElementById("modalService").value = serviceType.options[serviceType.selectedIndex].text;
      // تجميع وصف الوجهة/المدن
      let destText = '';
      if(serviceType.value === 'flight') {
        destText = (document.getElementById("flightFrom").value || '---') + " → " + (document.getElementById("flightTo").value || '---');
      } else {
        destText = document.getElementById("destination").value;
      }
      document.getElementById("modalDestination").value = destText;
      // التواريخ
      const d1 = document.getElementById("depart").value || '';
      const d2 = document.getElementById("return").value || '';
      document.getElementById("modalDates").value = d1 + (d2 ? " — " + d2 : "");
      // الضيوف
      document.getElementById("modalGuests").value = guestInput.value;
      // extras: hotel nights / class
      let extras = '';
      if(serviceType.value==='hotel') extras = 'ليالي: ' + (document.getElementById("nights").value || '1');
      if(serviceType.value==='flight') extras = 'درجة: ' + (document.getElementById("flightClass").value || '');
      document.getElementById("modalExtras").value = extras;
      // إظهار المودال
      modal.style.display = 'flex';
      modal.focus();
    });

    // اغلاق المودال بالخارج و بـ Esc
    const modal = document.getElementById("searchModal");
    window.addEventListener("click", (e)=> { if(e.target === modal) modal.style.display = 'none'; });
    document.addEventListener("keydown", (e)=> { if(e.key === 'Escape') modal.style.display = 'none'; });

    // إرسال بيانات المودال عبر emailjs
    document.getElementById("modalForm").addEventListener("submit", function(e){
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
        to_email :'resarvationqoubaa@outlook.fr'
      };
  
        console.log("إرسال البريد مع المعاملات:", params);
        emailjs.send("service_9kew0hd","template_t76cigt",params).then(()=> {
          alert("تم إرسال طلبك، سنتواصل معك قريبًا");
          modal.style.display = 'none';
        }).catch(err=>{
          console.error(err);
          alert("حدث خطأ أثناء الإرسال، حاول لاحقاً");
        });
    
    });

    // init swiper
    new Swiper(".swiper", { slidesPerView: 1.1, spaceBetween: 16, loop: true, breakpoints:{700:{slidesPerView:2.2},1000:{slidesPerView:3}} });
    if(window.ScrollReveal){ const sr={origin:'bottom',distance:'30px',duration:800}; ScrollReveal().reveal('.header__content',sr); ScrollReveal().reveal('.header__image',{...sr,origin:'right'}); }
    const omraModal = document.getElementById("omraModal");
const btnOmra = document.getElementById("btnOmra");
const closeOmra = document.querySelector(".closeOmra");

// ouvrir modal
btnOmra.addEventListener("click", () => {
  omraModal.style.display = "flex";
});

// fermer modal
closeOmra.addEventListener("click", () => {
  omraModal.style.display = "none";
});

// fermer en cliquant dehors
window.addEventListener("click", (e) => {
  if (e.target === omraModal) {
    omraModal.style.display = "none";
  }
});
