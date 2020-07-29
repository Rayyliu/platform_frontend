import React from 'react'
import {Modal, Form, Upload, Icon, message, Input, Switch, InputNumber,Select} from 'antd'
import {get, post, put} from "../../utils/ajax";
import {createFormField} from '../../utils/util'


const form = Form.create({
    //表单回显
    mapPropsToFields(props) {
        return createFormField(props.trade)
    }
});

@form
class EditTradeModal extends React.Component {

    state = {
        projects:[]
    }

    componentDidMount() {
        this.queryProject()
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

    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.editEnv(values)
            }
        })
    };
    onCancel = () => {
        this.props.onCancel();
    };
    editEnv = async (values) => {
        const id = this.props.form.getFieldValue('id');
        const res = await post('/env/edit', {
            ...values,
            id: id
        });
        if (res.code === 0) {
            message.success('修改成功');
        }
        this.props.onCancel()
    };
    render() {
        const {projects} = this.state;
        const { getFieldDecorator,getFieldValue} = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 15
            },
        };
        return (
            <Modal
                visible={this.props.visible}
                onCancel={this.onCancel}
                width={550}
                centered
                onOk={this.handleOk}
                title='修改环境'
            >
                <div style={{ height: '30vh', overflow: 'auto' }}>
                    <Form {...formItemLayout}>
                        <Form.Item label="测试环境">
                            {getFieldDecorator('envName', {
                                validateFirst:true,
                                rules: [
                                    { required: true, message: '环境名称不能为空' }
                                ],
                            })
                            (
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="url">
                            {getFieldDecorator('url', {
                                initialValue: getFieldValue('url'),
                                valuePropName: 'checked',
                            })
                            (
                                <Input/>
                            )}
                        </Form.Item>
                        <Form.Item label="所属项目">
                            {getFieldDecorator('project', {
                                validateFirst: true,
                                rules: [
                                    { required: true, message: '排序不能为空' }
                                ],
                                initialValue: ""
                            })
                            (
                                <Select placeholder="请选择" style={{width:"29%"}}>
                                    {projects.map(item=>{return <Select.Option value = {item}>{item}</Select.Option>})}
                                </Select>
                            )}
                        </Form.Item>

                        <Form.Item label="环境描述">
                            {getFieldDecorator('envDescription', {
                                initialValue: getFieldValue('envDescription'),
                                valuePropName: 'checked',
                            })
                            (
                                <Input/>
                            )}
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        );
    }
}

export default EditTradeModal
