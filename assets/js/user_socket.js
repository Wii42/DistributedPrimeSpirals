// Bring in Phoenix channels client library:
import { Socket } from "phoenix"

// Import exported function 'addPointToGrid' which is needed to print prime numbers onto the three.js grid 
import { addPointToGrid } from "./app.js"

// And conneimport { addPointToGrid } from "./app.js"ct to the path in "lib/distributedPrimeSpirals_web/endpoint.ex". We pass the
// token for authentication. Read below how it should be used.
let socket = new Socket("/socket", { params: { token: window.userToken } })

// Connect to the socket:
socket.connect()

// After connection we open a channels with a topic ('lobby' is our 'endpoint')
let channel = socket.channel("prime_spirals:lobby", {})
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

// Add Start button to start calculation
let chatInput = document.querySelector("#chat-input")
let startButton = document.querySelector("#start-calc")
let messagesContainer = document.querySelector("#messages")

chatInput.addEventListener("keypress", event => {
  if (event.key === 'Enter') {
    //channel.push("new_msg", { body: chatInput.value })
    channel.push("test_msg", { body: chatInput.value })
    chatInput.value = ""
  }
})

// Event listener for start button (to call for new primes and start the whole process)
startButton.addEventListener("click", event => {
  console.log("Start button was clicked.")
  channel.push("find_primes", { n: 100 });
})

// Add points dynamically using keypresses
document.addEventListener('keydown', event => {
  if (event.key === 'a') {
      const x = Math.random() * 10 - 5;
      const y = Math.random() * 10 - 5;
      addPointToGrid(x, y);
  }
});

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
  
  // Print it on the top left side of index.html 
  document.getElementById("prime-display").textContent = `New Prime: ${payload.num}`;

  // Define r (radius)
  let r = parseInt(payload.num);
  console.log("#### " + r + " ######")

  // Define phi (Radians to degrees)
  let phi = r * (180 / Math.PI);

  /* convert input to polar coordinates:
      x = r cos φ
      y = r sin φ) */
  
  let x = r * Math.cos(phi);
  let y = r * Math.sin(phi);

  // Output results
  console.log(`x: ${x}, y: ${y}`);

  // And finally set the coordinates onto the grid
  addPointToGrid(x, y);
})


// Helper function to convert radians to degree
function radians_to_degrees(radians)
{
  // Store the value of pi.
  var pi = Math.PI;
  // Multiply radians by 180 divided by pi to convert to degrees.
  return radians * (180/pi);
}


export default socket
