import React, { Component } from 'react';
import {Modal, Form, Input, message, Upload, Icon, Switch, InputNumber} from 'antd'
import {del, post} from '../../utils/ajax'
import {isAuthenticated} from "../../utils/session";

@Form.create()
class CreateUserModal extends Component {
    state = {
        uploading: false,
        img:{}
    };
    onCancel = () => {
        this.props.form.resetFields();
        this.props.toggleVisible(false);
    };
    handleSubmit = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.createProjects(values)
            }
        })
    };
    createProjects = async (values) => {
        const res = await post('/project/add', {
            ...values
        });
        if (res.code === 0) {
            message.success('新增成功');
            this.onCancel()
        }
    };
    /**
     * 转换上传组件表单的值
     */
    _normFile = (e) => {
        if (e.file.response && e.file.response.data) {
            return e.file.response.data.url
        } else {
            return ''
        }
    };
    render() {
        const uploadProps = {
            name: "file",
            listType: "picture-card",
            headers: {
                Authorization: `${isAuthenticated()}`,
            },
            action: `${process.env.REACT_APP_BASE_URL}/upload?type=0`,
            showUploadList: false,
            accept: "image/*",
            onChange: (info) => {
                if (info.file.status !== 'uploading') {
                    this.setState({
                        uploading: true
                    })
                }
                if (info.file.status === 'done') {
                    this.setState({
                        uploading: false,
                        img: info.file.response.data
                    });
                    message.success('上传图片成功')
                } else if (info.file.status === 'error') {
                    this.setState({
                        uploading: false
                    });
                    message.error(info.file.response.message || '上传图片失败')
                }
            }
        };
        const { uploading } = this.state;
        const { visible } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const  url = getFieldValue('url');
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 },
        };
        return (
            <Modal
                onCancel={this.onCancel}
                visible={visible}
                width={550}
                title='创建新项目'
                centered
                onOk={this.handleSubmit}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'项目名称'}>
                        {getFieldDecorator('projectName', {
                            initialValue: '',
                            rules: [{ required: true, message: '项目名称必填'}],
                        })(
                            <Input
                                placeholder="请输入项目名称"
                            />
                        )}
                    </Form.Item>

                    <Form.Item label={'项目描述'}>
                        {getFieldDecorator('projectDescription', {
                            initialValue: '',
                            rules: [{ required: true, message: '项目描述必填'}],
                        })(
                            <Input
                                placeholder="简单描述项目涉及内容"
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={'项目模块'}>
                        {getFieldDecorator('projectModule', {
                            initialValue: '',
                            rules: [{ required: true, message: '项目模块必填'}],
                        })(
                            <Input
                                placeholder="项目模块"
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={'测试负责人'}>
                        {getFieldDecorator('tester', {
                            initialValue: '',
                            rules: [{ required: true, message: '项目模块必填'}],
                        })(
                            <Input
                                placeholder="测试负责人"
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={'是否启用'}>
                        {getFieldDecorator('isValid', {
                            initialValue: true
                        })(
                            <Switch checkedChildren="启用" unCheckedChildren="废弃" defaultChecked/>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

const styles = {
    urlUploader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 250,
        height: 150,
        backgroundColor: '#fff'
    },
    icon: {
        fontSize: 28,
        color: '#999'
    },
    url: {
        maxWidth: '100%',
        maxHeight: '100%',
    },
};


export default CreateUserModal;
