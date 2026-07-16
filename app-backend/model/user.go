package model

import "time"

type User struct {
	ID        uint      `json:"id" bson:"_id"`
	Email     string    `json:"email" binding:"required,email" bson:"email"`
	Password  string    `json:"-" binding:"required,min=6" bson:"password"`
	CreatedAt time.Time `json:"-" bson:"created_at"`
}

type AuthResponse struct {
	ID    uint   `json:"id"`
	Email string `json:"email"`
	Token string `json:"token"`
}

type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}
