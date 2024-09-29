//archivo para manejar las rutas de usuarios

import { Router } from "express";
import { ListarMateriasByDni, auth, createUsers, logIn,addMateria,GetMateriaById,Cursar} from "../controller/users";

//objeto para manejo de url
const routerUsers = Router();

//Enpoint para loguear usuario
/**
 * @swagger
 * /user/login:
 *  post:
 *      sumary: loguear usuario
 */
routerUsers.post("/user/login", logIn);

/**
 * @swagger
 * /usersp:
 *  post:
 *      sumary: crea usuarios
 */
routerUsers.post("/user/usersp", createUsers);//por defecto las peticiones son get pero este espera un peticion pos
//routerUsers.post("/user/usersp", createUsers);//por defecto las peticiones son get pero este espera un peticion pos
//cada vez que se agrega una nueva funcion se debe crear una nueva ruta









routerUsers.get("/user/obtenerproductos", auth,ListarMateriasByDni);//auth es un middlware 



routerUsers.post("/user/addMateria", addMateria);


routerUsers.post("/user/cursar", Cursar);

routerUsers.get("/user/getMateriaById/:dni", GetMateriaById);


export default routerUsers;