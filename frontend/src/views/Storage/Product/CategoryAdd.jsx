import { useState } from "react";
import Modal from "react-modal"; 
import { CategoryApi } from "../../../api/storage/product";

export function CategoryAddModal({ isOpen, onRequestClose }) {
    const [formdata, setFormdata] = useState({
        CategoryName: '',
        CategoryDesc: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormdata(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleAddCategory = () => {
        CategoryApi.add(formdata)
            .then((res) => {
                console.log("类型添加:", res);
            })
            .catch((error) => {
                console.log("错误信息", error);
            });
    };
    
    return (
        <div>
            <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
                <h5>添加类型</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <label>类型名称:</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="CategoryName" 
                                value={formdata.CategoryName} 
                                onChange={handleInputChange} 
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label>类型详情:</label>
                            <textarea 
                                className="form-control" 
                                name="CategoryDesc" 
                                value={formdata.CategoryDesc} 
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                <button className="btn btn-primary mt-3" onClick={handleAddCategory}>确定</button>
                <button className="btn btn-primary mt-3" onClick={onRequestClose}>取消</button>
            </Modal>
        </div>
    );
}
