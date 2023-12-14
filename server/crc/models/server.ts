import express, { Application } from 'express';
import cors from 'cors';
import routesMeeting from '../routes/meeting';
import routesUser from '../routes/user';
import { Meeting } from './meeting';
import { User } from './user';

class Server {
    private app: Application;
    private port: string;
    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.midlewares();
        this.routes();
        this.dbConnect();   
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Aplicación corrientdo en el puerto ' + this.port)
        })
    }
    routes() {
        this.app.use('/api/meetings', routesMeeting);
        this.app.use('/api/users', routesUser);
    }
    midlewares() {
        this.app.use(express.json());
        this.app.use(cors());  
    }
    async dbConnect() {
        try {
            await Meeting.sync()
            await User.sync();
        } catch (error) {
            console.log('No se puede conectar a la base de datos', error)
        }
    }
}
export default Server;