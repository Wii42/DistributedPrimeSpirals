defmodule DistributedPrimeSpiralsWeb.PrimeSpiralsChannel do
  use DistributedPrimeSpiralsWeb, :channel
  require Logger

  alias Phoenix.PubSub

  @topic "prime_spirals_channel"

  @impl true
  @spec join(<<_::152>>, any(), any()) :: {:ok, any()}
  def join("prime_spirals:endpoint", _payload, socket) do
    PubSub.subscribe(DistributedPrimeSpirals.PubSub, @topic)
    Logger.info("Client connected")
    {:ok, socket}
  end

  @impl true
  def handle_in("new_prime", %{"body" => body}, socket) do
    broadcast!(socket, "new_prime", %{body: body})
    {:noreply, socket}
  end

  # Handle-in if we want to calculate the prime numbers (Button on main view)
  def handle_in("find_primes", %{"n" => n}, socket) do
    Logger.info("Client requests primes up to #{n}")

    DistributedPrimeSpirals.PrimesDistributor.distribute_primes_calculation(
      n,
      &on_primes_calculation_event/2
    )

    {:noreply, socket}
  end

  # specifies what should be done when PrimeCalculator has an event like a new prime found.
  defp on_primes_calculation_event(event, message) do
    PubSub.broadcast(DistributedPrimeSpirals.PubSub, @topic, {event, message})
  end

  # Handle-in for new found primes
  @impl true
  @spec handle_info({:checked_ranges, any()} | {:new_prime, any()} | {:primes_done, any()}, any()) ::
          {:noreply, any()}
  def handle_info({:new_prime, num}, socket) do
    Logger.info("Push message 'new_prime' with prime #{num} as payload.")
    # Send new found primes to the socket
    push(socket, "new_prime", %{num: num})
    {:noreply, socket}
  end

  def handle_info({:primes_done, _}, socket) do
    Logger.info("Searching for primes done")
    push(socket, "primes_done", %{})
    {:noreply, socket}
  end

  def handle_info({:checked_ranges, ranges}, socket) do
    Logger.info(
      "Devided range to be searched into #{length(ranges)} ranges to be computed concurrently"
    )

    {:noreply, socket}
  end
end
