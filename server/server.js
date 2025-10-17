import app from './api/app.js';

const PORT = process.env.port || 3000

app.listen(PORT, ()=>{
    console.log("Servidor ativo na porta: " + PORT)
})