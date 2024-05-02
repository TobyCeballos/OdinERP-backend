import {Router} from 'express'
import pkg from "../../package.json" assert {type: "json"};

const router = Router()

router.get("/", (req, res) => {
  res.json({
    message: "The OdinServer is successfully connected",
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    author: pkg.author,
  });
});

export default router