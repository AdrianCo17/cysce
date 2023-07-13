function populateInventoryTable() {
  fetch('/getInventoryData')
    .then((response) => response.json())
    .then((inventoryData) => {
      var inventarioRows = '';
      for (var i = 0; i < inventoryData.length; i++) {
        var row = `<tr>
                    <td>${inventoryData[i].Id}</td>
                    <td>${inventoryData[i].Material}</td>
                    <td>${inventoryData[i].Descripcion}</td>
                    <td>${inventoryData[i].Cantidad}</td>
                    <td>${inventoryData[i].PrecioUnitario}</td>
                  </tr>`;
        inventarioRows += row;
      }

      var cuerpoInventario = document.getElementById('cuerpo-inventario');
      cuerpoInventario.innerHTML = inventarioRows;
    })
    .catch((error) => {
      console.log(error);
    });
}

window.addEventListener('DOMContentLoaded', populateInventoryTable);

const inventario = [];
const historialCompras = [];
const historialVentas = [];

const tablaInventario = document.getElementById('tabla-inventario');
const cuerpoInventario = document.getElementById('cuerpo-inventario');

const formCompra = document.getElementById('form-compra');
const formVenta = document.getElementById('form-venta');

const btnInventario = document.getElementById('btn-inventario');
const btnCompra = document.getElementById('btn-compra');
const btnVenta = document.getElementById('btn-venta');
const btnHistorialCompras = document.getElementById('btn-historial-compras');
const btnHistorialVentas = document.getElementById('btn-historial-ventas');
const btnDescargarCompras = document.getElementById('btn-descargar-compras');
const btnDescargarVentas = document.getElementById('btn-descargar-ventas');

const historialComprasContainer = document.getElementById('historial-compras-container');
const historialVentasContainer = document.getElementById('historial-ventas-container');

btnInventario.addEventListener('click', function() {
  ocultarSecciones();
  document.getElementById('section-inventario').style.display = 'block';
});

btnCompra.addEventListener('click', function() {
  ocultarSecciones();
  document.getElementById('section-compra').style.display = 'block';
});

btnVenta.addEventListener('click', function() {
  ocultarSecciones();
  document.getElementById('section-venta').style.display = 'block';
});

btnHistorialCompras.addEventListener('click', function() {
  ocultarSecciones();
  document.getElementById('section-historial-compras').style.display = 'block';

  historialComprasContainer.innerHTML = '';

  if (historialCompras.length === 0) {
    historialComprasContainer.textContent = 'No hay registros de compras.';
  } else {
    for (let compra of historialCompras) {
      const registroCompra = document.createElement('div');
      registroCompra.textContent = `Material: ${compra.material}, Cantidad: ${compra.cantidad}, Precio: $${compra.precio}, Proveedor: ${compra.proveedor}, Fecha: ${compra.fecha}`;
      historialComprasContainer.appendChild(registroCompra);
    }
  }
});

btnHistorialVentas.addEventListener('click', function() {
  ocultarSecciones();
  document.getElementById('section-historial-ventas').style.display = 'block';

  historialVentasContainer.innerHTML = '';

  if (historialVentas.length === 0) {
    historialVentasContainer.textContent = 'No hay registros de ventas.';
  } else {
    for (let venta of historialVentas) {
      const registroVenta = document.createElement('div');
      registroVenta.textContent = `Material: ${venta.material}, Cantidad: ${venta.cantidad}, Precio: $${venta.precio}, Empresa: ${venta.empresa}, Fecha: ${venta.fecha}`;
      historialVentasContainer.appendChild(registroVenta);
    }
  }
});

formCompra.addEventListener('submit', function(event) {
  event.preventDefault();

  const clave = document.getElementById('clave-compra').value;
  const material = document.getElementById('material-compra').value;
  const descripcion = document.getElementById('descripcion-compra').value;
  const cantidad = parseInt(document.getElementById('cantidad-compra').value);
  const precio = parseFloat(document.getElementById('precio-compra').value);
  const proveedor = document.getElementById('proveedor-compra').value;
  const fecha = document.getElementById('fecha-compra').value;

  const precioTotal = cantidad * precio;

  const registroCompra = {
    material,
    cantidad,
    precio,
    proveedor,
    fecha
  };

  const indiceMaterial = inventario.findIndex(item => item.clave === clave);

  if (indiceMaterial === -1) {
    // Agregar nuevo material al inventario
    inventario.push({
      clave,
      material,
      descripcion,
      cantidad,
      precio,
      precioTotal
    });
  } else {
    // Actualizar material existente en el inventario
    inventario[indiceMaterial].cantidad += cantidad;
    inventario[indiceMaterial].precioTotal += precioTotal;
  }

  historialCompras.push(registroCompra);

  actualizarInventario();
  formCompra.reset();
});

formVenta.addEventListener('submit', function(event) {
  event.preventDefault();

  const clave = document.getElementById('clave-venta').value;
  const material = document.getElementById('material-venta').value;
  const cantidad = parseInt(document.getElementById('cantidad-venta').value);
  const precio = parseFloat(document.getElementById('precio-venta').value);
  const empresa = document.getElementById('empresa-venta').value;
  const fecha = document.getElementById('fecha-venta').value;

  const precioTotal = cantidad * precio;

  const registroVenta = {
    material,
    cantidad,
    precio,
    empresa,
    fecha
  };

  const indiceMaterial = inventario.findIndex(item => item.clave === clave);

  if (indiceMaterial === -1) {
    alert('No se encontró el material en el inventario.');
    return;
  }

  if (cantidad > inventario[indiceMaterial].cantidad) {
    alert('No hay suficiente cantidad de material en el inventario.');
    return;
  }

  inventario[indiceMaterial].cantidad -= cantidad;
  historialVentas.push(registroVenta);

  actualizarInventario();
  formVenta.reset();
});

btnDescargarCompras.addEventListener('click', function() {
  descargarRegistros('compras.csv', generarContenidoCSV(historialCompras));
});

btnDescargarVentas.addEventListener('click', function() {
  descargarRegistros('ventas.csv', generarContenidoCSV(historialVentas));
});

function ocultarSecciones() {
  const secciones = document.getElementsByClassName('section');
  for (let seccion of secciones) {
    seccion.style.display = 'none';
  }
}

function actualizarInventario() {
  cuerpoInventario.innerHTML = '';

  for (let item of inventario) {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${item.clave}</td>
      <td>${item.material}</td>
      <td>${item.descripcion}</td>
      <td>${item.cantidad}</td>
      <td>$${item.precio.toFixed(2)}</td>
      <td>$${item.precioTotal.toFixed(2)}</td>
    `;

    // Agregar estilo al material cuando quedan menos de 11 piezas
    if (item.cantidad < 11) {
      fila.style.backgroundColor = 'red';
      fila.style.color = 'white';
    }

    cuerpoInventario.appendChild(fila);
  }
}

function descargarRegistros(nombreArchivo, contenido) {
  const enlaceDescarga = document.createElement('a');
  enlaceDescarga.href = URL.createObjectURL(new Blob([contenido], { type: 'text/csv' }));
  enlaceDescarga.download = nombreArchivo;
  enlaceDescarga.click();
}

function generarContenidoCSV(registros) {
  let contenido = 'Material,Cantidad,Precio,Proveedor,Fecha\n';

  for (let registro of registros) {
    contenido += `${registro.material},${registro.cantidad},${registro.precio},${registro.proveedor},${registro.fecha}\n`;
  }

  return contenido;
}