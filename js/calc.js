/* ==========================================================
   КАЛЬКУЛЯТОР СЕТОК-ГАРМОШЕК
   Все цены и лимиты меняются ТОЛЬКО в этом блоке настроек
   ========================================================== */
(function () {
  "use strict";

  /* ---------- НАСТРОЙКИ ЦЕН ---------- */
  const BASE_PRICE = 4000; // база: профиль, фурнитура, работа (руб)
  const PER_M2 = 1200; // доплата за 1 м² (руб)
  const MIN_PRICE = 5000; // минимальная цена заказа (руб)

  /* Лимиты размеров по местам установки (мм) */
  const PLACES = {
    window: { label: "Окно", wMin: 600, wMax: 6000, hMin: 900, hMax: 2200 },
    door: { label: "Дверь", wMin: 600, wMax: 1500, hMin: 1850, hMax: 2200 },
    portal: { label: "Портал", wMin: 600, wMax: 6000, hMin: 1850, hMax: 2200 },
    gazebo: { label: "Беседка", wMin: 600, wMax: 6000, hMin: 900, hMax: 2200 },
  };

  /* Виды полотна (коэффициент цены) — демонстрационные коэффициенты */
  const MESH = {
    standard: { label: "Стандарт", k: 1 },
    antidust: { label: "Антипыль", k: 1.1 },
    antecat: { label: "Антикошка", k: 1.1 },
  };

  /* ---------- Элементы ---------- */
  const box = document.querySelector(".calc-box");
  if (!box) return;

  const widthIn = document.getElementById("calcWidth");
  const heightIn = document.getElementById("calcHeight");
  const widthHint = document.getElementById("widthHint");
  const heightHint = document.getElementById("heightHint");
  const areaOut = document.getElementById("calcArea");
  const priceOut = document.getElementById("calcPrice");
  const summaryOut = document.getElementById("calcSummary");
  const errorOut = document.getElementById("calcError");

  const state = { place: null, mesh: null };
  let step = 1;

  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

  /* ---------- Шаги ---------- */
  function go(n) {
    step = n;
    box
      .querySelectorAll(".calc-step")
      .forEach((s) => s.classList.toggle("active", +s.dataset.calcStep === n));
    box.querySelectorAll(".calc-dot").forEach((d, i) => {
      d.classList.toggle("active", i + 1 === n);
      d.classList.toggle("done", i + 1 < n);
    });
    clearError();
  }

  function clearError() {
    errorOut.textContent = "";
    widthIn.classList.remove("error");
    heightIn.classList.remove("error");
  }
  function showError(msg) {
    errorOut.textContent = msg;
  }

  /* ---------- Лимиты при выборе места ---------- */
  function applyPlaceLimits() {
    const p = PLACES[state.place];
    widthIn.min = p.wMin;
    widthIn.max = p.wMax;
    heightIn.min = p.hMin;
    heightIn.max = p.hMax;
    widthIn.value = clamp(+widthIn.value || p.wMin, p.wMin, p.wMax);
    heightIn.value = clamp(+heightIn.value || p.hMin, p.hMin, p.hMax);
    widthHint.textContent = "от " + p.wMin + " до " + p.wMax + " мм";
    heightHint.textContent = "от " + p.hMin + " до " + p.hMax + " мм";
    updateArea();
  }

  function updateArea() {
    const area = ((+widthIn.value * +heightIn.value) / 1e6)
      .toFixed(2)
      .replace(".", ",");
    areaOut.textContent = area + " м²";
  }

  /* ---------- Кнопки-опции ---------- */
  box.querySelectorAll(".calc-options").forEach((group) => {
    const name = group.dataset.calcGroup;
    group.querySelectorAll(".calc-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        group
          .querySelectorAll(".calc-option")
          .forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        state[name] = btn.dataset.value;
        if (name === "place") applyPlaceLimits();
        clearError();
      });
    });
  });

  /* ---------- Навигация ---------- */
  box.querySelectorAll("[data-calc-next]").forEach((b) =>
    b.addEventListener("click", () => {
      if (step === 1 && !state.place)
        return showError("Выберите, куда нужна сетка");
      if (step === 2 && !validSizes()) return;
      go(step + 1);
    }),
  );
  box
    .querySelectorAll("[data-calc-prev]")
    .forEach((b) => b.addEventListener("click", () => go(step - 1)));
  box.querySelector("[data-calc-result]").addEventListener("click", () => {
    if (!state.mesh) return showError("Выберите вид полотна");
    renderResult();
    go(4);
  });
  box.querySelector("[data-calc-reset]").addEventListener("click", () => {
    box
      .querySelectorAll(".calc-option")
      .forEach((b) => b.classList.remove("selected"));
    state.place = null;
    state.mesh = null;
    go(1);
  });

  /* ---------- Проверка размеров ---------- */
  function validSizes() {
    const p = PLACES[state.place];
    const w = +widthIn.value,
      h = +heightIn.value;
    let ok = true;
    if (!w || w < p.wMin || w > p.wMax) {
      widthIn.classList.add("error");
      ok = false;
    } else widthIn.classList.remove("error");
    if (!h || h < p.hMin || h > p.hMax) {
      heightIn.classList.add("error");
      ok = false;
    } else heightIn.classList.remove("error");
    if (!ok)
      showError(
        "Допустимо для «" +
          p.label +
          "»: ширина " +
          p.wMin +
          "–" +
          p.wMax +
          " мм, высота " +
          p.hMin +
          "–" +
          p.hMax +
          " мм",
      );
    return ok;
  }

  /* ---------- Цена ---------- */
  function calcPrice(w, h) {
    const area = (w * h) / 1e6;
    let price = (BASE_PRICE + PER_M2 * area) * MESH[state.mesh].k;
    if (price < MIN_PRICE) price = MIN_PRICE;
    return Math.round(price / 10) * 10;
  }

  function renderResult() {
    const w = +widthIn.value,
      h = +heightIn.value;
    const area = ((w * h) / 1e6).toFixed(2).replace(".", ",");
    priceOut.textContent =
      "≈ " + calcPrice(w, h).toLocaleString("ru-RU") + " ₽";
    summaryOut.textContent =
      "Сетка-гармошка · " +
      PLACES[state.place].label.toLowerCase() +
      " · " +
      w +
      "×" +
      h +
      " мм (" +
      area +
      " м²) · полотно «" +
      MESH[state.mesh].label +
      "»";
  }

  /* ---------- Живой пересчет площади ---------- */
  [widthIn, heightIn].forEach((i) =>
    i.addEventListener("input", () => {
      clearError();
      updateArea();
    }),
  );

  go(1);
})();
