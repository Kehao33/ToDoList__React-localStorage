import React, { useState, useEffect, createRef } from 'react'
import { Input, List, Divider, message, Tag, Modal, Button } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import './App.less'
import { formatTimeStamp } from './utils/utils'
import TaskModal from './components/taskModal/taskModal'

const { Search } = Input
const { confirm } = Modal

function App() {
  const PERSISDATA_KEY = 'PERSISDATA_KEY' // 持久化数据key
  const [data, setData] = useState([])
  const [inputData, setInputData] = useState('')
  const [maxId, setMaxId] = useState(0)
  const [visible, setVisible] = useState(false)
  const [editItem, setEditItem] = useState({})
  const checkboxWidthIsOk = createRef()

  useEffect(() => {
    // 获取localStorage下的所有数据
    const storeData = getDataFromLocalStorage(PERSISDATA_KEY)
    // 获取到data中的最大ID
    const maxId = Math.max(...storeData.map((item) => item.id))
    if (storeData[0]?.taskName) setData(storeData)
    else setData([])
    console.log('maxId:', maxId)
    setMaxId(maxId)
  }, [])

  const addItem = (target) => {
    if (!target) {
      message.error('人不能没有目标根咸鱼有什么区别，请填写您的目标')
      return
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i].taskName === target) {
        message.warning('您的目标已经记录，请勿重复添加')
        return
      }
    }

    const newTarget = {
      taskName: target,
      taskTime: formatTimeStamp(new Date().valueOf()),
      id: maxId + 1,
      isOk: false, // 标记目标是否完成
      taskInfo: '', // 任务说明
    }
    // 得到localStorage的所有数据后，添加当前项，在保存到localStorage中
    setMaxId((maxId) => maxId + 1)
    console.log('maxId:', maxId)
    const newData = data.concat(newTarget)
    setData(newData)
    // 将data进行持久化
    setDataToLocalStorage(PERSISDATA_KEY, newData)
    const storeData = getDataFromLocalStorage(PERSISDATA_KEY)
    setInputData('')
  }

  // remove id of  item in list
  const removeItem = (itemId) => {
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
        console.log('Cancel')
        return false
      },
    })
  }

  const removeDoneTask = () => {
    const unDoneTask = data.filter((item) => item.isOk)
    if(!data.length){
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

  const handleVisible = (flag) => {
    setVisible(flag)
  }
  const handleCancel = () => {
    setVisible(false)
  }
  // 根据key从本地get Data
  const getDataFromLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key)) || [{ id: 0 }]
  }
  // 根据key将data设置到本地
  const setDataToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  }
  // changeisOk 改变是否完成状态
  const changeIsOk = (e) => {
    const id = e.target.id
    // 得到目标的id，更改isOK为相反值
    const newData = data.map((item, index) => {
      if (item.id === +id) {
        item.isOk = !item.isOk
      }
      return item
    })
    setData(newData)
    // 持久化数据，跟新视图
    setDataToLocalStorage(PERSISDATA_KEY, newData)
  }

  const editModal = (itemId) => {
    // 得到要编辑的item
    const storeData = getDataFromLocalStorage(PERSISDATA_KEY)
    const [eitem] = storeData.filter((item) => item.id === +itemId)
    setEditItem(eitem)

    setVisible(true)
  }

  const handleFormData = (editItem) => {
    const { id } = editItem
    // 更改data里的数据
    const newData = data.map((item) => {
      if (item.id === +id) {
        checkboxWidthIsOk.current.checked = editItem.isOk
        return editItem
      }
      return item
    })
    // 持久化数据，跟新视图
    console.log('newData', newData)
    setData(newData)
    setDataToLocalStorage(PERSISDATA_KEY, newData)
    // setVisible(false)
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
          <div>
            <span>
              一共有 <Tag color="#2db7f5">{data.length}</Tag>个任务, 已完成
              &nbsp;
              <Tag color="#87d068">{doneLength}</Tag>
              个任务, 未完成完成 &nbsp;
              <Tag color="#f50">{data.length - doneLength}</Tag>
              个任务
            </span>
            <Button
              type="danger"
              style={{ float: 'right', bottom: 8 }}
              onClick={removeDoneTask}
            >
              清除已完成任务
            </Button>
          </div>
        }
        style={{
          width: '88%',
        }}
        bordered
        dataSource={data}
        renderItem={(item) =>
          item.taskName && (
            <List.Item
              key={item.id}
              extra={
                <p>
                  <span
                    style={{
                      color: '#00a',
                      cursor: 'pointer',
                      marginRight: 10,
                    }}
                    title="任务详情 / 编辑任务 "
                    id={item.id}
                    onClick={(e) => editModal(e.target.id)}
                  >
                    任务详情 / 编辑任务
                  </span>
                  <span
                    style={{
                      color: '#00a',
                      cursor: 'pointer',
                    }}
                    title="点击删除该条任务 "
                    id={item.id}
                    onClick={(e) => removeItem(e.target.id)}
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
                    ref={checkboxWidthIsOk}
                    onClick={(e) => changeIsOk(e)}
                  />
                }
                title={
                  <strong style={{ fontSize: 20, fontWeight: 700 }}>
                    {item.taskName}
                  </strong>
                }
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
