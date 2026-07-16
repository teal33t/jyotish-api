package handler

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

const nominatimBaseURL = "https://nominatim.openstreetmap.org"
const placesCacheTTL = 24 * time.Hour

type nominatimPlace struct {
	PlaceID     int64  `json:"place_id"`
	DisplayName string `json:"display_name"`
	Lat         string `json:"lat"`
	Lon         string `json:"lon"`
}

// PlaceOption is the normalized shape returned by SearchPlaces.
type PlaceOption struct {
	Value     string `json:"value"`
	Label     string `json:"label"`
	Latitude  string `json:"latitude"`
	Longitude string `json:"longitude"`
}

// SearchPlaces godoc
// @Summary      Search places via Nominatim
// @Description  Proxy to OpenStreetMap Nominatim search API, normalized to {value, label, latitude, longitude}
// @Tags         geolocation
// @Accept       json
// @Produce      json
// @Param        q             query     string  true   "Place name query"
// @Param        limit         query     int     false  "Max results (default 5)"
// @Param        addressdetails query    int     false  "Include address details (default 1)"
// @Param        format        query     string  false  "Response format (default json)"
// @Success      200           {object}  []PlaceOption
// @Failure      400           {object}  map[string]interface{}
// @Failure      502           {object}  map[string]interface{}
// @Router       /geolocation/search [get]
func (h *Handler) SearchPlaces(c *gin.Context) {
	q := c.Query("q")
	if q == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "validation_error",
			"message": "Query parameter 'q' is required",
		})
		return
	}

	params := url.Values{}
	params.Set("q", q)
	params.Set("format", c.DefaultQuery("format", "json"))
	params.Set("addressdetails", c.DefaultQuery("addressdetails", "1"))

	if limit := c.Query("limit"); limit != "" {
		params.Set("limit", limit)
	}

	cacheKey := "places:search:" + params.Encode()

	ctx := c.Request.Context()
	if cached, err := h.redis.Get(ctx, cacheKey).Bytes(); err == nil {
		c.Header("Content-Type", "application/json")
		c.Header("X-Cache", "HIT")
		c.Data(http.StatusOK, "application/json", cached)
		return
	}

	targetURL := nominatimBaseURL + "/search?" + params.Encode()

	req, err := http.NewRequest(http.MethodGet, targetURL, nil)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "request_error",
			"message": "Failed to create request: " + err.Error(),
		})
		return
	}

	req.Header.Set("User-Agent", "JyotishApp/1.0 (mobile-app)")
	req.Header.Set("Accept", "application/json")

	client := &http.Client{Timeout: http.DefaultClient.Timeout}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error":   "upstream_error",
			"message": "Failed to fetch from Nominatim: " + err.Error(),
		})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error":   "upstream_error",
			"message": "Failed to read Nominatim response: " + err.Error(),
		})
		return
	}

	if resp.StatusCode != http.StatusOK {
		c.Header("Content-Type", "application/json")
		c.Header("X-Cache", "MISS")
		c.Data(resp.StatusCode, "application/json", body)
		return
	}

	var rawPlaces []nominatimPlace
	if err := json.Unmarshal(body, &rawPlaces); err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error":   "upstream_error",
			"message": "Failed to parse Nominatim response: " + err.Error(),
		})
		return
	}

	places := make([]PlaceOption, 0, len(rawPlaces))
	for _, p := range rawPlaces {
		if p.PlaceID == 0 || p.DisplayName == "" || p.Lat == "" || p.Lon == "" {
			continue
		}
		places = append(places, PlaceOption{
			Value:     strconv.FormatInt(p.PlaceID, 10),
			Label:     p.DisplayName,
			Latitude:  p.Lat,
			Longitude: p.Lon,
		})
	}

	respBody, err := json.Marshal(places)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "encoding_error",
			"message": "Failed to encode response: " + err.Error(),
		})
		return
	}

	cacheCtx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	h.redis.Set(cacheCtx, cacheKey, respBody, placesCacheTTL)

	c.Header("Content-Type", "application/json")
	c.Header("X-Cache", "MISS")
	c.Data(http.StatusOK, "application/json", respBody)
}
