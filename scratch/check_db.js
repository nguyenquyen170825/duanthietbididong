const mysql = require('mysql2/promise');

async function check() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost', user: 'root', password: '1111', database: 'duancuahangapple'
    });
    
    const [rows] = await connection.execute("SELECT SanPhamId, TenSanPham FROM sanpham");
    console.log('Products:', rows);
    
    await connection.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

check();
