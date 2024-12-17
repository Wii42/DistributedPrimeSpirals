defmodule DistributedPrimeSpirals.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    Node.set_cookie(Node.self(), String.to_atom("testcookie"))

    topologies = Application.get_env(:libcluster, :topologies) || []



    children = [
      DistributedPrimeSpiralsWeb.Telemetry,
      {DNSCluster,
       query: Application.get_env(:distributedPrimeSpirals, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: DistributedPrimeSpirals.PubSub},
      # Start a worker by calling: DistributedPrimeSpirals.Worker.start_link(arg)
      # {DistributedPrimeSpirals.Worker, arg},
      # Start to serve requests, typically the last entry
      DistributedPrimeSpiralsWeb.Endpoint,
      {Cluster.Supervisor, [topologies, [name: DistributedPrimeSpirals.ClusterSupervisor]]}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: DistributedPrimeSpirals.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    DistributedPrimeSpiralsWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
