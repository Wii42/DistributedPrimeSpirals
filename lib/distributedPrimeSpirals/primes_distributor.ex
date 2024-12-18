defmodule DistributedPrimeSpirals.PrimesDistributor do
  require Logger

  alias Phoenix.PubSub

  @topic "primes_distribution"

  def start_link(_) do
    Task.start_link(fn -> subscribe_to_topic() end)
  end

  def distribute_primes_calculation(n, notifier) do
    nodes = nodes()

    number_of_nodes = length(nodes)
    range_list = PrimeCalculator.divide_into_ranges(n, number_of_nodes)

    # notifier.(:checked_ranges, range_list)

    node_ranges = Enum.zip(nodes, range_list)
    node_ranges |> inspect() |> Logger.debug()

    notifier.(:checked_ranges, node_ranges)

    for {node, range} <- node_ranges,
        do:
          PubSub.direct_broadcast!(
            node,
            DistributedPrimeSpirals.PubSub,
            @topic,
            {:find_primes_in_range, range, notifier}
          )

    # Task.async_stream(range_list, fn range ->
    #  PrimeCalculator.find_primes_in_range(range, notifier)
    # end)
    # |> Enum.to_list()

    # notifier.(:primes_done, "All primes up to #{n} found")
  end

  defp nodes() do
    [Node.self() | Node.list()]
  end

  defp subscribe_to_topic do
    PubSub.subscribe(DistributedPrimeSpirals.PubSub, @topic)
    debug_info()

    # Handle incoming messages
    listen_for_messages()
  end

  defp listen_for_messages do
    receive do
      {:find_primes_in_range, range, notifier} ->
        Logger.warning("Shall find primes in #{inspect(range)}")
        PrimeCalculator.find_primes_in_range(range, notifier)

        # Continue listening
        listen_for_messages()

      other ->
        Logger.warning("Received unknown message in #{@topic}: #{other}")
        listen_for_messages()
    end
  end

  defp debug_info() do
    Logger.debug("This node:")
    Logger.debug(Node.self() |> inspect())
    Logger.debug("Connected nodes:")
    Logger.debug(Node.list() |> inspect())
    Logger.debug("This cookie:")
    Logger.debug(Node.get_cookie() |> inspect())
  end

  def child_spec(opts) do
    %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [opts]},
      type: :worker,
      restart: :permanent,
      shutdown: 500
    }
  end
end
