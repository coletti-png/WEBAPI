const express = require("express"); 
const app = express(); 
  
// Root route of express app 
app.get("/", (req, res) => { 
  res.send("Hello Geeks"); 
}); 
  
app.get("/new", (req, res) => { 
  res.send("welcome to new page"); 
}); 
  
// All the general routes of your 
// web app are defined above the 
// default route 
  
// Default route 
app.get("*", (req, res) => { 
  
  // Here user can also design an 
  // error page and render it  
  res.send("PAGE NOT FOUND"); 
}); 
  
// Server setup 
app.listen(3000, () => { 
  console.log( 
`Server listening on http://localhost:3000`); 
}); 