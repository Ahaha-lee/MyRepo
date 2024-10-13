package storage

// func FuzzySearchHandler(w http.ResponseWriter, r *http.Request) {
// 	// 连接数据库
// 	db, err := utils.DataBaseConnect()
// 	if err != nil {
// 		fmt.Println("数据库连接失败:", err)
// 		http.Error(w, "数据库连接失败", http.StatusInternalServerError)
// 		return
// 	}
// 	defer db.Close()
// 	var newStruct model.FuzzySearchStruct
// 	// 读取请求体
// 	body, err := io.ReadAll(r.Body)
// 	if err != nil {
// 		http.Error(w, "读取请求体失败", http.StatusBadRequest)
// 		return
// 	}
// 	if err := json.Unmarshal(body, &newStruct); err != nil {
// 		http.Error(w, "解析请求体失败", http.StatusBadRequest)
// 		return
// 	}
// 	fmt.Println(newStruct)

// 	// 调用 fuzzySearch 函数
// 	results, err := utils.FuzzySearchfunc(db, newStruct.TableName, newStruct.ColumnName, newStruct.Keyword)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// 	// 将结果转换为 JSON 并返回
// 	w.Header().Set("Content-Type", "application/json")
// 	if err := json.NewEncoder(w).Encode(results); err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// }
