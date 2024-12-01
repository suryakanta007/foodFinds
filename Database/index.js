const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

let db;
(async () => {
  db = await open({
    filename: './Database/database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let results = await fetchAllRestaurants();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No hotels are found!' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
async function fetchRestaurantsById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.all(query, [id]);
  return { restaurant: response[0] };
}

app.get('/restaurants/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let results = await fetchRestaurantsById(id);
    if (results.restaurant === undefined) {
      return res
        .status(404)
        .json({ message: `No restaurants is find on this ${id}` });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let results = await fetchRestaurantsByCuisine(cuisine);
    if (results.restaurants.lenght === 0) {
      return res
        .status(404)
        .json({ message: `No ${cuisine} restaurants is found!` });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
async function fetchByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}
app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try {
    let results = await fetchByFilter(isVeg, hasOutdoorSeating, isLuxury);
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'NO hotels are found!' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function sortByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query);
  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await sortByRating();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'NO hotels are found!' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}
app.get('/dishes', async (req, res) => {
  try {
    let results = await fetchAllDishes();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No Dishes are Found!' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getDetails(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.all(query, [id]);
  return { dish: response[0] };
}

app.get('/dishes/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let results = await getDetails(id);
    if (results.dish === undefined) {
      return res.status(404).json({ message: `The Dish is not found.` });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
async function filterDish(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    let results = await filterDish(isVeg);
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: `no DIshes are find .` });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
async function sortDishesByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);
  return { dishes: response };
}
app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await sortDishesByPrice();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: `no DIshes are find .` });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
