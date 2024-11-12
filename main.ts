// 导入所需的 Obsidian API 组件
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// 定义插件主类，继承自 Obsidian Plugin 类
export default class ShowViewStatusPlugin extends Plugin {

	// 插件加载时执行
	async onload() {
		// 注册布局变更事件监听器 打开新文件时会跟新
		this.registerEvent(
			this.app.workspace.on('layout-change', () => {
				this.updateViewStatus();
			})
		);

		// 初始化时更新视图状态 不用操作立即
		this.updateViewStatus();
	}

	// 更新视图状态的私有方法
	private updateViewStatus() {
		// 获取所有 markdown 类型的叶子视图
		const leaves = this.app.workspace.getLeavesOfType('markdown');
		
		// 遍历每个叶子视图
		leaves.forEach(leaf => {
			const view = leaf.view as MarkdownView;
			const containerEl = view.containerEl;
			
			// 查找视图中的"更多选项"按钮
			const moreOptionsBtn = containerEl.querySelector('.view-action[aria-label="更多选项"]');
			
			// 移除已存在的状态指示器
			containerEl.querySelectorAll('.view-status-indicator').forEach(el => el.remove());
			
			if (moreOptionsBtn) {
				// 创建新的状态指示器
				const statusBtn = document.createElement('div');
				statusBtn.addClass('view-status-indicator');
				
				// 获取当前视图状态
				const viewState = view.getState() as {
					mode: string;
					source: boolean;
				};
				
				// 确定状态文本
				let modeClass = 'default-mode';  // 默认值
				let statusText = '未知模式';     // 默认值
				if (viewState.mode === "preview") {
					modeClass = 'preview-mode';
					statusText = '阅读模式';
				} else if (viewState.mode === 'source' && viewState.source) {
					modeClass = 'source-mode';
					statusText = '源码模式';
				} else if (viewState.mode === 'source' && !viewState.source) {
					modeClass = 'live-mode';
					statusText = '实时模式';
				}
				
				// 设置按钮文本并插入
				statusBtn.setText(statusText);
				statusBtn.addClass(modeClass);
				moreOptionsBtn.parentElement?.insertBefore(statusBtn, moreOptionsBtn);
			}
		});
	}

	// 插件卸载时执行
	onunload() {
		// 移除所有状态指示器
		document.querySelectorAll('.view-status-indicator').forEach(el => el.remove());
	}
}
