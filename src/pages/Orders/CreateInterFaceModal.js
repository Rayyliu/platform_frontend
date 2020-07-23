import React, { Component } from 'react';
import {Modal, Form, Input, message, Switch, InputNumber, Select, Radio, Button,Row,Col} from 'antd'
import {get, post} from '../../utils/ajax'
import RadioGroup from "antd/es/radio/group";
import HeaderModal from "../header/HeaderModal";

@Form.create()
class CreateInterFaceModal extends Component {

    constructor(props){
    super(props);
    this.state = {
        headerList:[{
            parameter: "",
            value: ""
        }],
        projects:[],
        mode:{
            method:"",
            sign:false,
            header:false,
            mock:false
        },
        isShowCreateModal:false
    }}

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

    onChange=e=>{
        console.log('radio2 checked', e.target.value);
        this.setState({
            mode:{
                method:e.target.value
            }
        })
}

    onChangeSign=e=>{
        console.log('radio2 checked', e.target.value);
        this.setState({
            mode:{
                sign: e.target.value
            }
        })
    }

    onChangeHeader=e=>{
        console.log('radio2 checked', e.target.value);
        this.setState({
            mode:{
                header: e.target.value
            }
        })
    }

    onChangeMock=e=>{
        console.log('radio2 checked', e.target.value);
        this.setState({
            mode:{
                mock: e.target.value
            }
        })
    }
    /**
     * 创建modal
     * */
    toggleShowCreateModal=(visible)=>{
        this.setState({
        isShowCreateModal: visible
    });
}


    addline=()=>{
        let id = 1000;
        const { form } = this.props;
        console.log("form=="+JSON.stringify(this.props.form))
        const keys = form.getFieldValue("keys");
        const nextKeys = keys.concat(id);
        id++;
        form.setFieldsValue({
            keys: nextKeys,
        });
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



    createTrade = async (values) => {
        const res = await post('/env/add', {
            ...values
        });
        if (res.code === 0) {
            message.success('新增成功');
        }
        this.onCancel()
    };

    collectManager = () =>{
        const {getFieldValue, resetFields} = this.props.form;
        const headerList = [];
        let headerNumber = this.state.headerList.length;
        for (let i = 0; i < headerNumber; i++){
            let parameter = getFieldValue(`parameter${i}`);
            let value = getFieldValue(`value${i}`);
            //！！！！重要，如果不加此方法，则会在删除元素时，getFieldDecorator的initalValue属性不生效的问题
            resetFields([`parameter${i}`,`value${i}`]);
            headerList.push({parameter: parameter, value: value});
        }
        return headerList;
    }

    addManager = () =>{
        let headerList = this.collectManager();
        headerList.push({parameter: "", value: ""});
        this.setState({headerList});
    }

    delManager = (index) =>{
        let headerList = this.collectManager();
        //删除指定index的元素
        headerList.splice(index,1);
        this.setState({headerList});
    }




    render() {
        const {projects,isShowCreateModal} = this.state;
        const { visible } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 },
        };

        const formItemLayoutText = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const { getFieldProps } = this.props.form;
        let {headerList} = this.state;
        let headerNumber = headerList.length;
        let  headerComps = headerList.map((el,index)=>{
            return(
                <span key={index}>
                <Row span={24}>
                <Col span={8}>
                <Form.Item label="参数：" labelCol={{span: 10}} wrapperCol={{span: 12}}>
                {getFieldDecorator(`parameter${index}`,{
                    initialValue: el.parameter,
                    rules: [{
                        required: true,
                        message: '请填写header参数'
                    }]
                })(
                    <Input
                        {...getFieldProps('parameter')}
                    />
                )}
                </Form.Item>
                </Col>
                    <Col span={8}>
                    <Form.Item label="值：" labelCol={{span: 8}} wrapperCol={{span: 12}}>
                        {getFieldDecorator(`value${index}`,{
                            initialValue: el.value,
                            rules: [{
                                required: true,
                                message: '请填写参数值'
                            }],
                        })(
                            <Input />
                        )}
                    </Form.Item>
            </Col>
                    <Col span={4} style={{marginTop:6}}>
             {index === 0 && headerNumber < 5 && <Button shape="circle" size="small" icon="plus" type="primary" style={{marginRight:10}} onClick={() => this.addManager()} />}
                        {((headerNumber > 1 && index === 0) || index > 0)  && <Button shape="circle" size="small" icon="minus" type="default" onClick={() => this.delManager(index)} />}
           </Col>
           </Row>
        </span>
            )

        });

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
                           <RadioGroup  onChange={this.onChange} value={this.state.mode} defaultValue={1}>
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
                            <Select placeholder="请选择" style={{width:"29%"}}>
                                {projects.map((item) => {
                                    return <option value={item}>{item}</option>})}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label={'跳过'}>
                        {getFieldDecorator('jump', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '环境描述不能为空' }
                            ],
                            initialValue : "",
                        })(
                            <Input/>
                        )}
                    </Form.Item>

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

                    <Form.Item  label='请求header' labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                        <Input type="textarea" placeholder="备注"/>
                    </Form.Item>


                    <Form.Item label={'请求body'}>

                        <Button type='primary' icon='plus-square' onClick={()=>this.toggleShowCreateModal(true)}>添加行</Button>
                        &emsp;
                        <Button shape='primary' icon='plus-square' >添加JSON</Button>
                    </Form.Item>

                    <Form.Item label={'测试大小'} >
                        <Input />
                    </Form.Item>
                    <HeaderModal visible = {isShowCreateModal} toggleVisible={this.toggleShowCreateModal}/>
            </Form>
            </Modal>
        );
    }
}

export default CreateInterFaceModal;
