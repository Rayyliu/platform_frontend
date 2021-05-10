import React, { Component } from 'react';
import {Modal, Form, Input, message, Upload, Icon, Switch, InputNumber,Select} from 'antd'
import {del, get, getDataUrl, post, postDataUrl} from '../../utils/ajax'
import {isAuthenticated} from "../../utils/session";
const {Option}=Select
const {TextArea} = Input

@Form.create()
class CreatePlanModal extends Component {
    state = {
        plans:[],
        projects:[],
        env:[],
        project:'',
        cases:[],

        uploading: false,
        img:{}
    };

    componentDidMount() {
        // this.queryPlan()
        // this.queryProject();
        // this.queryEnv()
    }


    /***
     * 查询所有测试计划详情
     */
    queryPlan = async () =>{
        const res = await get('/plan/queryAll')
        if(res.code === 0) {
            this.setState({
                plans:res.data
            })
        }else {
            message.error("调用queryDistProject接口失败，查询项目失败")
        }
    }

    /***
     * 去重查询项目名称
     */
    queryProject = async () =>{
        const res = await get('/project/queryDistProject')
        if(res.code === 0) {
            this.setState({
                projects:res.data
            })
        }else {
            message.error("调用queryDistProject接口失败，查询项目失败")
        }
    }


    /***
     * 去用例执行环境
     */
    queryEnv = async () =>{
        const res = await getDataUrl('/env/queryAllEnv')
        if(res.code === 0) {
            this.setState({
                env:res.data
            })
        }else {
            message.error("调用queryEnv接口失败，查询项目失败")
        }
    }

    /***
     * 获取select值
     */
    getValue=(value)=>{
        console.log("value=="+JSON.stringify(value))
        // this.setState({
        //     project:value
        // },function () {
        //     console.log("project==="+JSON.stringify(this.state.project))
        // })
        this.getProjectToCase(value)
    }

    /***
     * 查询项目对应的测试用例
     */
    getProjectToCase=async(value)=>{
        console.log("value==="+JSON.stringify(value))
        const res=await getDataUrl('/execute/queryByProject',{
            projectName:value
        });
        console.log("result==="+JSON.stringify(res.data))
        if(res.code==0){
            message.success("查询用例成功")
            this.setState({
                cases:res.data
            })
        }
    }

    onCancel = () => {
        this.props.form.resetFields();
        this.props.toggleVisible(false);
    };
    handleSubmit = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.createPlans(values)
            }
        })
    };
    createPlans = async (values) => {
        console.log("values==="+JSON.stringify(values))
        values.planContent=JSON.stringify(values.planContent)
        const res = await postDataUrl('/plan/add', {
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

        const {projects,env,cases} = this.state
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
                title='创建新测试计划'
                centered
                onOk={this.handleSubmit}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'计划名称'}>
                        {getFieldDecorator('planName', {
                            initialValue: '',
                            rules: [{ required: true, message: '计划名称必填'}],
                        })(
                            <Input
                                placeholder="请输入计划名称"
                            />
                        )}
                    </Form.Item>

                    <Form.Item label={'所属项目'}>
                        {getFieldDecorator('project', {
                            initialValue: '',
                            rules: [{ required: true, message: '计划所属项目必填'}],
                        })(
                            <Select onChange={this.getValue}>
                                {projects.map((item=>{
                                    return <Option value={item}>{item}</Option>
                                }))}
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item label={'执行环境'}>
                        {getFieldDecorator('env', {
                            initialValue: '',
                            rules: [{ required: true, message: '执行环境模块必填'}],
                        })(
                            <Select>
                                {env.map((item=>{
                                    return <Option value={item}>{item}</Option>
                                }))}
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item label={'计划描述'}>
                        {getFieldDecorator('planDescription', {
                            initialValue: '',
                            rules: [{ required: true, message: '计划描述必填'}],
                        })(
                            <TextArea
                                placeholder="简单描述计划涉及内容"
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={'计划内容'}>
                        {getFieldDecorator('planContent', {
                            // initialValue: '',
                            rules: [{ required: true, message: '用例列表必选'}],
                        })(
                            <Select mode="multiple" placeholder="Please select">
                                {cases.map(item=>{
                                    return <Option value={item} >{item}</Option>
                                })}
                            </Select>
                        )}
                    </Form.Item>

                    {/*<Form.Item label={'是否启用'}>*/}
                        {/*{getFieldDecorator('valid', {*/}
                            {/*initialValue: true*/}
                        {/*})(*/}
                            {/*<Switch checkedChildren="启用" unCheckedChildren="废弃" defaultChecked/>*/}
                        {/*)}*/}
                    {/*</Form.Item>*/}
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


export default CreatePlanModal;
