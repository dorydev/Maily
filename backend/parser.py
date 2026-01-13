from pathlib import Path
from io import BytesIO
from typing import Any, Tuple, Dict, List

import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
csv_path = BASE_DIR / "raw_data_MS.csv"

data = pd.read_csv(csv_path, sep=";", index_col=0, encoding="latin1")
df = pd.read_csv(csv_path, sep=";", encoding="latin1")
df.columns = df.columns.str.strip() 


def parse_recipients_from_bytes(content : bytes, *, 
  sep : str = ";", 
  encoding : str = "latin1",
  cols : Tuple[str, str, str] = ("Class", "Formula", "#S"),
  ) -> List[Dict[str, Any]]:

  """ Parse CSV, TxT and Excel Files to return recipients as [{"email" : "...",
  "data" : {"firstname" : "...", "lastname" : "..."}}]
  """
  df = pd.read_csv(BytesIO(content), sep=sep, encoding=encoding)
  df.columns = df.columns.astype(str).str.strip()
  missing : bool = [c for c in cols if c not in df.columns]
  if missing :
    raise ValueError(f"Missing column in File: {missing}. Available : {list(df.columns)}")

  firstname_col, lastname_col, email_col = cols
  users = (
    df[[firstname_col, lastname_col, email_col]]
    .rename(columns={firstname_col: "firstname", lastname_col : "lastname", email_col : "email"})
    .dropna(subset=["email"])
  )

  users["email"] = users["email"].astype(str).str.strip().str.lower()
  users["firstname"] = users["firstname"].astype(str).str.strip()
  users["lastname"] = users["lastname"].astype(str).str.strip()

  records = users.to_dict(orient="records")

  out : List = []
  for r in records:
    out.append(
      {
        "email": r["email"],
        "data" : {
          "firstname" : r.get("firstname", "") or "",
          "lastname" : r.get("lastname", "") or "",
        },
      }
    )
  return out
