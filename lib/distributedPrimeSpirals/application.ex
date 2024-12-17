defmodule DistributedPrimeSpirals.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    # Set the cookie for the node
    # cookie has to be the same on all todes for them to connect
    Node.set_cookie(Node.self(), :prime_spirals_cookie)

    topologies = Application.get_env(:libcluster, :topologies) || []

    children = [
      DistributedPrimeSpiralsWeb.Telemetry,
      {DNSCluster,
       query: Application.get_env(:distributedPrimeSpirals, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: DistributedPrimeSpirals.PubSub},
      {Cluster.Supervisor, [topologies, [name: DistributedPrimeSpirals.ClusterSupervisor]]},
      # Start a worker by calling: DistributedPrimeSpirals.Worker.start_link(arg)
      # {DistributedPrimeSpirals.Worker, arg},
      # Start to serve requests, typically the last entry
      DistributedPrimeSpiralsWeb.Endpoint
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
