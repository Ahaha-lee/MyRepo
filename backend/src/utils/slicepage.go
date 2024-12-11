package utils

import "fmt"

type SlicePageStruct struct {
	CurrentPage int
	PageSize    int
}

func PaginationQuery(page int, pageSize int, tablename string) string {
	offset := (page - 1) * pageSize
	query := fmt.Sprintf("SELECT * FROM  %s LIMIT %d OFFSET %d", tablename, pageSize, offset)
	return query
}
