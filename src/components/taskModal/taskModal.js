import { Input, Modal, Form, Switch } from 'antd'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

const TaskModal = (props) => {
  const [form] = Form.useForm()
  const {
    editItem,
    visible,
    handleFormData,
    handleVisible,
    handleCancel,
  } = props
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  }
  const handleOk = () => {
    form.submit()
  }
  // edit item
  const onFinish = (editItem) => {
    handleFormData(editItem)
    handleVisible(false)
  }

  // console.log('editItem',props)
  useEffect(() => {
    form.setFieldsValue({
      id: editItem?.id,
      taskName: editItem?.taskName,
      taskTime: editItem?.taskTime,
      isOk: editItem?.isOk,
      taskInfo: editItem?.taskInfo || '暂时没有任务说明哦',
    })
  }, [editItem, form, visible])

  return (
    <Modal
      centered={true}
      getContainer={false}
      title="任务详情 / 编辑任务  "
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form {...layout} onFinish={onFinish} form={form}>
        <Form.Item
          label="任务名称"
          name="taskName"
          rules={[
            {
              required: true,
              message: '任务名称不能为空',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="定制时间"
          name="taskTime"
          rules={[
            {
              required: true,
              message: '定制时间不能为空',
            },
          ]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item label="完成状态" name="isOk" valuePropName="checked">
          <Switch checkedChildren="完成" unCheckedChildren="未完成" />
        </Form.Item>
        <Form.Item label="任务ID" name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="任务说明" name="taskInfo">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}

TaskModal.protoTypes = {
  editItem: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  handleFormData: PropTypes.func.isRequired,
  handleVisible: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
}

export default TaskModal
