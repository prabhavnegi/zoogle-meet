import express from "express";
import { createServer } from "http";
import { webSocket } from "./ws";

const port = 3001

const app = express()
const httpServer = createServer(app)

webSocket(httpServer)

httpServer.listen(port, () => {
    console.log("Server Running")
}) 