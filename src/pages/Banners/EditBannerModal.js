import React from 'react'
import {Modal, Form, Upload, Icon, message, Input, Switch, InputNumber} from 'antd'
import { isAuthenticated } from '../../utils/session'
import {del, post, put,get} from "../../utils/ajax";
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
        img:{},
        projects:[]
    };

    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                console.log("values==="+JSON.stringify(values))
                this.editProject(values)

            }
        })
    };
    onCancel = () => {
        this.props.onCancel();
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
            // await this.queryProject()
            console.log("已进入editProject方法内，接下来调用getProjects方法")
            // await this.props.getProjects()
            this.props.getProjects()
            this.onCancel()
            // await this.getProjects()
            // this.props.onCancel()
        }
    };

    /***
     * 根据projectId查询项目详情
     */
    queryProject = async () =>{
        const projectId = this.props.form.getFieldValue('id');
        console.log("id=="+projectId)
        const res = await get('/project/queryById',{
            // ...values,
            projectId: projectId
        });
        if(res.code === 0) {
            message.success("查询项目成功")
            console.log("res==="+JSON.stringify(res))
            this.setState({
                projects:res.data
            })
            // return res;
        }else {
            message.error("查询项目失败")
        }
    }

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
                                validateFirst: getFieldValue('tester'),//当某一校验规则不通过时，是否停下剩下的校验规则
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
                                initialValue: true,
                                valuePropName: 'checked'
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
