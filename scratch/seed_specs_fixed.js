const mysql = require('mysql2/promise');

async function seedSpecs() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1111',
    database: 'duancuahangapple'
  });

  const specs = [
    { pId: 1, single: '3400', multi: '8700', battery: '14.5', bright: '2000 nits' },
    { pId: 2, single: '3300', multi: '8400', battery: '12.0', bright: '2000 nits' },
    { pId: 3, single: '3100', multi: '7800', battery: '13.5', bright: '2000 nits' },
    { pId: 4, single: '3000', multi: '7600', battery: '11.0', bright: '2000 nits' },
    { pId: 5, single: '2908', multi: '7238', battery: '11.0', bright: '2000 nits' },
    { pId: 6, single: '2800', multi: '7000', battery: '10.5', bright: '2000 nits' },
    { pId: 7, single: '2600', multi: '6600', battery: '12.0', bright: '2000 nits' },
    { pId: 8, single: '2500', multi: '6400', battery: '10.0', bright: '2000 nits' },
    { pId: 9, single: '2500', multi: '6300', battery: '11.0', bright: '2000 nits' },
    { pId: 10, single: '2400', multi: '6100', battery: '9.5', bright: '2000 nits' },
    { pId: 11, single: '1800', multi: '4800', battery: '11.5', bright: '1200 nits' },
    { pId: 12, single: '1700', multi: '4600', battery: '9.0', bright: '1200 nits' },
    { pId: 13, single: '1700', multi: '4500', battery: '10.0', bright: '1200 nits' },
    { pId: 14, single: '1500', multi: '4000', battery: '8.0', bright: '1000 nits' },
    { pId: 15, single: '1200', multi: '3200', battery: '7.5', bright: '625 nits' },
  ];

  try {
    // Delete existing benchmark specs to avoid duplicates
    const deleteQuery = `
      DELETE FROM thongsokythuat 
      WHERE TenThongSo IN ('geekbench_single', 'geekbench_multi', 'battery_hours', 'peak_brightness')
    `;
    await connection.execute(deleteQuery);
    console.log('Cleared existing benchmark specs.');

    // Insert new specs
    const insertQuery = `
      INSERT INTO thongsokythuat (SanPhamId, LoaiThongSoId, TenThongSo, GiaTri) 
      VALUES (?, ?, ?, ?)
    `;

    for (const spec of specs) {
      await connection.execute(insertQuery, [spec.pId, 4, 'geekbench_single', spec.single]);
      await connection.execute(insertQuery, [spec.pId, 4, 'geekbench_multi', spec.multi]);
      await connection.execute(insertQuery, [spec.pId, 8, 'battery_hours', spec.battery]);
      await connection.execute(insertQuery, [spec.pId, 1, 'peak_brightness', spec.bright]);
    }
    console.log('Seeded benchmark specifications successfully!');
  } catch (err) {
    console.error('Error seeding specs:', err);
  } finally {
    await connection.end();
  }
}

seedSpecs();
