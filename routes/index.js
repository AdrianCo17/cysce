var express = require('express');
var router = express.Router();

var database = require('../database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', session : req.session });
});

router.get('/getInventoryData', function(req, res, next) {
  getInventario = `SELECT * FROM material`
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
  });
});

router.post('/venta', function(request, response, next){

  var clave = request.body.clave;
  var cantidad = parseInt(request.body.cantidad);
  var proveedor = request.body.proveedor;
  var fecha = request.body.fecha;

  query = `SELECT * FROM material WHERE Id = "${clave}"`;
  database.query(query, function(error, data){
    if(data.length > 0){
      response.send('no existe');

    } else {
      if(data[0].cantidad >= cantidad){
        updateMaterial = `update material set Cantidad = Cantidad - "${cantidad}" where Id = "${clave}"`;
        addHistorialVenta = `insert into historialVenta (Proveedor, IdMaterial, Cantidad, Fecha) values ("${proveedor}", "${clave}", "${cantidad}", "${fecha}")`;
  
        database.query(updateMaterial);
        database.query(addHistorialVenta);j
      } else {
        response.send(data[0].cantidad);
      }
      
    }
  });

});

module.exports = router;
