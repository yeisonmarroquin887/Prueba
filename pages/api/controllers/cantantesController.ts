import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../db';

// Función genérica para ejecutar consultas SQL en la base de datos
const executeQuery = async (query: string, params: any[] = []): Promise<any> => {
    try {
        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        throw new Error('Error en la consulta SQL');
    }
};

// Listar todos los cantantes
export const listarCantantes = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const cantantes = await executeQuery('SELECT * FROM Cantante');
        res.status(200).json(cantantes);
    } catch (error) {
        res.status(500).json({ message: 'Error al listar cantantes' });
    }
};

// Obtener un cantante por su ID
export const obtenerCantantePorId = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	console.log("llegue")
    const cantanteId = req.query.id as string; // Extraer el ID del parámetro de la URL
	console.log(cantanteId)
    try {
        const cantante = await executeQuery('SELECT * FROM Cantante WHERE id = $1', [cantanteId]);
        if (cantante.length === 0) {
            res.status(404).json({ message: 'Cantante no encontrado' });
        } else {
            res.status(200).json(cantante[0]);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener cantante por ID' });
    }
};

// Crear un nuevo cantante
export const crearCantante = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const { nombre, edad, generomusical } = req.body;
    try {
        await pool.query(`INSERT INTO Cantante (nombre, edad, generomusical) VALUES ($1, $2, $3)`, [nombre, edad, generomusical]);
        res.status(201).json({ message: 'Cantante creado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear cantante' });
    }
};

// Actualizar los datos de un cantante existente
export const actualizarCantante = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	console.log("llegue")
    const cantanteId = req.query.id as string;
    const { nombre, edad, generomusical } = req.body;
    try {
        await executeQuery('UPDATE Cantante SET nombre = $1, edad = $2, generomusical = $3 WHERE id = $4', [nombre, edad, generomusical, cantanteId]);
        res.status(200).json({ message: 'Cantante actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar cantante' });
    }
};

// Eliminar un cantante por su ID
export const eliminarCantantePorId = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const cantanteId = req.query.id as string;
    try {
        await executeQuery('DELETE FROM Cantante WHERE id = $1', [cantanteId]);
        res.status(200).json({ message: 'Cantante eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar cantante' });
    }
};
