import app from './api/app.js';
import connectDB from './api/util/mongodb-conecction.js';

const PORT = process.env.port || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to start server:', err);
});
