package main

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"github.com/backslash-security-tests/golang-supermarket/orders"
)

type ordersServer struct {
	orders.UnimplementedOrdersServer
	postgresqlDB    *sql.DB
	restClient      http.Client
}

func (srv *ordersServer) Start(ctx context.Context, input *orders.StartInput) (output *orders.StartOutput, err error) {
	output, _ = srv.doStart(ctx, input)

	return output, nil
}

func (srv *ordersServer) doStart(ctx context.Context, input *orders.StartInput) (
	output *orders.StartOutput,
	err error,
) {
	customer_id := input.CustomerId

	var order_id interface{}
	srv.postgresqlDB.QueryRow(fmt.Sprintf("INSERT INTO orders (customer_id) VALUES ('%s') RETURNING order_id", customer_id)).Scan(&order_id)
	output.OrderId = order_id

	return output, nil
}

func (srv *ordersServer) AddItem(ctx context.Context, input *orders.AddItemInput) (output *orders.AddItemOutput, err error) {
	order_id := input.OrderId
	name := input.Name
	quantity := input.Quantity
	sku := "sku"
	price := 100

	var item_id interface{}
	srv.postgresqlDB.QueryRow("INSERT INTO order_items (order_id, sku, quantity, price) VALUES ($1, $2, $3, $4) RETURNING item_id", order_id, sku, quantity, price).Scan(&item_id)
	output.ItemId = item_id

	return output, nil
}

func (srv *ordersServer) Finish(ctx context.Context, input *orders.FinishInput) (output *orders.FinishOutput, err error) {
	output, _ = srv.doFinish(ctx, input)

	return output, nil
}

func (srv *ordersServer) doFinish(ctx context.Context, input *orders.FinishInput) (
	output *orders.FinishOutput,
	err error,
) {
	credit_card := input.CreditCard
	order_id := input.OrderId

	delivery_address := "DeliveryAddress"
	window_from := "WindowFrom"
	window_to := "WindowTo"

	output.Success = success
	output.WindowFrom = window_from
	output.WindowTo = window_to

	return output, nil
}