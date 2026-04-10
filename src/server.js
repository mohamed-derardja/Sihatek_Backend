import app from "./app.js";
import { ENV } from "./config/env.js";


const PORT = ENV.PORT || 3000;


app.listen(PORT, "0.0.0.0" ,() => {
    console.log(`Server is running on port ${PORT}`);
});

