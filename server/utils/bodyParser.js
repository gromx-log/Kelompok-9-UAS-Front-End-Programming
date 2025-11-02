// bodyParser ini dipakai untuk membaca body JSON, kenapa?
// Karena NodeJS murni tidak bisa membaca body JSON tersebut
// Oleh karena itu, kita akan memparsing datanya menjadi JSON
function bodyParser(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    
    // 1. Setiap kali sepotong data masuk
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    // 2. Saat semua data selesai
    req.on('end', () => {
      try {
        // 3. Coba parse sebagai JSON
        resolve(JSON.parse(body));
      } catch (error) {
        // 4. Jika bukan JSON valid, tolak
        reject(new Error('Invalid JSON body'));
      }
    });

    // 5. Jika ada error koneksi
    req.on('error', (err) => {
      reject(err);
    });
  });
}

module.exports = bodyParser;