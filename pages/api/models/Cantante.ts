import { PoolClient } from 'pg';
import pool from '../db'; // Importa el pool de conexiones desde el archivo db.ts

// Definición de la interfaz Cantante
export interface Cantante {
  id?: number; // El ID será generado automáticamente en PostgreSQL, por lo que puede ser opcional aquí
  nombre: string;
  edad: number;
  generomusical: string; // Corregido a camelCase
}

// Función para crear un cantante en la base de datos
export const crearCantante = async (cantante: Cantante): Promise<void> => {
    let client: PoolClient | undefined; // Inicializa la variable client como undefined
    try {
        client = await pool.connect(); // Utiliza el pool de conexiones para obtener un cliente
        await client.query('INSERT INTO Cantante (nombre, edad, generomusical) VALUES ($1, $2, $3)', [cantante.nombre, cantante.edad, cantante.generomusical]);
    } catch (error) {
        console.error('Error al crear cantante:', error);
        throw new Error('Error al crear cantante');
    } finally {
        if (client) client.release(); // Libera el cliente de la pool de conexiones si está definido
    }
};
