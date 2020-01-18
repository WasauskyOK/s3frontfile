import React from 'react';
//import logo from './logo.svg';
import './App.css';

function App() {


  // function ObtenerFile(e){
  //   e.preventDefault();
  //   //let data=document.querySelector("input[type=file]");
  //   //let data=document.getElementsByName('archivo').values();
  //   var url = document.getElementById('inputFile').files[0];
  //   console.log(url);
  // }
  return (
    <div className="App">
     <img src="C:/Users/user/Desktop/ProyectosReact/multernode/backend/uploads/images/macwindow.jpg"
      alt=''
      style={{width:'750px',height:'500px'}}
     />
      <form action='http://localhost:5556/file' method='POST' encType="multipart/form-data">
        <input type='file' name='archivo'  />
        <button type='submit'>Subir Archivo :D </button>
      </form>
    </div>
  );
}

export default App;
