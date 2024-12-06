defmodule PrimeCalculator do
  def find_primes(n) do
    number_of_nodes = 16
    range_size = ((n + 1) / number_of_nodes) |> ceil()

    range_list =
      for node <- 0..(number_of_nodes - 1),
          do: generate_range(node, range_size, n)

    IO.inspect(range_list)

    #processes = for range <- range_list, do: fn -> check_chunk_for_primes(range) end

    Task.async_stream(range_list, fn range ->
      check_chunk_for_primes(range)
    end) |> Enum.to_list()

    #PubSub.broadcast(PrimeSpirals.PubSub, @topic, :primes_done)
    IO.puts("All primes up to #{n} found")

    #Task.start(fn ->
    #  for p <- processes, do: p.()
    #  # for i <- 0..n, do: check_number(i)
    #  PubSub.broadcast(PrimeSpirals.PubSub, @topic, :primes_done)
    #  IO.puts("All primes up to #{n} found")
    #end)
  end

  @doc """
  Generates a range, ensuring that all generated ranges are disjunct and numbers are <= max_value

  """
  defp generate_range(node, range_size, max_value) do
    first = node * range_size
    last = (node + 1) * range_size - 1

    # 1..0//1 = empty range, guarantees that the max value is not included in multiple ranges
    # this has the drawback that not allways all nodes are used if the numbers per node is small < 10
    if first <= max_value, do: Range.new(first, min(last, max_value)), else: 1..0//1
  end

  defp check_chunk_for_primes(range) do
    for i <- range, do: check_number(i)
    range
  end

  defp check_number(i) do
    p = is_prime?(i)

    if p == true do
      IO.inspect("new prime: #{i}")
      #PubSub.broadcast(PrimeSpirals.PubSub, @topic, {:new_count, i})
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

PrimeCalculator.find_primes(1000)
