import React,{useState,useEffect,useRef,useCallback} from 'react';
//import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import {CircularProgress,Avatar} from '@material-ui/core';
import {useDropzone} from 'react-dropzone';
function App() {
  
  
    // const onDrop = useCallback(acceptedFiles => {
    //   // Do something with the files
    //   console.log(acceptedFiles)
    // }, []);
   
  const [progressFinish,setProgressFinish] = useState(true);
  const [file, setfile] = useState({})
  const video2=useRef();
  let chunk=[];
  let mediaRecorder;

  const onDrop=async (acceptedFiles)=>{
    await setfile(acceptedFiles[0]);
    console.log(" GAA ON DROP ",acceptedFiles[0])

  }
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  // function ObtenerFile(e){
  //   e.preventDefault();
  //   //let data=document.querySelector("input[type=file]");
  //   //let data=document.getElementsByName('archivo').values();
  //   var url = document.getElementById('inputFile').files[0];
  //   console.log(url);
  // }
  async function ChangeFile(e){
    await setfile(e.target.files[0]);
    console.log(file);
  }
  const  FileUpload=async (e)=>
  {
    e.preventDefault();
    //console.log(file);
    const request=await fetch('http://localhost:5556/file',{
      method:'POST',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({file:file.name})
    });
    const {geturl,posturl}=await request.json();
   //const request=await axios.post('http://localhost:5556/file',{file:file.name})
   //const {data}=request.data; 
   //.then(data=>console.log('INFORMACION',data));
   let options = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
};

 await setProgressFinish(false);
  
  await axios.put(posturl, file, options)
   .then(res => {
    setProgressFinish(true);
     alert(JSON.stringify({
       geturl,
       name:res.config.data.name
     }))
      // dispatch(successUpload(url));
   }).catch(err => {
       //dispatch(errorUpload(err))
    console.log('error : '+err)
      })
    console.log(geturl,posturl);
    //console.log(geturl,posturl); 
  }
  function CameraTurnOn(){
    let video=document.querySelector('#videoStreaming');   
      navigator.mediaDevices.getUserMedia(
      {video:true,audio:false}
    ).then(mediaStream=>{video.srcObject=mediaStream;console.log(mediaStream)} 
    ).catch(error=>{console.log(error)})
  }
 
  async function GoGrabacion(){
    await navigator.mediaDevices.getUserMedia(
    {video:true,audio:true})
    .then(goRecord)
    .catch(error=>{console.log(error)})
    console.log('Going grabacion2');
    async function goRecord(mediaStream){
       mediaRecorder=await new MediaRecorder(mediaStream,{mimeType:'video/webm;codecs=h264'});
      mediaRecorder.ondataavailable=handleDataAvailable;
       mediaRecorder.start();
    }
    

    mediaRecorder.onstop= function(){
      console.log('Grabacion terminada')
      let blob =new Blob(chunk,{type:'video/webm'});
      // await EnvioBlob(chunk);
      UploadBlob(blob);
      chunk=[];
      //download(blob);
    }
    
    console.log('COMENZANDO GRABACION :D');
  }
  async function UploadBlob(blob){
    const {posturl,geturl}=await getUrlBlob();

   await  axios.put(posturl,blob, {
      headers: { "content-type": blob.type }
    });
    console.log(posturl,geturl);
    video2.current.src=await geturl;
    // const request = await fetch(
    //   posturl,
    //   {
    //     method: 'PUT',
    //     body:JSON.stringify(blob),
    //     headers: {
    //       'Content-Type': blob.type,
    //       'x-amz-acl': 'public-read',
    //     },
    //   },
    // );
    // const data=await request.json();
    // console.log(geturl);
  }

  async function getUrlBlob(){
    
    const request= await fetch('http://localhost:5556/getsignedurlvideo')
  
    const dataParse=await request.json();
    return dataParse;
      
    //await axios.post('http://localhost:5556/uploadVideo',{blob}).then(data=>console.log(data)).catch(error=>console.log(error));
    // const request= await fetch('http://localhost:5556/uploadVideo',{
    //   method:'POST',
    //   headers:{
    //     "Content-Type":"application/json"
    //   },
    //   body:JSON.stringify({blob:blob})
    // })
    // const dataParse=await request.json();
    // console.log(dataParse);  
  }

  function handleDataAvailable(e){
    chunk.push(e.data);
    console.log(e.data);
  }
  function GoPause(){
    console.log('grabacion Pausada');
      mediaRecorder.pause();
  }
  function GoResume(){
    console.log('grabacion reanudad :D ');
    mediaRecorder.resume();
  }
  function GoFinish(){
    console.log('GRABACION TERMINADA');
    mediaRecorder.stop();
  }

  function download(blob){
    let  link=document.createElement('a');
    link.href=window.URL.createObjectURL(blob);
    console.log('LINK HREF : ');
    video2.current.src=window.URL.createObjectURL(blob);
    link.setAttribute('download','video_grabado2.webm') ;
    link.style.display='none';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  // mediaRecorder.onresume=function(){

  // }
  // mediaRecorder.onpause=function(){

  // }
  useEffect(() => {

    CameraTurnOn();

  }, [])
  return (
    
  <div className="App">
      {
        progressFinish===true?"":
        <CircularProgress/>
      }
    {/* <img
      src='https://bucket000upload.s3.us-east-2.amazonaws.com/wasauskyok.jpg'
    /> */}
      
    {/* <video
    controls
      src="https://bucket000upload.s3.us-east-2.amazonaws.com/error%20%5B%E3%83%AC%E3%83%83%E3%83%89%E3%82%BE%E3%83%BC%E3%83%B3%5D.mp4"
    ></video> */}
   <div {...getRootProps()} style={{border:"4px solid #cfd8dc ",borderRadius:"5px",width:"25vw",margin:"auto"}}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
          

     }
     <div>
     <p>{file.name}
  
     </p>
     </div>
    </div>
      <form onSubmit={FileUpload} method='POST' encType="multipart/form-data">
        <input type='file' name='archivo' onChange={ChangeFile} />
        <button type='submit'>Subir Archivo :D </button>
      </form>

      <video
      autoPlay
      id='videoStreaming'
      ></video><br/>
      <video
        
        controls
        ref={video2}
      ></video>
   <button onClick={GoGrabacion}
   >Iniciar Grabacion</button>
   <button onClick={GoPause}>Pausar Grabacion</button>
   <button onClick={GoResume}>Reanudar Grabacion</button>
   <button onClick={GoFinish}>Terminar Grabacion</button>
  <button >Subir Video</button>
 
    </div>
  );
}

export default App;
