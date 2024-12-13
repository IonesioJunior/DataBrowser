from pathlib import Path
from syftbox.lib import Client
import os
import json
import yaml


def copy_html_files(source: Path, destination: Path):
    """
    Moves all files from the source directory to the destination directory.

    Args:
        source (Path): The source directory.
        destination (Path): The destination directory.

    Raises:
        ValueError: If source or destination is not a directory.
    """
    if not source.is_dir():
        raise ValueError(f"Source {source} is not a directory.")
    if not destination.exists():
        destination.mkdir(parents=True)
    elif not destination.is_dir():
        raise ValueError(f"Destination {destination} is not a directory.")

    for item in source.iterdir():
        if item.is_file():
            target = destination / item.name
            try:
                os.rename(item, target)
            except Exception as e:
                print(f"Error moving file {item} to {target}: {e}")


def collect_dataset_metadata(
    path: str, global_datasets_index: dict, owner: str
) -> None:
    datasets_path = Path(path) / "public" / "datasets.yaml"
    if Path(datasets_path).exists():
        with open(str(datasets_path), "r") as yaml_file:
            datasets = yaml.safe_load(yaml_file)

        # print(datasets)
        for dataset in datasets["datasets"]:
            dataset_name = dataset["name"]
            if dataset["name"] in global_datasets_index.keys():
                global_datasets_index[dataset_name]["owners"].append(owner)
            else:
                global_datasets_index[dataset_name] = {
                    "name": dataset_name,
                    "description": dataset["description"],
                    "format": dataset["format"],
                }

                global_datasets_index[dataset_name]["owners"] = [owner]


def build_datasites_index(client: Client):

    datasites = os.listdir(client.datasites)

    datasite_paths = [
        (str(client.datasites / datasite), datasite) for datasite in datasites
    ]
    global_dict = {}
    for datasite, owner in datasite_paths:
        datasite_datasets = collect_dataset_metadata(datasite, global_dict, owner)

    return global_dict


def main():
    client = Client.load()

    datasets = build_datasites_index(client)

    copy_html_files(
        source=Path("./assets"),
        destination=client.my_datasite / "public" / "data_search",
    )

    output_file = client.my_datasite / "public" / "data_search" / "datasets.json"

    with open(output_file, "w") as json_file:
        json.dump(datasets, json_file, indent=4)


if __name__ == "__main__":
    main()
