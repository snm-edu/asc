# Human Anatomy Atlas 2026 Prototype

iPad向け「ヒューマン・アナトミー・アトラス2026」の実装プロトタイプです。

## 起動方法

```bash
python3 -m http.server 4173
```

ブラウザで `http://localhost:4173` を開いてください。

## 実装済み

- 一体型3D解剖体（1つの人体モデル空間に全領域の部位を保持）
- 1本指相当: 回転 / タップ選択
- 2本指相当: 拡大縮小・平行移動
- 領域フィルタ・レイヤーフィルタ
- 部位ラベル（日本語・英語切替）
- クイズ機能（名称→部位）
- 学習時間・正答率の表示

## 備考

- 本実装はUI/操作の検証を主目的としたプロトタイプです。
- 医療教育での本運用には、実解剖に忠実な監修済み3Dデータへの差し替えが必要です。


## 作成ファイル

- `src/app.js`（3D処理本体）
- `src/styles.css`（UIスタイル）
- `data/anatomy_parts.json`（部位データ）
- `README.md`（起動手順）


## GitHub Pages公開手順（404対策）

1. このリポジトリを `main` に push する
2. GitHub の `Settings > Pages` で Source を `GitHub Actions` にする
3. `Actions` タブで `Deploy static site to GitHub Pages` が成功するまで待つ
4. `https://snm-edu.github.io/asc/` を開く

### 404が出る場合

- URLが `https://snm-edu.github.io/asc/` になっているか確認（`/asc/` が必要）
- Actions のデプロイが成功しているか確認
- 初回デプロイ直後は反映まで数分かかる場合あり


## ローカル再作成スクリプト

ローカルに `src/` や `data/` が空で残ってしまった場合は、次で必要ファイルを再作成できます。

```bash
bash scripts/create_prototype_files.sh
```

その後にコミット・pushしてください。

```bash
git add .
git commit -m "Restore anatomy atlas prototype files"
git push origin main
```
