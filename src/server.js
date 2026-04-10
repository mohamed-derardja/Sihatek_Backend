import app from "./app.js";
import { ENV } from "./config/env.js";


const PORT = ENV.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

