import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from "@/styles/Home.module.css";

interface Cantante {
  id: number;
  nombre: string;
  edad: number;
  generoMusical: string;
}

const Users = () => {
  const [datos, setDatos] = useState<Cantante[] | null>(null);
  const api = "http://localhost:3000/api/cantantes/";

  useEffect(() => {
    axios.get<Cantante[]>(api)
      .then(res => setDatos(res.data))
      .catch(err => console.log(err));
  }, []);

  const eliminar = (id:number) => {
    const endpoint = `${api}?id=${id}`;
    axios.delete(endpoint)
      .then(() => {
        alert("Artista eliminado")
      })
      .catch(err => console.log(err));
  }



  return (
    <div>
    <table className={styles.container}>
      <thead>
        <tr>
          <th>Id</th>
          <th>Nombre</th>
          <th>Edad</th>
          <th>Género</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {datos &&
          datos.map((cantante) => (
            <tr key={cantante.id}>
              <td>{cantante.id}</td>
              <td>{cantante.nombre}</td>
              <td>{cantante.edad}</td>
              <td>{cantante.generomusical}</td>
              <td className={styles.action}>
                <button >Editar</button>
                <button onClick={()=> {eliminar(cantante.id)}}>Eliminar</button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>

      </div>
  );
}

export default Users;
