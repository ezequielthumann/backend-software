import { connect } from ".././databases";
import jwt from "jsonwebtoken";
const claveSecreta = process.env.DATA_SECRET_KEY;//obtengo la clave secreta del documento .env
export const logIn = async (req, res) => {
  
  try{
    const{dni,password}=req.body;//como lo envio desde el fron puede variar el nombre,{claveque espero revir tinene que ser igual a la del json en la request}

   
    // return res.status(200).json({usuario:dni,contrasena:password})
    //conectar a la base de datos  para conectar y consultar creando un objeto que contenga la conexion
    const cnn = await connect();
    //obtenes el usuarion mediante el dni
    const [result]= await cnn.query("SELECT * FROM alumnos WHERE dni=? ",[dni]);//? evita inyecciones sql
    console.log(result)
    if ( result.length>0){

      if( result[0].pass === password){
        //objeto payload
        const payload = {
          dni:dni,
          nombre:result[0].nombre
        }
        const token = getToken(payload)//el token es para que el servidor sepa de quien es la peticion
        //usuario seria  const user = result[0]
      //ell usuario y la contraseña del front se consultan con la db la corroboro y si esta ok se incia un tpken
      // se envia el token
      return  res.status(200).header("auth",token).json({message:"todo good "});

      }
      else{
        return res.status(400).json({succes:false})
      }
    }
    else{
      return  res.status(500).json({message:"el  usuario no existe "})
    }



  }catch (error){
    console.log("error desde login ",error.message);
    //devolver al cliente la respuesta
    return res.status(500).json({succes:false,message:"no se ejecuto el try",error:error.message})
    //utilizo el metodo .json({objeto}) para transformar el objeto en json
  }
  //res.send("login user");//asincrono porque se pide datos a la base de datos y puede tardar
};//envia el texto login user al hacer peticiones a user/login



//crear usuarios desde el sigup
export const createUsers = async (req, res) => {
  try{
    const {dni,nombre,password}= req.body;//operamos loos datos del front
    const cnn= await connect();
    const q= "INSERT INTO alumnos (dni,nombre,pass) VALUES(?,?,?) ";//lo de los signos se remplaza por el arreglos el ? evita inyeciones de sql
    const valores= [dni,nombre,password];
    //comoprobar si el alumno existe,si existe retorno que existe en el front
   // el retur te ahorra el else porque corta el codifo
    const exist = await ifExist (dni,"alumnos","dni",cnn);//vadisda que no exista si existe devolvemoso que existe
    if (exist){
      return res.status(400).json({message:"usuario ya existe"})
    }


    const[result]= await cnn.query(q,valores);//se guarda en un arreglo porque la libreria de mysql2 te da en uno
    if(result.affectedRows === 1){//hago uuna consulta y quiero saber si esta bien o mal
      //se crea la cuenta la cuenta
      //inicia seciion directamente  crean el token y llo envia
      //enviar un mail
      return res.status(200).json({success:true})//success,token

    }
      else{
        return res.status(400).json({success:false})
      }
    }
  
  
  
  catch (error){
    return res.status(400).json({success:false,error:error})

  }
};

//publica
export const auth =( req,res,next) => {
  //obtengo el tonken desde la req desde el front viene en la cabezea
  const token = req.headers[`auth`];
  if (!token) return res.status(400).json({message:"no hay token"});//si no hay token

  //vericar si el token es valido
  jwt.verify(token,claveSecreta,(error,payload)=>//error va a capturar si el token es invalido
   {
      if(error){
        //si el token es invalido
        return res.status(400).json({message:"token no es valido"});
      }else{
        req.user =payload ;
        next();
      }
    });
};//si el token no es  valido te lo manda por el front 

  export const ListarMateriasByDni = (req,res)=>{  //agregar materias ,guardando el nombre ,cuando se crea la materias se debe enlazar la materia con la que eligio el alumno
    const user = req.user;
    const listaMaterias = [{nombre:"so",id:2},{nombre:"sisstemas operativos",id:23}];
    return res.json({Productos: listaMaterias})

  }//cada que mande peticiones las verifico con el token
//funciones privadas 
//coprobaba que exista el usuario
const ifExist= async (value,table,column,conexion) =>{
  try {
    const q = `SELECT * FROM ${table} WHERE ${column}=?`;
    const [rows] = await conexion.query(q,[value]);
    return rows.length >0;
  } catch (error) {
    console.log(error.message)//si hay un error para saber donde esta
  }

};//si quiero parametrisara para diferentes atributos


//va a generar un token apartir de la informacion del usuario
//cada que llamemos una funcion tiene que devolver /return
const getToken =(payload) =>{
  try{
    const token = jwt.sign(payload,claveSecreta,{expiresIn : "10m"});//expiresin para que expire el token
    return token;
  }catch(error){
    console.log("erro en el toke",error);
  }
    

};


// Agregar una nueva materia
export const addMateria = async (req, res) => {
  try {
    const { nombre_materia } = req.body;
    const cnn = await connect();
    const q = "INSERT INTO materia (nombre_materia) VALUES(?)";
    const valores = [nombre_materia];
    const [result] = await cnn.query(q, valores);
    if (result.affectedRows === 1) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false });
    }
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
};

// Relacionar un usuario con la materia
export const Cursar = async (req, res) => {
  try {
    const { dni, id_m } = req.body;
    const cnn = await connect();
    const q = "INSERT INTO cursar (dni, id_m) VALUES(?, ?)";
    const valores = [dni, id_m];
    const [result] = await cnn.query(q, valores);
    if (result.affectedRows === 1) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false });
    }
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
};

// Devolver las materias que cursa un alumno determinado
export const GetMateriaById = async (req, res) => {
  try {
    const { dni } = req.params;
    const cnn = await connect();
    const q = "SELECT m.* FROM materia m JOIN cursar c ON m.id_m = c.id_m WHERE c.dni = 240";
    const [rows] = await cnn.query(q, [dni]);
    return res.json({ Materias: rows });
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
};
