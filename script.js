// dom element
const productDom = document.querySelector(".products-center")
const cartDom = document.querySelector('.cart-content')
const cartMain = document.querySelector('.cart')
const cartPrice = document.querySelector('.cart-total')
const cartItems = document.querySelector('.cart-items')
const cartOverlay = document.querySelector('.cart-overlay')
const cartButton = document.querySelector('.cart-btn')
const cartClose = document.querySelector('.close-cart')
const clearCart = document.querySelector('.btn-clear')
const removeItem = document.querySelector('.remove-item')
const loginLink = document.querySelector('.login-link')
const loginModel = document.querySelector('.login-model')
const buyModel = document.querySelector('.buy-model')
const buyContent = document.querySelector('.buy-content')
const closeModel = document.querySelector('.close-model')
const closeBuyModel = document.querySelector('.close-buy-model')
const btnBuy = document.querySelector('.btn-buy')
const totalBuyPrice = document.querySelector('.total-buy-price')
console.log(loginModel,"message")
//cart products
let cart = []

// products class
class products {
    async getProducts() {
        try {
            const result = await fetch("Product.json");//return response object
            const products = await result.json();//to get data from response object which inside in body
            let data = products.items;
            data = data.map((item) => {
                const { title, price, type, rating } = item.fields;
                const id = item.sys.id;
                const url = item.fields.image.fields.file.url;
                return { title, price, type, rating, id, url };
            })
            return data;
        } catch (error) {
            console.log(error)
        }
    }
}


// display class
class UserInterface {
    insertProductsInDom(products) {
        let result = "";
        products.forEach((element) => {
            let star = "";
            for (let i = 0; i < element.rating; i++) {
                star += `<i class="fa-solid fa-star"></i>`//give colored star
            }
            for (let i = 0; i < 5 - element.rating; i++) {
                star += `<i class="fa-regular fa-star"></i>`//give empty star
            }
            result +=
                `<article class="product">
            <div class="img-container">
            <img src = ${element.url} alt="product" class="product-img">
            <button class="bag-btn" data-id=${element.id}><i class="fas fa-shopping-cart"></i>Add To Cart</button>
            <p>${element.title}</p>
            </div>
            <div>
            <h4 class = "light">${element.type}</h4>
            <h4 class = "price">$${element.price}</h4>
            </div>
            <div class="star">${star}</div>
            </article>
            `
        })
        productDom.innerHTML = result;
    }
    addCartItems(cart) {
        let cartHtml = "";
        cart.forEach((cartItem) => {
            cartHtml +=
                `<div class="cart-item">
            <img src=${cartItem.url} alt="cart">
            <div>
            <h4>${cartItem.title}</h4>
            <h5>$ ${cartItem.price}</h5>
            <span class="remove-item" data-id=${cartItem.id}>remove</span>
            </div>
            <div class="addremove" data-id=${cartItem.id}>
            <i class="fa-solid fa-circle-plus"></i>
            <p class="itemNo">${cartItem.amount}</p>
            <i class="fa-solid fa-circle-minus"></i>
            </div>
            </div>
            `
        });
        cartDom.innerHTML = cartHtml;
    }
    setCartValues(cart) {
        let totalPrice = 0;
        let totalItems = 0;
        cart = cart.map((cartItem) => {
            totalPrice += cartItem.price * cartItem.amount;
            totalItems += cartItem.amount;
        });
        cartPrice.innerHTML = parseFloat(totalPrice.toFixed(2));
        cartItems.innerHTML = totalItems
    }
    showCart() {
        cartOverlay.classList.add("show-cart");
        cartMain.classList.add("transparentbg")
    }
    closeCart() {
        cartOverlay.classList.remove("show-cart")
        cartMain.classList.remove("transparentbg")
    }

    initialSetup() {
        cart = Storage.getCart()
        this.setCartValues(cart)
        this.addCartItems(cart)
    }
    resetButtons() {
        // convert nodelist into array
        let buttons = [...document.querySelectorAll(".bag-btn")];
        buttons.forEach((btn) => {
            // getting id from data attribute
            let id = btn.dataset.id;
            let incart = cart.find((items) => items.id === id);
            if (incart) {
                btn.innerHTML = "In Cart";
                btn.disabled = true;
            }
            else {
                btn.innerHTML = "Add to Cart";
                btn.disabled = false;
            }
        })

    }
    getBagButtons() {
        let buttons = [...document.querySelectorAll(".bag-btn")];
        buttons.forEach((btn) => {
            // getting id from data attribute
            let id = btn.dataset.id;
            let incart = cart.find((items) => items.id === id);
            if (incart) {
                btn.innerHTML = "In Cart";
                btn.disabled = true;
            }
            btn.addEventListener("click", (event) => {
                event.target.innerHTML = "In Cart"
                event.target.disabled = true;
                //get selected product
                let selectedProduct = Storage.getLocalProduct(event.target.dataset.id);
                //updating cartitems
                selectedProduct = { ...selectedProduct, amount: 1 }
                cart = [...cart, selectedProduct]
                //updating cart in local storage
                Storage.setCartItems(cart)
                //setting the cart values
                this.setCartValues(cart)
                //show cart value
                this.addCartItems(cart)
                //adding show class
                this.showCart()
            })
        })
    }




    cartFuntionality() {
        cartDom.addEventListener('click', (event) => {
            if (event.target.classList.contains("remove-item")) {
                //filter can be used
                let index = cart.findIndex((item) =>
                    item.id === event.target.dataset.id
                );
                cart.splice(index, 1)
                Storage.setCartItems(cart)
                this.setCartValues(cart)
                this.addCartItems(cart)
                this.resetButtons()
            }
            if (event.target.classList.contains("fa-circle-plus")) {
                let tempItem = cart.find(item =>
                    item.id === event.target.parentElement.dataset.id)
                tempItem.amount = tempItem.amount + 1;
                Storage.setCartItems(cart)
                this.setCartValues(cart)
                this.addCartItems(cart)
            }
            if (event.target.classList.contains("fa-circle-minus")) {
                let tempItem = cart.find(item =>
                    item.id === event.target.parentElement.dataset.id)
                if (tempItem.amount === 1) {
                    let index = cart.findIndex((item) =>
                        item.id === event.target.parentElement.dataset.id
                    );
                    cart.splice(index, 1)
                    Storage.setCartItems(cart)
                    this.setCartValues(cart)
                    this.addCartItems(cart)
                    this.resetButtons()
                }
                tempItem.amount = tempItem.amount - 1;
                Storage.setCartItems(cart)
                this.setCartValues(cart)
                this.addCartItems(cart)


            }
        })
    }

    clearCart() {
        cart = [];
        Storage.setCartItems(cart)
        //setting the cart values
        this.setCartValues(cart)
        //show cart values
        this.addCartItems(cart)
        // remove show class
        this.closeCart();
        // resetting buttons
        this.resetButtons();
    }
    addCartItemsToModel(cart) {
        let cartitem = ""
        let totalPrice = 0;
        cart.forEach((cartItems) => {
            totalPrice += cartItems.price*cartItems.amount;
            cartitem += `
            <div class = "cart-item">
            <img src=${cartItems.url} alt="cart">
            <div>
            <h4>${cartItems.title}</h4>
            <h5>${cartItems.price}</h5>
            </div>
            <div class="addremove" data-id=${cartItems.id}>
            <p class="itemNo">${cartItems.amount}</p>
            </div>
            </div>
            `
        })
        buyContent.innerHTML = cartitem;
        totalBuyPrice.innerHTML = totalPrice;
    }

}

//Storage class
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getLocalProduct(id) {
        return JSON.parse(localStorage.getItem("products")).find(
            (prod) => prod.id === id
        )
    }
    static setCartItems(cart) {
        localStorage.setItem("Cart", JSON.stringify(cart))
    }
    static getCart(id) {
        return localStorage.getItem("Cart") ? JSON.parse(localStorage.getItem("Cart")) : [];

    }
}
document.addEventListener("DOMContentLoaded", () => {
    const p = new products();
    const ui = new UserInterface();

    p.getProducts().then(data => {
        console.log(data)
        ui.insertProductsInDom(data)
        console.log(ui.insertProductsInDom(data))//rendering products in browser
        Storage.saveProducts(data);//saving products in local storage
        ui.initialSetup();
        ui.getBagButtons();
        ui.cartFuntionality();
    })
    //then will be executed but just u want receive any anything inside in
    // .then(()=>{
    //     ui.initialSetup();
    //     ui.getBagButtons();
    //     ui.CardFuntionality();
    // })
})
cartClose.addEventListener('click', () => {
    const ui = new UserInterface();
    ui.closeCart();
})
cartButton.addEventListener('click', () => {
    const ui = new UserInterface();
    ui.showCart();
})
btnBuy.onclick = () => {
    const ui = new UserInterface();
    let cartVal = Storage.getCart();
    ui.addCartItemsToModel(cartVal);
    ui.closeCart();
    ui.clearCart();
  buyModel.style.color="green";
  buyModel.style.display = "block";
// document.querySelector('.buy-model').style.display = "block";
}
closeBuyModel.onclick = () => {
    buyModel.style.display = "none";
}
clearCart.onclick = () => {
    const ui = new UserInterface();
    ui.clearCart();
}
loginLink.onclick = () => {
    loginModel.style.display = "block";
}
closeModel.onclick = function () {
    loginModel.style.display = "none";
}
//close model when the user clicks anywhere outside the model
 window.onclick = function(event){
    console.log(event.target,"msg")
      if(event.target == loginModel){
        loginModel.style.display = "none";
    }
}