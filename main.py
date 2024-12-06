from pathlib import Path
from syftbox.lib import Client 
import os
import json


def get_datasets_metadata(path: str):
    datasets_path = Path(path) / "api_data" / "data_loader" / "datasets.json"
    if Path(datasets_path).exists():
        with open(str(datasets_path), "r") as json_file:
            datasets = json.load(json_file)

        # print(datasets)
        for dataset in datasets["datasets"]:
            datasets["datasets"][dataset]["owner"] = datasets["owner"]

        return datasets["datasets"]

    return None


def build_datasites_index(client: Client):

    datasites = os.listdir(client.datasites)

    datasite_paths = [str(client.datasites / datasite) for datasite in datasites]
    global_dict = {}
    for datasite in datasite_paths:
        datasite_datasets = get_datasets_metadata(datasite)
        if datasite_datasets is not None:
            global_dict = global_dict | datasite_datasets

    return global_dict


def main():
    client = Client.load()

    datasets = build_datasites_index(client)
    
    output_file = client.my_datasite / "public" / "data_search" / "datasets.json"
    
    with open(output_file, 'w')  as json_file:
        json.dump(datasets, json_file, indent=4)

if __name__ == "__main__":
    main()
