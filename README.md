# Human Anatomy Atlas 2026 Prototype

スマホとタブレットで動作確認できる「ヒューマン・アナトミー・アトラス2026」の静的デモです。

## デモ内容

- 同一の人体モデル上で部位を切り替える解剖学学習デモ
- 1本指の回転、2本指の拡大縮小・移動
- 学習領域フィルタ、レイヤーフィルタ
- 日本語 / 英語ラベル切り替え
- タップ選択とクイズ機能

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
- `data/anatomy_parts.json`
- `.github/workflows/deploy-pages.yml`

## 備考

- 本リポジトリは UI と学習導線の確認用プロトタイプです。
- 本運用には監修済みの精密 3D 解剖モデルへの差し替えが必要です。
