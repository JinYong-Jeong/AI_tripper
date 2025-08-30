import os
import argparse
import uuid

from .vectorstore import add_texts


def read_text_files(root: str):
    texts, metas, ids = [], [], []
    for dirpath, _, filenames in os.walk(root):
        for fn in filenames:
            if fn.lower().endswith((".txt", ".md")):
                path = os.path.join(dirpath, fn)
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                texts.append(content)
                metas.append({"path": path, "filename": fn})
                ids.append(str(uuid.uuid4()))
    return texts, metas, ids


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--path", required=True, help="폴더 경로(.txt/.md)")
    args = ap.parse_args()
    texts, metas, ids = read_text_files(args.path)
    if not texts:
        print("No files found.")
        return
    add_texts(texts, metas, ids)
    print(f"Indexed {len(texts)} docs.")


if __name__ == "__main__":
    main()


