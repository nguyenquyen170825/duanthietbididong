const mysql = require('mysql2/promise');

async function convertPrices() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'phonehub_db'
  });

  try {
    const [products] = await connection.execute('SELECT id, price FROM products');
    for (const prod of products) {
        const numPrice = parseFloat(prod.price) || 0;
        if (numPrice < 10000) { // If price is still in USD
            const newPrice = Math.round(numPrice * 25300);
            await connection.execute('UPDATE products SET price = ? WHERE id = ?', [newPrice.toString(), prod.id]);
        }
    }
    
    // Also update order items unit price if any
    await connection.execute('UPDATE order_details SET unit_price = unit_price * 25300 WHERE unit_price < 10000');
    
    console.log('Prices converted to VND successfully!');
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

convertPrices();
