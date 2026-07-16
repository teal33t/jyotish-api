package handler

import (
	"net/http"

	"mobile-app-backend/model"
	"mobile-app-backend/store"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type Handler struct {
	store *store.MongoStore
	redis *redis.Client
}

func NewHandler(s *store.MongoStore, redisClient *redis.Client) *Handler {
	return &Handler{store: s, redis: redisClient}
}

// Register godoc
// @Summary      Register a new user
// @Description  Create a new user account with email and password
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        request  body      model.RegisterRequest  true  "Register request"
// @Success      201      {object}  model.AuthResponse
// @Failure      400      {object}  map[string]interface{}
// @Failure      409      {object}  map[string]interface{}
// @Failure      500      {object}  map[string]interface{}
// @Router       /register [post]
func (h *Handler) Register(c *gin.Context) {
	var req model.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "validation_error",
			"message": "Invalid request body: " + err.Error(),
		})
		return
	}

	hashedPassword, err := store.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "internal_error",
			"message": "Failed to process registration",
		})
		return
	}

	user := &model.User{
		Email:    req.Email,
		Password: hashedPassword,
	}

	created := h.store.CreateUser(user)
	if created == nil {
		c.JSON(http.StatusConflict, gin.H{
			"error":   "email_exists",
			"message": "Email already registered",
		})
		return
	}

	token, err := store.SignToken(created.ID, created.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "token_error",
			"message": "Failed to generate token",
		})
		return
	}
	c.JSON(http.StatusCreated, model.AuthResponse{
		ID:    created.ID,
		Email: created.Email,
		Token: token,
	})
}

// Login godoc
// @Summary      Login user
// @Description  Authenticate user with email and password, returns JWT token
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        request  body      model.LoginRequest  true  "Login request"
// @Success      200      {object}  model.AuthResponse
// @Failure      400      {object}  map[string]interface{}
// @Failure      401      {object}  map[string]interface{}
// @Failure      500      {object}  map[string]interface{}
// @Router       /login [post]
func (h *Handler) Login(c *gin.Context) {
	var req model.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "validation_error",
			"message": "Invalid request body: " + err.Error(),
		})
		return
	}

	user := h.store.FindUserByEmail(req.Email)
	if user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "invalid_credentials",
			"message": "Invalid email or password",
		})
		return
	}

	if err := store.ComparePassword(user.Password, req.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "invalid_credentials",
			"message": "Invalid email or password",
		})
		return
	}

	token, err := store.SignToken(user.ID, user.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "token_error",
			"message": "Failed to generate token",
		})
		return
	}
	c.JSON(http.StatusOK, model.AuthResponse{
		ID:    user.ID,
		Email: user.Email,
		Token: token,
	})
}
