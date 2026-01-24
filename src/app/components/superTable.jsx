"use client";

import { useEffect, useState } from "react";

export default function SuperTable({ products, onSave }) {
  // Estado para los productos editados temporalmente
  const [editedProducts, setEditedProducts] = useState([]);
  // Estado para rastrear qué campos han sido modificados
  const [modifiedIds, setModifiedIds] = useState(new Set());
  
  // Inicializar los datos editables cuando cambian los productos originales
  useEffect(() => {
    setEditedProducts(products.map(p => ({ ...p })));
    setModifiedIds(new Set());
  }, [products]);
  
  // Función para manejar cambios en los campos editables
  const handleFieldChange = (id, field, value) => {
    setEditedProducts(prev => 
      prev.map(product => {
        if (product.id === id) {
          const newValue = field === 'price' ? parseFloat(value) || 0 : parseInt(value) || 0;
          
          // Marcar como modificado si el valor cambió
          const originalProduct = products.find(p => p.id === id);
          if (originalProduct && originalProduct[field] !== newValue) {
            setModifiedIds(prevIds => new Set([...prevIds, id]));
          } else {
            // Si vuelve al valor original, quitar de modificados
            setModifiedIds(prevIds => {
              const newIds = new Set([...prevIds]);
              newIds.delete(id);
              return newIds;
            });
          }
          
          return { ...product, [field]: newValue };
        }
        return product;
      })
    );
  };
  
  // Función para guardar cambios
  const handleSave = () => {
    if (onSave) {
      // Solo enviar los productos modificados
      const changedProducts = editedProducts.filter((product, index) => {
        if (modifiedIds.has(product.id)) {
          const original = products.find(p => p.id === product.id);
          return JSON.stringify(original) !== JSON.stringify(product);
        }
        return false;
      });
      
      onSave(changedProducts);
      setModifiedIds(new Set()); // Limpiar modificados después de guardar
    }
  };
  
  // Función para descartar cambios
  const handleDiscard = () => {
    setEditedProducts(products.map(p => ({ ...p })));
    setModifiedIds(new Set());
  };
  
  // Verificar si hay cambios pendientes
  const hasChanges = modifiedIds.size > 0;
  
  const productsRows = editedProducts.map(x => {
    const isModified = modifiedIds.has(x.id);
    
    return (
      <tr 
        key={x.id} 
        className={`border-b hover:bg-gray-50 ${isModified ? 'bg-yellow-50' : 'bg-white'}`}
      >
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {x.name}
          {isModified && (
            <span className="ml-2 text-xs text-yellow-600 font-normal">
              (modificado)
            </span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              value={x.price}
              onChange={(e) => handleFieldChange(x.id, 'price', e.target.value)}
              className={`text-sm text-gray-900 border rounded px-2 py-1 w-32 focus:ring-2 focus:outline-none ${
                isModified 
                  ? 'border-yellow-400 bg-yellow-50 focus:ring-yellow-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {isModified && (
              <span className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-500 rounded-full"></span>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="relative">
            <input
              type="number"
              min="0"
              value={x.stock}
              onChange={(e) => handleFieldChange(x.id, 'stock', e.target.value)}
              className={`text-sm text-gray-900 border rounded px-2 py-1 w-24 focus:ring-2 focus:outline-none ${
                isModified 
                  ? 'border-yellow-400 bg-yellow-50 focus:ring-yellow-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {isModified && (
              <span className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-500 rounded-full"></span>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button className="bg-[--color2] text-[--color1] font-bold px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-[amber-500]">
            Editar
          </button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button className="bg-[--color1] text-[--color2] font-bold px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-[amber-500]">Eliminar</button>
        </td>
      </tr>
    );
  });

  return (
    <div className="grid grid-flow-row">
      {/* Indicador de cambios pendientes */}
      {hasChanges && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-yellow-700">
                Tienes {modifiedIds.size} producto(s) con cambios sin guardar
              </span>
            </div>
            <div className="space-x-2">
              <button
                onClick={handleDiscard}
                className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Descartar cambios
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Precio
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {productsRows}
        </tbody>
      </table>
      
      {/* Botones de acción en la parte inferior también */}
      {hasChanges && (
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={handleDiscard}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Guardar cambios a la base de datos
          </button>
        </div>
      )}
    </div>
  );
}