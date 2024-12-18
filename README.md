# DistributedPrimeSpirals

## Install and run it

You will need phoenix_html, three and three.js, install it with

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

## API

Endpoint: `prime_spirals:lobby`

Client requests: 
  - `find_primes(n)` // find all primes from 0 to and including n

Server responses: 
  - `new_prime`, payload 'num' // a new prime was found, the prime number is in the palyoad under the `num` key
  - `primes_done` // all primes from 0 to n were found and already sent to the client

## HOWTO Test prime number generation
```
elixir lib/distributedPrimeSpirals/prime_calculator.ex 
```

## HOWTO start your Phoenix server:

  * Run `mix setup` to install and setup dependencies
  * Start Phoenix endpoint with `mix phx.server`

Now visit [`localhost:4000`](http://localhost:4000) from your browser.


## Learn more

  * Official website: https://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Forum: https://elixirforum.com/c/phoenix-forum
  * Source: https://github.com/phoenixframework/phoenix
