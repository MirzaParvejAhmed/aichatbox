import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI= new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY );
const model =genAI.getGenerativeModel({model:"gemini-1.5-flash",
    generationConfig:{
        responseMimeType:"application/json",
    },
    systemInstruction:`You are an expert in MERN development
    Examples:
    <example>
    user:Create an express application
    response:{
    "text":"this is your fileTree structure of the express server",
    "fileTree":{
    "app.js":{
    file:{
    contents:"
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, Express Server!');
});

// Start server
app.listen(3000, () => {
  console.log('Server is running');
})
"
},

"package.json":{
file:{
contents:"
{

  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description":"",
  "dependencies": {
  "express": "^5.1.0"}
}
",
},
},
},
"buildCommand":{
   mainItem:"npm",
   commands:["install"]
   },
   "startCommand":{
   mainItem:"node",
   commands:["app.js"]
   }
}

</example>
<example>
user:Hello
response:{
"text":"Hello, how can  i help you today!"}
</example>
    `
});


export const generateResult = async (contents)=>{
    const result = await model.generateContent(contents);
    return result.response.text();
}




