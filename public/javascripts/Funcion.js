function cerrarSesion() {
  // Hacer una petición al servidor para cerrar la sesión
  fetch('/logout', {
    method: 'POST',
  })
  .then(response => {
    // Si la respuesta es exitosa, redireccionar al usuario a la página de inicio ("/")
    if (response.ok) {
      window.location.href = '/';
    } else {
      // Manejar el caso de error si es necesario
      console.error('Error al cerrar sesión');
    }
  })
  .catch(error => {
    console.error('Error al cerrar sesión:', error);
  });
}


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
                    <td>${inventoryData[i].PrecioUnitario*inventoryData[i].Cantidad}</td>
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

function populateHistorialComprasTable() {
  fetch('/getCompras')
    .then((response) => response.json())
    .then((comprasData) => {
      historialCompras.push(...comprasData); // Append the new data to historialCompras
      var historialComprasRows = '';
      for (var i = 0; i < comprasData.length; i++) {
        var row = `<tr>
                    <td>${comprasData[i].material}</td>
                    <td>${comprasData[i].cantidad}</td>
                    <td>${comprasData[i].PrecioUnitario}</td>
                    <td>${comprasData[i].proveedor}</td>
                    <td>${comprasData[i].fecha}</td>
                  </tr>`;
        historialComprasRows += row;
      }

      var historialComprasContainer = document.getElementById('historial-compras-container');
      historialComprasContainer.innerHTML = `
        <table id="tabla-inventario">
          <thead>
            <tr>
              <th>Material</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Proveedor</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            ${historialComprasRows}
          </tbody>
        </table>
      `;
      var btnDescargarCompras = document.getElementById('btn-descargar-compras');
      btnDescargarCompras.addEventListener('click', function() {
        const csvContent = generateCSVContent(comprasData);
        descargarRegistros('compras.csv', csvContent);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function populateHistorialVentasTable() {
  fetch('/getVentas')
    .then((response) => response.json())
    .then((ventasData) => {
      var historialVentasRows = '';
      for (var i = 0; i < ventasData.length; i++) {
        var row = `<tr>
                    <td>${ventasData[i].material}</td>
                    <td>${ventasData[i].cantidad}</td>
                    <td>${ventasData[i].PrecioUnitario}</td>
                    <td>${ventasData[i].proveedor}</td>
                    <td>${ventasData[i].fecha}</td>
                  </tr>`;
        historialVentasRows += row;
      }

      var historialVentasContainer = document.getElementById('historial-ventas-container');
      historialVentasContainer.innerHTML = `
        <table id="tabla-inventario">
          <thead>
            <tr>
              <th>Material</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Proveedor</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            ${historialVentasRows}
          </tbody>
        </table>
      `;
      var btnDescargarVentas = document.getElementById('btn-descargar-ventas');
      btnDescargarVentas.addEventListener('click', function() {
        const csvContent = generateCSVContent(ventasData);
        descargarRegistros('ventas.csv', csvContent);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function generateCSVContent(data) {
  let csvContent = 'Material,Cantidad,Precio Unitario,Proveedor,Fecha\n';
  data.forEach(item => {
    csvContent += `${item.material},${item.cantidad},${item.PrecioUnitario},${item.proveedor},${item.fecha}\n`;
  });
  return csvContent;
}


function loadInitialData() {
  populateInventoryTable();
  populateHistorialComprasTable();
  populateHistorialVentasTable();
}

window.addEventListener('DOMContentLoaded', loadInitialData);

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
});

btnHistorialVentas.addEventListener('click', function() {
  ocultarSecciones();
  document.getElementById('section-historial-ventas').style.display = 'block';
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
  let contenido = 'Proveedor,IdMaterial,cantidad,Fecha\n';

  for (let registro of registros) {
    contenido += `${registro.proveedor},${registro.IdMaterial},${registro.cantidad},${registro.fecha}\n`;
  }

  return contenido;
}