const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
  const productElement = btn.closest('article');
  fetch("/admin/product/" + prodId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((res) => res.json())
    .then(data => {
        console.log(data)
        // удаляем дом-елемент
        productElement.parentNode.removeChild(productElement) // для IE и всех браузеров
        // productElement.remove() // современные браузеры
    })
    .catch((err) => {
      console.log(err);
    });
};
