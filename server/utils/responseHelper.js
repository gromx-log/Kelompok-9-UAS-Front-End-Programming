// responsHelper akan berguna untuk memberikan balasan
// Balasan ini berupa kode kode, yang bisa saja sukses ataupun error

// Fungsi ini bakal digunakan untuk menangani CORS
function setHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Izinkan frontend (nanti ganti dg domain)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJSON(res, statusCode, data) {
    // Terapkan header CORS
    setHeaders(res); 
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function sendError(res, statusCode, message) {
    setHeaders(res); // Terapkan header CORS
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: message }));
}

// Fungsi khusus untuk menangani pre-flight 'OPTIONS' request
function handleOptions(req, res) {
    setHeaders(res);
    res.writeHead(204); // 204 No Content
    res.end();
}

module.exports = {
    sendJSON,
    sendError,
    handleOptions
};