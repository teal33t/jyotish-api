package main

import (
	"context"
	"fmt"
	"os"

	_ "mobile-app-backend/docs"
	"mobile-app-backend/handler"
	"mobile-app-backend/middleware"
	"mobile-app-backend/store"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title           Jyotish API
// @version         1.0
// @description     Jyotish API for managing users and kundali charts
// @host            localhost:5656
// @BasePath       /api/v1
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	mongoStore, err := store.NewMongoStore(mongoURI)
	if err != nil {
		fmt.Printf("Failed to connect to MongoDB: %v\n", err)
		os.Exit(1)
	}

	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://localhost:6379"
	}

	redisOpts, err := redis.ParseURL(redisURL)
	if err != nil {
		fmt.Printf("Failed to parse REDIS_URL: %v\n", err)
		os.Exit(1)
	}

	redisClient := redis.NewClient(redisOpts)
	if err := redisClient.Ping(context.Background()).Err(); err != nil {
		fmt.Printf("Failed to connect to Redis: %v\n", err)
		os.Exit(1)
	}

	h := handler.NewHandler(mongoStore, redisClient)

	router := gin.Default()

	v1 := router.Group("/api/v1")

	v1.Use(middleware.CORSMiddleware())

	v1.POST("/login", h.Login)
	v1.POST("/register", h.Register)

	protected := v1.Group("")
	protected.Use(middleware.AuthMiddleware())
	protected.POST("/save-kundali", h.SaveKundali)
	protected.GET("/list-kundali", h.ListKundali)
	protected.GET("/all-kundali", h.ListAllKundali)

	router.GET("/api/v1/geolocation/search", h.SearchPlaces)
	router.GET("/api/v1/timezone/search", h.SearchTimezone)

	router.GET("/swagger/*any", ginSwagger.CustomWrapHandler(&ginSwagger.Config{
		URL: "/swagger/doc.json",
	}, swaggerFiles.Handler))

	fmt.Println("Server running on :5656")
	if err := router.Run(":5656"); err != nil {
		fmt.Printf("Server failed: %v\n", err)
	}
}
