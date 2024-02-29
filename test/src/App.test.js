import { render, screen } from '@testing-library/react'; // 导入React测试库中的render和screen函数
import App from './App'; // 导入要测试的App组件

test('renders learn react link', () => {
  render(<App />); // 渲染App组件
  const linkElement = screen.getByText(/learn react/i); // 使用screen.getByText函数获取文本内容为'learn react'的元素
  expect(linkElement).toBeInTheDocument(); // 断言linkElement元素存在于文档中
});
