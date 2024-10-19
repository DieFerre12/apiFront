import React, { useState } from 'react';

const Admin = () => {
  const [newProduct, setNewProduct] = useState({
    model: '',
    description: '',
    genre: '',
    brand: '',
    price: '',
    categoryType: '',
    image: '',
    sizeStockMap: {}
  });

  const [updateProduct, setUpdateProduct] = useState({
    model: '',
    price: ''
  });

  const [deleteModel, setDeleteModel] = useState('');

  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSizeChange = (size, stock) => {
    setNewProduct(prevState => {
      const sizeStockMap = { ...prevState.sizeStockMap, [size]: parseInt(stock) };
      return { ...prevState, sizeStockMap };
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Obtener el token JWT del almacenamiento local
      if (!token) {
        alert('No se encontró el token de autenticación. Por favor, inicia sesión.');
        return;
      }

      // Validar que la URL de la imagen termine en .png
      if (!newProduct.image.endsWith('.png')) {
        alert('La URL de la imagen debe terminar en .png');
        return;
      }

      console.log('Token JWT:', token); // Depuración: Verificar el token JWT

      const response = await fetch('http://localhost:4002/products/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Enviar el token JWT en el encabezado de autorización
        },
        body: JSON.stringify(newProduct)
      });

      console.log('Respuesta del servidor:', response); // Depuración: Verificar la respuesta del servidor

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error 403:', errorText); // Depuración: Verificar el mensaje de error
        throw new Error(`Error al agregar el producto: ${errorText}`);
      }

      alert('Producto agregado exitosamente');
      setNewProduct({
        model: '',
        description: '',
        genre: '',
        brand: '',
        price: '',
        categoryType: '',
        image: '',
        sizeStockMap: {}
      });
    } catch (error) {
      console.error('Error:', error);
      alert(`Hubo un error al agregar el producto: ${error.message}`);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Obtener el token JWT del almacenamiento local
      if (!token) {
        alert('No se encontró el token de autenticación. Por favor, inicia sesión.');
        return;
      }

      console.log('Token JWT:', token); // Depuración: Verificar el token JWT

      const response = await fetch('http://localhost:4002/products/updateProductPrice', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Enviar el token JWT en el encabezado de autorización
        },
        body: JSON.stringify(updateProduct)
      });

      console.log('Respuesta del servidor:', response); // Depuración: Verificar la respuesta del servidor

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error 403:', errorText); // Depuración: Verificar el mensaje de error
        throw new Error(`Error al modificar el producto: ${errorText}`);
      }

      alert('Producto modificado exitosamente');
      setUpdateProduct({
        model: '',
        price: ''
      });
    } catch (error) {
      console.error('Error:', error);
      alert(`Hubo un error al modificar el producto: ${error.message}`);
    }
  };

  const handleDeleteProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Obtener el token JWT del almacenamiento local
      if (!token) {
        alert('No se encontró el token de autenticación. Por favor, inicia sesión.');
        return;
      }

      console.log('Token JWT:', token); // Depuración: Verificar el token JWT

      const response = await fetch(`http://localhost:4002/products/${deleteModel}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` // Enviar el token JWT en el encabezado de autorización
        }
      });

      console.log('Respuesta del servidor:', response); // Depuración: Verificar la respuesta del servidor

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error 403:', errorText); // Depuración: Verificar el mensaje de error
        throw new Error(`Error al eliminar el producto: ${errorText}`);
      }

      alert('Producto eliminado exitosamente');
      setDeleteModel('');
    } catch (error) {
      console.error('Error:', error);
      alert(`Hubo un error al eliminar el producto: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg mt-8 max-w-5xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Administración de Productos</h2>

      {/* Agregar Producto */}
      <form onSubmit={handleAddProduct} className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Agregar Producto</h3>
        <div className="mb-4">
          <label className="block text-gray-700">Modelo</label>
          <input
            type="text"
            name="model"
            value={newProduct.model}
            onChange={(e) => handleInputChange(e, setNewProduct)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Descripción</label>
          <textarea
            name="description"
            value={newProduct.description}
            onChange={(e) => handleInputChange(e, setNewProduct)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Género</label>
          <input
            type="text"
            name="genre"
            value={newProduct.genre}
            onChange={(e) => handleInputChange(e, setNewProduct)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Marca</label>
          <input
            type="text"
            name="brand"
            value={newProduct.brand}
            onChange={(e) => handleInputChange(e, setNewProduct)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Precio</label>
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={(e) => handleInputChange(e, setNewProduct)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Categoría</label>
          <input
            type="text"
            name="categoryType"
            value={newProduct.categoryType}
            onChange={(e) => handleInputChange(e, setNewProduct)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Imagen URL (PNG)</label>
          <input
            type="text"
            name="image"
            value={newProduct.image}
            onChange={(e) => handleInputChange(e, setNewProduct)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Talles y Stock</label>
          <div className="flex space-x-2">
            {[37, 38, 39, 40, 41, 42].map(size => (
              <div key={size} className="flex flex-col items-center">
                <label className="block text-gray-700">{size}</label>
                <input
                  type="number"
                  placeholder="Stock"
                  onChange={(e) => handleSizeChange(`SIZE_${size}`, e.target.value)}
                  className="w-16 p-2 border rounded"
                />
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Agregar Producto
        </button>
      </form>

      {/* Modificar Producto */}
      <form onSubmit={handleUpdateProduct} className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Modificar Producto</h3>
        <div className="mb-4">
          <label className="block text-gray-700">Modelo</label>
          <input
            type="text"
            name="model"
            value={updateProduct.model}
            onChange={(e) => handleInputChange(e, setUpdateProduct)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Nuevo Precio</label>
          <input
            type="number"
            name="price"
            value={updateProduct.price}
            onChange={(e) => handleInputChange(e, setUpdateProduct)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Modificar Producto
        </button>
      </form>

      {/* Eliminar Producto */}
      <form onSubmit={handleDeleteProduct}>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Eliminar Producto</h3>
        <div className="mb-4">
          <label className="block text-gray-700">Modelo</label>
          <input
            type="text"
            name="model"
            value={deleteModel}
            onChange={(e) => setDeleteModel(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-red-500 text-white py-2 px-4 rounded">
          Eliminar Producto
        </button>
      </form>
    </div>
  );
};

export default Admin;