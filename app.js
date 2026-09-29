import express from 'express';

const app = express();
app.use(express.json());

let products = [
  { id: 1, name: 'Clavier', description: 'Clavier mécanique', price: 79.99, category: 'Informatique' },
  { id: 2, name: 'Souris', description: 'Souris sans fil', price: 29.99, category: 'Informatique' }
];
let nextId = 3;

function isValid(p) {
  return p && p.name && p.description && typeof p.price === 'number' && p.category;
}

app.get('/products', (req, res) => {
  res.status(200).json(products);
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Produit introuvable' });
  }
  res.status(200).json(product);
});

app.post('/products', (req, res) => {
  if (!isValid(req.body)) {
    return res.status(400).json({ error: 'Champs requis : name, description, price (nombre), category' });
  }
  const { name, description, price, category } = req.body;
  const product = { id: nextId++, name, description, price, category };
  products.push(product);
  res.status(201).json(product);
});

app.put('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Produit introuvable' });
  }
  if (!isValid(req.body)) {
    return res.status(400).json({ error: 'Champs requis : name, description, price (nombre), category' });
  }
  const { name, description, price, category } = req.body;
  products[index] = { id: products[index].id, name, description, price, category };
  res.status(200).json(products[index]);
});

app.patch('/products/:id', (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Produit introuvable' });
  }
  if (req.body.price !== undefined && typeof req.body.price !== 'number') {
    return res.status(400).json({ error: 'Le prix doit être un nombre' });
  }
  const { name, description, price, category } = req.body;
  if (name !== undefined) product.name = name;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (category !== undefined) product.category = category;
  res.status(200).json(product);
});

app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Produit introuvable' });
  }
  products.splice(index, 1);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('API démarrée sur http://localhost:3000');
});