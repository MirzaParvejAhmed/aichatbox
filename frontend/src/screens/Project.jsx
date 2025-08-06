// import React, { useState, useEffect, useContext, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "../config/axios";
// import { UserContext } from "../context/user.context";
// import { getWebContainer } from "../config/webContainer";
// import {
//   initializeSocket,
//   sendMessage,
//   receiveMessage,
// } from "../config/socket";
// import Markdown from "markdown-to-jsx";
// import hljs from "highlight.js";
// import "highlight.js/styles/github.css";

// function SyntaxHighlightedCode(props) {
//   const ref = useRef(null);

//   useEffect(() => {
//     if (ref.current && props.className?.includes("lang-")) {
//       hljs.highlightElement(ref.current);
//       ref.current.removeAttribute("data-highlighted");
//     }
//   }, [props.className, props.children]);

//   return <code {...props} ref={ref} />;
// }

// const Project = () => {
//   const location = useLocation();
//   const [sidePanelOpen, setSidePanelOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // === UPDATED: State for single user selection ===
//   const [selectedUserId, setSelectedUserId] = useState(null);

//   const [project, setProject] = useState(location.state.project);
//   const [users, setUsers] = useState([]);
//   const [message, setSendMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const { user } = useContext(UserContext);
//   const [fileTree, setFileTree] = useState({});
//   const [currentFile, setCurrentFile] = useState(null);
//   const [openFiles, setOpenFiles] = useState([]);
//   const [webContainer, setWebContainer] = useState(null);
//   const [iframeUrl, setIFrameUrl] = useState(null);
//   const [runProcess, setRunProcess] = useState(null);
//   const [isLoadingWebContainer, setIsLoadingWebContainer] = useState(false);

//   // === UPDATED: Logic for single user selection ===
//   const handleUserClick = (id) => {
//     // If the same user is clicked again, deselect them
//     setSelectedUserId(id === selectedUserId ? null : id);
//   };

//   // === UPDATED: addCollaborators function to send single user ===
//   function addCollaborators() {
//     // Only send the request if a user is selected
//     if (selectedUserId) {
//       axios
//         .put("/projects/add-user", {
//           projectId: location.state.project._id,
//           users: [selectedUserId], // Send a single ID in an array
//         })
//         .then((res) => {
//           setProject(res.data.project);
//           setIsModalOpen(false);
//           setSelectedUserId(null); // Clear the selection after adding
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }

//   function send() {
//     const newMessage = {
//       message,
//       sender: user,
//     };
//     sendMessage("project-message", newMessage);
//     setMessages((prev) => [...prev, newMessage]);
//     setSendMessage("");
//   }

//   useEffect(() => {
//     initializeSocket(project._id);
//     receiveMessage("project-message", (data) => {
//       let aiMessage;
//       // === UPDATED: Simplified AI message handling from socket ===
//       // Backend now sends a valid JSON object, so no need for try/catch here.
//       // We directly use the message which should be the parsed JSON object.
//       aiMessage = data.message;
    
//       webContainer?.mount(aiMessage.fileTree);
//       if (aiMessage.fileTree) {
//         setFileTree(aiMessage.fileTree);
//       }
//       setMessages((prev) => [...prev, {
//         ...data,
//         message: aiMessage, // Store the parsed object directly
//       }]);
//     });

//     axios
//       .get(`/projects/get-project/${location.state.project._id}`)
//       .then((res) => {
//         setProject(res.data.project)
//         setFileTree(res.data.project.fileTree)
//       });

//     axios
//       .get("/users/all")
//       .then((res) => {
//         setUsers(res.data.users);
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   function saveFileTree(ft) {
//     axios
//       .put("/projects/update-file-tree", {
//         projectId: project._id,
//         fileTree: ft,
//       })
//       .then((res) => {
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   return (
//     <main className="h-screen w-screen flex">
//       <section className="left relative flex flex-col h-screen min-w-96 bg-slate-400">
//         <header className="flex justify-between items-center w-full p-2 px-4 bg-slate-300 absolute top-0">
//           {/* === UPDATED: Button for best practices === */}
//           <button
//             type="button"
//             onClick={() => {
//               console.log("Add Collaborators button clicked!");
//               setIsModalOpen(true);
//             }}
//             className="flex gap-2 relative z-10"
//           >
//             <i className="ri-user-add-fill mr-1"></i>
//             <p>Add Collaborators</p>
//           </button>

//           <button
//             onClick={() => setSidePanelOpen(!sidePanelOpen)}
//             className="p-2"
//           >
//             <i className="ri-group-fill"></i>
//           </button>
//         </header>
//         <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
//           <div className="message-box p-1 flex-grow flex flex-col overflow-auto max-h-full gap-1">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`message flex flex-col p-2 ${
//                   msg.sender._id === "ai"
//                     ? "bg-slate-100 max-w-80"
//                     : "max-w-52 bg-slate-200"
//                 } ${msg.sender._id === user._id.toString() && "ml-auto"}`}
//               >
//                 <small className="opacity-65 text-xs">{msg.sender.email}</small>
//                 <div className="text-sm text-black">
//                   {msg.sender._id === "ai" ? (
//                     <Markdown
//                       options={{
//                         overrides: {
//                           code: {
//                             component: SyntaxHighlightedCode,
//                           },
//                         },
//                       }}
//                     >
//                       {/* === UPDATED: Direct access to the text property === */}
//                       {msg.message.text} 
//                     </Markdown>
//                   ) : (
//                     <p>{msg.message}</p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="input-field w-full flex absolute bottom-0">
//             <input
//               value={message}
//               onChange={(e) => setSendMessage(e.target.value)}
//               className="p-3 px-3 border-none outline-none flex-grow"
//               type="text"
//               placeholder="Enter Message"
//             />
//             <button onClick={send} className="px-5 bg-emerald-400 text-white">
//               <i className="ri-send-plane-2-fill"></i>
//             </button>
//           </div>
//         </div>

//         <div
//           className={`sidePanel flex flex-col gap-2 w-full h-full bg-slate-100 transition-all ${
//             sidePanelOpen ? "translate-x-0" : "-translate-x-full"
//           } absolute top-0`}
//         >
//           <header className="flex justify-between items-center p-2 px-4 bg-slate-200">
//             <h1 className="font-semibold text-lg">Collaborators</h1>
//             <button
//               className="p-2"
//               onClick={() => setSidePanelOpen(!sidePanelOpen)}
//             >
//               <i className="ri-close-fill"></i>
//             </button>
//           </header>
//           <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
//             {project.users &&
//               project.users.map((user) => (
//                 <div
//                   key={user._id}
//                   className="user flex gap-2 items-center cursor-pointer hover:bg-slate-200 p-2"
//                 >
//                   <div className="aspect-square relative flex items-center justify-center w-fit h-fit rounded-full p-5 text-cyan-400 bg-slate-600">
//                     <i className="ri-user-fill absolute"></i>
//                   </div>
//                   <h1 className="font-semibold text-lg">{user.email}</h1>
//                 </div>
//               ))}
//           </div>
//         </div>
//       </section>

//       <section className="right flex flex-grow h-full bg-red-300">
//         <div className="explorer h-full min-w-52 bg-slate-200 max-w-64">
//           <div className="file-tree w-full">
//             {Object.keys(fileTree || {}).map((file, index) => (
//               <button
//                 key={index}
//                 onClick={() => {
//                   setCurrentFile(file);
//                 }}
//                 className={`tree-element cursor-pointer p-2 px-4 flex items-center gap-2 w-full ${
//                   currentFile === file ? "bg-blue-400" : "bg-slate-300"
//                 } hover:bg-slate-400`}
//               >
//                 <p className="font-semibold text-lg">{file}</p>
//               </button>
//             ))}
//           </div>
//         </div>
//         {currentFile && (
//           <div className="code-editor flex flex-grow h-full flex-col">
//             <div className="top flex justify-between w-full">
//               <div className="files flex">
//                 {openFiles.map((file, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setCurrentFile(file)}
//                     className={`open-file cursor-pointer p-2 w-fit px-4 items-center flex gap-2 bg-cyan-600`}
//                   >
//                     <p className="font-semibold text-lg">{file}</p>
//                   </button>
//                 ))}
//               </div>
//               <div className="actions flex gap-2">
//                 <button
//                   onClick={async () => {
//                     setIsLoadingWebContainer(true);
//                     try {
//                       // Ensure the webContainer is ready before calling mount
//                       const container = await getWebContainer();
//                       setWebContainer(container);
//                       await container.mount(fileTree);
//                       const installProcess = await container.spawn("npm", [
//                         "install",
//                       ]);
//                       installProcess.output.pipeTo(
//                         new WritableStream({
//                           write(chunk) {
//                             console.log(chunk);
//                           },
//                         })
//                       );
//                       if (runProcess) {
//                         runProcess.kill();
//                       }
//                       let tempRunProcess = await container.spawn("npm", [
//                         "start",
//                       ]);
//                       tempRunProcess.output.pipeTo(
//                         new WritableStream({
//                           write(chunk) {
//                             console.log(chunk);
//                           },
//                         })
//                       );
//                       setRunProcess(tempRunProcess);
//                       container.on("server-ready", (port, url) => {
//                         console.log(port, url);
//                         setIFrameUrl(url);
//                         setIsLoadingWebContainer(false);
//                       });
//                     } catch (error) {
//                       console.error("Failed to run webcontainer:", error);
//                       setIsLoadingWebContainer(false);
//                     }
//                   }}
//                   className="p-2 px-4 bg-slate-400 text-white"
//                   disabled={isLoadingWebContainer}
//                 >
//                   {isLoadingWebContainer ? 'Running...' : 'run'}
//                 </button>
//               </div>
//             </div>
//             <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
//               {currentFile && fileTree[currentFile]?.file?.contents ? (
//                 <textarea
//                   value={fileTree[currentFile].file.contents}
//                   onChange={(e) => {
//                     const updatedContent = e.target.value;
//                     const updatedFileTree = {
//                       ...fileTree,
//                       [currentFile]: {
//                         file: {
//                           contents: updatedContent,
//                         },
//                       },
//                     };
//                     setFileTree(updatedFileTree);
//                     saveFileTree(updatedFileTree);
//                   }}
//                   className="h-full w-full p-2 border border-gray-300 rounded-md"
//                 ></textarea>
//               ) : (
//                 <p className="text-center text-gray-500">Select a file to view its content</p>
//               )}
//             </div>
//           </div>
//         )}
//         {iframeUrl && webContainer && (
//           <div className="flex min-w-96 flex-col h-full">
//             <div className="address-bar">
//               <input
//                 type="text"
//                 onChange={(e) => setIFrameUrl(e.target.value)}
//                 value={iframeUrl}
//                 className="w-full p-2 px-4 bg-slate-200"
//               />
//             </div>

//             <iframe src={iframeUrl} className="w-full h-full"></iframe>
//           </div>
//         )}
//       </section>

//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96 max-w-full max-h-84 overflow-auto">
//             <h2 className="text-xl font-bold mb-4">Select a User</h2>
//             <div className="space-y-4">
//               {users.map((user) => (
//                 <div
//                   key={user._id}
//                   onClick={() => handleUserClick(user._id)}
//                   className={`flex items-center justify-between p-4 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-300 ${
//                     // === UPDATED: Conditional class for single select ===
//                     selectedUserId === user._id ? "bg-slate-200" : ""
//                   }`}
//                 >
//                   <span>{user.email}</span>
//                   <i className="ri-user-fill text-cyan-400"></i>
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-between mt-4">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={addCollaborators}
//                 className="px-4 py-2 bg-cyan-500 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 Add Collaborators
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// };

// export default Project;

import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import { UserContext } from "../context/user.context";
import { getWebContainer } from "../config/webContainer";
import {
  initializeSocket,
  sendMessage,
  receiveMessage,
} from "../config/socket";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

function SyntaxHighlightedCode(props) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && props.className?.includes("lang-")) {
      hljs.highlightElement(ref.current);
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} />;
}

const Project = () => {
  const location = useLocation();
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // === UPDATED: State for single user selection ===
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [project, setProject] = useState(location.state.project);
  const [users, setUsers] = useState([]);
  const [message, setSendMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useContext(UserContext);
  const [fileTree, setFileTree] = useState({});
  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);
  const [webContainer, setWebContainer] = useState(null);
  const [iframeUrl, setIFrameUrl] = useState(null);
  const [runProcess, setRunProcess] = useState(null);
  const [isLoadingWebContainer, setIsLoadingWebContainer] = useState(false);

  // === NEW STATE FOR OUTPUT ===
  const [output, setOutput] = useState("");
  const outputRef = useRef(null);

  // === UPDATED: Logic for single user selection ===
  const handleUserClick = (id) => {
    // If the same user is clicked again, deselect them
    setSelectedUserId(id === selectedUserId ? null : id);
  };

  // === UPDATED: addCollaborators function to send single user ===
  function addCollaborators() {
    // Only send the request if a user is selected
    if (selectedUserId) {
      axios
        .put("/projects/add-user", {
          projectId: location.state.project._id,
          users: [selectedUserId], // Send a single ID in an array
        })
        .then((res) => {
          setProject(res.data.project);
          setIsModalOpen(false);
          setSelectedUserId(null); // Clear the selection after adding
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function send() {
    const newMessage = {
      message,
      sender: user,
    };
    sendMessage("project-message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setSendMessage("");
  }

  useEffect(() => {
    initializeSocket(project._id);
    receiveMessage("project-message", (data) => {
      let aiMessage;
      // === UPDATED: Simplified AI message handling from socket ===
      // Backend now sends a valid JSON object, so no need for try/catch here.
      // We directly use the message which should be the parsed JSON object.
      aiMessage = data.message;
    
      webContainer?.mount(aiMessage.fileTree);
      if (aiMessage.fileTree) {
        setFileTree(aiMessage.fileTree);
      }
      setMessages((prev) => [...prev, {
        ...data,
        message: aiMessage, // Store the parsed object directly
      }]);
    });

    axios
      .get(`/projects/get-project/${location.state.project._id}`)
      .then((res) => {
        setProject(res.data.project)
        setFileTree(res.data.project.fileTree)
      });

    axios
      .get("/users/all")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => console.log(err));
  }, []);

  function saveFileTree(ft) {
    axios
      .put("/projects/update-file-tree", {
        projectId: project._id,
        fileTree: ft,
      })
      .then((res) => {
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Auto-scroll the output div when new content is added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative flex flex-col h-screen min-w-96 bg-slate-400">
        <header className="flex justify-between items-center w-full p-2 px-4 bg-slate-300 absolute top-0">
          {/* === UPDATED: Button for best practices === */}
          <button
            type="button"
            onClick={() => {
              console.log("Add Collaborators button clicked!");
              setIsModalOpen(true);
            }}
            className="flex gap-2 relative z-10"
          >
            <i className="ri-user-add-fill mr-1"></i>
            <p>Add Collaborators</p>
          </button>

          <button
            onClick={() => setSidePanelOpen(!sidePanelOpen)}
            className="p-2"
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>
        <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
          <div className="message-box p-1 flex-grow flex flex-col overflow-auto max-h-full gap-1">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message flex flex-col p-2 ${
                  msg.sender._id === "ai"
                    ? "bg-slate-100 max-w-80"
                    : "max-w-52 bg-slate-200"
                } ${msg.sender._id === user._id.toString() && "ml-auto"}`}
              >
                <small className="opacity-65 text-xs">{msg.sender.email}</small>
                <div className="text-sm text-black">
                  {msg.sender._id === "ai" ? (
                    <Markdown
                      options={{
                        overrides: {
                          code: {
                            component: SyntaxHighlightedCode,
                          },
                        },
                      }}
                    >
                      {/* === UPDATED: Direct access to the text property === */}
                      {msg.message.text} 
                    </Markdown>
                  ) : (
                    <p>{msg.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="input-field w-full flex absolute bottom-0">
            <input
              value={message}
              onChange={(e) => setSendMessage(e.target.value)}
              className="p-3 px-3 border-none outline-none flex-grow"
              type="text"
              placeholder="Enter Message"
            />
            <button onClick={send} className="px-5 bg-emerald-400 text-white">
              <i className="ri-send-plane-2-fill"></i>
            </button>
          </div>
        </div>

        <div
          className={`sidePanel flex flex-col gap-2 w-full h-full bg-slate-100 transition-all ${
            sidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } absolute top-0`}
        >
          <header className="flex justify-between items-center p-2 px-4 bg-slate-200">
            <h1 className="font-semibold text-lg">Collaborators</h1>
            <button
              className="p-2"
              onClick={() => setSidePanelOpen(!sidePanelOpen)}
            >
              <i className="ri-close-fill"></i>
            </button>
          </header>
          <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
            {project.users &&
              project.users.map((user) => (
                <div
                  key={user._id}
                  className="user flex gap-2 items-center cursor-pointer hover:bg-slate-200 p-2"
                >
                  <div className="aspect-square relative flex items-center justify-center w-fit h-fit rounded-full p-5 text-cyan-400 bg-slate-600">
                    <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className="font-semibold text-lg">{user.email}</h1>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="right flex flex-grow h-full bg-red-300">
        <div className="explorer h-full min-w-52 bg-slate-200 max-w-64">
          <div className="file-tree w-full">
            {Object.keys(fileTree || {}).map((file, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentFile(file);
                }}
                className={`tree-element cursor-pointer p-2 px-4 flex items-center gap-2 w-full ${
                  currentFile === file ? "bg-blue-400" : "bg-slate-300"
                } hover:bg-slate-400`}
              >
                <p className="font-semibold text-lg">{file}</p>
              </button>
            ))}
          </div>
        </div>
        {currentFile && (
          <div className="code-editor flex flex-grow h-full flex-col">
            <div className="top flex justify-between w-full">
              <div className="files flex">
                {openFiles.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFile(file)}
                    className={`open-file cursor-pointer p-2 w-fit px-4 items-center flex gap-2 bg-cyan-600`}
                  >
                    <p className="font-semibold text-lg">{file}</p>
                  </button>
                ))}
              </div>
              <div className="actions flex gap-2">
                <button
                  onClick={async () => {
                    setIsLoadingWebContainer(true);
                    // === CLEAR OUTPUT WHEN RUNNING ===
                    setOutput("");
                    try {
                      // Ensure the webContainer is ready before calling mount
                      const container = await getWebContainer();
                      setWebContainer(container);
                      await container.mount(fileTree);

                      // Define the output stream to update the state
                      const outputStream = new WritableStream({
                        write(chunk) {
                          setOutput(prevOutput => prevOutput + chunk);
                        },
                      });

                      const installProcess = await container.spawn("npm", [
                        "install",
                      ]);
                      // === PIPE OUTPUT TO NEW STREAM ===
                      installProcess.output.pipeTo(outputStream);
                     
                      if (runProcess) {
                        runProcess.kill();
                      }
                      let tempRunProcess = await container.spawn("npm", [
                        "start",
                      ]);
                      // === PIPE OUTPUT TO NEW STREAM ===
                      tempRunProcess.output.pipeTo(outputStream);
                     
                      setRunProcess(tempRunProcess);
                      container.on("server-ready", (port, url) => {
                        // === LOG TO OUTPUT INSTEAD OF CONSOLE ===
                        setOutput(prevOutput => prevOutput + `\nServer is ready on port ${port} at ${url}\n`);
                        setIFrameUrl(url);
                        setIsLoadingWebContainer(false);
                      });
                    } catch (error) {
                      // === LOG ERROR TO OUTPUT ===
                      setOutput(prevOutput => prevOutput + `\nFailed to run webcontainer: ${error.message}\n`);
                      console.error("Failed to run webcontainer:", error);
                      setIsLoadingWebContainer(false);
                    }
                  }}
                  className="p-2 px-4 bg-slate-400 text-white"
                  disabled={isLoadingWebContainer}
                >
                  {isLoadingWebContainer ? 'Running...' : 'run'}
                </button>
              </div>
            </div>
            <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
              {currentFile && fileTree[currentFile]?.file?.contents ? (
                <textarea
                  value={fileTree[currentFile].file.contents}
                  onChange={(e) => {
                    const updatedContent = e.target.value;
                    const updatedFileTree = {
                      ...fileTree,
                      [currentFile]: {
                        file: {
                          contents: updatedContent,
                        },
                      },
                    };
                    setFileTree(updatedFileTree);
                    saveFileTree(updatedFileTree);
                  }}
                  className="h-full w-full p-2 border border-gray-300 rounded-md"
                ></textarea>
              ) : (
                <p className="text-center text-gray-500">Select a file to view its content</p>
              )}
            </div>
            {/* === NEW OUTPUT DISPLAY AREA === */}
            <div
              ref={outputRef}
              className="output-area h-48 bg-gray-900 text-white p-2 overflow-y-scroll font-mono text-xs"
            >
              <pre>{output}</pre>
            </div>
          </div>
        )}
        {iframeUrl && webContainer && (
          <div className="flex min-w-96 flex-col h-full">
            <div className="address-bar">
              <input
                type="text"
                onChange={(e) => setIFrameUrl(e.target.value)}
                value={iframeUrl}
                className="w-full p-2 px-4 bg-slate-200"
              />
            </div>

            <iframe src={iframeUrl} className="w-full h-full"></iframe>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96 max-w-full max-h-84 overflow-auto">
            <h2 className="text-xl font-bold mb-4">Select a User</h2>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className={`flex items-center justify-between p-4 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-300 ${
                    // === UPDATED: Conditional class for single select ===
                    selectedUserId === user._id ? "bg-slate-200" : ""
                  }`}
                >
                  <span>{user.email}</span>
                  <i className="ri-user-fill text-cyan-400"></i>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Close
              </button>
              <button
                onClick={addCollaborators}
                className="px-4 py-2 bg-cyan-500 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Collaborators
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;

