defmodule DistributedPrimeSpiralsWeb.PrimeSpiralsChannel do
  use DistributedPrimeSpiralsWeb, :channel

  @impl true
  @spec join(<<_::152>>, any(), any()) :: {:ok, any()}
  def join("prime_spirals:lobby", payload, socket) do
    if authorized?(payload) do
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

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
