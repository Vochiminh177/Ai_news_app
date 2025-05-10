import os
from pathlib import Path


def create_init_files(root_dir: str):
    """Tạo __init__.py trong tất cả thư mục con"""
    for dirpath, dirnames, _ in os.walk(root_dir):
        if "__pycache__" in dirpath:
            continue

        init_path = os.path.join(dirpath, "__init__.py")
        if not os.path.exists(init_path):
            Path(init_path).touch()
            print(f"Created: {init_path}")


if __name__ == "__main__":
    project_root = os.path.dirname(os.path.abspath(__file__))
    create_init_files(project_root)