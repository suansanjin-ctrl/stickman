# 火柴人格斗（纯前端静态网页版）

一个可直接部署为静态站点的 2D 横版平台火柴人格斗小游戏 MVP。

## 特性
- 开始页 / 设置页 / 战斗页 / 结算页完整流程。
- 玩家 vs AI 单机战斗，开局 3-2-1 倒计时。
- 平台跳跃 + 重力 + 断层（掉落判负）+ 简单碰撞。
- 攻击命中扣血、击退、受击闪烁。
- AI 自动接近、近身攻击、尝试跳平台追击。
- 支持 iPad/触屏虚拟摇杆 + 攻击/跳跃按钮。
- 支持电脑键盘：WASD/方向键移动，J 攻击，K 跳跃，Enter 开始。
- 角色设置（颜色、武器、血量、攻击、速度、AI 难度）保存到 localStorage。
- Canvas 根据设备像素比适配，iPad 横屏画面更清晰。

## 项目目录结构

```text
stickman/
├─ index.html
├─ README.md
└─ src/
   ├─ js/
   │  ├─ ai.js
   │  ├─ config.js
   │  ├─ entities.js
   │  ├─ game.js
   │  ├─ input.js
   │  ├─ main.js
   │  ├─ physics.js
   │  ├─ renderer.js
   │  └─ storage.js
   └─ styles/
      └─ main.css
```

## 本地运行

### 方式 1：直接打开
双击 `index.html` 即可。

### 方式 2：本地静态服务器（推荐）
在项目目录执行：

```bash
python3 -m http.server 8080
```

浏览器打开：`http://localhost:8080`

## 开发阶段对应实现
1. 页面结构 + 主循环：`index.html`, `main.js`
2. 移动/跳跃/攻击/血条：`game.js`, `entities.js`, `input.js`
3. AI：`ai.js`
4. 地图与碰撞：`config.js`, `physics.js`, `renderer.js`
5. 开始页/设置页/结算页：`index.html`, `main.css`, `main.js`
6. iPad + 电脑适配：`main.css`, `input.js`, `main.js`

## 说明
- 无后端、无登录、无数据库。
- 配置仅保存在浏览器本地存储。
- 可直接部署到任意静态托管平台（如 GitHub Pages / Vercel 静态站点）。
