import React from 'react'; // 导入React模块
import ReactDOM from 'react-dom/client'; // 导入ReactDOM模块的client接口
import './index.css'; // 导入样式文件
import App from './App'; // 导入App组件
import reportWebVitals from './reportWebVitals'; // 导入reportWebVitals函数

const root = ReactDOM.createRoot(document.getElementById('root')); // 创建根React根节点
root.render( // 在根节点上渲染组件
  <React.StrictMode> {/* 使用React.StrictMode组件包裹App组件，启用严格模式 */}
    <App /> {/* 渲染App组件 */}
  </React.StrictMode>
);

// 如果你想要在你的应用中开始测量性能，请传递一个函数来记录结果（例如：reportWebVitals(console.log)）
// 或发送到分析端点。了解更多信息：https://bit.ly/CRA-vitals
reportWebVitals(); // 调用reportWebVitals函数，测量应用的性能
