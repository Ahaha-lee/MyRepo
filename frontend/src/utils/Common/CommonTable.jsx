import { useState, useEffect } from 'react';
import Modal from 'react-modal';

export function CommonTable({ 
  columns, 
  data = [], 
  checkable = false,
  onCheckChange,
  indexColumn = true,
  actions,
  idField
}) {
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  useEffect(() => {
    if (checkable) {
      initializeCheckboxStates();
    }
  }, [checkable, data]); // 添加 data 作为依赖项

  const initializeCheckboxStates = () => {
    const initialStates = (data || []).reduce((acc, item) => {
      acc[item[idField]] = checkboxStates[item[idField]] || false; // 保持之前的勾选状态
      return acc;
    }, {});
    setCheckboxStates(initialStates);
    updateSelectAllChecked(initialStates);
    if (onCheckChange) {
      onCheckChange(initialStates);
    }
  };

  const updateSelectAllChecked = (states) => {
    const allChecked = (data || []).every(item => states[item[idField]]);
    setSelectAllChecked(allChecked);
  };

  const handleSelectAllClick = () => {
    const newSelectAllState = !selectAllChecked;
    setSelectAllChecked(newSelectAllState);
    
    const newCheckboxStates = {};
    (data || []).forEach((item) => {
      newCheckboxStates[item[idField]] = newSelectAllState;
    });
    
    setCheckboxStates((prevStates) => ({
      ...prevStates,
      ...newCheckboxStates
    }));
    if (onCheckChange) {
      onCheckChange({ ...checkboxStates, ...newCheckboxStates });
    }
  };

  const handleCheckboxChange = (itemId) => {
    const newStates = {
      ...checkboxStates,
      [itemId]: !checkboxStates[itemId]
    };
    setCheckboxStates(newStates);
    updateSelectAllChecked(newStates);
    if (onCheckChange) {
      onCheckChange(newStates);
    }
  };

  const isISODate = (dateString) => {
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)$/;
    return isoDatePattern.test(dateString);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const formatValue = (value) => {
    if (typeof value === 'boolean') {
      return value ? '是' : '否';
    }
    if (typeof value === 'string' && isISODate(value)) {
      return formatDate(value);
    }
    return value;
  };

  const getImagePath = (path) => {
    // 将本地路径转换为服务器 URL
    const relativePath = path.replace(/\\/g, '/').replace('E:/DingggCode/MyRepo/frontend', '');
    return `http://localhost:3001/${relativePath}`;
  };

  const openModal = (imagePath) => {
    setModalImage(imagePath);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalImage('');
  };

  return (
    <div className="container">
      <table className="table">
        <thead>
          <tr>
            {checkable && (
              <th>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selectAllChecked}
                  onChange={handleSelectAllClick}
                  disabled={(data || []).length === 0}
                  style={{ backgroundColor: 'white' }} // 全选框初始为白色
                />
              </th>
            )}
            {indexColumn && <th scope="col">#</th>}
            {columns.map((column, index) => (
              <th key={index} scope="col">{column.title}</th>
            ))}
            {actions && <th scope="col">操作</th>}
          </tr>
        </thead>
        <tbody>
          {(data || []).length > 0 ? (
            (data || []).map((item, index) => (
              <tr key={item[idField] || index}>
                {checkable && (
                  <td>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={checkboxStates[item[idField]] || false}
                      onChange={() => handleCheckboxChange(item[idField])}
                    />
                  </td>
                )}
                {indexColumn && <td>{index + 1}</td>}
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {column.key === 'ImagePath' ? (
                      <img 
                        src={getImagePath(item[column.key])} 
                        alt="" 
                        style={{ width: '80px', height: '80px', cursor: 'pointer' }} 
                        onClick={() => openModal(getImagePath(item[column.key]))}
                      />
                    ) : (
                      column.render ? column.render(item[column.key], item) : formatValue(item[column.key])
                    )}
                  </td>
                ))}
                {actions && (
                  <td>
                    {typeof actions === 'function' ? actions(item) : actions}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={checkable ? columns.length + 1 : columns.length}>
                表格为空
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '60%', // 模态框宽度设为60%，可按需调整
            maxWidth: '500px', // 最大宽度，防止过大
            maxHeight: '70vh', // 最大高度，根据视口高度设置
          }
        }}
      >
        <img 
          src={modalImage} 
          alt="Enlarged" 
          style={{ 
            width: '100%', 
            height: 'auto', // 让高度自适应，避免拉伸变形
            display: 'block', // 使图片以块级元素显示
            margin: '0 auto', // 水平居中图片
          }} 
        />
        <button 
          onClick={closeModal} 
          style={{
            display: 'block', // 按钮以块级元素显示
            margin: '10px auto 0', // 水平居中按钮，上边距10px
          }}
        >关闭</button>
      </Modal>
    </div>
  );
}