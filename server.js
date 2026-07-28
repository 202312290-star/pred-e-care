const app = require('./api/index');

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`PRED-E-CARE Backend API Server running on http://${HOST}:${PORT}`);
});
