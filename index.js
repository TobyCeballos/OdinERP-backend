import app from "./src/app.js";
import "./src/database.js";
import { PORT } from "./src/config.js";
import "./src/libs/initialSetup.js";

app.listen(PORT);
console.log("Server on port", app.get("port"));
