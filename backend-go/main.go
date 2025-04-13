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
	log.Fatal(app.Listen(":8090"))
}
