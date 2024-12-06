defmodule PrimeCalculator do
  @doc """
  Finds all primes from 0 to .

  notifier is called when an event happens. It takes two arguments, event and message. Message might be nil.
  Possible events are:
  - :primes_done - all primes up to n were found
  - :new_prime - a new prime number was found, message is the found prime. Example: (:new_prime, 7)
  - :checked_ranges - how the range 0..n is divided up to allow concurrent computation
  """
  @spec find_primes(number(), (atom(), any() -> :ok)) :: :ok
  def find_primes(n, notifier) do
    number_of_nodes = 16
    range_size = ((n + 1) / number_of_nodes) |> ceil()

    range_list =
      for node <- 0..(number_of_nodes - 1),
          do: generate_range(node, range_size, n)

    notifier.(
      :checked_ranges,
      Enum.map(range_list, fn first..last//_ -> "#{first}..#{last}" end) |> Enum.join(", ")
    )

    Task.async_stream(range_list, fn range ->
      check_chunk_for_primes(range, notifier)
    end)
    |> Enum.to_list()

    notifier.(:primes_done, "All primes up to #{n} found")
    # PubSub.broadcast(PrimeSpirals.PubSub, @topic, :primes_done)
    # IO.puts("All primes up to #{n} found")
  end

  @doc """
  Generates a range, ensuring that all generated ranges are disjunct and numbers are <= max_value

  """
  def generate_range(node, range_size, max_value) do
    first = node * range_size
    last = (node + 1) * range_size - 1

    # 1..0//1 = empty range, guarantees that the max value is not included in multiple ranges
    # this has the drawback that not allways all nodes are used if the numbers per node is small < 10
    if first <= max_value, do: Range.new(first, min(last, max_value)), else: 1..0//1
  end

  defp check_chunk_for_primes(range, notifier) do
    for i <- range, do: check_number(i, notifier)
    range
  end

  defp check_number(i, notifier) do
    p = is_prime?(i)

    if p == true do
      notifier.(:new_prime, i)
      # IO.inspect("new prime: #{i}")
      # PubSub.broadcast(PrimeSpirals.PubSub, @topic, {:new_count, i})
    end
  end

  defp is_prime?(num) when num <= 1, do: false
  defp is_prime?(2), do: true

  defp is_prime?(num) do
    2..(:math.sqrt(num) |> ceil())
    |> Enum.all?(fn divisor -> rem(num, divisor) != 0 end)
  end

  def handle_call(:get_value, _from, state) do
    {:reply, state, state}
  end
end

PrimeCalculator.find_primes(1000, fn event, msg -> IO.puts("#{event}: #{msg}") end)
