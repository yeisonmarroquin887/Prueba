import { NextApiRequest, NextApiResponse } from 'next';
import { listarCantantes, crearCantante, actualizarCantante, eliminarCantantePorId, obtenerCantantePorId } from './controllers/cantantesController';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.PG_URI,
});

// Función para conectar a la base de datos
const dbConnect = async (): Promise<void> => {
    try {
        // Conectar al cliente de PostgreSQL
        const client = await pool.connect();
        console.log('Conexión a PostgreSQL establecida');
    } catch (error) {
        console.error('Error al conectar a PostgreSQL:', error);
        throw new Error('Error al conectar a PostgreSQL');
    }
}

// Establecer la conexión a la base de datos al inicio
dbConnect();

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    switch (req.method) {
        case 'GET':
            // Comprobar si la solicitud es para obtener un cantante por su ID
            if (req.query.id) {
                await obtenerCantantePorId(req, res);
            } else {
                await listarCantantes(req, res);
            }
            break;
        case 'POST':
            await crearCantante(req, res);
            break;
        case 'PUT':
            await actualizarCantante(req, res);
            break;
        case 'DELETE':
            await eliminarCantantePorId(req, res);
            break;
        default:
            // Devolver un error si se realiza una solicitud con un método no admitido
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Método ${req.method} no permitido`);
            break;
    }
}
