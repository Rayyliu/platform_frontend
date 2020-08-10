import React, { Component } from 'react';
import {Modal, Form, Input, message, Switch, InputNumber, Select, Radio, Button,Row,Col} from 'antd'
import {get, post} from '../../utils/ajax'
import RadioGroup from "antd/es/radio/group";
import HeaderModal from "../header/HeaderModal";
import {isAuthenticated} from "../../utils/session";
import jwt_decode from "jwt-decode";


const {TextArea} = Input
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
        boolean:{
            sign:false,
            header:false,
            mock:false
        },
        method:"",
        mode:"",
        isShowCreateModal:false,
        interFace:[]
    }}

    componentDidMount() {
        this.queryProject();
        // this.queryInterFace()
    }
    onCancel = () => {
        this.props.form.resetFields();
        this.props.toggleVisible(false);
    };
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            console.log("标记处一")
            if (!errors) {
                console.log("标记处二")
                this.createTrade(values)
            }else{
                alert('失败')
                console.log(values)
            }
        })
    };

    onModeChange=e=>{
        console.log('ModeRadio2 checked', e.target.value);
        this.setState({
            mode:e.target.value
        })
}
    onMethodChange=e=>{
        console.log('MethodRadio2 checked', e.target.value);
        this.setState({
            method:e.target.value
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
            return (<div>
            <TextArea/>
        </div>)
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
     * 查询接口
     */
    // queryInterFace = async () =>{
    //     const res = await get('/interface/queryAll')
    //     if(res.code === 0) {
    //         this.setState({
    //             interFace:res.data
    //         })
    //     }else {
    //         message.error("调用queryAll接口失败，查询接口数失败")
    //     }
    // }



    createTrade = async (values) => {
        let cook =isAuthenticated();
        var user = jwt_decode(cook)
        var email = JSON.stringify(user.sub)
        console.log("开始调用interface接口")
        const res = await post('/interface/add', {
            ...values,
            lastUpdateUser:email

        });
        if (res.code === 0) {
            message.success('新增接口成功');
            this.onCancel()
        };
    }


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
        const { getFieldProps } = this.props.form;
        // let {headerList} = this.state;
        // let headerNumber = headerList.length;
        // let  headerComps = headerList.map((el,index)=>{
        //     return(
        //         <span key={index}>
        //         <Row span={24}>
        //         <Col span={8}>
        //         <Form.Item label="参数：" labelCol={{span: 10}} wrapperCol={{span: 12}}>
        //         {getFieldDecorator(`parameter${index}`,{
        //             initialValue: el.parameter,
        //             rules: [{
        //                 required: true,
        //                 message: '请填写header参数'
        //             }]
        //         })(
        //             <Input
        //                 {...getFieldProps('parameter')}
        //             />
        //         )}
        //         </Form.Item>
        //         </Col>
        //             <Col span={8}>
        //             <Form.Item label="值：" labelCol={{span: 8}} wrapperCol={{span: 12}}>
        //                 {getFieldDecorator(`value${index}`,{
        //                     initialValue: el.value,
        //                     rules: [{
        //                         required: true,
        //                         message: '请填写参数值'
        //                     }],
        //                 })(
        //                     <Input />
        //                 )}
        //             </Form.Item>
        //     </Col>
        //             <Col span={4} style={{marginTop:6}}>
        //      {index === 0 && headerNumber < 5 && <Button shape="circle" size="small" icon="plus" type="primary" style={{marginRight:10}} onClick={() => this.addManager()} />}
        //                 {((headerNumber > 1 && index === 0) || index > 0)  && <Button shape="circle" size="small" icon="minus" type="default" onClick={() => this.delManager(index)} />}
        //    </Col>
        //    </Row>
        // </span>
        //     )
        // });

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
                                maxLength={256}
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
                                maxLength={256}
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
                           <RadioGroup  onChange={this.onMethodChange} value={this.state.value} defaultValue={1}>
                               <Radio value={"get"}>get</Radio>
                               <Radio value={"post"}>post</Radio>
                               <Radio value={"delete"}>delete</Radio>
                               <Radio value={"put"}>put</Radio>
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
                            <RadioGroup  onChange={this.onModeChange} value={this.state.value} >
                                <Radio key="json" value="json">json</Radio>
                                <Radio key="data" value="data">data</Radio>
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
                            initialValue: true
                        })(
                            <Switch checkedChildren="签名" unCheckedChildren="不签名" defaultChecked/>
                        )
                        }
                    </Form.Item>

                    <Form.Item label={'签名字段'}>
                        {getFieldDecorator('signKey',{
                        })(
                            <Input placeholder={"接口签名则需填写签名所需字段"}/>
                        )}
                    </Form.Item>

                    <Form.Item label={'header'}>
                        {getFieldDecorator('header',{
                            initialValue: true
                        })(
                            <Switch checkedChildren="设置" unCheckedChildren="不设置" defaultChecked/>
                        )}
                    </Form.Item>

                    <Form.Item label={'是否mock'}>
                        {getFieldDecorator('mock',{
                            initialValue: true
                        })(
                            <Switch checkedChildren="mock" unCheckedChildren="不mock" defaultChecked/>
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
                        {getFieldDecorator('headerDetail', {
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

export default CreateInterFaceModal;
