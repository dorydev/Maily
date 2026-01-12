import pandas

data = pandas.read_csv("")

def sort_users_data():
    firstname : str = data[data["prenom"]]
    lastname : str = data[data["nom"]]
    email : str = data[data["email"]]