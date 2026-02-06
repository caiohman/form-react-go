package main

import (
	"database/sql"
	formattedIO "fmt"
	"log"

	"github.com/go-sql-driver/mysql"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

type Bank struct {
	Id    int32  `json:"id"`
	Name  string `json:"name"`
	Total int32  `json:"total"`
}

type Chart struct {
	Month string `json:"month"`
	Year string `json:"year"`
	Food int32 `json:"food"`
	Bank int32 `json:"bank"`
}

func getDbConnection() (*sql.DB, error) {
	dbConnection := mysql.Config{
		User:   "root",
		Passwd: "caio",
		Net:    "tcp",
		Addr:   "127.0.0.1:3306",
		DBName: "finances",
	}

	var err error
	var mysql *sql.DB
	mysql, err = sql.Open("mysql", dbConnection.FormatDSN())

	if err != nil {
		return nil, formattedIO.Errorf("Error %v", err)
	}

	pingErr := mysql.Ping()

	if pingErr != nil {
		return nil, formattedIO.Errorf("Error %v", pingErr)
	}

	return mysql, nil
}

func getBanks(db *sql.DB) ([]Bank, error) {
	var banks []Bank
	rows, err := db.Query("select * from bank")

	if err != nil {
		return nil, formattedIO.Errorf("Error %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var bank Bank

		if err := rows.Scan(&bank.Id, &bank.Name, &bank.Total); err != nil {
			return nil, formattedIO.Errorf("Error %v", err)
		}

		banks = append(banks, bank)
	}
	if err := rows.Err(); err != nil {
		return nil, formattedIO.Errorf("Error %v", err)
	}

	return banks, nil
}

func getChart(db *sql.DB) ([]Chart, error) {
	var chartValues []Chart

	rows, err := db.Query(
		`SELECT
    	MONTHNAME(t.instant) as month,
     	year(t.instant) as year,
      	SUM(CASE WHEN c.id = 1 THEN t.value ELSE 0 END) as Food,
       	SUM(CASE WHEN c.id = 2 THEN t.value ELSE 0 END) as Bank
        	FROM transactions t
         	LEFT JOIN categories c ON t.categories = c.id
          	GROUP BY year(t.instant), monthname(t.instant)
           	ORDER BY month;`)

	if err != nil {
		return nil, formattedIO.Errorf("Error %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var chartValue Chart

		if err := rows.Scan(&chartValue.Month, &chartValue.Year,
			&chartValue.Food, &chartValue.Bank); err != nil {
			return nil, formattedIO.Errorf("Error %v", err)
		}

		chartValues = append(chartValues, chartValue)
	}
	if err := rows.Err(); err != nil {
		return nil, formattedIO.Errorf("Error %v", err)
	}

	return chartValues, nil
}


func main() {
	var db *sql.DB
	db, err := getDbConnection()

	if err != nil {
		log.Fatal(err)
	}

	app := fiber.New()
	app.Use(cors.New())
	app.Get("/getbanks", func(c fiber.Ctx) error {
		banks, err := getBanks(db)

		if err != nil {
			return err
		}

		return c.JSON(banks)
	})
	app.Get("/getchart", func(c fiber.Ctx) error {
		chartValues, err := getChart(db)

		if err != nil {
			return err
		}

		return c.JSON(chartValues)
	})

	log.Fatal(app.Listen(":8090"))
}
