var express = require('express');
var router = express.Router();

var database = require('../database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', session : req.session });
});

router.post('/login', function(request, response, next){

    var Usuario = request.body.Usuario;

    var Contraseña = request.body.Contraseña;

    if(Usuario && Contraseña)
    {
        query = `
        SELECT * FROM users 
        WHERE Usuario = "${Usuario}"
        `;

        database.query(query, function(error, data){

            if(data.length > 0)
            {
                for(var count = 0; count < data.length; count++)
                {
                    if(data[count].Contraseña == Contraseña)
                    {
                        request.session.Id = data[count].Id;

                        response.redirect("/");
                    }
                    else
                    {
                        response.send('Incorrect Password');
                    }
                }
            }
            else
            {
                response.send('Incorrect Email Address');
            }
            response.end();
        });
    }
    else
    {
        response.send('Please Enter Email Address and Password Details');
        response.end();
    }

});

router.get('/logout', function(request, response, next){

    request.session.destroy();

    response.redirect("/");

});

router.get('/compra', function(request, response, next)
{
  const clave = request.response('clave-compra').value;
  const material = request.response('material-compra').value;
  const descripcion = request.response('descripcion-compra').value;
  const cantidad = parseInt(request.response('cantidad-compra').value);
  const precio = parseFloat(request.response('precio-compra').value);
  const proveedor = request.response('proveedor-compra').value;
  const fecha = request.response('fecha-compra').value;
  const precioTotal = cantidad * precio;

  query = `SELECT * FROM material WHERE Id = "${Clave}"`;
  database.query(query, function(error, data){
    if(data.length > 0){
      
    }
  }


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
  response.redirect("/");

});

router.get('/venta', function(request, response, next){

  const clave = request.response('clave-venta').value;
  const material = request.response('material-venta').value;
  const cantidad = parseInt(request.response('cantidad-venta').value);
  const precio = parseFloat(request.response('precio-venta').value);
  const empresa = request.response('empresa-venta').value;
  const fecha = request.response('fecha-venta').value;

  response.redirect("/");

});
module.exports = router;
