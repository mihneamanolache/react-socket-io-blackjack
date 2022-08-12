import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import config from "config";
import { COLORS } from './constants/colors';
import socket from './socket';
import { routes } from './routes';

const HOST: any = process.env.HOST || config.get<string>("host")
const PORT: any = process.env.PORT || config.get<number>("port")
const CORS_ORIGIN = config.get<string>("corsOrigin")

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: CORS_ORIGIN,
        credentials: true,
    }
})
server.listen(PORT, HOST, ()  => {
    HOST.includes('localhost') ? console.log(COLORS.cyan, `[INFO] Server listening on http://${HOST}:${PORT}`) : console.log(COLORS.cyan, `[INFO] Server listening on https://${HOST}:${PORT}`)
    socket({io})
})

routes(app)
