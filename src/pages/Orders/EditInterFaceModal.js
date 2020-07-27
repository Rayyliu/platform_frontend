import React from 'react'
import {Modal, Form, Upload, Icon, message, Input, Switch, InputNumber, Radio,Select} from 'antd'
import {del, post, put,get} from "../../utils/ajax";
import {createFormField} from '../../utils/util'
import RadioGroup from "antd/es/radio/group";


const form = Form.create({
    //表单回显
    mapPropsToFields(props) {
        return createFormField(props.interFace)
    }
});

@form
class EditInterFaceModal extends React.Component {
    state = {
        uploading: false,
        img:{},
        interfaces:[]
    };

    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                console.log("values==="+JSON.stringify(values))
                this.editInterFace(values)

            }
        })
    };
    onCancel = () => {
        this.props.onCancel();
    };
    editInterFace = async (values) => {
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

    componentDidMount() {
        this.queryInterFaces();
        // this.queryInterFace()
    }


    /***
     * 去重查询项目名称
     */
    queryInterFaces = async () =>{
        const res = await get('/project/queryDistProject')
        if(res.code === 0) {
            this.setState({
                interfaces:res.data
            })
        }else {
            message.error("调用queryDistProject接口失败，查询项目失败")
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
        const {TextArea} = Input
        const {interfaces} = this.state;

        const { visible } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 },
        };
        return (
            <Modal
                onCancel={this.onCancel}
                visible={visible}
                width={550}
                title='编辑接口'
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
                        {getFieldDecorator('project', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '项目不能为空' }
                            ],
                            initialValue : "",
                        })(
                            <Select placeholder="请选择" style={{width:"29%"}}>
                                {interfaces.map((item) => {
                                    return <Select.Option value={item}>{item}</Select.Option>})}
                            </Select>
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
                        {getFieldDecorator('method',{
                            validateFirst: true,
                            rules: [
                                { required: true, message: 'url不能为空' }
                            ]
                        })(
                            <RadioGroup  onChange={this.onChange} >
                                <Radio value={1}>get</Radio>
                                <Radio value={2}>post</Radio>
                                <Radio value={3}>delete</Radio>
                                <Radio value={4}>put</Radio>
                            </RadioGroup>
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
                    <Form.Item label={'传输方式'}>
                        {getFieldDecorator('mode', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '数据传输方式不能为空' }
                            ],
                            initialValue : "",
                        })(
                            <RadioGroup  onChange={this.onChange} value={this.state.mode} defaultValue={1}>
                                <Radio value={1}>json</Radio>
                                <Radio value={2}>data</Radio>
                            </RadioGroup>
                        )}
                    </Form.Item>
                    {/*<Form.Item label={'跳过'}>*/}
                    {/*{getFieldDecorator('jump', {*/}
                    {/*// validateFirst: true,*/}
                    {/*// rules: [*/}
                    {/*//     { required: true, message: '环境描述不能为空' }*/}
                    {/*// ],*/}
                    {/*initialValue : "",*/}
                    {/*})(*/}
                    {/*<Input/>*/}
                    {/*)}*/}
                    {/*</Form.Item>*/}

                    <Form.Item label={'是否签名'}>
                        {getFieldDecorator('sign',{
                            validateFirst: true,
                            rules: [
                                { required: true, message: 'url不能为空' }
                            ]
                        })(
                            <RadioGroup  onChange={this.onChangeSign} value={this.state.mode}>
                                <Radio key="签名" value={1}>签名</Radio>
                                <Radio key="不签名" value={2}>不签名</Radio>
                            </RadioGroup>
                        )}
                    </Form.Item>

                    {/*<Form.Item label={'设置header'}>*/}
                    {/*{getFieldDecorator('header',{*/}
                    {/*validateFirst: true,*/}
                    {/*rules: [*/}
                    {/*{ required: true, message: 'url不能为空' }*/}
                    {/*]*/}
                    {/*})(*/}
                    {/*<RadioGroup  onChange={this.onChangeHeader} value={this.state.mode} >*/}
                    {/*<Radio key="设置" value={1}>设置</Radio>*/}
                    {/*<Radio key="不设置" value={2}>不设置</Radio>*/}
                    {/*</RadioGroup>*/}
                    {/*)}*/}
                    {/*</Form.Item>*/}

                    <Form.Item label={'header'}>
                        {getFieldDecorator('header',{
                            validateFirst: true,
                            rules: [
                                { required: true, message: 'url不能为空' }
                            ]
                        })(
                            <RadioGroup  onChange={this.onChangeHeader} value={this.state.mode} >
                                <Radio key="设置"value={1}>设置</Radio>
                                <Radio key="不设置" value={2}>不设置</Radio>
                            </RadioGroup>
                        )}
                    </Form.Item>

                    <Form.Item label={'是否mock'}>
                        {getFieldDecorator('mock',{
                            validateFirst: true,
                            rules: [
                                { required: true, message: 'url不能为空' }
                            ]
                        })(
                            <RadioGroup  onChange={this.onChangeMock} value={this.state.mode} >
                                <Radio key="是"value={1}>是</Radio>
                                <Radio key="不是" value={2}>不是</Radio>
                            </RadioGroup>
                        )}
                    </Form.Item>

                    <Form.Item label="接口描述"  help="对接口功能进行描述">
                        {getFieldDecorator('description', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '接口描述不能为空' }
                            ],
                            initialValue : "",
                        })(
                            <Input type="textarea" placeholder="随便写" {...getFieldDecorator('description')}/>
                        )}
                    </Form.Item>

                    {/*<Form.Item label={'请求header'}>*/}

                    {/*/!*<div className="header">*!/*/}
                    {/*/!*header参数及值*!/*/}
                    {/*/!*</div>*!/*/}
                    {/*<div>*/}
                    {/*<div>*/}
                    {/*{headerComps}*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*/!*<Button type='primary' icon='plus-square' onClick={this.addline}>添加行</Button>*!/*/}
                    {/*/!*&emsp;*!/*/}
                    {/*/!*<Button shape='primary' icon='plus-square' >添加JSON</Button>*!/*/}

                    {/*</Form.Item>*/}

                    {/*<Form >*/}
                    {/*<div className="ant-descriptions-title">*/}
                    {/*请求header*/}
                    {/*</div>*/}
                    {/*<div>*/}
                    {/*<div>*/}
                    {/*{headerComps}*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*</Form>*/}

                    <Form.Item  label='请求header'>
                        {getFieldDecorator('headerdetail', {
                            validateFirst: true,
                            // rules: [
                            //     { required: true, message: '接口描述不能为空' }
                            // ],
                            initialValue : "",
                        })(
                            <TextArea/>
                        )}
                        {/*<Input type="textarea" placeholder="备注"/>*/}

                    </Form.Item>


                    <Form.Item label={'请求body'}>

                        {/*<Button type='primary' icon='plus-square' onClick={()=>this.toggleShowCreateModal(true)}>添加行</Button>*/}
                        {/*<Button type='primary' icon='plus-square' onClick={()=>this.addline()}>添加行</Button>*/}
                        {/*&emsp;*/}
                        {/*<Button shape='primary' icon='plus-square' >添加JSON</Button>*/}
                        {getFieldDecorator('body', {
                            validateFirst: true,
                            // rules: [
                            //     { required: true, message: '接口描述不能为空' }
                            // ],
                            initialValue : "",
                        })(
                            <TextArea/>
                        )}
                    </Form.Item>
                    {/*<HeaderModal visible = {isShowCreateModal} toggleVisible={this.toggleShowCreateModal}/>*/}
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

export default EditInterFaceModal
