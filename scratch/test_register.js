const http = require('http');

const data = JSON.stringify({
  email: 'test_val@gmail.com', // đổi email thành email của người dùng
  password: '123',
  fullName: 'Nguyễn Quyền',
  phone: '0333148620'
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  res.on('end', () => {
    console.log('BODY:', responseData);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
