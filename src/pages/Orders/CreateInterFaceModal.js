import React, { Component } from 'react';
import {Modal, Form, Input, message, Switch, InputNumber, Select} from 'antd'
import {get, post} from '../../utils/ajax'

@Form.create()
class CreateInterFaceModal extends Component {

    state = {
        projects:[]
    }

    componentDidMount() {
        this.queryProject();
    }
    onCancel = () => {
        this.props.form.resetFields();
        this.props.toggleVisible(false);
    };
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.createTrade(values)
            }
        })
    };

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



    createTrade = async (values) => {
        const res = await post('/env/add', {
            ...values
        });
        if (res.code === 0) {
            message.success('新增成功');
        }
        this.onCancel()
    };
    render() {
        const {projects} = this.state;
        const { visible } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 },
        };
        return (
            <Modal
                onCancel={this.onCancel}
                visible={visible}
                width={550}
                title='新增接口'
                centered
                onOk={this.handleOk}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'接口名称'}>
                        {getFieldDecorator('interfaceName',{
                            validateFirst: true,
                            rules: [
                                { required: true, message: '接口名称不能为空' }
                            ]
                        })(
                            <Input
                                maxLength={32}
                                placeholder="请输入测试环境"
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={'所属项目'}>
                        {getFieldDecorator('project',{
                            validateFirst: true,
                            rules: [
                                { required: true, message: 'url不能为空' }
                            ]
                        })(
                            <Input
                                maxLength={32}
                                placeholder="请输入rul"
                            />
                        )}
                    </Form.Item>

                    <Form.Item label={'接口路径'}>
                        {getFieldDecorator('path',{
                            validateFirst: true,
                            rules: [
                                { required: true, message: 'url不能为空' }
                            ]
                        })(
                            <Input
                                maxLength={32}
                                placeholder="请输入rul"
                            />
                        )}
                    </Form.Item>

                    <Form.Item label={'请求方式'}>
                        {getFieldDecorator('mode',{
                            validateFirst: true,
                            rules: [
                                { required: true, message: 'url不能为空' }
                            ]
                        })(
                            <Input
                                maxLength={32}
                                placeholder="请输入rul"
                            />
                        )}
                    </Form.Item>

                    {/*<Form.Item label={'端口号'}>*/}
                    {/*{getFieldDecorator('port', {*/}
                    {/*validateFirst: true,*/}
                    {/*rules: [*/}
                    {/*{ required: true, message: '端口号不能为空' }*/}
                    {/*],*/}
                    {/*initialValue : "",*/}
                    {/*})(*/}
                    {/*<InputNumber placeholder={"8080"}/>*/}
                    {/*)}*/}
                    {/*</Form.Item>*/}
                    <Form.Item label={'所属项目'}>
                        {getFieldDecorator('project', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '项目不能为空' }
                            ],
                            initialValue : "",
                        })(
                            <Select placeholder="请选择" style={{width:"29%"}}>
                                {projects.map((item) => {
                                    return <option value={item}>{item}</option>})}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label={'环境描述'}>
                        {getFieldDecorator('envDescription', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '环境描述不能为空' }
                            ],
                            initialValue : "",
                        })(
                            <Input/>
                        )}
                    </Form.Item>

                </Form>
            </Modal>
        );
    }
}

export default CreateInterFaceModal;
