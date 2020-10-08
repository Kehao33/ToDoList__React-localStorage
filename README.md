#### 运行

#### git clone git@github.com:Kehao33/ToDoList\_\_React-localStorage.git

###### 安装依赖： yarn install / npm install

###### 启动应用： npm start

##### Objective

- Write a web app to manage a To-Do List

##### Requirements

- Allows a user to manage a To-Do list (CRUD)
- View To-Do items
- Add a new To-Do item to the list
- Edit a To-Do item
- Remove a To-Do from the list
- Persist data to storage
- When page is refreshed, list will not be reset
- Persist using either HTML5 web storage, or using Node.js backend

##### Specifications

- Write using React and JavaScript
- Design using Ant Design UI components
- Follow proper code styles (e.g. Airbnb Javascript style guide)
- Use static type checking, e.g. Typescript, Flow, Proptypes
- Write unit tests, e.g, Jest, react-testing-library

##### Submission Guidelines

- Application should be runnable using npm start command
- Please host code in a public repository on GitHub

### DEMO 总结

1. useState 更新后不能够获取值，导致持久化数据的时候没有将最后条信息添加到 localStorage 中

2. antd 组件是封装的，所以导致获取元素上的属性的有问题

3. 不要遗忘掉了"原生"的力量
4. 元素上的属性类型是string类型的，==，=== 使用的时候应该think think

```js
// HOOKS 中useState的问题：更新后不能够立即获取值
// 原因：useState必须要执行完react整个生命周期才会获取最新值
// 解决方式，保留更新后的值或者使用useRef等方式代替
setData((data) => data.concat([newTarget]))
// 此处打印的data是在未添加newTarget的值
console.log('function data:', data)

// ---------------------------------------------------------------------
const newData = data.concat(newTarget)
setData(newData)
// 此处打印的是连接了newTarget的值
console.log('data', data)
```
