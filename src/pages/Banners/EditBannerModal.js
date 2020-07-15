import React from 'react'
import {Modal, Form, Upload, Icon, message, Input, Switch, InputNumber} from 'antd'
import { isAuthenticated } from '../../utils/session'
import {del, post, put} from "../../utils/ajax";
import {createFormField} from '../../utils/util'


const form = Form.create({
    //表单回显
    mapPropsToFields(props) {
        return createFormField(props.project)
    }
});

@form
class EditBannerModal extends React.Component {
    state = {
        uploading: false,
        img:{}
    };
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.editProject(values)
            }
        })
    };
    onCancel = () => {
        this.props.onCancel();
        //删除图片
        if (this.state.img.key && this.state.img.key.indexOf('http') === -1 ){
            del('/upload', {key: this.state.img.key});
        }
    };
    editProject = async (values) => {
        const id = this.props.form.getFieldValue('id');
        const res = await post('/project/edit', {
            ...values,
            id: id
        });
        if (res.code === 0) {
            message.success('修改成功');
            // this.setState({
            //     img:{}
            // });
            this.props.onCancel()
        }
    };

    /***
     * 根据projectId查询项目详情
     */
    // queryProject = asyn (values) =>{
    //     const id = this.props.getFieldValue('id');
    //     const res = await get('/project/queryById',{
    //         ...values,
    //         id: id
    //     });
    // }

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
        const { uploading } = this.state;
        const { getFieldDecorator,getFieldValue} = this.props.form;
        const url = getFieldValue('url');
        const formItemLayout = {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 15
            },
        };
        //图片上传
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
                    message.success('上传头像成功')
                } else if (info.file.status === 'error') {
                    this.setState({
                        uploading: false
                    });
                    message.error(info.file.response.message || '上传头像失败')
                }
            }
        };
        return (
            <Modal
                visible={this.props.visible}
                onCancel={this.onCancel}
                width={550}
                centered
                onOk={this.handleOk}
                title='修改项目'
            >
                <div style={{ height: '50vh', overflow: 'auto' }}>
                    <Form {...formItemLayout}>
                        <Form.Item label={'项目名称'}>
                            {getFieldDecorator('projectName', {
                                rules: [{ required: true, message: '请输入项目名称' }],
                                initialValue: getFieldValue('projectName'),
                            })(
                                <Input
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="项目描述">
                            {getFieldDecorator('projectDescription', {
                                initialValue: getFieldValue('projectDescription'),
                            })
                            (
                                <Input
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="项目模块">
                            {getFieldDecorator('projectModule', {
                                initialValue: getFieldValue('projectModule'),
                            })
                            (
                                <Input/>
                            )}
                        </Form.Item>
                        <Form.Item label="测试负责人">
                            {getFieldDecorator('tester', {
                                validateFirst: getFieldValue('tester'),
                                rules: [
                                    { required: getFieldValue('isLink'), message: '地址不能为空' }
                                ],
                            })
                            (
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="是否启用">
                            {getFieldDecorator('valid', {
                                validateFirst: true,
                                initialValue: 0
                            })
                            (
                                <Switch checkedChildren="启用" unCheckedChildren="废弃" defaultChecked/>
                            )}
                        </Form.Item>
                    </Form>
                </div>
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

export default EditBannerModal
