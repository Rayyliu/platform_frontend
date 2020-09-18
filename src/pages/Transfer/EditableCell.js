import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import {  Input,Form ,Select} from 'antd';
import { EditableContext } from './CreateContext';

const {Option} = Select
class EditableCell extends React.Component {
    state = {
        editing: false,
    };


    toggleEdit = () => {
        const editing = !this.state.editing;
        console.log("editing==="+JSON.stringify(editing))
        this.setState({ editing }, () => {
            if (editing) {
                // this.input.focus();
                console.log("toggleEdit执行完毕")
            }
        });
    };

    save = (value,dataIndex) => {
        const { record, handleSave } = this.props;
        record[dataIndex] = value;

        console.log("进入save方法")
        console.log("record==="+JSON.stringify(record))
        console.log("handleSave==="+JSON.stringify(handleSave))
        this.form.validateFields((error, values) => {
            console.log("-----------------------")
            console.log(values);

            if (error) {
                console.log("报错啦。。。。")
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    };

    renderItem=(form)=>{
        const {dataIndex, record, title, type} = this.props;

        if(type==='input') {
           return (
                <Form.Item style={{margin: 0}}>
                    {form.getFieldDecorator(dataIndex, {
                        rules: [
                            {
                                required: true,
                                message: `${title} is required.`,
                            },
                        ],
                        initialValue: record[dataIndex],
                    })(
                        <Input
                            ref={(node) => (this.input = node)}
                            onPressEnter={(e)=>this.save(e.currentTarget.id,dataIndex)}
                            onBlur={(e)=>this.save(e.currentTarget.id,dataIndex)}
                        />)}
                </Form.Item>

            )
        }else if(type==='select'){
            return (
                <Form.Item style={{margin: 0}}>
                    {form.getFieldDecorator(dataIndex, {
                        rules: [
                            {
                                required: true,
                                message: `${title} is required.`,
                            },
                        ],
                        initialValue: record[dataIndex],
                        trigger: 'onChange'
                    })(
                        <Select onChange={(e)=>{
                            window.setTimeout(()=>{
                                this.save(e,dataIndex)
                            },100)
                        }}>
                            <Option value={"equal"}>equal</Option>
                            <Option value={"notEqual"}>notEqual</Option>
                            <Option value={"contains"}>contains</Option>
                            <Option value={"notContains"}>notContains</Option>
                        </Select>
                    )
                    }
                </Form.Item>

            )
        }
    }

    renderCell = (form) => {
        this.form = form;
        const { children} = this.props;
        const { editing } = this.state;
        return editing ?
            this.renderItem(form) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24 }}
                onClick={this.toggleEdit}
            >
                {children}
            </div>
        );
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
                ) : (
                    children
                )}
            </td>
        );
    }
}
export default EditableCell;