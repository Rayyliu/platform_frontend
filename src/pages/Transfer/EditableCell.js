import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import {  Input,Form } from 'antd';
import { EditableContext } from './CreateContext';

class EditableCell extends React.Component {
    state = {
        editing: false,
    };


    toggleEdit = () => {
        const editing = !this.state.editing;
        console.log("editing==="+JSON.stringify(editing))
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
                console.log("toggleEdit执行完毕")
            }
        });
    };

    save = e => {
        const { record, handleSave } = this.props;
        console.log("进入save方法")
        console.log("record==="+JSON.stringify(record))
        console.log("handleSave==="+JSON.stringify(handleSave))
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                console.log("报错啦。。。。")
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    };

    renderCell = (form) => {
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
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
                          onPressEnter={this.save}
                          onBlur={this.save}
                    />)}
            </Form.Item>
        ) : (
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