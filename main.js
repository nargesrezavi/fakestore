/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')

/* =====Menu show===== */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    })
}

/* ======Menu hidden======= */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

const linkAction = () => {
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))


/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
    const scrollUp = document.getElementById('scroll-up')
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
    this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
        : scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)


/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
    const scrollDown = window.scrollY

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
            sectionsClass.classList.add('active-link')
        } else {
            sectionsClass.classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

// ==================showing Products Cards=====================
const apiBase = 'https://fakestoreapi.com';
let allProducts = [];
let favorites = [];

// Fetch categories and populate navbar
async function loadCategories() {
    const response = await fetch(`${apiBase}/products/categories`);
    const categories = await response.json();
    const navbar = document.getElementById('navbar');

    categories.forEach(category => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${category}`;
        a.textContent = category;
        li.appendChild(a);
        navbar.appendChild(li);
    });
}

// Fetch all products
async function loadProducts() {
    const response = await fetch(`${apiBase}/products`);
    allProducts = await response.json();
    displayProducts();
}

// Display products category-wise
function displayProducts() {
    const productSections = document.getElementById('product-sections');
    productSections.innerHTML = ''; // clear previous content

    const categories = [...new Set(allProducts.map(p => p.category))];

    categories.forEach(category => {
        const section = document.createElement('section');
        section.classList.add('category-section');
        section.id = category;
        section.innerHTML = `<h2>${category}</h2><div class="category-products"></div>`;

        const productContainer = section.querySelector('.category-products');
        const products = allProducts.filter(product => product.category === category);
        let displayedProducts = 4;

        products.slice(0, displayedProducts).forEach(product => {
            productContainer.appendChild(createProductCard(product));
        });

        const loadMoreButton = document.createElement('button');
        loadMoreButton.textContent = 'Load more';
        loadMoreButton.classList.add('load-btn');
        loadMoreButton.onclick = () => {
            products.slice(displayedProducts, displayedProducts + 4).forEach(product => {
                productContainer.appendChild(createProductCard(product));
            });
            displayedProducts += 4;
            if (displayedProducts >= products.length) {
                loadMoreButton.style.display = 'none';
            }
        };

        section.appendChild(loadMoreButton);
        productSections.appendChild(section);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="pro-img">
        <div class="pro-desc">
        <h3>${product.title}</h3>
        <p>${product.price}$</p>
        </div>
        <div class="pro-btn">
        <button class="view-btn" onclick="viewProduct(${product.id})">View Details</button>
        <button  class="add-btn" onclick="addToFavorites(${product.id})">Add to Favorites</button>
        </div>
    `;
    return card;
}

// View product details (updates URL without reloading)
function viewProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        history.pushState({ productId }, null, `/product/${productId}`);
        showProductDetails(product);
    }
}

// Function to display the product details and hide other content
function showProductDetails(product) {
    const productDetailsSection = document.getElementById('product-details');
    const productSections = document.getElementById('product-sections');

    if (productDetailsSection && productSections) {
        productDetailsSection.style.display = 'block';
        productSections.style.display = 'none';

        productDetailsSection.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="details-img">
            <div class="details-desc">
            <h1 class="details-title">${product.title}</h1>
            <p>${product.description}</p>
            <p>Price: ${product.price}$</p>
            <p>Category: ${product.category}</p>
            <button  class="add-btn" onclick="addToFavorites(${product.id})">Add to Favorites</button>
            <button  class="view-btn" onclick="goBack()">Go Back</button>
            </div>
        `;
    } else {
        console.error("Could not find product-details or product-sections");
    }
}

// ======Go back to the main page without reloading
function goBack() {
    history.back();
    document.getElementById('product-sections').style.display = 'block';
    document.getElementById('product-details').style.display = 'none';
}

// =======Add product to favorites and save to localStorage
function addToFavorites(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product && !favorites.some(fav => fav.id === productId)) {
        favorites.push(product);
        saveFavorites();
        displayFavorites();
    }
}

//======= Remove product from favorites and update localStorage
function removeFromFavorites(productId) {
    favorites = favorites.filter(fav => fav.id !== productId);
    saveFavorites();
    displayFavorites();
}

//======save favorites from localStorage
function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}
//=======load favorites from localStorage
function loadFavorites() {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
        displayFavorites();
    }
}

//======= Display favorites section
function displayFavorites() {
    const favoritesSection = document.getElementById('favorites');
    favoritesSection.innerHTML = '';

    favorites.forEach(favorite => {
        const favItem = document.createElement('div');
        favItem.classList.add('favorite-item');
        favItem.innerHTML = `
            <img src="${favorite.image}" alt="${favorite.title}">
            <div class="fav-desc">
           <span>${favorite.title}</span>           
            <span>${favorite.price}$</span>
            <button class="remove-btn" onclick="removeFromFavorites(${favorite.id})">
            <span class="material-symbols-outlined">
           delete
            </span></button>
            </div>
        `;
        favoritesSection.appendChild(favItem);
    });
}

//========= Handle the browser back/forward navigation to load product details properly
window.onpopstate = (event) => {
    if (event.state && event.state.productId) {
        const product = allProducts.find(p => p.id === event.state.productId);
        showProductDetails(product);
    } else {
        document.getElementById('product-sections').style.display = 'block';
        document.getElementById('product-details').style.display = 'none';
    }
};

//======== Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadProducts();
    loadFavorites(); //load favorites from localStorage
});

/* ======Loading Gif===== */

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadProducts();
    loadFavorites();

    // ======Hide the loading screen and show the main content after a delay
    window.addEventListener('load', () => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    });
});
