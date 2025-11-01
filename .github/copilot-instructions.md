# Copilot Instructions for AI Coding Agents

## 專案架構總覽
- 本專案為多個 Flask 應用的集合，主要目錄如 `lesson4/`、`lesson5/` 各自包含獨立的 `app.py` 與對應的 `templates/`（HTML）及 `static/`（CSS/JS/圖片）資料夾。
- 主目錄下有 `main.py`、`main_ai.py`，但大部分網頁功能集中於 lesson 子目錄。
- 使用 [uv](https://github.com/charliermarsh/uv) 虛擬環境管理，**所有 Python 執行需用 `uv run python ...` 取代直接 `python ...`**。

## 關鍵開發流程
- 啟動 Flask 應用：
  - 進入對應 lesson 資料夾，執行 `uv run python app.py`。
- 網頁模板與靜態資源：
  - HTML 檔案放於 `templates/`，CSS/JS/圖片放於 `static/`。
  - 請依 Flask 標準路徑引用資源。
- 依賴管理：
  - 依賴於 `pyproject.toml`，但安裝/執行均需透過 uv 虛擬環境。

## 專案慣例與特殊規則
- **勿直接用 `python` 指令**，一律使用 `uv run python ...`。
- 每個 lesson 子目錄為獨立 Flask 專案，互不干擾。
- 若需新增網頁，請於對應 lesson 的 `templates/` 新增 HTML，並於 `app.py` 註冊 route。
- 靜態檔案請放於 lesson 的 `static/`。
- 若有 Jupyter Notebook（如 `lesson1/lesson1_1.ipynb`），僅用於教學或資料分析，與 Flask 應用分離。

## 重要檔案/目錄
- `lesson4/app.py`、`lesson5/app.py`：各自 Flask 應用主程式。
- `lesson4/templates/`、`lesson5/templates/`：網頁模板。
- `lesson4/static/`、`lesson5/static/`：靜態資源。
- `pyproject.toml`：依賴與專案設定。
- `main.py`、`main_ai.py`：主目錄 Python 腳本。

## 範例指令
- 啟動 lesson5 Flask 應用：
  ```powershell
  cd lesson5
  uv run python app.py
  ```
- 安裝依賴：
  ```powershell
  uv pip install -r ../pyproject.toml
  ```

---
如需更動架構、慣例或有不明確處，請先詢問使用者確認。
