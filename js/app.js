// ==========================================
// МОБИЛЬНОЕ МЕНЮ
// ==========================================
const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector(".navbar__menu");
if (menu && menuLinks) {
  menu.addEventListener("click", function () {
    menu.classList.toggle("is-active");
    menuLinks.classList.toggle("active");
  });
  document.querySelectorAll(".navbar__links").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-active");
      menuLinks.classList.remove("active");
    });
  });
}

// DEMO ONLY: no network requests, no collection, storage or transmission of contacts.
const modal = document.getElementById("contactModal");
function closeForm(){modal?.classList.remove("show");}
document.querySelectorAll(".js-open-modal").forEach(el => el.addEventListener("click", () => modal?.classList.add("show")));
document.querySelector(".modal-close")?.addEventListener("click",closeForm);
document.querySelector(".modal-overlay")?.addEventListener("click",closeForm);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeForm();});
for (const id of ["contactForm","inlineContactForm"]){
 document.getElementById(id)?.addEventListener("submit",e=>{e.preventDefault();showPreviewNotice();if(id==="contactForm")closeForm();});
}
const up = document.createElement("div");up.className="upbtn";up.setAttribute("role","button");up.setAttribute("tabindex","0");up.setAttribute("aria-label","Наверх");document.body.append(up);
function updateUp(){up.style.right=window.scrollY>100?"-120px":"-220px";up.style.bottom=window.scrollY>100?"-120px":"-220px";}
window.addEventListener("scroll",updateUp,{passive:true});updateUp();
up.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
up.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();up.click();}});

// ==========================================
// ГАЛЕРЕЯ РАБОТ
// ==========================================
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", initGallery);
  function initGallery() {
    const filters = document.querySelectorAll(".filter-btn");
    const items = document.querySelectorAll(".gallery-item");
    const lightbox = document.getElementById("galleryLightbox");
    if (!filters.length || !items.length) return;
    let currentItems = [];
    let currentIndex = 0;

    /* ФИЛЬТРАЦИЯ */
    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter;
        items.forEach((item, i) => {
          const category = item.dataset.category;
          const show = filter === "all" || category === filter;
          if (show) {
            item.classList.remove("hiding");
            item.style.display = "";
            item.style.animation = "none";
            void item.offsetWidth;
            item.style.animation = `galleryFadeIn 0.5s ease ${i * 0.04}s backwards`;
          } else {
            item.classList.add("hiding");
            setTimeout(() => {
              if (item.classList.contains("hiding")) {
                item.style.display = "none";
              }
            }, 400);
          }
        });
        setTimeout(updateCurrentItems, 50);
      });
    });

    function updateCurrentItems() {
      currentItems = Array.from(items).filter(
        (it) => it.style.display !== "none" && !it.classList.contains("hiding"),
      );
    }
    updateCurrentItems();

    /* ОТКРЫТИЕ LIGHTBOX */
    items.forEach((item) => {
      item.addEventListener("click", () => openLightbox(item));
    });
    function openLightbox(item) {
      currentIndex = currentItems.indexOf(item);
      if (currentIndex === -1) currentIndex = 0;
      showSlide(currentIndex);
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    }
    function closeLightbox() {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }
    function showSlide(index) {
      if (index < 0) index = currentItems.length - 1;
      if (index >= currentItems.length) index = 0;
      currentIndex = index;
      const item = currentItems[index];
      const img = item.querySelector("img");
      lightbox.querySelector(".lightbox-image").src = img.src;
      lightbox.querySelector(".lightbox-image").alt = img.alt;
      lightbox.querySelector(".lightbox-category").textContent =
        item.querySelector(".gallery-category")?.textContent || "";
      lightbox.querySelector(".lightbox-title").textContent =
        item.dataset.title || "";
      lightbox.querySelector(".lightbox-desc").textContent =
        item.dataset.desc || "";
      lightbox.querySelector(".lightbox-params").textContent =
        item.dataset.params || "";
    }

    /* НАВИГАЦИЯ */
    lightbox
      .querySelector(".lightbox-close")
      .addEventListener("click", closeLightbox);
    lightbox
      .querySelector(".lightbox-overlay")
      .addEventListener("click", closeLightbox);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", (e) => {
      e.stopPropagation();
      showSlide(currentIndex - 1);
    });
    lightbox.querySelector(".lightbox-next").addEventListener("click", (e) => {
      e.stopPropagation();
      showSlide(currentIndex + 1);
    });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showSlide(currentIndex - 1);
      if (e.key === "ArrowRight") showSlide(currentIndex + 1);
    });
    let touchStartX = 0;
    let touchEndX = 0;
    lightbox.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );
    lightbox.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) < 50) return;
        if (diff > 0) showSlide(currentIndex + 1);
        else showSlide(currentIndex - 1);
      },
      { passive: true },
    );
  }
})();

// Video cards show local demo previews; never embed third-party content.
(()=>{const box=document.getElementById("videoLightbox"),wrap=document.getElementById("videoWrapper");
if(!box||!wrap)return;
for(const item of document.querySelectorAll(".video-item"))item.addEventListener("click",()=>{
 wrap.replaceChildren();const note=document.createElement("p");note.className="demo-video-note";
 note.textContent="В готовом проекте здесь появится видеоролик. Пока перед вами интерактивный макет блока.";
 note.style.cssText="color:white;padding:40px;text-align:center;line-height:1.6";wrap.append(note);
 box.classList.add("active");document.body.style.overflow="hidden";
});
function close(){box.classList.remove("active");wrap.replaceChildren();document.body.style.overflow="";}
box.querySelector(".video-lightbox-close")?.addEventListener("click",close);
box.querySelector(".video-lightbox-overlay")?.addEventListener("click",close);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&box.classList.contains("active"))close();});})();

// Hero carousel (the original gallery.js was not supplied).
(()=>{const slides=[...document.querySelectorAll(".hero__slide")];if(!slides.length)return;
let index=Math.max(0,slides.findIndex(el=>el.classList.contains("active")));
const caption=document.querySelector(".hero__caption");
function show(n){index=(n+slides.length)%slides.length;slides.forEach((el,i)=>el.classList.toggle("active",i===index));if(caption)caption.textContent=slides[index].dataset.caption||"Демонстрационная иллюстрация";}
document.querySelector(".hero__prev")?.addEventListener("click",()=>show(index-1));
document.querySelector(".hero__next")?.addEventListener("click",()=>show(index+1));show(index);
})();

// Subtle accessible local feedback; never implies a real request was submitted.
const toast=document.createElement('div');toast.className='demo-toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');document.body.append(toast);
let toastTimer;function showPreviewNotice(){toast.textContent='Так может выглядеть отклик после отправки заявки. Сейчас это только просмотр — данные никуда не ушли.';toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),5200);}
for(const item of document.querySelectorAll('.video-item,.gallery-item'))item.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();item.click();}});
