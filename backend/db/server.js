const express = require('express');
const mongoose = require('mongoose');
const { createServer } = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();

// дозвіл cors запитів 
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// порт підключення
const PORT = 3000;

// підключення до бази даних
mongoose.connect('mongodb+srv://Vadym:UYPLdgFQRbF4pttA@kursova.jve4u9i.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, })
    .then(() => console.log('MongoDB connect'))
    .catch((err) => console.log(err))
// підключення до бази даних




// Схема карточки товару
const prodcutSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        model: {
            type: String,
            required: true,
        },
        videoResolution: {
            type: String,
            required: true,
        },
        interface: {
            type: String,
            required: true,
        },
        frameRate: {
            type: String,
            required: true,
        },
        viewingAngle: {
            type: String,
            required: true,
        }
      
    }
)
const Product = mongoose.model('Product', prodcutSchema);

// додавання карточки товару в базу даних
app.post('/js/product', (req, res) => {
    // console.log("Початок занесення даних");
    const { name, model, videoResolution, interface, frameRate, viewingAngle } = req.body;
    Product.create({
        name: name,
        model: model,
        videoResolution: videoResolution,
        interface: interface,
        frameRate: frameRate,
        viewingAngle: viewingAngle,
       
    })
        .then((product) => { res.send(product) })
        .catch((err) => { res.send(err) });
});


app.get('/js/product', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const searchQuery = req.query.query;
  
    try {
      let query = {};
      if (searchQuery) {
        query = { model: { $regex: searchQuery, $options: 'i' } };
      }
  
      const totalCount = await Product.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);
  
      const products = await Product.find(query)
        .skip((page - 1) * limit)
        .limit(limit);
  
      res.json({
        products,
        totalPages,
        currentPage: page
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Функція пошуку товарів
  app.get('/js/product', async (req, res) => {
    const searchQuery = req.query.query;
  
    try {
      const products = await Product.find({ model: { $regex: searchQuery, $options: 'i' } });
      res.json({ products });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
// ТИМЧАСОВИЙ КОД  


// Видалення
app.delete('/js/deleteProduct/:id', (req, res) => {
    const id = req.params.id;

    Product.findByIdAndDelete(id)
        .then((deletedProduct) => {
            if (deletedProduct) {
                console.log('Карточку товару успішно видалено');
                res.sendStatus(200);
            } else {
                console.log('Карточка товару не знайдена');
                res.sendStatus(404);
            }
        })
        .catch((err) => {
            console.error('Помилка видалення карточки товару:', err);
            res.sendStatus(500);
        });
});

const server = createServer(app);
server.listen(PORT, () => console.log(`server is up port: ${PORT}`));

// Постійне підключення до сервера

const startServer = () => {
    if (!server.listening) {
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
};

const stopServer = () => {
    server.close(() => {
        console.log('Server has been stopped');
        process.exit(0);
    });
};

process.on('SIGINT', stopServer);
process.on('SIGTERM', stopServer);

startServer();