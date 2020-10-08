import React, { useState, useEffect } from 'react'
import { Input, List, Divider, message, Tag, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import './App.less'
import {
  formatTimeStamp,
  getDataFromLocalStorage,
  setDataToLocalStorage,
} from './utils/utils'

import TaskModal from './components/taskModal/taskModal'
import Footer from './components/footer/footer'

const { Search } = Input
const { confirm } = Modal

const App = () => {
  const PERSISDATA_KEY = 'PERSISDATA_KEY' // 持久化数据key
  const [data, setData] = useState([])
  const [inputData, setInputData] = useState('')
  const [maxId, setMaxId] = useState(0)
  const [visible, setVisible] = useState(false)
  const [editItem, setEditItem] = useState({})

  useEffect(() => {
    // 获取localStorage下的所有数据
    const storeData = getDataFromLocalStorage(PERSISDATA_KEY)
    // 获取到data中的最大ID
    const curMaxId = Math.max(...storeData.map((item) => item.id))
    if (storeData[0]?.taskName) setData(storeData)
    setMaxId(curMaxId)
  }, [])

  const addItem = (target) => {
    if (!target) {
      message.error('人不能没有目标根咸鱼有什么区别，请填写您的目标')
      return
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i].taskName === target) {
        message.warning('您的目标已记录，请勿重复添加')
        return
      }
    }

    const storeData = getDataFromLocalStorage(PERSISDATA_KEY)
    // 获取到data中的最大ID
    const curMaxId = Math.max(...storeData.map((item) => item.id))
    let id = parseInt(1 + curMaxId) ? parseInt(1 + curMaxId) : 0

    const newTarget = {
      id,
      taskName: target,
      taskTime: formatTimeStamp(new Date().valueOf()),
      isOk: false, // 标记目标是否完成
      taskInfo: '', // 任务说明
    }
    // 得到localStorage的所有数据后，添加当前项，在保存到localStorage中
    setMaxId(curMaxId)
    const newData = data.concat(newTarget)
    setData(newData)
    // 将data进行持久化
    setDataToLocalStorage(PERSISDATA_KEY, newData)
    setInputData('')
  }

  // remove id of  item in list
  const removeItem = (e) => {
    const { id: itemId } = e.target
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <p>确定永久删除该信息吗?</p>,
      onOk() {
        // 得到目标的id，过滤掉这个项
        const newData = data.filter((item, index) => item.id !== +itemId)
        setData(newData)
        // 持久化数据，跟新视图
        setDataToLocalStorage(PERSISDATA_KEY, newData)
      },
      onCancel() {
        return false
      },
    })
  }

  const removeDoneTask = () => {
    const unDoneTask = data.filter((item) => item.isOk)
    if (!data.length) {
      message.warning('还没有任务，去建立新任务吧!')
      return
    }
    if (!unDoneTask.length) {
      message.warning('已经清空所有已完成任务')
      return
    }
    const newData = data.filter((item) => !item.isOk)
    setData(newData)
    // 持久化数据，跟新视图
    setDataToLocalStorage(PERSISDATA_KEY, newData)
  }

  const removeAllTask = () => {
    if (!data.length) {
      message.warning('还没有任务，去建立新任务吧!')
      return
    }
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <p>确定永久删除该信息吗?</p>,
      onOk() {
        localStorage.clear()
        const storeData = getDataFromLocalStorage(PERSISDATA_KEY)
        const maxId = Math.max(...storeData.map((item) => item.id))
        setData([])
        setMaxId(maxId)
      },
      onCancel() {
        return false
      },
    })
  }

  const handleVisible = (flag) => {
    setVisible(flag)
  }
  const handleCancel = () => {
    setVisible(false)
  }

  // changeisOk 改变是否完成状态
  const changeIsOk = (e) => {
    const { id, checked } = e.target
    // 得到目标的id，更改isOK为相反值
    const newData = data.map((item, index) => {
      if (item.id === +id) {
        item.isOk = checked
      }
      return item
    })
    setData(newData)
    // 持久化数据，跟新视图
    setDataToLocalStorage(PERSISDATA_KEY, newData)
  }

  const editModal = (e) => {
    const { id: itemId } = e.target
    // 得到要编辑的item
    const storeData = getDataFromLocalStorage(PERSISDATA_KEY)
    const [eitem] = storeData.filter((item) => item.id === +itemId)

    setEditItem(eitem)
    setVisible(true)
  }

  const handleFormData = (editItem) => {
    const { id } = editItem
    // 更改data里的数据
    const checkEles = document.querySelectorAll('input[type="checkbox"]')
    const newData = data.map((item) => {
      if (item.id === +id) {
        for (let checkEle of checkEles) {
          if (+checkEle.id === id) {
            checkEle.checked = editItem.isOk
          }
        }
        return editItem
      }
      return item
    })

    // 持久化数据，跟新视图
    setData(newData)
    setDataToLocalStorage(PERSISDATA_KEY, newData)
  }

  const doneLength = data.filter((item) => item.isOk).length

  return (
    <div className="app">
      <Search
        placeholder="请输入您的目标"
        enterButton="确定目标"
        size="large"
        allowClear={true}
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
        onSearch={addItem}
      />
      <Divider orientation="left"> 目标完成情况 </Divider>
      <List
        size="large"
        footer={
          <Footer
            doneLength={doneLength}
            dataLength={data.length}
            removeAllTask={removeAllTask}
            removeDoneTask={removeDoneTask}
          />
        }
        bordered
        id="target-list"
        dataSource={data}
        renderItem={(item) =>
          item.taskName && (
            <List.Item
              key={item.id}
              extra={
                <p>
                  <span
                    className="item-oper"
                    title="任务详情 / 编辑任务 "
                    id={item.id}
                    onClick={(e) => editModal(e)}
                  >
                    任务详情 / 编辑任务
                  </span>
                  <span
                    className="item-oper"
                    title="点击删除该条任务 "
                    id={item.id}
                    onClick={(e) => removeItem(e)}
                  >
                    删除任务
                  </span>
                </p>
              }
            >
              <List.Item.Meta
                avatar={
                  <input
                    type="checkbox"
                    id={item.id}
                    defaultChecked={item.isOk}
                    className="isOk"
                    onClick={(e) => changeIsOk(e)}
                  />
                }
                title={<strong className="item-title">{item.taskName}</strong>}
                description={
                  <span>
                    建立任务时间为: {item.taskTime}
                    &nbsp; &nbsp;<Tag>友情提示：完成记得打钩哦!</Tag>
                  </span>
                }
              />
            </List.Item>
          )
        }
      />
      <TaskModal
        editItem={editItem}
        visible={visible}
        handleVisible={handleVisible}
        handleCancel={handleCancel}
        handleFormData={handleFormData}
      />
    </div>
  )
}

export default App
