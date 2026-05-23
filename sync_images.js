const mysql = require('mysql2/promise');

async function syncImages() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'phonehub_db'
  });

  try {
    const imagesToAssign = [
      'http://localhost:8080/images/iphone/ip14.jpg',
      'http://localhost:8080/images/iphone/iphone-14-màu-vàng.jpg',
      'http://localhost:8080/images/iphone/iphone-15-plus-256gb_3.webp',
      'http://localhost:8080/images/iphone/iphone_17_256gb-3_2.webp',
      'http://localhost:8080/images/iphone/vn_iphone_15_pink_pdp_image_position-2_design_1.webp'
    ];

    // Get products
    const [products] = await connection.execute('SELECT id FROM products ORDER BY id ASC');
    
    // Clear old images
    await connection.execute('DELETE FROM images');
    
    // Assign images in round-robin fashion
    for (let i = 0; i < products.length; i++) {
        const prod = products[i];
        const imgUrl = imagesToAssign[i % imagesToAssign.length];
        await connection.execute(
            'INSERT INTO images (image_url, is_main, product_id) VALUES (?, ?, ?)',
            [imgUrl, true, prod.id]
        );
    }
    
    console.log('Images synchronized successfully!');
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

syncImages();
