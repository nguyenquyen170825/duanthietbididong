const mysql = require('mysql2/promise');

async function seedSpecs() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'phonehub_db'
  });

  const specs = [
    { pId: 1, single: '2908', multi: '7238', battery: '11:05', bright: '2000 nits' }, // iPhone 15 Pro
    { pId: 2, single: '2271', multi: '6854', battery: '16:45', bright: '2600 nits' }, // S24 Ultra
    { pId: 3, single: '1760', multi: '4442', battery: '12:30', bright: '2400 nits' },
    { pId: 4, single: '2100', multi: '6500', battery: '14:20', bright: '4500 nits' },
    { pId: 5, single: '2200', multi: '6700', battery: '13:50', bright: '3000 nits' },
    { pId: 6, single: '1800', multi: '4800', battery: '11:30', bright: '1500 nits' },
    { pId: 7, single: '2000', multi: '5000', battery: '14:00', bright: '2000 nits' },
    { pId: 8, single: '2800', multi: '7000', battery: '11:00', bright: '2000 nits' },
    { pId: 9, single: '1500', multi: '4000', battery: '10:00', bright: '1200 nits' },
    { pId: 10, single: '1200', multi: '3500', battery: '09:00', bright: '1000 nits' },
  ];

  try {
    for (const spec of specs) {
      await connection.execute('INSERT INTO technical_specifications (spec_name, spec_value, product_id) VALUES (?, ?, ?)', ['geekbench_single', spec.single, spec.pId]);
      await connection.execute('INSERT INTO technical_specifications (spec_name, spec_value, product_id) VALUES (?, ?, ?)', ['geekbench_multi', spec.multi, spec.pId]);
      await connection.execute('INSERT INTO technical_specifications (spec_name, spec_value, product_id) VALUES (?, ?, ?)', ['battery_hours', spec.battery, spec.pId]);
      await connection.execute('INSERT INTO technical_specifications (spec_name, spec_value, product_id) VALUES (?, ?, ?)', ['peak_brightness', spec.bright, spec.pId]);
    }
    console.log('Specs seeded!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await connection.end();
  }
}

seedSpecs();
