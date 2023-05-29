//importar los paquetes necesarios

import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
app.set('view engine', 'ejs');

//middlewares

//analiza los datos codificados en la URL y en el cuerpo de la solicitud
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


//conexion al mongo db
mongoose.connect('mongodb://localhost:27017/todolistDB')

const itemsSchema = {
    nombre: String
};
const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({nombre:'Bienvenido a tu lista de tareas'});


const defaultItems = [item1]; 
/*
Item.insertMany(defaultItems)
            .then(function(){
                console.log('se guardo los datos todo OK.');
            })
            .catch(function(error){
                console.log(error);
            });

*/
//rutas

app.get('/', function(req, res){
    Item.find({})
        .then(function(foundItems){
            if(foundItems.length === 0){
                Item.insertMany(defaultItems)
                console.log('se guardo los datos todo OK.');
                res.redirect('/');
            }else{
                console.log(foundItems);
                res.render('list', {listTitle: 'Mi app To Do List', newListItems: foundItems});
            }
            })
        .catch(function(error){
            console.log(error);
        }
    );
});

app.post('/', function(req, res){
    const nuevoItem = req.body.newTodo;
    const item= new Item({nombre: nuevoItem});
    item.save();
    res.redirect('/');
});

app.post('/delete', function(req, res){
    const checkedItemID = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemID)
    .then(function(id){
        if(id){
            console.log('se elimino el item');
            res.redirect('/');
        }
    })
    
});



app.listen(3030, function(){
    console.log('servidor iniciado en el puerto 3030');
});




