# Human Anatomy Atlas 2026 Prototype

スマホとタブレットで動作確認できる「ヒューマン・アナトミー・アトラス2026」の静的デモです。現在は Z-Anatomy の内臓系モデルを読み込み、タップした構造名を表示します。

## デモ内容

- Z-Anatomy の `VisceralSystem100.fbx` を使った内臓系 3D デモ
- 1本指の回転、2本指の拡大縮小・移動
- タップした構造の名称表示
- 英語名称の表示切り替え
- スマホ向けレイアウト

## ローカル起動

```bash
python3 -m http.server 4173
```

ブラウザで `http://localhost:4173` を開いてください。

## スマホでの確認方法

### GitHub Pages

1. GitHub の `Settings > Pages` で Source を `GitHub Actions` に設定
2. `main` へ push
3. `Actions` の `Deploy static site to GitHub Pages` 成功を待つ
4. `https://snm-edu.github.io/asc/` をスマホで開く

### ローカル LAN

同一 Wi-Fi 上のスマホから確認する場合は、PC のローカル IP を使って `http://<PCのIP>:4173` へアクセスします。

## 構成

- `index.html`
- `src/app.js`
- `src/styles.css`
- `assets/z-anatomy/VisceralSystem100.fbx`
- `assets/z-anatomy/LICENSE.txt`
- `.github/workflows/deploy-pages.yml`

## 備考

- 本リポジトリは UI と学習導線の確認用プロトタイプです。
- 現在の 3D モデルは Z-Anatomy / BodyParts3D 由来です。

## Attribution

- BodyParts3D - The Database Center for Life Science - CC-BY-SA 2.1 Japan
- Z-Anatomy - The open source atlas of anatomy - CC-BY-SA 4.0

モデル利用時の詳細条件は [assets/z-anatomy/LICENSE.txt](/Users/ny/Documents/Antigravity/入学前教育/Asc/assets/z-anatomy/LICENSE.txt) を参照してください。
