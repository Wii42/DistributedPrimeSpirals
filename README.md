# DistributedPrimeSpirals

**DistributedPrimeSpirals calculates prime numbers across multiple nodes and visualizes them.**

We calculate a large number of prime numbers. The found primes are then visualized by mapping each prime to a point in polar coordinates.
Idea taken from [3Blue1Brown](https://www.3blue1brown.com/lessons/prime-spirals).

These visualised prime numbers form a huge spiral pattern. This is implemented as follows: 
Calculation of the prime numbers in the backend using [Elixir](https://github.com/elixir-lang). The prime numbers found are then transmitted 
to a [Phoenix LiveView](https://www.phoenixframework.org) channel, which finally transmits all
newly found points to the outermost display layer, implemented with the JavaScript library [Three.js](https://threejs.org)
in order to generate the desired large spiral patterns

![spirals](https://github.com/user-attachments/assets/dca43cc6-faaf-4726-9b64-899d13231bee)

![closeup](https://github.com/user-attachments/assets/ee7901b2-3a7d-4bd4-ab45-f49b1ff19cc9)


## Run it in Docker

In the project root, run:
``` 
docker build -t prime-spirals .
docker-compose up
```

### Set specific number of nodes
This creates a cluster of 2 nodes.

To select the number of nodes you can run:
```
docker-compose up --scale additional-node=<n>
``` 
`n` is the number of nodes you want to run additionaly to the main node. In total there will be running n+1 nodes.


To run a single instance, you can also run:
``` 
docker run -p 4000:4000 prime-spirals
```

Now visit [`localhost:4000`](http://localhost:4000) from your browser.

### Alternative: Install and run it without Docker

You will need packages **phoenix_html**, **three** and **three.js**, install it with

```
npm install phoenix_html
npm install three
npm install three.js
```

Eventually 
```
npm audit fix --force
```

Furthermore you need **Mix**, a "build tool that provides tasks for creating, compiling, and testing Elixir projects, managing its dependencies, and more.": https://hexdocs.pm/mix/1.12.3/Mix.html

The project already contains **OrbitControls**, as it is already imported explicitly in our project structure: https://threejs.org/docs/#examples/en/controls/OrbitControls

Run `mix setup` to install and setup dependencies

Start Phoenix endpoint with `elixir --sname prime-spirals-node -S mix phx.server`

Now visit [`localhost:4000`](http://localhost:4000) from your browser.


## System Architecture
Detailed View of the System’s Functional Interaction
![image](https://github.com/user-attachments/assets/e76621d8-1f9d-40e8-88c2-7ac787453b63)


## API

*The API specification used between frontend and backend via Phoenix Channels*

Endpoint: `prime_spirals:endpoint`

Client requests: 
  - `find_primes(n)` _// find all primes from 0 to and including n_

Server responses: 
  - `new_prime`, payload 'num' _// a new prime was found, the prime number is in the palyoad under the `num` key_
  - `primes_done` _// all primes from 0 to n were found and already sent to the client_
  
## Live demo

https://github.com/user-attachments/assets/682bae83-6621-486b-970e-b16b8afd98a9

## 
