# DistributedPrimeSpirals


## API

Lobby: `prime_spirals:lobby`

Client requests: 
  - `find_primes(n)` // find all primes from 0 to and including n

Server responses: 
  - `new_prime`, payload 'num' // a new prime was found, the prime number is in the palyoad under the `num` key
  - `primes_done` // all primes from 0 to n were found and already sent to the client


#

To start your Phoenix server:

  * Run `mix setup` to install and setup dependencies
  * Start Phoenix endpoint with `mix phx.server` or inside IEx with `iex -S mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Learn more

  * Official website: https://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Forum: https://elixirforum.com/c/phoenix-forum
  * Source: https://github.com/phoenixframework/phoenix
