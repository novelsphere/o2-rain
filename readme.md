# o2-rain

[![Build Status](https://travis-ci.org/novelsphere/o2-rain.svg?branch=master)](https://travis-ci.org/novelsphere/o2-rain)

![Preview](https://cloud.githubusercontent.com/assets/127193/14938666/ab2a4e46-0f5d-11e6-8f9e-7751bd343ffa.png)

Added animated [rainyday.js] effect to a layer. Pretty real raindrop effect.

- It is based on a modified version of a pretty old rainyday.js

[rainyday.js] のエフェクトをレイヤーに追加するプラグイン。

- 結構古い[rainyday.js]を改造して作ったプラグインです。画面に雫を表示する。

## Usage 使い方

- Download `rain.js` and `rainyday.js`
- Move the files to your project's plugin folder
- Add this to the beginning of your `first.ks`
  ```
  [o2_loadplugin module="rain.js"]
  ```

- Enable it like this
  ```
  [rain
    layer="base"
    page="fore"
    trail="smudge"
    gravityangle="180"
    preset="(0,2,0.5)(4,4,1)"
    speed="50"
    opaque="true"
  ]
  ```

------

- `rain.js` と `rainyday.js` をダウンロード
- ファイルをプロジェクトの plugin フォルダーに移動
- `first.ks` の最初にこれを追加
  ```
  [o2_loadplugin module="rain.js"]
  ```

- こういう風に起動する
  ```
  [rain
    layer="base"
    page="fore"
    trail="smudge"
    gravityangle="180"
    preset="(0,2,0.5)(4,4,1)"
    speed="50"
    opaque="true"
  ]
  ```

### Parameters 属性

- `layer`
  - The layer for adding raindrop effect
  - 雫を追加するレイヤーを指定する

- `page`
  - fore (default) | back

- `trail`
  - none | drops (default) | smudge
  - Set the trail of the drop
  - 雫の跡のタイプを指定する

- `gravityangle`
  - 0 to 360 (default 180, fall downward)
  - 0 から 360 まで、デファルトは180、下に落ちる
  - The direction of rain drops move
  - 雫の移動方向

- `preset`
  - Default `(0,2,0.5)(4,4,1)`
  - String in this format
    `(min_size, size_delta, probability)(min_size, size_delta, probability)...`
    - min_size = The smallest size of drop
    - size_delta = The largest drop will be `min_size + size_delta`
    - probability = The chance of creating a drop in this size
  - Example: `(2,6,0.3)(3,1,0.5)(5,0,1.0)`
    - This means:
      - 30% of chance creating a rain drop from size 2 to size 8
      - 20% of chance creating a rain drop from size 3 to size 4
      - 50% of chance creating a rain drop of size 5
  - このフォマットの文字列
    `(min_size, size_delta, probability)(min_size, size_delta, probability)...`
    - min_size = 一番小さい水滴のサイズ
    - size_delta = 一番大き水滴のサイズは `min_size + size_delta`
    - probability = 可能性
  - Example: `(2,6,0.3)(3,1,0.5)(5,0,1.0)`
    - This means:
      - 30% の確率がサイズが2から8までの水滴
      - 20% の確率がサイズが3から4までの水滴
      - 50% の確率がサイズが5の水滴

- `speed`
  - Speed of rain drops, default 50
  - 速度、デフォルト 50

- `opaque`
  - Render the layer as an opaque layer, this improve performance, default to true.
  - Set this to false if your layer is not fully opaque. (e.g. When image of the layer has transparent background)
  - レイヤーを不透明キャンバスとしてレンダリングする、パフォーマンスは良くなる、デフォルトはtrue
  - 透明の部分があったらこれをtrueにしてください

[rainyday.js]: https://github.com/maroslaw/rainyday.js