import app from "./app.js";
import { ENV } from "./config/env.js";


const PORT = ENV.PORT || 3000;


app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is running on port ${PORT}`);
});

