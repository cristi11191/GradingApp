const fs = require('fs');

// Verifică dacă directorul există și creează-l dacă nu există
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
