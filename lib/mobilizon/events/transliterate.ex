defmodule Mobilizon.SerbianTransliteration do
  @moduledoc """
  Serbian cyrillic to latin and vice versa transliteration.
  """

  def to_cyr(term) do
    term =
      term
      |> digraphs_lat_to_cyr()

    Enum.reduce(cyr_to_lat(), term, fn {cyr, lat}, acc ->
      String.replace(acc, lat, cyr)
    end)
  end

  def to_lat(term) do
    term =
      term
      |> digraphs_cyr_to_lat()

    Enum.reduce(cyr_to_lat(), term, fn {cyr, lat}, acc ->
      String.replace(acc, cyr, lat)
    end)
  end

  defp digraphs_lat_to_cyr(term) do
    term
    |> String.replace("nj", "њ")
    |> String.replace("Nj", "Њ")
    |> String.replace("NJ", "Њ")
    |> String.replace("lj", "љ")
    |> String.replace("Lj", "Љ")
    |> String.replace("LJ", "Љ")
    |> String.replace("đ", "ђ")
    |> String.replace("Đ", "Ђ")
    |> String.replace("dj", "ђ")
    |> String.replace("Dj", "Ђ")
    |> String.replace("DJ", "Ђ")
    |> String.replace("dž", "џ")
    |> String.replace("Dž", "Џ")
    |> String.replace("DŽ", "Џ")
  end

  defp digraphs_cyr_to_lat(term) do
    term
    |> String.replace("њ", "nj")
    |> String.replace("Њ", "Nj")
    |> String.replace("љ", "lj")
    |> String.replace("Љ", "Lj")
    |> String.replace("ђ", "đ")
    |> String.replace("Ђ", "Đ")
    |> String.replace("џ", "dž")
    |> String.replace("Џ", "Dž")
  end

  defp cyr_to_lat do
    %{
      "а" => "a",
      "б" => "b",
      "в" => "v",
      "г" => "g",
      "д" => "d",
      "ђ" => "đ",
      "е" => "е",
      "ж" => "ž",
      "з" => "z",
      "и" => "i",
      "ј" => "j",
      "к" => "k",
      "л" => "l",
      "љ" => "lj",
      "м" => "m",
      "н" => "n",
      "њ" => "nj",
      "о" => "o",
      "п" => "p",
      "р" => "r",
      "с" => "s",
      "т" => "t",
      "ћ" => "ć",
      "у" => "u",
      "ф" => "f",
      "х" => "h",
      "ц" => "c",
      "ч" => "č",
      "џ" => "dž",
      "ш" => "š",
      "А" => "A",
      "Б" => "B",
      "В" => "V",
      "Г" => "G",
      "Д" => "D",
      "Ђ" => "Đ",
      "Е" => "Е",
      "Ж" => "Ž",
      "З" => "Z",
      "И" => "I",
      "Ј" => "J",
      "К" => "K",
      "Л" => "L",
      "Љ" => "LJ",
      "М" => "M",
      "Н" => "N",
      "Њ" => "NJ",
      "О" => "O",
      "П" => "P",
      "Р" => "R",
      "С" => "S",
      "Т" => "T",
      "Ћ" => "Ć",
      "У" => "U",
      "Ф" => "F",
      "Х" => "H",
      "Ц" => "C",
      "Ч" => "Č",
      "Џ" => "DŽ",
      "Ш" => "Š"
    }
  end
end
