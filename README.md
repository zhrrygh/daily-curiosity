# 好奇日报 · GitHub Pages 版

保留原页面设计、分类、往期与站内中文精读。阅读页静态托管在 GitHub Pages，不需要 ChatGPT 登录。原私人网站继续选编内容、保存反馈。

## 当前状态

已发布：https://zhrrygh.top/daily-curiosity/ 。仓库：https://github.com/zhrrygh/daily-curiosity 。反馈会打开 GitHub Issue 草稿，需要用户登录并确认提交；不会导出原私人反馈记录或个性化编辑说明。

## 本地运行

```sh
npm ci
npm run dev
npm test
npm run build
```

## 发布与每日更新

1. 将本项目推送到目标 GitHub 仓库的 main 分支。
2. 在 Settings → Pages 选择 GitHub Actions。
3. 在仓库 Actions Secrets 设置 SOURCE_SITE_TOKEN（原私人网站支持的服务访问令牌）。不要放入源代码、公开变量或浏览器。
4. 运行 Publish daily curiosity。没有令牌的手动首次发布仅使用已提交的首期快照；定时同步缺少令牌会明确失败。

现有云端选编每天北京时间 08:00 开始。Pages 工作流在 08:10、08:30 同步，另每六小时重试；GitHub 定时工作流可能延迟，因此不保证 08:00 整即完成发布。同步只读取日报数据，失败不会替换已部署页面。工作流先检验全部日报，再构建与发布。仓库使用相对资源路径，支持 username.github.io/repository/ 子目录。

普通 GitHub Pages 页面公开可访问。用户已确认日报和 GitHub 反馈公开。反馈通过公开 GitHub Issues 提交，仅仓库所有者提交的意见会同步进个人选编偏好。其他访客的 Issue 不会影响你的偏好。同步使用受保护的 Actions Secret，不向网页暴露凭据。
