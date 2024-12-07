defmodule DistributedPrimeSpiralsWeb.PrimeSpiralsChannel do
  use DistributedPrimeSpiralsWeb, :channel
  require Logger

  alias Phoenix.PubSub

  @topic "prime_spirals"

  @impl true
  @spec join(<<_::152>>, any(), any()) :: {:ok, any()}
  def join("prime_spirals:lobby", payload, socket) do
    if authorized?(payload) do
      PubSub.subscribe(DistributedPrimeSpirals.PubSub, @topic)
      Logger.info("Client connected")
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def join("prime_spirals:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  @impl true
  def handle_in("new_msg", %{"body" => body}, socket) do
    broadcast!(socket, "new_msg", %{body: body})
    {:noreply, socket}
  end

  def handle_in("test_msg", %{"body" => body}, socket) do
    broadcast!(socket, "test_msg", %{body: body})
    {:noreply, socket}
  end

  def handle_in("new_prime", %{"body" => body}, socket) do
    broadcast!(socket, "new_prime", %{body: body})
    {:noreply, socket}
  end

  # Handle-in if we want to calculate the prime numbers (Button on main view)
  def handle_in("find_primes", %{"n" => n}, socket) do
    Logger.info("Client requests primes up to #{n}")

    PrimeCalculator.find_primes(n, fn event, msg ->
      PubSub.broadcast(DistributedPrimeSpirals.PubSub, @topic, {event, msg})
    end)

    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end

  # Handle-in for new found primes
  @impl true
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
    Logger.info("Devided range to be searched into #{length(ranges)} ranges to be computed concurrently")
    {:noreply, socket}
  end
end
