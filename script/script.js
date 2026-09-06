const PRODUCTS = {
  small: {
    name: "Mira Shine Wash Small",
    price: 600,
    image: "assets/Img/small.jpg",
    url: "cleaning-solutions-small.html",
    desc: "A practical everyday multipurpose cleaner for kitchens, dishes, floors and general household surfaces.",
  },
  medium: {
    name: "Mira Shine Wash Medium",
    price: 1000,
    image: "assets/Img/medium.jpg",
    url: "cleaning-solutions-medium.html",
    desc: "A versatile everyday cleaning solution with more product for regular household and small-business use.",
  },
  large: {
    name: "Mira Shine Wash 5L",
    price: 5000,
    image: "assets/Img/5l.jpeg",
    url: "cleaning-solutions-5l.html",
    desc: "A value-sized multipurpose cleaning solution made for busy homes, offices and commercial cleaning needs.",
  },
};
let cart = JSON.parse(localStorage.getItem("Mira ShineCart") || "[]");
function money(n) {
  return "₦" + Number(n).toLocaleString("en-NG");
}
function save() {
  localStorage.setItem("Mira ShineCart", JSON.stringify(cart));
  updateCount();
}
function updateCount() {
  const n = cart.reduce((s, x) => s + x.qty, 0);
  document
    .querySelectorAll("[data-cart-count]")
    .forEach((e) => (e.textContent = n));
}
function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}
function add(name, price, image) {
  const x = cart.find((i) => i.name === name);
  if (x) x.qty++;
  else cart.push({ name, price, image, qty: 1 });
  save();
  toast(name + " added to cart");
}
function change(i, d) {
  cart[i].qty += d;
  if (cart[i].qty < 1) cart.splice(i, 1);
  save();
  renderCart();
}
function removeItem(i) {
  cart.splice(i, 1);
  save();
  renderCart();
}
function renderCart() {
  const box = document.querySelector("#cartItems");
  if (!box) return;
  if (!cart.length) {
    box.innerHTML =
      '<div class="empty"><h3>Your cart is empty</h3><p>Add a Mira Shine Wash product and it will appear here.</p><a class="btn btn-primary" href="products.html">Browse products</a></div>';
  } else {
    box.innerHTML = cart
      .map(
        (x, i) =>
          `<article class="cart-item"><img src="${x.image || "assets/favicon/mira.png"}" alt="${x.name}"><div><div class="cart-name">${x.name}</div><div class="cart-meta">${money(x.price)} each</div><div class="qty"><button onclick="change(${i},-1)">−</button><strong>${x.qty}</strong><button onclick="change(${i},1)">+</button></div></div><div><strong>${money(x.price * x.qty)}</strong><br><button class="remove" onclick="removeItem(${i})">Remove</button></div></article>`,
      )
      .join("");
  }
  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const el = document.querySelector("#cartTotal");
  if (el) el.textContent = money(total);
  const order = document.querySelector("#orderBtn");
  if (order) order.disabled = !cart.length;
}
function whatsappOrder() {
  if (!cart.length) return;
  const lines = cart.map(
    (x) => `${x.name} x${x.qty} — ${money(x.price * x.qty)}`,
  );
  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const msg = encodeURIComponent(
    "Hello Mira Shine Wash, I would like to place an order:\n\n" +
      lines.join("\n") +
      "\n\nTotal: " +
      money(total),
  );
  window.open("https://wa.me/2347064509776?text=" + msg, "_blank");
}
function renderCheckout() {
  const box = document.querySelector("#checkoutItems");
  if (!box) return;
  if (!cart.length) {
    box.innerHTML =
      '<div class="empty">Your cart is empty. <a href="products.html">Browse products</a>.</div>';
    document.querySelector("#checkoutTotal").textContent = money(0);
    return;
  }
  box.innerHTML = cart
    .map(
      (x, i) =>
        `<article class="cart-item"><img src="${x.image || "assets/favicon/mira.png"}" alt="${x.name}"><div><div class="cart-name">${x.name}</div><div class="cart-meta">${money(x.price)} × ${x.qty}</div></div><strong>${money(x.price * x.qty)}</strong></article>`,
    )
    .join("");
  document.querySelector("#checkoutTotal").textContent = money(
    cart.reduce((s, x) => s + x.price * x.qty, 0),
  );
}
function sendContact(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const data = new FormData(form);
  const name = data.get("name"),
    email = data.get("email"),
    message = data.get("message");
  const subject = encodeURIComponent("Mira Shine Wash enquiry from " + name);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  );
  window.location.href = `mailto:contact@mirashinewash.com?subject=${subject}&body=${body}`;
  document.querySelector("#formMessage").style.display = "block";
  form.reset();
}
function initDetail() {
  const key = document.body.dataset.product;
  if (!key) return;
  const p = PRODUCTS[key];
  const price = document.querySelector("#detailPrice");
  const img = document.querySelector("#detailImage");
  if (price) price.textContent = money(p.price);
  if (img && p.image) img.src = p.image;
  document.querySelectorAll("[data-pack-price]").forEach((btn) =>
    btn.addEventListener("click", () => {
      document
        .querySelectorAll("[data-pack-price]")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      price.textContent = money(btn.dataset.packPrice);
      document.querySelector("#addDetail").dataset.name =
        btn.dataset.packName || p.name;
      document.querySelector("#addDetail").dataset.price =
        btn.dataset.packPrice;
    }),
  );
  const addBtn = document.querySelector("#addDetail");
  if (addBtn) {
    addBtn.dataset.name = p.name;
    addBtn.dataset.price = p.price;
    addBtn.addEventListener("click", () =>
      add(addBtn.dataset.name, Number(addBtn.dataset.price), p.image),
    );
  }
}
document.addEventListener("DOMContentLoaded", () => {
  updateCount();
  renderCart();
  renderCheckout();
  initDetail();
  document
    .querySelectorAll(".menu-btn")
    .forEach((b) =>
      b.addEventListener("click", () =>
        document.querySelector(".mobile-menu")?.classList.toggle("open"),
      ),
    );
  document.querySelectorAll("[data-add]").forEach((b) =>
    b.addEventListener("click", () => {
      const p = PRODUCTS[b.dataset.add];
      add(p.name, p.price, p.image);
    }),
  );
  document.querySelectorAll(".tab-btn").forEach((b) =>
    b.addEventListener("click", () => {
      document
        .querySelectorAll(".tab-btn,.tab-panel")
        .forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      document.getElementById(b.dataset.tab).classList.add("active");
    }),
  );
});
