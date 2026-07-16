package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"mobile-app-backend/model"

	"github.com/gin-gonic/gin"
)

// SaveKundali godoc
// @Summary      Save kundali chart
// @Description  Save a kundali chart for the authenticated user
// @Tags         kundali
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request  body      model.Kundli  true  "Kundali chart data"
// @Success      201      {object}  map[string]interface{}
// @Failure      400      {object}  map[string]interface{}
// @Failure      401      {object}  map[string]interface{}
// @Failure      500      {object}  map[string]interface{}
// @Router       /save-kundali [post]
func (h *Handler) SaveKundali(c *gin.Context) {
	rawID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "unauthorized",
			"message": "Missing user context",
		})
		return
	}

	userID := rawID.(uint)

	var kundali model.Kundli
	if err := c.ShouldBindJSON(&kundali); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "validation_error",
			"message": "Invalid kundli JSON: " + err.Error(),
		})
		return
	}

	kundaliBytes, err := json.Marshal(kundali)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "serialization_error",
			"message": "Failed to serialize kundli",
		})
		return
	}

	meta := &model.KundaliSave{}

	saved := h.store.CreateKundaliForUser(userID, meta)
	if saved == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "store_error",
			"message": "Failed to create kundali record",
		})
		return
	}

	fileName := fmt.Sprintf("%d.json", saved.ID)
	if err := h.store.SaveKundaliData(saved.ID, kundaliBytes); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "file_write_error",
			"message": "Failed to save kundli file",
		})
		return
	}

	h.store.UpdateKundaliFile(saved.ID, fileName)

	c.JSON(http.StatusCreated, gin.H{
		"id":        saved.ID,
		"user_id":   saved.UserID,
		"file":      fileName,
		"created_at": saved.CreatedAt,
	})
}

// ListKundali godoc
// @Summary      List user kundalis
// @Description  Get all kundali charts for the authenticated user
// @Tags         kundali
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Success      200      {object}  map[string]interface{}
// @Failure      401      {object}  map[string]interface{}
// @Router       /list-kundali [get]
func (h *Handler) ListKundali(c *gin.Context) {
	rawID, _ := c.Get("user_id")
	userID := rawID.(uint)

	records := h.store.FindKundaliByUserID(userID)
	c.JSON(http.StatusOK, gin.H{
		"data":  records,
		"count": len(records),
	})
}

// ListAllKundali godoc
// @Summary      List all kundalis
// @Description  Get all kundali charts across all users
// @Tags         kundali
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Success      200      {object}  map[string]interface{}
// @Failure      401      {object}  map[string]interface{}
// @Router       /all-kundali [get]
func (h *Handler) ListAllKundali(c *gin.Context) {
	records := h.store.AllKundali()
	c.JSON(http.StatusOK, gin.H{
		"data":  records,
		"count": len(records),
	})
}
