document.querySelector('#modal-body-info').addEventListener('submit', function (event) {
  event.preventDefault(); // Зупиняємо стандартну поведінку форми


  const name = document.getElementById('product-name').value;
  const model = document.getElementById('product-model').value;
  const videoResolution = document.getElementById('product-resolution').value;
  const interface = document.getElementById('product-interface').value;
  const frameRate = document.getElementById('product-frame').value;
  const viewingAngle = document.getElementById('product-angle').value;
  

  fetch('http://localhost:3000/js/product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      model: model,
      videoResolution: videoResolution,
      interface: interface,
      frameRate: frameRate,
      viewingAngle: viewingAngle,
    
    })
  })
    .then(response => {
      if (response.ok) {
        console.log('Product card successfully');
      } else {
        console.error('Error creating product card');
      }
    })
    .catch(error => {
      console.error('Error creating product card:', error);
    });
});




async function getCard(page = 1, limit = 6, searchQuery = '') {
  try {
    let url = `http://localhost:3000/js/product?page=${page}&limit=${limit}`;
    if (searchQuery) {
      url += `&query=${searchQuery}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    const { products, totalPages, currentPage } = data;

    let productContainer = document.querySelector('#product-container');
    productContainer.innerHTML = '';

    products.forEach((product) => {
      let productCardHTML = `
          <div class="col-lg-4 col-sm-6">
               <div class="product-card">
             <div class="product-img">
               <a href="#"><img class="img-fluid" src="images/291942647.webp" alt="router"></a>
             </div>
             <div class="product-details">
               <a href="#">
                 <h4 id="name-product">${product.name}</h4>
               </a>
               <p>Модель: <span id="model-product">${product.model}</span></p>
               <p>Роздальна здатність: ${product.videoResolution}</p>
               <p>Інтерфейс підключення: ${product.interface}</p>
               <p>Частота кадрів: <span class="product-speed">${product.frameRate}</span></p>
               <p>Кут огляду: <span class="product-angle">${product.viewingAngle}</span></p>
               <div class="product-bottom-details d-flex justify-content-between">
                 <div class="product-links">
                  <button class="delete-card-button" onclick="removeProduct('${product._id}')"><i class="fa-solid fa-dumpster"></i></button> 
                  </div>
                  </div>
                  </div>
                  </div>
                  </div> 
                  `;
      productContainer.innerHTML += productCardHTML;
    });



    let paginationContainer = document.querySelector('#pagination-container');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const isActive = i === currentPage ? 'active' : '';
      const pageLinkHTML = `<a class="${isActive} next-page-button" href="#" onclick="getCard(${i}, ${limit}, '${searchQuery}')">${i}</a>`;
      paginationContainer.innerHTML += pageLinkHTML;
    }
  } catch (error) {
    console.error('Error retrieving products:', error);
  }
}

function searchProducts(event) {
  event.preventDefault();

  const searchQuery = document.getElementById('search-for-card').value;
  getCard(1, 6, searchQuery);
}

getCard();