import { createApp } from 'vue';
import App from './App.vue';
import * as Text from './test.txt';
document.body.append(Text);
const app = createApp(App);
// test comments
app.mount('#app');
