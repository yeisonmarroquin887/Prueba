import { useEffect, useState } from "react";
import axios from "axios";
import styles from "@/styles/Home.module.css"; // Importa los estilos CSS
import { useForm } from "react-hook-form";

interface FormData {
  id: number;
  nombre: string;
  edad: number;
  generomusical: string;
}

export default function Home() {
  const { handleSubmit, register, reset } = useForm<FormData>();
  const [datos, setDatos] = useState<FormData[] | null>(null);
  const [data, setData] = useState<FormData | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [Add, setAdd] = useState<boolean>(false);

  const addArtist = () => {
      setAdd(true)
  }
  const closeArtist = () => {
    setAdd(false)
}

  const api = "http://localhost:3000/api/cantantes/";

  const fetchData = () => {
    axios.get<FormData[]>(api)
      .then(res => setDatos(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submit = (formData: FormData) => {
    axios.post(api, formData)
      .then(res => {
        alert("Artista creado");
        reset();
        fetchData();
      })
      .catch(err => {
        alert("Error al crear el Artista");
      });
  };

  const update = (cantante: FormData) => {
    setData(cantante);
    setEdit(true);
  };

  const handleEditSubmit = () => {
    if (!data) {
      console.error("No hay datos para actualizar");
      return;
    }
  
    axios.put(`${api}?id=${data.id}`, data)
      .then(res => {
        console.log("Cantante actualizado:", res.data);
        setEdit(false);
        fetchData();
      })
      .catch(err => {
        console.error("Error al actualizar el cantante:", err);
      });
  };

  const CancelarUpdate = () => {
    setEdit(false)
    fetchData()
  }
  

  const eliminar = (id: number) => {
    const endpoint = `${api}?id=${id}`;
    axios.delete(endpoint)
      .then(() => {
        alert("Artista eliminado");
        fetchData();
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <button onClick={addArtist} className={styles.addArtis}>Crear Artista</button>
      {
        Add && (
          <div className={styles.formContainer}>
          <form onSubmit={handleSubmit(submit)}>
            <button className={styles.close} onClick={closeArtist}>Cerrar</button>
            <div className={styles.formField}>
              <label className={styles.formLabel} htmlFor="nombre">Nombre:</label>
              <input className={styles.formInput} {...register("nombre")} type="text" required/>
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel} htmlFor="edad">Edad:</label>
              <input className={styles.formInput} {...register("edad", { valueAsNumber: true })} type="number" required/>
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel} htmlFor="generoMusical">Género:</label>
              <input className={styles.formInput} {...register("generomusical")} type="text" required/>
            </div>
            <button className={styles.formButton} type="submit">Registrar</button>
          </form>
        </div>

        )
      }
     
     <div>
      
     </div>
      <div className={styles.tableContainer}>
         <table className={styles.table}>
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
                    <td className={styles.tableCell}>{cantante.id}</td> {/* Usa la clase para las celdas de la tabla */}
                    <td className={styles.tableCell}>{cantante.nombre}</td>
                    <td className={styles.tableCell}>{cantante.edad}</td>
                    <td className={styles.tableCell}>{cantante.generomusical}</td>
                    <td className={`${styles.tableCell} ${styles.action}`}> {/* Usa múltiples clases */}
                      <button className={styles.actionButton} onClick={() => update(cantante)}>Editar</button>
                      <button className={styles.actionButton} onClick={() => eliminar(cantante.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
      </div>
      {edit && (
        <div className={styles.formContainer2}>
          <form onSubmit={handleSubmit(handleEditSubmit)}>
            <div>
              <label className={styles.formLabel} htmlFor="nombre">Nombre</label>
              <input
                className={styles.formInput}
                type="text"
                value={data?.nombre || ""}
                onChange={(e) => setData({ ...data!, nombre: e.target.value })}
              required/>
            </div>
            <div>
              <label className={styles.formLabel} htmlFor="edad">Edad</label>
              <input
                className={styles.formInput}
                type="number"
                value={data?.edad || ""}
                onChange={(e) => setData({ ...data!, edad: parseInt(e.target.value) })}
             required />
            </div>
            <div>
              <label className={styles.formLabel} htmlFor="generoMusical">Género</label>
              <input
                className={styles.formInput}
                type="text"
                value={data?.generomusical || ""}
                onChange={(e) => setData({ ...data!, generomusical: e.target.value })}
             required />
            </div>
            <button className={styles.Actualizar} type="submit">Actualizar</button>
          </form>        
          <button className={styles.Cancelar} onClick={CancelarUpdate}>Cancelar</button>  
        </div>
      )}
    </>
  );
}
