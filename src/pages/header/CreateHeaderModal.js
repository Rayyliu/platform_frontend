import React, { Component } from 'react';
import {Modal, Form, Input, message, Switch, InputNumber, Select, Radio, Button,Table} from 'antd'
import {get, post} from '../../utils/ajax'
import RadioGroup from "antd/es/radio/group";

@Form.create()
class CreateHeaderModal extends Component {

    state = {

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
        const {dataSource} = this.state;
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
                title='添加header'
                centered
                onOk={this.handleOk}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'参数名'}>
                        {getFieldDecorator('name',{
                            validateFirst: true,
                            rules: [
                                { required: true, message: '参数名称不能为空' }
                            ]
                        })(
                            <Input
                                maxLength={32}
                                placeholder="请输入参数名"
                            />
                        )}
                    </Form.Item>

                    <Form.Item label={'value'}>
                        {getFieldDecorator('value',{
                            validateFirst: true,
                            rules: [
                                { required: true, message: '参数值不能为空' }
                            ]
                        })(
                            <Input
                                maxLength={32}
                                placeholder="请输入参数值"
                            />
                        )}
                    </Form.Item>

                </Form>
            </Modal>
        );
    }
}

export default CreateHeaderModal;
