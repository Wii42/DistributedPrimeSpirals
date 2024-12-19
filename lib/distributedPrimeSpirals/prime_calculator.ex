defmodule PrimeCalculator do
  @moduledoc """
  Provides methods to find all primes in  agiven range.
  """

  @doc """
  Finds all primes from 0 to .

  notifier is called when an event happens. It takes two arguments, event and message. Message might be nil.
  Possible events are:
  - :primes_done - all primes up to n were found
  - :new_prime - a new prime number was found, message is the found prime. Example: (:new_prime, 7)
  - :checked_ranges - how the range 0..n is divided up to allow concurrent computation, mesassage is the list of ranges. Example: (:checked_ranges, [0..2, 3..6])
  """
  @spec find_primes(number(), (atom(), any() -> :ok)) :: :ok
  def find_primes(n, notifier) do
    number_of_nodes = 16
    range_list = divide_into_ranges(n, number_of_nodes)

    notifier.(:checked_ranges, range_list)

    Task.async_stream(range_list, fn range ->
      find_primes_in_range(range, notifier)
    end)
    |> Enum.to_list()

    notifier.(:primes_done, "All primes up to #{n} found")
  end

  @spec divide_into_ranges(number(), integer()) :: list()
  def divide_into_ranges(n, number_of_ranges) do
    range_size = ((n + 1) / number_of_ranges) |> ceil()

    for node <- 0..(number_of_ranges - 1),
        do: generate_range(node, range_size, n)
  end

  # Generates a range, ensuring that all generated ranges are disjunct and numbers are <= max_value
  defp generate_range(node, range_size, max_value) do
    first = node * range_size
    last = (node + 1) * range_size - 1

    # 1..0//1 = empty range, guarantees that the max value is not included in multiple ranges
    # this has the drawback that not allways all nodes are used if the numbers per node is small < 10
    if first <= max_value, do: Range.new(first, min(last, max_value)), else: 1..0//1
  end

  def find_primes_in_range(range, notifier) do
    for i <- range, do: check_number(i, notifier)
    range
  end

  defp check_number(i, notifier) do
    p = is_prime?(i)

    if p == true do
      notifier.(:new_prime, i)
    end
  end

  @spec is_prime?(integer()) :: boolean()
  @doc "Returns wether an integer num is prime. Returns false for all negative integers."
  def is_prime?(num) when num <= 1, do: false
  def is_prime?(2), do: true

  def is_prime?(num) do
    2..(:math.sqrt(num) |> ceil())
    |> Enum.all?(fn divisor -> rem(num, divisor) != 0 end)
  end

  @spec notify_stdout(atom(), any()) :: :ok
  @doc "Implementation for notifier which prints the event to the sandart output. Can be used in find_primes/2"
  def notify_stdout(event, message) do
    string_msg =
      case event do
        :checked_ranges ->
          Enum.map(message, fn first..last//_ -> "#{first}..#{last}" end) |> Enum.join(", ")

        _ ->
          message
      end

    IO.puts("#{event}: #{string_msg}")
  end
end
