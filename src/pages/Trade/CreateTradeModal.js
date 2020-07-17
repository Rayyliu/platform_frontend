import React, { Component } from 'react';
import {Modal, Form, Input, message, Switch, InputNumber, Select} from 'antd'
import {get, post} from '../../utils/ajax'

@Form.create()
class CreateTradeModal extends Component {

    state = {
        projects:{}
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
            message.success("查询成功")
            console.log("res==="+JSON.stringify(res))
        }else {
            message.error("查询项目失败")
        }
        return res.data
    }




    createTrade = async (values) => {
        const res = await post('/trades', {
            ...values
        });
        if (res.code === 0) {
            message.success('新增成功');
        }
        this.onCancel()
    };
    render() {
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
                title='创建环境'
                centered
                onOk={this.handleOk}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'测试环境'}>
                        {getFieldDecorator('envName',{
                            validateFirst: true,
                            rules: [
                                { required: true, message: '行业不能为空' },
                                { pattern: '^[^ ]+$', message: '行业不能有空格' }
                            ]
                        })(
                            <Input
                                maxLength={32}
                                placeholder="请输入行业"
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={'url'}>
                        {getFieldDecorator('url',{
                            initialValue: ""
                        })(
                            <Input/>
                        )}
                    </Form.Item>

                    <Form.Item label={'端口号'}>
                        {getFieldDecorator('port', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '排序不能为空' }
                            ],
                            initialValue : "",
                        })(
                            <InputNumber placeholder={"8080"}/>
                        )}
                    </Form.Item>
                    <Form.Item label={'所属项目'}>
                        {getFieldDecorator('project', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '排序不能为空' }
                            ],
                            initialValue : "",
                        })(
                            <Select placeholder="请选择" style={{width:"29%"}}>
                                {this.queryProject.map((item) => {
                                return <option value={item}>{item}</option>})}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label={'环境描述'}>
                        {getFieldDecorator('description', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '排序不能为空' }
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

export default CreateTradeModal;
