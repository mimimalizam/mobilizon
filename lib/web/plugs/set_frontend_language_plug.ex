defmodule Mobilizon.Web.Plugs.SetFrontendLanguagePlug do
  @moduledoc """
  Plug to assign language for Frontend

  language resolution order:
    - language from URL ("/fr" -> "fr")
    - user-specified language from the database (:user_locale)
    (value from the locale column in the users table)
    - Value from an environment variable
    - English (en)
  """
  import Plug.Conn, only: [assign: 3]
  alias Mobilizon.Web.Gettext, as: GettextBackend

  @spec init(any()) :: nil
  def init(_), do: nil

  @spec call(Plug.Conn.t(), any()) :: Plug.Conn.t()
  def call(conn, _) do
    locale =
      [
        eventual_path_locale(conn.path_info),
        conn.assigns[:user_locale],
        default_locale()
      ]
      |> Enum.filter(& &1)
      |> Enum.map(&determine_best_locale/1)
      |> hd()

    require Logger
    Logger.debug("Detected frontend language frontend_language: #{locale}")

    assign(conn, :frontend_language, locale)
  end

  defp eventual_path_locale(path_info) do
    with [locale] <- path_info,
         true <- supported_locale?(locale) do
      locale
    else
      _ -> nil
    end
  end

  @spec supported_locale?(String.t()) :: boolean()
  defp supported_locale?(locale) do
    GettextBackend
    |> Gettext.known_locales()
    |> Enum.member?(locale)
  end

  @spec default_locale :: String.t()
  defp default_locale do
    Keyword.get(Mobilizon.Config.instance_config(), :default_language, "en")
  end

  @doc """
  Determine the best available locale for a given locale ID
  """
  @spec determine_best_locale(String.t()) :: String.t() | nil
  def determine_best_locale(locale) when is_binary(locale) do
    locale = String.trim(locale)
    locales = Gettext.known_locales(GettextBackend)

    cond do
      locale == "" -> nil
      # Either it matches directly, eg: "en" => "en", "fr" => "fr"
      locale in locales -> locale
      # Either the first part matches, "fr_CA" => "fr"
      split_locale(locale) in locales -> split_locale(locale)
      locale == "sr_Cyrl" -> "sr-Cyrl"
      # Otherwise set to default
      true -> nil
    end
  end

  def determine_best_locale(_), do: nil

  # Keep only the first part of the locale
  @spec split_locale(String.t()) :: String.t()
  defp split_locale(locale), do: locale |> String.split("_", trim: true, parts: 2) |> hd
end
