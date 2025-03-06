import { useState, useEffect } from 'react';

export function CommonTable({ 
  columns, 
  data, 
  checkable = false,
  onCheckChange,
  indexColumn = true,
  actions
}) {
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState({});

  useEffect(() => {
    if (checkable) {
      initializeCheckboxStates();
    }
  }, [data]);

  const initializeCheckboxStates = () => {
    const initialStates = data.reduce((acc, item) => {
      acc[item.id] = false;
      return acc;
    }, {});
    setCheckboxStates(initialStates);
  };

  const handleSelectAllClick = () => {
    const newSelectAllState = !selectAllChecked;
    setSelectAllChecked(newSelectAllState);
    
    const newCheckboxStates = {};
    data.forEach((item) => {
      newCheckboxStates[item.id] = newSelectAllState;
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
          {data.map((item, index) => (
            <tr key={item.id || index}>
              {checkable && (
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={checkboxStates[item.id] || false}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                </td>
              )}
              {indexColumn && <td>{index + 1}</td>}
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.render ? column.render(item[column.key], item) : item[column.key]}
                </td>
              ))}
              {actions && (
                <td>
                  {typeof actions === 'function' ? actions(item) : actions}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 