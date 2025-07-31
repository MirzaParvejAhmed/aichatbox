 import React, { use, useContext, useState } from 'react'
 import { UserContext } from '../context/user.context'
 import axios from "../config/axios";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
   const {user} = useContext(UserContext)
   const [isModalOpen,setIsModalOpen] = useState(false)
   const [projectName,setProjectName]=useState('')
   const [project,setProject]=useState([])
   const navigate=useNavigate();

   function createProject(e){
    e.preventDefault();
    console.log({projectName});
    axios.post('/projects/create',{
      Name:projectName
    })
    .then((res)=>{
      console.log(res);
      setIsModalOpen(false)
    })
    .catch((err)=>{console.log(err)})
   }
   useEffect(()=>{
    axios.get("/projects/all")
    .then((res)=>{setProject(res.data.projects)
    })
    .catch(err=>{console.log(err)})
   },[])
  return (
    <main className='p-4'>
      <div className='projects flex flex-wrap gap-3'>
      <button onClick={()=>setIsModalOpen(true)}
       className='project p-4 border border-cyan-300 rounded-md'>
        New Project
        <i className="ri-link ml-2"></i>
      </button>
      {project.map((project)=>
      { return  <div key={project._id}
      onClick={()=>{navigate(`/project`,{state:{project}})}}
       className='project flex flex-col gap-2 p-4 min-w-48 hover:bg-gray-300 cursor-pointer bg-slate-200'>
        <h2 className='font-semibold'>{project.Name}</h2>
        <div className='flex gap-2'>
        {/* <i className='ri-user-line'></i> */}<p><small><i className='ri-user-line'></i> Collaborators</small></p>
          {project.users.length}
        </div>
      </div>})}

      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 ">
          <div className="bg-gray-500 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
            <form
              onSubmit={createProject}
            >
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
              onChange={(e)=>setProjectName(e.target.value)}
              value={projectName}
                type="text"
                className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                placeholder="Enter project name"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </main>
    
    
  )
}

export default Home



// import React, { useState, useContext, useEffect } from 'react';
// import { UserContext } from '../context/user.context';
// import axios from '../config/axios';
// import {useNavigate} from "react-router-dom"

// const Home = () => {
//   const { user } = useContext(UserContext);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [projectName, setProjectName] = useState('');
//   const [project,setProject]=useState([]);
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log({projectName});
    
//     axios.post('/projects/create',{Name:projectName})
//     .then((res)=>{console.log(res)
//       setIsModalOpen(false); 
//     })
//     .catch((error)=>{console.log(error)});
//   };

//   useEffect(()=>{
//     axios.get('/projects/all').then((res)=>
//       {setProject(res.data.projects)})
//     .catch(err=>{
//       console.log(err)
      
//     })
//    },[])
 

//   return (
//     <main className="p-4">
//       <div className="projects flex flex-wrap gap 3">
//         <button
//           className="project p-4 border border-slate-400 rounded-md"
//           onClick={() => setIsModalOpen(true)}
//         >
//           <i className="ri-link"></i> Add Project
//         </button>
//         {
//           project.map((project)=>{
//             return <div key={project._id}
//             onClick={()=>{
//               navigate(`/project`, { state: {project}}); 
//             }}
//              className="project flex flex-col gap-2 cursor-pointer p-4 border-red-500 hover:bg-blue-400">
//             <h2 className='font-semibold'>{project.Name}</h2>
//             <div className='flex gap-2'>
//             <p><small><i className="ri-user-3-fill"></i> Collaborators:</small></p>
//             {project.users.length}</div>
//             </div>

//           })
//         }
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">Add Project</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label htmlFor="projectName" className="block text-sm font-medium">
//                   Project Name
//                 </label>
//                 <input
//                   type="text"
//                   id="projectName"
//                   value={projectName}
//                   onChange={(e) => setProjectName(e.target.value)}
//                   className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter project name"
//                   required
//                 />
//               </div>
//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// };

// export default Home;