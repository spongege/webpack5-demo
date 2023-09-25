import { createSSRApp } from 'vue';

import App from './App.vue';

// 客户端版本会立即调用 mount 接口，将组件挂载到页面上；而服务端版本只是 export 一个创建应用的工厂函数。
export default () => {
	return createSSRApp(App);
};
