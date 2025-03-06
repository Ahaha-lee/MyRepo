import { useState, useEffect } from 'react';

export function 
CommonTable({ 
  columns, 
  data = [], // 设置默认值为一个空数组
  checkable = false,
  onCheckChange,
  indexColumn = true,
  actions,
  idField
}) {
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState({});

  useEffect(() => {
    if (checkable) {
      initializeCheckboxStates();
    }
  }, [checkable]); // 添加 checkable 作为依赖项

  const initializeCheckboxStates = () => {
    const initialStates = data.reduce((acc, item) => {
      acc[item[idField]] = false;
      return acc;
    }, {});
    setCheckboxStates(initialStates);
    if (onCheckChange) {
      onCheckChange(initialStates);
    }
  };

  const handleSelectAllClick = () => {
    const newSelectAllState = !selectAllChecked;
    setSelectAllChecked(newSelectAllState);
    
    const newCheckboxStates = {};
    data.forEach((item) => {
      newCheckboxStates[item[idField]] = newSelectAllState;
    });
    
    setCheckboxStates(newCheckboxStates);
    if (onCheckChange) {
      onCheckChange(newCheckboxStates);
    }
  };

  const handleCheckboxChange = (itemId) => {
    const newStates = {
      ...checkboxStates,
      [itemId]: !checkboxStates[itemId]
    };
    setCheckboxStates(newStates);
    
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
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
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
                  disabled={data.length === 0} // 禁用全选框
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
          {data.length > 0 ? (
            data.map((item, index) => (
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
                    {column.render ? column.render(item[column.key], item) : formatValue(item[column.key])}
                  </td>
                ))}
                {actions && (
                  <td>
                    {typeof actions === 'function' ? actions(item) : actions}
                  </td>
                )}
              </tr>
            ))
          ) :(
            <tr>
              <td colSpan={checkable ? columns.length + 1 : columns.length}>
                暂无数据
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
