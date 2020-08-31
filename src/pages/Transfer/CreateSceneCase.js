import React from "react";
import {Button, Drawer, Form,Select, Row, Input, Col, message, DatePicker,Radio,Spin,Alert} from "antd";
import {del, get, post} from "../../utils/ajax";
import {isAuthenticated} from "../../utils/session";
import options from './cities'
import InterFaceDetail from "./InterFaceDetail";
import jwt_decode from "jwt-decode";
const { Option } = Select;


@Form.create()
class CreateSceneCase extends React.Component{
    state = {
        visible:false
    };

    showSceneCaseDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    componentDidMount() {
        this.queryInterFaces();
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

    /***
     * 查询接口详细信息
     */
    queryInterFaces = async () =>{
        const res = await get('/interface/queryDistInterFace')
        if(res.code === 0) {
            this.setState({
                interfaces:res.data
            })
        }else {
            message.error("调用queryDistInterFace接口失败，查询接口失败")
        }
    }

    handleChange=(value)=>{
        console.log("handleChange+value==="+JSON.stringify(value))
        this.setState({
            interfaceName:value
        })
    }

    onGetValue = async ()=> {
        console.log("interfaceName===" + JSON.stringify(this.state.interfaceName))
        if (this.state.interfaceName == null||this.state.interfaceName =="") {
            message.error('请先选择接口')
        } else {
            const res = await get('/interface/findByName', {
                interfaceName: this.state.interfaceName
            });
            if (res.code === 0) {
                res.data.signEntity=JSON.stringify(res.data.signEntity)
                this.setState({
                    fields: res.data,
                    isShowPanel: false
                })
                console.log("fields==" + JSON.stringify(this.state.fields))
            } else {
                message.error(res.msg || '没有行业信息，无法新增')
            }
        }
    };
    /**
     * 表单提交
     * */
    handleSubmit = () => {
        this.setState({
            loading:true
        })
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log("this.state.fields==="+JSON.stringify(this.state.fields))
                values.interfaceId=this.state.fields.id
                values.headerDetail = this.state.fields.headerdetail
                values.header = this.state.fields.header
                // values.body = this.state.fields.body
                values.body = JSON.stringify(this.child.state.fields.body)
                values.path = this.state.fields.path
                values.method = this.state.fields.method
                values.interFaceName = this.state.fields.interfaceName
                values.sign = this.state.fields.sign
                values.signEntity=this.state.fields.signEntity
                // values.assertionEntity=JSON.parse(this.child.state.fields.assertDataSource)
                values.assertionContent=JSON.stringify(this.child.state.fields.assertDataSource)
                this.createCaseAndExecute(values)
            }
        });

    };
    createCaseAndExecute = async (values) => {

        let cook =isAuthenticated();
        var user = jwt_decode(cook)
        console.log("cook==="+JSON.stringify(cook))
        var email = JSON.stringify(user.sub)
        console.log("email==="+email)

        console.log("调试的values==="+JSON.stringify(values))
        values.storeImgS = this.state.storeImgs;
        const res = await post('/single/case/execute', {
            ...values,
            lastExecuteUser:email,
            add:true,
            valid:true
        });
        console.log("res==="+JSON.stringify(res))
        if (res.code === 0) {
            message.success('接口调用成功');
            setTimeout(()=> {
                    this.setState({
                            result:{
                                success:res.success,
                                errorCode:res.errorCode,
                                execute:res.execute,
                                message:res.message,
                            },
                            loading:false,

                            img:{},
                            imgs:{},
                            storeImgs:[],
                            fileList:[],
                            tradeList:[]
                        }
                    )
                    this.props.transferList();
                },1500
            )


        }
    };

    render() {
        return (
        <Drawer
            title='用例场景'
            width={1000}
            onClose={this.props.onClose}
            visible={this.props.visible}
            bodyStyle={{ paddingBottom: 80 }}

        >
            <Form layout="vertical" hideRequiredMark>
                <div>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: 'Please enter user name' }]}
                        >
                            <Input placeholder="Please enter user name" />
                        </Form.Item>
                    </Col>
                    {/*<Col span={16}>
                        <Form.Item
                            name="url"
                            label="Url"
                            rules={[{ required: true, message: 'Please enter url' }]}
                        >
                            <Input
                                style={{ width: '100%' }}
                                addonBefore="http://"
                                addonAfter=".com"
                                placeholder="Please enter url"
                            />
                        </Form.Item>
                    </Col>*/}
                </Row>
                </div>
                {/*<Row gutter={16}>*/}
                    {/*<Col span={12}>*/}
                        {/*<Form.Item*/}
                            {/*name="owner"*/}
                            {/*label="Owner"*/}
                            {/*rules={[{ required: true, message: 'Please select an owner' }]}*/}
                        {/*>*/}
                            {/*<Select placeholder="Please select an owner">*/}
                                {/*<Option value="xiao">Xiaoxiao Fu</Option>*/}
                                {/*<Option value="mao">Maomao Zhou</Option>*/}
                            {/*</Select>*/}
                        {/*</Form.Item>*/}
                    {/*</Col>*/}
                    {/*<Col span={12}>*/}
                        {/*<Form.Item*/}
                            {/*name="type"*/}
                            {/*label="Type"*/}
                            {/*rules={[{ required: true, message: 'Please choose the type' }]}*/}
                        {/*>*/}
                            {/*<Select placeholder="Please choose the type">*/}
                                {/*<Option value="private">Private</Option>*/}
                                {/*<Option value="public">Public</Option>*/}
                            {/*</Select>*/}
                        {/*</Form.Item>*/}
                    {/*</Col>*/}
                {/*</Row>*/}
                {/*<Row gutter={16}>*/}
                    {/*<Col span={12}>*/}
                        {/*<Form.Item*/}
                            {/*name="approver"*/}
                            {/*label="Approver"*/}
                            {/*rules={[{ required: true, message: 'Please choose the approver' }]}*/}
                        {/*>*/}
                            {/*<Select placeholder="Please choose the approver">*/}
                                {/*<Option value="jack">Jack Ma</Option>*/}
                                {/*<Option value="tom">Tom Liu</Option>*/}
                            {/*</Select>*/}
                        {/*</Form.Item>*/}
                    {/*</Col>*/}
                    {/*<Col span={12}>*/}
                        {/*<Form.Item*/}
                            {/*name="dateTime"*/}
                            {/*label="DateTime"*/}
                            {/*rules={[{ required: true, message: 'Please choose the dateTime' }]}*/}
                        {/*>*/}
                            {/*<DatePicker.RangePicker*/}
                                {/*style={{ width: '100%' }}*/}
                                {/*getPopupContainer={trigger => trigger.parentElement}*/}
                            {/*/>*/}
                        {/*</Form.Item>*/}
                    {/*</Col>*/}
                {/*</Row>*/}
                {/*<Row gutter={16}>*/}
                    {/*<Col span={24}>*/}
                        {/*<Form.Item*/}
                            {/*name="description"*/}
                            {/*label="Description"*/}
                            {/*rules={[*/}
                                {/*{*/}
                                    {/*required: true,*/}
                                    {/*message: 'please enter url description',*/}
                                {/*},*/}
                            {/*]}*/}
                        {/*>*/}
                            {/*<Input.TextArea rows={4} placeholder="please enter url description" />*/}
                        {/*</Form.Item>*/}
                    {/*</Col>*/}
                {/*</Row>*/}
            </Form>
            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e9e9e9',
                    padding: '10px 16px',
                    background: '#fff',
                    textAlign: 'right',
                }}
            >
                <Button onClick={this.props.onClose} style={{ marginRight: 8 }}>
                    Cancel
                </Button>
                <Button onClick={this.props.onClose} type="primary">
                    Submit
                </Button>
            </div>
        </Drawer>
        )
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
    }
};


export default CreateSceneCase;
