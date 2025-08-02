
import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import axios from "../config/axios";
import { useNavigate } from 'react-router-dom';

const Home = () => {
   const {user} = useContext(UserContext)
   const [isModalOpen,setIsModalOpen] = useState(false)
   const [projectName,setProjectName]=useState('')
   const [projects,setProjects]=useState([]) // Changed variable name for clarity
   const navigate=useNavigate();

   // Function to fetch all projects from the backend
   const fetchProjects = () => {
    axios.get("/projects/all")
    .then((res)=>{
      setProjects(res.data.projects)
    })
    .catch(err=>{
      console.log(err)
    })
   }

   function createProject(e){
    e.preventDefault();
    axios.post('/projects/create',{
      Name:projectName
    })
    .then((res)=>{
      console.log(res.data);
      // Add the new project to the projects state immediately
      setProjects((prevProjects) => [...prevProjects, res.data.project]);
      setIsModalOpen(false);
      setProjectName(''); // Clear the project name input
    })
    .catch((err)=>{
      console.log(err);
    })
   }

   useEffect(()=>{
    fetchProjects();
   },[])
   
  return (
    <main className='p-4'>
      <div className='projects flex flex-wrap gap-3'>
      <button onClick={()=>setIsModalOpen(true)}
       className='project p-4 border border-cyan-300 rounded-md'>
        New Project
        <i className="ri-link ml-2"></i>
      </button>
      {projects.map((project)=>
      { return  <div key={project._id}
      onClick={()=>{navigate(`/project`,{state:{project}})}}
       className='project flex flex-col gap-2 p-4 min-w-48 hover:bg-gray-300 cursor-pointer bg-slate-200'>
        <h2 className='font-semibold'>{project.Name}</h2>
        <div className='flex gap-2'>
        <p><small><i className='ri-user-line'></i> Collaborators</small></p>
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
