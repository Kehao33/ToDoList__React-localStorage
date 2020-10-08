import React from 'react'
import { Tag, Button } from 'antd'
import PropTypes from 'prop-types'

const Footer = (props) => {
  const { doneLength, dataLength, removeAllTask, removeDoneTask } = props
  return (
    <div>
      <span>
        一共有 <Tag color="#2db7f5"> {dataLength} </Tag>个任务, 已完成 &nbsp;
        <Tag color="#87d068"> {doneLength} </Tag>
        个任务, 未完成完成 &nbsp;
        <Tag color="#f50"> {dataLength - doneLength} </Tag>
        个任务
      </span>
      <Button type="danger" className="remove-btn" onClick={removeDoneTask}>
        清除已完成任务
      </Button>
      <Button type="primary" className="remove-btn" onClick={removeAllTask}>
        清除所有任务
      </Button>
    </div>
  )
}

Footer.protoTypes = {
  doneLength: PropTypes.number.isRequired,
  dataLength: PropTypes.number.isRequired,
  removeAllTask: PropTypes.func.isRequired,
  removeDoneTask: PropTypes.func.isRequired,
}

export default Footer
