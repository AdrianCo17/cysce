var express = require('express');
var router = express.Router();

var database = require('../database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', session : req.session });
});

router.get('/getInventoryData', function(req, res, next) {
  getInventario = `SELECT * FROM material ORDER BY Cantidad ASC`
  database.query(getInventario, function(error, inventoryData) {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Ocurrio un error.' });
    } else {

      res.json(inventoryData);
    }
  });
});

router.post('/login', function(request, response, next){

    var Usuario = request.body.Usuario;

    var Contraseña = request.body.Contraseña;

    if(Usuario && Contraseña)
    {
        query = `SELECT * FROM users WHERE Usuario = "${Usuario}"`;

        database.query(query, function(error, data){
          console.log(data);

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

router.post('/logout', function(request, response, next){

    request.session.destroy();

    response.redirect("/");

});

router.post('/compra', function(request, response, next)
{
  var clave = request.body.clave;
  var material = request.body.material;
  var descripcion = request.body.descripcion;
  var cantidad = parseInt(request.body.cantidad);
  var precio = parseFloat(request.body.precio);
  var proveedor = request.body.proveedor;
  var fecha = request.body.fecha;

  query = `SELECT * FROM material WHERE Id = "${clave}"`;
  database.query(query, function(error, data){
    if(data.length == 0){
      addMaterial = `insert into material values ("${clave}", "${material}", "${descripcion}", "${cantidad}", "${precio}")`;
      addHistorialCompras = `insert into historialcompra (Proveedor, IdMaterial, Fecha) values ("${proveedor}", "${clave}", "${fecha}")`;

      database.query(addMaterial);
      database.query(addHistorialCompras);

    } else {
      updateMaterial = `update material set Cantidad = Cantidad + "${cantidad}" where Id = "${clave}"`;
      addHistorialCompras = `insert into historialcompra (Proveedor, IdMaterial, Cantidad, Fecha) values ("${proveedor}", "${clave}", "${cantidad}", "${fecha}")`;

      database.query(updateMaterial);
      database.query(addHistorialCompras);
    }
    request.session.Id = data[0].Id;
    response.redirect('/');
  });
});

router.post('/venta', function(request, response, next){
  console.log('Received request body:', request.body);

  var clave = request.body.claveventa;
  var cantidad = parseInt(request.body.cantidadventa);
  var proveedor = request.body.empresaventa;
  var fecha = request.body.fechaventa;

  query = `SELECT * FROM material WHERE Id = "${clave}"`;
  console.log(query);
  database.query(query, function(error, data){
    console.log(data);
    if(data.length === 0){
      response.send('no existe');
    } else {
      // The error should not occur here anymore
      if(data[0].Cantidad >= cantidad){
        updateMaterial = `update material set Cantidad = Cantidad - ${cantidad} where Id = "${clave}"`;
        addHistorialVenta = `insert into historialventa (Proveedor, IdMaterial, Cantidad, Fecha) values ("${proveedor}", "${clave}", ${cantidad}, "${fecha}")`;

        console.log(updateMaterial);
        console.log(addHistorialVenta);
        database.query(updateMaterial);
        database.query(addHistorialVenta);

        request.session.Id = data[0].Id;
        response.redirect('/');
      } else {
        response.send(data[0].Cantidad);
      }
    }
  });
});

router.get('/getCompras', function(req, res, next) {
  getCompras = `SELECT m.material, c.cantidad, m.PrecioUnitario, c.proveedor, c.fecha FROM historialcompra c LEFT JOIN material m on m.Id = c.IdMaterial; `;
  database.query(getCompras, function(error, comprasData) {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Ocurrió un error al obtener los datos de compras.' });
    } else {
      res.json(comprasData);
    }
  });
});


router.get('/getVentas', function(req, res, next) {
  getVentas = `SELECT m.material, c.cantidad, m.PrecioUnitario, c.proveedor, c.fecha FROM historialventa c LEFT JOIN material m on m.Id = c.IdMaterial; `;
  database.query(getVentas, function(error, ventasData) {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Ocurrio un error.' });
    } else {
      res.json(ventasData);
    }
  });
});


module.exports = router;
