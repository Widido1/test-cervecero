"use client";
import { useState } from "react";
import Navbar from "./navbar";
import Cart from "./cart";
import Pie from "./pie";
import SuperTable from "./superTable";
import { updateAllProducts } from "../actions/updateAllProducts";


export default function TableP(props) {
  const [displayCart, setDisplayCart] = useState(false); //estado del carrito, si esta abierto o cerrado
  const [products, setProducts] = useState(props.products); //estado de los productos
  const [isSaving, setIsSaving] = useState(false);

    const handleSaveChanges = async (changedProducts) => {
    if (changedProducts.length === 0) {
      alert("No hay cambios");
      return;
    }

    setIsSaving(true);

    try {
      // Llamada directa a la Server Action
      await updateAllProducts(changedProducts);
      
      // Actualizar estado local
      setProducts(current => 
        current.map(p => {
          const changed = changedProducts.find(cp => cp.id === p.id);
          return changed || p;
        })
      );
      
      alert('✅ Cambios guardados');
      
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="grid grid-flow-row">
      <Navbar display={displayCart} setDisplay={setDisplayCart}/>
      <div className="grid h-[100px]"></div> {/* Espacio para el navbar */}
       <div className="min-h-[800px] theme1 pt-8 px-4">
        <div>
          <div>Cantidad de Productos: {products.length}</div>
          <button>Crear Nuevo Producto</button>
        </div>
        {isSaving && (
          <div className="mb-2 p-2 bg-blue-100 text-blue-800 rounded text-center">
            Guardando...
          </div>
        )}
        
        <SuperTable 
          products={products} 
          onSave={handleSaveChanges}
        />
      </div>
      <Cart className active={displayCart} setActive={setDisplayCart}/>
      <Pie/>
    </div>
  )    
}