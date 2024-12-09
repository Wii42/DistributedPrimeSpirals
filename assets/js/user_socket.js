// Bring in Phoenix channels client library
import { Socket } from "phoenix"

// Import exported function 'addPoint' which is needed to print prime numbers onto the three.js grid 
import { addPointToGrid } from "./spiral.js"

// We pass the token for authentication. Read below how it should be used.
let socket = new Socket("/socket", { params: { token: window.userToken } })

// Connect to the socket
socket.connect()

// After connection we open a channels with a topic ('prime_spirals:lobby' is our 'endpoint' so to speak)
let channel = socket.channel("prime_spirals:lobby", {})
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

// Add Start button to start calculation
let startButton = document.querySelector("#start-calc")

// Event listener for start button (to call for new primes and start the whole process)
startButton.addEventListener("click", event => {
  console.log("Start button was clicked.")

  // ### Here is the infamous push of the message to go find the primes! ###
  channel.push("find_primes", { n: 100 });
})

// Channels for incoming messages
channel.on("new_msg", payload => {
  console.log("New message arrived.")
  let messageItem = document.createElement("p")
  messageItem.innerText = `[${Date()}] ${payload.body}`
  messagesContainer.appendChild(messageItem)
})

channel.on("test_msg", payload => {
  console.log("Test message arrived.")
  let messageItem = document.createElement("p")
  messageItem.innerText = `[${Date()}] ${payload.body}`
  messagesContainer.appendChild(messageItem)
})

// Activate channel to call for new prime generation 
channel.on("new_prime", payload => {
  console.log("New prime message arrived.")
  
  // Print it on the top left side of the page
  document.getElementById("prime-display").textContent = `New Prime: ${payload.num}`;

  // Define r (radius)
  let r = parseInt(payload.num);

  // Define phi (Radians to degrees)
  let phi = r * (180 / Math.PI);

  // Convert input to polar coordinates: x = r cos φ, y = r sin φ
  let x = r * Math.cos(phi);
  let y = r * Math.sin(phi);

  // Output results
  console.log(`Converted point [${r}]: x: ${x}, y: ${y}`);

  // And finally set the coordinates onto the grid
  // TODO: refactor addPointToGrid function!
  addPointToGrid(x, y);
})

// Helper function to convert radians to degree
function radians_to_degrees(radians)
{
  // Multiply radians by 180 divided by pi to convert to degrees.
  return radians * (180/Math.PI);
}

export default socket
