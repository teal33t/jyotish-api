package store

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"os"
	"strings"
	"time"

	"mobile-app-backend/model"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

type MongoStore struct {
	client     *mongo.Client
	db         *mongo.Database
	usersColl  *mongo.Collection
	kundaliColl *mongo.Collection
}

func NewMongoStore(uri string) (*MongoStore, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		return nil, fmt.Errorf("failed to connect to mongodb: %w", err)
	}

	if err := client.Ping(ctx, nil); err != nil {
		return nil, fmt.Errorf("failed to ping mongodb: %w", err)
	}

	db := client.Database("jyotish")

	s := &MongoStore{
		client:      client,
		db:          db,
		usersColl:   db.Collection("users"),
		kundaliColl: db.Collection("kundalis"),
	}

	return s, nil
}

func (s *MongoStore) nextUserID() (uint, error) {
	return s.nextID("users")
}

func (s *MongoStore) nextKundaliID() (uint, error) {
	return s.nextID("kundalis")
}

func (s *MongoStore) nextID(collName string) (uint, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	coll := s.db.Collection("counters")
	var result struct {
		Seq uint `bson:"seq"`
	}
	err := coll.FindOneAndUpdate(
		ctx,
		bson.M{"_id": collName},
		bson.M{"$inc": bson.M{"seq": 1}},
		options.FindOneAndUpdate().SetReturnDocument(options.After),
	).Decode(&result)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			_, err = coll.InsertOne(ctx, bson.M{"_id": collName, "seq": 1})
			if err != nil {
				return 0, err
			}
			return 1, nil
		}
		return 0, err
	}

	if result.Seq == 0 {
		return 1, nil
	}
	return result.Seq, nil
}

func (s *MongoStore) CreateUser(u *model.User) *model.User {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var existing model.User
	err := s.usersColl.FindOne(ctx, bson.M{"email": u.Email}).Decode(&existing)
	if err == nil {
		return nil
	}

	id, err := s.nextUserID()
	if err != nil {
		fmt.Printf("failed to generate user id: %v\n", err)
		return nil
	}

	u.ID = id
	u.CreatedAt = time.Now()

	_, err = s.usersColl.InsertOne(ctx, u)
	if err != nil {
		fmt.Printf("failed to insert user: %v\n", err)
		return nil
	}

	return u
}

func (s *MongoStore) FindUserByID(id uint) *model.User {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user model.User
	err := s.usersColl.FindOne(ctx, bson.M{"_id": id}).Decode(&user)
	if err != nil {
		return nil
	}
	return &user
}

func (s *MongoStore) FindUserByEmail(email string) *model.User {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user model.User
	err := s.usersColl.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		return nil
	}
	return &user
}

func (s *MongoStore) CreateKundaliForUser(userID uint, k *model.KundaliSave) *model.KundaliSave {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	id, err := s.nextKundaliID()
	if err != nil {
		fmt.Printf("failed to generate kundali id: %v\n", err)
		return nil
	}

	k.ID = id
	k.UserID = userID
	k.CreatedAt = time.Now()

	_, err = s.kundaliColl.InsertOne(ctx, k)
	if err != nil {
		fmt.Printf("failed to insert kundali: %v\n", err)
		return nil
	}

	return k
}

func (s *MongoStore) SaveKundaliData(id uint, data []byte) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := s.kundaliColl.UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.M{"$set": bson.M{"data": string(data)}},
	)
	return err
}

func (s *MongoStore) UpdateKundaliFile(id uint, fileName string) {
}

func (s *MongoStore) LoadKundaliData(id uint) (*model.KundaliSave, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var result model.KundaliSave
	err := s.kundaliColl.FindOne(ctx, bson.M{"_id": id}).Decode(&result)
	if err != nil {
		return nil, fmt.Errorf("kundali not found: %d", id)
	}
	return &result, nil
}

func (s *MongoStore) FindKundaliByUserID(userID uint) []model.KundaliSave {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := s.kundaliColl.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		return []model.KundaliSave{}
	}
	defer cursor.Close(ctx)

	var result []model.KundaliSave
	if err := cursor.All(ctx, &result); err != nil {
		return []model.KundaliSave{}
	}
	if result == nil {
		return []model.KundaliSave{}
	}
	return result
}

func (s *MongoStore) AllKundali() []model.KundaliSave {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := s.kundaliColl.Find(ctx, bson.M{})
	if err != nil {
		return []model.KundaliSave{}
	}
	defer cursor.Close(ctx)

	var result []model.KundaliSave
	if err := cursor.All(ctx, &result); err != nil {
		return []model.KundaliSave{}
	}
	if result == nil {
		return []model.KundaliSave{}
	}
	return result
}

func HashPassword(password string) (string, error) {
	b, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

func ComparePassword(hashed, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashed), []byte(password))
}

func GenerateToken() (string, error) {
	buf := make([]byte, 16)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}
	return hex.EncodeToString(buf), nil
}

func jwtSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if strings.TrimSpace(secret) == "" {
		return []byte("changeme")
	}
	return []byte(secret)
}

func SignToken(userID uint, email string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"email":   email,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
		"iat":     time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret())
}

func VerifyToken(tokenString string) (uint, error) {
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return jwtSecret(), nil
	})

	if err != nil || !token.Valid {
		return 0, fmt.Errorf("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return 0, fmt.Errorf("invalid token claims")
	}

	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		return 0, fmt.Errorf("invalid user_id in token")
	}

	return uint(userIDFloat), nil
}
